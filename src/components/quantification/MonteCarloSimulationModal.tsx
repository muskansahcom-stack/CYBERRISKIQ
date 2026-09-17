import React, { useState } from 'react';
import {
  X,
  Play,
  RotateCcw,
  BarChart3,
  Info,
} from 'lucide-react';
import { MonteCarloSimulationResult, Asset } from '../../types/cyberrisk';
import { formatINR } from '../../utils/formatters';

interface MonteCarloSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset;
  onRunSimulation: (assetId: string, iterations: number) => Promise<MonteCarloSimulationResult>;
  initialResult?: MonteCarloSimulationResult | null;
}

export const MonteCarloSimulationModal: React.FC<MonteCarloSimulationModalProps> = ({
  isOpen,
  onClose,
  asset,
  onRunSimulation,
  initialResult,
}) => {
  const [iterations, setIterations] = useState<number>(2000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<MonteCarloSimulationResult | null>(initialResult || null);

  if (!isOpen) return null;

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const sim = await onRunSimulation(asset.id, iterations);
      setResult(sim);
    } catch (err: any) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const bins = result?.lossDistributionBins || [];
  const maxBinCount = bins.length > 0 ? Math.max(...bins.map((d) => d.count), 1) : 1;

  return (
    <div
      id="monte-carlo-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Stochastic Monte Carlo Cyber Risk Engine
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  FAIR VALUE AT RISK (VaR)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  SIMULATION / MODELLED ESTIMATE
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Target Node: <span className="font-semibold text-white">{asset.name}</span> • Actuarial Poisson-Triangular Convolution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Monte Carlo modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Bar */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Trial Count:</span>
            {[1000, 2000, 5000, 10000].map((count) => (
              <button
                key={count}
                onClick={() => setIterations(count)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  iterations === count
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                {count.toLocaleString()} Trials
              </button>
            ))}
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Computing Distributions...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run {iterations.toLocaleString()} Trials
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">
          {!result && !isRunning && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Ready to Execute Actuarial Simulation
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Select your trial sample size above and click &quot;Run Trials&quot; to compute empirical probability density, Value at Risk (VaR), and loss exceedance curves.
              </p>
            </div>
          )}

          {result && (
            <>
              {/* VaR & Statistical Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Mean Loss</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1 block">
                    {formatINR(result.meanLoss)}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Median: {formatINR(result.medianLoss)}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                  <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">VaR 90% (1-in-10 Year)</span>
                  <span className="text-lg font-bold text-amber-700 dark:text-amber-300 mt-1 block">
                    {formatINR(result.p90Loss)}
                  </span>
                  <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mt-0.5 block">90% chance loss is below</span>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
                  <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block">VaR 95% (1-in-20 Year)</span>
                  <span className="text-lg font-bold text-rose-700 dark:text-rose-300 mt-1 block">
                    {formatINR(result.p95Loss)}
                  </span>
                  <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 mt-0.5 block">Board risk tolerance ceiling</span>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40">
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block">VaR 99% (Tail Catastrophe)</span>
                  <span className="text-lg font-bold text-purple-700 dark:text-purple-300 mt-1 block">
                    {formatINR(result.p99Loss)}
                  </span>
                  <span className="text-[10px] text-purple-600/80 dark:text-purple-400/80 mt-0.5 block">1-in-100 year black swan</span>
                </div>
              </div>

              {/* Distribution Histogram */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Empirical Loss Exceedance & Frequency Distribution
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Distribution across {result.iterations.toLocaleString()} stochastic iterations ({result.distributionType}).
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Max Trial: {formatINR(result.maxLoss)}
                  </span>
                </div>

                <div className="h-44 flex items-end gap-2 pt-6 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {bins.map((bin, idx) => {
                    const heightPercent = Math.max(4, Math.round((bin.count / maxBinCount) * 100));
                    const isHighRisk = idx >= 6;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t transition-all duration-300 group-hover:brightness-110 ${
                            isHighRisk ? 'bg-rose-500/80' : 'bg-indigo-500/80'
                          }`}
                          title={`${bin.binLabel}: ${bin.count} occurrences (${((bin.count / result.iterations) * 100).toFixed(1)}%)`}
                        />
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate w-full text-center">
                          {bin.binLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500/80" />
                    <span>Typical Operational Range</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/80" />
                    <span>Tail Risk / Catastrophic Exceedance</span>
                  </div>
                </div>
              </div>

              {/* Explanatory callout */}
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold">Interpretation for CISO & Risk Committee</h5>
                  <p className="mt-0.5 text-[11px] text-blue-800 dark:text-blue-300/90 leading-relaxed">
                    While the expected annual loss (EAL) is <strong>{formatINR(result.meanLoss)}</strong>, the 95th percentile Value at Risk indicates that in an adverse 1-in-20 year cyber attack scenario, financial damage can escalate to <strong>{formatINR(result.p95Loss)}</strong>. Insurance coverage limits and capital reserves should be structured against the 95% VaR threshold.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Engine: FAIR Poisson-Triangular Convolution • Version 3.2
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-xs"
          >
            Close Simulation
          </button>
        </div>
      </div>
    </div>
  );
};
