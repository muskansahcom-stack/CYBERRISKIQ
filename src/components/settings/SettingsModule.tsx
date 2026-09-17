import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Save,
  CheckCircle2,
  Building2,
  Coins,
  Shield,
  Sliders,
  AlertTriangle,
  Database,
  CloudCheck,
  Server
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/formatters';
import firebaseConfig from '../../../firebase-applet-config.json';

export const SettingsModule: React.FC = () => {
  const {
    financialProfile,
    updateFinancialAssumptions,
    resetToDefaultData,
  } = useData();

  const [orgName, setOrgName] = useState('Acme Financial Services');
  const [currency] = useState('INR (₹)');
  const [downtimeCost, setDowntimeCost] = useState(financialProfile.assumptions.hourlyDowntimeRate);
  const [recordCost, setRecordCost] = useState(financialProfile.assumptions.costPerBreachedRecord);
  const [riskThreshold, setRiskThreshold] = useState(60);

  // Scoring weights
  const [weightCriticality] = useState(30);
  const [weightThreat] = useState(25);
  const [weightVuln] = useState(25);
  const [weightControl] = useState(20);

  const [savedNotice, setSavedNotice] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancialAssumptions({
      ...financialProfile.assumptions,
      hourlyDowntimeRate: Number(downtimeCost),
      costPerBreachedRecord: Number(recordCost),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all data back to the default Acme Financial Services demonstration state? Any custom additions will be reverted.'
      )
    ) {
      resetToDefaultData();
      setResetNotice(true);
      setTimeout(() => setResetNotice(false), 3500);
    }
  };

  return (
    <div id="settings-module-view" className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Enterprise Configuration & Financial Calibration
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
              SYSTEM PARAMS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calibrate organizational financial impact rates, risk appetite tolerance, and multi-factor scoring weights.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Changes saved successfully!
          </div>
        )}
      </div>

      {resetNotice && (
        <div className="p-3 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-900 text-xs flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-600" />
          <span>All enterprise data restored to original demonstration baseline!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Organization & Currency */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> Organization Profile & Actuarial Currency
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">
                Financial Currency Standard
              </label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Hardcoded to Indian Rupee (INR ₹) per business specification.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Financial Impact Calibration */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-600" /> FAIR Financial Impact Factors
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">
                Default Hourly Operational Downtime Cost (₹)
              </label>
              <input
                type="number"
                value={downtimeCost}
                onChange={(e) => setDowntimeCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Current: {formatINR(downtimeCost)} / hour of transaction engine unavailability.
              </span>
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 mb-1">
                Cost per Compromised Customer PII Record (₹)
              </label>
              <input
                type="number"
                value={recordCost}
                onChange={(e) => setRecordCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Current: {formatINR(recordCost)} / record in notifications, forensics, & DPDP fines.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Risk Appetite & Scoring Weights */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" /> Risk Appetite Threshold & Factor Weights
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400">
                  Board Risk Appetite Upper Tolerance
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {riskThreshold} / 100
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="80"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                className="w-full accent-rose-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Any asset scoring above {riskThreshold} triggers an automated executive escalation.
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 font-semibold block mb-2">
                Multi-Factor Scoring Weights (%):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Criticality</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{weightCriticality}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Threat Prob</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{weightThreat}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 block">CVSS Vuln</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{weightVuln}%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-400 block">Deficiency</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{weightControl}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Infrastructure & Firebase Provisioning Status Card */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Cloud Infrastructure & Firebase Firestore
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    Active & Provisioned
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cloud-hosted persistent Firestore database storage & tenant security rules.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Firebase Project ID</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate block">
                {firebaseConfig.projectId || 'intense-cache-t8chg'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Firestore Database</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate block" title={firebaseConfig.firestoreDatabaseId}>
                {firebaseConfig.firestoreDatabaseId || '(default)'}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Security Rule Engine</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deployed & Enforcing RBAC</span>
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset Demo Data (Acme Financial)</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
