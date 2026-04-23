"""
Serviço de Pagamento PIX — Integração Real com Mercado Pago API v1
Documentação oficial: https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post

Fluxo:
  1. Frontend chama POST /api/v1/pagamentos/assinar
  2. Este service gera o pagamento PIX na API do MP
  3. MP retorna QR Code (base64) + código copia-e-cola
  4. Usuária paga via app do banco
  5. MP envia webhook para POST /api/v1/pagamentos/webhook
  6. Webhook consulta GET /v1/payments/{id} para confirmar status
  7. Transação é atualizada para APPROVED no nosso banco
"""

import httpx
import uuid
import logging
from typing import Dict, Any, Optional
from datetime import datetime

from config import settings

logger = logging.getLogger(__name__)

# ─── Constantes ──────────────────────────────────────────────────────────────
MP_API_BASE = "https://api.mercadopago.com"
MP_PAYMENTS_URL = f"{MP_API_BASE}/v1/payments"

# Planos disponíveis com valores em centavos
PLANOS = {
    "acesso_gratuito": {"valor_centavos": 0, "descricao": "O Legado — Acesso Gratuito (Campanha 200 vagas)"},
    "base_mensal": {"valor_centavos": 4900, "descricao": "O Legado — Plano Base Mensal"},
    "membro_anual": {"valor_centavos": 50000, "descricao": "O Legado — Membro Fundador Anual"},
    "doacao_livre": {"valor_centavos": None, "descricao": "O Legado — Doação Voluntária"},
}

# Tempo de expiração do QR Code PIX em minutos
PIX_EXPIRATION_MINUTES = 30


def _get_headers(idempotency_key: str) -> Dict[str, str]:
    """Retorna os headers padrão para chamadas à API do Mercado Pago."""
    return {
        "Authorization": f"Bearer {settings.MP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotency_key,
    }


def _is_configured() -> bool:
    """Verifica se o ACCESS_TOKEN do MP está configurado com um valor real."""
    token = settings.MP_ACCESS_TOKEN
    if not token:
        return False
    # Detecta tokens de placeholder/mock
    placeholders = ["APP_USR-123456789", "TEST-DUMMY", "sandbox-token", "None", ""]
    return not any(p in token for p in placeholders)


async def gerar_pix_pagamento(
    valor_centavos: int,
    email_usuario: str,
    transacao_id: str,
    descricao: Optional[str] = None,
    nome_pagador: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Gera um pagamento PIX via API do Mercado Pago.

    Args:
        valor_centavos: Valor em centavos (ex: 4900 = R$ 49,00)
        email_usuario: Email do pagador (obrigatório pelo MP)
        transacao_id: UUID da transação interna (usado como X-Idempotency-Key)
        descricao: Descrição customizada do pagamento
        nome_pagador: Nome do pagador (opcional, melhora a aprovação)

    Returns:
        Dict com os dados do pagamento criado no MP, incluindo QR Code PIX

    Raises:
        PaymentError: Se a API do MP retornar erro
    """
    # ─── Se o token não está configurado, retorna MOCK para dev local ─────
    if not _is_configured():
        logger.warning("⚠️  MP_ACCESS_TOKEN não configurado — usando MOCK de pagamento PIX")
        return _gerar_mock_response(transacao_id)

    # ─── Payload real para a API do Mercado Pago ───────────────────────────
    valor_reais = valor_centavos / 100.0

    payload = {
        "transaction_amount": valor_reais,
        "description": descricao or "O Legado — Membro Fundador",
        "payment_method_id": "pix",
        "payer": {
            "email": email_usuario,
        },
        # Dados adicionais para rastreio
        "external_reference": transacao_id,
        "notification_url": f"{settings.BACKEND_URL}/api/v1/pagamentos/webhook",
    }

    # Adiciona o nome do pagador se disponível (melhora taxa de aprovação)
    if nome_pagador:
        partes = nome_pagador.strip().split(" ", 1)
        payload["payer"]["first_name"] = partes[0]
        if len(partes) > 1:
            payload["payer"]["last_name"] = partes[1]

    headers = _get_headers(idempotency_key=transacao_id)

    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.post(MP_PAYMENTS_URL, headers=headers, json=payload)

            # Log do status para debugging
            logger.info(f"📦 MP Response Status: {response.status_code} para transacao {transacao_id}")

            if response.status_code in (200, 201):
                data = response.json()
                logger.info(
                    f"✅ PIX criado com sucesso — MP ID: {data.get('id')}, "
                    f"Status: {data.get('status')}, "
                    f"Valor: R$ {valor_reais:.2f}"
                )
                return data

            # Trata erros específicos do MP
            error_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
            error_msg = error_data.get("message", response.text[:200])
            error_cause = error_data.get("cause", [])

            logger.error(
                f"❌ Erro MP API [{response.status_code}]: {error_msg} | "
                f"Causes: {error_cause} | Transacao: {transacao_id}"
            )

            raise PaymentError(
                status_code=response.status_code,
                message=error_msg,
                mp_cause=error_cause,
            )

        except httpx.TimeoutException:
            logger.error(f"⏱️ Timeout ao chamar MP API para transacao {transacao_id}")
            raise PaymentError(status_code=408, message="Timeout na comunicação com Mercado Pago")

        except httpx.ConnectError as e:
            logger.error(f"🔌 Erro de conexão com MP API: {str(e)}")
            raise PaymentError(status_code=503, message="Não foi possível conectar ao Mercado Pago")


async def consultar_pagamento(payment_id: str) -> Dict[str, Any]:
    """
    Consulta o status de um pagamento na API do Mercado Pago.
    Usado pelo webhook para verificar se o pagamento foi realmente aprovado.

    Args:
        payment_id: ID do pagamento no Mercado Pago

    Returns:
        Dict com os dados completos do pagamento
    """
    if not _is_configured():
        logger.warning("⚠️  MP_ACCESS_TOKEN não configurado — retornando mock de consulta")
        return {"id": payment_id, "status": "approved", "external_reference": "mock"}

    url = f"{MP_PAYMENTS_URL}/{payment_id}"
    headers = {
        "Authorization": f"Bearer {settings.MP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(url, headers=headers)

            if response.status_code == 200:
                data = response.json()
                logger.info(
                    f"📋 Consulta MP Payment {payment_id}: "
                    f"status={data.get('status')}, "
                    f"status_detail={data.get('status_detail')}"
                )
                return data

            logger.error(f"❌ Erro ao consultar pagamento {payment_id}: HTTP {response.status_code}")
            raise PaymentError(
                status_code=response.status_code,
                message=f"Erro ao consultar pagamento: HTTP {response.status_code}"
            )

        except httpx.TimeoutException:
            logger.error(f"⏱️ Timeout ao consultar pagamento {payment_id}")
            raise PaymentError(status_code=408, message="Timeout ao consultar pagamento")


def mapear_status_mp(status_mp: str) -> str:
    """
    Mapeia o status do Mercado Pago para o status interno do nosso banco.

    Status do MP:
        - pending: Aguardando pagamento
        - approved: Pago e aprovado
        - authorized: Autorizado (pré-captura)
        - in_process: Em análise
        - in_mediation: Em disputa
        - rejected: Rejeitado
        - cancelled: Cancelado
        - refunded: Devolvido
        - charged_back: Chargeback

    Status interno:
        - PENDING, APPROVED, REJECTED, REFUNDED, CANCELLED
    """
    mapa = {
        "pending": "PENDING",
        "approved": "APPROVED",
        "authorized": "APPROVED",
        "in_process": "PENDING",
        "in_mediation": "PENDING",
        "rejected": "REJECTED",
        "cancelled": "CANCELLED",
        "refunded": "REFUNDED",
        "charged_back": "REFUNDED",
    }
    return mapa.get(status_mp, "PENDING")


# ─── Mock para desenvolvimento local ────────────────────────────────────────

def _gerar_mock_response(transacao_id: str) -> Dict[str, Any]:
    """Gera resposta mock idêntica à do Mercado Pago para testes locais."""
    mock_id = f"mock_{uuid.uuid4().hex[:12]}"
    return {
        "id": mock_id,
        "status": "pending",
        "status_detail": "pending_waiting_transfer",
        "transaction_amount": 49.00,
        "currency_id": "BRL",
        "payment_method_id": "pix",
        "external_reference": transacao_id,
        "date_created": datetime.utcnow().isoformat(),
        "date_of_expiration": None,
        "point_of_interaction": {
            "transaction_data": {
                "qr_code_base64": (
                    "iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAIAAAAHjs1qAAAA"
                    "CXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wQVFBQUFBQU"
                    "FBQUFBQUAAAA"  # Placeholder - QR Code mock curto
                ),
                "qr_code": (
                    "00020126580014br.gov.bcb.pix0136"
                    f"{uuid.uuid4()}"
                    "5204000053039865802BR5925O LEGADO PLATAFORMA LTDA"
                    "6009SAO PAULO62070503***6304"
                ),
                "ticket_url": f"https://www.mercadopago.com.br/payments/{mock_id}/ticket",
            }
        },
        "_mock": True,  # Flag para identificar que é mock
    }


# ─── Exceção customizada ────────────────────────────────────────────────────

class PaymentError(Exception):
    """Exceção específica para erros de pagamento."""

    def __init__(self, status_code: int, message: str, mp_cause: list = None):
        self.status_code = status_code
        self.message = message
        self.mp_cause = mp_cause or []
        super().__init__(self.message)
