import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { SdLogo } from './SdLogo';
import { 
  ShieldCheck, 
  Truck, 
  ThermometerSnowflake, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  PhoneCall, 
  MessageSquare,
  Building2,
  Award,
  Sparkles,
  Package
} from 'lucide-react';

interface HeroSectionProps {
  onExploreProducts?: () => void;
  onOpenOrderModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenOrderModal,
}) => {
  return (
    <section id="home" className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-14 lg:py-22 border-b border-slate-800 scroll-mt-24">
      {/* Background Subtle Tech & Hexagon Medical Grid with Ambient Glows */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      {/* Animated Ambient Glow Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.12, 0.22, 0.12]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            {/* Pill Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/90 border border-teal-500/40 text-teal-300 text-xs font-semibold backdrop-blur-md shadow-inner shadow-teal-500/10"
            >
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>Chalisgaon Central Hub • Serving All 15 Jalgaon District Talukas</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display leading-tight text-slate-50">
              Your Premier Wholesale <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-300">
                Pharmaceutical & Generic
              </span> Medicine Distributor
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Supplying <strong className="text-white">10,000+ authentic medicines</strong>, surgicals, and cold-chain biologics directly to retail chemists, generic pharmacies, nursing homes, and hospitals across all 15 talukas of Jalgaon district with verified batch documentation and same-day dispatch from our central Chalisgaon depot.
            </p>

            {/* Core Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 backdrop-blur-xs transition-all hover:border-teal-500/40"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">100% Genuine Direct Depot Sourced</strong>
                  <span className="text-slate-400">Cipla, Sun Pharma, Abbott, Mankind, Alkem</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 backdrop-blur-xs transition-all hover:border-cyan-500/40"
              >
                <Truck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Same-Day Across All 15 Jalgaon Talukas</strong>
                  <span className="text-slate-400">Chalisgaon, Pachora, Jalgaon, Bhusawal, Amalner +</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 backdrop-blur-xs transition-all hover:border-blue-500/40"
              >
                <ThermometerSnowflake className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">2°C - 8°C Monitored Cold Chain</strong>
                  <span className="text-slate-400">Insulins, Vaccines & Critical Injections</span>
                </div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/70 border border-slate-700/70 backdrop-blur-xs transition-all hover:border-amber-500/40"
              >
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-semibold">Maximum Chemist Margins (Up to 80%)</strong>
                  <span className="text-slate-400">High profit generic PCD & bulk ethical rates</span>
                </div>
              </motion.div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-4">
              <Link
                to="/companies"
                id="hero-explore-companies-btn"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer text-sm hover:-translate-y-0.5 active:scale-95"
              >
                <Building2 className="w-4 h-4" />
                <span>Explore 24 Partner Companies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                id="hero-upload-po-btn"
                onClick={onOpenOrderModal}
                className="inline-flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold px-5 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer text-sm shadow-md"
              >
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Upload PO / Shortage List</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20I%20am%20a%20chemist/hospital%20and%20want%20to%20place%20an%20urgent%20order."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-700/90 hover:bg-emerald-600 text-white font-semibold px-4 py-3.5 rounded-xl border border-emerald-500/40 transition-all text-sm shadow-md shadow-emerald-900/20"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp Order</span>
              </motion.a>
            </div>

            {/* Quick trust counter footer */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                D.L. No. 20MH/JAL/465294 (Form 20B/21B)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                GST Compliant Invoicing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Expiry Replacement Guarantee
              </span>
            </div>

          </motion.div>

          {/* Right Hero Quick Rate Card & Live Snapshot */}
          <motion.div 
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5"
          >
            <div className="bg-gradient-to-b from-slate-800/95 to-slate-900/95 border border-slate-700/90 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <SdLogo size="sm" />
                  <div>
                    <h2 className="text-sm font-bold text-white">Sagar Distributor Depot</h2>
                    <p className="text-xs text-slate-400">F-25, Ganesh Complex, Ganesh Rd, Chalisgaon</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Dispatch Active
                </span>
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xs">
                  <span className="text-xs text-slate-400 block font-medium">Active Inventory</span>
                  <span className="text-2xl font-black text-teal-400 font-display">10,000+</span>
                  <span className="text-[10px] text-slate-500 block">Molecules & SKUs</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xs">
                  <span className="text-xs text-slate-400 block font-medium">Partner Pharmacies</span>
                  <span className="text-2xl font-black text-emerald-400 font-display">1,250+</span>
                  <span className="text-[10px] text-slate-500 block">Retail Stores & Hospitals</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xs">
                  <span className="text-xs text-slate-400 block font-medium">Direct Brands</span>
                  <span className="text-2xl font-black text-cyan-400 font-display">120+</span>
                  <span className="text-[10px] text-slate-500 block">Pharma Companies</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-xs">
                  <span className="text-xs text-slate-400 block font-medium">Dispatch Accuracy</span>
                  <span className="text-2xl font-black text-amber-400 font-display">99.4%</span>
                  <span className="text-[10px] text-slate-500 block">Zero Batch Error</span>
                </motion.div>
              </div>

              {/* Fast Order Feature Callout */}
              <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-500/30 text-xs text-slate-200 space-y-2 shadow-inner">
                <div className="flex items-center justify-between font-bold text-teal-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Express Chemist Dispatch Policy
                  </span>
                  <span className="text-[10px] bg-teal-500/30 px-2.5 py-0.5 rounded-full font-bold text-teal-200">Cut-off: 2:00 PM</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Orders submitted before 2:00 PM are dispatched same afternoon via dedicated pharma delivery vans across all 15 Talukas of Jalgaon District including Chalisgaon, Bhadgaon, Pachora, Amalner, Jalgaon, Bhusawal & Jamner.
                </p>
              </div>

              {/* Emergency Hotline Box */}
              <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block">Direct Wholesale Desk:</span>
                  <strong className="text-white font-semibold text-sm">+91 77097 37577</strong>
                </div>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="tel:+917709737577"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                  Call Depot
                </motion.a>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
