import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Building2,
  User,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const {
    login,
    registerWithInvite,
    createOrganization,
    forgotPassword,
    resetPassword,
    error,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<
    'login' | 'create-org' | 'accept-invite' | 'forgot-password' | 'reset-password'
  >('login');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('ciso@acmefinancial.in');
  const [password, setPassword] = useState('Cyber@2026!');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState('Financial Services');
  const [inviteToken, setInviteToken] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Check URL query parameters on mount (e.g. /accept-invite?token=xyz)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setInviteToken(tokenParam);
      setMode('accept-invite');
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    clearError();
    try {
      await login(email, password);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    clearError();
    try {
      await createOrganization({
        organization_name: orgName,
        industry,
        full_name: fullName,
        email,
        password,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    clearError();
    try {
      await registerWithInvite(inviteToken, fullName, password);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    clearError();
    try {
      const res = await forgotPassword(email);
      setSuccessMsg(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch {
      // error handled by context
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    clearError();
    try {
      const res = await resetPassword(resetToken, newPassword);
      setSuccessMsg(res.message);
      setTimeout(() => {
        setMode('login');
      }, 2000);
    } catch {
      // error handled
    } finally {
      setLoading(false);
    }
  };

  const prefillTestUser = (testEmail: string) => {
    setEmail(testEmail);
    setPassword('Cyber@2026!');
    clearError();
  };

  return (
    <div
      id="login-page"
      className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden"
    >
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <header className="px-6 py-5 border-b border-slate-900 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">CYBERRISKIQ</span>
            <span className="ml-2 text-[10px] font-semibold tracking-wide bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
              ENTERPRISE PLATFORM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Multi-Tenant Enterprise Security Model</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Left: Value Proposition */}
          <div className="p-8 sm:p-10 bg-linear-to-b from-slate-900 to-slate-950 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                <ShieldCheck className="w-3.5 h-3.5" /> Tenant-Isolated Risk Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Translate Cyber Risk into <span className="text-blue-400">Financial Impact</span>.
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Move beyond arbitrary Low/Medium/High matrices. Quantify Expected Annual Loss (ALE), simulate what-if remediation scenarios, and optimize cybersecurity budgets with strict role-based access control.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>Organization Isolation:</strong> Dedicated cryptographic tenant data boundaries.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>Enforced RBAC:</strong> CISO, CRO, Security Analyst, Architect, and Admin governance.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300">
                    <strong>Immutable Audit Trail:</strong> Append-only chronological tracking of all mutations.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 text-[11px] text-slate-400">
              <span>100% Software Architecture • SEBI CSCRF / RBI Master Direction Compliant</span>
            </div>
          </div>

          {/* Right: Real Auth Forms */}
          <div className="p-8 sm:p-10 flex flex-col justify-center">
            {/* Mode Tabs */}
            <div className="flex border-b border-slate-800 mb-6 pb-2">
              <button
                onClick={() => {
                  setMode('login');
                  clearError();
                  setSuccessMsg(null);
                }}
                className={`flex-1 text-center py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                  mode === 'login'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode('create-org');
                  clearError();
                  setSuccessMsg(null);
                }}
                className={`flex-1 text-center py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                  mode === 'create-org'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Org
              </button>
              <button
                onClick={() => {
                  setMode('accept-invite');
                  clearError();
                  setSuccessMsg(null);
                }}
                className={`flex-1 text-center py-2 text-xs font-semibold border-b-2 cursor-pointer transition-colors ${
                  mode === 'accept-invite'
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Redeem Invite
              </button>
            </div>

            {/* Error and Success Notices */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 1. SIGN IN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ciso@acmefinancial.in"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot-password')}
                      className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Pre-configured Demo Accounts for Rapid Evaluation */}
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                    Quick Evaluator Identities (Acme Financial)
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => prefillTestUser('ciso@acmefinancial.in')}
                      className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-left cursor-pointer truncate"
                    >
                      🔐 CISO (Vikramaditya)
                    </button>
                    <button
                      type="button"
                      onClick={() => prefillTestUser('cro@acmefinancial.in')}
                      className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-left cursor-pointer truncate"
                    >
                      📊 CRO (Aishwarya)
                    </button>
                    <button
                      type="button"
                      onClick={() => prefillTestUser('analyst@acmefinancial.in')}
                      className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-left cursor-pointer truncate"
                    >
                      🛡️ Analyst (Ananya)
                    </button>
                    <button
                      type="button"
                      onClick={() => prefillTestUser('admin@acmefinancial.in')}
                      className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-left cursor-pointer truncate"
                    >
                      ⚙️ Admin (Rajeshwari)
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 2. CREATE ORGANIZATION FORM */}
            {mode === 'create-org' && (
              <form onSubmit={handleCreateOrgSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Organization Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Apex Global Banking Corp"
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Financial Services">Financial Services</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Technology">Technology</option>
                    <option value="Retail & E-commerce">Retail & E-commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Administrator Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Anand Mahindra"
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@apexbank.in"
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Secure Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <span>{loading ? 'Bootstrapping...' : 'Create Organization'}</span>
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 3. ACCEPT INVITATION FORM */}
            {mode === 'accept-invite' && (
              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Invitation Token
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={inviteToken}
                      onChange={(e) => setInviteToken(e.target.value)}
                      placeholder="Paste invitation token"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white font-mono placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Sanjana Rao"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  <span>{loading ? 'Redeeming...' : 'Accept Invitation & Enter'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 4. FORGOT PASSWORD */}
            {mode === 'forgot-password' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enter your corporate email address to receive a secure password reset token.
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                {resetToken && (
                  <div className="p-3 bg-slate-800 rounded-lg text-xs space-y-1">
                    <span className="text-slate-400 font-medium">Demo Reset Token:</span>
                    <div className="font-mono text-emerald-400 select-all break-all">{resetToken}</div>
                    <button
                      type="button"
                      onClick={() => setMode('reset-password')}
                      className="text-blue-400 hover:underline pt-1 inline-block"
                    >
                      Proceed to Reset Password →
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="flex-1 py-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Back to Sign In
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    {loading ? 'Sending...' : 'Request Token'}
                  </button>
                </div>
              </form>
            )}

            {/* 5. RESET PASSWORD */}
            {mode === 'reset-password' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Reset Token</label>
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-950 text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  {loading ? 'Updating...' : 'Save New Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-900 text-center text-xs text-slate-500 z-10">
        CYBERRISKIQ Enterprise Edition • AI-Powered Continuous Cyber Risk Quantification & Investment Optimization
      </footer>
    </div>
  );
};
