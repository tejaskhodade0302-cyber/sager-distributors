import React from 'react';
import { PageBanner } from '../components/PageBanner';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Award, 
  Percent, 
  Truck, 
  FileText, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhyChooseUsPage: React.FC = () => {
  return (
    <div className="space-y-0">
      <PageBanner
        title="Why 1,200+ Chemists Choose Sagar Distributor"
        subtitle="Discover our wholesale pricing advantage, unbroken cold chain storage, guaranteed genuine stock, and same-day delivery logistics."
        badge="Direct Factory Stockist • Maximum Retail Margins"
      />

      {/* Main Why Choose Us Component */}
      <WhyChooseUs />

      {/* Wholesale Comparison Matrix */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block mb-2">
              Wholesale Value Proposition
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Sagar Distributor vs. Unorganized Secondary Sub-Dealers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              See why independent medical stores and hospital pharmacies across Jalgaon district rely exclusively on our central depot.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs text-xs">
              <thead>
                <tr className="bg-slate-900 text-white font-display">
                  <th className="p-4 sm:p-5 text-sm font-bold">Key Wholesale Parameters</th>
                  <th className="p-4 sm:p-5 text-sm font-bold bg-teal-800 text-white">Sagar Distributor (Authorized Depot)</th>
                  <th className="p-4 sm:p-5 text-sm font-bold text-slate-400">Typical Secondary Sub-Dealers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">Drug Authenticity & Traceability</td>
                  <td className="p-4 bg-teal-50/40 text-teal-950 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% genuine, directly billed from manufacturing pharma companies with Batch COA</span>
                  </td>
                  <td className="p-4 text-slate-500">
                    Mixed sources, secondary market transfers, risk of re-stickered stock
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">Cold Chain Infrastructure</td>
                  <td className="p-4 bg-teal-50/40 text-teal-950 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>24/7 Digital temperature-logged cold rooms (2°C-8°C) + PUF van boxes</span>
                  </td>
                  <td className="p-4 text-slate-500">
                    Basic domestic fridges, power cut risks, warm transit without ice packs
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">PTR Wholesale Pricing & GST</td>
                  <td className="p-4 bg-teal-50/40 text-teal-950 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Direct factory PTR margins + 100% Input Tax Credit (ITC) with valid GST invoice</span>
                  </td>
                  <td className="p-4 text-slate-500">
                    Added intermediary cuts (3-5% margin loss), delayed or rough billings
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">Delivery to all 15 Talukas</td>
                  <td className="p-4 bg-teal-50/40 text-teal-950 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fixed daily company routes directly to chemist doorsteps</span>
                  </td>
                  <td className="p-4 text-slate-500">
                    Rely on third-party state transport buses (ST), chemists have to collect from stand
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">Shortage & Critical Drug Allocation</td>
                  <td className="p-4 bg-teal-50/40 text-teal-950 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Priority allocation directly from company consignments for partner chemists</span>
                  </td>
                  <td className="p-4 text-slate-500">
                    Frequent stockouts during peak disease outbreaks (Monsoon/Winter)
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">Statutory License Transparency</td>
                  <td className="p-4 bg-teal-50/40 text-teal-950 font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Verified FDA Maharashtra D.L. 20MH/JAL/465294 (Form 20B & 21B)</span>
                  </td>
                  <td className="p-4 text-slate-500">
                    Often unlicensed brokerage or sub-agency operations
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/contact"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs inline-flex items-center gap-2"
            >
              <span>Partner With Us & Open Wholesale Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};
