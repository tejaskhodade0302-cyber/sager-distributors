import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Building2,
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Sparkles,
  PhoneCall,
  Clock,
  Award,
  ChevronRight,
  Info,
  X
} from 'lucide-react';
import { PharmaCompany } from '../types';
import { PHARMA_COMPANIES, COMPANY_CATEGORIES } from '../data/companyData';
import { PharmaBrandLogo } from './PharmaBrandLogo';
import { SAGAR_CONTACT } from '../data/pharmaData';

interface ProductCatalogProps {
  products?: any[];
  cart?: any[];
  onAddToCart?: (product: any, quantity: number) => void;
  onOpenOrderModal?: (companyName?: string) => void;
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  title?: string;
  subtitle?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onOpenOrderModal,
  selectedCategory: propCategory,
  setSelectedCategory: propSetCategory,
  searchQuery: propSearchQuery,
  setSearchQuery: propSetSearchQuery,
  title = "Authorized Pharmaceutical Companies & Product Divisions",
  subtitle = "Direct wholesale stockist partnerships with India’s 24 foremost pharmaceutical manufacturers. Browse authorized divisions, therapeutic portfolios, and place your daily shortage purchase orders."
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('All Companies');
  const [internalSearch, setInternalSearch] = useState<string>('');
  const [selectedTherapy, setSelectedTherapy] = useState<string>('All');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<PharmaCompany | null>(null);

  const selectedCategory = propCategory !== undefined ? propCategory : internalCategory;
  const setSelectedCategory = propSetCategory || setInternalCategory;
  const searchQuery = propSearchQuery !== undefined ? propSearchQuery : internalSearch;
  const setSearchQuery = propSetSearchQuery || setInternalSearch;

  // Extract all distinct therapies from companies
  const allTherapies = useMemo(() => {
    const set = new Set<string>();
    PHARMA_COMPANIES.forEach(c => {
      c.keyTherapies.forEach(t => set.add(t));
    });
    return ['All', ...Array.from(set).sort()];
  }, []);

  // Filtered companies based on category, therapy, and search
  const filteredCompanies = useMemo(() => {
    return PHARMA_COMPANIES.filter(c => {
      // Category match
      const matchesCategory = 
        selectedCategory === 'All Companies' || 
        selectedCategory === 'All' || 
        c.category === selectedCategory;

      // Therapy match
      const matchesTherapy = 
        selectedTherapy === 'All' || 
        c.keyTherapies.some(t => t.toLowerCase() === selectedTherapy.toLowerCase());

      // Search match (name, tagline, description, divisions, therapies)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        c.name.toLowerCase().includes(q) ||
        (c.tagline && c.tagline.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q) ||
        c.keyTherapies.some(t => t.toLowerCase().includes(q)) ||
        (c.divisions && c.divisions.some(d => d.toLowerCase().includes(q)));

      return matchesCategory && matchesTherapy && matchesSearch;
    });
  }, [selectedCategory, selectedTherapy, searchQuery]);

  return (
    <section id="companies" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 text-teal-900 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-200">
            <Building2 className="w-3.5 h-3.5 text-teal-700" />
            <span>Authorized Stockist Agency Portfolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Chemist Quick PO Upload Bar */}
        <div className="mb-10 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-5 sm:p-6 rounded-3xl text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Daily Shortage List & Purchase Order Booking</span>
                <span className="text-[10px] bg-teal-500/30 text-teal-300 font-bold px-2 py-0.5 rounded-full uppercase">Same Day</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                Have a shortage slip or monthly requirement for any of our 24 authorized partner companies? Upload your slip or send via WhatsApp for immediate computerized invoice and dispatch.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onOpenOrderModal && onOpenOrderModal()}
              className="flex-1 md:flex-initial px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Upload Shortage Slip</span>
            </button>
            <a
              href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20I%20want%20to%20place%20a%20wholesale%20purchase%20order."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Desk</span>
            </a>
          </div>
        </div>

        {/* 24 Partner Companies Quick Logo Filter Strip */}
        <div className="mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <span>Filter by Authorized Manufacturer:</span>
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-teal-700 hover:text-teal-900 font-semibold cursor-pointer underline"
              >
                Clear Search Filter
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Companies');
                setSelectedTherapy('All');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                !searchQuery && selectedCategory === 'All Companies' && selectedTherapy === 'All'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              All 24 Companies ({PHARMA_COMPANIES.length})
            </button>

            {PHARMA_COMPANIES.map(company => {
              const isSelected = searchQuery.toLowerCase() === company.name.toLowerCase();
              return (
                <button
                  key={company.id}
                  onClick={() => setSearchQuery(isSelected ? '' : company.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white hover:bg-teal-50 text-slate-800 border-slate-200'
                  }`}
                  title={company.name}
                >
                  <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                    <PharmaBrandLogo logoKey={company.logoKey} size="sm" />
                  </div>
                  <span>{company.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Secondary Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, division, or therapy..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
            {COMPANY_CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Results Count & Current Filter Badge */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <div>
            Showing <strong className="text-slate-900">{filteredCompanies.length}</strong> of {PHARMA_COMPANIES.length} authorized pharmaceutical manufacturer partners
          </div>
          {(selectedCategory !== 'All Companies' || searchQuery || selectedTherapy !== 'All') && (
            <button
              onClick={() => {
                setSelectedCategory('All Companies');
                setSearchQuery('');
                setSelectedTherapy('All');
              }}
              className="text-teal-700 hover:underline font-bold cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Company Cards Grid (All 24 Companies) */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-teal-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Logo & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-20 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shrink-0">
                        <PharmaBrandLogo logoKey={company.logoKey} size="md" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                          {company.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                          {company.name}
                        </h3>
                        {company.establishedYear && (
                          <span className="text-[11px] text-slate-400">Est. {company.establishedYear}</span>
                        )}
                      </div>
                    </div>
                    
                    <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase shrink-0">
                      Stockist Active
                    </span>
                  </div>

                  {/* Company Tagline / Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {company.description}
                  </p>

                  {/* Authorized Divisions Section */}
                  <div className="space-y-2 mb-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-teal-600" />
                      <span>Authorized Divisions & Portfolios:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {company.divisions?.map((div, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-medium text-slate-800"
                        >
                          {div}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Therapies */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Key Clinical Therapies:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {company.keyTherapies.map((therapy, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 text-[10px] font-semibold"
                        >
                          {therapy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Terms & Direct Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Direct depot supply
                    </span>
                    <span className="font-bold text-slate-700">{company.brandCount}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenOrderModal && onOpenOrderModal(company.name)}
                      className="w-full py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Upload PO</span>
                    </button>
                    <a
                      href={`https://wa.me/917709737577?text=${encodeURIComponent(`Hello Sagar Distributor, I want to order products from ${company.name}. Please send available divisions and price list.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setSelectedCompanyModal(company)}
                    className="w-full text-center text-[11px] font-bold text-teal-700 hover:text-teal-900 cursor-pointer pt-1"
                  >
                    View agency authorization details &rarr;
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No partner company found</h4>
            <p className="text-xs text-slate-500 mt-1">
              We couldn't find any manufacturer matching "{searchQuery}". We represent 24 top pharmaceutical brands.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Companies');
                setSelectedTherapy('All');
              }}
              className="mt-4 px-4 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Show All 24 Companies
            </button>
          </div>
        )}

        {/* Bottom Wholesale Guarantee Strip */}
        <div className="mt-14 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">100% Genuine Batch Sourcing</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Direct company depot invoicing with manufacturer Certificate of Analysis (COA) for all 24 partner firms.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Same-Day Van Dispatch</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Regular daily supply routes serving all 15 talukas of Jalgaon district from our Chalisgaon central depot.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Statutory FDA Regulations</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Operated under Wholesale Drug License 20MH/JAL/465294 (Form 20B/21B) & registered pharmacist oversight.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Company Modal */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative space-y-6">
            <button
              onClick={() => setSelectedCompanyModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-16 w-24 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center p-3 shrink-0">
                <PharmaBrandLogo logoKey={selectedCompanyModal.logoKey} size="md" />
              </div>
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  {selectedCompanyModal.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedCompanyModal.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedCompanyModal.tagline}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Authorized Stockist Overview</h4>
                <p className="leading-relaxed">
                  {selectedCompanyModal.description}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Authorized Product Divisions:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCompanyModal.divisions?.map((d, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 text-slate-900 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Core Clinical Therapies:
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCompanyModal.keyTherapies.map((t, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Wholesale Supply Notice:</strong> Supplies for {selectedCompanyModal.name} are invoiced strictly to licensed retail chemists (Form 20/21) and institutions under FDA Maharashtra guidelines.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const compName = selectedCompanyModal.name;
                    setSelectedCompanyModal(null);
                    if (onOpenOrderModal) onOpenOrderModal(compName);
                  }}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Upload PO for this Company</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
