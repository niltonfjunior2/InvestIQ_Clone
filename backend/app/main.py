from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import report, portfolio, quiz

app = FastAPI(title="InvestIQ API", description="API geradora de carteiras")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(report.router, prefix="/api/report", tags=["Report"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])

@app.get("/api/health")
def health_check():
    return {"status": "online"}
