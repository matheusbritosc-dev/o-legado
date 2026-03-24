import asyncio
import bcrypt
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text
import os

async def seed_admin():
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/fenix_evolucao")
    engine = create_async_engine(DATABASE_URL)
    AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

    print("=" * 50)
    print("  LEGADO  Seed de Usuario Admin")
    print("=" * 50)
    
    async with AsyncSessionLocal() as session:
        admin_email = "admin@legado.com"
        admin_senha = "LegadoAdmin2026!"
        admin_nome = "Matheus Brito - Arquiteto do Legado"
        perfil = '{"role": "admin", "notas": "Criador e Arquiteto do Legado", "poderes": "all"}'
        
        # Hash seguro com bcrypt
        hashed_pw = bcrypt.hashpw(admin_senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        # Verifica se ja existe no schema evolucao
        result = await session.execute(
            text("SELECT id FROM evolucao.usuarios_pais WHERE email = :email"),
            {"email": admin_email}
        )
        exists = result.scalar()

        if exists:
            await session.execute(
                text("UPDATE evolucao.usuarios_pais SET senha_hash = :pw, nome = :nome, nivel = 99 WHERE email = :email"),
                {"pw": hashed_pw, "email": admin_email, "nome": admin_nome}
            )
            await session.commit()
            print("Admin ATUALIZADO com sucesso!")
        else:
            await session.execute(
                text(
                    "INSERT INTO evolucao.usuarios_pais "
                    "(id, nome, email, senha_hash, perfil_json, nivel, pontos_gamificacao, criado_em, atualizado_em) "
                    "VALUES (gen_random_uuid(), :nome, :email, :pw, CAST(:perfil AS jsonb), 99, 0, now(), now())"
                ),
                {"nome": admin_nome, "email": admin_email, "pw": hashed_pw, "perfil": perfil}
            )
            await session.commit()
            print("Admin CRIADO com sucesso!")
        
        print(f"Email: {admin_email}")
        print(f"Senha: {admin_senha}")
        print(f"Role: admin (nivel 99)")
        print("=" * 50)

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed_admin())
