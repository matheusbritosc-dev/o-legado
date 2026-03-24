from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import MetaData

# Defines the schema 'evolucao'
metadata = MetaData(schema="evolucao")

class Base(DeclarativeBase):
    metadata = metadata
