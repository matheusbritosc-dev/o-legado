from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Float, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.sql import func
import uuid
from models.base import Base

class AlertaSeguranca(Base):
    """Tabela para registrar os incidentes de Pânico disparados"""
    __tablename__ = "alertas_seguranca"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(PG_UUID(as_uuid=True), ForeignKey("usuarios_pais.id"), nullable=False, index=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    precisao_metros = Column(Float, nullable=True)
    status = Column(String(50), default="ATIVO") # ATIVO, RESOLVIDO, FALSO_ALARME
    notificacoes_enviadas = Column(Boolean, default=False)
    criado_em = Column(TIMESTAMP(timezone=True), server_default=func.now())

class MedidaProtetiva(Base):
    """Tabela de Geofencing para armazenar perímetros de risco"""
    __tablename__ = "medidas_protetivas"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(PG_UUID(as_uuid=True), ForeignKey("usuarios_pais.id"), nullable=False, index=True)
    latitude_centro = Column(Float, nullable=False)
    longitude_centro = Column(Float, nullable=False)
    raio_metros = Column(Integer, nullable=False, default=500)
    descricao_zona = Column(String(255), nullable=True)
    ativa = Column(Boolean, default=True)
    criado_em = Column(TIMESTAMP(timezone=True), server_default=func.now())
