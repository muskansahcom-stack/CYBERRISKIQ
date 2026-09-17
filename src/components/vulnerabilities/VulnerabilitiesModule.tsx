import React, { useState, useMemo } from 'react';
import {
  Bug,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpDown,
  Edit2,
  Trash2,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { Vulnerability } from '../../types/cyberrisk';
import { useData } from '../../context/DataContext';
import { formatINR, getSeverityBadge } from '../../utils/formatters';
import { VulnerabilityFormModal } from './VulnerabilityFormModal';

export const VulnerabilitiesModule: React.FC = () => {
  const {
    assets,
    vulnerabilities,
    addVulnerability,
    updateVulnerability,
    deleteVulnerability,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [exploitFilter, setExploitFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'cvss' | 'risk' | 'cost' | 'cve'>('cvss');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVuln, setEditingVuln] = useState<Vulnerability | null>(null);

  // Filtered & Sorted
  const filteredVulns = useMemo(() => {
    return vulnerabilities
      .filter((v) => {
        const matchesSearch =
          v.cveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.affectedAssetName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSeverity = severityFilter === 'all' || v.severity === severityFilter;
        const matchesStatus = statusFilter === 'all' || v.remediationStatus === statusFilter;
        const matchesExploit = exploitFilter === 'all' || v.exploitability === exploitFilter;

        return matchesSearch && matchesSeverity && matchesStatus && matchesExploit;
      })
      .sort((a, b) => {
        if (sortBy === 'cvss') return b.cvssScore - a.cvssScore;
        if (sortBy === 'risk') return b.riskContribution - a.riskContribution;
        if (sortBy === 'cost') return b.remediationCost - a.remediationCost;
        return a.cveId.localeCompare(b.cveId);
      });
  }, [vulnerabilities, searchQuery, severityFilter, statusFilter, exploitFilter, sortBy]);

  // Quick stats
  const criticalCount = vulnerabilities.filter((v) => v.severity === 'Critical').length;
  const activeExploits = vulnerabilities.filter((v) => v.exploitability.includes('In-the-Wild')).length;
  const openCount = vulnerabilities.filter((v) => v.remediationStatus === 'Open').length;
  const totalRemediationCost = vulnerabilities.reduce((sum, v) => sum + v.remediationCost, 0);

  const handleSaveVuln = (data: any) => {
    if (editingVuln) {
      updateVulnerability(editingVuln.id, data);
    } else {
      addVulnerability(data);
    }
    setEditingVuln(null);
  };

  const handleMarkMitigated = (v: Vulnerability) => {
    updateVulnerability(v.id, { remediationStatus: 'Mitigated' });
  };

  return (
    <div id="vulnerabilities-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Vulnerability & CVE Prioritization Backlog
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              {vulnerabilities.length} CVEs TRACKED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritize security patching based on asset financial impact, active in-the-wild exploitation, and risk contribution.
          </p>
        </div>

        <button
          id="btn-log-vulnerability"
          onClick={() => {
            setEditingVuln(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log Vulnerability</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Critical Severity CVEs</span>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {criticalCount} CVEs
          </span>
          <span className="text-[10px] text-slate-400">CVSS 9.0 to 10.0</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Active In-the-Wild Exploits</span>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {activeExploits} Weaponized
          </span>
          <span className="text-[10px] text-rose-500 font-medium">Immediate patch mandate</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Open Action Pending</span>
          <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {openCount} Pending
          </span>
          <span className="text-[10px] text-slate-400">Under SLA review</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Remediation Budget Needed</span>
          <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
            {formatINR(totalRemediationCost)}
          </span>
          <span className="text-[10px] text-slate-400">Estimated engineering cost</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by CVE-ID, flaw name, or affected asset..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
            >
              <option value="cvss">CVSS Score (Highest)</option>
              <option value="risk">Risk Contribution (Highest)</option>
              <option value="cost">Remediation Cost (Highest)</option>
              <option value="cve">CVE ID</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter by:
          </span>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical (9.0+)</option>
            <option value="High">High (7.0 - 8.9)</option>
            <option value="Medium">Medium (4.0 - 6.9)</option>
            <option value="Low">Low (0.1 - 3.9)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Mitigated">Mitigated</option>
            <option value="Accepted Risk">Accepted Risk</option>
          </select>

          <select
            value={exploitFilter}
            onChange={(e) => setExploitFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs"
          >
            <option value="all">All Exploit Statuses</option>
            <option value="Active In-the-Wild Exploitation">Active In-the-Wild</option>
            <option value="Proof-of-Concept Public">Proof-of-Concept Public</option>
            <option value="Theoretical Exploit">Theoretical Exploit</option>
          </select>

          {(severityFilter !== 'all' || statusFilter !== 'all' || exploitFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSeverityFilter('all');
                setStatusFilter('all');
                setExploitFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Vulnerabilities Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">CVE ID & Flaw</th>
                <th className="py-3 px-4 font-semibold">Target Asset</th>
                <th className="py-3 px-4 font-semibold">CVSS</th>
                <th className="py-3 px-4 font-semibold">Threat Weaponization</th>
                <th className="py-3 px-4 font-semibold">Risk Contribution</th>
                <th className="py-3 px-4 font-semibold">Patch Cost</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVulns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No vulnerabilities found matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredVulns.map((vuln) => (
                  <tr
                    key={vuln.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 max-w-[240px]">
                      <div className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {vuln.cveId}
                      </div>
                      <div className="text-slate-800 dark:text-slate-200 font-medium truncate mt-0.5">
                        {vuln.name}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {vuln.description}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                      {vuln.affectedAssetName}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(vuln.severity)}`}>
                        {vuln.cvssScore}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {vuln.exploitability.includes('In-the-Wild') ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 text-[11px]">
                          <Flame className="w-3 h-3 text-rose-500" /> Active In-the-Wild
                        </span>
                      ) : vuln.exploitability.includes('Proof-of-Concept') ? (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 text-[11px]">
                          <AlertTriangle className="w-3 h-3" /> Public PoC
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {vuln.exploitability}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">
                      +{vuln.riskContribution} pts
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {formatINR(vuln.remediationCost)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          vuln.remediationStatus === 'Mitigated'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
                            : vuln.remediationStatus === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                            : vuln.remediationStatus === 'Risk Accepted'
                            ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900'
                        }`}
                      >
                        {vuln.remediationStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {vuln.remediationStatus !== 'Mitigated' && (
                          <button
                            title="Mark as Mitigated"
                            onClick={() => handleMarkMitigated(vuln)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          title="Edit Vulnerability"
                          onClick={() => {
                            setEditingVuln(vuln);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => {
                            if (window.confirm(`Delete record for ${vuln.cveId}?`)) {
                              deleteVulnerability(vuln.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <VulnerabilityFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVuln(null);
        }}
        onSave={handleSaveVuln}
        initialVuln={editingVuln}
        assets={assets}
      />
    </div>
  );
};
