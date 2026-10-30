import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, ShieldCheck } from 'lucide-react';

interface PageBannerProps {
  title: string;
  subtitle: string;
  badge?: string;
  parentLabel?: string;
  parentLink?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  badge = 'Sagar Distributor • Chalisgaon',
  parentLabel,
  parentLink,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-slate-800 relative overflow-hidden w-full">
      {/* Background Subtle Highlights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-slate-300 mb-4 flex-wrap">
          <Link
            to="/"
            className="hover:text-teal-400 transition-colors inline-flex items-center gap-1.5 font-semibold"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          {parentLabel && parentLink && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              <Link
                to={parentLink}
                className="hover:text-teal-400 transition-colors font-semibold"
              >
                {parentLabel}
              </Link>
            </>
          )}

          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-teal-300 font-bold">{title}</span>
        </nav>

        {/* Badge & Title */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-300 text-xs sm:text-sm font-bold border border-teal-500/20 mb-3 backdrop-blur-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{badge}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight max-w-5xl leading-tight">
          {title}
        </h1>

        <p className="mt-3.5 text-base sm:text-lg lg:text-xl text-slate-200 max-w-4xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
