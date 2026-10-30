import React from 'react';
import { motion } from 'motion/react';
import { Award, MessageSquare, Star, Quote, Building2, MapPin } from 'lucide-react';
import { TESTIMONIALS } from '../data/pharmaData';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-white border-b border-slate-200/80 scroll-mt-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 text-xs font-black uppercase tracking-wider mb-3 border border-amber-200/90 shadow-xs">
            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Verified Chemist Reviews & Ratings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display tracking-tight">
            Reviews from 1,200+ Pharmacists Across Jalgaon
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mt-3 leading-relaxed">
            Read what community medical store owners, nursing homes, and clinical procurement heads say about Sagar Distributor’s service.
          </p>
        </motion.div>

        {/* Testimonials 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {TESTIMONIALS.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-slate-50/90 rounded-3xl p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between relative group hover:border-teal-400"
            >
              <div>
                {/* 5-star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-teal-600/20 mb-2" />

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 font-display">
                    {testimonial.storeName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {testimonial.owner}
                  </p>
                </div>

                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-600" />
                  {testimonial.location}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-cyan-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-xs">
              ★
            </div>
            <div>
              <span className="text-sm font-black text-slate-900 block">4.9 / 5.0 Average Wholesale Rating</span>
              <span className="text-xs text-slate-600">Based on regular billing reviews across Jalgaon, Dhule, Nashik & Sambhajinagar chemists</span>
            </div>
          </div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href="https://wa.me/917709737577?text=Hello%20Sagar%20Distributor,%20I%20am%20a%20chemist%20and%20want%20to%20open%20a%20wholesale%20account."
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm shrink-0"
          >
            Join 1,200+ Partner Chemists
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};
