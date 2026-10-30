import React, { useState } from 'react';
import { db } from '../../services/db';
import { User, BusinessProfile } from '../../types';
import {
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  FileSpreadsheet,
  PackageCheck,
  Sparkles,
} from 'lucide-react';

interface BillingLoginPageProps {
  onLoginSuccess: (user: User) => void;
  businessProfile?: BusinessProfile;
}

export const BillingLoginPage: React.FC<BillingLoginPageProps> = ({
  onLoginSuccess,
  businessProfile = db.getBusinessProfile(),
}) => {
  const [username, setUsername] = useState('staff');
  const [password, setPassword] = useState('staff123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = db.login(username, password);
      setIsLoading(false);

      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Invalid credentials. Please verify your username and password.');
      }
    }, 250);
  };

  const handleQuickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-xl transition-all border border-white/10 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-blue-400" />
          <span>Return to Sagar Public Website</span>
        </a>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hidden sm:flex">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">DL: {businessProfile.dlNo20B || '20B/JAL/233699'}</span>
        </div>
      </header>

      {/* Main Login Card Zone */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12 justify-center">
        {/* Left Side: Brand & Distributor Information */}
        <div className="flex-1 max-w-md lg:max-w-lg space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Authorized Staff & POS Access Portal</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {businessProfile.businessName}
            </h1>
            <p className="text-sm sm:text-base text-blue-200/80 font-medium">
              Wholesale Pharmaceutical & Provisions Billing Software
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Registered Premises:</span>
                <span>{businessProfile.address}, {businessProfile.city} - {businessProfile.pincode}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block">GSTIN:</span>
                <span className="text-blue-300 font-semibold">{businessProfile.gstin}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Financial Year:</span>
                <span className="text-emerald-300 font-semibold">FY {businessProfile.financialYear}</span>
              </div>
            </div>
          </div>

          {/* Quick Features List */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <Receipt className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-white">Fast Billing</div>
              <div className="text-[10px] text-slate-400">GST A4 & Thermal</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <PackageCheck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-white">Batch & Expiry</div>
              <div className="text-[10px] text-slate-400">Pharma Stock</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <FileSpreadsheet className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-white">Retailer Ledger</div>
              <div className="text-[10px] text-slate-400">Instant Reports</div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-100 relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Staff Sign In
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your staff username & password
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Username Input */}
            <div>
              <label
                htmlFor="billing-username"
                className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
              >
                Staff Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  id="billing-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. staff or owner"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="billing-password"
                className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center justify-between"
              >
                <span>Password</span>
                <span className="text-[11px] text-blue-600 font-normal lowercase tracking-normal">
                  default: staff123
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="billing-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Login to Billing Software</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Login Credentials (1-Click Fill)</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Staff Button */}
              <button
                type="button"
                onClick={() => handleQuickFill('staff', 'staff123')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'staff'
                    ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Billing Staff</span>
                  <span className="text-[10px] font-mono text-blue-600 font-bold bg-blue-100/80 px-1 rounded">
                    Desk
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                  staff / staff123
                </div>
              </button>

              {/* Owner / Master Button */}
              <button
                type="button"
                onClick={() => handleQuickFill('owner', 'admin123')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  username === 'owner'
                    ? 'border-indigo-500 bg-indigo-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Owner (Admin)</span>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-100/80 px-1 rounded">
                    Master
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                  owner / admin123
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} {businessProfile.businessName} · Chalisgaon, Maharashtra · Wholesale Pharma Billing System
        </p>
      </footer>
    </div>
  );
};
