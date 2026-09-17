/**
 * Engine 1: Data Ingestion & Storage Service
 * Handles persistence, CRUD operations, format conversions, and state resets.
 */

import {
  Asset,
  Vulnerability,
  SecurityControl,
  ThreatIntelligence,
  SecurityIncident,
  FinancialExposureProfile,
  ComplianceItem
} from '../types/cyberrisk';
import {
  INITIAL_ASSETS,
  INITIAL_VULNERABILITIES,
  INITIAL_CONTROLS,
  INITIAL_THREATS,
  INITIAL_INCIDENTS,
  INITIAL_COMPLIANCE_ITEMS,
  INITIAL_FINANCIAL_PROFILE
} from '../data/demoData';

const STORAGE_KEY_PREFIX = 'cyberriskiq_v1_';

export class DataIngestionEngine {
  public static loadAssets(): Asset[] {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}assets`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_ASSETS;
  }

  public static saveAssets(assets: Asset[]): void {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}assets`, JSON.stringify(assets));
  }

  public static loadVulnerabilities(): Vulnerability[] {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}vulnerabilities`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_VULNERABILITIES;
  }

  public static saveVulnerabilities(vulnerabilities: Vulnerability[]): void {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}vulnerabilities`, JSON.stringify(vulnerabilities));
  }

  public static loadControls(): SecurityControl[] {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}controls`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_CONTROLS;
  }

  public static saveControls(controls: SecurityControl[]): void {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}controls`, JSON.stringify(controls));
  }

  public static loadThreats(): ThreatIntelligence[] {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}threats`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_THREATS;
  }

  public static saveThreats(threats: ThreatIntelligence[]): void {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}threats`, JSON.stringify(threats));
  }

  public static loadIncidents(): SecurityIncident[] {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}incidents`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_INCIDENTS;
  }

  public static saveIncidents(incidents: SecurityIncident[]): void {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}incidents`, JSON.stringify(incidents));
  }

  public static loadCompliance(): ComplianceItem[] {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}compliance`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_COMPLIANCE_ITEMS;
  }

  public static loadFinancialProfile(): FinancialExposureProfile {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}financial_profile`);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return INITIAL_FINANCIAL_PROFILE;
  }

  public static saveFinancialProfile(profile: FinancialExposureProfile): void {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}financial_profile`, JSON.stringify(profile));
  }

  public static resetAllToDefaults(): void {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}assets`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}vulnerabilities`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}controls`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}threats`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}incidents`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}compliance`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}financial_profile`);
  }

  public static exportFullDatasetJson(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      organization: 'Acme Financial Services',
      assets: this.loadAssets(),
      vulnerabilities: this.loadVulnerabilities(),
      controls: this.loadControls(),
      threats: this.loadThreats(),
      incidents: this.loadIncidents(),
      compliance: this.loadCompliance(),
      financialProfile: this.loadFinancialProfile()
    };
    return JSON.stringify(data, null, 2);
  }
}
