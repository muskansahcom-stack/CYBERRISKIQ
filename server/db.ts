import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  OrganizationRecord,
  UserRecord,
  InvitationRecord,
  AuditLogRecord,
  AiRecommendationRecord,
  AiQueryLogRecord,
} from './types';
import {
  INITIAL_ASSETS,
  INITIAL_VULNERABILITIES,
  INITIAL_CONTROLS,
  INITIAL_THREATS,
  INITIAL_INCIDENTS,
  INITIAL_COMPLIANCE_ITEMS,
  INITIAL_FINANCIAL_PROFILE,
  INITIAL_SIMULATION_ACTIONS,
  INITIAL_INVESTMENT_CANDIDATES,
} from '../src/data/demoData';

export interface OrgCyberData {
  organization_id: string;
  assets: any[];
  vulnerabilities: any[];
  controls: any[];
  threats: any[];
  incidents: any[];
  compliance: any[];
  financialProfile: any;
  simulationActions: any[];
  investmentCandidates: any[];
}

interface DatabaseSchema {
  organizations: OrganizationRecord[];
  users: UserRecord[];
  invitations: InvitationRecord[];
  auditLogs: AuditLogRecord[];
  orgData: Record<string, OrgCyberData>;
  passwordResets: { token: string; email: string; expires_at: string }[];
  aiRecommendations: Record<string, AiRecommendationRecord[]>;
  aiQueryLogs: Record<string, AiQueryLogRecord[]>;
}

const DB_FILE_PATH = path.join(process.cwd(), 'data-store.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseSchema {
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.aiRecommendations) parsed.aiRecommendations = {};
        if (!parsed.aiQueryLogs) parsed.aiQueryLogs = {};
        return parsed;
      } catch (err) {
        console.error('Failed to parse database file, resetting to initial seed:', err);
      }
    }
    return this.buildInitialSeed();
  }

  private save(): void {
    try {
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  private buildInitialSeed(): DatabaseSchema {
    const defaultPasswordHash = bcrypt.hashSync('Cyber@2026!', 10);
    const now = new Date().toISOString();

    const organizations: OrganizationRecord[] = [
      {
        organization_id: 'org_acme_01',
        organization_name: 'Acme Financial Services',
        industry: 'Banking & Digital Payments',
        created_at: '2024-01-15T09:00:00Z',
        status: 'Active',
        created_by: 'usr_acme_admin',
        is_demo: true,
      },
      {
        organization_id: 'org_beta_02',
        organization_name: 'Beta Healthcare Systems',
        industry: 'Healthcare & Life Sciences',
        created_at: '2024-02-10T11:00:00Z',
        status: 'Active',
        created_by: 'usr_beta_admin',
        is_demo: true,
      },
    ];

    const users: UserRecord[] = [
      // Acme Users
      {
        user_id: 'usr_acme_admin',
        authentication_uid: 'auth_uid_acme_admin',
        organization_id: 'org_acme_01',
        full_name: 'Rajeshwari Iyer',
        email: 'admin@acmefinancial.in',
        password_hash: defaultPasswordHash,
        role: 'Organization Administrator',
        status: 'Active',
        created_at: '2024-01-15T09:30:00Z',
        last_login: now,
      },
      {
        user_id: 'usr_acme_ciso',
        authentication_uid: 'auth_uid_acme_ciso',
        organization_id: 'org_acme_01',
        full_name: 'Vikramaditya Singhania',
        email: 'ciso@acmefinancial.in',
        password_hash: defaultPasswordHash,
        role: 'Chief Information Security Officer (CISO)',
        status: 'Active',
        created_at: '2024-01-16T10:00:00Z',
        last_login: now,
      },
      {
        user_id: 'usr_acme_cro',
        authentication_uid: 'auth_uid_acme_cro',
        organization_id: 'org_acme_01',
        full_name: 'Aishwarya Krishnamurthy',
        email: 'cro@acmefinancial.in',
        password_hash: defaultPasswordHash,
        role: 'Chief Risk Officer (CRO)',
        status: 'Active',
        created_at: '2024-01-16T10:15:00Z',
        last_login: now,
      },
      {
        user_id: 'usr_acme_analyst',
        authentication_uid: 'auth_uid_acme_analyst',
        organization_id: 'org_acme_01',
        full_name: 'Ananya Deshmukh',
        email: 'analyst@acmefinancial.in',
        password_hash: defaultPasswordHash,
        role: 'Security Analyst',
        status: 'Active',
        created_at: '2024-01-18T14:00:00Z',
        last_login: now,
      },
      {
        user_id: 'usr_acme_architect',
        authentication_uid: 'auth_uid_acme_architect',
        organization_id: 'org_acme_01',
        full_name: 'Devraj Sengupta',
        email: 'architect@acmefinancial.in',
        password_hash: defaultPasswordHash,
        role: 'Security Architect',
        status: 'Active',
        created_at: '2024-01-19T09:45:00Z',
        last_login: now,
      },

      // Beta Healthcare Users
      {
        user_id: 'usr_beta_admin',
        authentication_uid: 'auth_uid_beta_admin',
        organization_id: 'org_beta_02',
        full_name: 'Dr. Sunita Patel',
        email: 'admin@betahealthcare.org',
        password_hash: defaultPasswordHash,
        role: 'Organization Administrator',
        status: 'Active',
        created_at: '2024-02-10T11:15:00Z',
        last_login: now,
      },
      {
        user_id: 'usr_beta_analyst',
        authentication_uid: 'auth_uid_beta_analyst',
        organization_id: 'org_beta_02',
        full_name: 'Karan Joshi',
        email: 'analyst@betahealthcare.org',
        password_hash: defaultPasswordHash,
        role: 'Security Analyst',
        status: 'Active',
        created_at: '2024-02-12T13:20:00Z',
        last_login: now,
      },
    ];

    const invitations: InvitationRecord[] = [
      {
        invitation_id: 'INV-1001',
        organization_id: 'org_acme_01',
        invited_email: 'new.architect@acmefinancial.in',
        assigned_role: 'Security Architect',
        invited_by: 'usr_acme_admin',
        token: 'invite_token_acme_valid_12345',
        created_at: now,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Pending',
      },
    ];

    const auditLogs: AuditLogRecord[] = [
      {
        audit_id: 'AUD-001',
        organization_id: 'org_acme_01',
        actor_user_id: 'usr_acme_admin',
        actor_email: 'admin@acmefinancial.in',
        action: 'ORGANIZATION_INITIALIZED',
        resource_type: 'ORGANIZATION',
        resource_id: 'org_acme_01',
        timestamp: '2024-01-15T09:00:00Z',
        result: 'SUCCESS',
        metadata: { name: 'Acme Financial Services', industry: 'Banking & Digital Payments' },
      },
      {
        audit_id: 'AUD-002',
        organization_id: 'org_beta_02',
        actor_user_id: 'usr_beta_admin',
        actor_email: 'admin@betahealthcare.org',
        action: 'ORGANIZATION_INITIALIZED',
        resource_type: 'ORGANIZATION',
        resource_id: 'org_beta_02',
        timestamp: '2024-02-10T11:00:00Z',
        result: 'SUCCESS',
        metadata: { name: 'Beta Healthcare Systems', industry: 'Healthcare & Life Sciences' },
      },
    ];

    // Seed Acme Financial data with organization_id explicitly stamped
    const acmeAssets = INITIAL_ASSETS.map((a) => ({ ...a, organization_id: 'org_acme_01' }));
    const acmeVulns = INITIAL_VULNERABILITIES.map((v) => ({ ...v, organization_id: 'org_acme_01' }));
    const acmeControls = INITIAL_CONTROLS.map((c) => ({ ...c, organization_id: 'org_acme_01' }));
    const acmeThreats = INITIAL_THREATS.map((t) => ({ ...t, organization_id: 'org_acme_01' }));
    const acmeIncidents = INITIAL_INCIDENTS.map((i) => ({ ...i, organization_id: 'org_acme_01' }));
    const acmeCompliance = INITIAL_COMPLIANCE_ITEMS.map((c: any) => ({ ...c, organization_id: 'org_acme_01' }));

    // Seed Beta Healthcare data with distinct records
    const betaAssets = [
      {
        id: 'AST-B01',
        organization_id: 'org_beta_02',
        name: 'Electronic Health Records (EHR) Cloud Core',
        type: 'Database',
        businessUnit: 'Clinical Operations',
        owner: 'Dr. Sunita Patel',
        businessValue: 65000000,
        criticality: 'Critical',
        internetExposure: false,
        dataSensitivity: 'High (PII & Financial)',
        dependencies: ['AST-B02', 'AST-B03'],
        currentRiskScore: 84,
        financialExposure: 9500000,
        expectedAnnualLoss: 2400000,
        ipOrLocation: '10.120.4.18 / Healthcare VPC Mumbai',
        notes: 'Stores 1.2 million confidential electronic patient records and clinical history under DISHA compliance.',
      },
      {
        id: 'AST-B02',
        organization_id: 'org_beta_02',
        name: 'Radiology PACS Imaging Server',
        type: 'Server',
        businessUnit: 'Diagnostic Imaging',
        owner: 'Karan Joshi',
        businessValue: 38000000,
        criticality: 'High',
        internetExposure: false,
        dataSensitivity: 'Medium (Confidential)',
        dependencies: [],
        currentRiskScore: 68,
        financialExposure: 4200000,
        expectedAnnualLoss: 980000,
        ipOrLocation: '10.120.5.22 / Hospital Internal Subnet',
        notes: 'Medical imaging PACS cluster for CT, MRI, and X-ray records.',
      },
      {
        id: 'AST-B03',
        organization_id: 'org_beta_02',
        name: 'Telemedicine Patient Portal API',
        type: 'API Gateway',
        businessUnit: 'Digital Health',
        owner: 'Karan Joshi',
        businessValue: 25000000,
        criticality: 'High',
        internetExposure: true,
        dataSensitivity: 'High (PII & Financial)',
        dependencies: ['AST-B01'],
        currentRiskScore: 78,
        financialExposure: 5800000,
        expectedAnnualLoss: 1450000,
        ipOrLocation: '203.0.113.88 / Public Edge Gateway',
        notes: 'Direct internet-facing portal for patient appointments, prescriptions, and lab test results.',
      },
    ];

    const betaVulns = [
      {
        id: 'VULN-B01',
        organization_id: 'org_beta_02',
        cveId: 'CVE-2024-21887',
        name: 'Ivanti Connect Secure Command Injection',
        description: 'Vulnerability in web components allowing unauthenticated remote code execution.',
        cvssScore: 9.1,
        severity: 'Critical',
        exploitability: 'Active Exploit in Wild',
        affectedAssetId: 'AST-B03',
        affectedAssetName: 'Telemedicine Patient Portal API',
        exposure: 'External',
        discoveryDate: '2024-03-01',
        remediationStatus: 'Open',
        remediationCost: 420000,
        riskContribution: 24,
        patchAvailable: true,
      },
    ];

    const orgData: Record<string, OrgCyberData> = {
      org_acme_01: {
        organization_id: 'org_acme_01',
        assets: acmeAssets,
        vulnerabilities: acmeVulns,
        controls: acmeControls,
        threats: acmeThreats,
        incidents: acmeIncidents,
        compliance: acmeCompliance,
        financialProfile: { ...INITIAL_FINANCIAL_PROFILE, organization_id: 'org_acme_01' },
        simulationActions: INITIAL_SIMULATION_ACTIONS.map((s) => ({ ...s, organization_id: 'org_acme_01' })),
        investmentCandidates: INITIAL_INVESTMENT_CANDIDATES.map((i) => ({ ...i, organization_id: 'org_acme_01' })),
      },
      org_beta_02: {
        organization_id: 'org_beta_02',
        assets: betaAssets,
        vulnerabilities: betaVulns,
        controls: [
          {
            id: 'CTL-B01',
            organization_id: 'org_beta_02',
            name: 'Hospital Network Micro-segmentation',
            category: 'Network Defense',
            status: 'Active',
            effectivenessPercent: 80,
            annualCost: 1200000,
            affectedAssetIds: ['AST-B01', 'AST-B02'],
            relatedRisks: ['Ransomware Propagation'],
            owner: 'Karan Joshi',
            coveragePercent: 85,
            description: 'VLAN segmentation separating diagnostic IoT from EHR core databases.',
          },
        ],
        threats: [
          {
            id: 'THREAT-B01',
            organization_id: 'org_beta_02',
            name: 'Medical Ransomware Syndicate (BlackCat/ALPHV)',
            category: 'Ransomware Syndicate',
            likelihood: 'High',
            severity: 'Critical',
            targetAssets: ['AST-B01', 'AST-B02'],
            source: 'Health-ISAC Cyber Advisory',
            firstObserved: '2024-01-10',
            lastObserved: '2024-03-12',
            trend: 'Increasing',
            tactics: ['Double Extortion', 'EHR Encryption', 'Data Exfiltration'],
            mitigationAdvice: 'Maintain air-gapped immutable clinical backups and enforce multi-factor authentication on all telemedicine VPNs.',
          },
        ],
        incidents: [
          {
            id: 'INC-B01',
            organization_id: 'org_beta_02',
            title: 'Diagnostic Imaging Server Port Scan Probing',
            incidentType: 'Unauthorized API Access',
            affectedAssetId: 'AST-B02',
            affectedAssetName: 'Radiology PACS Imaging Server',
            date: '2024-02-28',
            severity: 'Medium',
            downtimeHours: 0,
            dataAffected: 'None',
            recoveryCost: 150000,
            businessLoss: 0,
            regulatoryCost: 0,
            totalFinancialImpact: 150000,
            status: 'Resolved',
            rootCause: 'External IP scanned exposed port 104; firewall rules tightened immediately.',
          },
        ],
        compliance: [
          {
            id: 'CMP-B01',
            organization_id: 'org_beta_02',
            framework: 'ISO/IEC 27001',
            controlId: 'A.12.1.2',
            controlName: 'Change Management for Clinical Systems',
            domain: 'Operations Security',
            status: 'Compliant',
            evidence: 'Weekly CAB logs and medical device change records signed off by Clinical Director.',
            gapAnalysis: 'None',
            remediationPlan: 'Routine review',
            responsibleTeam: 'IT Systems Team',
          },
        ],
        financialProfile: {
          organization_id: 'org_beta_02',
          potentialIncidentLoss: 28000000,
          downtimeCost: 8000000,
          dataBreachCost: 12000000,
          recoveryCost: 4000000,
          regulatoryPenaltyRisk: 3000000,
          reputationalLoss: 1000000,
          totalEstimatedImpact: 28000000,
          expectedAnnualLoss: 4830000,
          assumptions: {
            hourlyDowntimeRate: 250000,
            costPerBreachedRecord: 3200,
            regulatoryCapPercent: 4.0,
            businessDisruptionMultiplier: 1.2,
          },
        },
        simulationActions: INITIAL_SIMULATION_ACTIONS.map((s) => ({ ...s, organization_id: 'org_beta_02' })),
        investmentCandidates: INITIAL_INVESTMENT_CANDIDATES.map((i) => ({ ...i, organization_id: 'org_beta_02' })),
      },
    };

    return {
      organizations,
      users,
      invitations,
      auditLogs,
      orgData,
      passwordResets: [],
      aiRecommendations: {},
      aiQueryLogs: {},
    };
  }

  // --- Organizations ---
  public getOrganizations(): OrganizationRecord[] {
    return this.data.organizations;
  }

  public getOrganizationById(orgId: string): OrganizationRecord | undefined {
    return this.data.organizations.find((o) => o.organization_id === orgId);
  }

  public createOrganization(record: OrganizationRecord): void {
    this.data.organizations.push(record);
    // Initialize empty cybersecurity data bucket for the new tenant
    this.data.orgData[record.organization_id] = {
      organization_id: record.organization_id,
      assets: [],
      vulnerabilities: [],
      controls: [],
      threats: [],
      incidents: [],
      compliance: [],
      financialProfile: {
        organization_id: record.organization_id,
        potentialIncidentLoss: 15000000,
        downtimeCost: 3500000,
        dataBreachCost: 6500000,
        recoveryCost: 2500000,
        regulatoryPenaltyRisk: 1500000,
        reputationalLoss: 1000000,
        totalEstimatedImpact: 15000000,
        expectedAnnualLoss: 2800000,
        assumptions: {
          hourlyDowntimeRate: 350000,
          costPerBreachedRecord: 4200,
          regulatoryCapPercent: 4.0,
          businessDisruptionMultiplier: 1.3,
        },
      },
      simulationActions: INITIAL_SIMULATION_ACTIONS.map((s) => ({ ...s, organization_id: record.organization_id })),
      investmentCandidates: INITIAL_INVESTMENT_CANDIDATES.map((i) => ({ ...i, organization_id: record.organization_id })),
    };
    this.save();
  }

  public updateOrganization(orgId: string, updates: Partial<OrganizationRecord>): OrganizationRecord | null {
    const org = this.getOrganizationById(orgId);
    if (!org) return null;
    if (updates.organization_name) org.organization_name = updates.organization_name;
    if (updates.industry) org.industry = updates.industry;
    if (updates.status) org.status = updates.status;
    this.save();
    return org;
  }

  // --- Users ---
  public getUsers(): UserRecord[] {
    return this.data.users;
  }

  public getUsersByOrg(orgId: string): UserRecord[] {
    return this.data.users.filter((u) => u.organization_id === orgId);
  }

  public getUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(userId: string): UserRecord | undefined {
    return this.data.users.find((u) => u.user_id === userId);
  }

  public getUserByAuthUid(uid: string): UserRecord | undefined {
    return this.data.users.find((u) => u.authentication_uid === uid);
  }

  public createUser(user: UserRecord): void {
    this.data.users.push(user);
    this.save();
  }

  public updateUserRole(userId: string, newRole: any): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;
    user.role = newRole;
    this.save();
    return true;
  }

  public updateUserStatus(userId: string, newStatus: any): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;
    user.status = newStatus;
    this.save();
    return true;
  }

  public updateUserPassword(userId: string, newHash: string): boolean {
    const user = this.getUserById(userId);
    if (!user) return false;
    user.password_hash = newHash;
    this.save();
    return true;
  }

  public updateLastLogin(userId: string): void {
    const user = this.getUserById(userId);
    if (user) {
      user.last_login = new Date().toISOString();
      this.save();
    }
  }

  // --- Invitations ---
  public getInvitationsByOrg(orgId: string): InvitationRecord[] {
    return this.data.invitations.filter((i) => i.organization_id === orgId);
  }

  public getInvitationByToken(token: string): InvitationRecord | undefined {
    return this.data.invitations.find((i) => i.token === token);
  }

  public createInvitation(invite: InvitationRecord): void {
    this.data.invitations.push(invite);
    this.save();
  }

  public updateInvitationStatus(invitationId: string, status: any): boolean {
    const inv = this.data.invitations.find((i) => i.invitation_id === invitationId);
    if (!inv) return false;
    inv.status = status;
    this.save();
    return true;
  }

  // --- Audit Logs (Immutable) ---
  public appendAuditLog(log: AuditLogRecord): void {
    this.data.auditLogs.unshift(log); // newest first
    this.save();
  }

  public getAuditLogsByOrg(orgId: string): AuditLogRecord[] {
    return this.data.auditLogs.filter((a) => a.organization_id === orgId);
  }

  // --- Password Resets ---
  public createPasswordReset(email: string, token: string, expires_at: string): void {
    this.data.passwordResets = this.data.passwordResets.filter((p) => p.email !== email);
    this.data.passwordResets.push({ email, token, expires_at });
    this.save();
  }

  public getPasswordReset(token: string) {
    return this.data.passwordResets.find((p) => p.token === token);
  }

  public removePasswordReset(token: string): void {
    this.data.passwordResets = this.data.passwordResets.filter((p) => p.token !== token);
    this.save();
  }

  // --- Multi-Tenant Cybersecurity Data Isolation ---
  public getOrgData(orgId: string): OrgCyberData {
    if (!this.data.orgData[orgId]) {
      this.data.orgData[orgId] = {
        organization_id: orgId,
        assets: [],
        vulnerabilities: [],
        controls: [],
        threats: [],
        incidents: [],
        compliance: [],
        financialProfile: {
          organization_id: orgId,
          potentialIncidentLoss: 0,
          downtimeCost: 0,
          dataBreachCost: 0,
          recoveryCost: 0,
          regulatoryPenaltyRisk: 0,
          reputationalLoss: 0,
          totalEstimatedImpact: 0,
          expectedAnnualLoss: 0,
          assumptions: {
            hourlyDowntimeRate: 350000,
            costPerBreachedRecord: 4200,
            regulatoryCapPercent: 4.0,
            businessDisruptionMultiplier: 1.3,
          },
        },
        simulationActions: INITIAL_SIMULATION_ACTIONS.map((s) => ({ ...s, organization_id: orgId })),
        investmentCandidates: INITIAL_INVESTMENT_CANDIDATES.map((i) => ({ ...i, organization_id: orgId })),
      };
      this.save();
    }
    return this.data.orgData[orgId];
  }

  public saveOrgData(orgId: string, updates: Partial<OrgCyberData>): void {
    const current = this.getOrgData(orgId);
    this.data.orgData[orgId] = {
      ...current,
      ...updates,
      organization_id: orgId, // enforce immutable orgId
    };
    this.save();
  }

  // --- Explainable AI Recommendations Persistence (Multi-Tenant) ---
  public getAiRecommendations(orgId: string): AiRecommendationRecord[] {
    if (!this.data.aiRecommendations) {
      this.data.aiRecommendations = {};
    }
    return this.data.aiRecommendations[orgId] || [];
  }

  public saveAiRecommendations(orgId: string, recs: AiRecommendationRecord[]): void {
    if (!this.data.aiRecommendations) {
      this.data.aiRecommendations = {};
    }
    const existing = this.data.aiRecommendations[orgId] || [];
    // Merge by recommendation_id
    const map = new Map<string, AiRecommendationRecord>();
    existing.forEach((r) => map.set(r.recommendation_id, r));
    recs.forEach((r) => {
      // Retain existing user status/action if already reviewed
      if (map.has(r.recommendation_id)) {
        const prev = map.get(r.recommendation_id)!;
        map.set(r.recommendation_id, {
          ...r,
          status: prev.status !== 'New' ? prev.status : r.status,
          user_action: prev.user_action || r.user_action,
          reviewed_by: prev.reviewed_by || r.reviewed_by,
          reviewed_at: prev.reviewed_at || r.reviewed_at,
          simulatedEal: prev.simulatedEal ?? r.simulatedEal,
          simulatedDifference: prev.simulatedDifference ?? r.simulatedDifference,
          simulatedReductionPercent: prev.simulatedReductionPercent ?? r.simulatedReductionPercent,
          simulationExplanation: prev.simulationExplanation || r.simulationExplanation,
        });
      } else {
        map.set(r.recommendation_id, r);
      }
    });
    this.data.aiRecommendations[orgId] = Array.from(map.values());
    this.save();
  }

  public updateAiRecommendationStatus(
    orgId: string,
    recId: string,
    status: AiRecommendationRecord['status'],
    userAction?: string,
    reviewedBy?: string
  ): AiRecommendationRecord | null {
    if (!this.data.aiRecommendations) {
      this.data.aiRecommendations = {};
    }
    const recs = this.data.aiRecommendations[orgId] || [];
    const target = recs.find((r) => r.recommendation_id === recId);
    if (!target) return null;

    target.status = status;
    if (userAction) target.user_action = userAction;
    if (reviewedBy) target.reviewed_by = reviewedBy;
    target.reviewed_at = new Date().toISOString();
    this.save();
    return target;
  }

  public updateAiRecommendationSimulation(
    orgId: string,
    recId: string,
    simResult: {
      simulatedEal: number;
      simulatedDifference: number;
      simulatedReductionPercent: number;
      simulationExplanation: string;
      scenarioActionId?: string;
    }
  ): AiRecommendationRecord | null {
    if (!this.data.aiRecommendations) {
      this.data.aiRecommendations = {};
    }
    const recs = this.data.aiRecommendations[orgId] || [];
    const target = recs.find((r) => r.recommendation_id === recId);
    if (!target) return null;

    target.status = 'Simulated';
    target.simulatedEal = simResult.simulatedEal;
    target.simulatedDifference = simResult.simulatedDifference;
    target.simulatedReductionPercent = simResult.simulatedReductionPercent;
    target.simulationExplanation = simResult.simulationExplanation;
    if (simResult.scenarioActionId) target.scenarioActionId = simResult.scenarioActionId;
    this.save();
    return target;
  }

  // --- AI Query Audit Logging ---
  public logAiQuery(log: AiQueryLogRecord): void {
    if (!this.data.aiQueryLogs) {
      this.data.aiQueryLogs = {};
    }
    if (!this.data.aiQueryLogs[log.organization_id]) {
      this.data.aiQueryLogs[log.organization_id] = [];
    }
    this.data.aiQueryLogs[log.organization_id].unshift(log);
    // Keep last 100 queries
    if (this.data.aiQueryLogs[log.organization_id].length > 100) {
      this.data.aiQueryLogs[log.organization_id].pop();
    }
    this.save();
  }

  public getAiQueryLogs(orgId: string): AiQueryLogRecord[] {
    if (!this.data.aiQueryLogs) {
      this.data.aiQueryLogs = {};
    }
    return this.data.aiQueryLogs[orgId] || [];
  }
}

export const db = new DatabaseStore();
