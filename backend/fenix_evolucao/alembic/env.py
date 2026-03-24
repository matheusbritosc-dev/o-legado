import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Adicionamos a raiz do projeto (jules_session_...) ao sys.path para imports estilo backend.fenix_evolucao
import sys
import os
# __file__ = .../backend/fenix_evolucao/alembic/env.py
projeto_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.insert(0, projeto_root)



from config import settings
from models.base import Base
# Importar __init__.py carrega todos
import models

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=True,
        version_table_schema="evolucao",
    )

    with context.begin_transaction():
        # Cria o schema evolucao se não existir
        context.execute("CREATE SCHEMA IF NOT EXISTS evolucao;")
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection, 
        target_metadata=target_metadata,
        include_schemas=True,
        version_table_schema="evolucao",
    )

    with context.begin_transaction():
        # Cria o schema evolucao se não existir
        context.execute("CREATE SCHEMA IF NOT EXISTS evolucao;")
        context.run_migrations()

async def run_async_migrations() -> None:
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()

def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
