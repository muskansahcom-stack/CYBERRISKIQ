import { DefensibleFinancialAssumptions, HistoricalRiskSnapshot } from '../types/cyberrisk';

/**
 * Standard Actuarial Baseline Financial Assumptions
 * Calibrated against Reserve Bank of India (RBI) Cyber Security Framework,
 * Digital Personal Data Protection (DPDP) Act statutory bounds, and Indian Banking sector loss data.
 * All figures in Indian Rupees (₹).
 */
export const DEFAULT_FINANCIAL_ASSUMPTIONS: DefensibleFinancialAssumptions = {
  downtime_cost_per_hour: 450000, // ₹4,50,000 / hr for Tier-1 Core Banking / UPI services
  estimated_downtime_hours: 18.5, // 18.5 hours cumulative annual outage exposure risk
  data_breach_cost: 9200000, // ₹92,00,000 incident data breach base exposure
  data_breach_cost_per_record: 1800, // ₹1,800 per breached PII / payment credential
  recovery_cost: 4800000, // ₹48,00,000 technical restoration, forensic analysis & rebuilding
  incident_response_cost: 2500000, // ₹25,00,000 Tier-1 external IR retainer & threat triage
  legal_cost: 1800000, // ₹18,00,000 legal counsel, regulatory notifications & liability defense
  regulatory_cost: 3600000, // ₹36,00,000 statutory regulatory penalty reserve under DPDP / RBI
  customer_impact_cost: 1500000, // ₹15,00,000 customer compensation, KYC re-verification
  reputation_impact_cost: 2000000, // ₹20,00,000 merchant churn & institutional brand loss
  business_interruption_cost: 8325000, // ₹83,25,000 (18.5 hrs × ₹4,50,000)
  version: 'CYBERRISKIQ-FAIR-v3.2',
  lastUpdated: '2026-03-15T00:00:00.000Z',
  sourceType: 'Calibrated Enterprise Actuarial',
  simulationLabel: 'SIMULATION / MODELLED ESTIMATE',
};

/**
 * Historical 90-day risk snapshots for tracking risk trend evolution over time
 */
export const INITIAL_HISTORICAL_SNAPSHOTS: HistoricalRiskSnapshot[] = [
  {
    date: '90 Days Ago',
    timestamp: Date.now() - 90 * 86400000,
    enterpriseRiskScore: 88,
    expectedAnnualLoss: 7850000, // ₹78.5 Lakh
    totalExposure: 34500000, // ₹3.45 Crore
    var95: 14200000, // ₹1.42 Crore
    activeIncidents: 4,
  },
  {
    date: '60 Days Ago',
    timestamp: Date.now() - 60 * 86400000,
    enterpriseRiskScore: 84,
    expectedAnnualLoss: 6900000, // ₹69.0 Lakh
    totalExposure: 32000000, // ₹3.20 Crore
    var95: 12800000, // ₹1.28 Crore
    activeIncidents: 3,
  },
  {
    date: '30 Days Ago',
    timestamp: Date.now() - 30 * 86400000,
    enterpriseRiskScore: 79,
    expectedAnnualLoss: 5800000, // ₹58.0 Lakh
    totalExposure: 29500000, // ₹2.95 Crore
    var95: 11200000, // ₹1.12 Crore
    activeIncidents: 2,
  },
  {
    date: '7 Days Ago',
    timestamp: Date.now() - 7 * 86400000,
    enterpriseRiskScore: 76,
    expectedAnnualLoss: 5350000, // ₹53.5 Lakh
    totalExposure: 28400000, // ₹2.84 Crore
    var95: 10500000, // ₹1.05 Crore
    activeIncidents: 1,
  },
  {
    date: 'Current (Live)',
    timestamp: Date.now(),
    enterpriseRiskScore: 74,
    expectedAnnualLoss: 5200000, // ₹52.0 Lakh
    totalExposure: 28000000, // ₹2.80 Crore
    var95: 9800000, // ₹98.0 Lakh
    activeIncidents: 1,
  },
];
