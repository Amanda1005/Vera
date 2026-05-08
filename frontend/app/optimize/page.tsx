"use client";
import { useState } from "react";
import Link from "next/link";

interface Recommendation {
  token: string;
  protocol: string;
  allocatedUsd: number;
  allocatedPct: number;
  expectedApy: number;
  riskScore: number;
  riskLevel: string;
  expectedYearlyReturn: number;
}

interface StressTest {
  name: string;
  totalLoss: number;
  valueAfter: number;
  lossPercent: number;
}

interface Summary {
  totalYearlyReturn: number;
  effectiveApy: number;
  protocolFee: number;
  netYearlyReturn: number;
}

interface OptimizeResult {
  inputAmount: number;
  riskProfile: string;
  recommendations: Recommendation[];
  summary: Summary;
  stressTests: Record<string, StressTest>;
  aiAnalysis: string | { why: string; risk: string; action: string };
}

export default function Optimize() {
  const [amount, setAmount] = useState("1000");
  const [riskProfile, setRiskProfile] = useState("medium");
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const res = await fetch(
      `https://vera-backend-pmyu.onrender.com/api/ai-analysis?amount=${amount}&risk_profile=${riskProfile}`
    );
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const getLossColor = (pct: number) => {
    if (pct >= 30) return "text-red-500";
    if (pct >= 15) return "text-orange-500";
    return "text-yellow-500";
  };

  return (
    <main className="min-h-screen" style={{background: "#f8f9fc"}}>
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center overflow-hidden">
            <img src="/vera-logo.png" alt="Vera" className="w-13 h-13 object-contain" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Vera</span>
        </div>
        <Link href="/" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
          Back
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 pt-12 pb-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Optimize Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Allocation
            </span>
          </h1>
          <p className="text-gray-500">
            Get the best risk-adjusted allocation and see your worst-case scenario before you commit.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex gap-8 items-end flex-wrap">
            <div>
              <label className="text-gray-500 text-sm mb-2 block">Amount (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 w-48 focus:outline-none focus:border-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="text-gray-500 text-sm mb-2 block">Risk profile</label>
              <div className="flex gap-2">
                {["conservative", "medium", "aggressive"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRiskProfile(r)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      riskProfile === r
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={run}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white px-6 py-2.5 rounded-full font-medium transition-all disabled:opacity-50 text-sm"
            >
              {loading ? "Analyzing..." : "Find Best Allocation"}
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Expected yearly return</p>
                <p className="text-2xl font-bold text-green-500">+${result.summary.netYearlyReturn.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Effective APY</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{result.summary.effectiveApy}%</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Protocol fee (0.1%)</p>
                <p className="text-2xl font-bold text-gray-400">${result.summary.protocolFee}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">Recommended allocation</h2>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Protocol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Allocation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">APY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Yearly Return</th>
                  </tr>
                </thead>
                <tbody>
                  {result.recommendations.map((r, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-400 text-xs">{r.protocol}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{r.token}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" style={{ width: `${r.allocatedPct}%` }} />
                          </div>
                          <span className="text-gray-500 text-xs">{r.allocatedPct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">${r.allocatedUsd.toLocaleString()}</td>
                      <td className="px-6 py-4 text-green-500 font-medium">{r.expectedApy}%</td>
                      <td className="px-6 py-4 text-green-500 font-medium">+${r.expectedYearlyReturn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">Worst-case scenario analysis</h2>
                <p className="text-xs text-gray-400 mt-0.5">How your allocation would perform under historical black swan events</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Scenario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value After</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Max Loss</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Loss %</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.stressTests).map(([id, s], i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-700">{s.name}</td>
                      <td className="px-6 py-4 text-gray-700">${s.valueAfter.toLocaleString()}</td>
                      <td className={`px-6 py-4 font-medium ${getLossColor(s.lossPercent)}`}>-${s.totalLoss.toLocaleString()}</td>
                      <td className={`px-6 py-4 font-medium ${getLossColor(s.lossPercent)}`}>-{s.lossPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs">AI</span>
                </div>
                <h2 className="text-sm font-semibold text-gray-700">AI Risk Analysis</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-green-600 mb-1">WHY THIS ALLOCATION</p>
                  <p className="text-sm text-gray-700">{typeof result.aiAnalysis === "object" ? result.aiAnalysis.why : result.aiAnalysis}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-orange-600 mb-1">KEY RISK</p>
                  <p className="text-sm text-gray-700">{typeof result.aiAnalysis === "object" ? result.aiAnalysis.risk : ""}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-blue-600 mb-1">RECOMMENDATION</p>
                  <p className="text-sm text-gray-700">{typeof result.aiAnalysis === "object" ? result.aiAnalysis.action : ""}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-gray-500 text-sm mb-4">Ready to execute your optimized allocation?</p>
              <button
                onClick={() => window.open("https://jup.ag/swap/USDC-SOL", "_blank")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white px-6 py-3 rounded-full font-medium transition-all text-sm"
              >
                Route through Jupiter
              </button>
              <p className="text-gray-400 text-xs mt-3">
                0.1% protocol fee · Best execution guaranteed · Powered by Jupiter aggregator
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
