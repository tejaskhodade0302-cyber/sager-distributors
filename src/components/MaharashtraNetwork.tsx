import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Navigation, 
  Building2,
  Radio,
  Store,
  Sparkles,
  Search
} from 'lucide-react';
import { JALGAON_TALUKA_NETWORK } from '../data/pharmaData';

export const MaharashtraNetwork: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [talukaSearch, setTalukaSearch] = useState<string>('');

  const zones = ['All', 'Central Hub', 'South Jalgaon', 'West Jalgaon', 'East Jalgaon', 'North Jalgaon'];

  const filteredNetwork = JALGAON_TALUKA_NETWORK.filter((item) => {
    const matchesZone = selectedZone === 'All' || item.zone === selectedZone;
    const matchesSearch = talukaSearch === '' || 
      item.taluka.toLowerCase().includes(talukaSearch.toLowerCase()) ||
      item.keyVillagesAndTowns.some(v => v.toLowerCase().includes(talukaSearch.toLowerCase()));
    return matchesZone && matchesSearch;
  });

  return (
    <section id="network" className="py-20 bg-white border-b border-slate-200/80 scroll-mt-24 relative overflow-hidden">
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
            <Truck className="w-3.5 h-3.5 text-teal-600" />
            <span>Coverage Area • Jalgaon District Exclusive Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight">
            Coverage Across All 15 Talukas of Jalgaon District
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Operating exclusively across the entire <strong className="text-slate-900 font-semibold">Jalgaon District</strong> with our <strong className="text-teal-700 font-bold">Central Main Hub & Head Depot at Chalisgaon</strong>, providing guaranteed same-day morning & afternoon van deliveries to every chemist, hospital, and rural clinic.
          </p>
        </motion.div>

        {/* Chalisgaon Main Hub Highlight Hero Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl mb-12 border border-slate-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Central Main Hub & Head Depot
                </span>
                <span className="flex items-center gap-1.5 text-xs text-teal-300 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  Chalisgaon (Dist. Jalgaon)
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                Chalisgaon Central Hub: Connecting All 15 Talukas
              </h3>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                Located at <strong className="text-teal-200">F-25, Ganesh Complex, Ganesh Road, Chalisgaon</strong>, our central warehouse holds over 3,000+ ready SKUs in temperature-monitored storage. Dedicated pharma delivery vehicles depart daily across North, South, East, and West Jalgaon corridors.
              </p>

              {/* Transit Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-xs">
                  <span className="text-[10px] text-teal-300 uppercase font-black tracking-wider block">Chalisgaon (Hub)</span>
                  <span className="text-sm sm:text-base font-extrabold text-white">Immediate (30m)</span>
                  <span className="text-[11px] text-slate-400 block">Express counter/van</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-xs">
                  <span className="text-[10px] text-teal-300 uppercase font-black tracking-wider block">Bhadgaon & Pachora</span>
                  <span className="text-sm sm:text-base font-extrabold text-white">1 - 2 Hours</span>
                  <span className="text-[11px] text-slate-400 block">Twice-daily runs</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-xs">
                  <span className="text-[10px] text-teal-300 uppercase font-black tracking-wider block">Jalgaon, Amalner, Parola</span>
                  <span className="text-sm sm:text-base font-extrabold text-white">2 - 4 Hours</span>
                  <span className="text-[11px] text-slate-400 block">Morning & evening runs</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-700/80 shadow-xs">
                  <span className="text-[10px] text-teal-300 uppercase font-black tracking-wider block">Bhusawal, Jamner, Chopda +</span>
                  <span className="text-sm sm:text-base font-extrabold text-white">Same-Day</span>
                  <span className="text-[11px] text-slate-400 block">All remaining 9 talukas</span>
                </motion.div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border border-teal-500/30 space-y-3.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Jalgaon Daily Dispatch Routes
                </span>
                <span className="text-[10px] bg-teal-900/80 text-teal-200 px-2 py-0.5 rounded-full font-bold">
                  15 / 15 Talukas
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Hub Route 1:</strong> Chalisgaon &rarr; Bhadgaon &rarr; Pachora</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>West Route 2:</strong> Parola &rarr; Amalner &rarr; Dharangaon &rarr; Erandol</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Central Route 3:</strong> Jalgaon City (Golani / MIDC) &rarr; Asoda</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>East Route 4:</strong> Bhusawal &rarr; Jamner &rarr; Bodwad &rarr; Muktainagar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>North Route 5:</strong> Chopda &rarr; Yawal &rarr; Raver</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-800">
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20I%20am%20a%20chemist%20in%20Jalgaon%20district.%20Please%20share%20delivery%20schedule%20for%20my%20taluka."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Check Delivery Time for Your Taluka
                </motion.a>
              </div>
            </div>

          </div>
        </motion.div>

        {/* 15 Talukas Directory Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedZone === zone
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {zone === 'All' ? 'All 15 Talukas' : zone}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search taluka or town..."
              value={talukaSearch}
              onChange={(e) => setTalukaSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 focus:bg-white"
            />
          </div>

        </div>

        {/* All 15 Talukas Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNetwork.map((route, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 6) * 0.05 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                route.isMainHub
                  ? 'bg-gradient-to-b from-teal-50/90 to-white border-teal-500 shadow-md ring-2 ring-teal-500/20'
                  : 'bg-slate-50/80 border-slate-200 hover:border-teal-400 hover:bg-white hover:shadow-lg'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    route.isMainHub 
                      ? 'bg-amber-400 text-slate-950 font-bold' 
                      : 'bg-teal-100 text-teal-800 font-bold'
                  }`}>
                    {route.isMainHub ? '★ MAIN HUB & DEPOT' : route.zone}
                  </span>
                  
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    ⚡ Same Day
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 leading-snug mt-2 flex items-center gap-1.5">
                  <MapPin className={`w-4 h-4 ${route.isMainHub ? 'text-amber-500' : 'text-teal-600'}`} />
                  {route.taluka}
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 font-semibold">Transit Time:</span>
                    <strong className="text-slate-900 font-bold">{route.transitTime}</strong>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 font-semibold">Van Frequency:</span>
                    <span className="text-slate-800 font-medium text-[11px] text-right">{route.deliveryFrequency}</span>
                  </div>

                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 font-semibold">Chemist Partners:</span>
                    <span className="text-teal-700 font-bold text-xs">{route.activeChemistCount}</span>
                  </div>
                </div>

                {/* Key towns served in this Taluka */}
                <div className="mt-3 pt-3 border-t border-slate-200/80">
                  <span className="text-[10px] uppercase font-black text-slate-400 block mb-1.5">
                    Towns & Medical Markets Covered
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {route.keyVillagesAndTowns.map((town, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                      >
                        {town}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Jalgaon District</span>
                <a
                  href={`https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20I%20need%20medicine%20delivery%20in%20${encodeURIComponent(route.taluka)}%20(Jalgaon%20District).%20Please%20confirm%20today's%20dispatch.`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-teal-700 hover:text-teal-900 font-black inline-flex items-center gap-1"
                >
                  Order for {route.taluka.split('(')[0].trim()} &rarr;
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 15 Talukas Summary Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center shadow-xs"
        >
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            <strong className="text-slate-900 font-bold">Complete Jalgaon District Coverage:</strong> 1. Chalisgaon (Head Depot) • 2. Bhadgaon • 3. Pachora • 4. Jalgaon City & Rural • 5. Bhusawal • 6. Amalner • 7. Parola • 8. Erandol • 9. Dharangaon • 10. Jamner • 11. Chopda • 12. Yawal • 13. Raver • 14. Muktainagar • 15. Bodwad.
          </p>
        </motion.div>

      </div>
    </section>
  );
};

