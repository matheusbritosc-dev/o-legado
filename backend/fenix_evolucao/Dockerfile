# O Legado - Produção Dockerfile
# Imagem minimalista para menor consumo de RAM na sua VPS de 4GB
FROM python:3.12-slim

# Variáveis de ambiente fundamentais para o Python não bufferizar os logs (facilita vermos os erros)
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

# Define o diretório de trabalho padrão
WORKDIR /app

# Instala dependências do sistema necessárias para compilar bibliotecas criptográficas (como bcrypt e asyncpg)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala requirements primeiro (Aproveita a camada de cache do Docker)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia o restante do seu código para dentro do container
COPY . .

# Expõe a porta que o FastAPI do Legado escuta
EXPOSE 8000

# Script robusto de inicialização do Uvicorn focado em não cair - usando 2 workers para estabilidade
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2", "--proxy-headers", "--forwarded-allow-ips", "*"]
