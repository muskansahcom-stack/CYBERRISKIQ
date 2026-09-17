import React, { useState } from 'react';
import {
  Server,
  AlertTriangle,
  Bug,
  ShieldCheck,
  Flame,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  AlertOctagon
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR, getSeverityBadge, getRiskColorClass } from '../../utils/formatters';
import { NavigationTab } from '../layout/Sidebar';

interface TechnicalDashboardProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectAsset?: (assetId: string) => void;
  onSelectVuln?: (vulnId: string) => void;
}

export const TechnicalDashboard: React.FC<TechnicalDashboardProps> = ({
  onNavigateTab,
  onSelectAsset,
  onSelectVuln,
}) => {
  const {
    assets,
    vulnerabilities,
    controls,
    incidents,
    criticalAssetsCount,
    criticalVulnsCount,
    openVulnsCount,
    avgControlEffectiveness,
  } = useData();

  const [tableFilter, setTableFilter] = useState<'all' | 'critical'>('all');

  const criticalVulnerabilities = vulnerabilities
    .filter((v) => (tableFilter === 'critical' ? v.severity === 'Critical' : true))
    .slice(0, 6);

  const affectedAssets = assets
    .filter((a) => a.currentRiskScore > 65)
    .sort((a, b) => b.currentRiskScore - a.currentRiskScore)
    .slice(0, 5);

  const keyControls = controls.slice(0, 5);
  const recentIncidents = incidents.slice(0, 5);

  return (
    <div id="technical-dashboard-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Technical Security Dashboard & Risk Overview
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              SECOPS OVERVIEW
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time telemetry, vulnerability burn-down, control effectiveness, and active security incidents.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Mean Remediation Time:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            18.2 Days
          </span>
        </div>
      </div>

      {/* Technical Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Total Assets */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Total Assets</span>
            <Server className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{assets.length}</div>
          <span className="text-[10px] text-slate-400">100% In Inventory</span>
        </div>

        {/* Critical Assets */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Critical Assets</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
            {criticalAssetsCount}
          </div>
          <span className="text-[10px] text-slate-400">Tier-1 Core Systems</span>
        </div>

        {/* Critical Vulns */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Critical CVEs</span>
            <Bug className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
            {criticalVulnsCount}
          </div>
          <span className="text-[10px] text-rose-500 font-medium">Under active exploit</span>
        </div>

        {/* Open Vulns */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Open Vulns</span>
            <Bug className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {openVulnsCount}
          </div>
          <span className="text-[10px] text-slate-400">Total cataloged: {vulnerabilities.length}</span>
        </div>

        {/* Security Incidents */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Incidents</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {incidents.length}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">All Remediated</span>
        </div>

        {/* Avg Control Effectiveness */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Control Effect.</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {avgControlEffectiveness}%
          </div>
          <span className="text-[10px] text-slate-400">Across 11 defenses</span>
        </div>

        {/* Remediation Backlog */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">Backlog</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">14 Items</div>
          <span className="text-[10px] text-slate-400">SLA target: &lt; 14 days</span>
        </div>
      </div>

      {/* Grid: Tables for Critical Vulnerabilities & Affected Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Critical Vulnerabilities */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Critical & High Vulnerabilities
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400">
                Active
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('vulnerabilities')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              View All ({vulnerabilities.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">CVE ID</th>
                  <th className="py-2.5 px-4 font-semibold">Affected Asset</th>
                  <th className="py-2.5 px-4 font-semibold">CVSS</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {criticalVulnerabilities.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => onNavigateTab('vulnerabilities')}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-4 font-semibold text-blue-600 dark:text-blue-400">
                      {v.cveId}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                      {v.affectedAssetName}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(v.severity)}`}>
                        {v.cvssScore}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`text-[11px] font-medium ${
                          v.remediationStatus === 'Mitigated'
                            ? 'text-emerald-600'
                            : v.remediationStatus === 'In Progress'
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {v.remediationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Affected Assets (High Risk) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Top Affected Assets (Risk &gt; 65)
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                Priority
              </span>
            </div>
            <button
              onClick={() => onNavigateTab('assets')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              All Assets ({assets.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Asset Name</th>
                  <th className="py-2.5 px-4 font-semibold">Business Unit</th>
                  <th className="py-2.5 px-4 font-semibold">Risk Score</th>
                  <th className="py-2.5 px-4 font-semibold">Annual Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {affectedAssets.map((a) => {
                  const riskColors = getRiskColorClass(a.currentRiskScore);
                  return (
                    <tr
                      key={a.id}
                      onClick={() => onNavigateTab('assets')}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100 truncate max-w-[180px]">
                        {a.name}
                      </td>
                      <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                        {a.businessUnit}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${riskColors.badge}`}>
                          {a.currentRiskScore}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-rose-600 dark:text-rose-400">
                        {formatINR(a.expectedAnnualLoss)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grid: Security Controls & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 3: Security Controls Effectiveness */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Security Controls Status
            </h3>
            <button
              onClick={() => onNavigateTab('controls')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              View All ({controls.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Control Name</th>
                  <th className="py-2.5 px-4 font-semibold">Category</th>
                  <th className="py-2.5 px-4 font-semibold">Effectiveness</th>
                  <th className="py-2.5 px-4 font-semibold">Annual Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {keyControls.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onNavigateTab('controls')}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                      {c.category}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              c.effectivenessPercent >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${c.effectivenessPercent}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {c.effectivenessPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {formatINR(c.annualCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 4: Recent Incidents */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Recent Security Incidents
            </h3>
            <button
              onClick={() => onNavigateTab('incidents')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              View All ({incidents.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Incident ID</th>
                  <th className="py-2.5 px-4 font-semibold">Type</th>
                  <th className="py-2.5 px-4 font-semibold">Total Impact</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentIncidents.map((inc) => (
                  <tr
                    key={inc.id}
                    onClick={() => onNavigateTab('incidents')}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {inc.id}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 truncate max-w-[170px]">
                      {inc.incidentType}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-rose-600 dark:text-rose-400">
                      {formatINR(inc.totalFinancialImpact)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
