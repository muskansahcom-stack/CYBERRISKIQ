import { Router, Response } from 'express';
import { db } from '../db';
import { authenticateToken, requirePermission, AuthenticatedRequest, generateSecureToken } from '../auth';
import { createAuditLog } from '../audit';
import { InvitationRecord, UserRole } from '../types';

export const orgRouter = Router();

// All routes below require valid authentication
orgRouter.use(authenticateToken);

// GET /api/organization - View current organization
orgRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const org = db.getOrganizationById(req.user!.organization_id);
  if (!org) {
    res.status(404).json({ error: 'Organization not found.' });
    return;
  }
  res.json({ organization: org });
});

// PUT /api/organization - Edit organization settings (Admin only)
orgRouter.put('/', requirePermission('manage_organization'), (req: AuthenticatedRequest, res: Response): void => {
  const { organization_name, industry } = req.body;
  const orgId = req.user!.organization_id;

  if (!organization_name && !industry) {
    res.status(400).json({ error: 'At least one field (organization_name, industry) is required.' });
    return;
  }

  const updated = db.updateOrganization(orgId, { organization_name, industry });
  if (!updated) {
    res.status(404).json({ error: 'Organization not found.' });
    return;
  }

  createAuditLog({
    organization_id: orgId,
    actor_user_id: req.user!.user_id,
    actor_email: req.user!.email,
    action: 'ORGANIZATION_UPDATED',
    resource_type: 'ORGANIZATION',
    resource_id: orgId,
    metadata: { organization_name, industry },
  });

  res.json({ organization: updated, message: 'Organization updated successfully.' });
});

// GET /api/organization/users - View users in organization (Admin only)
orgRouter.get('/users', requirePermission('view_users'), (req: AuthenticatedRequest, res: Response): void => {
  const users = db.getUsersByOrg(req.user!.organization_id).map((u) => ({
    user_id: u.user_id,
    authentication_uid: u.authentication_uid,
    organization_id: u.organization_id,
    full_name: u.full_name,
    email: u.email,
    role: u.role,
    status: u.status,
    created_at: u.created_at,
    last_login: u.last_login,
  }));
  res.json({ users });
});

// PUT /api/organization/users/:userId/role - Change user role (Admin only)
orgRouter.put('/users/:userId/role', requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response): void => {
  const { role } = req.body;
  const targetUserId = req.params.userId;
  const currentUser = req.user!;

  const validRoles: UserRole[] = [
    'Organization Administrator',
    'Chief Information Security Officer (CISO)',
    'Chief Risk Officer (CRO)',
    'Security Analyst',
    'Security Architect',
  ];

  if (!validRoles.includes(role)) {
    res.status(400).json({ error: 'Invalid role specified.' });
    return;
  }

  const targetUser = db.getUserById(targetUserId);
  if (!targetUser) {
    res.status(404).json({ error: 'Target user not found.' });
    return;
  }

  // Enforce tenant boundary: Cannot modify user of another organization
  if (targetUser.organization_id !== currentUser.organization_id) {
    createAuditLog({
      organization_id: currentUser.organization_id,
      actor_user_id: currentUser.user_id,
      actor_email: currentUser.email,
      action: 'CROSS_TENANT_ACCESS_BLOCKED',
      resource_type: 'USER',
      resource_id: targetUserId,
      result: 'DENIED',
      metadata: { target_org_id: targetUser.organization_id },
    });
    res.status(403).json({ error: 'Forbidden: Cannot manage users of another organization.' });
    return;
  }

  // Security Rule: A user cannot modify their own role (prevents self-escalation or accidental lockout)
  if (targetUserId === currentUser.user_id) {
    res.status(400).json({ error: 'Security Rule: You cannot modify your own role.' });
    return;
  }

  const oldRole = targetUser.role;
  db.updateUserRole(targetUserId, role);

  createAuditLog({
    organization_id: currentUser.organization_id,
    actor_user_id: currentUser.user_id,
    actor_email: currentUser.email,
    action: 'USER_ROLE_CHANGED',
    resource_type: 'USER',
    resource_id: targetUserId,
    metadata: { old_role: oldRole, new_role: role, target_email: targetUser.email },
  });

  res.json({ message: `Role for ${targetUser.email} updated to ${role}.` });
});

// PUT /api/organization/users/:userId/status - Activate/Deactivate user (Admin only)
orgRouter.put('/users/:userId/status', requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response): void => {
  const { status } = req.body;
  const targetUserId = req.params.userId;
  const currentUser = req.user!;

  if (!['Active', 'Inactive', 'Suspended'].includes(status)) {
    res.status(400).json({ error: 'Invalid status. Must be Active, Inactive, or Suspended.' });
    return;
  }

  const targetUser = db.getUserById(targetUserId);
  if (!targetUser) {
    res.status(404).json({ error: 'Target user not found.' });
    return;
  }

  if (targetUser.organization_id !== currentUser.organization_id) {
    res.status(403).json({ error: 'Forbidden: Cannot manage users of another organization.' });
    return;
  }

  if (targetUserId === currentUser.user_id && status !== 'Active') {
    res.status(400).json({ error: 'Security Rule: You cannot deactivate your own account.' });
    return;
  }

  db.updateUserStatus(targetUserId, status);

  createAuditLog({
    organization_id: currentUser.organization_id,
    actor_user_id: currentUser.user_id,
    actor_email: currentUser.email,
    action: `USER_${status.toUpperCase()}`,
    resource_type: 'USER',
    resource_id: targetUserId,
    metadata: { target_email: targetUser.email, new_status: status },
  });

  res.json({ message: `User status updated to ${status}.` });
});

// POST /api/organization/invitations - Invite user (Admin only)
orgRouter.post('/invitations', requirePermission('invite_users'), (req: AuthenticatedRequest, res: Response): void => {
  const { email, role, full_name } = req.body;
  const currentUser = req.user!;

  if (!email || !role) {
    res.status(400).json({ error: 'Email and role are required.' });
    return;
  }

  const validRoles: UserRole[] = [
    'Organization Administrator',
    'Chief Information Security Officer (CISO)',
    'Chief Risk Officer (CRO)',
    'Security Analyst',
    'Security Architect',
  ];

  if (!validRoles.includes(role)) {
    res.status(400).json({ error: 'Invalid role specified.' });
    return;
  }

  // Check if active user already exists with that email
  const existingUser = db.getUserByEmail(email);
  if (existingUser) {
    res.status(400).json({ error: 'A user with this email is already registered in the platform.' });
    return;
  }

  const inviteToken = `inv_${generateSecureToken()}`;
  const invitationId = `INV-${Date.now()}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  const newInvitation: InvitationRecord = {
    invitation_id: invitationId,
    organization_id: currentUser.organization_id,
    invited_email: email.toLowerCase().trim(),
    assigned_role: role,
    invited_by: currentUser.user_id,
    token: inviteToken,
    created_at: new Date().toISOString(),
    expires_at: expiresAt,
    status: 'Pending',
  };

  db.createInvitation(newInvitation);

  createAuditLog({
    organization_id: currentUser.organization_id,
    actor_user_id: currentUser.user_id,
    actor_email: currentUser.email,
    action: 'USER_INVITATION_CREATED',
    resource_type: 'INVITATION',
    resource_id: invitationId,
    metadata: { invited_email: email, assigned_role: role },
  });

  res.status(201).json({
    invitation: newInvitation,
    inviteUrl: `/accept-invite?token=${inviteToken}`,
    message: `Invitation successfully dispatched to ${email}.`,
  });
});

// GET /api/organization/invitations - List invitations (Admin only)
orgRouter.get('/invitations', requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response): void => {
  const invitations = db.getInvitationsByOrg(req.user!.organization_id);
  res.json({ invitations });
});

// DELETE /api/organization/invitations/:inviteId - Revoke invitation (Admin only)
orgRouter.delete('/invitations/:inviteId', requirePermission('manage_users'), (req: AuthenticatedRequest, res: Response): void => {
  const { inviteId } = req.params;
  const currentUser = req.user!;

  const invitations = db.getInvitationsByOrg(currentUser.organization_id);
  const targetInvite = invitations.find((i) => i.invitation_id === inviteId);

  if (!targetInvite) {
    res.status(404).json({ error: 'Invitation not found in your organization.' });
    return;
  }

  db.updateInvitationStatus(inviteId, 'Revoked');

  createAuditLog({
    organization_id: currentUser.organization_id,
    actor_user_id: currentUser.user_id,
    actor_email: currentUser.email,
    action: 'USER_INVITATION_REVOKED',
    resource_type: 'INVITATION',
    resource_id: inviteId,
    metadata: { email: targetInvite.invited_email },
  });

  res.json({ message: 'Invitation has been revoked.' });
});

// GET /api/organization/audit-logs - Immutable audit logs (Admin only)
orgRouter.get('/audit-logs', requirePermission('view_audit_logs'), (req: AuthenticatedRequest, res: Response): void => {
  const logs = db.getAuditLogsByOrg(req.user!.organization_id);
  res.json({ auditLogs: logs });
});
