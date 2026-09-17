import React, { useState } from 'react';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  Percent,
  CheckCircle2,
  XCircle,
  Sliders,
  DollarSign,
  Info,
  Scale,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useData } from '../../context/DataContext';
import { InvestmentOptimizationEngine } from '../../services/investmentOptimizationEngine';
import { InvestmentCandidate } from '../../types/cyberrisk';
import { formatINR } from '../../utils/formatters';

export const InvestmentOptimizationModule: React.FC = () => {
  const { investmentCandidates } = useData();

  // Preset budget options in INR (50 Lakh, 75 Lakh, 1 Crore, 1.5 Crore, 2 Crore)
  const [budget, setBudget] = useState<number>(10000000); // ₹1 Crore default
  const [customInput, setCustomInput] = useState<string>('10000000');

  const optimizationResult = InvestmentOptimizationEngine.optimizeBudget(
    investmentCandidates,
    budget
  );

  const handlePreset = (val: number) => {
    setBudget(val);
    setCustomInput(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCustomInput(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setBudget(val);
    }
  };

  return (
    <div id="investment-optimization-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cybersecurity Capital Investment Portfolio Optimizer
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              KNAPSACK OPTIMIZER
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Algorithmic capital allocation engine that selects the optimal combination of security controls under a finite budget to maximize loss avoidance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Target Budget:</span>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            {formatINR(budget)}
          </span>
        </div>
      </div>

      {/* Budget Slider & Input Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Set Security Investment Budget Cap
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adjust your capital constraints in Indian Rupees (₹) to calculate the Pareto-optimal defense portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Budget (₹):</span>
            <input
              type="number"
              min="1000000"
              max="30000000"
              step="500000"
              value={customInput}
              onChange={handleCustomChange}
              className="w-36 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Range slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="2500000"
            max="25000000"
            step="500000"
            value={budget}
            onChange={(e) => {
              const val = Number(e.target.value);
              setBudget(val);
              setCustomInput(val.toString());
            }}
            className="w-full accent-blue-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px]">Quick Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: '₹50 Lakh', val: 5000000 },
                { label: '₹75 Lakh', val: 7500000 },
                { label: '₹1.0 Crore', val: 10000000 },
                { label: '₹1.5 Crore', val: 15000000 },
                { label: '₹2.0 Crore', val: 20000000 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => handlePreset(p.val)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    budget === p.val
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spend */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Allocated Budget Spend
          </span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block">
              {formatINR(optimizationResult.totalAllocated)}
            </span>
            <span className="text-xs text-slate-400">
              Remaining: {formatINR(optimizationResult.remainingBudget)}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {optimizationResult.selectedInvestments.length} controls funded
          </div>
        </div>

        {/* Total Financial Loss Prevented */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Financial Loss Prevented
          </span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {formatINR(optimizationResult.totalFinancialBenefit)}
            </span>
            <span className="text-xs text-slate-400">Estimated financial loss avoidance</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Net Savings: {formatINR(optimizationResult.totalFinancialBenefit - optimizationResult.totalAllocated)}
          </div>
        </div>

        {/* Total Risk Reduction */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Aggregate Risk Reduction
          </span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 block">
              -{optimizationResult.totalRiskReduction}%
            </span>
            <span className="text-xs text-slate-400">Portfolio risk reduction rate</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Trajectory: 68 → {Math.max(22, Math.round(68 * (1 - optimizationResult.totalRiskReduction / 100)))}
          </div>
        </div>

        {/* ROSI */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Blended ROSI Yield
          </span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {optimizationResult.blendedRosi}%
            </span>
            <span className="text-xs text-slate-400">Return on Security Investment</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Highly Capital Efficient
          </div>
        </div>
      </div>

      {/* Comparison: Unconstrained vs Budget-Constrained */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Scale className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Portfolio Comparison: Unconstrained (Ideal) vs. Budget-Constrained (Actual)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Unconstrained Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                Unconstrained Ideal Portfolio
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                All Initiatives Funded
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Maximum possible cyber risk reduction if capital was completely unlimited.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Required Capital</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatINR(12900000)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Benefit</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(34300000)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Risk Reduction</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">-78%</span>
              </div>
            </div>
          </div>

          {/* Budget-Constrained Card */}
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 dark:text-blue-100">
                Budget-Constrained Recommendation
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-600 text-white font-semibold">
                Under {formatINR(budget)} Cap
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Knapsack algorithm extracts <strong>{Math.round((optimizationResult.totalFinancialBenefit / 34300000) * 100)}%</strong> of unconstrained loss prevention using only <strong>{Math.round((optimizationResult.totalAllocated / 12900000) * 100)}%</strong> of the full budget.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-200 dark:border-blue-900/40 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Optimized Spend</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatINR(optimizationResult.totalAllocated)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Loss Prevented</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatINR(optimizationResult.totalFinancialBenefit)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Risk Reduction</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">-{optimizationResult.totalRiskReduction}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Investments Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Candidate Security Initiatives & Funding Allocation
          </h3>
          <span className="text-xs text-slate-400">
            Ranked by ROSI efficiency
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Allocation</th>
                <th className="py-2.5 px-4 font-semibold">Initiative Name</th>
                <th className="py-2.5 px-4 font-semibold">Domain</th>
                <th className="py-2.5 px-4 font-semibold">Capex / Cost</th>
                <th className="py-2.5 px-4 font-semibold">Financial Benefit</th>
                <th className="py-2.5 px-4 font-semibold">Risk Reduction</th>
                <th className="py-2.5 px-4 font-semibold">ROSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {investmentCandidates.map((cand: InvestmentCandidate) => {
                const isFunded = optimizationResult.selectedInvestments.some((s) => s.id === cand.id);
                return (
                  <tr
                    key={cand.id}
                    className={`transition-colors ${
                      isFunded
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 hover:bg-emerald-50/50'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-70'
                    }`}
                  >
                    <td className="py-2.5 px-4">
                      {isFunded ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Funded
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <XCircle className="w-3.5 h-3.5" /> Unfunded
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                      {cand.name}
                    </td>

                    <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                      {cand.category}
                    </td>

                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {formatINR(cand.cost)}
                    </td>

                    <td className="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(cand.financialBenefit)}
                    </td>

                    <td className="py-2.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                      -{cand.riskReductionPercent}%
                    </td>

                    <td className="py-2.5 px-4 font-black text-emerald-600 dark:text-emerald-400">
                      {cand.rosiPercent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
