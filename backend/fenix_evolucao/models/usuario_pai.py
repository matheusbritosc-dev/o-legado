import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, Boolean, TIMESTAMP, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from models.base import Base

class UsuarioPai(Base):
    __tablename__ = "usuarios_pais"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    senha_hash = Column(String(255), nullable=False)
    
    # Faixa etária filhos, interesses, etc.
    perfil_json = Column(JSONB, nullable=True)
    
    # Gamificação e progresso
    pontos_gamificacao = Column(Integer, default=0)
    nivel = Column(Integer, default=1)
    
    # UUIDs of completed trails
    trilhas_concluidas = Column(ARRAY(UUID(as_uuid=True)), nullable=True, default=[])
    
    # {trilha_id: {modulo: x, licao: y}}
    progresso_json = Column(JSONB, nullable=True)
    
    criado_em = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
    atualizado_em = Column(TIMESTAMP(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
