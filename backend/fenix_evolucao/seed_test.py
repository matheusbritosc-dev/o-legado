import asyncio
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import AsyncSessionLocal
from models.usuario_pai import UsuarioPai
from models.seguranca import MedidaProtetiva

async def seed():
    async with AsyncSessionLocal() as db:
        # Busca ou cria usuário de teste
        result = await db.execute(select(UsuarioPai).where(UsuarioPai.email == "teste_geo@legado.com"))
        user = result.scalar_one_or_none()
        
        if not user:
            user = UsuarioPai(
                nome="Usuária Teste Geofencing",
                email="teste_geo@legado.com",
                senha_hash="no_password",
                telefone="5562999999999"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            print(f"Usuária de teste criada com ID: {user.id}")
        else:
            print(f"Usuária de teste já existe com ID: {user.id}")

        # Cria medida protetiva
        medida = MedidaProtetiva(
            usuario_id=user.id,
            latitude=-16.700000,
            longitude=-49.250000,
            raio_metros=300,
            descricao="Medida de teste - Goiânia"
        )
        db.add(medida)
        await db.commit()
        print("Medida protetiva de teste inserida com sucesso!")

if __name__ == "__main__":
    asyncio.run(seed())
