import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requirePermission, AuthenticatedRequest } from '../auth';
import { createAuditLog } from '../audit';

export const cyberDataRouter = Router();

// Enforce authentication on all cyber data endpoints
cyberDataRouter.use(authenticateToken);

// ==================== ASSETS ====================
// GET /api/data/assets - Read assets for the user's organization only
cyberDataRouter.get('/assets', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ assets: orgData.assets });
});

// POST /api/data/assets - Add new asset
cyberDataRouter.post('/assets', requirePermission('edit_technical_data'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  const assetPayload = req.body;

  const newId = `AST-${orgData.assets.length + 101}`;
  const assetRecord = {
    ...assetPayload,
    id: newId,
    organization_id: orgId, // Guarantee tenant binding
  };

  orgData.assets.push(assetRecord);
  db.saveOrgData(orgId, { assets: orgData.assets });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'ASSET_CREATED',
    resource_type: 'ASSET',
    resource_id: newId,
    metadata: { name: assetRecord.name, businessUnit: assetRecord.businessUnit },
  });

  res.status(201).json({ asset: assetRecord });
});

// PUT /api/data/assets/:id - Update asset
cyberDataRouter.put('/assets/:id', requirePermission('edit_technical_data'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const assetId = req.params.id;
  const orgData = db.getOrgData(orgId);

  const index = orgData.assets.findIndex((a) => a.id === assetId);
  if (index === -1) {
    res.status(404).json({ error: 'Asset not found in your organization.' });
    return;
  }

  // Prevent client from changing organization_id
  const updatedAsset = {
    ...orgData.assets[index],
    ...req.body,
    id: assetId,
    organization_id: orgId,
  };

  orgData.assets[index] = updatedAsset;
  db.saveOrgData(orgId, { assets: orgData.assets });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'ASSET_UPDATED',
    resource_type: 'ASSET',
    resource_id: assetId,
    metadata: { name: updatedAsset.name },
  });

  res.json({ asset: updatedAsset });
});

// DELETE /api/data/assets/:id
cyberDataRouter.delete('/assets/:id', requirePermission('edit_technical_data'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const assetId = req.params.id;
  const orgData = db.getOrgData(orgId);

  const index = orgData.assets.findIndex((a) => a.id === assetId);
  if (index === -1) {
    res.status(404).json({ error: 'Asset not found in your organization.' });
    return;
  }

  const removed = orgData.assets.splice(index, 1)[0];
  db.saveOrgData(orgId, { assets: orgData.assets });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'ASSET_DELETED',
    resource_type: 'ASSET',
    resource_id: assetId,
    metadata: { name: removed.name },
  });

  res.json({ message: 'Asset deleted successfully.' });
});

// ==================== VULNERABILITIES ====================
cyberDataRouter.get('/vulnerabilities', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ vulnerabilities: orgData.vulnerabilities });
});

cyberDataRouter.post('/vulnerabilities', requirePermission('edit_technical_data'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);

  const newId = `VULN-${orgData.vulnerabilities.length + 101}`;
  const record = {
    ...req.body,
    id: newId,
    organization_id: orgId,
  };

  orgData.vulnerabilities.push(record);
  db.saveOrgData(orgId, { vulnerabilities: orgData.vulnerabilities });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'VULNERABILITY_LOGGED',
    resource_type: 'VULNERABILITY',
    resource_id: newId,
    metadata: { cveId: record.cveId, name: record.name },
  });

  res.status(201).json({ vulnerability: record });
});

cyberDataRouter.put('/vulnerabilities/:id', requirePermission('edit_technical_data'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const vulnId = req.params.id;
  const orgData = db.getOrgData(orgId);

  const index = orgData.vulnerabilities.findIndex((v) => v.id === vulnId);
  if (index === -1) {
    res.status(404).json({ error: 'Vulnerability not found in your organization.' });
    return;
  }

  const updated = {
    ...orgData.vulnerabilities[index],
    ...req.body,
    id: vulnId,
    organization_id: orgId,
  };

  orgData.vulnerabilities[index] = updated;
  db.saveOrgData(orgId, { vulnerabilities: orgData.vulnerabilities });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'VULNERABILITY_UPDATED',
    resource_type: 'VULNERABILITY',
    resource_id: vulnId,
    metadata: { cveId: updated.cveId, status: updated.remediationStatus },
  });

  res.json({ vulnerability: updated });
});

cyberDataRouter.delete('/vulnerabilities/:id', requirePermission('edit_technical_data'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const vulnId = req.params.id;
  const orgData = db.getOrgData(orgId);

  const index = orgData.vulnerabilities.findIndex((v) => v.id === vulnId);
  if (index === -1) {
    res.status(404).json({ error: 'Vulnerability not found in your organization.' });
    return;
  }

  const removed = orgData.vulnerabilities.splice(index, 1)[0];
  db.saveOrgData(orgId, { vulnerabilities: orgData.vulnerabilities });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'VULNERABILITY_DELETED',
    resource_type: 'VULNERABILITY',
    resource_id: vulnId,
    metadata: { cveId: removed.cveId },
  });

  res.json({ message: 'Vulnerability deleted successfully.' });
});

// ==================== SECURITY CONTROLS ====================
cyberDataRouter.get('/controls', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ controls: orgData.controls });
});

cyberDataRouter.put('/controls/:id', requirePermission('edit_technical_data'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const controlId = req.params.id;
  const orgData = db.getOrgData(orgId);

  const index = orgData.controls.findIndex((c) => c.id === controlId);
  if (index === -1) {
    res.status(404).json({ error: 'Control not found in your organization.' });
    return;
  }

  const updated = {
    ...orgData.controls[index],
    ...req.body,
    id: controlId,
    organization_id: orgId,
  };

  orgData.controls[index] = updated;
  db.saveOrgData(orgId, { controls: orgData.controls });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'CONTROL_MODIFIED',
    resource_type: 'CONTROL',
    resource_id: controlId,
    metadata: { name: updated.name, status: updated.status },
  });

  res.json({ control: updated });
});

// ==================== THREATS, INCIDENTS, COMPLIANCE ====================
cyberDataRouter.get('/threats', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ threats: orgData.threats });
});

cyberDataRouter.get('/incidents', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ incidents: orgData.incidents });
});

cyberDataRouter.post('/incidents', requirePermission('edit_technical_data'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);

  const newId = `INC-${new Date().getFullYear()}-${String(orgData.incidents.length + 1).padStart(3, '0')}`;
  const record = {
    ...req.body,
    id: newId,
    organization_id: orgId,
  };

  orgData.incidents.unshift(record);
  db.saveOrgData(orgId, { incidents: orgData.incidents });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'INCIDENT_RECORDED',
    resource_type: 'INCIDENT',
    resource_id: newId,
    metadata: { title: record.title, severity: record.severity },
  });

  res.status(201).json({ incident: record });
});

cyberDataRouter.get('/compliance', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ compliance: orgData.compliance });
});

// ==================== FINANCIAL EXPOSURE PROFILE ====================
cyberDataRouter.get('/financial-profile', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ financialProfile: orgData.financialProfile });
});

cyberDataRouter.put('/financial-profile', requirePermission('edit_financial_parameters'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);

  const updatedProfile = {
    ...orgData.financialProfile,
    ...req.body,
    organization_id: orgId,
  };

  orgData.financialProfile = updatedProfile;
  db.saveOrgData(orgId, { financialProfile: updatedProfile });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'FINANCIAL_ASSUMPTIONS_CALIBRATED',
    resource_type: 'FINANCIAL_PROFILE',
    resource_id: orgId,
    metadata: updatedProfile.assumptions,
  });

  res.json({ financialProfile: updatedProfile });
});

// ==================== SIMULATION ACTIONS & INVESTMENTS ====================
cyberDataRouter.get('/simulation-actions', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ simulationActions: orgData.simulationActions });
});

cyberDataRouter.put('/simulation-actions/:id', requirePermission('run_simulations'), (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const actionId = req.params.id;
  const orgData = db.getOrgData(orgId);

  const action = orgData.simulationActions.find((a) => a.id === actionId);
  if (!action) {
    res.status(404).json({ error: 'Simulation action not found.' });
    return;
  }

  action.enabled = !!req.body.enabled;
  db.saveOrgData(orgId, { simulationActions: orgData.simulationActions });

  res.json({ action });
});

cyberDataRouter.get('/investment-candidates', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const orgData = db.getOrgData(orgId);
  res.json({ investmentCandidates: orgData.investmentCandidates });
});
