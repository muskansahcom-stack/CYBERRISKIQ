import React from 'react';
import { History, TrendingDown, TrendingUp, Calendar } from 'lucide-react';
import { HistoricalRiskSnapshot } from '../../types/cyberrisk';
import { formatINR } from '../../utils/formatters';

interface HistoricalRiskTrendCardProps {
  snapshots: HistoricalRiskSnapshot[];
}

export const HistoricalRiskTrendCard: React.FC<HistoricalRiskTrendCardProps> = ({ snapshots }) => {
  return (
    <div id="historical-risk-trend" className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Historical Cyber Risk Trajectory (Audit Log)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audited trail of Enterprise Expected Annual Loss (EAL) and Value at Risk (VaR 95%) across operational cycles.
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          AUDIT TRAIL
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="py-2.5 px-3.5 font-semibold">Snapshot Date</th>
              <th className="py-2.5 px-3.5 font-semibold">Enterprise Score</th>
              <th className="py-2.5 px-3.5 font-semibold">Expected Annual Loss (EAL)</th>
              <th className="py-2.5 px-3.5 font-semibold">Total Exposure (SLE)</th>
              <th className="py-2.5 px-3.5 font-semibold">VaR 95% (Adverse Loss)</th>
              <th className="py-2.5 px-3.5 font-semibold">Active Incidents</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {snapshots.map((snap, idx) => {
              const prev = snapshots[idx - 1];
              const isDecreasing = prev ? snap.expectedAnnualLoss < prev.expectedAnnualLoss : false;
              const isIncreasing = prev ? snap.expectedAnnualLoss > prev.expectedAnnualLoss : false;

              return (
                <tr key={snap.timestamp || idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {snap.date}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      {snap.enterpriseRiskScore} / 100
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span>{formatINR(snap.expectedAnnualLoss)}</span>
                      {isDecreasing && (
                        <span title="Loss reduced">
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                        </span>
                      )}
                      {isIncreasing && (
                        <span title="Loss increased">
                          <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-slate-700 dark:text-slate-300">
                    {formatINR(snap.totalExposure)}
                  </td>
                  <td className="py-2.5 px-3.5 font-semibold text-rose-600 dark:text-rose-400">
                    {formatINR(snap.var95)}
                  </td>
                  <td className="py-2.5 px-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {snap.activeIncidents} Active
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
