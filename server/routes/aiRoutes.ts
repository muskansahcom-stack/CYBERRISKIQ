import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../auth';
import { createAuditLog } from '../audit';
import { ExplainableAiEngine } from '../ai/explainableAiEngine';

export const aiRouter = Router();

// Enforce authentication on all AI routes
aiRouter.use(authenticateToken);

// 1. GET /api/ai/summary - AI Risk Summary
aiRouter.get('/summary', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const mode = (req.query.mode as 'executive' | 'technical') || 'executive';

  const ctx = ExplainableAiEngine.buildContext(orgId);
  const summary = ExplainableAiEngine.generateRiskSummary(ctx, mode);

  res.json(summary);
});

// 2. GET /api/ai/why-risk-changed - Explaining changes across risk snapshots
aiRouter.get('/why-risk-changed', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const ctx = ExplainableAiEngine.buildContext(orgId);
  const explanation = ExplainableAiEngine.explainRiskChange(ctx);

  res.json(explanation);
});

// 3. GET /api/ai/top-risk-drivers - Ranked by actual quantitative contribution
aiRouter.get('/top-risk-drivers', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const ctx = ExplainableAiEngine.buildContext(orgId);
  const drivers = ExplainableAiEngine.getTopRiskDrivers(ctx);

  res.json({
    drivers,
    totalEnterpriseEal: ctx.totalEal,
    modelVersion: 'FAIR ISO-27005 Actuarial Engine v3.2',
  });
});

// 4. GET /api/ai/asset-explanation/:assetId - What makes this asset risky?
aiRouter.get('/asset-explanation/:assetId', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const assetId = req.params.assetId;

  const ctx = ExplainableAiEngine.buildContext(orgId);
  const explanation = ExplainableAiEngine.explainAssetRisk(ctx, assetId);

  if (!explanation) {
    res.status(404).json({ error: `Asset ${assetId} not found in current organization scope.` });
    return;
  }

  res.json(explanation);
});

// 5. GET /api/ai/recommendations - Stored and active AI recommendations
aiRouter.get('/recommendations', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const ctx = ExplainableAiEngine.buildContext(orgId);

  // Retrieve stored recommendations
  let stored = db.getAiRecommendations(orgId);
  if (stored.length === 0) {
    // Generate initial recommendations from actual risk drivers and persist
    stored = ExplainableAiEngine.generateRecommendations(ctx);
    db.saveAiRecommendations(orgId, stored);
  }

  res.json({
    recommendations: stored,
    baselineEal: ctx.totalEal,
    organizationId: orgId,
  });
});

// 6. POST /api/ai/recommendations/:id/status - Human-in-the-loop review action
aiRouter.post('/recommendations/:id/status', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const recId = req.params.id;
  const { status, userAction } = req.body;

  if (!['New', 'Reviewed', 'Simulated', 'Accepted', 'Rejected', 'Implemented'].includes(status)) {
    res.status(400).json({ error: 'Invalid recommendation status.' });
    return;
  }

  const updated = db.updateAiRecommendationStatus(
    orgId,
    recId,
    status,
    userAction,
    req.user!.email
  );

  if (!updated) {
    res.status(404).json({ error: 'Recommendation not found.' });
    return;
  }

  // Audit log human action
  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: `AI_RECOMMENDATION_${status.toUpperCase()}`,
    resource_type: 'AI_RECOMMENDATION',
    resource_id: recId,
    metadata: { userAction, recommendationTitle: updated.recommendation },
  });

  res.json(updated);
});

// 7. POST /api/ai/simulate-recommendation - AI + What-If Integration
aiRouter.post('/simulate-recommendation', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const { recommendationId, scenarioActionId } = req.body;

  const ctx = ExplainableAiEngine.buildContext(orgId);
  const simulation = ExplainableAiEngine.simulateRecommendation(ctx, recommendationId, scenarioActionId);

  // Update recommendation with simulation results
  db.updateAiRecommendationSimulation(orgId, recommendationId, {
    simulatedEal: simulation.simulatedEal,
    simulatedDifference: simulation.differenceEal,
    simulatedReductionPercent: simulation.reductionPercent,
    simulationExplanation: simulation.aiExplanation,
    scenarioActionId,
  });

  // Audit log simulation execution
  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'AI_SIMULATION_EXECUTED',
    resource_type: 'AI_SCENARIO',
    resource_id: recommendationId,
    metadata: {
      baselineEal: simulation.baselineEal,
      simulatedEal: simulation.simulatedEal,
      differenceEal: simulation.differenceEal,
      reductionPercent: simulation.reductionPercent,
    },
  });

  res.json(simulation);
});

// 8. POST /api/ai/query - Natural Language Cyber Risk Assistant ("CyberRiskIQ Intelligence")
aiRouter.post('/query', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const orgId = req.user!.organization_id;
  const { query, mode = 'executive' } = req.body;

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'Query string is required.' });
    return;
  }

  const ctx = ExplainableAiEngine.buildContext(orgId);
  const answer = await ExplainableAiEngine.answerQuery(ctx, query, mode, req.user!.role);

  // Attach traceability evidence for this query
  const traceEvidence = ExplainableAiEngine.buildTraceabilityEvidence(ctx, undefined, `QRY-${Date.now()}`);
  answer.traceEvidence = traceEvidence;

  // Audit log AI query
  db.logAiQuery({
    log_id: `AILOG-${Date.now()}`,
    organization_id: orgId,
    user_id: req.user!.user_id,
    user_email: req.user!.email,
    user_role: req.user!.role,
    query,
    timestamp: new Date().toISOString(),
    mode,
    data_sources_accessed: ['assets', 'vulnerabilities', 'controls', 'fair_eal_model'],
    result_status: answer.insufficientDataWarning ? 'INSUFFICIENT_DATA' : 'SUCCESS',
  });

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'AI_INTELLIGENCE_QUERY',
    resource_type: 'AI_ASSISTANT',
    resource_id: `QRY-${Date.now()}`,
    metadata: { query, evidenceStrength: answer.evidenceStrength },
  });

  res.json(answer);
});

// 9. GET /api/ai/evidence - Traceability Evidence modal data
aiRouter.get('/evidence', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const recommendationId = req.query.recommendationId as string;
  const insightId = req.query.insightId as string;

  const ctx = ExplainableAiEngine.buildContext(orgId);
  const evidence = ExplainableAiEngine.buildTraceabilityEvidence(ctx, recommendationId, insightId);

  res.json(evidence);
});

// 10. GET /api/ai/recommendation-history - Full audit history of AI recommendations
aiRouter.get('/recommendation-history', (req: AuthenticatedRequest, res: Response): void => {
  const orgId = req.user!.organization_id;
  const history = db.getAiRecommendations(orgId);

  res.json({
    recommendations: history,
    organizationId: orgId,
    totalCount: history.length,
  });
});
