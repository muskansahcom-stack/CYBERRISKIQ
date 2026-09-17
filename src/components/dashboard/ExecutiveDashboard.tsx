import React, { useState } from 'react';
import {
  ShieldAlert,
  Coins,
  TrendingDown,
  Wallet,
  ShieldCheck,
  Percent,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Layers,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { KpiCard } from './KpiCard';
import { useData } from '../../context/DataContext';
import { formatINR, getRiskColorClass } from '../../utils/formatters';
import { NavigationTab } from '../layout/Sidebar';

interface ExecutiveDashboardProps {
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectAsset?: (assetId: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  onNavigateTab,
  onSelectAsset,
}) => {
  const { assets, enterpriseRiskScore, totalFinancialExposure, totalExpectedAnnualLoss, varMetrics } = useData();
  const [activeTimeframe, setActiveTimeframe] = useState<'1Y' | '6M' | '3M'>('1Y');

  // Top Financial Risks
  const topRisks = [
    {
      id: 'AST-101',
      name: 'Payment Gateway Server Cluster',
      type: 'Server / Core Switch',
      businessUnit: 'Payments & Settlement',
      eal: 3200000,
      exposure: 11000000,
      riskScore: 89,
      primaryThreat: 'PAN-OS Zero-Day Command Injection & Extortion',
    },
    {
      id: 'AST-102',
      name: 'Customer Core Database (PostgreSQL Cluster)',
      type: 'Database Cluster',
      businessUnit: 'Digital Banking',
      eal: 1800000,
      exposure: 8500000,
      riskScore: 81,
      primaryThreat: 'Unsegmented Ingress & 4.8M PII Record Exposure',
    },
    {
      id: 'AST-108',
      name: 'Customer Mobile Banking Backend (Microservices)',
      type: 'Cloud Workload',
      businessUnit: 'Digital Banking',
      eal: 1600000,
      exposure: 6200000,
      riskScore: 78,
      primaryThreat: 'HTTP/2 Rapid Reset & Credential Stuffing Bots',
    },
    {
      id: 'AST-104',
      name: 'API Banking Switch (Open Banking Engine)',
      type: 'API Gateway',
      businessUnit: 'Payments & Settlement',
      eal: 1400000,
      exposure: 5500000,
      riskScore: 76,
      primaryThreat: 'Log4Shell Dependency & Parameter Tampering',
    },
    {
      id: 'AST-103',
      name: 'HR & Payroll Enterprise Portal',
      type: 'Web Application',
      businessUnit: 'Corporate HR & Operations',
      eal: 600000,
      exposure: 2400000,
      riskScore: 64,
      primaryThreat: 'Confluence Broken Access & Employee PII Leakage',
    },
  ];

  // Chart 1: Cyber Risk Score Trend (Monthly)
  const riskTrendData = [
    { month: 'May 23', score: 79, benchmark: 65 },
    { month: 'Jul 23', score: 76, benchmark: 64 },
    { month: 'Sep 23', score: 74, benchmark: 62 },
    { month: 'Nov 23', score: 75, benchmark: 60 },
    { month: 'Jan 24', score: 71, benchmark: 58 },
    { month: 'Mar 24', score: 70, benchmark: 55 },
    { month: 'Apr 24', score: 68, benchmark: 55 },
  ];

  // Chart 2: Financial Exposure Trend (in ₹ Crores)
  const exposureTrendData = [
    { period: 'Q2 2023', exposure: 3.6, eal: 0.72 },
    { period: 'Q3 2023', exposure: 3.4, eal: 0.68 },
    { period: 'Q4 2023', exposure: 3.1, eal: 0.61 },
    { period: 'Q1 2024', exposure: 2.9, eal: 0.55 },
    { period: 'Q2 2024 (Current)', exposure: 2.8, eal: 0.52 },
  ];

  // Chart 3: Risk by Business Unit
  const businessUnitData = [
    { name: 'Payments & Settlement', exposure: 1.65, color: '#f43f5e' },
    { name: 'Digital Banking', exposure: 1.76, color: '#f59e0b' },
    { name: 'Treasury & International', exposure: 0.67, color: '#3b82f6' },
    { name: 'Wealth Management', exposure: 0.39, color: '#10b981' },
    { name: 'Corporate Operations', exposure: 0.31, color: '#8b5cf6' },
    { name: 'HR & Finance', exposure: 0.45, color: '#06b6d4' },
  ];

  // Chart 4: Top Risk Contributors
  const riskContributorsData = [
    { category: 'Unpatched Zero-Days (CVE)', value: 34 },
    { category: 'Credential / Identity Hijack', value: 28 },
    { category: 'Network Microsegmentation Gap', value: 18 },
    { category: 'Third-Party / Open Banking API', value: 12 },
    { category: 'Public Cloud Configuration', value: 8 },
  ];

  // Chart 5: Risk Reduction Opportunities (Loss Reduction in ₹ Lakhs)
  const reductionOpportunitiesData = [
    { initiative: 'Zero-Trust Segmentation', savingsLakhs: 28.5, costLakhs: 22 },
    { initiative: 'FIDO2 Hardware MFA', savingsLakhs: 24.0, costLakhs: 15 },
    { initiative: 'Emergency CVE Patching', savingsLakhs: 19.5, costLakhs: 8.5 },
    { initiative: 'Fleet EDR Expansion', savingsLakhs: 15.0, costLakhs: 12 },
    { initiative: 'Immutable Backup DR', savingsLakhs: 13.0, costLakhs: 9.5 },
  ];

  const PIE_COLORS = ['#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4'];

  return (
    <div id="executive-dashboard-view" className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Executive Cyber Risk Dashboard
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              QUANTIFIED VaR
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Continuous financial cyber risk quantification and capital allocation intelligence for Acme Financial Services.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-800/60 text-xs">
            {(['3M', '6M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  activeTimeframe === tf
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('scenario-simulator')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate What-If</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Enterprise Cyber Risk Score */}
        <KpiCard
          id="kpi-risk-score"
          title="Cyber Risk Score"
          value={`${enterpriseRiskScore || 68}/100`}
          subValue="FAIR-aligned probability score"
          badgeText="High"
          highlightColor="rose"
          icon={ShieldAlert}
          trend={{ value: '-2.8%', isPositive: true, label: 'improving QoQ' }}
        />

        {/* Card 2: Financial Exposure */}
        <KpiCard
          id="kpi-financial-exposure"
          title="Financial Exposure"
          value={formatINR(totalFinancialExposure)}
          subValue="Single event max exposure"
          badgeText="Modeled"
          highlightColor="amber"
          icon={Coins}
          trend={{ value: '-₹30 Lakh', isPositive: true, label: 'vs Q3' }}
        />

        {/* Card 3: Expected Annual Loss */}
        <KpiCard
          id="kpi-eal"
          title="Expected Annual Loss"
          value={formatINR(totalExpectedAnnualLoss)}
          subValue="Annualized Loss Expectancy"
          badgeText="EAL"
          highlightColor="rose"
          icon={TrendingDown}
          trend={{ value: '-₹6 Lakh', isPositive: true, label: 'post WAF rollout' }}
        />

        {/* Card 4: Security Investment */}
        <KpiCard
          id="kpi-security-investment"
          title="Security Investment"
          value="₹75 Lakh"
          subValue="Annual operating & tool budget"
          badgeText="FY24-25"
          highlightColor="blue"
          icon={Wallet}
        />

        {/* Card 5: Estimated Risk Reduction */}
        <KpiCard
          id="kpi-risk-reduction"
          title="Risk Reduction"
          value="₹1.1 Crore"
          subValue="Prevented financial loss"
          badgeText="Modeled"
          highlightColor="emerald"
          icon={ShieldCheck}
          trend={{ value: '+22%', isPositive: true, label: 'loss avoidance' }}
        />

        {/* Card 6: ROSI */}
        <KpiCard
          id="kpi-rosi"
          title="ROSI (Return on Security)"
          value="47%"
          subValue="Net defense return on budget"
          badgeText="High ROI"
          highlightColor="emerald"
          icon={Percent}
          trend={{ value: '+8%', isPositive: true, label: 'efficiency' }}
        />
      </div>

      {/* Top Financial Risks Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                TOP FINANCIAL RISKS
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                Action Required
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked by Expected Annual Loss (ALE) in Indian Rupees (₹), not merely technical severity.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('quantification')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Risk Quantification Math</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRisks.slice(0, 3).map((item) => {
            const riskColors = getRiskColorClass(item.riskScore);
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (onSelectAsset) onSelectAsset(item.id);
                  onNavigateTab('assets');
                }}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {item.businessUnit}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${riskColors.badge}`}>
                    Score {item.riskScore}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Expected Annual Loss</span>
                    <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                      {formatINR(item.eal)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Max Exposure</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formatINR(item.exposure)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 line-clamp-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                  {item.primaryThreat}
                </p>
              </div>
            );
          })}
        </div>

        {/* Secondary ranked row */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <span>
              #4: <strong>API Banking Switch</strong> — EAL: {formatINR(1400000)} (Risk: 76)
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              #5: <strong>HR & Payroll Portal</strong> — EAL: {formatINR(600000)} (Risk: 64)
            </span>
          </div>

          <button
            onClick={() => onNavigateTab('assets')}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
          >
            Explore all {assets.length} assets <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row of Charts: 1. Cyber Risk Trend & 2. Financial Exposure Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Cyber Risk Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                1. Cyber Risk Score Trend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aggregate enterprise score (0-100) trajectory vs banking peer benchmark
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4" /> 11 pt improvement
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskScoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[40, 90]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`${val} / 100`, 'Score']}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Enterprise Score"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#riskScoreGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  name="Peer Benchmark"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Financial Exposure Trend */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                2. Financial Exposure Trend (₹ Crores)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total max loss potential vs annualized expected loss (ALE)
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              -22% since Q2 '23
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exposureTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`₹${val} Crore`, '']}
                />
                <Bar dataKey="exposure" name="Total Exposure (₹ Cr)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="eal" name="Expected Annual Loss (₹ Cr)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row of Charts: 3. Risk by Business Unit, 4. Top Contributors, 5. Risk Reduction Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 3: Risk by Business Unit */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              3. Risk by Business Unit
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Financial exposure distribution in ₹ Crores
            </p>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={businessUnitData}
                    dataKey="exposure"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {businessUnitData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#f8fafc',
                    }}
                    formatter={(val: any) => [`₹${val} Crore`, 'Exposure']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            {businessUnitData.slice(0, 3).map((bu, i) => (
              <div key={bu.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{bu.name}</span>
                </div>
                <span className="font-semibold text-slate-900 dark:text-slate-100 shrink-0">
                  ₹{bu.exposure} Cr
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Top Risk Contributors */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              4. Top Risk Contributors
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Root causes weighted by loss contribution (%)
            </p>

            <div className="space-y-3">
              {riskContributorsData.map((c) => (
                <div key={c.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 dark:text-slate-300 truncate">{c.category}</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{c.value}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${c.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 mt-4 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>CVEs and identity credential rings account for 62% of total exposure.</span>
          </div>
        </div>

        {/* Chart 5: Risk Reduction Opportunities */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                5. Risk Reduction Opportunities
              </h3>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                High ROSI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Potential annual savings (₹ Lakhs) vs execution cost
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={reductionOpportunitiesData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="initiative"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#f8fafc',
                    }}
                    formatter={(val: any, name: any) => [
                      `₹${val} Lakh`,
                      name === 'savingsLakhs' ? 'Loss Reduction' : 'Investment Cost',
                    ]}
                  />
                  <Bar dataKey="savingsLakhs" name="Savings" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="costLakhs" name="Cost" fill="#64748b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => onNavigateTab('investment-optimization')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Open Investment Optimization Engine <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
