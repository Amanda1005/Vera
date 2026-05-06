from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MIN_TVL_USD = 1_000_000

TOKENS_WE_CARE_ABOUT = ["SOL", "USDC", "USDT", "ETH", "WBTC", "JITOSOL", "MSOL"]

PROTOCOL_DISPLAY = {
    "kamino-lend": "Kamino",
    "save": "Save (Solend)",
}

STRESS_SCENARIOS = {
    "luna_2022": {
        "name": "Luna Collapse (May 2022)",
        "description": "UST depegged, LUNA crashed 99%. Caused mass liquidations across DeFi.",
        "shocks": {
            "SOL": -0.65, "ETH": -0.40, "USDC": 0.0, "USDT": -0.02,
            "WBTC": -0.35, "JITOSOL": -0.65, "MSOL": -0.65,
        }
    },
    "ftx_2022": {
        "name": "FTX Collapse (Nov 2022)",
        "description": "FTX filed for bankruptcy. SOL dropped 60% in days.",
        "shocks": {
            "SOL": -0.60, "ETH": -0.25, "USDC": 0.0, "USDT": 0.0,
            "WBTC": -0.20, "JITOSOL": -0.60, "MSOL": -0.60,
        }
    },
    "rate_hike_2023": {
        "name": "Fed Rate Hike Shock (2023)",
        "description": "Aggressive rate hikes caused risk-off sentiment. DeFi yields compressed.",
        "shocks": {
            "SOL": -0.30, "ETH": -0.25, "USDC": 0.0, "USDT": 0.0,
            "WBTC": -0.20, "JITOSOL": -0.30, "MSOL": -0.30,
        }
    }
}

def fetch_defillama_data():
    resp = requests.get("https://yields.llama.fi/pools", timeout=15)
    data = resp.json()["data"]
    return [
        p for p in data
        if p["chain"] == "Solana"
        and p["project"] in PROTOCOL_DISPLAY
        and p["symbol"] in TOKENS_WE_CARE_ABOUT
        and (p["tvlUsd"] or 0) >= MIN_TVL_USD
        and (p["apy"] or 0) > 0
    ]

def calculate_risk_score(pool):
    apy = pool.get("apy") or 0
    tvl = pool.get("tvlUsd") or 0
    
    tvl_score = min(tvl / 50_000_000, 1.0)
    
    # 用 APY 波動性估算風險
    apy_30d = pool.get("apyMean30d") or apy
    if apy_30d > 0:
        volatility = abs(apy - apy_30d) / apy_30d
    else:
        volatility = 0
    
    risk_score = (volatility * 0.5) + ((1 - tvl_score) * 0.5)
    
    if apy > 0:
        risk_adjusted_score = apy / (risk_score + 0.01)
    else:
        risk_adjusted_score = 0

    return {
        "supplyApy": round(apy, 4),
        "totalSupplyUsd": round(tvl, 2),
        "riskScore": round(risk_score * 100, 2),
        "riskAdjustedScore": round(risk_adjusted_score, 4),
    }

@app.get("/")
def root():
    return {"message": "Vera API is running"}

@app.get("/api/protocols")
def get_protocols():
    pools = fetch_defillama_data()
    results = []
    seen = set()
    
    for pool in pools:
        token = pool["symbol"]
        protocol = PROTOCOL_DISPLAY[pool["project"]]
        key = f"{protocol}-{token}"
        
        if key in seen:
            continue
        seen.add(key)
        
        metrics = calculate_risk_score(pool)
        results.append({
            "protocol": protocol,
            "token": token,
            **metrics
        })
    
    results.sort(key=lambda x: x["riskAdjustedScore"], reverse=True)
    return {"data": results}

@app.get("/api/stress-test/{scenario_id}")
def stress_test(scenario_id: str, amount: float = 1000):
    if scenario_id not in STRESS_SCENARIOS:
        return {"error": "Scenario not found"}

    scenario = STRESS_SCENARIOS[scenario_id]
    pools = fetch_defillama_data()
    
    seen = set()
    results = []
    for pool in pools:
        token = pool["symbol"]
        if token in seen:
            continue
        seen.add(token)
        
        shock = scenario["shocks"].get(token, 0)
        loss_usd = amount * abs(shock) if shock < 0 else 0
        
        results.append({
            "token": token,
            "shock": round(shock * 100, 1),
            "valueAfter": round(amount * (1 + shock), 2),
            "lossUsd": round(loss_usd, 2),
        })

    return {
        "scenario": scenario["name"],
        "description": scenario["description"],
        "inputAmount": amount,
        "results": results
    }

@app.get("/api/optimize")
def optimize(amount: float = 1000, risk_profile: str = "medium"):
    pools = fetch_defillama_data()
    
    seen = set()
    all_metrics = []
    for pool in pools:
        token = pool["symbol"]
        protocol = PROTOCOL_DISPLAY[pool["project"]]
        key = f"{protocol}-{token}"
        if key in seen:
            continue
        seen.add(key)
        metrics = calculate_risk_score(pool)
        all_metrics.append({"token": token, "protocol": protocol, **metrics})

    stablecoins = ["USDC", "USDT"]
    
    if risk_profile == "conservative":
        stable_pct, volatile_pct = 0.7, 0.3
        candidates = sorted(all_metrics, key=lambda x: x["riskScore"])[:4]
    elif risk_profile == "aggressive":
        stable_pct, volatile_pct = 0.2, 0.8
        candidates = sorted(all_metrics, key=lambda x: x["riskAdjustedScore"], reverse=True)[:4]
    else:
        stable_pct, volatile_pct = 0.4, 0.6
        candidates = sorted(all_metrics, key=lambda x: x["riskAdjustedScore"], reverse=True)[:4]

    stable = [m for m in candidates if m["token"] in stablecoins]
    volatile = [m for m in candidates if m["token"] not in stablecoins]

    recommendations = []
    for m in stable:
        alloc = amount * stable_pct / max(len(stable), 1)
        recommendations.append({
            "token": m["token"], "protocol": m["protocol"],
            "allocatedUsd": round(alloc, 2),
            "allocatedPct": round(stable_pct / max(len(stable), 1) * 100, 1),
            "expectedApy": m["supplyApy"],
            "riskScore": m["riskScore"],
            "riskLevel": "Low Risk" if m["riskScore"] < 30 else "Medium Risk",
            "expectedYearlyReturn": round(alloc * m["supplyApy"] / 100, 2),
        })
    for m in volatile:
        alloc = amount * volatile_pct / max(len(volatile), 1)
        recommendations.append({
            "token": m["token"], "protocol": m["protocol"],
            "allocatedUsd": round(alloc, 2),
            "allocatedPct": round(volatile_pct / max(len(volatile), 1) * 100, 1),
            "expectedApy": m["supplyApy"],
            "riskScore": m["riskScore"],
            "riskLevel": "Low Risk" if m["riskScore"] < 30 else "Medium Risk" if m["riskScore"] < 60 else "High Risk",
            "expectedYearlyReturn": round(alloc * m["supplyApy"] / 100, 2),
        })

    total_yearly = sum(r["expectedYearlyReturn"] for r in recommendations)
    protocol_fee = round(amount * 0.001, 2)

    return {
        "inputAmount": amount,
        "riskProfile": risk_profile,
        "recommendations": recommendations,
        "summary": {
            "totalYearlyReturn": round(total_yearly, 2),
            "effectiveApy": round(total_yearly / amount * 100, 4),
            "protocolFee": protocol_fee,
            "netYearlyReturn": round(total_yearly - protocol_fee, 2),
        }
    }

@app.get("/api/optimize-with-risk")
def optimize_with_risk(amount: float = 1000, risk_profile: str = "medium"):
    optimize_result = optimize(amount, risk_profile)
    
    stress_results = {}
    for scenario_id, scenario in STRESS_SCENARIOS.items():
        total_loss = 0
        total_value_after = 0
        for rec in optimize_result["recommendations"]:
            token = rec["token"]
            allocated = rec["allocatedUsd"]
            shock = scenario["shocks"].get(token, 0)
            loss = allocated * abs(shock) if shock < 0 else 0
            total_loss += loss
            total_value_after += allocated * (1 + shock)
        
        stress_results[scenario_id] = {
            "name": scenario["name"],
            "totalLoss": round(total_loss, 2),
            "valueAfter": round(total_value_after, 2),
            "lossPercent": round(total_loss / amount * 100, 1)
        }
    
    return {**optimize_result, "stressTests": stress_results}

@app.get("/api/ai-analysis")
def ai_analysis(amount: float = 1000, risk_profile: str = "medium"):
    optimize_result = optimize_with_risk(amount, risk_profile)
    
    recommendations = optimize_result["recommendations"]
    stress_tests = optimize_result["stressTests"]
    summary = optimize_result["summary"]
    
    prompt = f"""You are a DeFi risk analyst. Analyze this portfolio and respond in exactly this JSON format, no other text:

{{
  "why": "One sentence explaining why this allocation suits a {risk_profile} risk investor",
  "risk": "One sentence about the biggest risk based on stress test results",
  "action": "One specific actionable recommendation in one sentence"
}}

Portfolio: ${amount} total, {risk_profile} risk profile
Allocation: {", ".join([f"{r['token']} on {r['protocol']} ({r['allocatedPct']}%)" for r in recommendations])}
Effective APY: {summary['effectiveApy']}%
Worst stress test loss: {max([v['lossPercent'] for v in stress_tests.values()])}%

Respond ONLY with the JSON object, no markdown, no explanation."""

    response = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": os.getenv("ANTHROPIC_API_KEY"),
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        },
        json={
            "model": "claude-haiku-4-5-20251001",
            "max_tokens": 500,
            "messages": [{"role": "user", "content": prompt}]
        }
    )
    
    if response.status_code == 200:
        import json as json_lib
        raw = response.json()["content"][0]["text"]
        try:
            clean = raw.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            ai_text = json_lib.loads(clean.strip())
        except:
            ai_text = {"why": raw, "risk": "", "action": ""}
    else:
        ai_text = {"why": "AI analysis temporarily unavailable.", "risk": "", "action": ""}
    
    return {
        **optimize_result,
        "aiAnalysis": ai_text
    }