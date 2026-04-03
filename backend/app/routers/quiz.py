from fastapi import APIRouter
from app.models.schemas import QuizAnswers, ProfileResult
from app.services.profile_engine import PROFILES

router = APIRouter()

QUESTIONS = [
    {
        "id": 1,
        "category": "Objetivos",
        "question": "Qual seu principal objetivo ao investir?",
        "description": "Seu objetivo determina o tempo e o risco que você pode assumir.",
        "options": [
            {"label": "Preservar meu dinheiro (Segurança)", "points": 1},
            {"label": "Comprar algo em curto prazo (1-2 anos)", "points": 2},
            {"label": "Aumentar meu patrimônio (Longo prazo)", "points": 3},
            {"label": "Viver de renda o quanto antes", "points": 4},
        ]
    },
    {
        "id": 2,
        "category": "Risco",
        "question": "Se seus investimentos caíssem 20% em um mês, o que você faria?",
        "description": "Avalie sua reação emocional e financeira a perdas temporárias.",
        "options": [
            {"label": "Venderia tudo imediatamente", "points": 1},
            {"label": "Ficaria preocupado e venderia uma parte", "points": 2},
            {"label": "Manteria o investimento e esperaria recuperar", "points": 3},
            {"label": "Compraria mais, aproveitando a queda", "points": 4},
        ]
    },
    {
        "id": 3,
        "category": "Experiência",
        "question": "Qual seu nível de conhecimento sobre o mercado financeiro?",
        "description": "Isso ajuda a definir produtos mais ou menos complexos.",
        "options": [
            {"label": "Nenhum (Nunca investi)", "points": 1},
            {"label": "Básico (Conheço Poupança/Tesouro)", "points": 2},
            {"label": "Intermediário (Já invisto em Ações/FIIs)", "points": 3},
            {"label": "Avançado (Opero derivativos/exterior)", "points": 4},
        ]
    },
    {
         "id": 4,
         "category": "Horizonte",
         "question": "Por quanto tempo pretende manter seus investimentos?",
         "description": "O tempo é o melhor amigo do investidor de risco.",
         "options": [
             {"label": "Menos de 1 ano", "points": 1},
             {"label": "Entre 1 e 3 anos", "points": 2},
             {"label": "Entre 3 e 10 anos", "points": 3},
             {"label": "Mais de 10 anos", "points": 4},
         ]
    }
]

@router.get("/questions")
def get_questions():
    return {"questions": QUESTIONS}

@router.post("/evaluate", response_model=ProfileResult)
def evaluate(body: QuizAnswers):
    total_score = sum(body.answers.values())
    max_score = len(QUESTIONS) * 4
    percentage = (total_score / max_score) * 100

    if percentage <= 30:
        profile = "conservador"
        risk_label = "Baixo Risco"
    elif percentage <= 60:
        profile = "moderado"
        risk_label = "Médio Risco"
    elif percentage <= 85:
        profile = "arrojado"
        risk_label = "Alto Risco"
    else:
        profile = "sofisticado"
        risk_label = "Agressivo"

    p_data = PROFILES.get(profile)

    return ProfileResult(
        profile=profile,
        total_score=total_score,
        max_score=max_score,
        percentage=round(percentage, 2),
        risk_label=risk_label,
        description=p_data["description"]
    )
