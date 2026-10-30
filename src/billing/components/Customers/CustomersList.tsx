import React, { useState, useEffect } from 'react';
import { Customer, LedgerEntry } from '../../types';
import { db } from '../../services/db';
import { formatIndianCurrency, formatIndianNumber, formatDateIndian } from '../../utils/indianFormatters';
import { validateGstin, validatePhone } from '../../utils/gstCalculations';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Users,
  Plus,
  Search,
  FileText,
  CreditCard,
  Printer,
  Share2,
  Trash2,
  Edit,
  X,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const CustomersList: React.FC = () => {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);

  // Customer Ledger Modal
  const [selectedLedgerCustomer, setSelectedLedgerCustomer] = useState<Customer | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);

  // Form fields
  const [formData, setFormData] = useState({
    customerCode: '',
    name: '',
    shopName: '',
    phone: '',
    email: '',
    address: '',
    city: 'CHALISGAON',
    state: 'Maharashtra',
    stateCode: '27',
    dlNo: '',
    gstin: '',
    creditLimit: 100000,
    creditDays: 21,
    openingBalance: 0,
  });

  const loadCustomers = () => {
    setCustomers(db.getCustomers());
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.shopName.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.customerCode && c.customerCode.includes(search)) ||
      (c.dlNo && c.dlNo.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search) ||
      (c.gstin && c.gstin.toLowerCase().includes(search.toLowerCase())) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      customerCode: `00${customers.length + 20}`,
      name: '',
      shopName: '',
      phone: '',
      email: '',
      address: 'POTDAR SCHOOL.',
      city: 'CHALISGAON',
      state: 'Maharashtra',
      stateCode: '27',
      dlNo: '20MH/JAL/465294 , 21MH/JAL/465295',
      gstin: '',
      creditLimit: 100000,
      creditDays: 21,
      openingBalance: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      customerCode: c.customerCode || '',
      name: c.name,
      shopName: c.shopName,
      phone: c.phone,
      email: c.email || '',
      address: c.address,
      city: c.city,
      state: c.state,
      stateCode: c.stateCode,
      dlNo: c.dlNo || '',
      gstin: c.gstin || '',
      creditLimit: c.creditLimit,
      creditDays: c.creditDays,
      openingBalance: c.openingBalance,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.shopName.trim()) {
      showToast('Validation Error', 'Contact Name and Shop Name are required.', 'error');
      return;
    }

    if (formData.gstin.trim()) {
      const gstinVal = validateGstin(formData.gstin);
      if (!gstinVal.isValid) {
        showToast('Invalid GSTIN', gstinVal.error || 'Please check GSTIN format.', 'error');
        return;
      }
    }

    if (editingCustomer) {
      db.saveCustomer({
        id: editingCustomer.id,
        customerCode: formData.customerCode.trim() || undefined,
        name: formData.name.trim(),
        shopName: formData.shopName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        stateCode: formData.stateCode.trim(),
        dlNo: formData.dlNo.trim() || undefined,
        gstin: formData.gstin.trim().toUpperCase() || undefined,
        creditLimit: Number(formData.creditLimit) || 0,
        creditDays: Number(formData.creditDays) || 15,
        openingBalance: Number(formData.openingBalance) || 0,
      });
      showToast('Customer Updated', `${formData.shopName} profile updated.`, 'success');
    } else {
      db.saveCustomer({
        customerCode: formData.customerCode.trim() || undefined,
        name: formData.name.trim(),
        shopName: formData.shopName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        stateCode: formData.stateCode.trim(),
        dlNo: formData.dlNo.trim() || undefined,
        gstin: formData.gstin.trim().toUpperCase() || undefined,
        creditLimit: Number(formData.creditLimit) || 0,
        creditDays: Number(formData.creditDays) || 15,
        openingBalance: Number(formData.openingBalance) || 0,
      });
      showToast('Customer Added', `${formData.shopName} added to customer directory.`, 'success');
    }

    setIsModalOpen(false);
    loadCustomers();
  };

  const confirmDelete = () => {
    if (!deleteCustomerId) return;
    const success = db.deleteCustomer(deleteCustomerId);
    if (success) {
      showToast('Customer Removed', 'Customer deleted from directory.', 'info');
      loadCustomers();
    }
    setDeleteCustomerId(null);
  };

  const handleOpenLedger = (c: Customer) => {
    setSelectedLedgerCustomer(c);
    const entries = db.getCustomerLedger(c.id);
    setLedgerEntries(entries);
  };

  // WhatsApp balance reminder
  const handleSendReminder = (c: Customer) => {
    const biz = db.getBusinessProfile();
    const phone = c.phone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Dear ${c.name} (${c.shopName}),\n` +
      `Greetings from *${biz.businessName}*.\n` +
      `This is a gentle reminder regarding your current ledger balance of *${formatIndianCurrency(c.currentBalance)}*.\n` +
      `Kindly arrange the payment at your earliest convenience.\n\n` +
      `*Bank Details:*\n` +
      `Bank: ${biz.bankName}\n` +
      `A/C: ${biz.accountNo} (IFSC: ${biz.ifscCode})\n` +
      `UPI ID: ${biz.upiId}\n\n` +
      `Thank you for your valued partnership!`
    );
    window.open(`https://wa.me/91${phone.slice(-10)}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Wholesale Customers & Retailers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage dealer directory, GSTIN details, credit parameters, and real-time ledger statements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by shop name, contact person, phone, city, GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>
        <div className="text-xs text-slate-500">
          Total Dealers: <strong>{customers.length}</strong>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Shop / Business Name</th>
                <th className="py-2.5 px-3">Contact Person</th>
                <th className="py-2.5 px-3">Location & GSTIN</th>
                <th className="py-2.5 px-3 text-right">Credit Limit</th>
                <th className="py-2.5 px-3 text-center">Credit Days</th>
                <th className="py-2.5 px-3 text-right">Outstanding Bal</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No customers found matching the search.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const isOverCredit = c.creditLimit > 0 && c.currentBalance > c.creditLimit;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                          {c.customerCode && (
                            <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold rounded">
                              {c.customerCode}
                            </span>
                          )}
                          <span>{c.shopName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Ph: {c.phone} {c.email ? `· ${c.email}` : ''}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {c.name}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="text-slate-700">
                          {c.city}, {c.state} ({c.stateCode})
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {c.dlNo ? `DL: ${c.dlNo}` : (c.gstin ? `GST: ${c.gstin}` : 'Unregistered')}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {formatIndianCurrency(c.creditLimit)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        {c.creditDays} days
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`font-mono font-bold text-xs ${
                            c.currentBalance > 0
                              ? isOverCredit
                                ? 'text-rose-600'
                                : 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {formatIndianCurrency(c.currentBalance)}
                        </span>
                        {isOverCredit && (
                          <div className="text-[9px] text-rose-500 font-semibold">Limit Exceeded!</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenLedger(c)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="View Statement & Running Ledger"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          {c.currentBalance > 0 && (
                            <button
                              onClick={() => handleSendReminder(c)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                              title="Send WhatsApp Payment Reminder"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1 text-slate-500 hover:text-blue-600 rounded cursor-pointer"
                            title="Edit Customer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteCustomerId(c.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Ledger Statement Modal */}
      {selectedLedgerCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Customer Ledger Statement: {selectedLedgerCustomer.shopName}
                </h3>
                <p className="text-xs text-slate-500">
                  Contact: {selectedLedgerCustomer.name} · Ph: {selectedLedgerCustomer.phone} · GSTIN:{' '}
                  {selectedLedgerCustomer.gstin || 'Unregistered'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Print Statement"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedLedgerCustomer(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-3 mb-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs">
              <div>
                <span className="text-slate-500 block">Credit Limit:</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatIndianCurrency(selectedLedgerCustomer.creditLimit)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Total Transactions:</span>
                <span className="font-mono font-bold text-slate-900">{ledgerEntries.length} entries</span>
              </div>
              <div>
                <span className="text-slate-500 block">Current Balance Due:</span>
                <span className="font-mono font-bold text-rose-600 text-sm">
                  {formatIndianCurrency(selectedLedgerCustomer.currentBalance)}
                </span>
              </div>
            </div>

            {/* Entries Table */}
            <div className="overflow-x-auto max-h-96 border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Ref No</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Debit (+)</th>
                    <th className="py-2.5 px-3 text-right">Credit (-)</th>
                    <th className="py-2.5 px-3 text-right">Running Bal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ledgerEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No ledger entries recorded for this customer yet.
                      </td>
                    </tr>
                  ) : (
                    ledgerEntries.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 text-slate-600 font-mono">
                          {formatDateIndian(entry.date)}
                        </td>
                        <td className="py-2 px-3 font-semibold uppercase text-[10px]">
                          {entry.type}
                        </td>
                        <td className="py-2 px-3 font-mono text-blue-700 font-medium">
                          {entry.referenceNo}
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {entry.description}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-900">
                          {entry.debit > 0 ? formatIndianCurrency(entry.debit) : '—'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-700 font-medium">
                          {entry.credit > 0 ? formatIndianCurrency(entry.credit) : '—'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                          {formatIndianCurrency(entry.balance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setSelectedLedgerCustomer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingCustomer ? 'Edit Customer Details' : 'Register New Wholesale Retailer'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Cust Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0019"
                    value={formData.customerCode}
                    onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })}
                    className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Shop / Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0019 OM MEDICAL"
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Santosh Agarwal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822188442"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Drug License No. (D.L.No.)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20MH/JAL/465294 , 21MH/JAL/465295"
                  value={formData.dlNo}
                  onChange={(e) => setFormData({ ...formData, dlNo: e.target.value })}
                  className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shop 4, Ganga Satellite Complex, Wanowrie"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    State & Code
                  </label>
                  <select
                    value={`${formData.stateCode}-${formData.state}`}
                    onChange={(e) => {
                      const [code, state] = e.target.value.split('-');
                      setFormData({ ...formData, stateCode: code, state });
                    }}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500"
                  >
                    <option value="27-Maharashtra">27 - Maharashtra</option>
                    <option value="24-Gujarat">24 - Gujarat (Inter-state)</option>
                    <option value="29-Karnataka">29 - Karnataka (Inter-state)</option>
                    <option value="07-Delhi">07 - Delhi (Inter-state)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    GSTIN Number (15 Digits)
                  </label>
                  <input
                    type="text"
                    placeholder="27AABCM8291F1Z3"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="w-full uppercase font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                    className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Allowed Credit Days
                  </label>
                  <input
                    type="number"
                    value={formData.creditDays}
                    onChange={(e) => setFormData({ ...formData, creditDays: Number(e.target.value) })}
                    className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {!editingCustomer && (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Opening Balance (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.openingBalance}
                      onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}
                      className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xs cursor-pointer transition-colors"
                >
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteCustomerId)}
        title="Delete Customer?"
        message="Are you sure you want to remove this retailer from the customer directory? Their past transaction history and invoices will remain intact."
        confirmLabel="Yes, Delete Customer"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteCustomerId(null)}
      />
    </div>
  );
};
