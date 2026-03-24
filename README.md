<div align="center">

# 🛡️ O LEGADO — Plataforma de Proteção à Mulher com IA

**Ecossistema tecnológico que une Inteligência Artificial, criptografia de nível militar e educação preventiva para combater a violência doméstica.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)

</div>

---

## 📋 Sobre o Projeto

**O Legado** é uma plataforma completa de proteção à mulher que ataca a violência doméstica em duas frentes:

1. **Proteção Imediata** — Botão SOS, Modo Furtivo, Cercas Virtuais
2. **Prevenção Geracional** — Escola de Pais com IA, trilhas educacionais gamificadas

> *"Nenhuma mulher deve caminhar com medo."*

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 16)                   │
│  React 19 · Tailwind CSS · Framer Motion · QR Code PIX     │
├─────────────────────────────────────────────────────────────┤
│                  API GATEWAY (Next.js Routes)               │
│           JWT HttpOnly Cookies · CORS · Middleware          │
├─────────────────────────────────────────────────────────────┤
│                    BACKEND (FastAPI/Python)                  │
│  Auth · Usuários · Trilhas · Tutor IA · Chat · Pagamentos  │
├─────────────────────────────────────────────────────────────┤
│              BANCO DE DADOS (PostgreSQL 16)                 │
│  Schema: evolucao · Alembic Migrations · JSONB · UUID      │
├─────────────────────────────────────────────────────────────┤
│               IA LOCAL (Ollama + Nemotron)                  │
│         100% Offline · Zero Cloud · LangChain RAG          │
├─────────────────────────────────────────────────────────────┤
│                    SEGURANÇA                                │
│  AES-256 E2EE · Bcrypt · JWT · LGPD · OWASP Top 10        │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Funcionalidades

### 🔴 Botão SOS de Emergência
- Envia localização GPS em tempo real com **um toque**
- Modo silencioso — sem alertas visíveis ao agressor
- WebSocket para tracking em tempo real

### 🕵️ Modo Furtivo
- Interface disfarçada como bloco de notas
- Registro criptografado (AES-256) de placas e suspeitos
- Impossível de identificar pelo agressor

### 🤖 Conselheira IA (Tutor Inteligente)
- IA rodando **100% offline** no dispositivo (Nemotron/Ollama)
- Orientação jurídica, acolhimento emocional
- Streaming de respostas em tempo real
- **Zero dados enviados para a nuvem**

### 📚 Escola de Pais
- Trilhas educacionais gamificadas
- Sistema de pontos e níveis
- Baseada em ciência de desenvolvimento infantil

### 🛡️ Medidas Protetivas Digitais
- Cercas virtuais georreferenciadas
- Alertas automáticos para rede de apoio
- Integração com medidas protetivas judiciais

### 💳 Checkout Integrado
- **Stripe** (Cartão + Boleto) — chaves LIVE
- **PIX nativo** com QR Code EMV (padrão Banco Central)
- Página de sucesso com onboarding VIP

---

## 🛠️ Tech Stack

| Camada | Tecnologias |
|--------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy (async), Pydantic v2 |
| **Database** | PostgreSQL 16, Alembic (migrations), asyncpg |
| **IA/ML** | LangChain, Ollama, Nemotron (NVIDIA), ChromaDB (RAG) |
| **Auth** | JWT (python-jose), Bcrypt, HttpOnly Cookies, RBAC |
| **Crypto** | AES-256-GCM (cryptography), HTTPS/TLS 1.3 |
| **Payments** | Stripe API, PIX EMV nativo |
| **DevOps** | Docker Compose, Git, Alembic |

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 20+
- Python 3.12+
- Docker Desktop
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/o-legado.git
cd o-legado
```

### 2. Suba o banco de dados
```bash
docker compose up -d
```

### 3. Configure o Backend
```bash
cd backend/fenix_evolucao
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
alembic upgrade head
python seed_admin.py
uvicorn main:app --reload --port 8001
```

### 4. Configure o Frontend
```bash
cd fenix-evolucao
npm install
cp .env.example .env.local     # Configure suas variáveis
npm run dev
```

### 5. Acesse
- **Frontend:** http://localhost:3000
- **API Docs:** http://localhost:8001/docs
- **Admin:** http://localhost:3000/admin

---

## 📁 Estrutura do Projeto

```
o-legado/
├── fenix-evolucao/              # Frontend Next.js 16
│   ├── app/                     # App Router (pages)
│   │   ├── admin/               # Painel Admin protegido
│   │   ├── assine/              # Checkout Stripe
│   │   ├── comunidade/          # Cadastro de membros
│   │   ├── dashboard/           # Dashboard + Chat IA
│   │   ├── login/               # Autenticação JWT
│   │   ├── pix/                 # Checkout PIX nativo
│   │   ├── sos/                 # Emergência SOS
│   │   └── api/                 # API Routes (proxy)
│   └── components/              # Componentes React
│
├── backend/fenix_evolucao/      # Backend FastAPI
│   ├── api/v1/                  # Endpoints REST
│   │   ├── auth.py              # Login/Registro
│   │   ├── usuarios.py          # CRUD Usuários
│   │   ├── trilhas.py           # Trilhas educacionais
│   │   ├── tutor.py             # Chat IA criptografado
│   │   ├── chat.py              # Streaming IA
│   │   ├── pagamentos.py        # Webhooks Stripe
│   │   └── seguranca.py         # SOS + Cercas Virtuais
│   ├── models/                  # SQLAlchemy Models
│   ├── schemas/                 # Pydantic Schemas
│   ├── services/                # Business Logic
│   │   ├── auth_service.py      # JWT + Bcrypt
│   │   ├── ai_service.py        # LangChain + Ollama
│   │   ├── crypto_service.py    # AES-256 E2EE
│   │   └── tutor_service.py     # RAG Pipeline
│   └── alembic/                 # Database Migrations
│
└── docker-compose.yml           # PostgreSQL 16
```

---

## 🔐 Segurança

- ✅ **LGPD Compliant** — Criptografia ponta-a-ponta, consentimento explícito
- ✅ **AES-256-GCM** — Mesmo padrão usado por bancos e governos
- ✅ **JWT em HttpOnly Cookies** — Imune a ataques XSS
- ✅ **Bcrypt** — Hash de senhas com salt automático
- ✅ **IA 100% Local** — Nenhum dado da usuária sai do dispositivo
- ✅ **OWASP Top 10** — Proteção contra SQL Injection, XSS, CSRF

---

## 👤 Autor

**Matheus Brito**  
Desenvolvedor Full-Stack | Graduando em IA & Machine Learning

- 🌐 [matheusbritosc.com.br](https://matheusbritosc.com.br)

---

## 📄 Licença

Este projeto é open-source sob a licença [MIT](LICENSE).

---

<div align="center">

**Proteção · Evolução · Esperança**

*Construído com 💚 para proteger quem mais precisa.*

</div>
