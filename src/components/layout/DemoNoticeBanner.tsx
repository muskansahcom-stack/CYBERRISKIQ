import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export const DemoNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      id="demo-notice-banner"
      className="bg-amber-500/10 border-b border-amber-500/25 px-4 py-2 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between"
    >
      <div className="flex items-center gap-2 max-w-5xl">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>
          <strong>DEMO ENVIRONMENT (Acme Financial Services):</strong> All metrics, assets, financial loss figures (in INR ₹), and CVE records are simulated demonstration values for software evaluation. 100% Software architecture — no physical/IoT hardware.
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span className="hidden sm:inline-flex items-center gap-1 font-medium text-amber-700 dark:text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Phase 1 Foundation Active
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-amber-500/20 rounded text-amber-700 dark:text-amber-300 transition-colors"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
