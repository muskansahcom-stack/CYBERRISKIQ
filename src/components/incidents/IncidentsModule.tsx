import React, { useState } from 'react';
import {
  Flame,
  Search,
  Clock,
  Coins,
  AlertOctagon,
  CheckCircle2,
  BookOpen,
  Server
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/formatters';

export const IncidentsModule: React.FC = () => {
  const { incidents } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.affectedAssetName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || inc.incidentType === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalHistoricalLoss = incidents.reduce((sum, i) => sum + i.totalFinancialImpact, 0);
  const totalDowntimeHours = incidents.reduce((sum, i) => sum + i.downtimeHours, 0);

  return (
    <div id="incidents-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Historical Cyber Incidents & Loss Forensics
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
              {incidents.length} RECORDED EVENTS
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Empirical incident history used to calibrate Annual Rate of Occurrence (ARO) and actual downtime cost parameters in the FAIR model.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Total Historical Loss:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
              {formatINR(totalHistoricalLoss)}
            </span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
            <span className="text-slate-400 block text-[10px]">Total Downtime:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {totalDowntimeHours} Hours
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by incident title, ID, or affected asset..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <span className="text-slate-400">Filter Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
          >
            <option value="all">All Incident Types</option>
            <option value="DDoS Interruption">DDoS Interruption</option>
            <option value="Phishing Breach">Phishing Breach</option>
            <option value="Credential Stuffing">Credential Stuffing</option>
            <option value="Unauthorized API Access">Unauthorized API Access</option>
            <option value="Ransomware Attack">Ransomware Attack</option>
          </select>
        </div>
      </div>

      {/* Incidents List / Cards */}
      <div className="space-y-4">
        {filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                  {incident.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {incident.incidentType}
                </span>
                <span className="text-[11px] text-slate-400">{incident.date}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  {incident.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {incident.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                <Server className="w-3.5 h-3.5 text-blue-500" />
                <span>Impacted Asset: <strong>{incident.affectedAssetName}</strong> ({incident.dataAffected})</span>
              </div>

              {incident.rootCause && (
                <div className="p-3 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-300 flex items-start gap-2 mt-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Root Cause & Forensics:</strong> {incident.rootCause}
                  </div>
                </div>
              )}
            </div>

            {/* Financial Impact breakdown */}
            <div className="flex sm:flex-row md:flex-col items-start md:items-end justify-between md:justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-6 gap-3">
              <div className="text-left md:text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  Total Financial Loss
                </span>
                <span className="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400 block">
                  {formatINR(incident.totalFinancialImpact)}
                </span>
              </div>

              <div className="text-left md:text-right flex items-center gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Outage</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {incident.downtimeHours} hrs
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Business Loss</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatINR(incident.businessLoss)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Recovery</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatINR(incident.recoveryCost)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
