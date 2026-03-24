import asyncio
from typing import AsyncGenerator
from langchain_community.llms import Ollama
from langchain_core.callbacks import CallbackManager, StreamingStdOutCallbackHandler
from langchain_core.prompts import PromptTemplate

# Prompt do Conselheiro do Legado
CONSELHEIRO_PROMPT = """Você é o 'Conselheiro do Legado', uma inteligência artificial criada para proteger, acolher e orientar mulheres e famílias.
Seu tom é empático, técnico, protetor e focado em soluções práticas. Você nunca exibe mensagens genéricas, mas age como um conselheiro sênior focado na Segurança e Educação Base.
Sua prioridade máxima é garantir a privacidade e segurança da usuária. Em casos de perigo iminente, oriente a buscar a rede de apoio offline ou ligar para 180.

Contexto da Base de Conhecimento RAG:
{context}

Dúvida da Usuária: {question}

Resposta (em português brasileiro, acolhedora e direta):"""

prompt = PromptTemplate(
    template=CONSELHEIRO_PROMPT,
    input_variables=["context", "question"]
)

class AsyncCallbackHandler:
    """Um callback simples para capturar os tokens e enviá-os para um queue assíncrono"""
    def __init__(self, queue: asyncio.Queue):
        self.queue = queue
        
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.queue.put_nowait(token)

async def consultar_conselheiro_stream(pergunta: str, contexto_rag: str = "Nenhum documento específico recuperado. Use conhecimento geral de proteção.") -> AsyncGenerator[str, None]:
    """
    Função principal que ativa o modelo Nemotron via Ollama local e faz stream da resposta.
    Garante que os dados não vão para a nuvem.
    """
    queue = asyncio.Queue()
    
    # Fake callback para stream
    async def _on_llm_new_token(token: str):
         await queue.put(token)
         
    # Configuração do Ollama local rodando o modelo
    # url default: http://localhost:11434
    llm = Ollama(
        model="nemotron",
        base_url="http://localhost:11434",
        verbose=False,
    )
    
    prompt_formatado = prompt.format(context=contexto_rag, question=pergunta)
    
    # Lança a geração em background para liberar o generator (EventLoop)
    async def _generate():
        try:
            # Langchain Ollama suporta async stream iterando sobre .astream()
            async for chunk in llm.astream(prompt_formatado):
                await queue.put(chunk)
        except Exception as e:
            await queue.put(f"[Erro na comunicação segura com IA Local: {str(e)}]")
        finally:
            await queue.put(None) # Signal completion
            
    asyncio.create_task(_generate())
    
    while True:
        token = await queue.get()
        if token is None:
            break
        yield token
