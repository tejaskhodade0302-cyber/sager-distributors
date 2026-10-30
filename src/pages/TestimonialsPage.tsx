import React from 'react';
import { PageBanner } from '../components/PageBanner';
import { Testimonials } from '../components/Testimonials';
import { Star, MessageSquare, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { SAGAR_CONTACT } from '../data/pharmaData';

export const TestimonialsPage: React.FC = () => {
  return (
    <div className="space-y-0">
      <PageBanner
        title="Chemist Reviews & Partner Feedback"
        subtitle="Read verified reviews from retail medical store proprietors, hospital pharmacy superintendents, and doctors across Chalisgaon and all 15 Talukas of Jalgaon."
        badge="4.9 / 5.0 Rating • 1,200+ Verified Chemist Reviews"
      />

      {/* Main Testimonials Grid */}
      <Testimonials />

      {/* Rating Callout Banner */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Trusted for over 15+ Years</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-display">
            Are You a Chemist in Jalgaon District?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Share your experience with our daily van delivery service, packaging quality, or wholesale PTR rates. Your feedback helps us continuously elevate healthcare delivery.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${SAGAR_CONTACT.whatsappNumber}?text=Hello%20Sagar%20Distributor,%20I%20am%20a%20partner%20chemist%20and%20would%20like%20to%20share%20my%20feedback.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share Chemist Feedback on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
