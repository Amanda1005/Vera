# Vera — AI-Powered DeFi Risk Advisor

> See through the APY. Find your true return on Solana.

## What is Vera?

Vera is an AI-powered risk-adjusted yield optimizer for Solana DeFi. Most users chase the highest APY without understanding the risk behind it. Vera changes that.

Input your capital and risk tolerance, and Vera pulls real-time data from Kamino Finance and Save (Solend), calculates a risk-adjusted score for each asset, and recommends the optimal allocation. An AI analyst then explains the rationale, highlights key risks, and simulates how the portfolio would perform under historical black swan events.

## Features

**Risk-Adjusted Scoring** — Cross-protocol yield comparison using TVL stability and APY volatility as risk factors.

**AI Risk Analysis** — Three-point breakdown: why this allocation, key risks, and one actionable recommendation.

**Worst-Case Scenario Analysis** — Simulate performance under Luna Collapse (2022), FTX Collapse (2022), and Fed Rate Hike Shock (2023).

**Jupiter Execution** — One-click routing through Jupiter aggregator.

## Supported Protocols

- Kamino Finance
- Save (Solend)

## Tech Stack

- **Frontend** — Next.js, Tailwind CSS
- **Backend** — Python, FastAPI
- **Data** — DeFi Llama API, Kamino Finance API
- **AI** — Anthropic Claude API
- **Execution** — Jupiter Aggregator

## Getting Started

### Backend Setup

cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn requests python-dotenv

Create a .env file in the backend folder:

ANTHROPIC_API_KEY=your_api_key_here

Start the backend:

uvicorn main:app --reload

### Frontend Setup

cd frontend
npm install
npm run dev

Open http://localhost:3000

## Built for

Colosseum Frontier Hackathon 2026