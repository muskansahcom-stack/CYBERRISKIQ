/**
 * Engine 3: Financial Exposure Engine
 * Quantifies financial cyber exposure through configurable actuarial models:
 * Downtime Cost, Data Breach Cost (per PII record), Recovery Cost, Regulatory Penalty Risk, and Reputational Impact.
 */

import { Asset, FinancialExposureProfile } from '../types/cyberrisk';
import { DefensibleFinancialEngine } from './defensibleFinancialEngine';
import { DEFAULT_FINANCIAL_ASSUMPTIONS } from '../data/defensibleAssumptions';

export class FinancialExposureEngine {
  /**
   * Recalculates full enterprise exposure profile given current assets and assumptions
   */
  public static calculateExposureProfile(
    assets: Asset[],
    assumptions: FinancialExposureProfile['assumptions']
  ): FinancialExposureProfile {
    // Calculate aggregate metrics across assets
    let totalBusinessValue = 0;
    let criticalAssetsCount = 0;
    let piiAssetsCount = 0;

    assets.forEach(a => {
      totalBusinessValue += a.businessValue;
      if (a.criticality === 'Critical') criticalAssetsCount++;
      if (a.dataSensitivity.includes('PII')) piiAssetsCount++;
    });

    // 1. Downtime Cost: Estimated based on average 18.5 hours cumulative outage risk per year on critical tiers
    const modeledDowntimeHours = criticalAssetsCount * 2.8;
    const downtimeCost = Math.round(modeledDowntimeHours * assumptions.hourlyDowntimeRate);

    // 2. Data Breach Cost: Modeled on ~5,100 customer records average potential exposure per high-sensitivity node
    const estimatedExposedRecords = piiAssetsCount * 1200;
    const dataBreachCost = Math.round(estimatedExposedRecords * assumptions.costPerBreachedRecord);

    // 3. Technical Recovery Cost: Forensic investigations, incident response retainers, hardware rebuilding
    const recoveryCost = Math.round(totalBusinessValue * 0.012);

    // 4. Regulatory Penalty Risk: Reserve Bank of India (RBI) IT Framework & DPDP Act 2023 statutory penalties
    const regulatoryPenaltyRisk = Math.round((downtimeCost + dataBreachCost) * (assumptions.regulatoryCapPercent / 100) * 3.5);

    // 5. Business & Reputational Churn Loss
    const reputationalLoss = Math.round((downtimeCost * 0.25) * assumptions.businessDisruptionMultiplier);

    const totalEstimatedImpact = downtimeCost + dataBreachCost + recoveryCost + regulatoryPenaltyRisk + reputationalLoss;
    
    // Expected Annual Loss (ALE) derived from asset loss expectations
    const expectedAnnualLoss = assets.reduce((sum, a) => sum + (a.expectedAnnualLoss || 0), 0);

    const defensibleAssumptions = {
      ...DEFAULT_FINANCIAL_ASSUMPTIONS,
      downtime_cost_per_hour: assumptions.hourlyDowntimeRate,
      data_breach_cost_per_record: assumptions.costPerBreachedRecord,
    };

    const varMetrics = DefensibleFinancialEngine.calculateVaR(expectedAnnualLoss, totalEstimatedImpact);

    return {
      potentialIncidentLoss: totalEstimatedImpact,
      downtimeCost,
      dataBreachCost,
      recoveryCost,
      regulatoryPenaltyRisk,
      reputationalLoss,
      totalEstimatedImpact,
      expectedAnnualLoss,
      assumptions,
      defensibleAssumptions,
      impactDecomposition: {
        directBusinessLoss: Math.round(totalBusinessValue * 0.01),
        businessInterruption: downtimeCost,
        incidentResponse: Math.round(recoveryCost * 0.45),
        recovery: recoveryCost,
        dataImpact: dataBreachCost,
        legalRegulatory: regulatoryPenaltyRisk,
        customerReputation: reputationalLoss,
        totalEstimatedImpact,
        notes: {
          businessInterruption: `${modeledDowntimeHours} cumulative outage hours @ ₹${(assumptions.hourlyDowntimeRate / 100000).toFixed(1)}L/hr`,
          dataImpact: `${estimatedExposedRecords} estimated customer records @ ₹${assumptions.costPerBreachedRecord}/record`,
          recovery: `Technical rebuild and forensic certification on ${assets.length} assets`,
          legalRegulatory: `RBI IT framework and DPDP Act statutory fine provisioning`,
        },
      },
      uncertaintyRanges: {
        impact: {
          low: Math.round(totalEstimatedImpact * 0.65),
          mostLikely: totalEstimatedImpact,
          high: Math.round(totalEstimatedImpact * 1.55),
          confidenceInterval: '80% Credible Range [P10 - P90]',
        },
        eal: {
          low: Math.round(expectedAnnualLoss * 0.60),
          mostLikely: expectedAnnualLoss,
          high: Math.round(expectedAnnualLoss * 1.50),
          confidenceInterval: '80% Credible Range [P10 - P90]',
        },
      },
      varMetrics,
      provenance: {
        modelVersion: DefensibleFinancialEngine.MODEL_VERSION,
        assumptionVersion: defensibleAssumptions.version,
        calculatedAt: new Date().toISOString(),
        label: DefensibleFinancialEngine.PROVENANCE_LABEL,
      },
    };
  }
}
