import React, { useEffect } from 'react';
import BillingApp from '../billing/BillingApp';

export const BillingPortalPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Billing & Inventory Software | Sagar Distributor POS';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <BillingApp />
    </div>
  );
};

export default BillingPortalPage;
