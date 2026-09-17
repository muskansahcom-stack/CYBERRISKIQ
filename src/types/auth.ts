export type UserRole =
  | 'Organization Administrator'
  | 'Chief Information Security Officer (CISO)'
  | 'Chief Risk Officer (CRO)'
  | 'Security Analyst'
  | 'Security Architect';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export type InvitationStatus = 'Pending' | 'Accepted' | 'Expired' | 'Revoked';

export interface AuthUser {
  user_id: string;
  authentication_uid: string;
  organization_id: string;
  organization_name: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface OrganizationInfo {
  organization_id: string;
  organization_name: string;
  industry: string;
  created_at: string;
  status: 'Active' | 'Suspended';
  created_by: string;
  is_demo?: boolean;
}

export interface ManagedUser {
  user_id: string;
  authentication_uid: string;
  organization_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_login: string | null;
}

export interface Invitation {
  invitation_id: string;
  organization_id: string;
  invited_email: string;
  assigned_role: UserRole;
  invited_by: string;
  token: string;
  created_at: string;
  expires_at: string;
  status: InvitationStatus;
}

export interface AuditLogItem {
  audit_id: string;
  organization_id: string;
  actor_user_id: string;
  actor_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  timestamp: string;
  result: 'SUCCESS' | 'DENIED' | 'FAILED';
  metadata?: Record<string, any>;
}

export interface SecurityTestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    timestamp: string;
  };
  results: {
    id: number;
    name: string;
    category: string;
    passed: boolean;
    details: string;
  }[];
}
