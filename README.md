cat > /Users/Amanda/risklens/README.md << 'ENDOFFILE'
# Vera — AI-Powered DeFi Risk Advisor

> See through the APY. Find your true return on Solana.

## What is Vera?

Vera is an AI-powered risk-adjusted yield optimizer for Solana DeFi. Most users chase the highest APY without understanding the risk behind it. Vera changes that.

Input your capital and risk tolerance, and Vera pulls real-time data from Kamino Finance and Save (Solend), calculates a risk-adjusted score for each asset, and recommends the optimal allocation. An AI analyst then explains the rationale, highlights key risks, and simulates how the portfolio would perform under historical black swan events.

Think of it as your personal DeFi risk advisor — helping you make smarter decisions before you commit your capital, not after.

## Features

**Risk-Adjusted Scoring**
Cross-protocol yield comparison using TVL stability and APY volatility as risk factors. Every asset gets a risk score and a risk-adjusted return metric — so you can compare apples to apples across protocols.

**AI Risk Analysis**
After generating your optimal allocation, Vera's AI analyst provides a three-point breakdown:
- WHY THIS ALLOCATION — why this portfolio suits your risk profile
- KEY RISK — the biggest risk based on stress test results
- RECOMMENDATION — one specific actionable suggestion

**Worst-Case Scenario Analysis**
Simulate how your allocation would perform under three historical black swan events:
- Luna Collapse (May 2022) — UST depegged, LUNA crashed 99%
- FTX Collapse (Nov 2022) — SOL dropped 60% in days
- Fed Rate Hike Shock (2023) — risk-off sentiment across DeFi

**Jupiter Execution**
One-click routing through Jupiter aggregator to execute your optimized allocation.

## Supported Protocols

- Kamino Finance
- Save (Solend)

## Project Structure

vera/
├── backend/
│   ├── main.py          # FastAPI backend, risk scoring engine, AI analysis
│   └── .env             # API keys (not committed)
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Main risk dashboard
│   │   └── optimize/
│   │       └── page.tsx     # Optimize + AI analysis + stress test
│   └── public/
│       └── vera-logo.png
└── README.md

## Tech Stack

- **Frontend** — Next.js, Tailwind CSS
- **Backend** — Python, FastAPI
- **Data** — DeFi Llama API, Kamino Finance API
- **AI** — Anthropic Claude API
- **Execution** — Jupiter Aggregator

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Anthropic API key

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn requests python-dotenv
```

Create a `.env` file in the `backend` folder:

ANTHROPIC_API_KEY=your_api_key_here

Start the backend:

```bash
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

## Built for

Colosseum Frontier Hackathon 2026
ENDOFFILE