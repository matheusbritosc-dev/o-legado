from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import logging

from api.deps import get_current_user, get_db
from models.usuario_pai import UsuarioPai
from models.seguranca import AlertaSeguranca, MedidaProtetiva
from services.security_service import disparar_notificacoes_emergencia, verificar_geofencing
from schemas.seguranca import (
    MedidaProtetivaCreate,
    MedidaProtetivaResponse,
    MedidaProtetivaUpdate,
    GeofencingCheckRequest,
    GeofencingCheckResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# =============================================================================
# SOS (Botão de Pânico) — já existia
# =============================================================================

from pydantic import BaseModel
from typing import Optional

class SOSRequest(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    precisao_metros: Optional[float] = None
    emergency_number: Optional[str] = None

@router.post("/sos")
async def acionar_panico(
    request: SOSRequest,
    background_tasks: BackgroundTasks,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Endpoint ultra-rápido para acionamento do Botão de Pânico.
    Salva o alerta e despacha as notificações de alta prioridade em background.
    """
    novo_alerta = AlertaSeguranca(
        usuario_id=current_user.id,
        latitude=request.latitude,
        longitude=request.longitude,
        precisao_metros=request.precisao_metros,
        telefone_notificado=request.emergency_number
    )
    db.add(novo_alerta)
    await db.commit()
    await db.refresh(novo_alerta)
    
    # Executa os envios webhooks/SMS em background para não bloquear a resposta imediata
    background_tasks.add_task(disparar_notificacoes_emergencia, novo_alerta, request.emergency_number)
    
    # Atualiza banco assíncronamente após as notificações
    novo_alerta.notificacoes_enviadas = True
    await db.commit()
    
    return {"status": "SOS_ATIVO", "alerta_id": novo_alerta.id, "mensagem": "Rede de apoio acionada."}


# =============================================================================
# CRUD — Medidas Protetivas (Zonas de Risco)
# =============================================================================

@router.post("/medidas", response_model=MedidaProtetivaResponse, status_code=201)
async def criar_medida_protetiva(
    medida_in: MedidaProtetivaCreate,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Cadastra uma nova zona de risco (medida protetiva) para a usuária autenticada."""
    nova_medida = MedidaProtetiva(
        usuario_id=current_user.id,
        latitude_centro=medida_in.latitude_centro,
        longitude_centro=medida_in.longitude_centro,
        raio_metros=medida_in.raio_metros,
        descricao_zona=medida_in.descricao_zona,
    )
    db.add(nova_medida)
    await db.commit()
    await db.refresh(nova_medida)
    logger.info(f"📌 Medida protetiva criada: {nova_medida.id} para usuária {current_user.id}")
    return nova_medida


@router.get("/medidas", response_model=List[MedidaProtetivaResponse])
async def listar_medidas_protetivas(
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Lista todas as zonas de risco cadastradas para a usuária autenticada."""
    result = await db.execute(
        select(MedidaProtetiva)
        .where(MedidaProtetiva.usuario_id == current_user.id)
        .order_by(MedidaProtetiva.criado_em.desc())
    )
    return result.scalars().all()


@router.put("/medidas/{medida_id}", response_model=MedidaProtetivaResponse)
async def atualizar_medida_protetiva(
    medida_id: str,
    medida_in: MedidaProtetivaUpdate,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Atualiza uma zona de risco existente (posição, raio, descrição ou status ativa/inativa)."""
    result = await db.execute(
        select(MedidaProtetiva).where(
            MedidaProtetiva.id == medida_id,
            MedidaProtetiva.usuario_id == current_user.id,
        )
    )
    medida = result.scalar_one_or_none()
    if not medida:
        raise HTTPException(status_code=404, detail="Medida protetiva não encontrada.")

    if medida_in.latitude_centro is not None:
        medida.latitude_centro = medida_in.latitude_centro
    if medida_in.longitude_centro is not None:
        medida.longitude_centro = medida_in.longitude_centro
    if medida_in.raio_metros is not None:
        medida.raio_metros = medida_in.raio_metros
    if medida_in.descricao_zona is not None:
        medida.descricao_zona = medida_in.descricao_zona
    if medida_in.ativa is not None:
        medida.ativa = medida_in.ativa

    await db.commit()
    await db.refresh(medida)
    return medida


@router.delete("/medidas/{medida_id}", status_code=204)
async def deletar_medida_protetiva(
    medida_id: str,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove permanentemente uma zona de risco."""
    result = await db.execute(
        select(MedidaProtetiva).where(
            MedidaProtetiva.id == medida_id,
            MedidaProtetiva.usuario_id == current_user.id,
        )
    )
    medida = result.scalar_one_or_none()
    if not medida:
        raise HTTPException(status_code=404, detail="Medida protetiva não encontrada.")

    await db.delete(medida)
    await db.commit()


# =============================================================================
# GEOFENCING — Verificação contínua com auto-notificação
# =============================================================================

@router.post("/geofencing", response_model=GeofencingCheckResponse)
async def checar_area_segura(
    request: GeofencingCheckRequest,
    background_tasks: BackgroundTasks,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Verifica silenciosamente a localização da usuária contra as zonas de risco cadastradas.
    Se detectar violação, dispara notificação automática via WhatsApp para a rede de apoio.
    """
    if not request.latitude or not request.longitude:
        return GeofencingCheckResponse(segura=True)
        
    result = await db.execute(
        select(MedidaProtetiva).where(
            MedidaProtetiva.usuario_id == current_user.id,
            MedidaProtetiva.ativa == True
        )
    )
    medidas = result.scalars().all()
    
    if not medidas:
        return GeofencingCheckResponse(segura=True)
        
    violacoes = await verificar_geofencing(request.latitude, request.longitude, medidas)
    
    alerta_disparado = False
    if violacoes:
        # Cria alerta no banco
        novo_alerta = AlertaSeguranca(
            usuario_id=current_user.id,
            latitude=request.latitude,
            longitude=request.longitude,
            precisao_metros=request.precisao_metros,
            status="GEOFENCING_VIOLACAO",
        )
        db.add(novo_alerta)
        await db.commit()
        await db.refresh(novo_alerta)

        # Dispara notificação automática em background
        background_tasks.add_task(disparar_notificacoes_emergencia, novo_alerta, None)
        alerta_disparado = True

        logger.warning(
            f"🚨 GEOFENCING VIOLADO! Usuária {current_user.id} "
            f"dentro de {len(violacoes)} zona(s) de risco."
        )

        return GeofencingCheckResponse(
            segura=False,
            alerta_preventivo=True,
            violacoes=violacoes,
            alerta_disparado=alerta_disparado,
        )
        
    return GeofencingCheckResponse(segura=True)
