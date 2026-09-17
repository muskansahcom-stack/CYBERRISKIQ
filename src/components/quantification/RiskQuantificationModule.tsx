import React, { useState, useMemo } from 'react';
import {
  Calculator,
  ShieldAlert,
  Coins,
  ChevronDown,
  Info,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  Sliders,
  BarChart3,
  Search,
  FileCheck2,
  FileText,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DefensibleFinancialEngine } from '../../services/defensibleFinancialEngine';
import { formatINR, getRiskColorClass, getSeverityBadge } from '../../utils/formatters';
import { DefensibleCalculationTraceModal } from './DefensibleCalculationTraceModal';
import { RiskDriversCard } from './RiskDriversCard';
import { FinancialImpactDecompositionCard } from './FinancialImpactDecompositionCard';
import { MonteCarloSimulationModal } from './MonteCarloSimulationModal';
import { CalibrateAssumptionsModal } from './CalibrateAssumptionsModal';
import { BusinessUnitPortfolioCard } from './BusinessUnitPortfolioCard';
import { HistoricalRiskTrendCard } from './HistoricalRiskTrendCard';
import { MonteCarloSimulationResult } from '../../types/cyberrisk';

export const RiskQuantificationModule: React.FC = () => {
  const {
    assets,
    vulnerabilities,
    controls,
    incidents,
    enterpriseRiskScore,
    totalFinancialExposure,
    totalExpectedAnnualLoss,
    defensibleAssumptions,
    historicalSnapshots,
    topRiskContributors,
    businessUnitAggregations,
    varMetrics,
    runMonteCarlo,
    updateDefensibleAssumptions,
  } = useData();

  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBU, setSelectedBU] = useState<string | null>(null);

  // Modals state
  const [isTraceModalOpen, setIsTraceModalOpen] = useState<boolean>(false);
  const [isMonteCarloModalOpen, setIsMonteCarloModalOpen] = useState<boolean>(false);
  const [isCalibrateModalOpen, setIsCalibrateModalOpen] = useState<boolean>(false);
  const [initialMcResult, setInitialMcResult] = useState<MonteCarloSimulationResult | null>(null);

  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  // Defensible calculations for selected asset
  const assetCalculation = useMemo(() => {
    if (!selectedAsset) return null;
    return DefensibleFinancialEngine.calculateDefensibleAssetEAL(
      selectedAsset,
      vulnerabilities,
      controls,
      incidents,
      defensibleAssumptions
    );
  }, [selectedAsset, vulnerabilities, controls, incidents, defensibleAssumptions]);

  const assetTrace = useMemo(() => {
    if (!selectedAsset) return [];
    return DefensibleFinancialEngine.generateCalculationTrace(
      selectedAsset,
      vulnerabilities,
      controls,
      incidents,
      totalExpectedAnnualLoss,
      defensibleAssumptions
    );
  }, [selectedAsset, vulnerabilities, controls, incidents, totalExpectedAnnualLoss, defensibleAssumptions]);

  const assetDrivers = useMemo(() => {
    if (!selectedAsset) return [];
    return DefensibleFinancialEngine.generateRiskDrivers(
      selectedAsset,
      vulnerabilities,
      controls,
      incidents
    );
  }, [selectedAsset, vulnerabilities, controls, incidents]);

  // Filtered assets for the ranking ledger
  const filteredAssets = useMemo(() => {
    return assets
      .filter((a) => {
        const matchesSearch =
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.businessUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBU = selectedBU ? a.businessUnit === selectedBU : true;
        return matchesSearch && matchesBU;
      })
      .sort((a, b) => (b.expectedAnnualLoss || 0) - (a.expectedAnnualLoss || 0));
  }, [assets, searchQuery, selectedBU]);

  const handleOpenMonteCarlo = async (assetId?: string) => {
    const targetId = assetId || selectedAsset?.id;
    if (!targetId) return;
    try {
      const sim = await runMonteCarlo(targetId, 2000);
      setInitialMcResult(sim);
    } catch (e) {
      console.warn('Simulation init failed:', e);
    }
    setIsMonteCarloModalOpen(true);
  };

  return (
    <div id="quantification-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Defensible Financial Cyber Risk & EAL Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              OPEN FAIR ACTUARIAL MATH
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              SIMULATION / MODELLED ESTIMATE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deterministic, explainable cyber risk quantification backing all financial loss figures with identifiable assumptions, threat telemetry, and empirical control tests.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCalibrateModalOpen(true)}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Calibrate Assumptions
          </button>
          <button
            onClick={() => handleOpenMonteCarlo(selectedAsset?.id)}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" />
            Monte Carlo & VaR
          </button>
        </div>
      </div>

      {/* Enterprise Executive Risk Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Enterprise Score */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
            Enterprise Risk Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {enterpriseRiskScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-[10px] text-slate-500 block">
            Weighted composite risk across {assets.length} nodes
          </span>
        </div>

        {/* Total Expected Annual Loss (EAL) */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
            Expected Annual Loss (EAL)
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatINR(totalExpectedAnnualLoss)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            Annualized loss expectancy (Σ Asset EAL)
          </span>
        </div>

        {/* Total Financial Exposure (SLE) */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
            Max Incident Exposure
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatINR(totalFinancialExposure)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            Single incident max cumulative loss
          </span>
        </div>

        {/* VaR 95% */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 tracking-wider block">
            VaR 95% (Adverse Cyber Year)
          </span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {formatINR(varMetrics.var95)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            1-in-20 year loss tolerance ceiling
          </span>
        </div>

        {/* VaR 99% Catastrophe */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider block">
            VaR 99% (Tail Catastrophe)
          </span>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {formatINR(varMetrics.var99)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            1-in-100 year systemic black swan
          </span>
        </div>
      </div>

      {/* Mathematical Framework Box */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 rounded-xl p-6 text-white shadow-md border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-800/80">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-300">
              Foundational Actuarial FAIR Standard Equation
            </span>
            <h3 className="text-xl font-bold tracking-tight mt-0.5">
              EAL = Annual Incident Probability (ARO) × Expected Financial Impact (SLE)
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-200">Portfolio Annual Loss</span>
            <div className="text-2xl font-bold text-amber-400">
              {formatINR(totalExpectedAnnualLoss)} / yr
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-xs text-slate-200">
          <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">1</span>
              Annual Incident Probability (ARO)
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Derived from threat actor targeting frequency and exploitability, dampened by validated control effectiveness and coverage.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">2</span>
              Single Loss Expectancy (SLE)
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Sum of hourly operational downtime, record exfiltration costs, technical recovery, forensics retainers, and RBI / DPDP Act statutory fines.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">3</span>
              Stochastic Uncertainty & VaR
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Poisson-Triangular 2,000-trial Monte Carlo models establish 80% credible bounds and 90%/95%/99% Value at Risk thresholds for board oversight.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Asset Risk Breakdown Inspector */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Interactive Asset Risk Decomposition & Audit Inspector
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                DEEP DIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any scoped asset to inspect its actuarial decomposition, audit trace, and risk drivers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Select Asset:</span>
            <select
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-medium max-w-[280px]"
            >
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} (Risk {a.currentRiskScore} • {formatINR(a.expectedAnnualLoss)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedAsset && assetCalculation && (
          <div className="space-y-6">
            {/* Top Score Banner with Audit Trigger */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    {selectedAsset.businessUnit} • {selectedAsset.type}
                  </span>
                  <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${getSeverityBadge(selectedAsset.criticality)}`}>
                    {selectedAsset.criticality}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedAsset.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Business Value: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatINR(selectedAsset.businessValue)}</span> • Data Sensitivity: {selectedAsset.dataSensitivity} • Owner: {selectedAsset.owner}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Composite Risk Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                      {selectedAsset.currentRiskScore}
                    </span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>

                <div className="border-l border-slate-200 dark:border-slate-700 pl-6">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Annual Likelihood (ARO)
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                    {(assetCalculation.annualIncidentProbability * 100).toFixed(1)}% / yr
                  </span>
                </div>

                <div className="border-l border-slate-200 dark:border-slate-700 pl-6">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Expected Annual Loss (EAL)
                  </span>
                  <span className="text-xl font-bold text-rose-600 dark:text-rose-400 block mt-0.5">
                    {formatINR(assetCalculation.expectedAnnualLoss)}
                  </span>
                </div>

                {/* Audit Trace Button */}
                <div className="border-l border-slate-200 dark:border-slate-700 pl-6 flex flex-col gap-1.5">
                  <button
                    onClick={() => setIsTraceModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    Inspect Calculation Trace
                  </button>
                  <button
                    onClick={() => handleOpenMonteCarlo(selectedAsset.id)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-1.5"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                    Asset Monte Carlo (VaR)
                  </button>
                </div>
              </div>
            </div>

            {/* Formula display box */}
            <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs font-mono text-blue-900 dark:text-blue-300 flex items-center justify-between">
              <div>
                <span className="font-bold block mb-1">Actuarial Formula Derivation:</span>
                <span>
                  EAL = ({(assetCalculation.annualIncidentProbability * 100).toFixed(1)}% Annual Probability) × ({formatINR(assetCalculation.expectedFinancialImpact)} SLE) = {formatINR(assetCalculation.expectedAnnualLoss)}
                </span>
              </div>
              <span className="text-[10px] font-sans font-bold px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                PROVENANCE: {assetCalculation.provenance}
              </span>
            </div>

            {/* Risk Drivers Card ("Why is this risk high?") */}
            <RiskDriversCard drivers={assetDrivers} assetName={selectedAsset.name} />

            {/* Financial Impact Decomposition Card (7 Actuarial Components) */}
            <FinancialImpactDecompositionCard
              decomposition={assetCalculation.impactDecomposition}
              uncertaintyRange={assetCalculation.uncertaintyRangeImpact}
              assumptions={defensibleAssumptions}
              assetName={selectedAsset.name}
            />
          </div>
        )}
      </div>

      {/* Business Unit Risk Allocation */}
      <BusinessUnitPortfolioCard
        aggregations={businessUnitAggregations}
        onSelectBusinessUnit={(bu) => setSelectedBU(selectedBU === bu ? null : bu)}
        selectedBusinessUnit={selectedBU}
      />

      {/* Enterprise-wide Risk Ranking & Attribution Ledger */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden space-y-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Enterprise Asset Risk Attribution Ledger
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {filteredAssets.length} of {assets.length} Assets
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked by Expected Annual Loss (EAL) and enterprise risk portfolio contribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedBU && (
              <button
                onClick={() => setSelectedBU(null)}
                className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
              >
                Filtered: {selectedBU} ✕
              </button>
            )}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs w-44"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3.5 font-semibold">Asset Name</th>
                <th className="py-2.5 px-3.5 font-semibold">Business Unit</th>
                <th className="py-2.5 px-3.5 font-semibold">Criticality</th>
                <th className="py-2.5 px-3.5 font-semibold">Risk Score</th>
                <th className="py-2.5 px-3.5 font-semibold">Annual Probability</th>
                <th className="py-2.5 px-3.5 font-semibold">Single Loss Impact (SLE)</th>
                <th className="py-2.5 px-3.5 font-semibold">Expected Annual Loss (EAL)</th>
                <th className="py-2.5 px-3.5 font-semibold">Portfolio Share</th>
                <th className="py-2.5 px-3.5 font-semibold text-right">Audit Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAssets.map((a) => {
                const riskColors = getRiskColorClass(a.currentRiskScore);
                const contrib = topRiskContributors.find((c) => c.assetId === a.id);
                const sharePercent = contrib ? contrib.contributionPercent : 0;
                const isSelected = selectedAssetId === a.id;

                return (
                  <tr
                    key={a.id}
                    onClick={() => setSelectedAssetId(a.id)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/40 dark:bg-blue-950/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span>{a.name}</span>
                        {a.internetExposure && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                            Public
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300">
                      {a.businessUnit}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(a.criticality)}`}>
                        {a.criticality}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskColors.badge}`}>
                        {a.currentRiskScore}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {a.financialExposure && a.expectedAnnualLoss
                        ? `${((a.expectedAnnualLoss / a.financialExposure) * 100).toFixed(1)}%`
                        : '—'}
                    </td>
                    <td className="py-2.5 px-3.5 text-slate-800 dark:text-slate-200 font-medium">
                      {formatINR(a.financialExposure)}
                    </td>
                    <td className="py-2.5 px-3.5 font-bold text-rose-600 dark:text-rose-400">
                      {formatINR(a.expectedAnnualLoss)}
                    </td>
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, sharePercent))}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {sharePercent.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssetId(a.id);
                          setIsTraceModalOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors font-medium text-[11px]"
                      >
                        Inspect Trace
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Risk Trajectory Card */}
      <HistoricalRiskTrendCard snapshots={historicalSnapshots} />

      {/* Calculation Trace Modal */}
      {selectedAsset && (
        <DefensibleCalculationTraceModal
          isOpen={isTraceModalOpen}
          onClose={() => setIsTraceModalOpen(false)}
          asset={selectedAsset}
          trace={assetTrace}
        />
      )}

      {/* Monte Carlo Simulation Modal */}
      {selectedAsset && (
        <MonteCarloSimulationModal
          isOpen={isMonteCarloModalOpen}
          onClose={() => setIsMonteCarloModalOpen(false)}
          asset={selectedAsset}
          onRunSimulation={(assetId, iters) => runMonteCarlo(assetId, iters)}
          initialResult={initialMcResult}
        />
      )}

      {/* Calibrate Assumptions Modal */}
      <CalibrateAssumptionsModal
        isOpen={isCalibrateModalOpen}
        onClose={() => setIsCalibrateModalOpen(false)}
        currentAssumptions={defensibleAssumptions}
        onSave={async (updates) => {
          await updateDefensibleAssumptions(updates);
        }}
      />
    </div>
  );
};
