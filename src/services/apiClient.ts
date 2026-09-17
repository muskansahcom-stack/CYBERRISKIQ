import {
  AuthUser,
  OrganizationInfo,
  ManagedUser,
  Invitation,
  AuditLogItem,
  SecurityTestReport,
  UserRole,
} from '../types/auth';

const TOKEN_STORAGE_KEY = 'cyberriskiq_jwt_token';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data as T;
  }

  // --- Auth Endpoints ---
  public async login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
    const data = await this.request<{ token: string; user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  public async registerWithInvite(
    token: string,
    fullName: string,
    password: string
  ): Promise<{ token: string; user: AuthUser }> {
    const data = await this.request<{ token: string; user: AuthUser }>('/api/auth/register-invite', {
      method: 'POST',
      body: JSON.stringify({ token, full_name: fullName, password }),
    });
    this.setToken(data.token);
    return data;
  }

  public async createOrganization(payload: {
    organization_name: string;
    industry: string;
    full_name: string;
    email: string;
    password: string;
  }): Promise<{ token: string; user: AuthUser }> {
    const data = await this.request<{ token: string; user: AuthUser }>('/api/auth/create-organization', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(data.token);
    return data;
  }

  public async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore network errors on logout
    } finally {
      this.setToken(null);
    }
  }

  public async getMe(): Promise<{ user: AuthUser }> {
    return this.request<{ user: AuthUser }>('/api/auth/me');
  }

  public async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    return this.request<{ message: string; resetToken?: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  public async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // --- Organization & User Management ---
  public async getOrganization(): Promise<{ organization: OrganizationInfo }> {
    return this.request<{ organization: OrganizationInfo }>('/api/organization');
  }

  public async updateOrganization(updates: Partial<OrganizationInfo>): Promise<{ organization: OrganizationInfo }> {
    return this.request<{ organization: OrganizationInfo }>('/api/organization', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async getUsers(): Promise<{ users: ManagedUser[] }> {
    return this.request<{ users: ManagedUser[] }>('/api/organization/users');
  }

  public async updateUserRole(userId: string, role: UserRole): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/organization/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  public async updateUserStatus(userId: string, status: 'Active' | 'Inactive' | 'Suspended'): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/organization/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  public async inviteUser(email: string, role: UserRole, full_name?: string): Promise<{ invitation: Invitation; inviteUrl: string }> {
    return this.request<{ invitation: Invitation; inviteUrl: string }>('/api/organization/invitations', {
      method: 'POST',
      body: JSON.stringify({ email, role, full_name }),
    });
  }

  public async getInvitations(): Promise<{ invitations: Invitation[] }> {
    return this.request<{ invitations: Invitation[] }>('/api/organization/invitations');
  }

  public async revokeInvitation(inviteId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/organization/invitations/${inviteId}`, {
      method: 'DELETE',
    });
  }

  public async getAuditLogs(): Promise<{ auditLogs: AuditLogItem[] }> {
    return this.request<{ auditLogs: AuditLogItem[] }>('/api/organization/audit-logs');
  }

  // --- Cyber Risk Data (Tenant Isolated) ---
  public async getAssets(): Promise<{ assets: any[] }> {
    return this.request<{ assets: any[] }>('/api/data/assets');
  }

  public async createAsset(asset: any): Promise<{ asset: any }> {
    return this.request<{ asset: any }>('/api/data/assets', {
      method: 'POST',
      body: JSON.stringify(asset),
    });
  }

  public async updateAsset(id: string, updates: any): Promise<{ asset: any }> {
    return this.request<{ asset: any }>(`/api/data/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async deleteAsset(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/data/assets/${id}`, {
      method: 'DELETE',
    });
  }

  public async getVulnerabilities(): Promise<{ vulnerabilities: any[] }> {
    return this.request<{ vulnerabilities: any[] }>('/api/data/vulnerabilities');
  }

  public async createVulnerability(vuln: any): Promise<{ vulnerability: any }> {
    return this.request<{ vulnerability: any }>('/api/data/vulnerabilities', {
      method: 'POST',
      body: JSON.stringify(vuln),
    });
  }

  public async updateVulnerability(id: string, updates: any): Promise<{ vulnerability: any }> {
    return this.request<{ vulnerability: any }>(`/api/data/vulnerabilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async deleteVulnerability(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/data/vulnerabilities/${id}`, {
      method: 'DELETE',
    });
  }

  public async getControls(): Promise<{ controls: any[] }> {
    return this.request<{ controls: any[] }>('/api/data/controls');
  }

  public async updateControl(id: string, updates: any): Promise<{ control: any }> {
    return this.request<{ control: any }>(`/api/data/controls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async getThreats(): Promise<{ threats: any[] }> {
    return this.request<{ threats: any[] }>('/api/data/threats');
  }

  public async getIncidents(): Promise<{ incidents: any[] }> {
    return this.request<{ incidents: any[] }>('/api/data/incidents');
  }

  public async createIncident(incident: any): Promise<{ incident: any }> {
    return this.request<{ incident: any }>('/api/data/incidents', {
      method: 'POST',
      body: JSON.stringify(incident),
    });
  }

  public async getCompliance(): Promise<{ compliance: any[] }> {
    return this.request<{ compliance: any[] }>('/api/data/compliance');
  }

  public async getFinancialProfile(): Promise<{ financialProfile: any }> {
    return this.request<{ financialProfile: any }>('/api/data/financial-profile');
  }

  public async updateFinancialProfile(updates: any): Promise<{ financialProfile: any }> {
    return this.request<{ financialProfile: any }>('/api/data/financial-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  public async getSimulationActions(): Promise<{ simulationActions: any[] }> {
    return this.request<{ simulationActions: any[] }>('/api/data/simulation-actions');
  }

  public async toggleSimulationAction(id: string, enabled: boolean): Promise<{ action: any }> {
    return this.request<{ action: any }>(`/api/data/simulation-actions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled }),
    });
  }

  public async getInvestmentCandidates(): Promise<{ investmentCandidates: any[] }> {
    return this.request<{ investmentCandidates: any[] }>('/api/data/investment-candidates');
  }

  // --- Phase 3: Defensible Quantification Endpoints ---
  public async getQuantificationSummary(): Promise<any> {
    return this.request<any>('/api/quantification/summary');
  }

  public async getAssetQuantification(assetId: string): Promise<any> {
    return this.request<any>(`/api/quantification/asset/${assetId}`);
  }

  public async getCalculationTrace(assetId: string): Promise<any> {
    return this.request<any>(`/api/quantification/trace/${assetId}`);
  }

  public async getDefensibleAssumptions(): Promise<{ assumptions: any }> {
    return this.request<{ assumptions: any }>('/api/quantification/assumptions');
  }

  public async updateDefensibleAssumptions(assumptions: any): Promise<{ assumptions: any }> {
    return this.request<{ assumptions: any }>('/api/quantification/assumptions', {
      method: 'PUT',
      body: JSON.stringify(assumptions),
    });
  }

  public async runMonteCarlo(assetId?: string, iterations = 2000): Promise<any> {
    return this.request<any>('/api/quantification/monte-carlo', {
      method: 'POST',
      body: JSON.stringify({ assetId, iterations }),
    });
  }

  public async getHistoricalSnapshots(): Promise<{ snapshots: any[] }> {
    return this.request<{ snapshots: any[] }>('/api/quantification/history');
  }

  // --- Security Test Suite ---
  public async runSecuritySuite(): Promise<SecurityTestReport> {
    return this.request<SecurityTestReport>('/api/test/run-security-suite', {
      method: 'POST',
    });
  }

  // --- Phase 4: Explainable AI Intelligence Endpoints ---
  public async getAiSummary(mode: 'executive' | 'technical' = 'executive'): Promise<any> {
    return this.request<any>(`/api/ai/summary?mode=${mode}`);
  }

  public async getWhyRiskChanged(): Promise<any> {
    return this.request<any>('/api/ai/why-risk-changed');
  }

  public async getTopRiskDrivers(): Promise<any> {
    return this.request<any>('/api/ai/top-risk-drivers');
  }

  public async getAssetRiskExplanation(assetId: string): Promise<any> {
    return this.request<any>(`/api/ai/asset-explanation/${assetId}`);
  }

  public async getAiRecommendations(): Promise<{ recommendations: any[]; baselineEal: number }> {
    return this.request<{ recommendations: any[]; baselineEal: number }>('/api/ai/recommendations');
  }

  public async updateRecommendationStatus(id: string, status: string, userAction?: string): Promise<any> {
    return this.request<any>(`/api/ai/recommendations/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, userAction }),
    });
  }

  public async simulateRecommendation(recommendationId: string, scenarioActionId?: string): Promise<any> {
    return this.request<any>('/api/ai/simulate-recommendation', {
      method: 'POST',
      body: JSON.stringify({ recommendationId, scenarioActionId }),
    });
  }

  public async queryAiIntelligence(query: string, mode: 'executive' | 'technical' = 'executive'): Promise<any> {
    return this.request<any>('/api/ai/query', {
      method: 'POST',
      body: JSON.stringify({ query, mode }),
    });
  }

  public async getAiTraceEvidence(recommendationId?: string, insightId?: string): Promise<any> {
    const params = new URLSearchParams();
    if (recommendationId) params.append('recommendationId', recommendationId);
    if (insightId) params.append('insightId', insightId);
    return this.request<any>(`/api/ai/evidence?${params.toString()}`);
  }

  public async getAiRecommendationHistory(): Promise<{ recommendations: any[]; totalCount: number }> {
    return this.request<{ recommendations: any[]; totalCount: number }>('/api/ai/recommendation-history');
  }
}

export const apiClient = new ApiClient();
