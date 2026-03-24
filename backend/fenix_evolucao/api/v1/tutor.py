from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from api.deps import get_db, get_current_user
from models.usuario_pai import UsuarioPai
from models.interacao_ia import InteracaoIA
from schemas.tutor import TutorPerguntaRequest, TutorRespostaResponse
from services.tutor_service import responder_pergunta
from services.crypto_service import encrypt_text, decrypt_text
from services.anonimizacao import gerar_hash_anonimo

router = APIRouter()

@router.post("/perguntar", response_model=TutorRespostaResponse)
async def perguntar_tutor(
    request: TutorPerguntaRequest,
    db: AsyncSession = Depends(get_db),
    current_user: UsuarioPai = Depends(get_current_user)
):
    """Envia uma pergunta para o Tutor IA."""
    # Chama o serviço (Mock/LLM)
    contexto = {"user_perfil": current_user.perfil_json}
    resposta, categoria, tokens = await responder_pergunta(request.pergunta, contexto)
    
    # Salva no banco com criptografia
    interacao = InteracaoIA(
        usuario_id=current_user.id,
        pergunta_criptografada=encrypt_text(request.pergunta),
        resposta_criptografada=encrypt_text(resposta),
        hash_anonimo=gerar_hash_anonimo(str(current_user.id)),
        categoria_tema=categoria,
        tokens_usados=tokens
    )
    db.add(interacao)
    await db.commit()
    await db.refresh(interacao)
    
    return TutorRespostaResponse(
        resposta=resposta,
        tokens_usados=tokens,
        categoria_tema=categoria,
        feedback_id=str(interacao.id)
    )

@router.get("/historico")
async def historico_tutor(
    db: AsyncSession = Depends(get_db),
    current_user: UsuarioPai = Depends(get_current_user)
):
    """Busca o histórico de interações do usuário (descriptografa on the fly)."""
    result = await db.execute(
        select(InteracaoIA)
        .where(InteracaoIA.usuario_id == current_user.id)
        .order_by(InteracaoIA.criado_em.desc())
        .limit(20) # Últimas 20
    )
    
    historico = []
    for interacao in result.scalars().all():
        historico.append({
            "id": interacao.id,
            "pergunta": decrypt_text(interacao.pergunta_criptografada),
            "resposta": decrypt_text(interacao.resposta_criptografada),
            "categoria_tema": interacao.categoria_tema,
            "criado_em": interacao.criado_em
        })
        
    return historico
