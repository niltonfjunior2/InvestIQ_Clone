"""InvestIQ — Pydantic Schemas"""

from enum import Enum
from typing import Dict, List, Any
from pydantic import BaseModel, Field


class ProfileType(str, Enum):
    conservador = "conservador"
    moderado    = "moderado"
    arrojado    = "arrojado"
    sofisticado = "sofisticado"


# ── Quiz ─────────────────────────────────────────────────────────────────────

class QuizAnswers(BaseModel):
    answers: Dict[int, int]


class ProfileResult(BaseModel):
    profile:     str
    total_score: int
    max_score:   int
    percentage:  float
    risk_label:  str
    description: str


# ── Simulation ────────────────────────────────────────────────────────────────

class SimulationRequest(BaseModel):
    profile:         ProfileType
    initial_amount:  float = Field(..., gt=0, description="Valor inicial em R$")
    monthly_contrib: float = Field(default=0, ge=0, description="Aporte mensal em R$")
    years:           int   = Field(..., ge=1, le=50, description="Horizonte em anos")


class SimulationResponse(BaseModel):
    data:              List[Dict[str, Any]]
    weighted_return:   float
    final_carteira:    float
    final_cdi:         float
    final_ibovespa:    float
    gain_vs_cdi:       float
    total_contributed: float
    roi_percentage:    float


# ── Report ────────────────────────────────────────────────────────────────────

class InsightRequest(BaseModel):
    profile:         ProfileType
    initial_amount:  float = Field(default=100000, gt=0)
    monthly_contrib: float = Field(default=0, ge=0)
    years:           int   = Field(default=10, ge=1, le=50)


class InsightResponse(BaseModel):
    insight: str
    profile: str
