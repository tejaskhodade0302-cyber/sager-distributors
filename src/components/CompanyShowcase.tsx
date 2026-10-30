import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Building2, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  Award,
  ArrowRight
} from 'lucide-react';
import { PHARMA_COMPANIES } from '../data/companyData';
import { PharmaBrandLogo } from './PharmaBrandLogo';

interface CompanyShowcaseProps {
  onOpenOrderModal: (companyName?: string) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export const CompanyShowcase: React.FC<CompanyShowcaseProps> = ({
  onOpenOrderModal,
}) => {
  return (
    <section id="companies" className="py-20 bg-slate-50/80 border-b border-slate-200/80 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Banner with Entrance Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/90 text-teal-800 text-xs font-black uppercase tracking-wider mb-3 border border-teal-300/80 shadow-xs">
              <Award className="w-4 h-4 text-teal-700" />
              <span>Authorized Wholesale Partner Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight">
              Authorized Stockist for 24+ Top Pharma Companies
            </h2>
            <p className="text-base sm:text-lg text-slate-600 mt-2 max-w-3xl leading-relaxed">
              Sagar Distributor is the direct authorized stockist for India’s premier multinational and domestic pharmaceutical manufacturers. Sourced directly with verified batch test certificates (COA).
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <motion.div 
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-3 shrink-0 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-md shadow-teal-700/20">
              24+
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-slate-900 block font-display">Top Pharma Brands</span>
              <span className="text-[11px] text-teal-700 font-bold">100% Genuine Batch Supply</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Partner Companies & Logos Showcase with Gradient Border */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-slate-800"
        >
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Col: Wholesale Desk Info & Actions */}
            <div className="lg:col-span-4 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-bold backdrop-blur-xs border border-white/10 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>One-Stop Wholesale Desk</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
                All Major Pharmaceutical Companies Under One Roof
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Consolidate your daily retail chemist or hospital shortage list with Sagar Distributor. Instant billing across all 24 partner companies with same-day van delivery from Chalisgaon.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/companies"
                  className="px-4 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  <span>View All 24 Companies Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onOpenOrderModal()}
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-teal-300" />
                  <span>Upload Shortage List</span>
                </motion.button>
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20I%20want%20to%20inquire%20about%20partner%20company%20wholesale%20supply."
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-100" />
                  <span>WhatsApp Inquiry</span>
                </motion.a>
              </div>
            </div>

            {/* Right Col: Grid of 24 Partner Companies and Logos */}
            <div className="lg:col-span-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/80">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 text-slate-700">
                <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  Authorized Partner Companies (24 Brands)
                </span>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">Click any logo to order</span>
              </div>

              {/* Responsive Grid of Company Logos with Micro-interactions */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-72 sm:max-h-80 overflow-y-auto p-1 scrollbar-thin">
                {PHARMA_COMPANIES.map((comp) => (
                  <motion.button
                    key={comp.id}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOpenOrderModal(comp.name)}
                    className="p-2.5 bg-white rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group cursor-pointer"
                    title={`Click to order ${comp.name}`}
                  >
                    <div className="h-10 w-full flex items-center justify-center">
                      <PharmaBrandLogo logoKey={comp.logoKey} size="sm" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 group-hover:text-teal-700 truncate w-full mt-1.5">
                      {comp.name.split(' ')[0]}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
