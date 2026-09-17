/**
 * CYBERRISKIQ - Core Domain Types
 * Financial Cyber Risk Quantification & Investment Optimization
 */

export type CriticalityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type RemediationStatus = 'Open' | 'In Progress' | 'Mitigated' | 'Risk Accepted';
export type ExploitabilityLevel = 'Active Exploit in Wild' | 'Public PoC Available' | 'Theoretical' | 'Unproven';
export type ControlStatus = 'Active' | 'Partially Implemented' | 'Planned' | 'Degraded';
export type IncidentStatus = 'Resolved' | 'Remediated' | 'Monitoring' | 'Investigating';
export type ComplianceStatus = 'Compliant' | 'Partially Compliant' | 'Non-Compliant';

export interface Asset {
  id: string; // e.g., "AST-101"
  name: string;
  type: 'Server' | 'Database' | 'Cloud Workload' | 'Web Application' | 'API Gateway' | 'Endpoint' | 'Network Infrastructure' | 'SaaS Service';
  businessUnit: string; // e.g., "Retail Banking", "Treasury & Payments"
  owner: string;
  businessValue: number; // in INR (e.g., 50000000 = ₹5 Crore)
  criticality: CriticalityLevel;
  internetExposure: boolean;
  dataSensitivity: 'High (PII & Financial)' | 'High (Financial Only)' | 'Medium (Confidential)' | 'Low (Internal)';
  dependencies: string[];
  currentRiskScore: number; // 0 - 100
  financialExposure: number; // in INR
  expectedAnnualLoss: number; // in INR
  ipOrLocation: string;
  notes?: string;

  // Phase 3 Extensions: Explicit Defensible Attributes
  asset_id?: string;
  organization_id?: string;
  asset_name?: string;
  business_unit?: string;
  asset_type?: string;
  business_criticality?: CriticalityLevel;
  business_value?: number;
  data_sensitivity?: string;
  internet_exposure?: boolean;
  service_dependency?: 'Critical' | 'High' | 'Medium' | 'Low';
  revenue_dependency?: number; // Daily revenue dependency in INR
  regulatory_importance?: 'Mandatory Compliance' | 'High' | 'Standard' | 'Low';
  residualProbability?: number;
  inherentProbability?: number;
  residualRiskScore?: number;
}

export interface Vulnerability {
  id: string;
  cveId: string;
  name: string;
  description: string;
  cvssScore: number; // 0.0 - 10.0
  severity: SeverityLevel;
  exploitability: ExploitabilityLevel;
  affectedAssetId: string;
  affectedAssetName: string;
  exposure: 'External' | 'Internal';
  discoveryDate: string;
  remediationStatus: RemediationStatus;
  remediationCost: number; // in INR
  riskContribution: number; // score impact, e.g. 18.5
  patchAvailable: boolean;
  mitigationSteps?: string;

  // Phase 3 Extensions
  vulnerability_id?: string;
  asset_id?: string;
  cvss_score?: number;
  vulnerability_age?: number; // age in days
  known_exploitation_indicator?: boolean;
  threat_activity?: 'High' | 'Elevated' | 'Guarded' | 'Low';
  remediation_status?: RemediationStatus;
}

export interface SecurityControl {
  id: string;
  name: string;
  category: 'Identity & Access' | 'Endpoint Security' | 'Network Defense' | 'Data Protection' | 'Threat Detection' | 'Resilience';
  status: ControlStatus;
  effectivenessPercent: number; // 0 - 100%
  annualCost: number; // in INR
  affectedAssetIds: string[];
  relatedRisks: string[];
  owner: string;
  coveragePercent: number; // 0 - 100%
  description: string;

  // Phase 3 Extensions
  control_id?: string;
  asset_id?: string;
  control_scope?: string;
  control_type?: 'Preventative' | 'Detective' | 'Corrective' | 'Deterrent';
  implementation_status?: ControlStatus;
  effectiveness_percentage?: number;
  coverage_percentage?: number;
  last_tested?: string;
  evidence_reference?: string;
}

export interface ThreatIntelligence {
  id: string;
  name: string;
  category: 'Ransomware Syndicate' | 'Nation-State APT' | 'Financial Cybercrime' | 'DDoS Extortion' | 'Supply Chain Hijack' | 'Insider Threat';
  likelihood: 'Very High' | 'High' | 'Medium' | 'Low';
  severity: SeverityLevel;
  targetAssets: string[];
  source: string; // e.g. "CERT-In Advisory / Sectoral ISAC"
  firstObserved: string;
  lastObserved: string;
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  tactics: string[];
  mitigationAdvice: string;
}

export interface SecurityIncident {
  id: string; // e.g. "INC-2024-089"
  title: string;
  incidentType: 'Ransomware Attack' | 'DDoS Interruption' | 'Credential Stuffing' | 'Unauthorized API Access' | 'Data Leakage' | 'Phishing Breach';
  affectedAssetId: string;
  affectedAssetName: string;
  date: string;
  severity: SeverityLevel;
  downtimeHours: number;
  dataAffected: string;
  recoveryCost: number; // in INR
  businessLoss: number; // in INR
  regulatoryCost: number; // in INR
  totalFinancialImpact: number; // in INR (sum of recovery + business + regulatory)
  status: IncidentStatus;
  rootCause: string;
}

export interface RiskFactorBreakdown {
  assetId: string;
  assetName: string;
  vulnerabilityCount: number;
  criticalVulnerabilities: number;
  threatLikelihood: number; // 0.0 - 1.0
  exploitabilityFactor: number; // 0.0 - 1.0
  assetCriticalityWeight: number; // 1.0 - 2.5
  businessValue: number;
  exposureMultiplier: number; // 1.0 - 1.5
  controlDeficiencyFactor: number; // (1 - effectiveness)
  incidentHistoryMultiplier: number;
  estimatedFinancialImpact: number; // Single Loss Expectancy (SLE)
  annualRateOfOccurrence: number; // ARO
  expectedAnnualLoss: number; // EAL = ARO * SLE
  riskScore: number; // 0 - 100
  formulaText: string;
}

export interface FinancialExposureProfile {
  potentialIncidentLoss: number;
  downtimeCost: number;
  dataBreachCost: number;
  recoveryCost: number;
  regulatoryPenaltyRisk: number;
  reputationalLoss: number;
  totalEstimatedImpact: number;
  expectedAnnualLoss: number;
  assumptions: {
    hourlyDowntimeRate: number; // in INR
    costPerBreachedRecord: number; // in INR
    regulatoryCapPercent: number;
    businessDisruptionMultiplier: number;
  };
  // Phase 3 Extended Assumptions & Metrics
  defensibleAssumptions?: DefensibleFinancialAssumptions;
  impactDecomposition?: FinancialImpactDecomposition;
  uncertaintyRanges?: {
    impact: UncertaintyRange;
    eal: UncertaintyRange;
  };
  varMetrics?: {
    var90: number;
    var95: number;
    var99: number;
  };
  provenance?: {
    modelVersion: string;
    assumptionVersion: string;
    calculatedAt: string;
    label: string;
  };
}

export interface DefensibleFinancialAssumptions {
  downtime_cost_per_hour: number;
  estimated_downtime_hours: number;
  data_breach_cost: number;
  data_breach_cost_per_record: number;
  recovery_cost: number;
  incident_response_cost: number;
  legal_cost: number;
  regulatory_cost: number;
  customer_impact_cost: number;
  reputation_impact_cost: number;
  business_interruption_cost: number;
  version: string;
  lastUpdated: string;
  sourceType: 'Calibrated Enterprise Actuarial' | 'Industry Benchmark' | 'User Scenario Override';
  simulationLabel: string;
}

export interface FinancialImpactDecomposition {
  directBusinessLoss: number;
  businessInterruption: number;
  incidentResponse: number;
  recovery: number;
  dataImpact: number;
  legalRegulatory: number;
  customerReputation: number;
  totalEstimatedImpact: number;
  notes: {
    directBusinessLoss?: string;
    businessInterruption?: string;
    incidentResponse?: string;
    recovery?: string;
    dataImpact?: string;
    legalRegulatory?: string;
    customerReputation?: string;
  };
}

export interface UncertaintyRange {
  low: number;
  mostLikely: number;
  high: number;
  confidenceInterval: string; // e.g. "80% CI [P10 - P90]"
}

export interface MonteCarloSimulationResult {
  iterations: number;
  meanLoss: number;
  medianLoss: number;
  p90Loss: number; // VaR 90
  p95Loss: number; // VaR 95
  p99Loss: number; // VaR 99
  minLoss: number;
  maxLoss: number;
  distributionType: string;
  lossDistributionBins: { binLabel: string; count: number; lossAmount: number }[];
  timestamp: string;
  modelVersion: string;
}

export interface DefensibleEalCalculation {
  assetId: string;
  assetName: string;
  businessUnit: string;
  inherentProbability: number;
  controlReductionPercent: number;
  annualIncidentProbability: number; // Residual probability e.g. 0.184 (18.4%)
  expectedFinancialImpact: number; // SLE (Single Loss Expectancy)
  impactDecomposition: FinancialImpactDecomposition;
  uncertaintyRangeImpact: UncertaintyRange;
  expectedAnnualLoss: number; // EAL = Probability × Impact
  uncertaintyRangeEal: UncertaintyRange;
  var90: number;
  var95: number;
  var99: number;
  timestamp: string;
  modelVersion: string;
  assumptionVersion: string;
  provenance: string;
}

export interface RiskDriverItem {
  type: 'driver' | 'mitigator'; // driver (+) increases risk, mitigator (-) reduces risk
  label: string;
  category: string;
  impactDescription: string;
  scoreDelta: number; // e.g. +18 or -24
}

export interface CalculationTraceStep {
  stepNumber: number;
  title: string;
  formula: string;
  inputs: { name: string; value: string | number; source: string }[];
  result: string | number;
  explanation: string;
}

export interface RiskAttributionItem {
  assetId: string;
  assetName: string;
  businessUnit: string;
  expectedAnnualLoss: number;
  contributionPercent: number;
  riskScore: number;
  primaryDriver: string;
}

export interface BusinessUnitAggregation {
  businessUnit: string;
  assetCount: number;
  totalValue: number;
  expectedAnnualLoss: number;
  contributionPercent: number;
  averageRiskScore: number;
  var95: number;
}

export interface HistoricalRiskSnapshot {
  date: string;
  timestamp: number;
  enterpriseRiskScore: number;
  expectedAnnualLoss: number;
  totalExposure: number;
  var95: number;
  activeIncidents: number;
}

export interface SimulationAction {
  id: string;
  name: string;
  category: string;
  cost: number; // in INR
  riskReductionPercent: number; // e.g. 15%
  financialLossReduction: number; // in INR
  targetedControlId?: string;
  enabled: boolean;
  description: string;
}

export interface SimulationResult {
  currentRiskScore: number;
  projectedRiskScore: number;
  currentExposure: number;
  projectedExposure: number;
  currentEal: number;
  projectedEal: number;
  totalInvestmentCost: number;
  netFinancialSavings: number;
  estimatedRiskReductionPercent: number;
  rosiPercent: number; // Return on Security Investment %
}

export interface InvestmentCandidate {
  id: string;
  name: string;
  category: string;
  cost: number;
  annualSavings: number;
  riskReductionPercent: number;
  financialBenefit: number;
  rosiPercent: number;
  priority: 'High' | 'Medium' | 'Low';
  recommended: boolean;
}

export interface ComplianceItem {
  id: string;
  framework: 'ISO/IEC 27001' | 'NIST CSF 2.0' | 'CIS Controls v8' | 'RBI Cyber Security Framework' | 'SEBI CSCRF';
  controlId: string;
  controlName: string;
  domain: string;
  status: ComplianceStatus;
  evidence: string;
  gapAnalysis: string;
  remediationPlan: string;
  responsibleTeam: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Chief Information Security Officer (CISO)' | 'Chief Risk Officer (CRO)' | 'Security Architect' | 'Cyber Risk Analyst';
  organization: string;
  avatarUrl?: string;
}

// ==========================================
// PHASE 4: EXPLAINABLE AI RISK INTELLIGENCE
// ==========================================

export interface AiRiskSummary {
  enterpriseModelledEal: number;
  topContributingAssets: {
    assetId: string;
    assetName: string;
    eal: number;
    riskScore: number;
    primaryDrivers: string[];
  }[];
  topContributingBusinessUnits: {
    businessUnit: string;
    eal: number;
    sharePercent: number;
  }[];
  primaryDrivers: string[];
  summaryText: string;
  executiveSummary: string;
  technicalSummary: string;
  provenance: string;
  calculatedAt: string;
  evidenceStrength: 'High' | 'Moderate' | 'Limited';
  evidenceReasons: string[];
}

export interface RiskChangeFactor {
  factor: string;
  category: string;
  impact: string;
  affectedAssetId?: string;
  affectedAssetName?: string;
  previousValue?: string | number;
  currentValue?: string | number;
}

export interface RiskChangeExplanation {
  previousEal: number;
  currentEal: number;
  differenceEal: number;
  percentageChange: number;
  direction: 'INCREASED' | 'DECREASED' | 'STABLE';
  driversOfChange: RiskChangeFactor[];
  aiExplanation: string;
  timeframe: string;
  previousDate: string;
  currentDate: string;
}

export interface AiTopRiskDriver {
  id: string;
  driver: string;
  category: string;
  affectedAssets: {
    id: string;
    name: string;
    criticality: string;
    eal: number;
  }[];
  financialContribution: number; // in INR
  riskContributionPercent: number;
  supportingEvidence: {
    metric: string;
    value: string;
    source: string;
  }[];
  evidenceStrength: 'High' | 'Moderate' | 'Limited';
  candidateMitigation: string;
  scenarioActionId?: string;
}

export interface AssetRiskExplanation {
  assetId: string;
  assetName: string;
  businessUnit: string;
  criticality: string;
  riskScore: number;
  annualIncidentProbability: number;
  expectedIncidentImpact: number; // Single Loss Expectancy (SLE)
  expectedAnnualLoss: number; // EAL
  aiExplanation: string;
  evidence: {
    cvssMax: number;
    criticalVulnerabilitiesCount: number;
    internetExposed: boolean;
    controlEffectiveness: number;
    businessCriticality: string;
    oldestVulnerabilityDays: number;
    activeThreatsCount: number;
  };
  supportingPoints: string[];
}

export interface AiMitigationRecommendation {
  recommendation_id: string;
  organization_id: string;
  timestamp: string;
  recommendation: string;
  reason: string;
  affected_assets: string[];
  risk_driver_addressed: string;
  existing_control_weakness: string;
  supporting_data: {
    label: string;
    value: string;
    source: string;
  }[];
  proposed_mitigation: string;
  targetControlCategory: string;
  scenarioActionId?: string;
  baselineEal: number;
  simulatedEal?: number;
  simulatedDifference?: number;
  simulatedReductionPercent?: number;
  simulationExplanation?: string;
  assumptions: string[];
  limitations: string[];
  confidence: 'High' | 'Moderate' | 'Limited';
  confidenceExplanation: string;
  status: 'New' | 'Reviewed' | 'Simulated' | 'Accepted' | 'Rejected' | 'Implemented';
  user_action?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface AiTraceabilityEvidence {
  recommendationId?: string;
  insightId?: string;
  dataPointsUsed: { key: string; value: string; description: string }[];
  riskEngineOutputs: { metric: string; calculatedValue: string; formula: string }[];
  relevantAssets: { id: string; name: string; criticality: string; eal: number; exposure: number }[];
  relevantVulnerabilities: { cveId: string; name: string; cvss: number; exploitability: string; asset: string }[];
  relevantControls: { id: string; name: string; effectiveness: number; coverage: number }[];
  relevantAssumptions: { name: string; value: string; source: string }[];
  calculationTimestamp: string;
  modelVersion: string;
}

export interface AiStructuredQueryResponse {
  query: string;
  keyFinding: string;
  supportingData: { metric: string; value: string; source: string }[];
  mainDrivers: string[];
  calculationSource: string;
  assumptions: string[];
  recommendedNextAction: string;
  rawAnswerMarkdown: string;
  evidenceStrength: 'High' | 'Moderate' | 'Limited';
  mode: 'executive' | 'technical';
  insufficientDataWarning?: string;
  traceEvidence?: AiTraceabilityEvidence;
}

