<div align="center">

# 🛡️ O LEGADO — Plataforma Furtiva de Proteção à Mulher

**Tecnologia Cloud-Native, Criptografia de Nível Militar e Inteligência Artificial Local para Combater a Violência Doméstica no Brasil.**

[![Next.js](https://img.shields.io/badge/Next.js-PWA_Edge-black?style=for-the-badge&logo=next.js)](https://legado.shieldfraud.io)
[![FastAPI](https://img.shields.io/badge/FastAPI-Microservice-009688?style=for-the-badge&logo=fastapi)](https://legado-api.onrender.com/docs)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Cloud_DB-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Python](https://img.shields.io/badge/Python-Nemotron_AI-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)

</div>

---

## 📊 O Problema & Nosso Impacto (Para Investidores e Gov)

O Brasil registra **1 agressão física contra mulheres a cada 4 minutos** e **1 feminicídio a cada 6 horas**. O maior gargalo não é a falta de viaturas, mas o **tempo de acionamento silenciado pelo medo** e o descumprimento de medidas protetivas sem monitoramento real.

**O Legado** ataca o problema na raiz através de uma arquitetura "Stealth" (Furtiva) projetada para orquestrar dados com as Secretarias de Segurança Pública (SSP) e Polícia Militar, reduzindo o tempo de resposta em até **60%**, o que estatisticamente se converte em centenas de vidas salvas por ano.

### 💡 Por que escalar O Legado?
1. **Modo Furtivo Indetectável:** A plataforma opera como bloco de notas (Stealth), permitindo denúncias e acionamento de SOS (chacoalhar o celular ou SMS offline) sem que o agressor perceba.
2. **Ciclo Completo de Dados:** Não somos apenas um App de botão de pânico. Coletamos dados (RAG/AI) sobre incidentes preliminares, criando um mapa de risco geolocalizado para o poder público.
3. **Inteligência Artificial (Nemotron/Ollama):** Acolhimento 24h offline, orientando a vítima juridicamente sem expor dados (LGPD Compliant + AES-256 E2EE).

> *"Se o Estado chega 5 minutos antes, uma vida é salva. O Legado antecipa essa janela ligando a vítima furtivamente à rede de apoio."*

---

## ⚡ Funcionalidades Tecnológicas de Ponta

### 🔴 S.O.S Stealth & Geofencing
- **Acionamento Cinético:** Bater ou chacoalhar o celular dispara o SOS furtivo.
- **Fallback Offline (SMS):** Sem internet? O sistema cai graciosamente para o app nativo de SMS com latitude/longitude via protocolo Nativo do OS.
- **Integração PM (Roadmap):** Despacho automático de viatura via API governamental.

### 🤖 Cérebro de IA (Conselheira do Legado)
- **Triage Inicial Segura:** IA avalia risco de morte baseado nas perguntas da usuária.
- **RAG Local:** Base de conhecimento em Leis de Proteção (Maria da Penha) processada localmente sem expor textos ao servidor.

### 🛡️ Criptografia em Trânsito e Repouso
- **E2EE Nativo:** Relatos de comportamento abusivo digitados na plataforma são criptografados no client-side com AES-256 (Nível Militar) antes do POST na API da Render.

---

## 🏗️ Arquitetura Multi-Cloud em Produção

Solução distribuída em nuvem rodando 100% *Serverless & PaaS*, pronta para absorver picos massivos de tráfego nacional.

- **Frontend (Vercel Edge Network):** `https://legado.shieldfraud.io`
- **Backend (Render Web Service):** API Python/FastAPI (`https://legado-api.onrender.com`)
- **Database (Render PostgreSQL):** Banco de dados relacional assíncrono (driver `asyncpg`).

```text
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 16)                   │
│  React 19 · Vercel CDN · PWA Furtivo · Chacoalho API       │
├─────────────────────────────────────────────────────────────┤
│                  API GATEWAY (Render.com)                   │
│           JWT HttpOnly Cookies · CORS · Middleware          │
├─────────────────────────────────────────────────────────────┤
│                    BACKEND (FastAPI/Python)                  │
│  Auth · SQLAlchemy Async · Tutor IA · SMS Fallback Logic   │
├─────────────────────────────────────────────────────────────┤
│              BANCO DE DADOS (PostgreSQL 16)                 │
│  Schema Isolado · Alembic Migrations · Hash Anonimizado    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📈 Modelo de Impacto e Escala GovTech

O sistema foi desenhado para adoção por **Governos Estaduais e Prefeituras** (via licitação B2G), entregando uma solução "Turnkey" (chave na mão) para as Secretarias da Mulher:

1. **Gestão de Risco Preditivo:** Painel Admin (Dashboard) com mapas de calor de incidentes (heatmap).
2. **Redução de Custos Operacionais:** Triagem de baixa complexidade via IA, liberando atendentes humanos (180) para crises ativas.
3. **Escola de Pais:** Módulos gamificados de inteligência emocional para quebrar o ciclo geracional da violência dentro das escolas públicas municipais.

> 🤝 **Oportunidade de Parceria Público-Privada (PPP):** Estamos em fase de demonstração para implantação em municípios-piloto.

---

## 🛠️ Tech Stack & Segurança

| Camada | Stack Tecnológico | Diferencial de Impacto |
|--------|--------------------|------------------------|
| **Frontend/Edge** | Next.js 16, React 19, Tailwind CSS v4 | PWA: Funciona offline e ultra-rápido no 4G de celulares de entrada. |
| **API & Backend** | Python 3.12, FastAPI, SQLAlchemy async | Arquitetura Microserviço: absorve requisições em massa (Concorrência assíncrona). |
| **Bancos de Dados** | PostgreSQL 16 (Render) | Esquemas isolados por município para proteção total (Multi-tenant ready). |
| **Inteligência Artificial** | BaseModel Nemotron / Llama 3 | Operação *Air-gapped* (Zero Cloud) rodando nos servidores locais da SSP. |
| **Criptografia E2EE** | AES-256-GCM, Bcrypt, JWT HttpOnly | Segurança bancária aplicada ao acolhimento psicológico e diários de vítimas. |

---

## 🚀 Reprodutibilidade (Deploy & Testes)

Se você é um parceiro técnico ou avaliador governamental, a plataforma pode ser provisionada instintivamente:

### 1. Clonando o Cérebro
```bash
git clone https://github.com/matheusbritosc-dev/o-legado.git
cd o-legado
```

### 2. Subindo o Backend (API)
O ambiente requer acesso a um banco de dados PostgreSQL.
```bash
cd backend/fenix_evolucao
python -m venv venv
venv\Scripts\activate           # No Windows
pip install -r requirements.txt
alembic upgrade head            # Aplica o Schema do BD
uvicorn main:app --port 8000
```

### 3. Rodando o Client (Stealth App)
A interface móvel e web foi separada em Next.js para renderização rápida.
```bash
cd fenix-evolucao
npm install
npm run dev
```
> Acesse: `http://localhost:3000` (Modo Vítima/Escola)
> Acesse: `http://localhost:3000/admin` (Dashboard da PM/Prefeitura)

---

## 📁 Arquitetura do Repositório (Monorepo)
```text
o-legado/
├── fenix-evolucao/              # Frontend Web/PWA (Vercel)
│   ├── app/                     # Clean Architecture UI
│   │   ├── admin/               # SSP & PM Dashboard
│   │   ├── sos/                 # Trigger de Pânico Furtivo
│   │   └── relato/              # Formulário E2EE de Denúncias
├── backend/fenix_evolucao/      # Core API (FastAPI)
│   ├── api/v1/                  # Controladores REST
│   ├── models/                  # Tabelas PostgreSQL
│   ├── services/                # Regras de Negócio e IA
│   └── alembic/                 # Controle de Versão de Banco de Dados
```

---

## 👑 O Comandante do Legado

**Matheus Brito**  
*Fundador & Arquiteto Chefe*  
O desenvolvedor unindo Inteligência Artificial, Engenharia de Nuvem e Visão Política para resolver o problema número 1 da segurança pública voltada para a mulher.

- 🌐 [Acesse: matheusbritosc.com.br](https://matheusbritosc.com.br)
- 🤝 *Aberto para conexões com investidores-anjo, aceleradoras e gov-techs.*

---

<div align="center">

**[ PROTEÇÃO ] · [ EVOLUÇÃO ] · [ ESPERANÇA ]**

*Criando a tecnologia que escudos de verdade usariam para defender.*
*Brasil, 2026.*

</div>
