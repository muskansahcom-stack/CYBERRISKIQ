import React from 'react';
import {
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  Coins,
  ShieldCheck,
  Percent,
  RotateCcw,
  Check,
  CheckCircle2,
  Sparkles,
  Info
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ScenarioSimulationEngine } from '../../services/scenarioSimulationEngine';
import { formatINR } from '../../utils/formatters';

export const ScenarioSimulatorModule: React.FC = () => {
  const {
    assets,
    simulationActions,
    toggleSimulationAction,
    simulationBudget,
  } = useData();

  const simulationResult = ScenarioSimulationEngine.runSimulation(
    assets,
    simulationActions,
    simulationBudget
  );

  const activeCount = simulationActions.filter((a) => a.enabled).length;

  return (
    <div id="scenario-simulator-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cyber Defense What-If Scenario Simulator
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              INTERACTIVE ACTUARIAL MODEL
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Toggle proactive defensive controls, patch regimes, and isolation actions to model projected risk score reduction and financial loss savings in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900 font-semibold">
            {activeCount} Actions Activated
          </span>
        </div>
      </div>

      {/* Before vs After Comparison Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Risk Score Trajectory */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Enterprise Risk Score
          </span>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-xs text-slate-400 block">Baseline</span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {simulationResult.currentRiskScore}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="text-right">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium block">
                Simulated
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {simulationResult.projectedRiskScore}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Score Reduction:</span>
            <span>-{simulationResult.currentRiskScore - simulationResult.projectedRiskScore} pts ({simulationResult.estimatedRiskReductionPercent}%)</span>
          </div>
        </div>

        {/* Card 2: Financial Exposure (Max VaR) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Financial Exposure (Max VaR)
          </span>
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="text-xs text-slate-400 block">Current</span>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {formatINR(simulationResult.currentExposure)}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="text-right">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium block">
                Simulated
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatINR(simulationResult.projectedExposure)}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Exposure Avoidance:</span>
            <span>{formatINR(simulationResult.currentExposure - simulationResult.projectedExposure)}</span>
          </div>
        </div>

        {/* Card 3: Total Implementation Cost */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Simulated Budget Requirement
          </span>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 block">
              {formatINR(simulationResult.totalInvestmentCost)}
            </span>
            <span className="text-xs text-slate-400">Total cost of selected initiatives</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            {activeCount} active control programs
          </div>
        </div>

        {/* Card 4: Return on Security Investment (ROSI) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">
            Aggregate ROSI Yield
          </span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {simulationResult.rosiPercent}%
            </span>
            <span className="text-xs text-slate-400">Calculated actuarial return</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Net Financial Savings:</span>
            <span>{formatINR(simulationResult.netFinancialSavings)}</span>
          </div>
        </div>
      </div>

      {/* Action Selection Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Interactive What-If Remediation Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select or deselect security actions to immediately test the resulting change in risk and loss exposure.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                simulationActions.forEach((act) => {
                  if (act.enabled) toggleSimulationAction(act.id);
                });
              }}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Deselect All
            </button>
            <button
              onClick={() => {
                simulationActions.forEach((act) => {
                  if (!act.enabled) toggleSimulationAction(act.id);
                });
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 transition-colors font-medium"
            >
              Select All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {simulationActions.map((action) => {
            const isEnabled = action.enabled;
            return (
              <div
                key={action.id}
                onClick={() => toggleSimulationAction(action.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isEnabled
                    ? 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-500 dark:border-blue-500 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-950/80 px-2 py-0.5 rounded">
                      {action.category}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isEnabled
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {action.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {action.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Cost</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {formatINR(action.cost)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Loss Reduction</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatINR(action.financialLossReduction)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Risk Reduction</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      -{action.riskReductionPercent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
