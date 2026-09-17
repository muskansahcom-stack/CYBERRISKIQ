import { Router, Request, Response } from 'express';
import { db } from '../db';
import {
  generateToken,
  comparePassword,
  hashPassword,
  generateSecureToken,
  authenticateToken,
  AuthenticatedRequest,
} from '../auth';
import { createAuditLog } from '../audit';
import { UserRecord, OrganizationRecord, UserRole } from '../types';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  if (user.status !== 'Active') {
    res.status(403).json({ error: 'Account is deactivated. Contact your administrator.' });
    return;
  }

  const isMatch = comparePassword(password, user.password_hash);
  if (!isMatch) {
    createAuditLog({
      organization_id: user.organization_id,
      actor_user_id: user.user_id,
      actor_email: user.email,
      action: 'LOGIN_FAILED',
      resource_type: 'AUTH',
      resource_id: user.user_id,
      result: 'DENIED',
      metadata: { reason: 'Incorrect password' },
    });
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  // Update last login
  db.updateLastLogin(user.user_id);

  // Audit log
  createAuditLog({
    organization_id: user.organization_id,
    actor_user_id: user.user_id,
    actor_email: user.email,
    action: 'USER_LOGIN',
    resource_type: 'AUTH',
    resource_id: user.user_id,
    result: 'SUCCESS',
  });

  const token = generateToken(user);
  const org = db.getOrganizationById(user.organization_id);

  res.json({
    token,
    user: {
      user_id: user.user_id,
      authentication_uid: user.authentication_uid,
      organization_id: user.organization_id,
      organization_name: org ? org.organization_name : '',
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

// POST /api/auth/register-invite (Invitation-based user registration)
authRouter.post('/register-invite', (req: Request, res: Response): void => {
  const { token, full_name, password } = req.body;

  if (!token || !full_name || !password) {
    res.status(400).json({ error: 'Token, full name, and password are required.' });
    return;
  }

  const invite = db.getInvitationByToken(token);
  if (!invite) {
    res.status(400).json({ error: 'Invalid invitation token.' });
    return;
  }

  if (invite.status !== 'Pending') {
    res.status(400).json({ error: `This invitation has already been ${invite.status.toLowerCase()}.` });
    return;
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    db.updateInvitationStatus(invite.invitation_id, 'Expired');
    res.status(400).json({ error: 'This invitation has expired.' });
    return;
  }

  // Check if user already registered with that email
  if (db.getUserByEmail(invite.invited_email)) {
    res.status(400).json({ error: 'A user with this email already exists.' });
    return;
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const authUid = `auth_${generateSecureToken().substring(0, 16)}`;

  const newUser: UserRecord = {
    user_id: userId,
    authentication_uid: authUid,
    organization_id: invite.organization_id,
    full_name,
    email: invite.invited_email,
    password_hash: hashPassword(password),
    role: invite.assigned_role,
    status: 'Active',
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  };

  db.createUser(newUser);
  db.updateInvitationStatus(invite.invitation_id, 'Accepted');

  createAuditLog({
    organization_id: invite.organization_id,
    actor_user_id: userId,
    actor_email: invite.invited_email,
    action: 'INVITATION_ACCEPTED',
    resource_type: 'USER',
    resource_id: userId,
    result: 'SUCCESS',
    metadata: { role: invite.assigned_role, invitation_id: invite.invitation_id },
  });

  const jwtToken = generateToken(newUser);
  const org = db.getOrganizationById(invite.organization_id);

  res.status(201).json({
    token: jwtToken,
    user: {
      user_id: newUser.user_id,
      authentication_uid: newUser.authentication_uid,
      organization_id: newUser.organization_id,
      organization_name: org ? org.organization_name : '',
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    },
  });
});

// POST /api/auth/create-organization (First organization creation flow)
authRouter.post('/create-organization', (req: Request, res: Response): void => {
  const { organization_name, industry, full_name, email, password } = req.body;

  if (!organization_name || !industry || !full_name || !email || !password) {
    res.status(400).json({ error: 'All fields are required.' });
    return;
  }

  if (db.getUserByEmail(email)) {
    res.status(400).json({ error: 'A user with this email already exists. Please log in.' });
    return;
  }

  const orgId = `org_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const userId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  const authUid = `auth_${generateSecureToken().substring(0, 16)}`;

  const newOrg: OrganizationRecord = {
    organization_id: orgId,
    organization_name,
    industry,
    created_at: new Date().toISOString(),
    status: 'Active',
    created_by: userId,
    is_demo: false,
  };

  db.createOrganization(newOrg);

  const newUser: UserRecord = {
    user_id: userId,
    authentication_uid: authUid,
    organization_id: orgId,
    full_name,
    email,
    password_hash: hashPassword(password),
    role: 'Organization Administrator', // First user is Admin
    status: 'Active',
    created_at: new Date().toISOString(),
    last_login: new Date().toISOString(),
  };

  db.createUser(newUser);

  createAuditLog({
    organization_id: orgId,
    actor_user_id: userId,
    actor_email: email,
    action: 'ORGANIZATION_CREATED',
    resource_type: 'ORGANIZATION',
    resource_id: orgId,
    result: 'SUCCESS',
    metadata: { name: organization_name, industry },
  });

  const jwtToken = generateToken(newUser);

  res.status(201).json({
    token: jwtToken,
    user: {
      user_id: newUser.user_id,
      authentication_uid: newUser.authentication_uid,
      organization_id: newUser.organization_id,
      organization_name: newOrg.organization_name,
      full_name: newUser.full_name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
    },
  });
});

// POST /api/auth/logout
authRouter.post('/logout', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  if (req.user) {
    createAuditLog({
      organization_id: req.user.organization_id,
      actor_user_id: req.user.user_id,
      actor_email: req.user.email,
      action: 'USER_LOGOUT',
      resource_type: 'AUTH',
      resource_id: req.user.user_id,
      result: 'SUCCESS',
    });
  }
  res.json({ message: 'Logged out successfully.' });
});

// GET /api/auth/me
authRouter.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response): void => {
  res.json({ user: req.user });
});

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', (req: Request, res: Response): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required.' });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    // For security, don't reveal user existence, but return generic success message
    res.json({ message: 'If this email is registered, password reset instructions have been dispatched.' });
    return;
  }

  const resetToken = generateSecureToken();
  const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.createPasswordReset(email, resetToken, expires_at);

  createAuditLog({
    organization_id: user.organization_id,
    actor_user_id: user.user_id,
    actor_email: user.email,
    action: 'PASSWORD_RESET_REQUESTED',
    resource_type: 'AUTH',
    resource_id: user.user_id,
    result: 'SUCCESS',
  });

  res.json({
    message: 'If this email is registered, password reset instructions have been dispatched.',
    resetToken, // Provided for easy test execution and UI preview
  });
});

// POST /api/auth/reset-password
authRouter.post('/reset-password', (req: Request, res: Response): void => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    res.status(400).json({ error: 'Token and new password are required.' });
    return;
  }

  const resetRecord = db.getPasswordReset(token);
  if (!resetRecord) {
    res.status(400).json({ error: 'Invalid or expired password reset token.' });
    return;
  }

  if (new Date(resetRecord.expires_at).getTime() < Date.now()) {
    db.removePasswordReset(token);
    res.status(400).json({ error: 'Password reset token has expired.' });
    return;
  }

  const user = db.getUserByEmail(resetRecord.email);
  if (!user) {
    res.status(400).json({ error: 'User account not found.' });
    return;
  }

  const newHash = hashPassword(newPassword);
  db.updateUserPassword(user.user_id, newHash);
  db.removePasswordReset(token);

  createAuditLog({
    organization_id: user.organization_id,
    actor_user_id: user.user_id,
    actor_email: user.email,
    action: 'PASSWORD_RESET_COMPLETED',
    resource_type: 'AUTH',
    resource_id: user.user_id,
    result: 'SUCCESS',
  });

  res.json({ message: 'Password has been updated successfully. Please sign in with your new password.' });
});
