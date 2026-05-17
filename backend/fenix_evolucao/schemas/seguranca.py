from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class MedidaProtetivaCreate(BaseModel):
    latitude_centro: float
    longitude_centro: float
    raio_metros: int = 500
    descricao_zona: Optional[str] = None


class MedidaProtetivaResponse(BaseModel):
    id: UUID
    usuario_id: UUID
    latitude_centro: float
    longitude_centro: float
    raio_metros: int
    descricao_zona: Optional[str] = None
    ativa: bool
    criado_em: datetime

    class Config:
        from_attributes = True


class MedidaProtetivaUpdate(BaseModel):
    latitude_centro: Optional[float] = None
    longitude_centro: Optional[float] = None
    raio_metros: Optional[int] = None
    descricao_zona: Optional[str] = None
    ativa: Optional[bool] = None


class GeofencingCheckRequest(BaseModel):
    latitude: float
    longitude: float
    precisao_metros: Optional[float] = None


class ViolacaoItem(BaseModel):
    medida_id: str
    descricao: Optional[str] = None
    distancia_atual_metros: float
    raio_limite_metros: int


class GeofencingCheckResponse(BaseModel):
    segura: bool
    alerta_preventivo: bool = False
    violacoes: List[ViolacaoItem] = []
    alerta_disparado: bool = False
