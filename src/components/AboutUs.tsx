import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Award, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  ThermometerSnowflake, 
  Users, 
  Clock,
  PhoneCall,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { SdLogo } from './SdLogo';

interface AboutUsProps {
  onOpenOrderModal: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onOpenOrderModal }) => {
  return (
    <section id="about" className="py-20 bg-white border-b border-slate-200/80 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-wider mb-3 border border-teal-300/80 shadow-xs">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>Authorized Pharmaceutical Wholesaler & Stockist</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight">
            About Sagar Distributor
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Central Pharmaceutical Distribution Hub at Chalisgaon, serving retail chemists & hospital pharmacies across all 15 Talukas of Jalgaon District.
          </p>
        </motion.div>

        {/* 2-Column Story & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Brand Story & Mission */}
          <motion.div 
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex items-center gap-3">
              <SdLogo size="md" />
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-display">
                  Sagar Distributor Depot
                </h3>
                <p className="text-xs font-bold text-teal-700">
                  F-25, Ganesh Complex, Ganesh Road, Chalisgaon (Dist. Jalgaon)
                </p>
              </div>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Established with the core mission of providing retail chemists, hospital pharmacies, and medical institutions with <strong>100% genuine, manufacturer-direct allopathic medicines</strong>, Sagar Distributor is the dedicated central wholesale distributor covering <strong>all 15 Talukas of Jalgaon District</strong> from our headquarters in Chalisgaon.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              We hold authorized direct stockist affiliations with over <strong>24+ premier multinational and national pharmaceutical giants</strong> including Cipla, Sun Pharma, Dr. Reddy's, Mankind, Alkem, Torrent, Abbott, Pfizer, and Glenmark. All supplies are handled through state-of-the-art temperature-controlled warehousing and computerized billing.
            </p>

            {/* Core Values / Features with Interactive Lift */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <motion.div whileHover={{ y: -3, scale: 1.01 }} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs flex items-start gap-3 transition-all hover:border-teal-400">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">FDA D.L. No. 20MH/JAL/465294</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Form 20B & 21B authorized wholesale depot.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -3, scale: 1.01 }} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs flex items-start gap-3 transition-all hover:border-cyan-400">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                  <ThermometerSnowflake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">2°C to 8°C Cold Chain</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dedicated chillers for insulin & biologic injections.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -3, scale: 1.01 }} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs flex items-start gap-3 transition-all hover:border-emerald-400">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">15 Talukas Same-Day Vans</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Covering every taluka across Jalgaon district daily.</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -3, scale: 1.01 }} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs flex items-start gap-3 transition-all hover:border-amber-400">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Shortage List Fulfillment</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instant stock checking & purchase order processing.</p>
                </div>
              </motion.div>
            </div>

            {/* CTA action */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenOrderModal}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Upload PO & Medical License</span>
              </motion.button>
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20I%20want%20to%20know%20more%20about%20your%20wholesale%20distribution."
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 border border-slate-200"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                <span>Call Chalisgaon Depot</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Visual Feature Box & Metric Highlights */}
          <motion.div 
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800"
          >
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-teal-400 block">
                DEPOT OPERATIONAL CAPABILITIES
              </span>

              <div className="space-y-4">
                <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-white block font-display">24+</span>
                    <span className="text-xs text-slate-400">Direct Partner Companies</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-teal-400 block font-display">3,000+</span>
                    <span className="text-xs text-slate-400">Prescription SKUs</span>
                  </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-black text-white block font-display">1,200+</span>
                    <span className="text-xs text-slate-400">Active Chemist Stores</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-400 block font-display">100%</span>
                    <span className="text-xs text-slate-400">Batch-Tested Genuine</span>
                  </div>
                </motion.div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 text-teal-300 text-xs font-bold mb-1">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    <span>Chalisgaon Central Junction Hub</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Strategically located at the intersection of Central Railway and key national highways connecting Jalgaon, Dhule, Nashik, and Aurangabad.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-200 text-xs">
                <strong className="text-white block mb-0.5">Need Urgent Emergency Supplies?</strong>
                Our team processes emergency hospital and surgical shortage orders on priority 24/7.
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
