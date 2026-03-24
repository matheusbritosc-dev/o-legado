from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from api.deps import get_db, get_current_user
from models.usuario_pai import UsuarioPai
from models.trilha_aprendizado import TrilhaAprendizado
from schemas.trilha import TrilhaResponse

router = APIRouter()

@router.get("", response_model=List[TrilhaResponse])
async def listar_trilhas(
    db: AsyncSession = Depends(get_db),
    current_user: UsuarioPai = Depends(get_current_user)
):
    """Lista todas as trilhas ativas."""
    result = await db.execute(select(TrilhaAprendizado).where(TrilhaAprendizado.ativo == True).order_by(TrilhaAprendizado.ordem))
    return result.scalars().all()

@router.get("/{trilha_id}", response_model=TrilhaResponse)
async def obter_trilha(
    trilha_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UsuarioPai = Depends(get_current_user)
):
    """Busca os detalhes de uma trilha específica."""
    result = await db.execute(select(TrilhaAprendizado).where(TrilhaAprendizado.id == trilha_id))
    trilha = result.scalar_one_or_none()
    if not trilha:
        raise HTTPException(status_code=404, detail="Trilha não encontrada")
    return trilha
