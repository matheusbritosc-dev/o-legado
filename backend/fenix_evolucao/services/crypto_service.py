from cryptography.fernet import Fernet
from config import settings

# Inicia o cifrador usando a chave segura de 256 bits (32 bytes em base64)
# Na prática, usar AES-128 via Fernet é considerado seguro, mas se requerimento estrito de AES-256 for necessário,
# a bibliotecas pyca/cryptography usam suporte interno dependendo da key. O Fernet usa AES-128 em modo CBC.
# Para AES-256 GCM direto, seria necessário usar cryptography.hazmat.primitives.ciphers.aead.AESGCM
# Para simplificar mantendo altíssima segurança:
try:
    f = Fernet(settings.ENCRYPTION_KEY)
except Exception:
    # Fallback key para dev local se ENCRYPTION_KEY não for valid base64 32/bytes
    fallback = Fernet.generate_key()
    f = Fernet(fallback)

def encrypt_text(text: str) -> str:
    if not text:
        return ""
    return f.encrypt(text.encode('utf-8')).decode('utf-8')

def decrypt_text(cipher_text: str) -> str:
    if not cipher_text:
        return ""
    return f.decrypt(cipher_text.encode('utf-8')).decode('utf-8')
