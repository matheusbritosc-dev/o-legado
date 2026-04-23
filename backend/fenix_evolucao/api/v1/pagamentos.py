"""
Rotas de Pagamento — PIX via Mercado Pago
Endpoints:
  POST /api/v1/pagamentos/assinar     → Gera QR Code PIX para assinatura
  POST /api/v1/pagamentos/webhook     → Recebe notificações do MP e atualiza transação
  GET  /api/v1/pagamentos/status/{id} → Consulta status de uma transação
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from typing import Optional
import logging

from api.deps import get_current_user, get_db
from models.usuario_pai import UsuarioPai
from models.transacao import Transacao
from services.payment_service import (
    gerar_pix_pagamento,
    consultar_pagamento,
    mapear_status_mp,
    PaymentError,
    PLANOS,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# ─── Schemas de Request/Response ─────────────────────────────────────────────

class AssinarRequest(BaseModel):
    plano: str  # 'base_mensal', 'membro_anual', 'doacao_livre'
    valor_customizado_centavos: Optional[int] = None  # Só pra doação livre

class PixResponse(BaseModel):
    transacao_id: str
    status: str
    qr_code_base64: Optional[str] = None
    qr_code_copia_cola: Optional[str] = None
    ticket_url: Optional[str] = None
    valor_reais: float
    plano: str
    is_mock: bool = False


# ─── POST /assinar → Gera QR Code PIX ───────────────────────────────────────

@router.post("/assinar", response_model=PixResponse)
async def assinar_plano(
    request: AssinarRequest,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Gera um pagamento PIX para a assinatura de um plano.
    O QR Code e o código copia-e-cola são retornados para a usuária pagar.
    """
    # 1. Valida o plano escolhido
    plano_info = PLANOS.get(request.plano)
    if not plano_info:
        raise HTTPException(
            status_code=400,
            detail=f"Plano inválido: '{request.plano}'. Opções: {list(PLANOS.keys())}",
        )

    # Determina o valor
    if request.plano == "doacao_livre":
        if not request.valor_customizado_centavos or request.valor_customizado_centavos < 100:
            raise HTTPException(status_code=400, detail="Doação mínima é de R$ 1,00 (100 centavos)")
        valor_centavos = request.valor_customizado_centavos
    else:
        valor_centavos = plano_info["valor_centavos"]

    if valor_centavos == 0:
        raise HTTPException(status_code=400, detail="Plano gratuito não requer pagamento PIX.")

    # 2. Cria a Transação no Banco (PENDING)
    nova_transacao = Transacao(
        usuario_id=current_user.id,
        valor_centavos=valor_centavos,
        metodo="PIX",
        plano=request.plano,
    )
    db.add(nova_transacao)
    await db.commit()
    await db.refresh(nova_transacao)

    logger.info(f"💳 Transação {nova_transacao.id} criada — Plano: {request.plano}, Valor: R$ {valor_centavos/100:.2f}")

    # 3. Gera o PIX no Mercado Pago
    try:
        mp_response = await gerar_pix_pagamento(
            valor_centavos=valor_centavos,
            email_usuario=current_user.email,
            transacao_id=str(nova_transacao.id),
            descricao=plano_info["descricao"],
            nome_pagador=current_user.nome,
        )

        # 4. Atualiza com o ID do Mercado Pago
        nova_transacao.gateway_id = str(mp_response.get("id"))
        nova_transacao.metadata_json = {
            "mp_status": mp_response.get("status"),
            "mp_status_detail": mp_response.get("status_detail"),
            "mp_date_created": mp_response.get("date_created"),
        }
        await db.commit()

        # 5. Extrai dados do PIX para o frontend
        pix_data = mp_response.get("point_of_interaction", {}).get("transaction_data", {})

        return PixResponse(
            transacao_id=str(nova_transacao.id),
            status=nova_transacao.status,
            qr_code_base64=pix_data.get("qr_code_base64"),
            qr_code_copia_cola=pix_data.get("qr_code"),
            ticket_url=pix_data.get("ticket_url"),
            valor_reais=valor_centavos / 100.0,
            plano=request.plano,
            is_mock=bool(mp_response.get("_mock")),
        )

    except PaymentError as e:
        nova_transacao.status = "FAILED"
        nova_transacao.metadata_json = {"error": e.message, "mp_cause": e.mp_cause}
        await db.commit()
        logger.error(f"❌ Falha ao gerar PIX para transacao {nova_transacao.id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=f"Erro no Mercado Pago: {e.message}")

    except Exception as e:
        nova_transacao.status = "FAILED"
        await db.commit()
        logger.error(f"❌ Erro inesperado ao gerar PIX para transacao {nova_transacao.id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno ao processar pagamento")


# ─── POST /webhook → Recebe notificações do Mercado Pago ────────────────────

@router.post("/webhook")
async def pagamento_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
    # MP pode enviar query params type e data.id também
    type: Optional[str] = Query(None),
    data_id: Optional[str] = Query(None, alias="data.id"),
):
    """
    Webhook que recebe notificações do Mercado Pago quando o status de um pagamento muda.

    O MP pode enviar dois formatos:
    1. POST com JSON body: {"action": "payment.updated", "data": {"id": "123456"}}
    2. POST com query params: ?type=payment&data.id=123456

    Em AMBOS os casos, consultamos GET /v1/payments/{id} para verificar o status real,
    nunca confiando apenas no payload do webhook (segurança contra spoofing).
    """
    # Tenta extrair o payment_id do body ou dos query params
    payment_id = None

    try:
        body = await request.json()
        logger.info(f"📬 Webhook recebido — Body: {body}")

        action = body.get("action", "")
        payment_id = str(body.get("data", {}).get("id", ""))

        # Ignora notificações que não são de pagamento
        if action and "payment" not in action:
            logger.info(f"ℹ️  Webhook ignorado — action: {action}")
            return {"status": "ignored", "reason": f"action '{action}' não é de pagamento"}
    except Exception:
        # Se o body não é JSON, tenta os query params
        logger.info(f"📬 Webhook recebido via query params — type: {type}, data.id: {data_id}")
        if type == "payment" and data_id:
            payment_id = data_id

    if not payment_id or payment_id == "None":
        logger.warning("⚠️  Webhook recebido sem payment_id válido")
        return {"status": "ignored", "reason": "no payment_id"}

    # ─── Consulta o pagamento REAL na API do MP (nunca confia só no webhook) ─
    try:
        mp_payment = await consultar_pagamento(payment_id)
    except PaymentError as e:
        logger.error(f"❌ Não foi possível verificar pagamento {payment_id}: {e.message}")
        # Retorna 200 para o MP não reenviar infinitamente
        return {"status": "error", "reason": e.message}

    mp_status = mp_payment.get("status", "unknown")
    status_interno = mapear_status_mp(mp_status)
    external_ref = mp_payment.get("external_reference", "")

    logger.info(
        f"📋 Webhook processando — MP Payment {payment_id}: "
        f"status_mp={mp_status} → status_interno={status_interno}, "
        f"external_ref={external_ref}"
    )

    # ─── Busca a transação no nosso banco pelo gateway_id OU external_reference ─
    result = await db.execute(
        select(Transacao).where(
            (Transacao.gateway_id == payment_id) |
            (Transacao.id == external_ref if _is_valid_uuid(external_ref) else Transacao.gateway_id == payment_id)
        )
    )
    transacao = result.scalar_one_or_none()

    if not transacao:
        logger.warning(f"⚠️  Transação não encontrada para MP Payment {payment_id} (ref: {external_ref})")
        return {"status": "not_found", "payment_id": payment_id}

    # ─── Atualiza o status da transação ──────────────────────────────────────
    status_anterior = transacao.status
    transacao.status = status_interno
    transacao.gateway_id = payment_id  # Garante que o gateway_id está correto
    transacao.metadata_json = {
        **(transacao.metadata_json or {}),
        "mp_status": mp_status,
        "mp_status_detail": mp_payment.get("status_detail"),
        "mp_date_approved": mp_payment.get("date_approved"),
        "mp_fee_details": mp_payment.get("fee_details"),
        "webhook_processed_at": __import__("datetime").datetime.utcnow().isoformat(),
    }
    await db.commit()

    logger.info(
        f"✅ Transação {transacao.id} atualizada: {status_anterior} → {status_interno} "
        f"(MP Payment: {payment_id})"
    )

    # ─── Se aprovado, poderia disparar ações adicionais ──────────────────────
    if status_interno == "APPROVED" and status_anterior != "APPROVED":
        logger.info(f"🎉 PAGAMENTO APROVADO! Transação {transacao.id} — Usuária {transacao.usuario_id}")
        # TODO: Aqui você pode:
        # - Enviar email/WhatsApp de confirmação
        # - Ativar o plano da usuária
        # - Disparar evento de gamificação

    return {
        "status": "processed",
        "transacao_id": str(transacao.id),
        "status_anterior": status_anterior,
        "status_novo": status_interno,
    }


# ─── GET /status/{transacao_id} → Consulta status local ─────────────────────

@router.get("/status/{transacao_id}")
async def consultar_status_transacao(
    transacao_id: str,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Consulta o status de uma transação. Usado pelo frontend para polling
    enquanto a usuária escaneia o QR Code PIX.
    """
    result = await db.execute(
        select(Transacao).where(
            Transacao.id == transacao_id,
            Transacao.usuario_id == current_user.id,
        )
    )
    transacao = result.scalar_one_or_none()

    if not transacao:
        raise HTTPException(status_code=404, detail="Transação não encontrada")

    return {
        "transacao_id": str(transacao.id),
        "status": transacao.status,
        "valor_reais": transacao.valor_centavos / 100.0,
        "plano": transacao.plano,
        "metodo": transacao.metodo,
        "gateway_id": transacao.gateway_id,
        "metadata": transacao.metadata_json,
    }


# ─── Utilidades ──────────────────────────────────────────────────────────────

def _is_valid_uuid(val: str) -> bool:
    """Verifica se uma string é um UUID válido."""
    try:
        import uuid as _uuid
        _uuid.UUID(val)
        return True
    except (ValueError, AttributeError):
        return False
