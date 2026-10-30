import React from 'react';
import { PageBanner } from '../components/PageBanner';
import { AboutUs } from '../components/AboutUs';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Award, 
  CheckCircle2, 
  Package, 
  ThermometerSnowflake,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SAGAR_CONTACT } from '../data/pharmaData';

interface AboutPageProps {
  onOpenOrderModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenOrderModal }) => {
  return (
    <div className="space-y-0">
      <PageBanner
        title="About Sagar Distributor"
        subtitle="Premier wholesale pharmaceutical distributor & authorized direct stockist headquartered in Chalisgaon, serving all 15 Talukas of Jalgaon District."
        badge="FDA D.L. 20MH/JAL/465294 (Form 20B & 21B)"
      />

      {/* Main Depot & Company Details Component */}
      <AboutUs onOpenOrderModal={onOpenOrderModal} />

      {/* Extended Facility & Operational Blueprint */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block mb-2">
              Facility & Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Central Depot Infrastructure at Chalisgaon
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Engineered to satisfy strict Good Distribution Practices (GDP) and FDA Maharashtra regulations for pharmaceutical safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 font-black">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Certified Cold-Chain Infrastructure
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Walk-in cooling unit calibrated continuously at 2°C – 8°C for temperature-sensitive biologics, insulins (Human Mixtard, Lantus), immunoglobulins, and vaccines. Equipped with battery power backups and calibrated USB temperature loggers.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Continuous 24/7 Temperature Loggers</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Insulated PUF boxes for delivery vans</span>
                </li>
              </ul>
            </div>

            {/* Box 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Statutory FDA Regulations
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Holding Wholesale Drug Licenses in Form 20-B and Form 21-B issued under D.L. No. <strong>20MH/JAL/465294</strong> by FDA Maharashtra. Strict batch tracking with zero tolerance for non-genuine or expired drugs.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>D.L. No. 20MH/JAL/465294 active</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Registered Pharmacist on-site</span>
                </li>
              </ul>
            </div>

            {/* Box 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 font-black">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Computerized Fast Billing & Barcoding
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Every carton and strip scanned with automated HSN codes, GST rates, and batch expiry verification. Electronic proforma invoices transmitted instantly to retail chemists via WhatsApp or Email.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>GST-compliant computerized tax invoices</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Near-zero packing errors</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Depot Location Quick Bar */}
          <div className="mt-12 p-6 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Visit Our Chalisgaon Depot</h4>
                <p className="text-xs text-slate-600">
                  F-25, Ganesh Complex, Ganesh Road, Chalisgaon, Dist. Jalgaon - 424101
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5"
              >
                <span>Get Directions & Contact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
