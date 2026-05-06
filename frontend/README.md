<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
cat > /Users/Amanda/risklens/README.md << 'ENDOFFILE'
# Vera — AI-Powered DeFi Risk Advisor

> See through the APY. Find your true return on Solana.

![Vera Dashboard](frontend/public/home.jpg?raw=true)

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

```
vera/
├── backend/
│   ├── main.py
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── optimize/
│   │       └── page.tsx
│   └── public/
│       └── vera-logo.png
└── README.md
```

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

```
ANTHROPIC_API_KEY=your_api_key_here
```

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
>>>>>>> 699d2f3625da4ffaeee07e0e23b73269b2a74496
