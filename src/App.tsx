import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { CoveragePage } from './pages/CoveragePage';
import { WhyChooseUsPage } from './pages/WhyChooseUsPage';
import { RegulationsPage } from './pages/RegulationsPage';
import { CompliancePage } from './pages/CompliancePage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';
import { BillingPortalPage } from './pages/BillingPortalPage';
import { QuickOrderModal } from './components/QuickOrderModal';
import { SAGAR_CONTACT } from './data/pharmaData';
import { 
  MessageSquare, 
  FileText, 
  Check 
} from 'lucide-react';

function AppContent() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedTargetCompany, setSelectedTargetCompany] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const location = useLocation();

  const isBillingRoute = location.pathname.startsWith('/billing') || 
                         location.pathname.startsWith('/pos') || 
                         location.pathname.startsWith('/portal');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenOrderModal = (companyName?: string) => {
    if (companyName) {
      setSelectedTargetCompany(companyName);
    } else {
      setSelectedTargetCompany('');
    }
    setIsOrderModalOpen(true);
  };

  // Dedicated Fullscreen Sagar Distributor Billing & Inventory ERP Suite
  if (isBillingRoute) {
    return (
      <Routes>
        <Route path="/billing/*" element={<BillingPortalPage />} />
        <Route path="/billing" element={<BillingPortalPage />} />
        <Route path="/pos" element={<BillingPortalPage />} />
        <Route path="/portal" element={<BillingPortalPage />} />
        <Route path="*" element={<Navigate to="/billing" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-teal-500/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-right-4 duration-150">
          <Check className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header / Navigation with exact requested layout */}
      <Navbar onOpenOrderModal={() => handleOpenOrderModal()} />

      {/* Dynamic Multi-Page Router for Dedicated Separate Pages */}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenOrderModal={handleOpenOrderModal}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductsPage
                onOpenOrderModal={handleOpenOrderModal}
              />
            }
          />
          <Route
            path="/companies"
            element={
              <ProductsPage
                onOpenOrderModal={handleOpenOrderModal}
              />
            }
          />
          <Route
            path="/about"
            element={
              <AboutPage
                onOpenOrderModal={() => handleOpenOrderModal()}
              />
            }
          />
          <Route path="/coverage" element={<CoveragePage />} />
          <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
          <Route path="/regulations" element={<RegulationsPage />} />
          <Route path="/compliance" element={<Navigate to="/regulations" replace />} />
          <Route path="/reviews" element={<TestimonialsPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Quick Order / PO & Shortage Upload Modal */}
      <QuickOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialCompany={selectedTargetCompany}
      />

      {/* Sticky Floating Quick Contact & PO Bar on Mobile */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 flex items-center justify-between gap-3 shadow-lg">
        <a
          href={`https://wa.me/${SAGAR_CONTACT.whatsappNumber}?text=Hello%20Sagar%20Distributor,%20I%20want%20to%20place%20a%20wholesale%20medicine%20order.`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp Order</span>
        </a>

        <button
          onClick={() => handleOpenOrderModal()}
          className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>Upload PO Slip</span>
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <AppContent />
    </HashRouter>
  );
}
