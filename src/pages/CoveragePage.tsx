import React from 'react';
import { PageBanner } from '../components/PageBanner';
import { MaharashtraNetwork } from '../components/MaharashtraNetwork';
import { Truck, Clock, ShieldCheck, PhoneCall, MapPin, CheckCircle2 } from 'lucide-react';
import { SAGAR_CONTACT } from '../data/pharmaData';

export const CoveragePage: React.FC = () => {
  return (
    <div className="space-y-0">
      <PageBanner
        title="Coverage Area & Maharashtra Distribution Network"
        subtitle="Daily dedicated pharmaceutical delivery vans connecting our Chalisgaon Central Hub to all 15 Talukas of Jalgaon District with guaranteed 24-hour turnaround."
        badge="All 15 Jalgaon Talukas • Daily Van Routes"
      />

      {/* Main Maharashtra Network Component */}
      <MaharashtraNetwork />

      {/* Route Assurance & Cold Chain Transport Protocols */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Fixed Daily Order Cut-Off Times</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Orders confirmed before <strong>11:30 AM</strong> are dispatched on the afternoon express route. Orders received between <strong>12:00 PM and 7:00 PM</strong> are packed overnight for early morning first-slot delivery.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Shock-Proof & Temperature-Safe Vans</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                All delivery vehicles are equipped with padded corrugated partition cartons to prevent glass ampoule breakage, and calibrated cold-chain ice gel boxes for insulin & biologics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold mb-3">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Taluka Route Dispatch Coordinator</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Need real-time status on today's van arrival in your taluka? Call or WhatsApp our central logistics desk directly at <strong>{SAGAR_CONTACT.phoneDisplay}</strong>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
