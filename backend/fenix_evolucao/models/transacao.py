from sqlalchemy import Column, String, Integer, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
import uuid
from models.base import Base

class Transacao(Base):
    __tablename__ = "transacoes"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(PG_UUID(as_uuid=True), ForeignKey("usuarios_pais.id"), nullable=False, index=True)
    gateway_id = Column(String(255), unique=True, index=True, nullable=True) # ID do MercadoPago/Stripe
    valor_centavos = Column(Integer, nullable=False)
    moeda = Column(String(3), default="BRL")
    metodo = Column(String(50), nullable=False) # 'PIX', 'CREDIT_CARD'
    status = Column(String(50), default="PENDING") # PENDING, APPROVED, REJECTED
    plano = Column(String(100), nullable=False) # 'membro_anual', 'base_mensal'
    metadata_json = Column(JSON, nullable=True) # Trilha de auditoria e payload original
