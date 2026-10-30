import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Menu, 
  X,
  Receipt,
} from 'lucide-react';
import { CartItem } from '../types';
import { SdLogo } from './SdLogo';
import { SAGAR_CONTACT } from '../data/pharmaData';

interface NavbarProps {
  cart?: CartItem[];
  onOpenCart?: () => void;
  onOpenOrderModal: (companyName?: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/companies', label: 'Companies' },
    { path: '/about', label: 'About Us' },
    { path: '/coverage', label: 'Coverage Area' },
    { path: '/why-choose-us', label: 'Why Choose Us' },
    { path: '/regulations', label: 'Regulations' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/contact', label: 'Contact' },
  ];

  const isItemActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }
    if (path === '/companies') {
      return location.pathname.startsWith('/companies') || location.pathname.startsWith('/products');
    }
    if (path === '/regulations') {
      return location.pathname.startsWith('/regulations') || location.pathname.startsWith('/compliance');
    }
    if (path === '/reviews') {
      return location.pathname.startsWith('/reviews') || location.pathname.startsWith('/testimonials');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs w-full">
      
      {/* Top Notification & Contact Strip - Full Width Edge to Edge with Increased Font */}
      <div className="bg-slate-950 text-slate-100 py-2.5 px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-slate-800 w-full">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-2.5">
          
          {/* Left: Statutory FDA D.L. & Central Depot Location */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center md:justify-start">
            <span className="inline-flex items-center gap-2 text-emerald-400 font-semibold text-xs sm:text-sm">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              Govt. Verified Wholesale D.L. No.: 20MH/JAL/465294 • GST Registered
            </span>
            <span className="hidden sm:inline-flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
              <MapPin className="w-4 h-4 shrink-0 text-teal-400" />
              Ganesh Complex, Ganesh Rd, Chalisgaon (Dist. Jalgaon)
            </span>
          </div>

          {/* Right: Operational Hours, Direct Phone & WhatsApp PO Button */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center md:justify-end">
            <span className="hidden lg:inline-flex items-center gap-2 text-slate-300 text-xs sm:text-sm font-medium">
              <Clock className="w-4 h-4 shrink-0 text-amber-400" />
              Mon–Sat: 8:30 AM – 9:00 PM | Sun: Emergency
            </span>
            <Link
              to="/billing"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/80 hover:bg-blue-800 text-blue-100 hover:text-white text-xs font-bold border border-blue-600/60 shadow-2xs transition-colors"
              title="Staff Billing & POS Login Portal"
            >
              <Receipt className="w-3.5 h-3.5 text-blue-300" />
              <span>Staff Billing Login</span>
            </Link>
            <a 
              href="tel:+917709737577" 
              className="inline-flex items-center gap-2 text-white hover:text-teal-300 font-bold text-sm sm:text-base tracking-wide transition-colors"
            >
              <Phone className="w-4 h-4 shrink-0 text-teal-400" />
              +91 77097 37577
            </a>
            <a
              href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20I%20want%20to%20inquire%20about%20wholesale%20medicine%20supply."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow"
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              WhatsApp PO
            </a>
          </div>

        </div>
      </div>

      {/* Main Nav Header - Full Width with Increased Font */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand */}
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 shrink-0 group text-left"
          >
            <SdLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                  SAGAR <span className="text-teal-600">DISTRIBUTOR</span>
                </span>
                <span className="hidden lg:inline-block text-[11px] uppercase font-bold tracking-wider bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  24+ Top Companies
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Chalisgaon Central Depot • All 15 Jalgaon Talukas
              </p>
            </div>
          </Link>

          {/* DEDICATED SEPARATE PAGES NAVIGATION BAR */}
          <nav className="hidden xl:flex items-center gap-1 text-[15px] font-semibold text-slate-700">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                    active
                      ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200/70 shadow-xs'
                      : 'text-slate-700 hover:text-teal-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Launch Billing & POS Software Button */}
            <Link
              to="/billing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all cursor-pointer"
              title="Open Sagar Distributor Wholesale Billing, Inventory & POS Portal"
            >
              <Receipt className="w-4 h-4 text-blue-200" />
              <span>Billing Software</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-blue-500/40 text-blue-100 font-mono font-bold uppercase">
                POS
              </span>
            </Link>

            {/* Upload Shortage List / Quick Order Button */}
            <button
              onClick={() => onOpenOrderModal()}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Upload PO</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-slate-100 space-y-2 bg-white rounded-b-2xl shadow-lg px-2">
            
            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => {
                const active = isItemActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors block ${
                      active
                        ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions: Billing & PO */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link
                to="/billing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Receipt className="w-4 h-4 text-blue-200" />
                <span>Staff Billing & POS Login</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOrderModal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Upload Shortage List / PO</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
