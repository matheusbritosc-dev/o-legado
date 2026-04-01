<div align="center">

# 🦅 PhoenixGov — Sistema de Reinserção Social Ativa

**Inteligência de Dados e Tecnologia no Combate à Reincidência Criminal através da Empregabilidade.**
Desenvolvido como Prova de Conceito (MVP) para o **Governo do Estado de Goiás**.

[![React](https://img.shields.io/badge/Frontend-React_&_Tailwind-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/IA_&_Dados-Python-3776AB?style=for-the-badge&logo=python)](https://python.org/)

</div>

---

## 📊 O Desafio Público & Nossa Solução GovTech

A reincidência criminal é um dos maiores desafios para a Segurança Pública e o Sistema Penitenciário. O **PhoenixGov** atua não apenas como uma plataforma, mas como uma **política pública digitalizada**, focada em **conectar egressos do sistema prisional a oportunidades reais de emprego** em empresas parceiras, utilizando cruzamento inteligente de dados.

### 💡 Impacto Direto para Governos e Prefeituras:
1. **Redução Preditiva da Criminalidade:** A empregabilidade comprovadamente quebra o ciclo de reincidência, reduzindo os custos do Estado com o sistema carcerário de forma escalável.
2. **Ecossistema Público-Privado:** Facilita a adesão de centenas de empresas privadas que buscam promover impacto social e cumprir cotas ou programas de incentivo governamental.
3. **Decisões Baseadas em Dados (Data-Driven):** Fornece painéis de controle governamentais robustos para o acompanhamento em tempo real de métricas de sucesso, histórico de vagas e *matches* efetivados pelos egressos.

---

## ⚡ Funcionalidades Tecnológicas (MVP)

- 📈 **Dashboard Governamental Inteligente:** Visão panorâmica de métricas gerenciais (Egressos monitorados, Vagas disponíveis, Matches efetivados).
- 🤝 **Inteligência de Matching (Smart Algorithm):** Sistema que cruza habilidades profissionais, geolocalização e escolaridade para sugerir as oportunidades mais adequadas, aumentando exponencialmente a probabilidade de contratação.
- 🏢 **Hub de Oportunidades:** Cadastro simplificado para empresas parceiras ofertarem vagas de forma direta e permanentemente auditável pelo poder público.
- 📱 **Interface Fluida e Acessível:** Design responsivo e focado na usabilidade, garantindo aderência tanto para gestores públicos (desktop) quanto para os egressos (mobile).

---

## 🏗️ Arquitetura e Stack Tecnológico

O sistema foi modularizado para permitir alta escalabilidade nacional e fácil integração (API-First):

* **Backend:** Python, FastAPI, Banco de Dados Relacional (SQLite no MVP, preparado estruturalmente para PostgreSQL).
* **Frontend:** React, Vite, Tailwind CSS.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Python 3.10+**
- **Node.js 16+**

### 1. Inicializando o Backend (API)
```bash
cd backend
pip install -r requirements.txt
# (Opcional) Popula o banco com dados governamentais de teste:
python seed.py  
uvicorn main:app --reload
```
📍 **Servidor rodando em:** `http://localhost:8000`  
📚 **Documentação Interativa da API:** `http://localhost:8000/docs`

### 2. Inicializando o Frontend (Web Interface)
Abra uma nova aba em seu terminal e execute:
```bash
cd frontend
npm install
npm run dev
```
📍 **Acesse a aplicação em:** `http://localhost:5173`

---

## 🔐 Credenciais de Acesso (Ambiente de Demonstração)

Acesse o sistema com os perfis de homologação abaixo para explorar as exclusividades governamentais e do usuário padrão:

| Perfil | E-mail de Acesso | Senha |
|---|---|---|
| **Administração Pública** | `admin@goias.gov.br` | `admin123` |
| **Egresso (Exemplo)** | `egresso0@gmail.com` | `123456` |

---

<div align="center">

**Projeto desenvolvido para maximizar a reinserção, resgatar a cidadania e construir um ecossistema mais seguro e repleto de oportunidades.**

*Iniciativa GovTech — Governo de Goiás* 🏛️

</div>
