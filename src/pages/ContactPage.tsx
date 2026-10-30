import React from 'react';
import { PageBanner } from '../components/PageBanner';
import { InquiryAndOrderForm } from '../components/InquiryAndOrderForm';
import { 
  MapPin, 
  PhoneCall, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Building2, 
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { SAGAR_CONTACT } from '../data/pharmaData';

export const ContactPage: React.FC = () => {
  return (
    <div className="space-y-0">
      <PageBanner
        title="Contact Us & Chemist Onboarding Desk"
        subtitle="Connect with our sales and dispatch officers in Chalisgaon, open a new pharmacy wholesale account, or visit our central wholesale depot."
        badge="Direct Sales Desk: +91 77097 37577"
      />

      {/* Main Registration & Inquiry Form */}
      <InquiryAndOrderForm />

      {/* Commercial & Bank RTGS Information for Verified Chemists */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Depot Hours & Emergency */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Depot Working Hours & SOS Despatch</h4>
                  <p className="text-xs text-slate-500">Chalisgaon Wholesale Hub</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-semibold">Monday – Saturday</span>
                  <span className="font-bold text-teal-800">8:30 AM – 9:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-semibold">Order Dispatch Slots</span>
                  <span className="font-bold text-teal-800">11:30 AM & 5:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-semibold">Sunday Emergency SOS</span>
                  <span className="font-bold text-amber-700">ICU & Anti-Snake Venom Only</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 pt-2">
                For urgent hospital shortage supplies outside regular hours, connect directly on our emergency mobile line: <strong>{SAGAR_CONTACT.phoneDisplay}</strong>.
              </p>
            </div>

            {/* Official Billing & Banking Channels */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Official Settlement & Banking Channels</h4>
                  <p className="text-xs text-slate-500">RTGS / NEFT / Current Account Invoicing</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-semibold">Account Name</span>
                  <span className="font-bold text-slate-900">SAGAR DISTRIBUTOR</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-semibold">Statutory D.L.</span>
                  <span className="font-bold text-teal-800">20MH/JAL/465294</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="font-semibold">Accepted Modes</span>
                  <span className="font-bold text-slate-900">Bank RTGS / NEFT / Verified B2B UPI</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 pt-2">
                Official computerized tax invoices with company QR codes are generated with every delivery. All invoices clearly specify Drug License No. <strong>20MH/JAL/465294</strong>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
