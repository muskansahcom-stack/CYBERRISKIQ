import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Server,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { SecurityControl } from '../../types/cyberrisk';
import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/formatters';

export const SecurityControlsModule: React.FC = () => {
  const { controls, assets } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'effectiveness' | 'cost' | 'name'>('effectiveness');

  const categories = useMemo(() => {
    return Array.from(new Set(controls.map((c) => c.category)));
  }, [controls]);

  const filteredControls = useMemo(() => {
    return controls
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
        const matchesStat = selectedStatus === 'all' || c.status === selectedStatus;

        return matchesSearch && matchesCat && matchesStat;
      })
      .sort((a, b) => {
        if (sortBy === 'effectiveness') return b.effectivenessPercent - a.effectivenessPercent;
        if (sortBy === 'cost') return b.annualCost - a.annualCost;
        return a.name.localeCompare(b.name);
      });
  }, [controls, searchQuery, selectedCategory, selectedStatus, sortBy]);

  const totalControlSpend = controls.reduce((sum, c) => sum + c.annualCost, 0);
  const avgEffectiveness =
    controls.length > 0
      ? Math.round(controls.reduce((sum, c) => sum + c.effectivenessPercent, 0) / controls.length)
      : 0;
  const fullyImplemented = controls.filter((c) => c.status === 'Active').length;

  return (
    <div id="controls-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Security Controls & Defense Telemetry
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
              {controls.length} ACTIVE DEFENSES
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit implementation completeness, empirical effectiveness, operational expenditure, and coverage gaps across assets.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Total Defense Spend:</span>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            {formatINR(totalControlSpend)}/yr
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Average Effectiveness</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {avgEffectiveness}%
          </span>
          <span className="text-[10px] text-slate-400">Empirically validated</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Active & Deployed</span>
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
            {fullyImplemented} of {controls.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-medium">Production operational</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Partially Implemented</span>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {controls.filter((c) => c.status === 'Partially Implemented').length} Controls
          </span>
          <span className="text-[10px] text-slate-400">Remediation in progress</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Degraded / Deficiencies</span>
          <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {controls.filter((c) => c.status === 'Degraded').length} Degraded
          </span>
          <span className="text-[10px] text-rose-500 font-medium">High risk vulnerability</span>
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
              placeholder="Search controls by name, ID, or framework..."
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
              <option value="effectiveness">Effectiveness (Highest)</option>
              <option value="cost">Annual Cost (Highest)</option>
              <option value="name">Control Name (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs"
          >
            <option value="all">All Domains</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Partially Implemented">Partially Implemented</option>
            <option value="Planned">Planned</option>
            <option value="Degraded">Degraded</option>
          </select>

          {(selectedCategory !== 'all' || selectedStatus !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Controls Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredControls.map((ctrl) => {
          const coveredAssetNames = assets
            .filter((a) => ctrl.affectedAssetIds.includes(a.id))
            .map((a) => a.name);

          return (
            <div
              key={ctrl.id}
              className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                    {ctrl.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      ctrl.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
                        : ctrl.status === 'Partially Implemented'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    {ctrl.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {ctrl.name}
                </h3>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  ID: {ctrl.id} • Owner: {ctrl.owner}
                </span>

                {/* Effectiveness Progress */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Control Effectiveness</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {ctrl.effectivenessPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        ctrl.effectivenessPercent >= 80
                          ? 'bg-emerald-500'
                          : ctrl.effectivenessPercent >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${ctrl.effectivenessPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Annual OpEx:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatINR(ctrl.annualCost)}
                    </span>
                  </div>
                </div>

                {/* Coverage & Description */}
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Server className="w-3 h-3 text-blue-500" /> Protected Assets ({ctrl.affectedAssetIds.length})
                    </span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 truncate mt-0.5">
                      {coveredAssetNames.join(', ') || 'Enterprise Fleetwide'}
                    </p>
                  </div>

                  {ctrl.description && (
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                      <p className="leading-tight">{ctrl.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
