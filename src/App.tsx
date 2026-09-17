import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LoginPage } from './components/auth/LoginPage';
import { DemoNoticeBanner } from './components/layout/DemoNoticeBanner';
import { Sidebar, NavigationTab } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

// Modules
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { TechnicalDashboard } from './components/dashboard/TechnicalDashboard';
import { AssetsModule } from './components/assets/AssetsModule';
import { VulnerabilitiesModule } from './components/vulnerabilities/VulnerabilitiesModule';
import { SecurityControlsModule } from './components/controls/SecurityControlsModule';
import { ThreatIntelligenceModule } from './components/threats/ThreatIntelligenceModule';
import { IncidentsModule } from './components/incidents/IncidentsModule';
import { RiskQuantificationModule } from './components/quantification/RiskQuantificationModule';
import { AiDecisionCenterModule } from './components/ai/AiDecisionCenterModule';
import { ScenarioSimulatorModule } from './components/simulator/ScenarioSimulatorModule';
import { InvestmentOptimizationModule } from './components/optimization/InvestmentOptimizationModule';
import { ComplianceModule } from './components/compliance/ComplianceModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { UserManagementModule } from './components/admin/UserManagementModule';
import { AuditLogsModule } from './components/admin/AuditLogsModule';
import { SecurityVerificationModule } from './components/admin/SecurityVerificationModule';
import { ShieldAlert, Lock } from 'lucide-react';

const AccessDeniedView: React.FC<{ requiredRole: string; userRole: string }> = ({
  requiredRole,
  userRole,
}) => (
  <div className="p-8 max-w-xl mx-auto my-12 bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 shadow-lg text-center space-y-4">
    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
      <Lock className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
      Access Restricted by RBAC Policy
    </h3>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
      Your current role (<strong className="text-slate-700 dark:text-slate-300">{userRole}</strong>) does not have authorization to view this module. This resource requires: <strong className="text-blue-600 dark:text-blue-400">{requiredRole}</strong>.
    </p>
    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-[11px] text-slate-400 font-mono">
      HTTP 403 Forbidden • Permission Violation Logged to Immutable Audit Trail
    </div>
  </div>
);

const MainAppContent: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavigationTab>('executive-dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying cryptographic session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  const role = user.role;

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'executive-dashboard':
        return <ExecutiveDashboard onNavigateTab={setActiveTab} />;
      case 'technical-dashboard':
        return <TechnicalDashboard onNavigateTab={setActiveTab} />;
      case 'assets':
        return <AssetsModule />;
      case 'vulnerabilities':
        return <VulnerabilitiesModule />;
      case 'controls':
        return <SecurityControlsModule />;
      case 'threats':
        return <ThreatIntelligenceModule />;
      case 'incidents':
        return <IncidentsModule />;
      case 'quantification':
        return <RiskQuantificationModule />;
      case 'ai-decision':
        return <AiDecisionCenterModule />;
      case 'scenario-simulator':
        return <ScenarioSimulatorModule />;
      case 'investment-optimization':
        return <InvestmentOptimizationModule />;
      case 'compliance':
        return <ComplianceModule />;
      case 'reports':
        return <ReportsModule />;
      case 'settings':
        return <SettingsModule />;
      case 'user-management':
        if (role !== 'Organization Administrator') {
          return <AccessDeniedView requiredRole="Organization Administrator" userRole={role} />;
        }
        return <UserManagementModule />;
      case 'audit-logs':
        if (role !== 'Organization Administrator') {
          return <AccessDeniedView requiredRole="Organization Administrator" userRole={role} />;
        }
        return <AuditLogsModule />;
      case 'security-verification':
        return <SecurityVerificationModule />;
      default:
        return <ExecutiveDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div id="cyberriskiq-app" className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Disclaimer Banner */}
      <DemoNoticeBanner />

      {/* Main Framework Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopBar
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            searchQuery={globalSearch}
            onSearchChange={setGlobalSearch}
            onNavigateTab={setActiveTab}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveModule()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
