import React from 'react';
import { Asset, Vulnerability, SecurityControl, SecurityIncident } from '../../types/cyberrisk';
import { Modal } from '../common/Modal';
import { formatINR, getRiskColorClass, getSeverityBadge } from '../../utils/formatters';
import { Server, ShieldAlert, ShieldCheck, Flame, Globe, Lock, Cpu, ArrowRight } from 'lucide-react';
import { RiskQuantificationEngine } from '../../services/riskQuantificationEngine';

interface AssetDetailModalProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  vulnerabilities: Vulnerability[];
  controls: SecurityControl[];
  incidents: SecurityIncident[];
  onEditAsset: (asset: Asset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  isOpen,
  onClose,
  vulnerabilities,
  controls,
  incidents,
  onEditAsset,
}) => {
  if (!asset) return null;

  const riskColors = getRiskColorClass(asset.currentRiskScore);
  const assetVulns = vulnerabilities.filter((v) => v.affectedAssetId === asset.id);
  const assetControls = controls.filter((c) => c.affectedAssetIds.includes(asset.id));
  const assetIncidents = incidents.filter((i) => i.affectedAssetId === asset.id);

  const riskFactors = RiskQuantificationEngine.calculateAssetRiskFactors(
    asset,
    vulnerabilities,
    controls,
    incidents
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={asset.name}
      subtitle={`Asset ID: ${asset.id} • ${asset.type} • ${asset.businessUnit}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top summary card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Current Risk Score</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xl font-bold ${riskColors.text}`}>
                {asset.currentRiskScore}/100
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${riskColors.badge}`}>
                {riskColors.level}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Expected Annual Loss</span>
            <span className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
              {formatINR(asset.expectedAnnualLoss)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Financial Exposure</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
              {formatINR(asset.financialExposure)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Business Value</span>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
              {formatINR(asset.businessValue)}
            </span>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Server className="w-3.5 h-3.5 text-blue-500" /> Operational & Technical Attributes
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Asset Type:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{asset.type}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Business Unit:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{asset.businessUnit}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Owner:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{asset.owner}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Network / Location:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{asset.ipOrLocation}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Internet Exposure:</span>
              <span className="font-semibold flex items-center gap-1">
                {asset.internetExposure ? (
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" /> Publicly Accessible
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Isolated Private Network
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Cpu className="w-3.5 h-3.5 text-blue-500" /> Criticality & Data Governance
            </h4>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">System Criticality:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getSeverityBadge(asset.criticality)}`}>
                {asset.criticality} Tier
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Data Sensitivity:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{asset.dataSensitivity}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500">Upstream / Downstream Dependencies:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {asset.dependencies.length > 0 ? asset.dependencies.join(', ') : 'None documented'}
              </span>
            </div>
            <div className="py-1">
              <span className="text-slate-500 block mb-1">Architecture Notes:</span>
              <p className="text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded">
                {asset.notes || 'No custom notes provided for this node.'}
              </p>
            </div>
          </div>
        </div>

        {/* Explainable Risk Quantification Box */}
        <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 text-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600" /> Explainable Risk Math (FAIR Model)
            </h4>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
              EAL = ARO × SLE
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-3">
            {riskFactors.formulaText}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-blue-100 dark:border-blue-900/60">
            <div>
              <span className="text-[10px] text-slate-400 block">Threat Likelihood</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {(riskFactors.threatLikelihood * 100).toFixed(0)}% / year
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Exploitability Factor</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {riskFactors.exploitabilityFactor * 10} / 10
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Control Deficiency</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {(riskFactors.controlDeficiencyFactor * 100).toFixed(0)}% gap
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Annual Rate of Occur. (ARO)</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {riskFactors.annualRateOfOccurrence} events/yr
              </span>
            </div>
          </div>
        </div>

        {/* Associated Vulnerabilities */}
        <div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-2 flex items-center justify-between">
            <span>Associated Vulnerabilities ({assetVulns.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Ranked by risk contribution</span>
          </h4>

          {assetVulns.length === 0 ? (
            <p className="text-xs text-slate-400 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              No active CVEs currently recorded on this asset.
            </p>
          ) : (
            <div className="space-y-2">
              {assetVulns.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{v.cveId}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${getSeverityBadge(v.severity)}`}>
                        CVSS {v.cvssScore}
                      </span>
                      <span className="text-slate-400 text-[11px]">{v.exploitability}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">{v.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 block">
                      +{v.riskContribution} pts
                    </span>
                    <span className="text-[10px] text-slate-400">{v.remediationStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Associated Security Controls */}
        <div>
          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-2">
            Active Defenses & Controls ({assetControls.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {assetControls.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block max-w-[200px]">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.category}</span>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {c.effectivenessPercent}% Eff.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Security Incidents */}
        {assetIncidents.length > 0 && (
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Historical Incidents ({assetIncidents.length})
            </h4>
            <div className="space-y-2">
              {assetIncidents.map((i) => (
                <div
                  key={i.id}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{i.title}</span>
                    <span className="text-slate-400 text-[10px] ml-2">({i.date})</span>
                  </div>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {formatINR(i.totalFinancialImpact)} impact
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close Details
          </button>
          <button
            onClick={() => {
              onClose();
              onEditAsset(asset);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            Edit Asset Parameters <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
