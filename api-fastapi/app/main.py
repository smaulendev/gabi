from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="G.A.B.I IA API")

class RiskRequest(BaseModel):
    expirationDays: int
    temperature: float
    humidity: float


class RiskAnalysisRequest(BaseModel):
    temperature: float
    humidity: float
    active_alerts: int
    lots_near_expiration: int


@app.get("/")
def health():
    return {"status": "API FastAPI funcionando"}


@app.post("/risk")
def calculate_risk(data: RiskRequest):
    score = 0

    if data.expirationDays <= 30:
        score += 40
    elif data.expirationDays <= 60:
        score += 20

    if data.temperature > 25:
        score += 30

    if data.humidity > 70:
        score += 30

    if score >= 70:
        risk = "ALTO"
    elif score >= 40:
        risk = "MEDIO"
    else:
        risk = "BAJO"

    return {
        "risk": risk,
        "score": score
    }


@app.post("/analysis/risk")
def analyze_risk(data: RiskAnalysisRequest):

    score = 0

    if data.temperature > 8:
        score += 40

    if data.humidity > 70:
        score += 20

    score += data.active_alerts * 10
    score += data.lots_near_expiration * 15

    if score >= 70:
        level = "HIGH"
    elif score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    recommendation = (
        "Revisar cadena de frío y rotación FEFO."
        if level != "LOW"
        else "Operación estable."
    )

    return {
        "risk_score": score,
        "risk_level": level,
        "recommendation": recommendation,
    }