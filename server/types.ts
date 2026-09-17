/**
 * Server-side domain types for Organizations, Users, RBAC, and Audit Logging
 */

export type UserRole =
  | 'Organization Administrator'
  | 'Chief Information Security Officer (CISO)'
  | 'Chief Risk Officer (CRO)'
  | 'Security Analyst'
  | 'Security Architect';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended';

export type InvitationStatus = 'Pending' | 'Accepted' | 'Expired' | 'Revoked';

export interface OrganizationRecord {
  organization_id: string;
  organization_name: string;
  industry: string;
  created_at: string;
  status: 'Active' | 'Suspended';
  created_by: string; // user_id of creator
  is_demo?: boolean;
}

export interface UserRecord {
  user_id: string;
  authentication_uid: string;
  organization_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  last_login: string | null;
  mfa_enabled?: boolean;
}

export interface InvitationRecord {
  invitation_id: string;
  organization_id: string;
  invited_email: string;
  assigned_role: UserRole;
  invited_by: string; // user_id
  token: string;
  created_at: string;
  expires_at: string;
  status: InvitationStatus;
}

export interface AuditLogRecord {
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

export interface AuthSessionUser {
  user_id: string;
  authentication_uid: string;
  organization_id: string;
  organization_name: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface AiRecommendationRecord {
  recommendation_id: string;
  organization_id: string;
  timestamp: string;
  recommendation: string;
  reason: string;
  affected_assets: string[];
  risk_driver_addressed: string;
  existing_control_weakness: string;
  supporting_data: { label: string; value: string; source: string }[];
  proposed_mitigation: string;
  targetControlCategory: string;
  scenarioActionId?: string;
  baselineEal: number;
  simulatedEal?: number;
  simulatedDifference?: number;
  simulatedReductionPercent?: number;
  simulationExplanation?: string;
  assumptions: string[];
  limitations: string[];
  confidence: 'High' | 'Moderate' | 'Limited';
  confidenceExplanation: string;
  status: 'New' | 'Reviewed' | 'Simulated' | 'Accepted' | 'Rejected' | 'Implemented';
  user_action?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface AiQueryLogRecord {
  log_id: string;
  organization_id: string;
  user_id: string;
  user_email: string;
  user_role: string;
  query: string;
  timestamp: string;
  mode: 'executive' | 'technical';
  data_sources_accessed: string[];
  result_status: 'SUCCESS' | 'INSUFFICIENT_DATA' | 'ERROR';
}

