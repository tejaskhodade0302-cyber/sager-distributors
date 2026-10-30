import React from 'react';
import { User, UserRole, BusinessProfile } from '../../types';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Users,
  Truck,
  RotateCcw,
  CreditCard,
  FileSpreadsheet,
  ShieldCheck,
  Settings,
  ChevronRight,
  LogOut,
  Building2,
  ArrowLeft,
} from 'lucide-react';

export type NavModule =
  | 'dashboard'
  | 'billing'
  | 'inventory'
  | 'customers'
  | 'purchases'
  | 'returns'
  | 'payments'
  | 'reports'
  | 'users'
  | 'settings';

interface SidebarProps {
  currentModule: NavModule;
  onSelectModule: (module: NavModule) => void;
  currentUser: User;
  businessProfile: BusinessProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onSwitchUser: () => void;
  onLogout?: () => void;
  isSimpleMode?: boolean;
  onToggleSimpleMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  currentUser,
  businessProfile,
  isOpenMobile,
  onCloseMobile,
  onSwitchUser,
  onLogout,
  isSimpleMode = true,
  onToggleSimpleMode,
}) => {
  const [showMoreTools, setShowMoreTools] = React.useState(false);

  const coreNavItems: { id: NavModule; label: string; subLabel?: string; icon: React.FC<{ className?: string }>; disabled?: boolean; badge?: string }[] = [
    { id: 'billing', label: 'Sales Billing', subLabel: 'Create & Print Bill', icon: Receipt, badge: 'Main' },
    { id: 'inventory', label: 'Products & Stock', subLabel: 'Medicines & MRP', icon: Package },
    { id: 'customers', label: 'Customers / Retailers', subLabel: 'Ledger & Balances', icon: Users },
    { id: 'dashboard', label: 'Dashboard', subLabel: 'Daily Sales & Charts', icon: LayoutDashboard },
  ];

  const extraNavItems: { id: NavModule; label: string; icon: React.FC<{ className?: string }>; disabled?: boolean; badge?: string }[] = [
    { id: 'purchases', label: 'Suppliers & Purchases', icon: Truck },
    { id: 'returns', label: 'Returns & Credit Notes', icon: RotateCcw },
    { id: 'payments', label: 'Payments & Outstanding', icon: CreditCard },
    { id: 'reports', label: 'GST & Business Reports', icon: FileSpreadsheet },
    { id: 'users', label: 'Owner Profile & Activity', icon: ShieldCheck, badge: 'All-in-1' },
    { id: 'settings', label: 'Settings & Backup', icon: Settings },
  ];

  const handleNavClick = (id: NavModule) => {
    onSelectModule(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white text-slate-800 flex flex-col justify-between transition-transform duration-200 border-r border-slate-200 shadow-xs md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
              SD
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-sm text-slate-900 tracking-tight truncate">
                {businessProfile.businessName}
              </h2>
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span className="truncate">{businessProfile.city}</span>
                <span>·</span>
                <span className="font-mono text-[10px] text-blue-600 font-semibold">
                  FY {businessProfile.financialYear}
                </span>
              </div>
            </div>
          </div>

          {/* Simple Mode vs Full Mode Banner */}
          {onToggleSimpleMode && (
            <div className="p-2.5 mx-3 mt-2.5 mb-1 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center justify-between">
              <div className="text-[11px] font-medium text-slate-700">
                <span className="font-bold text-slate-900 block">
                  {isSimpleMode ? '⚡ Simple Mode' : '⚙️ Full ERP'}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isSimpleMode ? 'Clean & fast billing' : 'All 10 modules'}
                </span>
              </div>
              <button
                type="button"
                onClick={onToggleSimpleMode}
                className="px-2.5 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                {isSimpleMode ? 'Show All' : 'Simplify'}
              </button>
            </div>
          )}

          {/* Nav Items List */}
          <nav className="p-3 space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
              Main Operations
            </div>
            {coreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentModule === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 font-bold border-l-4 border-blue-600 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="text-left truncate">
                      <span className="block truncate font-bold">{item.label}</span>
                      {item.subLabel && (
                        <span className="block text-[10px] opacity-75 font-normal truncate">
                          {item.subLabel}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Collapsible / Expandable Extra Tools */}
            {isSimpleMode ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowMoreTools(!showMoreTools)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors border border-dashed border-slate-200 cursor-pointer"
                >
                  <span>{showMoreTools ? '▾ Hide Extra Tools' : '▸ More Tools (Reports, Purchases...)'}</span>
                  <span className="text-[10px] text-slate-400">{showMoreTools ? '▲' : '▼'}</span>
                </button>

                {showMoreTools && (
                  <div className="mt-1 space-y-1 pl-1 border-l-2 border-slate-100">
                    {extraNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentModule === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-mono font-bold">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="pt-2 space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                  Accounting & Administration
                </div>
                {extraNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentModule === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-bold border-l-4 border-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-mono font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </nav>
        </div>

        {/* Current User Profile, Logout & Public Website return */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/80 space-y-2">
          <a
            href="#/"
            className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/90 text-xs font-semibold text-slate-700 hover:text-blue-700 hover:border-blue-300 transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span>Exit to Main Website</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              Public
            </span>
          </a>

          <div className="flex items-center gap-1.5">
            <div
              onClick={() => onSelectModule('users')}
              className="flex-1 p-2 rounded-xl hover:bg-white transition-all cursor-pointer flex items-center justify-between border border-slate-200/70 hover:border-blue-200 hover:shadow-xs group min-w-0"
              title="View Staff Profile & Activity Logs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  {currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-700">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-mono uppercase">
                      {currentUser.role === 'admin' ? 'Master' : currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer shrink-0 shadow-2xs"
                title="Log Out of Billing Software"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
