from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.router import api_router
from config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API do Microsserviço Fênix-Evolução (Educação Parental e IA)",
    version="1.0.0"
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

@app.get("/health")
async def health_check():
    """Health check endpoint for the Fênix-Evolução service."""
    return {"status": "ok", "service": settings.PROJECT_NAME}
