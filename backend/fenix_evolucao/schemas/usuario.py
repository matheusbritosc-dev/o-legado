from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from uuid import UUID
from datetime import datetime

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: Optional[str] = None
    perfil_json: Optional[Dict] = None

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    telefone: Optional[str] = None
    perfil_json: Optional[Dict] = None

from pydantic import field_validator
from services.crypto_service import decrypt_str

class UsuarioResponse(UsuarioBase):
    id: UUID
    pontos_gamificacao: int
    nivel: int
    trilhas_concluidas: List[UUID]
    progresso_json: Optional[Dict] = None
    criado_em: datetime
    
    @field_validator("telefone", mode="before")
    @classmethod
    def decrypt_telefone(cls, v: str | None):
        if not v:
            return v
        return decrypt_str(v)
    
    class Config:
        from_attributes = True
