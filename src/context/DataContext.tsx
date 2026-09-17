/**
 * Data Context & Global State Management
 * Connects the tenant-isolated backend store and FAIR risk quantification engines to the React UI.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Asset,
  Vulnerability,
  SecurityControl,
  ThreatIntelligence,
  SecurityIncident,
  ComplianceItem,
  FinancialExposureProfile,
  SimulationAction,
  InvestmentCandidate,
  DefensibleFinancialAssumptions,
  HistoricalRiskSnapshot,
  RiskAttributionItem,
  BusinessUnitAggregation,
  MonteCarloSimulationResult,
} from '../types/cyberrisk';
import { useAuth } from './AuthContext';
import { apiClient } from '../services/apiClient';
import { RiskQuantificationEngine } from '../services/riskQuantificationEngine';
import { DefensibleFinancialEngine } from '../services/defensibleFinancialEngine';
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
} from '../data/demoData';
import { DEFAULT_FINANCIAL_ASSUMPTIONS, INITIAL_HISTORICAL_SNAPSHOTS } from '../data/defensibleAssumptions';

interface DataContextType {
  assets: Asset[];
  vulnerabilities: Vulnerability[];
  controls: SecurityControl[];
  threats: ThreatIntelligence[];
  incidents: SecurityIncident[];
  compliance: ComplianceItem[];
  financialProfile: FinancialExposureProfile;
  simulationActions: SimulationAction[];
  investmentCandidates: InvestmentCandidate[];
  isLoadingData: boolean;

  // Phase 3: Defensible Financial State & Analytics
  defensibleAssumptions: DefensibleFinancialAssumptions;
  historicalSnapshots: HistoricalRiskSnapshot[];
  topRiskContributors: RiskAttributionItem[];
  businessUnitAggregations: BusinessUnitAggregation[];
  varMetrics: { var90: number; var95: number; var99: number };

  // Derived metrics
  enterpriseRiskScore: number;
  totalFinancialExposure: number;
  totalExpectedAnnualLoss: number;
  criticalAssetsCount: number;
  criticalVulnsCount: number;
  openVulnsCount: number;
  avgControlEffectiveness: number;

  // Actions
  addAsset: (asset: Omit<Asset, 'id'>) => Promise<void>;
  updateAsset: (id: string, updated: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;

  addVulnerability: (vuln: Omit<Vulnerability, 'id'>) => Promise<void>;
  updateVulnerability: (id: string, updated: Partial<Vulnerability>) => Promise<void>;
  deleteVulnerability: (id: string) => Promise<void>;

  toggleSimulationAction: (actionId: string) => Promise<void>;
  updateSimulationBudget: (budget: number) => void;
  simulationBudget: number;

  updateFinancialAssumptions: (assumptions: FinancialExposureProfile['assumptions']) => Promise<void>;
  updateDefensibleAssumptions: (assumptions: Partial<DefensibleFinancialAssumptions>) => Promise<void>;
  runMonteCarlo: (assetId?: string, iterations?: number) => Promise<MonteCarloSimulationResult>;
  resetToDefaultData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(INITIAL_VULNERABILITIES);
  const [controls, setControls] = useState<SecurityControl[]>(INITIAL_CONTROLS);
  const [threats, setThreats] = useState<ThreatIntelligence[]>(INITIAL_THREATS);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [compliance, setCompliance] = useState<ComplianceItem[]>(INITIAL_COMPLIANCE_ITEMS);
  const [financialProfile, setFinancialProfile] = useState<FinancialExposureProfile>(INITIAL_FINANCIAL_PROFILE);
  const [simulationActions, setSimulationActions] = useState<SimulationAction[]>(INITIAL_SIMULATION_ACTIONS);
  const [investmentCandidates, setInvestmentCandidates] = useState<InvestmentCandidate[]>(INITIAL_INVESTMENT_CANDIDATES);
  const [simulationBudget, setSimulationBudget] = useState<number>(10000000); // ₹1 Crore
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Phase 3: Defensible Financial State
  const [defensibleAssumptions, setDefensibleAssumptions] = useState<DefensibleFinancialAssumptions>(DEFAULT_FINANCIAL_ASSUMPTIONS);
  const [historicalSnapshots, setHistoricalSnapshots] = useState<HistoricalRiskSnapshot[]>(INITIAL_HISTORICAL_SNAPSHOTS);

  // Fetch tenant data whenever authenticated user or organization changes
  const refreshData = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    setIsLoadingData(true);
    try {
      const [
        assetsRes,
        vulnsRes,
        controlsRes,
        threatsRes,
        incidentsRes,
        compRes,
        finRes,
        simRes,
        invRes,
        assumpRes,
        histRes,
      ] = await Promise.all([
        apiClient.getAssets().catch(() => ({ assets: [] })),
        apiClient.getVulnerabilities().catch(() => ({ vulnerabilities: [] })),
        apiClient.getControls().catch(() => ({ controls: [] })),
        apiClient.getThreats().catch(() => ({ threats: [] })),
        apiClient.getIncidents().catch(() => ({ incidents: [] })),
        apiClient.getCompliance().catch(() => ({ compliance: [] })),
        apiClient.getFinancialProfile().catch(() => ({ financialProfile: INITIAL_FINANCIAL_PROFILE })),
        apiClient.getSimulationActions().catch(() => ({ simulationActions: INITIAL_SIMULATION_ACTIONS })),
        apiClient.getInvestmentCandidates().catch(() => ({ investmentCandidates: INITIAL_INVESTMENT_CANDIDATES })),
        apiClient.getDefensibleAssumptions().catch(() => ({ assumptions: DEFAULT_FINANCIAL_ASSUMPTIONS })),
        apiClient.getHistoricalSnapshots().catch(() => ({ snapshots: INITIAL_HISTORICAL_SNAPSHOTS })),
      ]);

      if (assetsRes.assets && assetsRes.assets.length > 0) setAssets(assetsRes.assets);
      else setAssets([]);

      if (vulnsRes.vulnerabilities && vulnsRes.vulnerabilities.length > 0) setVulnerabilities(vulnsRes.vulnerabilities);
      else setVulnerabilities([]);

      if (controlsRes.controls && controlsRes.controls.length > 0) setControls(controlsRes.controls);
      else setControls([]);

      if (threatsRes.threats && threatsRes.threats.length > 0) setThreats(threatsRes.threats);
      else setThreats([]);

      if (incidentsRes.incidents && incidentsRes.incidents.length > 0) setIncidents(incidentsRes.incidents);
      else setIncidents([]);

      if (compRes.compliance && compRes.compliance.length > 0) setCompliance(compRes.compliance);
      else setCompliance([]);

      if (finRes.financialProfile) setFinancialProfile(finRes.financialProfile);
      if (simRes.simulationActions) setSimulationActions(simRes.simulationActions);
      if (invRes.investmentCandidates) setInvestmentCandidates(invRes.investmentCandidates);
      if (assumpRes.assumptions) setDefensibleAssumptions(assumpRes.assumptions);
      if (histRes.snapshots && histRes.snapshots.length > 0) setHistoricalSnapshots(histRes.snapshots);
    } catch (err) {
      console.error('Error fetching tenant-isolated data:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [isAuthenticated, user?.organization_id]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Derived metrics recalculated dynamically
  const enterpriseRiskScore = useMemo(() => {
    if (assets.length === 0) return 0;
    return RiskQuantificationEngine.calculateEnterpriseRiskScore(assets);
  }, [assets]);

  const totalFinancialExposure = useMemo(() => {
    if (assets.length === 0) return 0;
    return RiskQuantificationEngine.calculateTotalFinancialExposure(assets);
  }, [assets]);

  const totalExpectedAnnualLoss = useMemo(() => {
    if (assets.length === 0) return 0;
    return RiskQuantificationEngine.calculateTotalExpectedAnnualLoss(assets);
  }, [assets]);

  const criticalAssetsCount = useMemo(() => {
    return assets.filter((a) => a.criticality === 'Critical').length;
  }, [assets]);

  const criticalVulnsCount = useMemo(() => {
    return vulnerabilities.filter((v) => v.severity === 'Critical').length;
  }, [vulnerabilities]);

  const openVulnsCount = useMemo(() => {
    return vulnerabilities.filter((v) => v.remediationStatus === 'Open' || v.remediationStatus === 'In Progress').length;
  }, [vulnerabilities]);

  const avgControlEffectiveness = useMemo(() => {
    if (controls.length === 0) return 0;
    const sum = controls.reduce((acc, c) => acc + c.effectivenessPercent, 0);
    return Math.round(sum / controls.length);
  }, [controls]);

  // Phase 3: Actuarial Defensible Risk Attribution and Business Unit Aggregation
  const { items: topRiskContributors } = useMemo(() => {
    return DefensibleFinancialEngine.calculateRiskAttributions(
      assets,
      vulnerabilities,
      controls,
      incidents,
      defensibleAssumptions
    );
  }, [assets, vulnerabilities, controls, incidents, defensibleAssumptions]);

  const businessUnitAggregations = useMemo(() => {
    return DefensibleFinancialEngine.calculateBusinessUnitAggregations(
      assets,
      vulnerabilities,
      controls,
      incidents,
      defensibleAssumptions
    );
  }, [assets, vulnerabilities, controls, incidents, defensibleAssumptions]);

  const varMetrics = useMemo(() => {
    return DefensibleFinancialEngine.calculateVaR(totalExpectedAnnualLoss, totalFinancialExposure);
  }, [totalExpectedAnnualLoss, totalFinancialExposure]);

  // Actions wired to API
  const addAsset = async (newAssetData: Omit<Asset, 'id'>) => {
    try {
      const res = await apiClient.createAsset(newAssetData);
      setAssets((prev) => [...prev, res.asset]);
    } catch (err: any) {
      alert(`Failed to create asset: ${err.message}`);
    }
  };

  const updateAsset = async (id: string, updated: Partial<Asset>) => {
    try {
      const res = await apiClient.updateAsset(id, updated);
      setAssets((prev) => prev.map((a) => (a.id === id ? res.asset : a)));
    } catch (err: any) {
      alert(`Failed to update asset: ${err.message}`);
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await apiClient.deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(`Failed to delete asset: ${err.message}`);
    }
  };

  const addVulnerability = async (vulnData: Omit<Vulnerability, 'id'>) => {
    try {
      const res = await apiClient.createVulnerability(vulnData);
      setVulnerabilities((prev) => [...prev, res.vulnerability]);
    } catch (err: any) {
      alert(`Failed to log vulnerability: ${err.message}`);
    }
  };

  const updateVulnerability = async (id: string, updated: Partial<Vulnerability>) => {
    try {
      const res = await apiClient.updateVulnerability(id, updated);
      setVulnerabilities((prev) => prev.map((v) => (v.id === id ? res.vulnerability : v)));
    } catch (err: any) {
      alert(`Failed to update vulnerability: ${err.message}`);
    }
  };

  const deleteVulnerability = async (id: string) => {
    try {
      await apiClient.deleteVulnerability(id);
      setVulnerabilities((prev) => prev.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(`Failed to delete vulnerability: ${err.message}`);
    }
  };

  const toggleSimulationAction = async (actionId: string) => {
    const current = simulationActions.find((a) => a.id === actionId);
    if (!current) return;
    const nextState = !current.enabled;
    try {
      await apiClient.toggleSimulationAction(actionId, nextState);
      setSimulationActions((prev) =>
        prev.map((a) => (a.id === actionId ? { ...a, enabled: nextState } : a))
      );
    } catch {
      // fallback local toggle
      setSimulationActions((prev) =>
        prev.map((a) => (a.id === actionId ? { ...a, enabled: nextState } : a))
      );
    }
  };

  const updateSimulationBudget = (budget: number) => {
    setSimulationBudget(budget);
  };

  const updateFinancialAssumptions = async (assumptions: FinancialExposureProfile['assumptions']) => {
    try {
      const updated = { ...financialProfile, assumptions };
      const res = await apiClient.updateFinancialProfile(updated);
      setFinancialProfile(res.financialProfile);
    } catch (err: any) {
      alert(`Failed to calibrate financial assumptions: ${err.message}`);
    }
  };

  const updateDefensibleAssumptions = async (updates: Partial<DefensibleFinancialAssumptions>) => {
    const updated: DefensibleFinancialAssumptions = {
      ...defensibleAssumptions,
      ...updates,
      lastUpdated: new Date().toISOString(),
      sourceType: 'User Scenario Override',
    };
    setDefensibleAssumptions(updated);
    try {
      await apiClient.updateDefensibleAssumptions(updated);
    } catch (err: any) {
      console.warn('Backend sync failed, updated locally:', err.message);
    }
  };

  const runMonteCarlo = async (assetId?: string, iterations = 2000): Promise<MonteCarloSimulationResult> => {
    try {
      const res = await apiClient.runMonteCarlo(assetId, iterations);
      if (res && res.simulation) return res.simulation;
    } catch (e) {
      console.warn('Backend Monte Carlo endpoint unavailable, calculating in browser engine:', e);
    }
    const targetAsset = assetId ? assets.find((a) => a.id === assetId) : assets[0];
    if (!targetAsset) throw new Error('No target asset found for Monte Carlo simulation.');
    return DefensibleFinancialEngine.runMonteCarloSimulation(
      targetAsset,
      defensibleAssumptions,
      vulnerabilities,
      controls,
      incidents,
      iterations
    );
  };

  const resetToDefaultData = async () => {
    // Reset data for current organization
    await refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        assets,
        vulnerabilities,
        controls,
        threats,
        incidents,
        compliance,
        financialProfile,
        simulationActions,
        investmentCandidates,
        isLoadingData,
        defensibleAssumptions,
        historicalSnapshots,
        topRiskContributors,
        businessUnitAggregations,
        varMetrics,
        enterpriseRiskScore,
        totalFinancialExposure,
        totalExpectedAnnualLoss,
        criticalAssetsCount,
        criticalVulnsCount,
        openVulnsCount,
        avgControlEffectiveness,
        addAsset,
        updateAsset,
        deleteAsset,
        addVulnerability,
        updateVulnerability,
        deleteVulnerability,
        toggleSimulationAction,
        updateSimulationBudget,
        simulationBudget,
        updateFinancialAssumptions,
        updateDefensibleAssumptions,
        runMonteCarlo,
        resetToDefaultData,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
