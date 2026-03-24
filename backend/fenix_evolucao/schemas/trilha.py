from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class TrilhaBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    categoria: str
    pontos_recompensa: int = 100
    ordem: int = 1
    ativo: bool = True

class TrilhaCreate(TrilhaBase):
    modulos_json: List[Dict[str, Any]]

class TrilhaUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    categoria: Optional[str] = None
    modulos_json: Optional[List[Dict[str, Any]]] = None
    pontos_recompensa: Optional[int] = None
    ordem: Optional[int] = None
    ativo: Optional[bool] = None

class TrilhaResponse(TrilhaBase):
    id: UUID
    modulos_json: List[Dict[str, Any]]
    criado_em: datetime
    
    class Config:
        from_attributes = True
