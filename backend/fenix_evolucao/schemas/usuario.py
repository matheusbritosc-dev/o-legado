from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from uuid import UUID
from datetime import datetime

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr
    perfil_json: Optional[Dict] = None

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    perfil_json: Optional[Dict] = None

class UsuarioResponse(UsuarioBase):
    id: UUID
    pontos_gamificacao: int
    nivel: int
    trilhas_concluidas: List[UUID]
    progresso_json: Optional[Dict] = None
    criado_em: datetime
    
    class Config:
        from_attributes = True
