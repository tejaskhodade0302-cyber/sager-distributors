import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Package, 
  ShieldCheck, 
  Truck, 
  PhoneCall, 
  MessageSquare, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { ProductCatalog } from '../components/ProductCatalog';
import { PHARMA_PRODUCTS, SAGAR_CONTACT } from '../data/pharmaData';
import { PHARMA_COMPANIES } from '../data/companyData';
import { CartItem, Product } from '../types';

interface ProductsPageProps {
  onOpenOrderModal: (companyName?: string) => void;
  cart?: CartItem[];
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onOpenOrderModal,
  cart,
  onAddToCart
}) => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* Page Header Banner */}
      <section className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-teal-300 font-semibold">Authorized Companies</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-500/40 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Building2 className="w-3.5 h-3.5" />
                24 Authorized Pharmaceutical Companies & Direct Stockist Divisions
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
                Authorized Pharmaceutical Companies & Divisions
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl leading-relaxed">
                Browse our direct wholesale agency partnerships with 24 of India's foremost pharmaceutical manufacturers. Authentic depot supply with verified batch COAs, statutory GST tax invoices, and Good Distribution Practices across all 15 talukas of Jalgaon District.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => onOpenOrderModal()}
                className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Upload PO / Shortage Slip</span>
              </button>

              <a
                href={`https://wa.me/${SAGAR_CONTACT.whatsappNumber}?text=Hello%20Sagar%20Distributor,%20I%20want%20to%20place%20a%20wholesale%20order.`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Direct WhatsApp PO</span>
              </a>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800 text-center sm:text-left">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-2xl font-black text-teal-400 font-display">24+</span>
              <p className="text-xs font-bold text-white mt-0.5">Authorized Companies</p>
              <p className="text-[11px] text-slate-400">Sun, Cipla, Mankind & more</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-2xl font-black text-teal-400 font-display">100%</span>
              <p className="text-xs font-bold text-white mt-0.5">Depot Batch Billing</p>
              <p className="text-[11px] text-slate-400">Direct agency distribution</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-2xl font-black text-teal-400 font-display">15</span>
              <p className="text-xs font-bold text-white mt-0.5">Jalgaon Talukas</p>
              <p className="text-[11px] text-slate-400">Same-day daily delivery</p>
            </div>
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-2xl font-black text-teal-400 font-display">20B / 21B</span>
              <p className="text-xs font-bold text-white mt-0.5">FDA Validated D.L.</p>
              <p className="text-[11px] text-slate-400">No. 20MH/JAL/465294</p>
            </div>
          </div>

        </div>
      </section>

      {/* Main Product Catalog Section */}
      <ProductCatalog
        onOpenOrderModal={onOpenOrderModal}
      />

      {/* Ordering Guide & Chemist Benefits */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block mb-2">
              Transparent Wholesale Terms
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              How Chemists Order from Sagar Distributor
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Flexible order placement methods tailored for independent pharmacies, polyclinics, nursing homes, and hospital pharmacies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Send Photo of PO / Shortage Diary
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simply take a clear photo of your daily handwritten shortage list or pharmacy software purchase order and share it to our dedicated WhatsApp order desk at <strong className="text-slate-800">+91 77097 37577</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Batch Verification & Invoicing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our depot team scans your request, confirms current batch numbers with longest expiry, applies standard manufacturer schemes (PTR discounts), and prints a statutory GST tax invoice.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Same-Day Delivery & Handover
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our delivery van delivers securely packed parcels directly to your medical counter in Chalisgaon, Pachora, Bhadgaon, Jalgaon City, or any of the 15 talukas.
              </p>
            </div>

          </div>

          {/* Need help banner */}
          <div className="mt-10 p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white">Need a Medicine Not in the Current Catalog?</h4>
              <p className="text-xs text-slate-300 mt-1">
                We have direct billing access to regional C&F depots. Contact our wholesale desk for emergency hospital procurement.
              </p>
            </div>
            <a
              href={`https://wa.me/${SAGAR_CONTACT.whatsappNumber}?text=Hello%20Sagar%20Distributor,%20I%20need%20pricing%20and%20availability%20for%20special%20medicines.`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 shrink-0 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Order Desk</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  );
};
