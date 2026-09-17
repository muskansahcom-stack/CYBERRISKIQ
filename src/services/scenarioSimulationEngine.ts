/**
 * Engine 5: Scenario Simulation Engine
 * Simulates "what-if" cybersecurity interventions against the enterprise risk posture.
 * Computes projected risk scores, financial exposure reductions, and Return on Security Investment (ROSI).
 */

import { SimulationAction, SimulationResult, Asset } from '../types/cyberrisk';
import { RiskQuantificationEngine } from './riskQuantificationEngine';

export class ScenarioSimulationEngine {
  /**
   * Run simulation against active actions and budget constraints
   */
  public static runSimulation(
    assets: Asset[],
    actions: SimulationAction[],
    availableBudget: number
  ): SimulationResult {
    const currentRiskScore = RiskQuantificationEngine.calculateEnterpriseRiskScore(assets);
    const currentExposure = RiskQuantificationEngine.calculateTotalFinancialExposure(assets);
    const currentEal = RiskQuantificationEngine.calculateTotalExpectedAnnualLoss(assets);

    const activeActions = actions.filter(a => a.enabled);
    const totalInvestmentCost = activeActions.reduce((sum, a) => sum + a.cost, 0);

    // Diminishing returns formula for compound risk reduction
    // R_net = 1 - product(1 - r_i)
    let compoundReductionMultiplier = 1.0;
    activeActions.forEach(action => {
      compoundReductionMultiplier *= (1 - (action.riskReductionPercent / 100));
    });

    const netReductionRate = 1.0 - compoundReductionMultiplier; // e.g., 0.38 (38% risk reduction)
    const estimatedRiskReductionPercent = Math.round(netReductionRate * 100);

    // Projected risk score
    const projectedRiskScore = Math.max(22, Math.round(currentRiskScore * (1 - (netReductionRate * 0.75))));

    // Projected financial loss and exposure
    const projectedEal = Math.max(1200000, Math.round(currentEal * (1 - netReductionRate)));
    const projectedExposure = Math.max(9000000, Math.round(currentExposure * (1 - (netReductionRate * 0.70))));

    const netFinancialSavings = currentEal - projectedEal;

    // ROSI = ((Financial Loss Reduction - Investment Cost) / Investment Cost) * 100
    let rosiPercent = 0;
    if (totalInvestmentCost > 0) {
      // Annualized 3-year horizon benefit: 3 * netFinancialSavings
      const totalBenefitOverHorizon = netFinancialSavings * 2.5;
      rosiPercent = Math.round(((totalBenefitOverHorizon - totalInvestmentCost) / totalInvestmentCost) * 100);
    }

    return {
      currentRiskScore,
      projectedRiskScore,
      currentExposure,
      projectedExposure,
      currentEal,
      projectedEal,
      totalInvestmentCost,
      netFinancialSavings,
      estimatedRiskReductionPercent,
      rosiPercent
    };
  }
}
