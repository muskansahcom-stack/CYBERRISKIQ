import React from 'react';
import {
  FinancialImpactDecomposition,
  UncertaintyRange,
  DefensibleFinancialAssumptions,
} from '../../types/cyberrisk';
import { formatINR } from '../../utils/formatters';
import { Layers, AlertCircle, ShieldAlert, FileText } from 'lucide-react';

interface FinancialImpactDecompositionCardProps {
  decomposition: FinancialImpactDecomposition;
  uncertaintyRange: UncertaintyRange;
  assumptions: DefensibleFinancialAssumptions;
  assetName: string;
}

export const FinancialImpactDecompositionCard: React.FC<FinancialImpactDecompositionCardProps> = ({
  decomposition,
  uncertaintyRange,
  assumptions,
  assetName,
}) => {
  const total = decomposition.totalEstimatedImpact || 1;

  const items = [
    {
      name: 'Business Interruption & Downtime',
      amount: decomposition.businessInterruption,
      percent: Math.round((decomposition.businessInterruption / total) * 100),
      color: 'bg-rose-500',
      note: decomposition.notes.businessInterruption,
      driver: 'Operational outage on transaction engines',
    },
    {
      name: 'Data Breach & Record Loss',
      amount: decomposition.dataImpact,
      percent: Math.round((decomposition.dataImpact / total) * 100),
      color: 'bg-indigo-500',
      note: decomposition.notes.dataImpact,
      driver: 'Per-record breach notification & identity monitoring',
    },
    {
      name: 'Technical Recovery & Rebuilding',
      amount: decomposition.recovery,
      percent: Math.round((decomposition.recovery / total) * 100),
      color: 'bg-amber-500',
      note: decomposition.notes.recovery,
      driver: 'Server re-imaging, integrity checks, data restoration',
    },
    {
      name: 'Incident Response & Forensics Retainer',
      amount: decomposition.incidentResponse,
      percent: Math.round((decomposition.incidentResponse / total) * 100),
      color: 'bg-cyan-500',
      note: decomposition.notes.incidentResponse || `Forensic SLA triage and external DFIR retention`,
      driver: 'External legal and incident triage retainer',
    },
    {
      name: 'Legal Liabilities & Regulatory Penalties',
      amount: decomposition.legalRegulatory,
      percent: Math.round((decomposition.legalRegulatory / total) * 100),
      color: 'bg-purple-500',
      note: decomposition.notes.legalRegulatory,
      driver: 'RBI IT governance & DPDP Act 2023 statutory mandates',
    },
    {
      name: 'Direct Financial / Transaction Loss',
      amount: decomposition.directBusinessLoss,
      percent: Math.round((decomposition.directBusinessLoss / total) * 100),
      color: 'bg-emerald-500',
      note: decomposition.notes.directBusinessLoss || 'Direct asset balance exposure',
      driver: 'Unreversed fraud leakage or direct asset write-down',
    },
    {
      name: 'Customer Restitution & Churn Loss',
      amount: decomposition.customerReputation,
      percent: Math.round((decomposition.customerReputation / total) * 100),
      color: 'bg-pink-500',
      note: decomposition.notes.customerReputation || 'Brand churn impact',
      driver: 'Customer compensation and reputational defection',
    },
  ];

  return (
    <div id="financial-impact-decomposition" className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Single Loss Expectancy (SLE) Financial Decomposition
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                SIMULATION / MODELLED ESTIMATE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              7-component actuarial loss model for <span className="font-semibold text-slate-700 dark:text-slate-200">{assetName}</span>. Total estimated per-incident impact: <span className="font-bold text-rose-600 dark:text-rose-400">{formatINR(decomposition.totalEstimatedImpact)}</span>.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            Most Likely SLE Impact
          </span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatINR(decomposition.totalEstimatedImpact)}
          </span>
        </div>
      </div>

      {/* Uncertainty Range Strip */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            Uncertainty Distribution Range ({uncertaintyRange.confidenceInterval})
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            P10 Low → P50 Most Likely → P90 High
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Optimistic Bound (Low P10)</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {formatINR(uncertaintyRange.low)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
            <span className="text-[10px] uppercase text-blue-600 dark:text-blue-300 font-bold block">Baseline (Most Likely P50)</span>
            <span className="text-sm font-extrabold text-blue-700 dark:text-blue-300 mt-0.5 block">
              {formatINR(uncertaintyRange.mostLikely)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Pessimistic Bound (High P90)</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
              {formatINR(uncertaintyRange.high)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Stacked Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 gap-0.5">
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{ width: `${Math.max(2, item.percent)}%` }}
              className={`${item.color} transition-all duration-300`}
              title={`${item.name}: ${formatINR(item.amount)} (${item.percent}%)`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>0%</span>
          <span>Proportional Share of Single Loss Expectancy</span>
          <span>100%</span>
        </div>
      </div>

      {/* Detailed 7-Component Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-2.5 px-3.5 font-semibold">Component</th>
              <th className="py-2.5 px-3.5 font-semibold">Estimated Impact</th>
              <th className="py-2.5 px-3.5 font-semibold">Share</th>
              <th className="py-2.5 px-3.5 font-semibold">Actuarial Grounding & Underlying Assumptions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                  {item.name}
                </td>
                <td className="py-2.5 px-3.5 font-bold text-slate-800 dark:text-slate-200">
                  {formatINR(item.amount)}
                </td>
                <td className="py-2.5 px-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {item.percent}%
                  </span>
                </td>
                <td className="py-2.5 px-3.5 text-slate-500 dark:text-slate-400">
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.note}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{item.driver}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
