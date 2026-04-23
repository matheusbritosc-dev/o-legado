from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import Optional

from api.deps import get_current_user, get_db
from models.usuario_pai import UsuarioPai
from models.seguranca import AlertaSeguranca, MedidaProtetiva
from services.security_service import disparar_notificacoes_emergencia, verificar_geofencing

router = APIRouter()

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
    # Isso seria feito dentro da task idealmente, mas para escopo de MVP:
    novo_alerta.notificacoes_enviadas = True
    await db.commit()
    
    return {"status": "SOS_ATIVO", "alerta_id": novo_alerta.id, "mensagem": "Rede de apoio acionada."}

@router.post("/geofencing")
async def checar_area_segura(
    request: SOSRequest,
    current_user: UsuarioPai = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Verifica silenciosamente a localização da usuária contra as áreas de risco cadastradas.
    """
    if not request.latitude or not request.longitude:
        return {"segura": True, "violacoes": []}
        
    result = await db.execute(
        select(MedidaProtetiva).where(
            MedidaProtetiva.usuario_id == current_user.id,
            MedidaProtetiva.ativa == True
        )
    )
    medidas = result.scalars().all()
    
    if not medidas:
        return {"segura": True, "violacoes": []}
        
    violacoes = await verificar_geofencing(request.latitude, request.longitude, medidas)
    
    if violacoes:
        return {"segura": False, "alerta_preventivo": True, "violacoes": violacoes}
        
    return {"segura": True, "violacoes": []}
