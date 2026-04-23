"""
Rota de Captação de Leads — LCP (Lead Capture Page)
Captura contatos de interessadas via formulário do Guia e Landing Page.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional
import logging

from database import get_db
from models.lead import Lead

logger = logging.getLogger(__name__)
router = APIRouter()


class LeadCreate(BaseModel):
    nome: str
    email: EmailStr
    whatsapp: str
    origem: Optional[str] = "LCP_GUIA"


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_lead(lead_in: LeadCreate, db: AsyncSession = Depends(get_db)):
    """Captura um novo lead ou atualiza um existente."""
    # Verifica se o lead já existe (usando async corretamente)
    result = await db.execute(select(Lead).where(Lead.email == lead_in.email))
    db_lead = result.scalar_one_or_none()

    if db_lead:
        # Atualiza o lead existente se necessário (ex: novo WhatsApp)
        db_lead.nome = lead_in.nome
        db_lead.whatsapp = lead_in.whatsapp
        await db.commit()
        logger.info(f"📝 Lead atualizado: {lead_in.email}")
        return {"message": "Lead atualizado com sucesso", "email": lead_in.email}

    # Cria o novo lead
    new_lead = Lead(
        nome=lead_in.nome,
        email=lead_in.email,
        whatsapp=lead_in.whatsapp,
        origem=lead_in.origem,
    )
    db.add(new_lead)
    try:
        await db.commit()
        await db.refresh(new_lead)
        logger.info(f"✅ Novo lead capturado: {new_lead.email} (origem: {new_lead.origem})")
    except Exception as e:
        await db.rollback()
        logger.error(f"❌ Erro ao salvar lead {lead_in.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao salvar o contato no banco de dados.",
        )

    return {"message": "Lead capturado com sucesso", "email": new_lead.email}
