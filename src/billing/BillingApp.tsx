/**
 * Sagar Distributor - Billing & Inventory Management
 * Full Wholesale Distribution Software
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { db } from './services/db';
import { BusinessProfile, User } from './types';
import { Sidebar, NavModule } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SalesBilling } from './components/Billing/SalesBilling';
import { ProductsList } from './components/Inventory/ProductsList';
import { CustomersList } from './components/Customers/CustomersList';
import { SuppliersAndPurchases } from './components/Suppliers/SuppliersAndPurchases';
import { ReturnsManagement } from './components/Returns/ReturnsManagement';
import { PaymentsManagement } from './components/Payments/PaymentsManagement';
import { ReportsDashboard } from './components/Reports/ReportsDashboard';
import { UsersAndActivity } from './components/Users/UsersAndActivity';
import { SettingsView } from './components/Settings/SettingsView';
import { BillingLoginPage } from './components/Auth/BillingLoginPage';
import { Menu, Receipt, Shield, Bell, HelpCircle, ArrowLeft, LogOut } from 'lucide-react';
import { formatDateIndian } from './utils/indianFormatters';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => db.isAuthenticated());
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(() => {
    return localStorage.getItem('sagar_simple_mode') !== 'false';
  });
  // Default to billing for direct, fast, simplified wholesale workflow
  const [currentModule, setCurrentModule] = useState<NavModule>('billing');
  const [currentUser, setCurrentUser] = useState<User>(() => db.getCurrentUser());
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => db.getBusinessProfile());
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleSimpleMode = () => {
    setIsSimpleMode((prev) => {
      const next = !prev;
      localStorage.setItem('sagar_simple_mode', String(next));
      return next;
    });
  };

  const handleLogout = () => {
    db.logout();
    setIsAuthenticated(false);
  };

  const refreshUserData = () => {
    setCurrentUser(db.getCurrentUser());
    setBusinessProfile(db.getBusinessProfile());
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  if (!isAuthenticated) {
    return (
      <BillingLoginPage
        businessProfile={businessProfile}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* Left Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        currentUser={currentUser}
        businessProfile={businessProfile}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        onSwitchUser={() => setCurrentModule('users')}
        onLogout={handleLogout}
        isSimpleMode={isSimpleMode}
        onToggleSimpleMode={toggleSimpleMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all">
        {/* Top Header Bar */}
        <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-800 font-bold hidden sm:inline tracking-tight">
                {businessProfile.businessName}
              </span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-bold text-blue-700 capitalize">
                {currentModule === 'users' ? 'Staff Profile & Activity' : currentModule.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Right Header Zone */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Exit to Public Website Button */}
            <a
              href="#/"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
              title="Return to Sagar Distributor Public Website"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Main Website</span>
            </a>

            {/* Simple Mode Toggle Pill */}
            <button
              type="button"
              onClick={toggleSimpleMode}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isSimpleMode
                  ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-2xs'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Toggle Simple Fast Mode vs Full ERP"
            >
              <span className="text-blue-600">⚡</span>
              <span>{isSimpleMode ? 'Simple Mode' : 'Full Mode'}</span>
            </button>

            {/* Live Indian Date */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium font-mono">
              <span>{formatDateIndian(todayStr)}</span>
            </div>

            {/* Quick Bill Button */}
            {currentModule !== 'billing' && (
              <button
                onClick={() => setCurrentModule('billing')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>+ New Bill</span>
              </button>
            )}

            {/* Current Staff User Pill & Logout */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentModule('users')}
                className="flex items-center gap-2 py-1 px-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 rounded-xl cursor-pointer transition-all shadow-2xs"
                title="Staff Account & Activity"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                  {currentUser.name ? currentUser.name[0] : 'S'}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 leading-none capitalize">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    {currentUser.role === 'admin' ? 'Master' : currentUser.role.replace('_', ' ')}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg text-xs font-bold border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                title="Log out of Staff Billing"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Viewport View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentModule === 'dashboard' && <Dashboard onNavigate={(m) => setCurrentModule(m as NavModule)} />}
          {currentModule === 'billing' && <SalesBilling />}
          {currentModule === 'inventory' && <ProductsList />}
          {currentModule === 'customers' && <CustomersList />}
          {currentModule === 'purchases' && <SuppliersAndPurchases />}
          {currentModule === 'returns' && <ReturnsManagement />}
          {currentModule === 'payments' && <PaymentsManagement />}
          {currentModule === 'reports' && <ReportsDashboard />}
          {currentModule === 'users' && <UsersAndActivity onUserChanged={refreshUserData} />}
          {currentModule === 'settings' && <SettingsView onProfileUpdated={refreshUserData} />}
        </main>
      </div>
    </div>
  );
}

export function BillingApp() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default BillingApp;
