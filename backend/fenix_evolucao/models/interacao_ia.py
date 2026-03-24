import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from models.base import Base

class InteracaoIA(Base):
    __tablename__ = "interacoes_ia"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # ForeignKey to users model
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("evolucao.usuarios_pais.id", ondelete="CASCADE"), nullable=False)
    
    # Criptografado com AES-256 no nível da aplicação antes de salvar
    pergunta_criptografada = Column(Text, nullable=False)
    resposta_criptografada = Column(Text, nullable=False)
    
    # SHA-256 do user_id (para análise de impacto e dashboards anônimos)
    hash_anonimo = Column(String(64), nullable=False, index=True)
    
    categoria_tema = Column(String(100), nullable=True) # Ex: Prevenção, Emocional (não criptografado)
    tokens_usados = Column(Integer, default=0)
    
    criado_em = Column(TIMESTAMP(timezone=True), default=datetime.utcnow)
