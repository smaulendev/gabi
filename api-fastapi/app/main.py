from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="G.A.B.I IA API")

class RiskRequest(BaseModel):
    expirationDays: int
    temperature: float
    humidity: float

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