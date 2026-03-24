import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Integer, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, JSONB
from models.base import Base

class TrilhaAprendizado(Base):
    __tablename__ = "trilhas_aprendizado"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    titulo = Column(String(300), nullable=False)
    descricao = Column(Text, nullable=True)
    categoria = Column(String(100), nullable=False) # "Prevenção de Violência", "Inteligência Emocional"
    
    # Array de módulos com lições e quizzes
    # [{"titulo": "...", "licoes": [{"id": 1, "tipo": "video"}]}]
    modulos_json = Column(JSONB, nullable=False, default=[])
    
    pontos_recompensa = Column(Integer, default=100)
    ordem = Column(Integer, default=1)
    ativo = Column(Boolean, default=True)
    criado_em = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
