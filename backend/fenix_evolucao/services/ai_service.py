import asyncio
import os
import json
import httpx
from typing import AsyncGenerator

# Prompt do Conselheiro do Legado
CONSELHEIRO_PROMPT = """Você é o 'Conselheiro do Legado', uma inteligência artificial criada para proteger, acolher e orientar mulheres e famílias.
Seu tom é empático, técnico, protetor e focado em soluções práticas. Você nunca exibe mensagens genéricas, mas age como um conselheiro sênior focado na Segurança.
Sua prioridade máxima é garantir a privacidade e segurança da usuária. Em casos de perigo iminente, oriente a buscar a rede de apoio offline ou ligar para 180.
Responda de forma sucinta (máx 3 parágrafos), acolhedora e direta, em Português do Brasil.
"""

async def consultar_conselheiro_stream(pergunta: str, contexto_rag: str = "Nenhum documento específico recuperado.") -> AsyncGenerator[str, None]:
    """
    Função principal conectada à Nuvem da NVIDIA.
    Usa htppx para fazer streaming do modelo Nemotron/Llama3, usando ZERO Memória RAM no nosso servidor Render.
    """
    queue = asyncio.Queue()
    nvidia_key = os.getenv("NVIDIA_API_KEY", "")
    
    if not nvidia_key:
        async def _mock_generate():
            mensagem = "[Erro] A chave da NVIDIA (NVIDIA_API_KEY) não foi fornecida nas Variáveis da Render. A IA está offline."
            for palavra in mensagem.split(" "):
                await queue.put(palavra + " ")
                await asyncio.sleep(0.05)
            await queue.put(None)
        asyncio.create_task(_mock_generate())
    else:
        async def _generate():
            try:
                # Usa a infraestrutura da NVIDIA compatível com OpenAI
                url = "https://integrate.api.nvidia.com/v1/chat/completions"
                headers = {
                    "Authorization": f"Bearer {nvidia_key}",
                    "Content-Type": "application/json",
                    "Accept": "text/event-stream"
                }
                payload = {
                    "model": "meta/llama3-70b-instruct",
                    "messages": [
                        {"role": "system", "content": CONSELHEIRO_PROMPT},
                        {"role": "user", "content": f"Contexto interno: {contexto_rag}\n\nMeu relato/pergunta: {pergunta}"}
                    ],
                    "stream": True,
                    "temperature": 0.5,
                    "max_tokens": 512
                }
                
                async with httpx.AsyncClient() as client:
                    async with client.stream("POST", url, headers=headers, json=payload, timeout=30.0) as response:
                        if response.status_code != 200:
                            await queue.put(f"[Erro da NVIDIA API: {response.status_code}]")
                            return
                            
                        # Processa o Event-Stream da NVIDIA
                        async for line in response.aiter_lines():
                            if line.startswith("data: "):
                                data_str = line[len("data: "):]
                                if data_str.strip() == "[DONE]":
                                    break
                                try:
                                    data_json = json.loads(data_str)
                                    texto = data_json["choices"][0]["delta"].get("content", "")
                                    if texto:
                                        await queue.put(texto)
                                except Exception:
                                    pass
            except Exception as e:
                await queue.put(f"[Erro na comunicação segura com a IA: {str(e)}]")
            finally:
                await queue.put(None)
                
        asyncio.create_task(_generate())
    
    while True:
        token = await queue.get()
        if token is None:
            break
        yield token
