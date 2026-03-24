from fastapi import APIRouter
from api.v1 import auth, usuarios, trilhas, tutor, chat, pagamentos, seguranca

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(usuarios.router, prefix="/usuarios", tags=["Usuários"])
api_router.include_router(trilhas.router, prefix="/trilhas", tags=["Trilhas"])
api_router.include_router(tutor.router, prefix="/tutor", tags=["Tutor IA"])
api_router.include_router(chat.router, prefix="/chat", tags=["Segurança IA e RAG"])
api_router.include_router(pagamentos.router, prefix="/pagamentos", tags=["Financeiro PIX/Stripe"])
api_router.include_router(seguranca.router, prefix="/seguranca", tags=["Módulo SOS e Geofencing"])
