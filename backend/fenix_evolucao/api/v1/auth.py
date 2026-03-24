from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from api.deps import get_db
from models.usuario_pai import UsuarioPai
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from services.auth_service import get_password_hash, verify_password, create_access_token
from schemas.usuario import UsuarioResponse

router = APIRouter()

@router.post("/registrar", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def registrar(user_in: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UsuarioPai).where(UsuarioPai.email == user_in.email))
    user = result.scalar_one_or_none()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this user email already exists in the system",
        )
    
    usuario = UsuarioPai(
        nome=user_in.nome,
        email=user_in.email,
        senha_hash=get_password_hash(user_in.senha),
        perfil_json=user_in.perfil_json
    )
    db.add(usuario)
    await db.commit()
    await db.refresh(usuario)
    return usuario

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UsuarioPai).where(UsuarioPai.email == login_data.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(login_data.senha, user.senha_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=access_token)
