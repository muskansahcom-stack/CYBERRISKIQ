import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Percent,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  CheckCircle2,
  AlertCircle,
  Filter,
  Layers,
  HelpCircle,
  Search,
  Coins,
  Send,
  Loader2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AiDecisionEngine, AiDecisionResponse } from '../../services/aiDecisionEngine';
import { formatINR } from '../../utils/formatters';

interface ActionProposal {
  id: string;
  title: string;
  category: string;
  priority: 'High' | 'Medium' | 'Critical';
  affectedAsset: string;
  cost: number;
  lossReduction: number;
  riskDropPercent: number;
  rosiPercent: number;
  rationale: string;
  timeline: string;
  suggestedAction: string;
}

export const AiDecisionCenterModule: React.FC = () => {
  const { assets, vulnerabilities, controls, incidents, financialProfile } = useData();

  // Preset executive queries
  const presetQueries = [
    'What is the highest financial cyber risk right now?',
    'Which vulnerabilities contribute most to potential loss?',
    'What security control would reduce the most risk?',
    'Which assets require immediate board-level attention?',
  ];

  const [activeQuery, setActiveQuery] = useState<string>(presetQueries[0]);
  const [customQueryInput, setCustomQueryInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<AiDecisionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Curated Action Proposals
  const actionProposals: ActionProposal[] = [
    {
      id: 'REC-01',
      title: 'Deploy Hotfix & Micro-Segment Payment Gateway',
      category: 'Vulnerability & Network Defense',
      priority: 'Critical',
      affectedAsset: 'Payment Gateway Server Cluster (AST-101)',
      cost: 450000,
      lossReduction: 2200000,
      riskDropPercent: 28,
      rosiPercent: 388,
      rationale: 'Active CISA KEV exploitation against external perimeter interface combined with critical transaction volume.',
      timeline: '48-72 Hours',
      suggestedAction: 'Apply vendor firmware patch, disable external management plane, and enforce East-West Kubernetes network policies.'
    },
    {
      id: 'REC-02',
      title: 'Mandate FIDO2 Hardware MFA for Database Bastions',
      category: 'Identity & Access Control',
      priority: 'High',
      affectedAsset: 'Customer Core Database (AST-102)',
      cost: 350000,
      lossReduction: 1650000,
      riskDropPercent: 22,
      rosiPercent: 371,
      rationale: 'Credential stuffing syndicate campaigns actively targeting Indian banking credentials; current SMS OTP has proven susceptible to SIM swap.',
      timeline: '1-2 Weeks',
      suggestedAction: 'Issue WebAuthn hardware keys to all 45 privileged database and system administrators.'
    },
    {
      id: 'REC-03',
      title: 'Upgrade EDR to Automated Host-Isolation on Cloud Workloads',
      category: 'Endpoint & Workload Protection',
      priority: 'High',
      affectedAsset: 'Retail Banking Web Application (AST-103)',
      cost: 650000,
      lossReduction: 1950000,
      riskDropPercent: 19,
      rosiPercent: 200,
      rationale: 'Mean Time to Respond (MTTR) is currently 3.5 hours; automated behavioral host isolation stops ransomware within 90 seconds.',
      timeline: '2-3 Weeks',
      suggestedAction: 'Enable kernel-level real-time kill switch policies on all container nodes hosting retail banking microservices.'
    },
    {
      id: 'REC-04',
      title: 'Implement Immutable Air-Gapped Database Snapshots',
      category: 'Resilience & Recovery',
      priority: 'Medium',
      affectedAsset: 'Treasury & Liquidity Settlement System (AST-105)',
      cost: 900000,
      lossReduction: 2800000,
      riskDropPercent: 16,
      rosiPercent: 211,
      rationale: 'Ransomware syndicates frequently target live backups to force ransom compliance; air-gapped immutable storage guarantees recovery within 4 hours.',
      timeline: '1 Month',
      suggestedAction: 'Deploy object-lock S3 compatible offline backup repository with write-once-read-many (WORM) storage retention.'
    }
  ];

  const [selectedProposal, setSelectedProposal] = useState<ActionProposal>(actionProposals[0]);

  // Execute AI query
  const runAiQuery = async (queryText: string) => {
    setIsLoading(true);
    setActiveQuery(queryText);
    try {
      const resp = await AiDecisionEngine.answerQuery(queryText, {
        assets,
        vulnerabilities,
        controls,
        incidents,
      });
      setAiResponse(resp);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAiQuery(presetQueries[0]);
  }, [assets, vulnerabilities, controls, incidents]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQueryInput.trim()) return;
    runAiQuery(customQueryInput);
    setCustomQueryInput('');
  };

  return (
    <div id="ai-decision-module-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              AI Decision Support & Actuarial Risk Advisor
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
              GROUNDED DECISION ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deterministic and grounded AI risk advisory synthesizing asset telemetry, live CVE exploitability, control coverage, and financial loss exposure.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="p-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-300 flex items-center gap-2 font-medium">
            <BrainCircuit className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Telemetry: {assets.length} Assets • {vulnerabilities.length} Vulns Evaluated</span>
          </div>
        </div>
      </div>

      {/* Interactive AI Query Console */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Executive Natural Language Query Interface
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Model: Grounded Actuarial Engine v1.0
          </span>
        </div>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((query) => (
            <button
              key={query}
              onClick={() => runAiQuery(query)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left ${
                activeQuery === query
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              {query}
            </button>
          ))}
        </div>

        {/* Custom Query Input */}
        <form onSubmit={handleCustomSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customQueryInput}
            onChange={(e) => setCustomQueryInput(e.target.value)}
            placeholder="Ask a custom question (e.g. 'What is the risk impact of our unpatched payment gateways?')..."
            className="w-full pl-9 pr-24 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3 h-3" />
            <span>Analyze</span>
          </button>
        </form>

        {/* AI Answer Card */}
        {isLoading ? (
          <div className="p-8 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Querying live telemetry and calculating financial exposure projections...
            </span>
          </div>
        ) : aiResponse ? (
          <div className="p-5 rounded-xl bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-600 text-white">
                  Executive Briefing
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Query: <em>"{aiResponse.query}"</em>
                </span>
              </div>
              <p className="text-sm text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                {aiResponse.summary}
              </p>
            </div>

            {/* Key Findings */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">
                Evidence & Grounded Findings:
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-400 list-disc list-inside">
                {aiResponse.keyFindings.map((finding, idx) => (
                  <li key={idx} className="leading-normal">
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Action & Outcomes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/40 text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950">
                <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">
                  Targeted Security Action:
                </span>
                <p className="text-slate-600 dark:text-slate-400">{aiResponse.recommendedAction}</p>
              </div>

              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                    Expected Financial & Risk Benefit:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400">{aiResponse.estimatedFinancialBenefit}</p>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mt-2 block">
                  {aiResponse.expectedRiskReduction}
                </span>
              </div>
            </div>

            {/* Supporting Data Metric Chips */}
            <div className="flex flex-wrap gap-3 pt-2">
              {aiResponse.supportingData.map((d, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950 text-xs"
                >
                  <span className="text-[10px] text-slate-400 block">{d.label}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{d.value}</span>
                  {d.sublabel && (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                      {d.sublabel}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Prioritized Action Proposals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Prioritized Action Proposals ({actionProposals.length})
            </h3>
            <span className="text-xs text-slate-400">Ranked by ROSI & Risk Drop</span>
          </div>

          <div className="space-y-3">
            {actionProposals.map((proposal) => {
              const isSelected = selectedProposal.id === proposal.id;
              return (
                <div
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                      {proposal.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        proposal.priority === 'Critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                      }`}
                    >
                      {proposal.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {proposal.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Target: {proposal.affectedAsset}
                  </span>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatINR(proposal.cost)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Loss Avoidance</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatINR(proposal.lossReduction)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Risk Drop</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        -{proposal.riskDropPercent}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">ROSI</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {proposal.rosiPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Inspector (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs sticky top-20 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono text-slate-400 font-bold">{selectedProposal.id}</span>
                <span className="text-slate-500 dark:text-slate-400">Timeline: {selectedProposal.timeline}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {selectedProposal.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {selectedProposal.affectedAsset}
              </p>
            </div>

            {/* Financial Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Capex / Implementation:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatINR(selectedProposal.cost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Direct Loss Avoidance:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(selectedProposal.lossReduction)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Net Financial Gain:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(selectedProposal.lossReduction - selectedProposal.cost)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-slate-700 dark:text-slate-300">ROSI Multiple:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {selectedProposal.rosiPercent}%
                </span>
              </div>
            </div>

            {/* Actuarial Rationale */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                Actuarial Risk Rationale
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedProposal.rationale}
              </p>
            </div>

            {/* Recommended Technical Action */}
            <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
              <span className="font-bold block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Prescribed Implementation Action
              </span>
              <p className="leading-relaxed">{selectedProposal.suggestedAction}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
