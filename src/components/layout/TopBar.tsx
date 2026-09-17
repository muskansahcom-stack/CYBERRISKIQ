import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Building2,
  ChevronDown,
  LogOut,
  ShieldAlert,
  AlertCircle,
  ExternalLink,
  Shield,
  KeyRound,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onToggleMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange,
  onNavigateTab,
}) => {
  const { user, logout, demoLogin } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDemoAuthModal, setShowDemoAuthModal] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Critical CVE-2024-3400 Exploited',
      desc: 'Active weaponization targeting Payment Gateway Server Cluster.',
      time: '12m ago',
      type: 'critical',
      actionTab: 'vulnerabilities',
    },
    {
      id: 'notif-2',
      title: 'DDoS Traffic Spike Mitigated',
      desc: 'Edge WAF absorbed 480 Gbps HTTP/2 flood on Mobile Banking API.',
      time: '2h ago',
      type: 'warning',
      actionTab: 'incidents',
    },
    {
      id: 'notif-3',
      title: 'RBI IT Compliance Review Due',
      desc: 'Q3 statutory cyber resilience audit checklist ready for review.',
      time: '1d ago',
      type: 'info',
      actionTab: 'compliance',
    },
  ];

  const demoAccounts = [
    {
      role: 'Organization Administrator',
      email: 'admin@acmefinancial.in',
      name: 'Rajeshwari Iyer',
      org: 'Acme Financial Services',
    },
    {
      role: 'Chief Information Security Officer (CISO)',
      email: 'ciso@acmefinancial.in',
      name: 'Vikramaditya Singhania',
      org: 'Acme Financial Services',
    },
    {
      role: 'Chief Risk Officer (CRO)',
      email: 'cro@acmefinancial.in',
      name: 'Aishwarya Krishnamurthy',
      org: 'Acme Financial Services',
    },
    {
      role: 'Security Analyst',
      email: 'analyst@acmefinancial.in',
      name: 'Ananya Deshmukh',
      org: 'Acme Financial Services',
    },
    {
      role: 'Security Architect',
      email: 'architect@acmefinancial.in',
      name: 'Devraj Sengupta',
      org: 'Acme Financial Services',
    },
    {
      role: 'Organization Administrator (Beta Healthcare)',
      email: 'admin@betahealthcare.org',
      name: 'Dr. Sunita Patel',
      org: 'Beta Healthcare Systems',
    },
  ];

  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4"
    >
      {/* Left: Mobile hamburger & Organization selector */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          id="mobile-menu-toggle"
          onClick={onToggleMobileSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 max-w-[280px] sm:max-w-xs">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.organization_name || 'Organization'}
              </span>
              <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 font-mono">
                {user?.organization_id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search assets, CVEs, security controls, or incidents..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications & Authenticated User Display */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </button>

          {showNotifications && (
            <div
              id="notifications-dropdown"
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Security Alerts & Telemetry
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  3 New
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onNavigateTab(n.actionTab);
                      setShowNotifications(false);
                    }}
                    className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      {n.type === 'critical' ? (
                        <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-1">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-center">
                <button
                  onClick={() => {
                    onNavigateTab('incidents');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                >
                  View All Security Incidents <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current Authenticated User Display */}
        <div className="relative">
          <button
            id="user-profile-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div className="hidden lg:block text-left max-w-xs">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight truncate">
                {user?.full_name}
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium leading-tight truncate">
                {user?.role} • {user?.organization_name}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <div
              id="user-menu-dropdown"
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50"
            >
              {/* Authenticated Identity Details */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {user?.full_name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.email}</p>
                <div className="pt-1 flex flex-col gap-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                    <Shield className="w-3 h-3" /> {user?.role}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    UID: {user?.authentication_uid}
                  </span>
                </div>
              </div>

              {/* Presentation Demo Switcher - Clearly labeled */}
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowDemoAuthModal(true);
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Switch Test Account
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    DEMO
                  </span>
                </button>
              </div>

              {/* Sign Out */}
              <div className="pt-1 px-2">
                <button
                  id="user-logout-btn"
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out of Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Demo Switch Modal */}
      {showDemoAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30 mb-1">
                  DEMO MODE — NOT REAL AUTHORIZATION
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Select Pre-Configured Test Identity
                </h3>
              </div>
              <button
                onClick={() => setShowDemoAuthModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              This initiates a real, cryptographically authenticated session with that user's database credentials to inspect tenant isolation and role restrictions.
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={async () => {
                    await demoLogin(acc.email, acc.role as any);
                    setShowDemoAuthModal(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors flex flex-col gap-0.5 cursor-pointer ${
                    user?.email === acc.email
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{acc.name}</span>
                    <span className="text-[10px] text-slate-400">{acc.org}</span>
                  </div>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{acc.role}</span>
                  <span className="text-[10px] font-mono text-slate-400">{acc.email}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDemoAuthModal(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
