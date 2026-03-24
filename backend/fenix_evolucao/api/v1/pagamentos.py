from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import uuid

from api.deps import get_current_user, get_db
from models.usuario_pai import UsuarioPai
from models.transacao import Transacao
from services.payment_service import gerar_pix_pagamento

router = APIRouter()

class AssinarRequest(BaseModel):
    plano: str # 'base_mensal', 'membro_anual'

@router.post("/assinar")
async def assinar_plano(
    request: AssinarRequest,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    valor_centavos = 50000 if request.plano == "membro_anual" else 4900
    
    # 1. Cria a Transação no Banco (PENDING)
    nova_transacao = Transacao(
        usuario_id=current_user.id,
        valor_centavos=valor_centavos,
        metodo="PIX",
        plano=request.plano
    )
    db.add(nova_transacao)
    await db.commit()
    await db.refresh(nova_transacao)
    
    # 2. Chama o Mercado Pago
    try:
        mp_response = await gerar_pix_pagamento(
            valor_centavos=valor_centavos,
            email_usuario=current_user.email,
            transacao_id=str(nova_transacao.id)
        )
        
        # 3. Atualiza o Gateway ID
        nova_transacao.gateway_id = str(mp_response.get("id"))
        await db.commit()
        
        pix_data = mp_response.get("point_of_interaction", {}).get("transaction_data", {})
        
        return {
            "transacao_id": nova_transacao.id,
            "status": nova_transacao.status,
            "qr_code_base64": pix_data.get("qr_code_base64"),
            "qr_code_copia_cola": pix_data.get("qr_code")
        }
    except Exception as e:
        nova_transacao.status = "FAILED"
        await db.commit()
        raise HTTPException(status_code=500, detail="Erro ao gerar PIX: " + str(e))

@router.post("/webhook")
async def pagamento_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Recebe notificações do Mercado Pago via POST"""
    # Exemplo de payload IPN/Webhooks nativo do MP:
    # {"action": "payment.created", "data": {"id": "123456789"}}
    payload = await request.json()
    action = payload.get("action")
    
    if action and "payment" in action:
        # A lógica real chamaria GET /v1/payments/{payment_id} para ver o novo 'status'
        payment_id = str(payload.get("data", {}).get("id"))
        print(f"✅ Webhook Recebido para Pagamento MP: {payment_id} -> Atualizando Transacao...")
        
        # Simulando aprovação no banco (exigiria statement SELECT onde gateway_id=payment_id)
        # return {"status": "success"}

    return {"status": "ok"}
