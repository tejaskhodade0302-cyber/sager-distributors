import React from 'react';
import { PageBanner } from '../components/PageBanner';
import { ComplianceAndBrands } from '../components/ComplianceAndBrands';
import { 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Award, 
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAGAR_CONTACT } from '../data/pharmaData';

export const RegulationsPage: React.FC = () => {
  return (
    <div className="space-y-0">
      <PageBanner
        title="Statutory Licenses & Pharma Regulations"
        subtitle="Government verified Food & Drug Administration (FDA) Maharashtra wholesale pharmaceutical licenses, Good Distribution Practices (GDP), and statutory regulatory mandates."
        badge="FDA D.L. No. 20MH/JAL/465294 • Form 20B & 21B"
      />

      {/* Main Regulations & Statutory Component */}
      <ComplianceAndBrands />

      {/* Chemist Onboarding Regulatory Checklist */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            
            {/* Left Col: Regulatory Requirements */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-800 rounded-full text-xs font-bold border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Drugs and Cosmetics Act, 1940 Guidelines</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 font-display">
                Wholesale Drug Sales Statutory Framework
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                As per the statutory guidelines of the Food & Drug Administration (FDA) Maharashtra, Sagar Distributor operates under mandatory regulatory restrictions to maintain the integrity and safety of the state’s healthcare supply chain.
              </p>

              <div className="space-y-4">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Wholesale Supplies Exclusively to Licensed Entities</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Supplies are strictly invoiced to holders of retail drug licenses (Form 20 & 21), wholesale licenses (Form 20B & 21B), hospitals, and registered institutions. Individual non-trade retail sales are not conducted.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Schedule H, H1 & X Prescription Records</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    All antibiotics, psychotropics, and habit-forming formulations are recorded with batch number, manufacturing date, and expiry date on serialized computer invoices.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Temperature & Cold Chain Retention Logs</span>
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Biologics, insulins, and vaccines maintain an unbroken temperature chain of 2°C to 8°C from manufacturer intake to retailer delivery.
                  </p>
                </div>

              </div>
            </div>

            {/* Right Col: Chemist KYC Checklist */}
            <div className="bg-gradient-to-br from-slate-900 to-teal-950 p-8 rounded-3xl text-white shadow-xl border border-slate-800 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-bold border border-teal-500/30">
                <FileText className="w-3.5 h-3.5" />
                <span>Chemist Onboarding Regulations</span>
              </div>

              <h3 className="text-2xl font-black text-white font-display">
                Required Documents to Open a Wholesale Account
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                To initiate daily wholesale medicine dispatches and credit invoicing from our Chalisgaon depot, please provide copies of the following statutory documents:
              </p>

              <div className="space-y-3 text-xs">
                
                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-teal-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Valid Retail / Wholesale Drug License</h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">Form 20 & 21 (Retail) or Form 20B & 21B (Wholesale) issued by FDA Maharashtra.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-teal-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Goods and Services Tax (GST) Certificate</h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">Copy of Form GST REG-06 for seamless electronic B2B input tax credit pass-through.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-teal-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-white">Registered Pharmacist Registration Certificate (MSPC)</h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">Maharashtra State Pharmacy Council registration card and Aadhaar ID of proprietor.</p>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-slate-400">
                  Send documents via WhatsApp or Email
                </span>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-5 py-2.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <span>Submit KYC Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>
    </div>
  );
};
