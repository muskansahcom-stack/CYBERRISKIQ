/**
 * Engine 2: Risk Quantification Engine
 * Translates qualitative vulnerabilities, threats, asset criticality, and control coverage
 * into mathematically transparent, explainable scores (0-100) and Expected Annual Loss (EAL).
 */

import { Asset, Vulnerability, SecurityControl, SecurityIncident, RiskFactorBreakdown } from '../types/cyberrisk';

export class RiskQuantificationEngine {
  /**
   * Calculates explainable risk factors for a specific asset
   */
  public static calculateAssetRiskFactors(
    asset: Asset,
    vulnerabilities: Vulnerability[],
    controls: SecurityControl[],
    incidents: SecurityIncident[]
  ): RiskFactorBreakdown {
    // 1. Filter associated entities
    const assetVulns = vulnerabilities.filter(v => v.affectedAssetId === asset.id);
    const criticalVulns = assetVulns.filter(v => v.severity === 'Critical' && v.remediationStatus !== 'Mitigated');
    const assetIncidents = incidents.filter(i => i.affectedAssetId === asset.id);
    const associatedControls = controls.filter(c => c.affectedAssetIds.includes(asset.id));

    // 2. Exploitability & Threat Likelihood derivation
    let maxCvss = 5.0;
    let hasActiveExploit = false;
    let vulnRiskContributionSum = 0;

    assetVulns.forEach(v => {
      if (v.cvssScore > maxCvss) maxCvss = v.cvssScore;
      if (v.exploitability === 'Active Exploit in Wild') hasActiveExploit = true;
      if (v.remediationStatus !== 'Mitigated') {
        vulnRiskContributionSum += v.riskContribution;
      }
    });

    // Base threat likelihood (0.05 to 0.60 per year)
    let threatLikelihood = 0.12;
    if (asset.internetExposure) threatLikelihood += 0.14;
    if (hasActiveExploit) threatLikelihood += 0.12;
    if (criticalVulns.length > 0) threatLikelihood += Math.min(0.18, criticalVulns.length * 0.06);
    threatLikelihood = Math.min(0.85, Math.max(0.05, parseFloat(threatLikelihood.toFixed(2))));

    // Exploitability factor (0.0 - 1.0)
    const exploitabilityFactor = parseFloat((maxCvss / 10).toFixed(2));

    // Asset criticality weight
    let assetCriticalityWeight = 1.0;
    switch (asset.criticality) {
      case 'Critical': assetCriticalityWeight = 2.4; break;
      case 'High': assetCriticalityWeight = 1.8; break;
      case 'Medium': assetCriticalityWeight = 1.3; break;
      case 'Low': assetCriticalityWeight = 1.0; break;
    }

    // Exposure multiplier
    const exposureMultiplier = asset.internetExposure ? 1.4 : 1.0;

    // Control effectiveness average (0 - 100)
    let avgControlEffectiveness = 70;
    if (associatedControls.length > 0) {
      const sum = associatedControls.reduce((acc, c) => acc + c.effectivenessPercent, 0);
      avgControlEffectiveness = Math.round(sum / associatedControls.length);
    }
    const controlDeficiencyFactor = parseFloat((1 - (avgControlEffectiveness / 100)).toFixed(2));

    // Incident history multiplier
    const incidentHistoryMultiplier = assetIncidents.length > 0
      ? parseFloat((1.0 + Math.min(0.5, assetIncidents.length * 0.15)).toFixed(2))
      : 1.0;

    // Single Loss Expectancy (Estimated Financial Impact per Event)
    // Modeled as a fraction of business value + sensitivity + recovery overhead
    let impactFraction = 0.10;
    if (asset.criticality === 'Critical') impactFraction = 0.22;
    else if (asset.criticality === 'High') impactFraction = 0.15;
    
    if (asset.dataSensitivity.includes('PII')) impactFraction += 0.05;

    const estimatedFinancialImpact = Math.round(asset.businessValue * impactFraction * exposureMultiplier);

    // Annual Rate of Occurrence (ARO)
    // ARO = Threat Likelihood * Exploitability * Control Deficiency * Incident Factor
    const annualRateOfOccurrence = parseFloat((threatLikelihood * exploitabilityFactor * (0.4 + controlDeficiencyFactor) * incidentHistoryMultiplier).toFixed(3));

    // Expected Annual Loss (EAL = ARO * Single Loss Expectancy)
    const rawEal = Math.round(annualRateOfOccurrence * estimatedFinancialImpact);
    // Align with recorded or calculated expected loss
    const expectedAnnualLoss = asset.expectedAnnualLoss || rawEal;

    // Measurable Cyber Risk Score (0 - 100)
    // Combines likelihood, control gaps, vulnerability contributions, and normalized loss
    const rawScore = (
      (threatLikelihood * 35) +
      (exploitabilityFactor * 25) +
      (controlDeficiencyFactor * 25) +
      (criticalVulns.length * 5) +
      (asset.internetExposure ? 8 : 0)
    );
    const riskScore = Math.min(99, Math.max(15, Math.round(rawScore)));

    const formulaText = `Expected Annual Loss (EAL) = Annual Likelihood (${(annualRateOfOccurrence * 100).toFixed(1)}%) × Single Loss Impact (₹${(estimatedFinancialImpact / 100000).toFixed(1)} Lakh)`;

    return {
      assetId: asset.id,
      assetName: asset.name,
      vulnerabilityCount: assetVulns.length,
      criticalVulnerabilities: criticalVulns.length,
      threatLikelihood,
      exploitabilityFactor,
      assetCriticalityWeight,
      businessValue: asset.businessValue,
      exposureMultiplier,
      controlDeficiencyFactor,
      incidentHistoryMultiplier,
      estimatedFinancialImpact,
      annualRateOfOccurrence,
      expectedAnnualLoss,
      riskScore: asset.currentRiskScore || riskScore,
      formulaText
    };
  }

  /**
   * Enterprise-wide aggregated risk score calculation
   */
  public static calculateEnterpriseRiskScore(assets: Asset[]): number {
    if (!assets || assets.length === 0) return 0;
    // Weighted by financial exposure
    const totalExposure = assets.reduce((sum, a) => sum + (a.financialExposure || 0), 0);
    if (totalExposure === 0) {
      return Math.round(assets.reduce((sum, a) => sum + a.currentRiskScore, 0) / assets.length);
    }
    const weightedSum = assets.reduce((sum, a) => sum + (a.currentRiskScore * (a.financialExposure || 1)), 0);
    return Math.round(weightedSum / totalExposure);
  }

  /**
   * Enterprise Expected Annual Loss (ALE) sum
   */
  public static calculateTotalExpectedAnnualLoss(assets: Asset[]): number {
    return assets.reduce((sum, a) => sum + (a.expectedAnnualLoss || 0), 0);
  }

  /**
   * Total Financial Exposure sum
   */
  public static calculateTotalFinancialExposure(assets: Asset[]): number {
    return assets.reduce((sum, a) => sum + (a.financialExposure || 0), 0);
  }
}
