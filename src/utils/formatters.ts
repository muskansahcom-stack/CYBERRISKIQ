/**
 * Formatting utilities for Indian Rupee (INR) and Cybersecurity metrics
 */

export function formatINR(amount: number, compact: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';

    if (abs >= 10000000) {
      // 1 Crore = 10,000,000
      const cr = abs / 10000000;
      return `${sign}₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/\.?0+$/, '')} Crore`;
    }
    if (abs >= 100000) {
      // 1 Lakh = 100,000
      const lk = abs / 100000;
      return `${sign}₹${lk % 1 === 0 ? lk.toFixed(0) : lk.toFixed(2).replace(/\.?0+$/, '')} Lakh`;
    }
    if (abs >= 1000) {
      const th = abs / 1000;
      return `${sign}₹${th.toFixed(1)} K`;
    }
    return `${sign}₹${Math.round(abs).toLocaleString('en-IN')}`;
  }

  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatNumberIN(num: number): string {
  return num.toLocaleString('en-IN');
}

export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function getRiskColorClass(score: number): {
  badge: string;
  text: string;
  bg: string;
  border: string;
  level: string;
} {
  if (score >= 80) {
    return {
      badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900',
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500',
      border: 'border-rose-500',
      level: 'Critical Risk',
    };
  }
  if (score >= 60) {
    return {
      badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      border: 'border-amber-500',
      level: 'High Risk',
    };
  }
  if (score >= 40) {
    return {
      badge: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-900',
      text: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-500',
      border: 'border-yellow-500',
      level: 'Moderate Risk',
    };
  }
  return {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    level: 'Low Risk',
  };
}

export function getSeverityBadge(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical':
      return 'bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    case 'high':
      return 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300 dark:border-yellow-800';
    case 'low':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300';
  }
}
