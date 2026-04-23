from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from api.v1.router import api_router
from config import settings
from database import engine
from models.base import Base
# Força registro de todos os models no metadata
import models  # noqa: F401

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Cria schema e tabelas automaticamente quando o servidor inicia."""
    async with engine.begin() as conn:
        await conn.execute(text("CREATE SCHEMA IF NOT EXISTS evolucao"))
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API do Microsserviço Fênix-Evolução (Educação Parental e IA)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
@app.get("/health")
@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint for the Fênix-Evolução service."""
    return {"status": "ok", "service": settings.PROJECT_NAME}

