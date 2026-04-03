# Technical Report: InvestigQ Migration to Cloud (Vercel)

Este documento detalha o processo de migração do **InvestIQ**, um sistema Full-Stack de recomendações de portfólio financeiro, de um protótipo offline para uma aplicação web funcional e implantada na nuvem.

## 1. Arquitetura da Solução

A aplicação utiliza uma arquitetura monorepo moderna, separando claramente as responsabilidades entre frontend e backend.

### Frontend
- **Framework**: React.js com Vite.
- **Estilização**: Tailwind CSS.
- **Gráficos**: Recharts para visualização de alocação de ativos e evolução patrimonial.
- **Comunicação**: Cliente API centralizado usando Axios, configurado para operar tanto em desenvolvimento local quanto em produção.

### Backend
- **Framework**: FastAPI (Python).
- **Modelo de Deploy**: Serverless Functions (Vercel).
- **Módulos Reconstruídos**: Lógicas de roteamento para Quiz (avaliação de risco), Portfólio (alocação de ativos) e Simulação (cálculos de juros compostos).

---

## 2. Integração com Inteligência Artificial

Um dos pilares do projeto é a **Análise Personalizada com IA**. Durante o desenvolvimento, realizamos uma migração crítica de modelos:

- **Original**: Anthropic (Claude).
- **Atual**: **Google Generative AI (Gemini 1.5 Flash)**.
- **Motivação**: Eficiência de latência e integração facilitada com o ecossistema de APIs do Google.
- **Implementação**: O sistema constrói um prompt dinâmico baseado no perfil do investidor e parâmetros financeiros, retornando insights qualitativos sobre diversificação e risco.

---

## 3. Desafios de Infraestrutura e Soluções

O deploy na Vercel apresentou desafios de orquestração que exigiram intervenções precisas:

### Bloqueio do .gitignore
- **Problema**: Regras genéricas no arquivo .gitignore da raiz estavam impedindo o envio de arquivos fundamentais para o GitHub (pi.js, main.py, quiz.py).
- **Solução**: Refatoração do .gitignore para usar caminhos absolutos à raiz (/api.js), garantindo que os arquivos correspondentes dentro de pastas de serviço (rontend/, ackend/) fossem devidamente rastreados.

### Gerenciamento de Versão do Python
- **Problema**: Conflito entre o runtime padrão do Vercel e as dependências do projeto (Python 3.11 vs 3.12).
- **Solução**: Implementação de arquivos .python-version coordenados, forçando o builder do Vercel a utilizar o CPython 3.12 conforme exigido pelas especificações do projeto.

### Orquestração Monorepo (vercel.json)
- **Problema**: Erro de "Multiple Services" ao tentar construir React e FastAPI simultaneamente.
- **Solução**: Substituição do formato legado de uilds no ercel.json por uma configuração moderna de ewrites e unctions, separando o roteamento da API (/api/*) do roteamento da Single Page Application (/*).

---

## 4. Estrutura de Dados e API

Para garantir a fluidez da experiência do usuário, padronizamos as interfaces de comunicação:

- **Quiz API**: Redesenhado para garantir que os payloads de respostas (QuizAnswers) fossem validados pelo Pydantic no backend.
- **Simulation Engine**: Implementação de um motor de cálculo de juros compostos (v2) que simula o crescimento do patrimônio comparado a benchmarks brasileiros como CDI e Ibovespa.

---

## 5. Como Configurar (Auto-Hospedagem)

Para replicar este ambiente:
1. Obtenha uma chave de API no [Google AI Studio](https://aistudio.google.com/).
2. Adicione-a às variáveis de ambiente da Vercel como GEMINI_API_KEY.
3. Conecte o repositório GitHub e deixe o Vercel detectar as configurações automaticamente através do ercel.json e .python-version presentes na raiz.

---

**Equipe de Desenvolvimento InvestIQ**  
*Abril de 2026*
