import React, { useState, useMemo } from 'react';
import {
  Server,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Globe,
  Lock,
  ArrowUpDown,
  Coins,
  AlertTriangle,
  Building2,
  SlidersHorizontal
} from 'lucide-react';
import { Asset } from '../../types/cyberrisk';
import { useData } from '../../context/DataContext';
import { formatINR, getRiskColorClass, getSeverityBadge } from '../../utils/formatters';
import { AssetDetailModal } from './AssetDetailModal';
import { AssetFormModal } from './AssetFormModal';

interface AssetsModuleProps {
  initialSelectedAssetId?: string | null;
}

export const AssetsModule: React.FC<AssetsModuleProps> = ({ initialSelectedAssetId }) => {
  const {
    assets,
    vulnerabilities,
    controls,
    incidents,
    addAsset,
    updateAsset,
    deleteAsset,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');
  const [exposureFilter, setExposureFilter] = useState<'all' | 'exposed' | 'internal'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'eal' | 'value' | 'name'>('risk');

  // Modal states
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(() => {
    if (initialSelectedAssetId) {
      return assets.find((a) => a.id === initialSelectedAssetId) || null;
    }
    return null;
  });
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Business Units list
  const businessUnits = useMemo(() => {
    const set = new Set(assets.map((a) => a.businessUnit));
    return Array.from(set);
  }, [assets]);

  // Filtered & Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const matchesSearch =
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.type.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesUnit = selectedUnit === 'all' || asset.businessUnit === selectedUnit;
        const matchesCrit = selectedCriticality === 'all' || asset.criticality === selectedCriticality;
        const matchesExp =
          exposureFilter === 'all' ||
          (exposureFilter === 'exposed' && asset.internetExposure) ||
          (exposureFilter === 'internal' && !asset.internetExposure);

        return matchesSearch && matchesUnit && matchesCrit && matchesExp;
      })
      .sort((a, b) => {
        if (sortBy === 'risk') return b.currentRiskScore - a.currentRiskScore;
        if (sortBy === 'eal') return b.expectedAnnualLoss - a.expectedAnnualLoss;
        if (sortBy === 'value') return b.businessValue - a.businessValue;
        return a.name.localeCompare(b.name);
      });
  }, [assets, searchQuery, selectedUnit, selectedCriticality, exposureFilter, sortBy]);

  // Aggregate stats
  const totalBusinessValue = assets.reduce((sum, a) => sum + a.businessValue, 0);
  const totalEal = assets.reduce((sum, a) => sum + a.expectedAnnualLoss, 0);
  const exposedCount = assets.filter((a) => a.internetExposure).length;

  const handleSaveAsset = (assetData: any) => {
    if (editingAsset) {
      updateAsset(editingAsset.id, assetData);
    } else {
      addAsset(assetData);
    }
    setEditingAsset(null);
  };

  return (
    <div id="assets-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Enterprise Asset Inventory & Risk Scoring
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              {assets.length} NODES
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete registry of hardware nodes, workloads, databases, and microservices mapped to business value and FAIR financial exposure.
          </p>
        </div>

        <button
          id="btn-add-asset"
          onClick={() => {
            setEditingAsset(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Asset</span>
        </button>
      </div>

      {/* Top Asset Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Total Portfolio Value</span>
          <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
            {formatINR(totalBusinessValue)}
          </span>
          <span className="text-[10px] text-slate-400">Cumulative business valuation</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Annualized Loss (ALE)</span>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {formatINR(totalEal)}
          </span>
          <span className="text-[10px] text-slate-400">Modeled annual cyber loss</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Publicly Ingress Exposed</span>
          <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {exposedCount} of {assets.length}
          </span>
          <span className="text-[10px] text-slate-400">Direct internet attack perimeter</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block">Critical Tier-1 Nodes</span>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400 mt-1 block">
            {assets.filter((a) => a.criticality === 'Critical').length} Nodes
          </span>
          <span className="text-[10px] text-slate-400">Core settlement & banking</span>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="asset-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by name, ID, type, or owner..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Quick Sort */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
            >
              <option value="risk">Risk Score (High to Low)</option>
              <option value="eal">Expected Loss (High to Low)</option>
              <option value="value">Business Value (High to Low)</option>
              <option value="name">Asset Name (A to Z)</option>
            </select>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter by:
          </span>

          {/* Business Unit filter */}
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs"
          >
            <option value="all">All Business Units</option>
            {businessUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* Criticality filter */}
          <select
            value={selectedCriticality}
            onChange={(e) => setSelectedCriticality(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs"
          >
            <option value="all">All Criticalities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
          </select>

          {/* Ingress Exposure */}
          <select
            value={exposureFilter}
            onChange={(e) => setExposureFilter(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-xs"
          >
            <option value="all">All Exposure Types</option>
            <option value="exposed">Publicly Accessible Only</option>
            <option value="internal">Internal Private Only</option>
          </select>

          {(selectedUnit !== 'all' || selectedCriticality !== 'all' || exposureFilter !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedUnit('all');
                setSelectedCriticality('all');
                setExposureFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Asset Details</th>
                <th className="py-3 px-4 font-semibold">Business Unit</th>
                <th className="py-3 px-4 font-semibold">Criticality</th>
                <th className="py-3 px-4 font-semibold">Perimeter</th>
                <th className="py-3 px-4 font-semibold">Risk Score</th>
                <th className="py-3 px-4 font-semibold">Expected Loss</th>
                <th className="py-3 px-4 font-semibold">Max Exposure</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No assets found matching the selected search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const riskColors = getRiskColorClass(asset.currentRiskScore);
                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {asset.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono">{asset.id}</span>
                          <span>•</span>
                          <span>{asset.type}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {asset.businessUnit}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(asset.criticality)}`}>
                          {asset.criticality}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {asset.internetExposure ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                            <Globe className="w-3 h-3" /> Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                            <Lock className="w-3 h-3" /> Internal
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${riskColors.badge}`}>
                          {asset.currentRiskScore}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">
                        {formatINR(asset.expectedAnnualLoss)}
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                        {formatINR(asset.financialExposure)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View Asset Profile & Explainable Math"
                            onClick={() => setViewingAsset(asset)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Edit Asset Parameters"
                            onClick={() => {
                              setEditingAsset(asset);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Delete Asset"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete asset "${asset.name}"?`)) {
                                deleteAsset(asset.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Detail Modal */}
      <AssetDetailModal
        asset={viewingAsset}
        isOpen={!!viewingAsset}
        onClose={() => setViewingAsset(null)}
        vulnerabilities={vulnerabilities}
        controls={controls}
        incidents={incidents}
        onEditAsset={(a) => {
          setEditingAsset(a);
          setIsFormOpen(true);
        }}
      />

      {/* Asset Form Modal */}
      <AssetFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingAsset(null);
        }}
        onSave={handleSaveAsset}
        initialAsset={editingAsset}
      />
    </div>
  );
};
