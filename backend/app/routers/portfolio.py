"""InvestIQ — Portfolio Router"""

from fastapi import APIRouter, HTTPException
from app.services.profile_engine import get_portfolio, PROFILES

router = APIRouter()

VALID_PROFILES = list(PROFILES.keys())


def _check_profile(profile: str):
    if profile not in VALID_PROFILES:
        raise HTTPException(
            status_code=404,
            detail=f"Perfil '{profile}' não encontrado. Opções: {VALID_PROFILES}",
        )


@router.get("/{profile}")
def get_portfolio_by_profile(profile: str):
    """Retorna o portfólio completo recomendado para o perfil."""
    _check_profile(profile)
    return get_portfolio(profile)


@router.get("/{profile}/allocation-summary")
def get_allocation_summary(profile: str):
    """Retorna o resumo de alocação por classe de ativo."""
    _check_profile(profile)
    p = PROFILES[profile]
    summary: dict = {}
    for asset in p["assets"]:
        asset_type = asset["type"]
        summary[asset_type] = summary.get(asset_type, 0) + asset["allocation"]

    return {
        "profile":    profile,
        "allocation": [
            {"type": k, "percentage": v}
            for k, v in sorted(summary.items(), key=lambda x: -x[1])
        ],
    }


@router.get("/{profile}/risk-metrics")
def get_risk_metrics(profile: str):
    """Retorna métricas de risco do portfólio."""
    _check_profile(profile)
    p = PROFILES[profile]

    risk_map = {"Baixíssimo": 1, "Baixo": 2, "Médio": 3, "Alto": 4, "Muito Alto": 5, "Altíssimo": 6}

    weighted_risk = sum(
        risk_map.get(a["risk"], 3) * a["allocation"] / 100
        for a in p["assets"]
    )

    weighted_return = sum(
        a["annual_return"] * a["allocation"] / 100
        for a in p["assets"]
    ) / 100

    return {
        "profile":          profile,
        "risk_score":       p["risk_score"],
        "weighted_risk":    round(weighted_risk, 2),
        "weighted_return":  round(weighted_return * 100, 2),
        "volatility_label": p["characteristics"][1] if len(p["characteristics"]) > 1 else "",
        "assets_count":     len(p["assets"]),
    }
