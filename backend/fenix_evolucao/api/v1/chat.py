from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.ai_service import consultar_conselheiro_stream
from api.deps import get_current_user
from models.usuario_pai import UsuarioPai

router = APIRouter()

class ChatRequest(BaseModel):
    pergunta: str

@router.post("/seguro")
async def chat_seguro_stream(
    request: ChatRequest,
    current_user: UsuarioPai = Depends(get_current_user)
):
    """
    Endpoint de Chat Seguro (E2EE/Zero-Cloud).
    Retorna uma Server-Sent-Events (SSE) response em streaming do Conselheiro do Legado.
    O consumo é auditado localmente mas o conteúdo é efêmero neste endpoint para não deixar rastros na rede.
    """
    
    # 1. Recuperação RAG Mock
    # Na implementação completa, buscaríamos documentos no ChromaDB via LlamaIndex/LangChain Retriever.
    contexto_recuperado = "Documento #P01: Cartilha de Proteção e Direitos. 'Mulheres em situação de vulnerabilidade têm direito a medidas protetivas e sigilo absoluto de local de acolhimento.'"
    
    # 2. Inicia o stream local via Ollama (Nemotron)
    generator = consultar_conselheiro_stream(
        pergunta=request.pergunta,
        contexto_rag=contexto_recuperado
    )
    
    return StreamingResponse(generator, media_type="text/event-stream")
