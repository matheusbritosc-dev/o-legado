from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Fênix-Evolução"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/fenix_evolucao"
    
    # JWT Auth
    SECRET_KEY: str = "super_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Encryption (AES-256 for logs)
    # Deve ser uma base64 32-byte key válida para o Fernet (cryptography)
    # Ex: Fernet.generate_key()
    ENCRYPTION_KEY: str = "vQx6_FjX_F_8aY2Hh9O8J0xZ-a1aJ1q6Fz4vQx6_FjX="
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
