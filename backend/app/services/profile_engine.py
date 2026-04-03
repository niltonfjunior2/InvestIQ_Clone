PROFILES = {
    "conservador": {
        "id": "conservador",
        "name": "Conservador",
        "description": "Foco em preservação de capital e liquidez, mitigando grandes oscilações.",
        "risk_score": 20,
        "characteristics": ["Baixa Tolerância ao Risco", "Baixa Volatilidade", "Alta Liquidez"],
        "assets": [
            {"type": "Renda Fixa Pós-fixada (Tesouro Selic/CDBs)", "allocation": 60, "risk": "Baixíssimo", "annual_return": 10.5},
            {"type": "Renda Fixa Prefixada", "allocation": 20, "risk": "Baixo", "annual_return": 11.0},
            {"type": "Renda Fixa Inflação", "allocation": 15, "risk": "Baixo", "annual_return": 10.0},
            {"type": "Fundos Imobiliários (FIIs)", "allocation": 5, "risk": "Médio", "annual_return": 8.0},
        ]
    },
    "moderado": {
        "id": "moderado",
        "name": "Moderado",
        "description": "Equilíbrio entre segurança e potencial de valorização a longo prazo.",
        "risk_score": 50,
        "characteristics": ["Tolerância Média ao Risco", "Volatilidade Controlada", "Diversificação"],
        "assets": [
            {"type": "Renda Fixa Pós-fixada", "allocation": 30, "risk": "Baixíssimo", "annual_return": 10.5},
            {"type": "Renda Fixa Inflação", "allocation": 30, "risk": "Baixo", "annual_return": 10.0},
            {"type": "Fundos Imobiliários (FIIs)", "allocation": 20, "risk": "Médio", "annual_return": 8.5},
            {"type": "Ações Brasil", "allocation": 15, "risk": "Alto", "annual_return": 12.0},
            {"type": "Investimentos Internacionais", "allocation": 5, "risk": "Alto", "annual_return": 14.0},
        ]
    },
    "arrojado": {
        "id": "arrojado",
        "name": "Arrojado",
        "description": "Maximização de ganhos tolerando forte volatilidade.",
        "risk_score": 80,
        "characteristics": ["Alta Tolerância ao Risco", "Alta Volatilidade", "Longo Prazo"],
        "assets": [
            {"type": "Ações Brasil", "allocation": 35, "risk": "Alto", "annual_return": 13.0},
            {"type": "Investimentos Internacionais (BDRs/ETFs)", "allocation": 25, "risk": "Alto", "annual_return": 14.5},
            {"type": "Fundos Imobiliários (FIIs)", "allocation": 20, "risk": "Médio", "annual_return": 9.0},
            {"type": "Renda Fixa Inflação", "allocation": 15, "risk": "Baixo", "annual_return": 10.0},
            {"type": "Renda Variável Alternativa/Cripto", "allocation": 5, "risk": "Muito Alto", "annual_return": 20.0},
        ]
    },
    "sofisticado": {
         "id": "sofisticado",
         "name": "Sofisticado",
         "description": "Exposição global, produtos restritos e ativos avançados.",
         "risk_score": 95,
         "characteristics": ["Conhecimento Avançado", "Risco Variável", "Maior Complexidade"],
         "assets": [
             {"type": "Ações Brasil/Multimercado", "allocation": 30, "risk": "Alto", "annual_return": 14.0},
             {"type": "Ações Globais", "allocation": 30, "risk": "Alto", "annual_return": 15.0},
             {"type": "Alternativos (PE, VC, Cripto)", "allocation": 15, "risk": "Muito Alto", "annual_return": 18.0},
             {"type": "Fundos Imobiliários (FIIs)", "allocation": 15, "risk": "Médio", "annual_return": 9.0},
             {"type": "Renda Fixa Inflação Longa", "allocation": 10, "risk": "Baixo", "annual_return": 10.0},
         ]
    }
}

def get_portfolio(profile: str):
    """Retorna a configuração completa de um perfil sugerido"""
    return PROFILES.get(profile, PROFILES["conservador"])
