import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  id?: string;
  title: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean; // positive means good for the business
    label?: string;
  };
  icon: LucideIcon;
  badgeText?: string;
  highlightColor?: 'blue' | 'rose' | 'amber' | 'emerald' | 'purple';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  subValue,
  trend,
  icon: Icon,
  badgeText,
  highlightColor = 'blue',
}) => {
  const getColorClasses = () => {
    switch (highlightColor) {
      case 'rose':
        return {
          iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60',
          accent: 'border-l-4 border-l-rose-500',
        };
      case 'amber':
        return {
          iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60',
          accent: 'border-l-4 border-l-amber-500',
        };
      case 'emerald':
        return {
          iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60',
          accent: 'border-l-4 border-l-emerald-500',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/60',
          accent: 'border-l-4 border-l-purple-500',
        };
      default:
        return {
          iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60',
          accent: 'border-l-4 border-l-blue-500',
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div
      id={id}
      className={`bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between ${colors.accent}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            {title}
          </span>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </h4>
          {badgeText && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {badgeText}
            </span>
          )}
        </div>

        {subValue && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {subValue}
          </p>
        )}
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-xs">
          <span
            className={`font-semibold ${
              trend.isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400 ml-1.5">{trend.label || 'vs last quarter'}</span>
        </div>
      )}
    </div>
  );
};
