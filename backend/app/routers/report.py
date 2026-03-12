"""InvestIQ — Report / AI Insight Router"""

import os
from fastapi import APIRouter, HTTPException
from app.models.schemas import InsightRequest, InsightResponse
from app.services.ai_insight import generate_insight
from app.services.profile_engine import get_portfolio

router = APIRouter()


@router.post("/insight", response_model=InsightResponse)
def get_insight(body: InsightRequest):
    """
    Gera análise personalizada da carteira usando Claude (Anthropic).
    Requer ANTHROPIC_API_KEY configurada no ambiente.
    """
    if not os.getenv("ANTHROPIC_API_KEY"):
        raise HTTPException(
            status_code=400,
            detail="ANTHROPIC_API_KEY não configurada. Adicione ao arquivo .env.",
        )
    text = generate_insight(
        profile_key     = body.profile.value,
        initial_amount  = body.initial_amount,
        monthly_contrib = body.monthly_contrib,
        years           = body.years,
    )
    return InsightResponse(insight=text, profile=body.profile.value)


@router.get("/summary/{profile}")
def get_summary(
    profile: str,
    amount:  float = 100000,
    years:   int   = 10,
    monthly: float = 0,
):
    """
    Retorna resumo completo do perfil: portfólio + projeção principal.
    """
    from app.services.simulation import run_simulation
    portfolio = get_portfolio(profile)
    simulation = run_simulation(profile, amount, monthly, years)

    return {
        "profile":    portfolio,
        "simulation": simulation,
        "params": {
            "initial_amount":  amount,
            "monthly_contrib": monthly,
            "years":           years,
        },
    }
