from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db, get_current_user
from models.usuario_pai import UsuarioPai
from schemas.usuario import UsuarioResponse, UsuarioUpdate

router = APIRouter()

@router.get("/me", response_model=UsuarioResponse)
async def read_user_me(current_user: UsuarioPai = Depends(get_current_user)):
    """Busca o perfil do usuário logado."""
    return current_user

@router.put("/me", response_model=UsuarioResponse)
async def update_user_me(
    user_in: UsuarioUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: UsuarioPai = Depends(get_current_user)
):
    """Atualiza o perfil do usuário."""
    if user_in.nome is not None:
        current_user.nome = user_in.nome
    if user_in.perfil_json is not None:
        # Mesclamos os perfis para não perder chaves
        atual = current_user.perfil_json or {}
        atual.update(user_in.perfil_json)
        current_user.perfil_json = atual
        
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
