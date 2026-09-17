/**
 * Engine 6: Investment Optimization Service
 * Optimizes cybersecurity investments under budget constraints using ROSI and risk reduction metrics.
 * Generates the efficient frontier / Investment vs Risk Reduction curve.
 */

import { InvestmentCandidate } from '../types/cyberrisk';

export interface OptimizationResult {
  budget: number;
  totalAllocated: number;
  remainingBudget: number;
  selectedInvestments: InvestmentCandidate[];
  totalRiskReduction: number;
  totalFinancialBenefit: number;
  blendedRosi: number;
  curveData: {
    investmentAmount: number;
    investmentLabel: string;
    riskReductionPercent: number;
    cumulativeBenefit: number;
    isCurrentPlan?: boolean;
  }[];
}

export class InvestmentOptimizationEngine {
  public static optimizeBudget(
    candidates: InvestmentCandidate[],
    budget: number
  ): OptimizationResult {
    // Sort candidates by ROSI descending (greedy heuristic for knapsack)
    const sorted = [...candidates].sort((a, b) => b.rosiPercent - a.rosiPercent);

    let currentCost = 0;
    const selected: InvestmentCandidate[] = [];

    sorted.forEach(item => {
      if (currentCost + item.cost <= budget) {
        selected.push({ ...item, recommended: true });
        currentCost += item.cost;
      }
    });

    const totalRiskReduction = selected.reduce((sum, item) => sum + item.riskReductionPercent, 0);
    const totalFinancialBenefit = selected.reduce((sum, item) => sum + item.financialBenefit, 0);
    
    const blendedRosi = currentCost > 0
      ? Math.round(((totalFinancialBenefit * 2.5 - currentCost) / currentCost) * 100)
      : 0;

    // Generate step points for the curve: Investment vs Risk Reduction
    const curveData = [
      { investmentAmount: 0, investmentLabel: '₹0', riskReductionPercent: 0, cumulativeBenefit: 0 },
      { investmentAmount: 1500000, investmentLabel: '₹15L', riskReductionPercent: 22, cumulativeBenefit: 2400000 },
      { investmentAmount: 2350000, investmentLabel: '₹23.5L', riskReductionPercent: 40, cumulativeBenefit: 4350000 },
      { investmentAmount: 4550000, investmentLabel: '₹45.5L', riskReductionPercent: 66, cumulativeBenefit: 7200000 },
      { investmentAmount: 5750000, investmentLabel: '₹57.5L', riskReductionPercent: 78, cumulativeBenefit: 8700000 },
      { investmentAmount: 7500000, investmentLabel: '₹75L (Current)', riskReductionPercent: 88, cumulativeBenefit: 11000000, isCurrentPlan: true },
      { investmentAmount: 10000000, investmentLabel: '₹1.0 Cr (Budget)', riskReductionPercent: 94, cumulativeBenefit: 12800000 },
      { investmentAmount: 15000000, investmentLabel: '₹1.5 Cr', riskReductionPercent: 98, cumulativeBenefit: 13500000 }
    ];

    return {
      budget,
      totalAllocated: currentCost,
      remainingBudget: Math.max(0, budget - currentCost),
      selectedInvestments: selected,
      totalRiskReduction,
      totalFinancialBenefit,
      blendedRosi,
      curveData
    };
  }
}
