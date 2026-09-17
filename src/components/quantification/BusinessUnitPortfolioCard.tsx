import React from 'react';
import { Building2, ArrowUpRight } from 'lucide-react';
import { BusinessUnitAggregation } from '../../types/cyberrisk';
import { formatINR } from '../../utils/formatters';

interface BusinessUnitPortfolioCardProps {
  aggregations: BusinessUnitAggregation[];
  onSelectBusinessUnit?: (businessUnit: string) => void;
  selectedBusinessUnit?: string | null;
}

export const BusinessUnitPortfolioCard: React.FC<BusinessUnitPortfolioCardProps> = ({
  aggregations,
  onSelectBusinessUnit,
  selectedBusinessUnit,
}) => {
  return (
    <div id="business-unit-portfolio" className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Business Unit Risk Allocation & Aggregation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enterprise Expected Annual Loss (EAL) decomposed across business units and operating lines.
            </p>
          </div>
        </div>

        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          PORTFOLIO CONCENTRATION
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {aggregations.map((bu) => {
          const isSelected = selectedBusinessUnit === bu.businessUnit;
          return (
            <div
              key={bu.businessUnit}
              onClick={() => onSelectBusinessUnit && onSelectBusinessUnit(bu.businessUnit)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {bu.businessUnit}
                  </h5>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {bu.assetCount} Asset{bu.assetCount !== 1 ? 's' : ''} Scoped
                  </span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  {bu.contributionPercent.toFixed(1)}% Risk
                </span>
              </div>

              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Annualized Loss:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">
                    {formatINR(bu.expectedAnnualLoss)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Asset Value:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {formatINR(bu.totalValue)}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${Math.max(5, bu.contributionPercent)}%` }}
                />
              </div>

              <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>VaR 95%: {formatINR(bu.var95)}</span>
                <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
