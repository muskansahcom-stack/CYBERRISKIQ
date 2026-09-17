import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Mail,
  RefreshCw,
  Copy,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';
import { ManagedUser, Invitation, UserRole } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

export const UserManagementModule: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Security Analyst');
  const [inviteFullName, setInviteFullName] = useState('');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Action status message
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const availableRoles: UserRole[] = [
    'Organization Administrator',
    'Chief Information Security Officer (CISO)',
    'Chief Risk Officer (CRO)',
    'Security Analyst',
    'Security Architect',
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, invitesRes] = await Promise.all([
        apiClient.getUsers(),
        apiClient.getInvitations(),
      ]);
      setUsers(usersRes.users || []);
      setInvitations(invitesRes.invitations || []);
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message || 'Failed to load user management data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInviting(true);
    setInviteSuccessMsg(null);
    try {
      const res = await apiClient.inviteUser(inviteEmail, inviteRole, inviteFullName);
      setInviteSuccessMsg('Invitation dispatched successfully');
      setGeneratedInviteLink(`${window.location.origin}${res.inviteUrl}`);
      setInviteEmail('');
      setInviteFullName('');
      loadData();
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message || 'Failed to send invitation.' });
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    if (targetUserId === currentUser?.user_id) {
      alert('Security Rule: You cannot modify your own role.');
      return;
    }
    try {
      await apiClient.updateUserRole(targetUserId, newRole);
      setStatusNotice({ type: 'success', text: `User role updated to ${newRole}.` });
      setUsers((prev) =>
        prev.map((u) => (u.user_id === targetUserId ? { ...u, role: newRole } : u))
      );
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message || 'Failed to update role.' });
    }
  };

  const handleStatusToggle = async (targetUser: ManagedUser) => {
    if (targetUser.user_id === currentUser?.user_id) {
      alert('Security Rule: You cannot deactivate your own account.');
      return;
    }
    const nextStatus = targetUser.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await apiClient.updateUserStatus(targetUser.user_id, nextStatus);
      setStatusNotice({ type: 'success', text: `User status set to ${nextStatus}.` });
      setUsers((prev) =>
        prev.map((u) => (u.user_id === targetUser.user_id ? { ...u, status: nextStatus } : u))
      );
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message || 'Failed to change status.' });
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    try {
      await apiClient.revokeInvitation(invitationId);
      setStatusNotice({ type: 'success', text: 'Invitation revoked successfully.' });
      loadData();
    } catch (err: any) {
      setStatusNotice({ type: 'error', text: err.message || 'Failed to revoke invitation.' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="user-management-module" className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              User Management & Access Governance
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
              ADMIN ONLY
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage organization members, assign roles from the centralized RBAC matrix, and issue secure invitation tokens.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            title="Refresh user list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            id="btn-invite-user-modal"
            onClick={() => {
              setShowInviteModal(true);
              setGeneratedInviteLink(null);
              setInviteSuccessMsg(null);
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* Status Notice */}
      {statusNotice && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between border ${
            statusNotice.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            )}
            <span>{statusNotice.text}</span>
          </div>
          <button
            onClick={() => setStatusNotice(null)}
            className="text-xs hover:underline text-slate-500 font-medium ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" /> Active Organization Members ({users.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Tenant: <strong>{currentUser?.organization_name}</strong> ({currentUser?.organization_id})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">User / Email</th>
                <th className="py-3 px-4 font-semibold">Current Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Last Login</th>
                <th className="py-3 px-4 font-semibold">Created Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => {
                const isSelf = u.user_id === currentUser?.user_id;
                return (
                  <tr key={u.user_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {u.full_name}
                          </span>
                          {isSelf && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {u.email}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {isSelf ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                          <Shield className="w-3 h-3" /> {u.role}
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.user_id, e.target.value as UserRole)}
                          className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden focus:border-blue-500"
                        >
                          {availableRoles.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          u.status === 'Active'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                        }`}
                      >
                        {u.status === 'Active' ? (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        ) : (
                          <XCircle className="w-2.5 h-2.5" />
                        )}
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {!isSelf && (
                        <button
                          onClick={() => handleStatusToggle(u)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            u.status === 'Active'
                              ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                              : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                          }`}
                        >
                          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invitations Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" /> Pending & Historical Invitations ({invitations.length})
          </h3>
          <span className="text-[11px] text-slate-400">Tokens cryptographically generated with 7-day validity</span>
        </div>

        {invitations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No invitations currently outstanding for this organization.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Invited Email</th>
                  <th className="py-3 px-4 font-semibold">Assigned Role</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Expires At</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invitations.map((inv) => (
                  <tr key={inv.invitation_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                      {inv.invited_email}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{inv.assigned_role}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          inv.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : inv.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <Clock className="w-2.5 h-2.5" />
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(inv.expires_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {inv.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              copyToClipboard(`${window.location.origin}/accept-invite?token=${inv.token}`)
                            }
                            className="p-1 rounded text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Copy invitation link"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRevokeInvite(inv.invitation_id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
                            title="Revoke invitation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" /> Issue Organization Invitation
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            {inviteSuccessMsg ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs">
                  <p className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {inviteSuccessMsg}
                  </p>
                  <p className="mt-1 text-[11px]">
                    Share the cryptographic registration link below with the user:
                  </p>
                </div>

                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-mono break-all flex items-center justify-between gap-2">
                  <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate">
                    {generatedInviteLink}
                  </span>
                  <button
                    onClick={() => generatedInviteLink && copyToClipboard(generatedInviteLink)}
                    className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-500 shrink-0 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedLink ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <button
                  onClick={() => setShowInviteModal(false)}
                  className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Team Member Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteFullName}
                    onChange={(e) => setInviteFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Corporate Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {inviting ? 'Generating Invitation...' : 'Send Invitation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
