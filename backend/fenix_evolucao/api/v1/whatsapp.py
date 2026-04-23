from fastapi import APIRouter, Request, Response, Query
import logging
import os

logger = logging.getLogger(__name__)
router = APIRouter()

# O token que você vai colocar no painel da Meta:
VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "protocolo_corrente_invisivel_2026")

from fastapi.responses import PlainTextResponse

@router.get("/webhook")
async def verify_webhook(
    request: Request,
    mode: str | None = Query(None, alias="hub.mode"),
    hub_mode: str | None = None,
    token: str | None = Query(None, alias="hub.verify_token"),
    hub_verify_token: str | None = None,
    challenge: str | None = Query(None, alias="hub.challenge"),
    hub_challenge: str | None = None
):
    """
    Endpoint obrigatório para validação inicial da Meta (WhatsApp Cloud API).
    A Meta envia um GET com hub.mode, hub.verify_token e hub.challenge.
    Se o token bater, retornamos o challenge em texto puro (HTTP 200).
    """
    final_mode = mode or hub_mode
    final_token = token or hub_verify_token
    final_challenge = challenge or hub_challenge

    if final_mode == "subscribe" and final_token == VERIFY_TOKEN and final_challenge:
        logger.info("✅ Webhook da Meta verificado com sucesso!")
        return PlainTextResponse(content=final_challenge, status_code=200)
    
    logger.warning("❌ Tentativa falha de verificação de webhook. Token inválido.")
    return PlainTextResponse(content="Forbidden", status_code=403)

@router.post("/webhook")
async def receive_webhook(request: Request):
    """
    Aqui é onde os eventos reais do WhatsApp (mensagens recebidas, status de leitura, etc) chegam.
    """
    body = await request.json()
    logger.info(f"📩 Webhook recebido: {body}")
    
    # Por enquanto apenas responde 200 OK para a Meta saber que recebemos
    return Response(content="EVENT_RECEIVED", status_code=200)
