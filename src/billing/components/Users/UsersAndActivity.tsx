import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { User, ActivityLog } from '../../types';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Activity,
  Search,
  RefreshCw,
  CheckCircle2,
  Save,
  Receipt,
  Package,
  Users,
  Truck,
  RotateCcw,
  CreditCard,
  FileSpreadsheet,
  Settings,
  Sparkles,
  KeyRound,
  Lock,
  UserCheck,
} from 'lucide-react';

interface UsersAndActivityProps {
  onUserChanged?: () => void;
}

export const UsersAndActivity: React.FC<UsersAndActivityProps> = ({ onUserChanged }) => {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<User>(db.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [logSearch, setLogSearch] = useState('');

  // Editable profile fields
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState(currentUser.password || 'staff123');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = () => {
    const user = db.getCurrentUser();
    const users = db.getUsers();
    setCurrentUser(user);
    setAllUsers(users);
    setName(user.name);
    setUsername(user.username);
    setPassword(user.password || (user.role === 'admin' ? 'admin123' : 'staff123'));
    setPhone(user.phone || '');
    setEmail(user.email || '');
    setActivityLogs(db.getActivityLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Validation Error', 'Please enter your name.', 'error');
      return;
    }

    setIsSaving(true);
    const updated = db.updateCurrentUser({
      name: name.trim(),
      username: username.trim() || 'staff',
      password: password.trim() || 'staff123',
      phone: phone.trim(),
      email: email.trim(),
    });

    setCurrentUser(updated);
    setIsSaving(false);
    showToast('Profile Saved', 'Credentials and profile updated successfully.', 'success');
    if (onUserChanged) onUserChanged();
    loadData();
  };

  const filteredLogs = activityLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(logSearch.toLowerCase())
  );

  const allInOneFeatures = [
    {
      title: 'Sales Billing & Fast POS',
      desc: 'Instant invoice creation, GST split, thermal & A4 print, barcode scan, discounts',
      icon: Receipt,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Inventory, Batches & MRP',
      desc: 'Medicine master, batch tracking, expiry monitoring, purchase cost & selling rate control',
      icon: Package,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Customers & Retailer Ledgers',
      desc: 'Accounts directory, outstanding receivables, payment receipts, WhatsApp statement links',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Suppliers & Purchases',
      desc: 'Vendor management, inward purchase invoices, lot creation, purchase accounts',
      icon: Truck,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Returns & Credit Notes',
      desc: 'Sales & purchase return vouchers, automatic batch restock, credit balance adjustment',
      icon: RotateCcw,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      title: 'Payments & Due Recovery',
      desc: 'Collection entries, supplier payouts, aging reports (30/60/90+ days), bank reconciliation',
      icon: CreditCard,
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },
    {
      title: 'GST & Business Reports',
      desc: 'GSTR-1, GSTR-3B summary, Sales registers, Profit & Loss analysis, Excel export',
      icon: FileSpreadsheet,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Settings, Firm Info & Backup',
      desc: 'Drug licenses (20B/21B), GSTIN, bank details, thermal layout, JSON data backup & restore',
      icon: Settings,
      color: 'text-slate-700 bg-slate-100 border-slate-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              All-in-One Master Account & Activity Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Sole Operator Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            You handle everything alone: all wholesale billing, stock, ledgers, accounts, reports, and system settings are unlocked in this single account.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          Refresh Logs
        </button>
      </div>

      {/* Sole Operator Active Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50/90 via-blue-50/60 to-slate-50 rounded-2xl border border-emerald-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Single User System Active — 100% Permissions Unlocked
              </h2>
              <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-700">
                Zero Role Restrictions
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              No multiple user accounts or switching between cashier/accountant profiles. Every module and function is unified under your single Master Owner login.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-white px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>All 8 Business Modules Active</span>
        </div>
      </div>

      {/* Master Account Profile Card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Master Operator Account Details
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalize your owner profile name and contact info shown on prints, logs, and billing.
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            Full Administrator
          </span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sagar Patil"
                required
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username / Login ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. staff or owner"
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 94215 14788"
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sagardistributor.jal@gmail.com"
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Credentials update instantly for the staff login screen.</span>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Profile & Password'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Staff Billing Accounts Directory */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-600" />
              Staff Billing Software Accounts & Passwords
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Credentials authorized to sign in to the billing & POS portal
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
            {allUsers.length} Logins Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {allUsers.map((u) => {
            const isMe = u.id === currentUser.id;
            return (
              <div
                key={u.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isMe
                    ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400/20'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-900 truncate">{u.name}</div>
                  <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700">
                    {u.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-600 font-mono">
                    <span className="text-slate-400 text-[11px]">Username:</span>
                    <span className="font-bold text-slate-800">@{u.username}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 font-mono">
                    <span className="text-slate-400 text-[11px]">Password:</span>
                    <span className="font-bold text-blue-700">{u.password || 'staff123'}</span>
                  </div>
                </div>
                {isMe ? (
                  <div className="mt-2 pt-2 border-t border-blue-200/60 text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Currently Active Session</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      db.setCurrentUser(u.id);
                      if (onUserChanged) onUserChanged();
                      loadData();
                      showToast('User Switched', `Now operating as ${u.name}`, 'info');
                    }}
                    className="mt-2 pt-2 border-t border-slate-200/80 w-full text-left text-[11px] text-slate-500 hover:text-blue-600 font-semibold cursor-pointer flex items-center justify-between"
                  >
                    <span>Switch to this user</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* All-in-One Capabilities Grid */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            All-in-One Master Privileges (Active for You)
          </h2>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            All 8 Features Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allInOneFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-blue-200 hover:shadow-xs transition-all"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 truncate">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Enabled in Single Account</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-Time Audit Activity Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              System Audit Activity Trail ({activityLogs.length} events recorded)
            </h2>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-xs text-left">
            <thead className="sticky top-0 bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Operator</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Details / Audit Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No activity logs match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {log.userName}
                    </td>
                    <td className="py-2 px-3">
                      <span className="uppercase font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                        Master Owner
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold text-blue-600 text-[11px]">
                      {log.action}
                    </td>
                    <td className="py-2 px-3 text-slate-700">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
