import React from 'react';
import { Link } from 'react-router-dom';
import { SdLogo } from './SdLogo';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart, 
  MessageSquare, 
  ArrowUp,
  FileText,
  Receipt
} from 'lucide-react';
import { SAGAR_CONTACT } from '../data/pharmaData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 text-sm border-t border-slate-800 w-full">
      
      {/* Main Footer Info - Full Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: About Distributor */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 inline-block group">
              <SdLogo size="md" />
              <div>
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-teal-400 transition-colors">
                  SAGAR DISTRIBUTOR
                </h3>
                <p className="text-xs sm:text-sm text-teal-400 font-semibold">
                  Wholesale Pharmaceutical & Generic Medicine Supplier
                </p>
              </div>
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Premier wholesale medicine distributor headquartered at Chalisgaon Main Hub (Dist. Jalgaon, Maharashtra). Supplying 10,000+ authentic ethical branded medicines, high-margin generic PCD formulations, critical care injectables, and surgical disposables across all 15 Talukas of Jalgaon District.
            </p>

            <div className="flex items-center gap-2.5 pt-1 flex-wrap">
              <Link to="/regulations" className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:border-teal-500/50 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-emerald-400 font-semibold transition-colors">
                <ShieldCheck className="w-4 h-4" />
                D.L. No.: 20MH/JAL/465294 (20B/21B)
              </Link>
              <span className="inline-flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-cyan-400 font-semibold">
                GST Registered
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2 text-slate-400 text-xs">
              <Link to="/about" className="hover:text-teal-400 underline">About Us</Link>
              <span>•</span>
              <Link to="/why-choose-us" className="hover:text-teal-400 underline">Why Choose Us</Link>
              <span>•</span>
              <Link to="/regulations" className="hover:text-teal-400 underline">Regulations & Licenses</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-teal-400 underline">Contact Desk</Link>
            </div>
          </div>

          {/* Col 3: Wholesale Services & Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Wholesale Services
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link to="/billing" className="hover:text-blue-300 transition-colors font-bold text-blue-400 flex items-center gap-1.5"><Receipt className="w-4 h-4 text-blue-400" /> Billing & Inventory Software (POS)</Link></li>
              <li><Link to="/companies" className="hover:text-teal-400 transition-colors font-semibold text-teal-300">24 Partner Companies & Divisions</Link></li>
              <li><Link to="/about" className="hover:text-teal-400 transition-colors">About Sagar Distributor</Link></li>
              <li><Link to="/coverage" className="hover:text-teal-400 transition-colors">15 Talukas Delivery Network</Link></li>
              <li><Link to="/why-choose-us" className="hover:text-teal-400 transition-colors">Why Partner With Us</Link></li>
              <li><Link to="/regulations" className="hover:text-teal-400 transition-colors">Statutory FDA Regulations & Licenses</Link></li>
              <li><Link to="/reviews" className="hover:text-teal-400 transition-colors">Chemist Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Chemist Onboarding & KYC</Link></li>
              <li><Link to="/billing" className="text-teal-400 hover:text-teal-300 font-bold transition-colors">Staff Billing & POS Login →</Link></li>
            </ul>
          </div>

          {/* Col 4: Jalgaon District Taluka Delivery Routes */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              <Link to="/coverage" className="hover:text-teal-400">Jalgaon Taluka Coverage</Link>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li><Link to="/coverage" className="text-teal-300 font-semibold hover:underline">Chalisgaon</Link> (Main Central Depot)</li>
              <li><Link to="/coverage" className="hover:text-teal-300">Pachora & Bhadgaon</Link> (Express Same Day)</li>
              <li><Link to="/coverage" className="hover:text-teal-300">Jalgaon City & Bhusawal</Link> (Daily Same Day)</li>
              <li><Link to="/coverage" className="hover:text-teal-300">Amalner, Parola & Erandol</Link> (Same Day Vans)</li>
              <li><Link to="/coverage" className="hover:text-teal-300">Jamner, Dharangaon & Bodwad</Link> (Daily Dispatch)</li>
              <li><Link to="/coverage" className="hover:text-teal-300">Chopda, Yawal, Raver & Muktainagar</Link> (Daily Vans)</li>
            </ul>
          </div>

          {/* Col 5: Depot Contact & Hours */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Depot Contact
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="leading-snug">F-25, Ganesh Complex, Ganesh Road, Chalisgaon, Dist. Jalgaon, Maharashtra - 424101.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:+917709737577" className="text-white hover:text-teal-300 font-bold text-base">
                  +91 77097 37577
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:tejaskhodade5252@gmail.com" className="hover:text-teal-300 break-all text-sm font-medium">
                  tejaskhodade5252@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-1 text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Mon - Sat: 8:30 AM to 9:00 PM<br />Sunday: Urgent SOS Dispatch</span>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory Statutory Notice / Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-900 text-xs sm:text-sm text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300 font-semibold">Statutory Disclaimer under Drugs and Cosmetics Act 1940:</strong> Sagar Distributor conducts wholesale pharmaceutical trade exclusively to registered retail chemists, licensed pharmacists (Form 20/21, 20B/21B holders), certified nursing homes, hospitals, and registered medical practitioners (RMPs). We do not sell Schedule H / H1 / X drugs to individual end-consumers without authorized statutory credentials.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs sm:text-sm">
          <div>
            © {new Date().getFullYear()} Sagar Distributor. All rights reserved. Chalisgaon, Jalgaon, Maharashtra.
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Support
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center gap-1"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              Top
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
