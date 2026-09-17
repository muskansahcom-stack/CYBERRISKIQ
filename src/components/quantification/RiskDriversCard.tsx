import React from 'react';
import { TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { RiskDriverItem } from '../../types/cyberrisk';

interface RiskDriversCardProps {
  drivers: RiskDriverItem[];
  assetName: string;
}

export const RiskDriversCard: React.FC<RiskDriversCardProps> = ({ drivers, assetName }) => {
  const upwardDrivers = drivers.filter((d) => d.type === 'driver' || d.scoreDelta > 0);
  const downwardMitigators = drivers.filter((d) => d.type === 'mitigator' || d.scoreDelta < 0);

  return (
    <div id="risk-drivers-panel" className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Why is this Risk Quantified at this Level?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Decomposition of upward pressure factors vs. downward protective mitigators for <span className="font-semibold text-slate-700 dark:text-slate-200">{assetName}</span>.
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          EXPLAINABLE RISK DRIVERS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Risk Amplifiers / Upward Pressure */}
        <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <TrendingUp className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">
                Risk Amplifiers (Driving Risk Up)
              </h5>
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              +{upwardDrivers.reduce((sum, d) => sum + Math.abs(d.scoreDelta), 0)} pts
            </span>
          </div>

          <div className="space-y-2.5">
            {upwardDrivers.map((driver, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-rose-100 dark:border-rose-900/30 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {driver.label || driver.category}
                  </span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    +{Math.abs(driver.scoreDelta)} pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {driver.impactDescription}
                </p>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Category: {driver.category}
                </div>
              </div>
            ))}
            {upwardDrivers.length === 0 && (
              <p className="text-xs text-slate-500 italic">No critical risk amplifiers detected.</p>
            )}
          </div>
        </div>

        {/* Protective Controls / Downward Dampeners */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <TrendingDown className="w-4 h-4" />
              <h5 className="text-xs font-bold uppercase tracking-wider">
                Protective Controls (Pulling Risk Down)
              </h5>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              -{downwardMitigators.reduce((sum, d) => sum + Math.abs(d.scoreDelta), 0)} pts
            </span>
          </div>

          <div className="space-y-2.5">
            {downwardMitigators.map((driver, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/30 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {driver.label || driver.category}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    -{Math.abs(driver.scoreDelta)} pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {driver.impactDescription}
                </p>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  Category: {driver.category}
                </div>
              </div>
            ))}
            {downwardMitigators.length === 0 && (
              <p className="text-xs text-slate-500 italic">No validated protective controls mapped to this asset.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
