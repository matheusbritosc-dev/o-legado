from sqlalchemy import Column, String, DateTime
from datetime import datetime
from .base import Base

class Lead(Base):
    __tablename__ = "leads"

    email = Column(String, primary_key=True, index=True)
    nome = Column(String)
    whatsapp = Column(String)
    origem = Column(String, default="LCP_GUIA")
    data_criacao = Column(DateTime, default=datetime.utcnow)
