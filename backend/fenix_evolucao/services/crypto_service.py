"""
Serviço de Criptografia — O Legado
Implementa AES-256 (via Fernet) para campos sensíveis (telefone, relatos).
"""
import logging
from cryptography.fernet import Fernet
from config import settings

logger = logging.getLogger(__name__)

# Carrega a chave AES-256 do config (.env)
# A chave precisa ser base64 url-safe (32 bytes). Ex: Fernet.generate_key()
try:
    _cipher = Fernet(settings.ENCRYPTION_KEY.encode('utf-8'))
except Exception as e:
    logger.error(f"❌ ENCRYPTION_KEY inválida: {e}")
    raise RuntimeError("ENCRYPTION_KEY inválida. Corrija o .env antes de subir o servidor.")

def encrypt_str(texto: str) -> str:
    """Criptografa uma string usando AES-256."""
    if not texto:
        return texto
    return _cipher.encrypt(texto.encode("utf-8")).decode("utf-8")

def decrypt_str(texto_criptografado: str) -> str:
    """Decriptografa uma string usando AES-256."""
    if not texto_criptografado:
        return texto_criptografado
    try:
        return _cipher.decrypt(texto_criptografado.encode("utf-8")).decode("utf-8")
    except Exception as e:
        logger.error("Erro ao descriptografar dado sensível.")
        return "[ERRO DE DECRIPTOGRAFIA]"
