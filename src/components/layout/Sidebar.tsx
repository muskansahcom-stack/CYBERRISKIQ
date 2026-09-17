import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Server,
  Bug,
  ShieldCheck,
  Radio,
  Flame,
  Calculator,
  BrainCircuit,
  SlidersHorizontal,
  TrendingUp,
  FileCheck2,
  FileText,
  Settings,
  Shield,
  ChevronRight,
  Users,
  Lock,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type NavigationTab =
  | 'executive-dashboard'
  | 'technical-dashboard'
  | 'assets'
  | 'vulnerabilities'
  | 'controls'
  | 'threats'
  | 'incidents'
  | 'quantification'
  | 'ai-decision'
  | 'scenario-simulator'
  | 'investment-optimization'
  | 'compliance'
  | 'reports'
  | 'settings'
  | 'user-management'
  | 'audit-logs'
  | 'security-verification';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  category: string;
  adminOnly?: boolean;
  allowedRoles?: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user } = useAuth();
  const userRole = user?.role || 'Organization Administrator';

  const allNavItems: NavItem[] = [
    {
      id: 'executive-dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      category: 'Dashboards',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Chief Risk Officer (CRO)',
      ],
    },
    {
      id: 'technical-dashboard',
      label: 'Technical Risk Overview',
      icon: ShieldAlert,
      category: 'Dashboards',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Security Analyst',
        'Security Architect',
      ],
    },

    {
      id: 'assets',
      label: 'Assets Inventory',
      icon: Server,
      category: 'Cyber Security Posture',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Security Analyst',
        'Security Architect',
      ],
    },
    {
      id: 'vulnerabilities',
      label: 'Vulnerabilities (CVEs)',
      icon: Bug,
      category: 'Cyber Security Posture',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Security Analyst',
        'Security Architect',
      ],
    },
    {
      id: 'controls',
      label: 'Security Controls',
      icon: ShieldCheck,
      category: 'Cyber Security Posture',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Security Analyst',
        'Security Architect',
      ],
    },
    {
      id: 'threats',
      label: 'Threat Intelligence',
      icon: Radio,
      category: 'Cyber Security Posture',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Security Analyst',
        'Security Architect',
      ],
    },
    {
      id: 'incidents',
      label: 'Security Incidents',
      icon: Flame,
      category: 'Cyber Security Posture',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Security Analyst',
        'Security Architect',
      ],
    },

    {
      id: 'quantification',
      label: 'Risk Quantification',
      icon: Calculator,
      badge: 'FAIR',
      category: 'Decision & Financials',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Chief Risk Officer (CRO)',
        'Security Architect',
      ],
    },
    {
      id: 'ai-decision',
      label: 'AI Decision Center',
      icon: BrainCircuit,
      badge: 'AI',
      category: 'Decision & Financials',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Chief Risk Officer (CRO)',
        'Security Architect',
      ],
    },
    {
      id: 'scenario-simulator',
      label: 'Scenario Simulator',
      icon: SlidersHorizontal,
      category: 'Decision & Financials',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Chief Risk Officer (CRO)',
        'Security Architect',
      ],
    },
    {
      id: 'investment-optimization',
      label: 'Investment Optimization',
      icon: TrendingUp,
      category: 'Decision & Financials',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Chief Risk Officer (CRO)',
        'Security Architect',
      ],
    },

    {
      id: 'compliance',
      label: 'Regulatory Compliance',
      icon: FileCheck2,
      category: 'Governance & Reporting',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Chief Risk Officer (CRO)',
        'Security Analyst',
        'Security Architect',
      ],
    },
    {
      id: 'reports',
      label: 'Board Reports & Briefs',
      icon: FileText,
      category: 'Governance & Reporting',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Chief Risk Officer (CRO)',
        'Security Analyst',
        'Security Architect',
      ],
    },

    // Enterprise Administration & Governance
    {
      id: 'user-management',
      label: 'User Management',
      icon: Users,
      category: 'Access & Governance',
      adminOnly: true,
      allowedRoles: ['Organization Administrator'],
    },
    {
      id: 'audit-logs',
      label: 'Immutable Audit Trail',
      icon: Lock,
      category: 'Access & Governance',
      adminOnly: true,
      allowedRoles: ['Organization Administrator'],
    },
    {
      id: 'security-verification',
      label: 'Security & Isolation Tests',
      icon: CheckCircle2,
      badge: '17 Tests',
      category: 'Access & Governance',
      allowedRoles: [
        'Organization Administrator',
        'Chief Information Security Officer (CISO)',
        'Chief Risk Officer (CRO)',
        'Security Architect',
        'Security Analyst',
      ],
    },
    {
      id: 'settings',
      label: 'Organization Settings',
      icon: Settings,
      category: 'Access & Governance',
      allowedRoles: ['Organization Administrator', 'Chief Information Security Officer (CISO)'],
    },
  ];

  // Filter items based on actual role permissions
  const navItems = allNavItems.filter(
    (item) => !item.allowedRoles || item.allowedRoles.includes(userRole)
  );

  const categories = Array.from(new Set(navItems.map((i) => i.category)));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-start gap-3 bg-slate-950/40">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-xs">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-white tracking-tight">CYBERRISKIQ</h1>
              <span className="text-[10px] font-semibold tracking-wide bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono">
                RBAC
              </span>
            </div>
            <p className="text-[11px] leading-tight text-slate-400 line-clamp-2 mt-0.5">
              Financial Cyber Risk Quantification & Investment Optimization
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
          {categories.map((category) => {
            const categoryItems = navItems.filter((i) => i.category === category);
            return (
              <div key={category} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {category}
                </p>
                {categoryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      onClick={() => {
                        onSelectTab(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                              isActive
                                ? 'bg-blue-700 text-blue-100'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="truncate font-semibold text-slate-300">
              {user?.organization_name || 'Organization'}
            </span>
            <span className="text-emerald-400 font-mono text-[10px] shrink-0">ISOLATED</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Role</span>
            <span className="text-blue-400 font-medium truncate max-w-[140px] text-right">
              {user?.role}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
