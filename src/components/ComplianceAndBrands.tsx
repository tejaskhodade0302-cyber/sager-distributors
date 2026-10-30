import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Award, 
  FileCheck2, 
  Building2, 
  CheckCircle2, 
  Download, 
  ExternalLink,
  ThermometerSnowflake,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { WHOLESALE_BENEFITS, TESTIMONIALS } from '../data/pharmaData';
import { PHARMA_COMPANIES } from '../data/companyData';
import { PharmaBrandLogo } from './PharmaBrandLogo';

export const ComplianceAndBrands: React.FC = () => {
  return (
    <section id="regulations" className="py-20 bg-slate-50/80 border-b border-slate-200/80 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Regulations Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            Statutory Licenses & Regulations
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight">
            100% Regulated, Certified & Direct Sourced
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Sagar Distributor operates under strict adherence to the Drugs and Cosmetics Act, Good Distribution Practices (GDP), and FDA Maharashtra statutory regulations.
          </p>
        </motion.div>

        {/* License Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 shadow-xs">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Wholesale Drug License: 20MH/JAL/465294
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Authorized by Food & Drug Administration (FDA) Maharashtra under Form 20B & 21B for wholesale storage and distribution of Allopathic, Schedule H, H1, X, and OTC formulations.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div><strong>D.L. Number:</strong> 20MH/JAL/465294 (Form 20B & 21B)</div>
              <div><strong>FDA Jurisdiction:</strong> Jalgaon District, Maharashtra</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              GST Registration & HSN Tax Invoicing
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Transparent, computerized billing with exact HSN classification (3004, 9018, etc.) and complete GST tax invoices ensuring seamless input credit (ITC) for chemists.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div><strong>GSTIN Status:</strong> Active & Regular Taxpayer</div>
              <div><strong>HSN Support:</strong> Full digital ledger reports</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4 shadow-xs">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Cold Chain & GDP Certified Storage
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Equipped with calibrated 2°C to 8°C deep chillers with 24/7 power backup, digital temperature loggers, and validated thermal transit boxes for insulins & biologics.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <div><strong>Storage:</strong> Multi-zone air-conditioned depot</div>
              <div><strong>Transit:</strong> Thermal EPS boxes with ice packs</div>
            </div>
          </motion.div>

        </div>

        {/* Why Choose Us Benefits Grid */}
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Why 1,200+ Pharmacies & Hospitals Trust Sagar Distributor
            </h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHOLESALE_BENEFITS.map((b, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-start gap-4 hover:border-teal-400 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Associated Top Pharma Brands Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                Direct Procurement & Distribution
              </span>
              <h3 className="text-xl font-bold text-slate-900 font-display">
                Leading National & Global Pharmaceutical Partners
              </h3>
            </div>
            <motion.a
              whileHover={{ scale: 1.02 }}
              href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20please%20send%20company-wise%20price%20list."
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
            >
              Request Company-wise Rate List &rarr;
            </motion.a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {PHARMA_COMPANIES.map((comp) => (
              <motion.a
                key={comp.id}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={`#companies`}
                className="p-3.5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-between group cursor-pointer"
              >
                <div className="h-10 w-full flex items-center justify-center my-1">
                  <PharmaBrandLogo logoKey={comp.logoKey} size="sm" />
                </div>
                <div className="w-full pt-1.5 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-700 block truncate">
                    {comp.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-teal-700 font-semibold block">
                    {comp.brandCount}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export const RegulationsAndBrands = ComplianceAndBrands;
