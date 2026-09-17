import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  ShieldCheck,
  Building2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ComplianceMappingEngine } from '../../services/complianceMappingEngine';

export const ComplianceModule: React.FC = () => {
  const { compliance } = useData();

  const frameworks = [
    'RBI Cyber Security Framework',
    'SEBI Cybersecurity and Cyber Resilience Framework',
    'ISO/IEC 27001:2022',
    'NIST Cybersecurity Framework 2.0',
    'CIS Critical Security Controls v8',
  ];

  const [activeFramework, setActiveFramework] = useState<string>(frameworks[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentSummary = ComplianceMappingEngine.getFrameworkSummary(compliance, activeFramework);

  const filteredItems = compliance.filter((item) => {
    const matchesFw = item.framework === activeFramework;
    const matchesSearch =
      item.controlId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.controlName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.evidence.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFw && matchesSearch;
  });

  return (
    <div id="compliance-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Regulatory Frameworks & Cybersecurity Compliance
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              INDIAN BFSI & GLOBAL
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard compliance attestation mappings for RBI, SEBI, ISO 27001, and NIST CSF. (Demonstration mappings for software evaluation).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Current Framework Alignment:</span>
          <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
            {currentSummary.compliancePercent}%
          </span>
        </div>
      </div>

      {/* Framework Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 border-b border-slate-200 dark:border-slate-800">
        {frameworks.map((fw) => {
          const isActive = activeFramework === fw;
          const summary = ComplianceMappingEngine.getFrameworkSummary(compliance, fw);
          return (
            <button
              key={fw}
              onClick={() => setActiveFramework(fw)}
              className={`px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{fw}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  isActive
                    ? 'bg-blue-700 text-blue-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {summary.compliancePercent}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Summary Card for Active Framework */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Total Requirements</span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
            {currentSummary.total} Controls
          </span>
          <span className="text-[10px] text-slate-400">Scoped for audit</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Fully Compliant</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {currentSummary.compliant} Verified
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Audit evidence logged</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Partially Compliant</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {currentSummary.partial} In Progress
          </span>
          <span className="text-[10px] text-slate-400">Controls underway</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Non-Compliant Gaps</span>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {currentSummary.nonCompliant} Gaps
          </span>
          <span className="text-[10px] text-rose-500 font-medium">Remediation required</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeFramework} controls or evidence...`}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Compliance Controls Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Code</th>
                <th className="py-3 px-4 font-semibold">Requirement / Control</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Audit Evidence</th>
                <th className="py-3 px-4 font-semibold">Identified Gap</th>
                <th className="py-3 px-4 font-semibold">Remediation Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No compliance items match the filter for this framework.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {item.controlId}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 max-w-[220px]">
                      {item.controlName}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          item.status === 'Compliant'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
                            : item.status === 'Partially Compliant'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-[200px]">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{item.evidence}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-rose-600 dark:text-rose-400 max-w-[200px]">
                      {item.gapAnalysis ? (
                        <div className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.gapAnalysis}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-[220px]">
                      {item.remediationPlan ? (
                        <span className="truncate block">{item.remediationPlan}</span>
                      ) : (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Attested</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
