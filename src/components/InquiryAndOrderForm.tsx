import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { InquiryFormData } from '../types';

export const InquiryAndOrderForm: React.FC = () => {
  const [formData, setFormData] = useState<InquiryFormData>({
    storeName: '',
    contactPerson: '',
    phone: '',
    email: '',
    drugLicenseNo: '',
    gstNo: '',
    city: '',
    district: 'Jalgaon',
    pincode: '',
    businessType: 'Retail Chemist',
    message: '',
    orderItems: [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const districts = [
    'Chalisgaon (Main Central Hub)',
    'Pachora',
    'Bhadgaon',
    'Jalgaon',
    'Bhusawal',
    'Amalner',
    'Parola',
    'Erandol',
    'Jamner',
    'Dharangaon',
    'Raver',
    'Yawal',
    'Chopda',
    'Muktainagar',
    'Bodwad',
    'Other Nearby Area'
  ];

  const businessTypes: Array<InquiryFormData['businessType']> = [
    'Retail Chemist',
    'Hospital / Nursing Home',
    'Generic Pharmacy',
    'Wholesaler / Sub-distributor',
    'Clinic / Doctor'
  ];

  const faqs = [
    {
      q: 'What is the Minimum Order Value (MOV) for free delivery?',
      a: 'For Chalisgaon, Pachora, Bhadgaon and all 15 talukas of Jalgaon district, minimum order value is ₹2,500 to ₹3,500 for free daily dedicated delivery van service.',
    },
    {
      q: 'How are Cold Chain products (Insulins / Vaccines) transported safely?',
      a: 'We pack all 2°C - 8°C cold chain items in heavy-duty expanded polystyrene (EPS) insulated boxes with pre-conditioned frozen gel ice packs and digital temperature tags to ensure unbroken temperature integrity.',
    },
    {
      q: 'Can newly opened medical stores buy on credit terms?',
      a: 'Initial orders are processed on RTGS/NEFT/UPI or Cash On Delivery (COD) basis. After establishing a consistent track record and verification of Drug License Form 20B/21B, flexible weekly/bi-weekly credit terms are extended.',
    },
    {
      q: 'What is your expiry and breakage return settlement policy?',
      a: 'Near-expiry medicines can be reported 60 to 90 days in advance as per manufacturer terms. Once verified against our batch invoice, credit notes are issued promptly in your billing account.',
    },
    {
      q: 'What documents are required for new chemist onboarding in Jalgaon District?',
      a: 'You only need: 1) Copy of Wholesale/Retail Drug License (Form 20/21 or 20B/21B), 2) GST Registration Certificate, and 3) Pharmacist Registration Certificate.',
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare WhatsApp Message for direct fast transmission
    let msg = `*NEW CHEMIST ONBOARDING & RATE INQUIRY*\n`;
    msg += `*Distributor:* Sagar Distributor, Chalisgaon Main Hub (Jalgaon Dist.)\n`;
    msg += `------------------------------------\n`;
    msg += `*Store / Hospital:* ${formData.storeName}\n`;
    msg += `*Contact Person:* ${formData.contactPerson} (${formData.businessType})\n`;
    msg += `*Mobile No:* ${formData.phone}\n`;
    if (formData.email) msg += `*Email:* ${formData.email}\n`;
    msg += `*Location:* ${formData.city}, Taluka: ${formData.district} (PIN: ${formData.pincode})\n`;
    if (formData.drugLicenseNo) msg += `*Drug Lic (20B/21B):* ${formData.drugLicenseNo}\n`;
    if (formData.gstNo) msg += `*GSTIN:* ${formData.gstNo}\n`;
    if (formData.message) {
      msg += `------------------------------------\n`;
      msg += `*Requirement / Remarks:*\n${formData.message}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `Please send rate card and onboarding account details.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/917709737577?text=${encoded}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200/80 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Form: Chemist Onboarding & Inquiry */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2 border border-teal-200/90 shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                Chemist & Hospital Onboarding
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
                Register Your Pharmacy for Wholesale Supply
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                Get access to daily updated PTR rate cards, bulk quantity discounts, and priority dispatch schedules from our Chalisgaon warehouse.
              </p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-4 shadow-sm"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Inquiry Received Successfully!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.contactPerson || formData.storeName}</strong>. Your pharmacy profile has been routed to our commercial billing team. You will receive your wholesale catalog & welcome rate card shortly on WhatsApp.
                </p>
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                  >
                    Submit Another Inquiry
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-50/90 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Pharmacy / Hospital Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Navjeevan Medical Store"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Contact Person & Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tejas Khodade (Proprietor / Pharmacist)"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 77097 37577"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. pharmacy@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Business Type
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    >
                      {businessTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Taluka (Jalgaon District)
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    >
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Town / City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chalisgaon / Dhule"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Drug License No. (Form 20B/21B or 20/21)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 20MH/JAL/465294"
                      value={formData.drugLicenseNo}
                      onChange={(e) => setFormData({ ...formData, drugLicenseNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      GSTIN Number (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="27XXXXX1234X1ZX"
                      value={formData.gstNo}
                      onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Specific Medicine Requirements / Inquiry Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about the brands, generic categories, or weekly volume you are looking to purchase..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                  />
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-900/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Submit Pharmacy Onboarding & Connect on WhatsApp
                  </motion.button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Direct Sales Desk: <strong>+91 77097 37577</strong> • Official Email: <strong>tejaskhodade5252@gmail.com</strong>
                  </p>
                </div>

              </form>
            )}

          </motion.div>

          {/* Right Column: FAQ Accordion & Quick Contacts */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2 border border-slate-200">
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                Frequently Asked Questions
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Wholesale Ordering & Delivery Policy
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span className="pr-2">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Visit Card */}
            <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white rounded-3xl border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>Visit Our Wholesale Depot</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">Sagar Distributor</strong><br />
                <span className="text-teal-300 font-medium">FDA D.L. No.: 20MH/JAL/465294 (20B/21B)</span><br />
                F-25, Ganesh Complex, Ganesh Road,<br />
                Chalisgaon, Dist. Jalgaon, Maharashtra - 424101, India.
              </p>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Call / WhatsApp:</span>
                <a href="tel:+917709737577" className="text-teal-300 font-bold hover:underline">
                  +91 77097 37577
                </a>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
