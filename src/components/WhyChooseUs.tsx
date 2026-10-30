import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ThermometerSnowflake, 
  Truck, 
  BadgePercent, 
  FileCheck2, 
  Clock, 
  Sparkles,
  Award
} from 'lucide-react';
import { WHOLESALE_BENEFITS } from '../data/pharmaData';

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-choose-us" className="py-20 bg-slate-50/70 border-b border-slate-200/80 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-black uppercase tracking-wider mb-3 border border-teal-200/90 shadow-xs">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>Wholesale Advantage & Quality Assurance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight">
            Why Choose Sagar Distributor
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Direct procurement advantages, maximum retailer profit margins, and zero-compromise cold chain integrity for over 1,200+ partner pharmacies.
          </p>
        </motion.div>

        {/* 6 Key Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {WHOLESALE_BENEFITS.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-400 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100/80 flex items-center justify-center mb-5 group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition-colors font-display">
                  {benefit.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-teal-700">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Guaranteed Direct Supply</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Highlight 3-Pillar Assurance Strip */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 rounded-3xl p-8 text-white shadow-2xl border border-slate-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            
            <div className="flex items-start gap-4 pt-4 md:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">100% Genuine with COA</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Sourced straight from certified manufacturing plants and company C&Fs with valid batch test certificates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-6 md:pt-0 md:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-xs">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Validated Cold Chain</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  2°C - 8°C monitored deep refrigeration with digital data loggers and insulated thermal transit packaging.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-6 md:pt-0 md:pl-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Same-Day Dispatch</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Dedicated delivery vans running daily routes across all 15 Talukas of Jalgaon District centered at our Chalisgaon hub.
                </p>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
