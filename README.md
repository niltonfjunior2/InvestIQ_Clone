# 📈 InvestIQ — Plataforma de Recomendação de Investimentos com IA

<div align="center">

![InvestIQ Banner](https://img.shields.io/badge/InvestIQ-Live_on_Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)

**O InvestIQ agora é Cloud Native!**
Migration from offline prototypes to a fully functional Full-Stack deployment on Vercel.

[📘 Relatório Técnico de Migração](TECHNICAL_REPORT.md) · [Demo](#-demo) · [Arquitetura](#-arquitetura) · [Instalação](#-instalação)

</div>

---

## ✨ Visão Geral

O **InvestIQ** é uma plataforma de assessoria de investimentos automatizada, inspirada nas práticas de private banking do mercado financeiro brasileiro. O sistema identifica o perfil de risco do investidor (suitability), recomenda uma carteira de ativos adequada, simula o crescimento patrimonial com aportes mensais e gera relatórios profissionais em PDF com análise de IA.

### O problema que resolve

Investidores individuais frequentemente escolhem produtos inadequados ao seu perfil de risco, seja por falta de educação financeira ou por ausência de uma ferramenta acessível de assessoria. O InvestIQ democratiza o processo de suitability — normalmente restrito a grandes assessores e bancos privados — tornando-o interativo, educativo e visualmente rico.

---

## 🎯 Funcionalidades

| Módulo | Funcionalidade | Tecnologia |
|--------|---------------|------------|
| **Quiz de Suitability** | 8 perguntas ponderadas que identificam o perfil (Conservador / Moderado / Arrojado / Sofisticado) | React + FastAPI |
| **Carteira Personalizada** | Alocação ótima por classe de ativo com retorno, risco, liquidez e rating | Profile Engine (Python) |
| **Simulador Patrimonial** | Projeção com juros compostos + aportes mensais vs CDI / Ibovespa / Poupança | FV Formula (Python) |
| **Dados de Mercado** | Cotações reais via Alpha Vantage API (preço, variação, volume, max/min) | httpx + AsyncIO |
| **Benchmarks** | Comparação de retorno esperado vs CDI, IPCA, Ibovespa, IFIX, S&P 500 | Recharts |
| **Análise com IA** | Insight personalizado gerado pelo Claude Sonnet com contexto completo do perfil | Anthropic API |
| **Relatório PDF** | Documento de 4 páginas com capa, alocação, simulação e benchmarks | jsPDF |
| **Educação Financeira** | Explicação didática de cada classe de ativo com exemplos da carteira | React |

---

## 🏗 Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                         InvestIQ Pro                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────────┐        ┌───────────────────────────┐    │
│   │   Frontend       │        │      Backend              │    │
│   │   React + Vite   │◄──────►│      FastAPI              │    │
│   │   Port :5173     │  HTTP  │      Port :8000           │    │
│   │                  │        │                           │    │
│   │  ┌────────────┐  │        │  ┌─────────────────────┐ │    │
│   │  │ Quiz UI    │  │        │  │  /api/quiz          │ │    │
│   │  │ Dashboard  │  │        │  │  /api/portfolio     │ │    │
│   │  │ Simulator  │  │        │  │  /api/simulation    │ │    │
│   │  │ PDF Export │  │        │  │  /api/market        │ │    │
│   │  │ AI Insight │  │        │  │  /api/report        │ │    │
│   │  └────────────┘  │        │  └─────────────────────┘ │    │
│   └──────────────────┘        └───────────┬───────────────┘    │
│                                           │                     │
│              ┌────────────────────────────┼──────────────────┐  │
│              │        Serviços Externos   │                  │  │
│              │                           ▼                  │  │
│              │   ┌──────────────┐  ┌──────────────────────┐ │  │
│              │   │   Anthropic  │  │   Alpha Vantage API  │ │  │
│              │   │   Claude API │  │   (Cotações Reais)   │ │  │
│              │   │   (Insights) │  │   B3 + NYSE          │ │  │
│              │   └──────────────┘  └──────────────────────┘ │  │
│              └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Stack tecnológico

**Backend:**

- **FastAPI** — API REST assíncrona com documentação automática OpenAPI
- **Pydantic v2** — Validação de dados e serialização tipada
- **httpx** — Cliente HTTP assíncrono para integração Alpha Vantage
- **Anthropic SDK** — Integração com Claude para análise com IA
- **Uvicorn** — ASGI server de alta performance

**Frontend:**

- **React 18** — UI declarativa com hooks
- **Vite** — Build tool moderno com HMR
- **Recharts** — Gráficos de linha, área, pizza e barras
- **Lucide React** — Ícones SVG
- **Axios** — HTTP client com interceptors
- **jsPDF** — Geração de relatório PDF no browser

**Infraestrutura:**

- **Docker Compose** — Orquestração local com multi-container
- **Nginx** — Serve o frontend em produção (SPA fallback configurado)
- **Multi-stage Dockerfile** — Imagens enxutas e seguras

---

## 📊 Perfis de Investidor

| Perfil | Score | Retorno Esperado | Classes de Ativo |
|--------|-------|-----------------|-----------------|
| 🔵 **Conservador** | 0–30 pts | ~10,7% a.a. | Tesouro Selic, CDB, LCI/LCA, Fundos RF |
| 🟡 **Moderado**    | 31–55 pts | ~12,1% a.a. | RF + FIIs + ETF Ibovespa + Multimercado |
| 🟣 **Arrojado**    | 56–75 pts | ~15,6% a.a. | FIIs + Blue Chips + BDRs S&P 500 |
| 🟤 **Sofisticado** | 76–80 pts | ~21,4% a.a. | Growth + Big Techs + Small Caps + Cripto |

---

## 🚀 Instalação

### Pré-requisitos

- Python 3.11+
- Node.js 20+
- Docker Desktop (opcional, mas recomendado)
- Chave da API Anthropic — [console.anthropic.com](https://console.anthropic.com)
- Chave da API Alpha Vantage — [alphavantage.co](https://www.alphavantage.co/support/#api-key) *(gratuita)*

### Opção 1 — Docker Compose (Recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/fabioestevam2404/investiq.git
cd investiq

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e insira suas API keys

# 3. Suba todos os containers
docker-compose up --build -d

# 4. Acesse
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Opção 2 — Execução local (desenvolvimento)

#### Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv .venv

# Ativar (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Ativar (macOS/Linux)
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variável de ambiente
$env:ANTHROPIC_API_KEY = "sk-ant-sua-chave-aqui"   # PowerShell
# ou
export ANTHROPIC_API_KEY="sk-ant-sua-chave-aqui"   # bash

# Iniciar servidor com hot-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variável de ambiente
cp .env.example .env.local
# Edite: VITE_API_URL=http://localhost:8000/api

# Iniciar em modo desenvolvimento
npm run dev
```

---

## 🔌 API

A documentação interativa completa está disponível em `http://localhost:8000/docs` (Swagger UI) ou `http://localhost:8000/redoc`.

### Endpoints principais

#### Quiz de Suitability

```
GET  /api/quiz/questions       → Retorna 8 perguntas com opções e pontuações
POST /api/quiz/evaluate        → Calcula perfil a partir das respostas
GET  /api/quiz/profiles        → Lista todos os perfis disponíveis
```

#### Portfólio

```
GET /api/portfolio/{profile}              → Carteira completa com todos os ativos
GET /api/portfolio/{profile}/allocation-summary → Alocação por classe de ativo
GET /api/portfolio/{profile}/risk-metrics       → Métricas de risco
```

#### Simulação

```
POST /api/simulation/run                  → Projeção patrimonial (FV com aportes mensais)
GET  /api/simulation/scenarios/{profile}  → Compara 6 cenários de aporte para o mesmo perfil
GET  /api/simulation/benchmarks           → Retorna os benchmarks com taxas
```

#### Mercado Real

```
POST /api/market/quotes    → Cotações reais via Alpha Vantage para os ativos do perfil
POST /api/market/overview  → Visão geral: Ibovespa, S&P 500 BRL, IFIX
```

#### Relatórios e IA

```
POST /api/report/insight          → Análise personalizada via Claude Sonnet
GET  /api/report/summary/{profile} → Dados completos para geração de PDF
```

### Exemplo de uso (curl)

```bash
# Avaliar quiz e obter perfil
curl -X POST http://localhost:8000/api/quiz/evaluate \
  -H "Content-Type: application/json" \
  -d '{"answers": {"1":6,"2":7,"3":7,"4":7,"5":4,"6":5,"7":7,"8":7}}'

# Simular patrimônio
curl -X POST http://localhost:8000/api/simulation/run \
  -H "Content-Type: application/json" \
  -d '{"profile":"moderado","initial_amount":100000,"monthly_contrib":2000,"years":10}'

# Gerar insight com IA
curl -X POST http://localhost:8000/api/report/insight \
  -H "Content-Type: application/json" \
  -d '{"profile":"arrojado","initial_amount":100000,"monthly_contrib":2000,"years":15,"final_patrimony":750000}'
```

---

## 📚 O que este projeto ensina

Este projeto foi desenvolvido como parte de um portfólio de Engenharia de Software com IA Aplicada, cobrindo múltiplas competências simultaneamente:

### 1. Arquitetura de sistemas

- Separação clara de responsabilidades: UI → API → Serviços → APIs externas
- Princípios REST com documentação OpenAPI automática
- Padrão de serviços com injeção de dependência (FastAPI DI)

### 2. Desenvolvimento backend com Python

- FastAPI com routers, schemas Pydantic e validação de tipos
- Programação assíncrona com `async/await` e httpx
- Tratamento de erros com HTTPException e mensagens significativas

### 3. Integração com LLMs

- Uso da Anthropic SDK para chamadas ao Claude
- Engenharia de prompt com contexto financeiro especializado
- Padrão system prompt + user prompt para outputs consistentes

### 4. Matemática financeira aplicada

- Fórmula de Valor Futuro (FV) com aportes mensais recorrentes
- Conversão de taxa anual para taxa mensal equivalente
- Comparação de benchmarks e cálculo de alpha

### 5. Frontend moderno com React

- Composição de componentes complexos com estado local
- Custom hooks para separar lógica de UI (useMarketData)
- Geração de PDF no browser com jsPDF sem dependência de servidor

### 6. Consumo de APIs externas

- Integração com Alpha Vantage respeitando rate limits
- Tratamento de erros de API (Note, Information, timeout)
- Delay assíncrono entre requisições com asyncio.sleep

### 7. Infraestrutura e DevOps

- Dockerfiles multi-stage para imagens otimizadas
- Docker Compose com healthcheck e depends_on
- Nginx como servidor de produção com configuração SPA

### 8. Design de produto e UX

- Sistema de design coeso com CSS variables
- Animações com CSS keyframes
- Acessibilidade e responsividade

---

## 🗂 Estrutura do Projeto

```
investiq/
├── backend/
│   ├── app/
│   │   ├── main.py                  # Entry point FastAPI
│   │   ├── models/
│   │   │   └── schemas.py           # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── quiz.py              # Endpoints suitability
│   │   │   ├── portfolio.py         # Endpoints portfólio
│   │   │   ├── simulation.py        # Endpoints simulação
│   │   │   ├── market.py            # Endpoints mercado real
│   │   │   └── report.py            # Endpoints relatório + IA
│   │   └── services/
│   │       ├── profile_engine.py    # Lógica de perfil e carteiras
│   │       ├── simulation.py        # Cálculos financeiros FV
│   │       ├── market.py            # Alpha Vantage client
│   │       └── ai_insight.py        # Integração Claude
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                 # Entry point React
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   └── InvestIQApp.jsx      # Componente principal
│   │   ├── services/
│   │   │   └── api.js               # Camada de comunicação com backend
│   │   └── utils/
│   │       └── formatters.js        # Helpers de formatação
│   ├── index.html
│   ├── vite.config.js
│   ├── nginx.conf                   # Configuração Nginx SPA
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🌐 APIs Externas Utilizadas

### Anthropic (Claude)

- **Modelo**: `claude-sonnet-4-20250514`
- **Uso**: Geração de análise personalizada de carteiras
- **Docs**: [docs.anthropic.com](https://docs.anthropic.com)
- **Custo**: Pay-per-use (tokens)

### Alpha Vantage

- **Uso**: Cotações reais de ações, FIIs e ETFs da B3 e NYSE
- **Plano gratuito**: 25 req/dia (suficiente para demonstração)
- **Docs**: [alphavantage.co/documentation](https://www.alphavantage.co/documentation/)

---

## ⚠️ Disclaimer

Este sistema é uma demonstração técnica e educacional. As recomendações geradas são baseadas em critérios simplificados de suitability e não constituem consultoria ou recomendação formal de investimento. Sempre consulte um assessor de investimentos habilitado pela CVM antes de tomar decisões financeiras.

---

## 👨‍💻 Autor

**Fabio Estevam**
Pós-graduação em Engenharia de Software com IA Aplicada
Experiência no mercado financeiro com clientes de alta renda

[![GitHub](https://img.shields.io/badge/GitHub-fabioestevam2404-181717?style=flat&logo=github)](https://github.com/fabioestevam2404)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Fabio_Estevam-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/fabioestevam)

---

## 📄 Licença

MIT License — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**Portfólio de Engenharia de Software com IA Aplicada**
*FastAPI · React · Anthropic · Alpha Vantage · Docker*

</div>
#   I n v e s t I Q 
 
 
