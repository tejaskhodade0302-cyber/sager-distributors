import React, { useState, useEffect } from 'react';
import { PaymentRecord, Customer, Supplier, SalesInvoice } from '../../types';
import { db } from '../../services/db';
import { formatIndianCurrency, formatIndianNumber, formatDateIndian } from '../../utils/indianFormatters';
import { useToast } from '../../context/ToastContext';
import { CreditCard, Plus, Search, Share2, ArrowDownLeft, ArrowUpRight, CheckCircle, Clock } from 'lucide-react';

export const PaymentsManagement: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'vouchers' | 'aging_report'>('vouchers');

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);

  // Record Voucher Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voucherType, setVoucherType] = useState<'receipt' | 'payment'>('receipt');
  const [selectedPartyId, setSelectedPartyId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'bank' | 'cheque'>('upi');
  const [referenceNo, setReferenceNo] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = () => {
    setPayments(db.getPayments());
    setCustomers(db.getCustomers());
    setSuppliers(db.getSuppliers());
    setInvoices(db.getInvoices());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (voucherType === 'receipt') {
      if (customers.length > 0 && !selectedPartyId) setSelectedPartyId(customers[0].id);
    } else {
      if (suppliers.length > 0 && !selectedPartyId) setSelectedPartyId(suppliers[0].id);
    }
  }, [voucherType, customers, suppliers, selectedPartyId]);

  // Aging Analysis Calculation
  // 0-30, 31-60, 61-90, 90+ days
  const now = new Date();
  const agingReport = customers
    .filter((c) => c.currentBalance > 0)
    .map((c) => {
      // Find customer's active unpaid invoices
      const custInvoices = invoices.filter(
        (inv) => inv.customerId === c.id && inv.status === 'active' && inv.balanceDue > 0
      );

      let b0_30 = 0;
      let b31_60 = 0;
      let b61_90 = 0;
      let b90_plus = 0;

      for (const inv of custInvoices) {
        const invDate = new Date(inv.date);
        const ageDays = Math.floor((now.getTime() - invDate.getTime()) / (1000 * 60 * 60 * 24));
        if (ageDays <= 30) b0_30 += inv.balanceDue;
        else if (ageDays <= 60) b31_60 += inv.balanceDue;
        else if (ageDays <= 90) b61_90 += inv.balanceDue;
        else b90_plus += inv.balanceDue;
      }

      // If invoices didn't cover opening balance, allocate remainder to 90+
      const accounted = b0_30 + b31_60 + b61_90 + b90_plus;
      if (c.currentBalance > accounted) {
        b90_plus += c.currentBalance - accounted;
      }

      return {
        customer: c,
        totalDue: c.currentBalance,
        b0_30,
        b31_60,
        b61_90,
        b90_plus,
      };
    });

  const handleOpenReceiptModal = () => {
    setVoucherType('receipt');
    if (customers.length > 0) setSelectedPartyId(customers[0].id);
    setAmount(0);
    setReferenceNo('');
    setSelectedInvoiceId('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenPaymentModal = () => {
    setVoucherType('payment');
    if (suppliers.length > 0) setSelectedPartyId(suppliers[0].id);
    setAmount(0);
    setReferenceNo('');
    setSelectedInvoiceId('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast('Validation Error', 'Payment amount must be greater than zero.', 'error');
      return;
    }

    const partyName =
      voucherType === 'receipt'
        ? customers.find((c) => c.id === selectedPartyId)?.shopName || 'Customer'
        : suppliers.find((s) => s.id === selectedPartyId)?.companyName || 'Supplier';

    const voucherNo = db.generateNextVoucherNumber(voucherType);

    const linkedInvoice = selectedInvoiceId
      ? invoices.find((i) => i.id === selectedInvoiceId)
      : undefined;

    db.recordPayment({
      voucherNo,
      type: voucherType,
      partyType: voucherType === 'receipt' ? 'customer' : 'supplier',
      partyId: selectedPartyId,
      partyName,
      date: new Date().toISOString().split('T')[0],
      amount: Number(amount),
      paymentMode,
      referenceNo: referenceNo.trim() || undefined,
      invoiceId: selectedInvoiceId || undefined,
      invoiceNo: linkedInvoice?.invoiceNo,
      notes: notes.trim() || undefined,
    });

    showToast(
      voucherType === 'receipt' ? 'Payment Received' : 'Payment Made',
      `Recorded ${voucherType} voucher ${voucherNo} of ₹${formatIndianNumber(amount)} for ${partyName}.`,
      'success'
    );

    setIsModalOpen(false);
    loadData();
  };

  const handleWhatsAppReminder = (c: Customer, due: number) => {
    const biz = db.getBusinessProfile();
    const phone = c.phone.replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello ${c.name} (${c.shopName}),\n` +
      `This is a payment reminder from *${biz.businessName}*.\n` +
      `Your total outstanding balance is *${formatIndianCurrency(due)}*.\n` +
      `Please clear the pending invoices via UPI (${biz.upiId}) or Bank Transfer.\n` +
      `Thank you!`
    );
    window.open(`https://wa.me/91${phone.slice(-10)}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Payments & Outstanding Receivables
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record customer receipts, supplier disbursements, and track aging of accounts receivable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl text-xs mr-2 border border-slate-200/60">
            <button
              onClick={() => setActiveTab('vouchers')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'vouchers'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Payment Vouchers ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab('aging_report')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'aging_report'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aging Analysis (Overdue)
            </button>
          </div>

          <button
            onClick={handleOpenReceiptModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            + Receive Payment
          </button>
          <button
            onClick={handleOpenPaymentModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            + Pay Supplier
          </button>
        </div>
      </div>

      {activeTab === 'vouchers' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">
              Recent Payment Transactions
            </h3>
            <span className="text-xs text-slate-500 font-medium">Total Vouchers: {payments.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Voucher No</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Party Name</th>
                  <th className="py-2.5 px-3">Mode & Ref</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3">Notes / Linked Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                      {pay.voucherNo}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          pay.type === 'receipt'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {pay.type === 'receipt' ? 'Receipt (In)' : 'Payment (Out)'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{formatDateIndian(pay.date)}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {pay.partyName}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold uppercase text-slate-800">{pay.paymentMode}</div>
                      {pay.referenceNo && (
                        <div className="text-[10px] font-mono text-slate-400">
                          Ref: {pay.referenceNo}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatIndianCurrency(pay.amount)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {pay.invoiceNo ? `Against Bill: ${pay.invoiceNo}` : pay.notes || 'On Account'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Aging Report Tab */
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Customer Accounts Receivable Aging Analysis
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Breakdown of pending credit balances grouped by aging brackets from invoice issue date.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 font-semibold border-b border-slate-200 text-slate-600">
                    <th className="py-2.5 px-3">Customer / Retailer</th>
                    <th className="py-2.5 px-3 text-right">0 - 30 Days</th>
                    <th className="py-2.5 px-3 text-right">31 - 60 Days</th>
                    <th className="py-2.5 px-3 text-right">61 - 90 Days</th>
                    <th className="py-2.5 px-3 text-right">90+ Days (Critical)</th>
                    <th className="py-2.5 px-3 text-right font-bold">Total Due (₹)</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agingReport.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Zero customer overdue balances! All accounts settled.
                      </td>
                    </tr>
                  ) : (
                    agingReport.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          <div>{row.customer.shopName}</div>
                          <div className="text-[10px] text-slate-500">{row.customer.phone}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-700">
                          {row.b0_30 > 0 ? formatIndianCurrency(row.b0_30) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-amber-600">
                          {row.b31_60 > 0 ? formatIndianCurrency(row.b31_60) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-orange-600">
                          {row.b61_90 > 0 ? formatIndianCurrency(row.b61_90) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                          {row.b90_plus > 0 ? formatIndianCurrency(row.b90_plus) : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          {formatIndianCurrency(row.totalDue)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleWhatsAppReminder(row.customer, row.totalDue)}
                            className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer border border-emerald-200"
                            title="Send WhatsApp Reminder"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Remind</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Voucher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200/80 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {voucherType === 'receipt'
                ? 'Record Customer Receipt Voucher'
                : 'Record Supplier Payment Voucher'}
            </h3>

            <form onSubmit={handleSaveVoucher} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">
                  {voucherType === 'receipt' ? 'Customer *' : 'Supplier *'}
                </label>
                <select
                  value={selectedPartyId}
                  onChange={(e) => setSelectedPartyId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {voucherType === 'receipt'
                    ? customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.shopName} (Bal Due: ₹{formatIndianNumber(c.currentBalance)})
                        </option>
                      ))
                    : suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.companyName} (Payable: ₹{formatIndianNumber(s.currentBalance)})
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Payment Amount (₹) *</label>
                <input
                  type="number"
                  step={1}
                  min={1}
                  required
                  placeholder="0.00"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full font-mono font-bold text-sm bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Payment Mode</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['upi', 'bank', 'cash', 'cheque'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMode(m)}
                      className={`py-1.5 px-2 rounded-xl uppercase font-semibold text-center border text-[11px] transition-all cursor-pointer ${
                        paymentMode === m
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">
                  Transaction Reference / Cheque No
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI/283940182 or Cheque 93821"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Internal Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Cleared bill on account"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
