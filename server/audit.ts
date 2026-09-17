import { AuditLogRecord } from './types';
import { db } from './db';

export function createAuditLog(params: {
  organization_id: string;
  actor_user_id: string;
  actor_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  result?: 'SUCCESS' | 'DENIED' | 'FAILED';
  metadata?: Record<string, any>;
}): AuditLogRecord {
  const auditRecord: AuditLogRecord = {
    audit_id: `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    organization_id: params.organization_id,
    actor_user_id: params.actor_user_id,
    actor_email: params.actor_email,
    action: params.action,
    resource_type: params.resource_type,
    resource_id: params.resource_id,
    timestamp: new Date().toISOString(),
    result: params.result || 'SUCCESS',
    metadata: params.metadata || {},
  };

  db.appendAuditLog(auditRecord);
  return auditRecord;
}
