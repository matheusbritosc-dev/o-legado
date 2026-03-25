import asyncio
from typing import AsyncGenerator

# Prompt do Conselheiro do Legado (Mantido apenas como log)
CONSELHEIRO_PROMPT = """Você é o 'Conselheiro do Legado', uma inteligência artificial criada para proteger..."""

async def consultar_conselheiro_stream(pergunta: str, contexto_rag: str = "Nenhum documento específico recuperado.") -> AsyncGenerator[str, None]:
    """
    Função principal mockada para o Render Free Tier.
    Garante que os dados não vão para a nuvem, e simula um stream sem carregar modelos pesados na RAM.
    """
    queue = asyncio.Queue()
    
    # Texto mockado para o Alpha Tester
    resposta_simulada = (
        "Olá! Eu sou o Conselheiro do Legado (Modo Alpha). "
        "Estou aqui para oferecer apoio e informações iniciais. "
        "Lembre-se de que meu sistema de inferência avançado roda primariamente em ambientes locais, "
        "mas estou recebendo a sua dúvida com total segurança e criptografia. "
        "Se estiver em perigo imediato, por favor ligue 180."
    )
    
    async def _generate():
        try:
            # Simula a digitação da IA
            palavras = resposta_simulada.split(" ")
            for palavra in palavras:
                await queue.put(palavra + " ")
                await asyncio.sleep(0.08)  # Efeito typing
        except Exception as e:
            await queue.put(f"[Erro no Mock: {str(e)}]")
        finally:
            await queue.put(None)
            
    asyncio.create_task(_generate())
    
    while True:
        token = await queue.get()
        if token is None:
            break
        yield token
