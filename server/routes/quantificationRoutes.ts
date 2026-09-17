import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requirePermission, AuthenticatedRequest } from '../auth';
import { createAuditLog } from '../audit';
import { DefensibleFinancialEngine } from '../../src/services/defensibleFinancialEngine';
import { DEFAULT_FINANCIAL_ASSUMPTIONS, INITIAL_HISTORICAL_SNAPSHOTS } from '../../src/data/defensibleAssumptions';
import { DefensibleFinancialAssumptions } from '../../src/types/cyberrisk';

export const quantificationRouter = Router();

// Enforce authentication on all quantification endpoints
quantificationRouter.use(authenticateToken);

// GET /api/quantification/summary - Enterprise-wide financial quantification
quantificationRouter.get('/summary', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);

  const assumptions: DefensibleFinancialAssumptions =
    (orgData as any).defensibleAssumptions || DEFAULT_FINANCIAL_ASSUMPTIONS;

  const assets = orgData.assets || [];
  const vulns = orgData.vulnerabilities || [];
  const controls = orgData.controls || [];
  const incidents = orgData.incidents || [];

  const { items: topRiskContributors, totalEal, totalExposure } = DefensibleFinancialEngine.calculateRiskAttributions(
    assets,
    vulns,
    controls,
    incidents,
    assumptions
  );

  const varMetrics = DefensibleFinancialEngine.calculateVaR(totalEal, totalExposure);
  const businessUnitAggregations = DefensibleFinancialEngine.calculateBusinessUnitAggregations(
    assets,
    vulns,
    controls,
    incidents,
    assumptions
  );

  // Compute enterprise weighted risk score
  let enterpriseRiskScore = 74;
  if (assets.length > 0) {
    const totalScoreWeight = assets.reduce((sum, a) => sum + (a.currentRiskScore || 50) * (a.businessValue || 1000000), 0);
    const totalValue = assets.reduce((sum, a) => sum + (a.businessValue || 1000000), 0);
    enterpriseRiskScore = Math.round(totalScoreWeight / (totalValue || 1));
  }

  res.json({
    enterpriseRiskScore,
    totalExpectedAnnualLoss: totalEal,
    totalFinancialExposure: totalExposure,
    varMetrics,
    topRiskContributors,
    businessUnitAggregations,
    activeAssumptions: assumptions,
    provenance: {
      modelVersion: DefensibleFinancialEngine.MODEL_VERSION,
      calculatedAt: new Date().toISOString(),
      label: DefensibleFinancialEngine.PROVENANCE_LABEL,
      assumptionVersion: assumptions.version,
    },
  });
});

// GET /api/quantification/asset/:id - Deep defensible EAL derivation for specific asset
quantificationRouter.get('/asset/:id', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const assetId = req.params.id;
  const orgData = db.getOrgData(orgId);

  const asset = (orgData.assets || []).find((a) => a.id === assetId);
  if (!asset) {
    res.status(404).json({ error: 'Asset not found in your organization.' });
    return;
  }

  const assumptions: DefensibleFinancialAssumptions =
    (orgData as any).defensibleAssumptions || DEFAULT_FINANCIAL_ASSUMPTIONS;

  const vulns = orgData.vulnerabilities || [];
  const controls = orgData.controls || [];
  const incidents = orgData.incidents || [];

  const ealCalculation = DefensibleFinancialEngine.calculateDefensibleAssetEAL(
    asset,
    vulns,
    controls,
    incidents,
    assumptions
  );

  const riskDrivers = DefensibleFinancialEngine.generateRiskDrivers(asset, vulns, controls, incidents);

  const totalEnterpriseEal = (orgData.assets || []).reduce((sum, a) => sum + (a.expectedAnnualLoss || 0), 0) || ealCalculation.expectedAnnualLoss;
  const trace = DefensibleFinancialEngine.generateCalculationTrace(
    asset,
    vulns,
    controls,
    incidents,
    totalEnterpriseEal,
    assumptions
  );

  res.json({
    asset,
    calculation: ealCalculation,
    riskDrivers,
    trace,
  });
});

// GET /api/quantification/trace/:id - Step-by-step mathematical calculation trace
quantificationRouter.get('/trace/:id', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const assetId = req.params.id;
  const orgData = db.getOrgData(orgId);

  const asset = (orgData.assets || []).find((a) => a.id === assetId);
  if (!asset) {
    res.status(404).json({ error: 'Asset not found in your organization.' });
    return;
  }

  const assumptions: DefensibleFinancialAssumptions =
    (orgData as any).defensibleAssumptions || DEFAULT_FINANCIAL_ASSUMPTIONS;

  const vulns = orgData.vulnerabilities || [];
  const controls = orgData.controls || [];
  const incidents = orgData.incidents || [];

  const totalEnterpriseEal = (orgData.assets || []).reduce((sum, a) => sum + (a.expectedAnnualLoss || 0), 0) || 5200000;
  const trace = DefensibleFinancialEngine.generateCalculationTrace(
    asset,
    vulns,
    controls,
    incidents,
    totalEnterpriseEal,
    assumptions
  );

  res.json({ assetId, assetName: asset.name, trace });
});

// GET /api/quantification/assumptions - Inspect active assumptions
quantificationRouter.get('/assumptions', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);

  const assumptions: DefensibleFinancialAssumptions =
    (orgData as any).defensibleAssumptions || DEFAULT_FINANCIAL_ASSUMPTIONS;

  res.json({ assumptions });
});

// PUT /api/quantification/assumptions - Calibrate financial assumptions
quantificationRouter.put(
  '/assumptions',
  requirePermission('edit_financial_parameters'),
  (req: AuthenticatedRequest, res: Response): void => {
    const orgId = req.user!.organization_id;
    const orgData = db.getOrgData(orgId);

    const current: DefensibleFinancialAssumptions =
      (orgData as any).defensibleAssumptions || DEFAULT_FINANCIAL_ASSUMPTIONS;

    const updated: DefensibleFinancialAssumptions = {
      ...current,
      ...req.body,
      lastUpdated: new Date().toISOString(),
      sourceType: 'User Scenario Override',
    };

    (orgData as any).defensibleAssumptions = updated;
    db.saveOrgData(orgId, orgData);

    createAuditLog({
      organization_id: orgId,
      actor_user_id: req.user!.user_id,
      actor_email: req.user!.email,
      action: 'DEFENSIBLE_FINANCIAL_ASSUMPTIONS_CALIBRATED',
      resource_type: 'FINANCIAL_MODEL',
      resource_id: orgId,
      metadata: {
        downtime_cost_per_hour: updated.downtime_cost_per_hour,
        estimated_downtime_hours: updated.estimated_downtime_hours,
        version: updated.version,
      },
    });

    res.json({ assumptions: updated });
  }
);

// POST /api/quantification/monte-carlo - Run Monte Carlo simulation
quantificationRouter.post('/monte-carlo', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  const { assetId, iterations = 2000 } = req.body;

  const assumptions: DefensibleFinancialAssumptions =
    (orgData as any).defensibleAssumptions || DEFAULT_FINANCIAL_ASSUMPTIONS;

  const targetAsset = assetId
    ? (orgData.assets || []).find((a) => a.id === assetId)
    : (orgData.assets || [])[0];

  if (!targetAsset) {
    res.status(404).json({ error: 'No assets available for Monte Carlo modeling.' });
    return;
  }

  const vulns = orgData.vulnerabilities || [];
  const controls = orgData.controls || [];
  const incidents = orgData.incidents || [];

  const mcResult = DefensibleFinancialEngine.runMonteCarloSimulation(
    targetAsset,
    assumptions,
    vulns,
    controls,
    incidents,
    Math.min(10000, Math.max(100, iterations))
  );

  res.json({
    assetId: targetAsset.id,
    assetName: targetAsset.name,
    simulation: mcResult,
  });
});

// GET /api/quantification/history - 90-day risk snapshots
quantificationRouter.get('/history', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);

  const snapshots = (orgData as any).historicalSnapshots || INITIAL_HISTORICAL_SNAPSHOTS;
  res.json({ snapshots });
});
