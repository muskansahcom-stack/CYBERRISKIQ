import { UserRole } from './types';

export type PermissionKey =
  | 'manage_organization'
  | 'manage_users'
  | 'view_users'
  | 'invite_users'
  | 'view_audit_logs'
  | 'edit_technical_data'
  | 'view_technical_data'
  | 'run_simulations'
  | 'optimize_investments'
  | 'view_financial_risk'
  | 'edit_financial_parameters'
  | 'generate_reports'
  | 'ai_decision';

export const ROLE_PERMISSIONS: Record<UserRole, Record<PermissionKey, boolean>> = {
  'Organization Administrator': {
    manage_organization: true,
    manage_users: true,
    view_users: true,
    invite_users: true,
    view_audit_logs: true,
    edit_technical_data: true,
    view_technical_data: true,
    run_simulations: true,
    optimize_investments: true,
    view_financial_risk: true,
    edit_financial_parameters: true,
    generate_reports: true,
    ai_decision: true,
  },
  'Chief Information Security Officer (CISO)': {
    manage_organization: false,
    manage_users: false,
    view_users: false,
    invite_users: false,
    view_audit_logs: false,
    edit_technical_data: false, // Technical editing restricted to SecOps
    view_technical_data: true,
    run_simulations: true,
    optimize_investments: true,
    view_financial_risk: true,
    edit_financial_parameters: true,
    generate_reports: true,
    ai_decision: true,
  },
  'Chief Risk Officer (CRO)': {
    manage_organization: false,
    manage_users: false,
    view_users: false,
    invite_users: false,
    view_audit_logs: false,
    edit_technical_data: false,
    view_technical_data: true,
    run_simulations: true,
    optimize_investments: true,
    view_financial_risk: true,
    edit_financial_parameters: false,
    generate_reports: true,
    ai_decision: true,
  },
  'Security Analyst': {
    manage_organization: false,
    manage_users: false,
    view_users: false,
    invite_users: false,
    view_audit_logs: false,
    edit_technical_data: true,
    view_technical_data: true,
    run_simulations: true,
    optimize_investments: false, // Strategic investment decisions reserved for CISO/CRO/Admin
    view_financial_risk: true,
    edit_financial_parameters: false,
    generate_reports: false,
    ai_decision: true,
  },
  'Security Architect': {
    manage_organization: false,
    manage_users: false,
    view_users: false,
    invite_users: false,
    view_audit_logs: false,
    edit_technical_data: true,
    view_technical_data: true,
    run_simulations: true,
    optimize_investments: true,
    view_financial_risk: true,
    edit_financial_parameters: false,
    generate_reports: true,
    ai_decision: true,
  },
};

export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  const roleConfig = ROLE_PERMISSIONS[role];
  if (!roleConfig) return false;
  return !!roleConfig[permission];
}
