import hashlib

def gerar_hash_anonimo(user_id: str) -> str:
    """
    Gera um hash SHA-256 unidirecional baseado no ID do usuário.
    Garante que os relatórios de uso da IA sejam analíticos mas não identificáveis.
    """
    if not user_id:
        return ""
    
    # Criamos um "salt" estático para ofuscar (na prática, pode vir do .env)
    salt = "fenix_evolucao_analytics_salt_"
    payload = f"{salt}{user_id}".encode('utf-8')
    
    return hashlib.sha256(payload).hexdigest()
