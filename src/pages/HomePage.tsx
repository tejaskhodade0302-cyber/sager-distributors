import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { CompanyShowcase } from '../components/CompanyShowcase';
import { 
  Building2, 
  Truck, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  PhoneCall, 
  FileText, 
  Users, 
  Star,
  ThermometerSnowflake, 
  MessageSquare,
  Sparkles,
  MapPin,
  CheckCircle2,
  Receipt
} from 'lucide-react';
import { motion } from 'motion/react';
import { SAGAR_CONTACT, TESTIMONIALS } from '../data/pharmaData';

interface HomePageProps {
  onOpenOrderModal: (companyName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenOrderModal,
}) => {
  return (
    <div className="space-y-0">
      
      {/* 1. Main Hero Section */}
      <HeroSection
        onOpenOrderModal={() => onOpenOrderModal()}
      />

      {/* 2. Direct Page Navigation Quick-Cards Grid - All 7 Separate Pages */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block mb-2">
              Sagar Distributor Portal Sections
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display">
              Dedicated Wholesale Services & Portals
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Explore our individual sections for authorized stockist partnerships, 15-taluka delivery logistics, statutory licenses, chemist reviews, and pharmacy onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Card 1: 24 Partner Companies & Divisions */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded">24+ Companies</span>
                  <span className="text-[10px] font-bold text-slate-500">Direct Stockist</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  Companies & Divisions
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Authorized distributor for Sun Pharma, Cipla, Mankind, Alkem, Abbott, Torrent, and 24+ top manufacturers with genuine batch billing.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/companies"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore 24 Companies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => onOpenOrderModal()}
                  className="text-[11px] font-semibold text-teal-600 hover:text-teal-800 cursor-pointer"
                >
                  Place PO
                </button>
              </div>
            </motion.div>

            {/* Card 2: About Sagar Distributor */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-700 flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">Chalisgaon Hub</span>
                  <span className="text-[10px] font-bold text-slate-500">Ganesh Complex</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  About Sagar Distributor
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Learn about our temperature-controlled warehouse, cold-chain walk-in storage, registered pharmacist team, and legacy serving 1,200+ chemists.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/about"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Depot Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-semibold text-slate-500">Established</span>
              </div>
            </motion.div>

            {/* Card 3: 15 Talukas Coverage Area */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">All 15 Talukas</span>
                  <span className="text-[10px] font-bold text-slate-500">Daily Dispatch</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  Coverage Area
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Express daily pharma vans departing from Chalisgaon Central Hub to Pachora, Bhadgaon, Jalgaon City, Bhusawal, Amalner, and all 15 talukas.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/coverage"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>View Delivery Routes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-bold text-emerald-600">24-Hr SLA</span>
              </div>
            </motion.div>

            {/* Card 4: Why Choose Us */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Wholesale Edge</span>
                  <span className="text-[10px] font-bold text-slate-500">Max Margins</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  Why Choose Us
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Direct procurement pricing benefits, zero counterfeit guarantee, unbroken 2°C - 8°C cold chain, and fast expiry credit notes.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/why-choose-us"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Compare Advantages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-bold text-amber-600">100% Genuine</span>
              </div>
            </motion.div>

            {/* Card 5: Statutory Regulations */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">FDA Verified</span>
                  <span className="text-[10px] font-bold text-slate-500">Form 20B & 21B</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  Regulations & Licenses
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Official Food & Drug Administration (FDA) Maharashtra Wholesale Drug License No: <strong>20MH/JAL/465294</strong>. GST compliance and registered pharmacist oversight.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/regulations"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>View Regulations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-bold text-blue-600">Form 20B/21B</span>
              </div>
            </motion.div>

            {/* Card 6: Chemist & Hospital Reviews */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-700 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Star className="w-6 h-6 fill-rose-500 text-rose-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">5.0 ★ Rated</span>
                  <span className="text-[10px] font-bold text-slate-500">Chemist Trust</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  Chemist Reviews
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Read genuine feedback and experiences from retail pharmacy owners, polyclinics, and hospital purchase managers across Jalgaon district.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/reviews"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Read Chemist Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-bold text-rose-600">Verified Chemists</span>
              </div>
            </motion.div>

            {/* Card 7: Contact & Chemist Onboarding */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Chemist KYC</span>
                  <span className="text-[10px] font-bold text-slate-500">Fast Setup</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  Contact & Registration
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Open your wholesale trade account in minutes. Submit your Drug License & GST copy for instant billing and daily delivery dispatch.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to="/contact"
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Contact Depot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a
                  href={`tel:+91${SAGAR_CONTACT.phoneRaw}`}
                  className="text-[11px] font-bold text-slate-600 hover:text-teal-700"
                >
                  {SAGAR_CONTACT.phoneDisplay}
                </a>
              </div>
            </motion.div>

            {/* Card 8: Billing Software & POS Portal */}
            <motion.div
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/80 via-white to-indigo-50/50 border border-blue-200 shadow-xs hover:shadow-xl hover:border-blue-600 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Internal Suite</span>
                  <span className="text-[10px] font-bold text-blue-600">POS & ERP</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2 font-display">
                  Billing & Inventory Software
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Generate authentic GST tax invoices (INV 3525), manage medicine batches, expiry alerts, customer ledgers, and A4 / 80mm print.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100 flex items-center justify-between">
                <Link
                  to="/billing"
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1.5 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Launch Software</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  A4 & Thermal
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* 3. Authorized Partner Companies Showcase Preview (Highlights only, full directory on /companies) */}
      <CompanyShowcase
        onOpenOrderModal={onOpenOrderModal}
      />

      {/* 4. Quick Highlights: 15 Talukas Delivery & Cold Storage Hub */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 mb-4">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>Cold Chain Certified (2°C - 8°C)</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
                  Central Warehouse at Chalisgaon With Daily Van Dispatches
                </h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  Holding over 10,000+ ready SKUs with dedicated cold-chain walk-in coolers for insulins, vaccines, and biologics. Our temperature-controlled vehicles cover all 15 Talukas of Jalgaon with same-day and 24-hour service.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    to="/coverage"
                    className="px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Open 15 Talukas Delivery Page</span>
                  </Link>
                  <Link
                    to="/about"
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all border border-white/20"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Depot Infrastructure Page</span>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-teal-300 font-display">15</span>
                  <p className="text-xs font-bold text-white mt-1">Jalgaon Talukas</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">100% daily van route coverage</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-teal-300 font-display">1,200+</span>
                  <p className="text-xs font-bold text-white mt-1">Partner Pharmacies</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Retail chemists & hospitals</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-teal-300 font-display">20B / 21B</span>
                  <p className="text-xs font-bold text-white mt-1">Drug License</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">No. 20MH/JAL/465294</p>
                </div>
                <div className="bg-white/10 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-white/10">
                  <span className="text-3xl font-black text-teal-300 font-display">2°-8°C</span>
                  <p className="text-xs font-bold text-white mt-1">Cold Chain</p>
                  <p className="text-[11px] text-slate-300 mt-0.5">Digital data logger integrity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Chemist Reviews Preview Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block mb-2">
                Pharmacy Testimonials
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                Trusted by 1,200+ Chemists Across Jalgaon
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Verified reviews from retail medical store owners and hospital pharmacies.
              </p>
            </div>

            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
            >
              <span>View All Chemist Reviews Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900">{item.storeName}</h4>
                  <p className="text-[11px] text-slate-500">{item.owner}</p>
                  <p className="text-[10px] text-teal-700 font-semibold mt-0.5">{item.location}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Call To Action Footer Banner */}
      <section className="py-14 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
            Ready to Partner With Sagar Distributor?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Place your order online, upload shortage prescription lists, or visit our central depot in Chalisgaon.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenOrderModal()}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Upload Shortage PO</span>
            </button>
            <a
              href={`https://wa.me/${SAGAR_CONTACT.whatsappNumber}?text=Hello%20Sagar%20Distributor,%20I%20want%20to%20place%20a%20wholesale%20order.`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Desk</span>
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Chemist Registration Page</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
