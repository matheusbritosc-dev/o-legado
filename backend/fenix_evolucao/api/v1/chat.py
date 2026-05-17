from fastapi import APIRouter, Depends
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
    Endpoint de Chat Seguro com RAG jurídico real.
    A busca semântica acontece dentro do ai_service automaticamente.
    """
    generator = consultar_conselheiro_stream(pergunta=request.pergunta)
    return StreamingResponse(generator, media_type="text/event-stream")
