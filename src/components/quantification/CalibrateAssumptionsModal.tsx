import React, { useState } from 'react';
import { X, Sliders, RotateCcw, Check, Info } from 'lucide-react';
import { DefensibleFinancialAssumptions } from '../../types/cyberrisk';
import { DEFAULT_FINANCIAL_ASSUMPTIONS } from '../../data/defensibleAssumptions';
import { formatINR } from '../../utils/formatters';

interface CalibrateAssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAssumptions: DefensibleFinancialAssumptions;
  onSave: (updated: Partial<DefensibleFinancialAssumptions>) => Promise<void>;
}

export const CalibrateAssumptionsModal: React.FC<CalibrateAssumptionsModalProps> = ({
  isOpen,
  onClose,
  currentAssumptions,
  onSave,
}) => {
  const [formData, setFormData] = useState<DefensibleFinancialAssumptions>(currentAssumptions);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setFormData({
      ...DEFAULT_FINANCIAL_ASSUMPTIONS,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      alert(`Failed to save assumptions: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="calibrate-assumptions-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Calibrate Defensible Financial Assumptions
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {formData.version}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Transparent inputs backing all Single Loss Expectancy (SLE) and Annualized Loss (EAL) derivations.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Regulatory disclaimer */}
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/40 text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>
              Baseline calibrated against Indian Banking Sector, RBI Cyber Security Framework & DPDP Act 2023.
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to Standard
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Downtime Hourly Rate */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/20">
              <label className="font-bold text-slate-900 dark:text-slate-100 block">
                Hourly Downtime Loss Rate (₹/hour)
              </label>
              <input
                type="number"
                min="10000"
                step="50000"
                value={formData.downtime_cost_per_hour}
                onChange={(e) =>
                  setFormData({ ...formData, downtime_cost_per_hour: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-500 block">
                Current: {formatINR(formData.downtime_cost_per_hour)}/hr based on transaction volume.
              </span>
            </div>

            {/* Cost Per Breached Record */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/20">
              <label className="font-bold text-slate-900 dark:text-slate-100 block">
                Cost Per Breached Customer Record (₹/record)
              </label>
              <input
                type="number"
                min="100"
                step="250"
                value={formData.data_breach_cost_per_record}
                onChange={(e) =>
                  setFormData({ ...formData, data_breach_cost_per_record: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-500 block">
                Current: {formatINR(formData.data_breach_cost_per_record)} (notification + forensic verification).
              </span>
            </div>

            {/* Estimated Outage Hours */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/20">
              <label className="font-bold text-slate-900 dark:text-slate-100 block">
                Mean Outage Duration for Critical Tier (Hours)
              </label>
              <input
                type="number"
                min="1"
                max="72"
                step="0.5"
                value={formData.estimated_downtime_hours}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_downtime_hours: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-500 block">
                Empirical disaster recovery RTO threshold.
              </span>
            </div>

            {/* Incident Response Retainer */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/20">
              <label className="font-bold text-slate-900 dark:text-slate-100 block">
                External DFIR / Forensic Retainer Cost (₹)
              </label>
              <input
                type="number"
                min="100000"
                step="100000"
                value={formData.incident_response_cost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    incident_response_cost: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-500 block">
                Emergency 24/7 incident response SLA coverage.
              </span>
            </div>

            {/* Recovery Cost */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/20">
              <label className="font-bold text-slate-900 dark:text-slate-100 block">
                Technical Recovery & Restoration Cost (₹)
              </label>
              <input
                type="number"
                min="50000"
                step="100000"
                value={formData.recovery_cost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recovery_cost: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-500 block">
                Backup restoration, bare-metal rebuilds, and integrity validation.
              </span>
            </div>

            {/* Regulatory Penalty */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-800/20">
              <label className="font-bold text-slate-900 dark:text-slate-100 block">
                Regulatory Provision Baseline (₹)
              </label>
              <input
                type="number"
                min="100000"
                step="250000"
                value={formData.regulatory_cost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    regulatory_cost: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-500 block">
                Statutory reserve provision under DPDP Act 2023.
              </span>
            </div>
          </div>

          {/* Version and Audit notes */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Actuarial Grounding:
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Source: {formData.sourceType} • Calibration: {formData.simulationLabel} • Version: {formData.version}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Audit logging: Stamped with user ID and ISO timestamp.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Apply Calibrated Assumptions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
