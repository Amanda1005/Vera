"use client";
import { useState } from "react";
import Link from "next/link";

interface Result {
  token: string;
  shock: number;
  valueAfter: number;
  lossUsd: number;
}

interface StressResult {
  scenario: string;
  description: string;
  inputAmount: number;
  results: Result[];
}

const SCENARIOS = [
  { id: "luna_2022", name: "Luna Collapse", date: "May 2022", color: "text-red-400" },
  { id: "ftx_2022", name: "FTX Collapse", date: "Nov 2022", color: "text-orange-400" },
  { id: "rate_hike_2023", name: "Fed Rate Hike", date: "2023", color: "text-yellow-400" },
];

export default function StressTest() {
  const [scenario, setScenario] = useState("luna_2022");
  const [amount, setAmount] = useState("1000");
  const [result, setResult] = useState<StressResult | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    const res = await fetch(
      `http://127.0.0.1:8000/api/stress-test/${scenario}?amount=${amount}`
    );
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Stress Test</h1>
            <p className="text-gray-400">
              Simulate how your position would perform under historical market shocks.
            </p>
          </div>
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm">
            Back to RiskLens
          </Link>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-8">
          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-3 block">Select scenario</label>
            <div className="flex gap-3 flex-wrap">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    scenario === s.id
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-700 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  {s.name}
                  <span className="ml-2 text-xs opacity-60">{s.date}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-gray-400 text-sm mb-2 block">
              Position size (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white w-48 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Running..." : "Run Simulation"}
          </button>
        </div>

        {result && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-1">{result.scenario}</h2>
              <p className="text-gray-400 text-sm">{result.description}</p>
            </div>

            <div className="rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-900 text-gray-400 text-left">
                    <th className="px-5 py-4">Token</th>
                    <th className="px-5 py-4">Price Shock</th>
                    <th className="px-5 py-4">Value After</th>
                    <th className="px-5 py-4">Loss</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.results.map((r, i) => (
                    <tr key={i} className="border-t border-gray-800 hover:bg-gray-900">
                      <td className="px-5 py-4 font-semibold text-white">{r.token}</td>
                      <td className={`px-5 py-4 font-mono ${r.shock < 0 ? "text-red-400" : "text-green-400"}`}>
                        {r.shock}%
                      </td>
                      <td className="px-5 py-4 text-white">${r.valueAfter.toLocaleString()}</td>
                      <td className="px-5 py-4 text-red-400">
                        {r.lossUsd > 0 ? `-$${r.lossUsd.toLocaleString()}` : "-"}
                      </td>
                      <td className="px-5 py-4">
                        {r.shock <= -50 ? (
                          <span className="text-red-400 font-medium">Severe</span>
                        ) : r.shock <= -20 ? (
                          <span className="text-orange-400 font-medium">Moderate</span>
                        ) : r.shock < 0 ? (
                          <span className="text-yellow-400 font-medium">Mild</span>
                        ) : (
                          <span className="text-green-400 font-medium">Safe</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
