import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from './db';
import { UserRecord, AuthSessionUser, UserRole } from './types';
import { PermissionKey, hasPermission } from './permissions';
import { createAuditLog } from './audit';

const JWT_SECRET = process.env.JWT_SECRET || 'cyberriskiq-secure-jwt-key-2026-enterprise-platform';
const TOKEN_EXPIRY = '12h';

export interface AuthenticatedRequest extends Request {
  user?: AuthSessionUser;
}

export function generateToken(user: UserRecord): string {
  const org = db.getOrganizationById(user.organization_id);
  const payload: AuthSessionUser = {
    user_id: user.user_id,
    authentication_uid: user.authentication_uid,
    organization_id: user.organization_id,
    organization_name: org ? org.organization_name : 'Unknown Organization',
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): AuthSessionUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthSessionUser;
  } catch {
    return null;
  }
}

export function hashPassword(plainText: string): string {
  return bcrypt.hashSync(plainText, 10);
}

export function comparePassword(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Authentication Middleware
 * Enforces valid bearer token, active user status, and organization existence
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      error: 'Not authenticated',
      message: 'Authentication token is required to access this resource.',
    });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({
      error: 'Invalid or expired session',
      message: 'Your session has expired or the token is invalid. Please sign in again.',
    });
    return;
  }

  // Re-verify against live database to ensure user hasn't been deactivated or role hasn't changed
  const liveUser = db.getUserById(decoded.user_id);
  if (!liveUser) {
    res.status(401).json({
      error: 'User not found',
      message: 'User account associated with this token does not exist.',
    });
    return;
  }

  if (liveUser.status !== 'Active') {
    res.status(403).json({
      error: 'User inactive',
      message: 'This user account has been deactivated. Please contact your organization administrator.',
    });
    return;
  }

  const liveOrg = db.getOrganizationById(liveUser.organization_id);
  if (!liveOrg || liveOrg.status !== 'Active') {
    res.status(403).json({
      error: 'Organization suspended',
      message: 'Your organization account is inactive or not found.',
    });
    return;
  }

  req.user = {
    user_id: liveUser.user_id,
    authentication_uid: liveUser.authentication_uid,
    organization_id: liveUser.organization_id,
    organization_name: liveOrg.organization_name,
    full_name: liveUser.full_name,
    email: liveUser.email,
    role: liveUser.role,
    status: liveUser.status,
  };

  next();
}

/**
 * Authorization Middleware
 * Enforces role-based permissions from the centralized matrix
 */
export function requirePermission(permission: PermissionKey) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!hasPermission(req.user.role, permission)) {
      // Record failed access attempt in audit log
      createAuditLog({
        organization_id: req.user.organization_id,
        actor_user_id: req.user.user_id,
        actor_email: req.user.email,
        action: 'ACCESS_DENIED',
        resource_type: 'PERMISSION',
        resource_id: permission,
        result: 'DENIED',
        metadata: {
          required_permission: permission,
          user_role: req.user.role,
          path: req.originalUrl,
        },
      });

      res.status(403).json({
        error: 'Forbidden',
        message: `Your role (${req.user.role}) is not authorized to perform this operation.`,
      });
      return;
    }

    next();
  };
}
