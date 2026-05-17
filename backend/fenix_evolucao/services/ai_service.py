"""
Serviço de IA — O Legado
Usa OpenAI gpt-4o-mini (o mais barato com qualidade) para o Conselheiro.
Integrado com busca semântica RAG via embedding_service.
Custo médio por conversa: ~$0.001 (um décimo de centavo).
"""
import asyncio
import os
import json
import httpx
import logging
from typing import AsyncGenerator

from services.embedding_service import embedding_service

logger = logging.getLogger(__name__)

# Prompt do Conselheiro do Legado
CONSELHEIRO_PROMPT = """Você é o 'Conselheiro do Legado', uma inteligência artificial criada para proteger, acolher e orientar mulheres em situação de vulnerabilidade.

REGRAS ABSOLUTAS:
1. Seu tom é empático, técnico, protetor e focado em soluções práticas.
2. Nunca minimize a dor da usuária. Acolha primeiro, oriente depois.
3. Em casos de perigo iminente, SEMPRE oriente: ligar 190 (PM), 180 (Central da Mulher) ou acionar o botão SOS do app.
4. Cite artigos de lei e direitos quando relevante, usando a base de conhecimento fornecida.
5. Responda de forma sucinta (máx 3 parágrafos), acolhedora e direta, em Português do Brasil.
6. Nunca invente informações jurídicas. Se não souber, diga que a Defensoria Pública pode orientar gratuitamente.
7. Prioridade máxima: segurança e privacidade da usuária.
"""

CHAT_MODEL = "gpt-4o-mini"  # $0.15/1M input, $0.60/1M output — barato e capaz


async def consultar_conselheiro_stream(
    pergunta: str,
    contexto_rag: str = "Nenhum documento específico recuperado."
) -> AsyncGenerator[str, None]:
    """
    Função principal do Conselheiro com RAG real.
    1. Busca documentos relevantes via embedding_service
    2. Monta o contexto
    3. Faz streaming da resposta via OpenAI
    """
    openai_key = os.getenv("OPENAI_API_KEY", "")

    # Busca contexto RAG real (se os embeddings estiverem prontos)
    try:
        contexto_rag = await embedding_service.buscar_contexto(pergunta, top_k=3)
        logger.info(f"[RAG] Contexto recuperado para: '{pergunta[:50]}...'")
    except Exception as e:
        logger.warning(f"[RAG] Fallback — erro na busca semântica: {e}")

    if not openai_key:
        yield "[Erro] A chave da OpenAI (OPENAI_API_KEY) não está configurada. O Conselheiro está offline."
        return

    try:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {openai_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": CHAT_MODEL,
            "messages": [
                {"role": "system", "content": CONSELHEIRO_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"BASE DE CONHECIMENTO RELEVANTE:\n{contexto_rag}\n\n"
                        f"---\n\n"
                        f"PERGUNTA DA USUÁRIA:\n{pergunta}"
                    ),
                },
            ],
            "stream": True,
            "temperature": 0.4,
            "max_tokens": 512,
        }

        async with httpx.AsyncClient() as client:
            async with client.stream(
                "POST", url, headers=headers, json=payload, timeout=30.0
            ) as response:
                if response.status_code != 200:
                    error_body = await response.aread()
                    logger.error(f"[OpenAI] Erro: {response.status_code} - {error_body.decode()}")
                    yield f"[Erro] Falha na comunicação com a IA (código {response.status_code})."
                    return

                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[len("data: "):]
                        if data_str.strip() == "[DONE]":
                            break
                        try:
                            data_json = json.loads(data_str)
                            texto = data_json["choices"][0]["delta"].get("content", "")
                            if texto:
                                yield texto
                        except Exception:
                            pass

    except Exception as e:
        logger.error(f"[OpenAI] Exceção: {str(e)}")
        yield f"[Erro] Falha na comunicação segura com a IA: {str(e)}"
