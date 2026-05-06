"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Protocol {
  protocol: string;
  token: string;
  supplyApy: number;
  totalSupplyUsd: number;
  riskScore: number;
  riskAdjustedScore: number;
}

const getRiskLabel = (score: number) => {
  if (score < 30) return { label: "Low Risk", color: "text-green-600", bg: "bg-green-50" };
  if (score < 60) return { label: "Medium Risk", color: "text-yellow-600", bg: "bg-yellow-50" };
  return { label: "High Risk", color: "text-red-600", bg: "bg-red-50" };
};

export default function Home() {
  const [data, setData] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [risk, setRisk] = useState("all");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/protocols")
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  const filtered = data.filter((d) => {
    if (risk === "low") return d.riskScore < 30;
    if (risk === "medium") return d.riskScore >= 30 && d.riskScore < 60;
    if (risk === "high") return d.riskScore >= 60;
    return true;
  });

  return (
    <main className="min-h-screen" style={{background: "#f8f9fc"}}>
      <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center overflow-hidden">
            <img src="/vera-logo.png" alt="Vera" className="w-13 h-13 object-contain" />
          </div>
          <span className="font-bold text-gray-900 text-lg">Vera</span>
        </div>
        <Link
          href="/optimize"
          className="bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
        >
          Optimize Allocation →
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-8 pt-16 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            See through the APY,{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              find your true return
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Risk-adjusted yield comparison across Solana DeFi protocols. Know your real return before you invest.
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-8">
          {["all", "low", "medium", "high"].map((r) => (
            <button
              key={r}
              onClick={() => setRisk(r)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                risk === r
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading data from Solana DeFi protocols...</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Protocol</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Supply APY</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Score</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">TVL</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk-Adjusted</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => {
                  const { label, color, bg } = getRiskLabel(d.riskScore);
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 text-xs">{d.protocol}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{d.token}</td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 font-medium">{d.supplyApy}%</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                              style={{ width: `${Math.min(d.riskScore, 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-600 text-xs">{d.riskScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">${(d.totalSupplyUsd / 1_000_000).toFixed(1)}M</td>
                      <td className="px-6 py-4 font-mono text-blue-600 font-medium">{d.riskAdjustedScore}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color} ${bg}`}>
                          {label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-gray-400 text-xs mt-4 text-center">
          Data from Kamino · Save (Solend) · Sorted by Risk-Adjusted Score · Min TVL $1M · Updated in real-time
        </p>
      </div>
    </main>
  );
}
