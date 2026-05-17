"""
Webhook WhatsApp — O Legado
Processa mensagens reais da Meta, responde via IA com RAG jurídico,
e salva interações no banco de dados.
"""
from fastapi import APIRouter, Request, Query
from fastapi.responses import PlainTextResponse, Response
import logging
import os

from services.ai_service import consultar_conselheiro_stream
from services.whatsapp_service import whatsapp_service
from database import AsyncSessionLocal

logger = logging.getLogger(__name__)
router = APIRouter()

VERIFY_TOKEN = os.getenv("META_VERIFY_TOKEN", "protocolo_corrente_invisivel_2026")


# =============================================================================
# GET /webhook — Verificação da Meta (já funcional)
# =============================================================================

@router.get("/webhook")
async def verify_webhook(
    request: Request,
    mode: str | None = Query(None, alias="hub.mode"),
    hub_mode: str | None = None,
    token: str | None = Query(None, alias="hub.verify_token"),
    hub_verify_token: str | None = None,
    challenge: str | None = Query(None, alias="hub.challenge"),
    hub_challenge: str | None = None,
):
    final_mode = mode or hub_mode
    final_token = token or hub_verify_token
    final_challenge = challenge or hub_challenge

    if final_mode == "subscribe" and final_token == VERIFY_TOKEN and final_challenge:
        logger.info("✅ Webhook da Meta verificado com sucesso!")
        return PlainTextResponse(content=final_challenge, status_code=200)

    logger.warning("❌ Tentativa falha de verificação de webhook. Token inválido.")
    return PlainTextResponse(content="Forbidden", status_code=403)


# =============================================================================
# POST /webhook — Recebe e RESPONDE mensagens reais
# =============================================================================

@router.post("/webhook")
async def receive_webhook(request: Request):
    """
    Recebe eventos do WhatsApp, extrai a mensagem, processa via IA com RAG
    jurídico e responde automaticamente à mulher.
    """
    try:
        body = await request.json()
        logger.info(f"📩 Webhook recebido: {body}")

        # Extrai a mensagem do payload da Meta
        entry = body.get("entry", [])
        if not entry:
            return Response(content="EVENT_RECEIVED", status_code=200)

        changes = entry[0].get("changes", [])
        if not changes:
            return Response(content="EVENT_RECEIVED", status_code=200)

        value = changes[0].get("value", {})
        messages = value.get("messages", [])

        if not messages:
            # Pode ser um evento de status (delivered, read), não mensagem
            logger.info("ℹ️ Evento sem mensagem (status update). Ignorando.")
            return Response(content="EVENT_RECEIVED", status_code=200)

        msg = messages[0]
        msg_type = msg.get("type", "")
        from_number = msg.get("from", "")

        # Só processa mensagens de texto por enquanto
        if msg_type != "text":
            logger.info(f"ℹ️ Mensagem tipo '{msg_type}' recebida de {from_number}. Ignorando (só texto suportado).")
            await whatsapp_service.enviar_mensagem(
                from_number,
                "Recebi sua mensagem! No momento, só consigo processar mensagens de texto. Por favor, escreva o que precisa. 💜"
            )
            return Response(content="EVENT_RECEIVED", status_code=200)

        text_body = msg.get("text", {}).get("body", "").strip()
        if not text_body:
            return Response(content="EVENT_RECEIVED", status_code=200)

        logger.info(f"💬 Mensagem de {from_number}: '{text_body}'")

        # =================================================================
        # CLASSIFICAÇÃO DE INTENÇÃO
        # =================================================================
        texto_lower = text_body.lower()

        if any(palavra in texto_lower for palavra in ["socorro", "sos", "me ajuda", "estou em perigo", "ele vai me matar", "emergencia", "emergência"]):
            tipo = "SOS"
        elif any(palavra in texto_lower for palavra in ["180", "190", "delegacia", "denuncia", "denúncia", "boletim"]):
            tipo = "DENUNCIA"
        elif any(palavra in texto_lower for palavra in ["medida protetiva", "lei maria", "direito", "guarda", "pensão", "advogado", "defensoria"]):
            tipo = "JURIDICO"
        else:
            tipo = "CHAT"

        # =================================================================
        # RESPOSTA POR TIPO
        # =================================================================

        if tipo == "SOS":
            # Resposta imediata de emergência — NÃO espera IA
            resposta = (
                "🚨 *EMERGÊNCIA DETECTADA — O LEGADO* 🚨\n\n"
                "Você NÃO está sozinha. Siga estes passos AGORA:\n\n"
                "1️⃣ Se está em perigo IMEDIATO, ligue *190* (Polícia Militar)\n"
                "2️⃣ Ligue *180* (Central de Atendimento à Mulher — 24h, gratuito, anônimo)\n"
                "3️⃣ Se puder sair do local, vá para o ponto seguro mais próximo\n"
                "4️⃣ Se não puder falar, envie SMS para 190 com sua localização\n\n"
                "⚖️ Você tem DIREITO a medida protetiva de urgência, sem advogado, 24h por dia.\n\n"
                "_Estou aqui. Me conte mais quando puder. Cada palavra sua é importante._"
            )
        else:
            # Consulta a IA com RAG jurídico
            resposta = await _gerar_resposta_ia(text_body)

        # =================================================================
        # ENVIA RESPOSTA VIA WHATSAPP
        # =================================================================
        sucesso = await whatsapp_service.enviar_mensagem(from_number, resposta)

        if sucesso:
            logger.info(f"✅ Resposta enviada para {from_number} (tipo: {tipo})")
        else:
            logger.error(f"❌ Falha ao enviar resposta para {from_number}")

        # =================================================================
        # SALVA INTERAÇÃO NO BANCO
        # =================================================================
        await _salvar_interacao(from_number, text_body, resposta, tipo)

        return Response(content="EVENT_RECEIVED", status_code=200)

    except Exception as e:
        logger.error(f"❌ Erro crítico no webhook WhatsApp: {str(e)}", exc_info=True)
        # SEMPRE retorna 200 para a Meta não reenviar infinitamente
        return Response(content="EVENT_RECEIVED", status_code=200)


# =============================================================================
# HELPERS
# =============================================================================

async def _gerar_resposta_ia(pergunta: str) -> str:
    """
    Coleta todos os tokens do stream da IA e retorna como string única.
    O consultar_conselheiro_stream é um async generator, não retorna string direta.
    """
    try:
        tokens = []
        async for token in consultar_conselheiro_stream(pergunta=pergunta):
            tokens.append(token)

        resposta = "".join(tokens).strip()

        if not resposta or resposta.startswith("[Erro]"):
            return (
                "Obrigada por entrar em contato. 💜\n\n"
                "Nosso sistema está temporariamente indisponível, "
                "mas sua segurança é prioridade.\n\n"
                "Ligue *180* (Central da Mulher, 24h, gratuito) "
                "ou *190* (Polícia Militar) se precisar de ajuda imediata."
            )

        return resposta

    except Exception as e:
        logger.error(f"Erro na geração de resposta IA: {e}")
        return (
            "Recebi sua mensagem. 💜\n\n"
            "No momento estou com dificuldade técnica, mas quero te ajudar.\n"
            "Se for urgente: *180* (Central da Mulher) ou *190* (PM).\n"
            "Tente novamente em alguns minutos."
        )


async def _salvar_interacao(telefone: str, pergunta: str, resposta: str, tipo: str):
    """Salva a interação no banco usando uma sessão independente."""
    try:
        import hashlib
        import uuid
        from sqlalchemy import select
        from models.interacao_ia import InteracaoIA
        from models.usuario_pai import UsuarioPai

        hash_anonimo = hashlib.sha256(telefone.encode()).hexdigest()

        async with AsyncSessionLocal() as db:
            # 1. Busca usuário pelo telefone
            result = await db.execute(select(UsuarioPai).where(UsuarioPai.telefone == telefone))
            usuario = result.scalar_one_or_none()

            # 2. Se não existir, cria usuário anônimo
            if not usuario:
                usuario = UsuarioPai(
                    nome="Usuária WhatsApp (Anônima)",
                    email=f"anon_{uuid.uuid4().hex[:8]}@whatsapp.legado",
                    telefone=telefone,
                    senha_hash="no_password_whatsapp_only"
                )
                db.add(usuario)
                await db.commit()
                await db.refresh(usuario)
                logger.info(f"👤 Novo usuário anônimo criado para o número {telefone}")

            # 3. Salva a interação vinculada ao usuário
            interacao = InteracaoIA(
                usuario_id=usuario.id,
                pergunta_criptografada=pergunta,  # TODO: criptografar com AES-256
                resposta_criptografada=resposta,
                hash_anonimo=hash_anonimo,
                categoria_tema=tipo,
                tokens_usados=len(resposta.split()),
            )
            db.add(interacao)
            await db.commit()
            logger.info(f"💾 Interação salva (usuario_id: {usuario.id}, tipo: {tipo})")

    except Exception as e:
        # Não falhar o webhook por erro de persistência
        logger.error(f"⚠️ Erro ao salvar interação: {e}")
