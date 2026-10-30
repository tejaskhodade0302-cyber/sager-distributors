import React, { useState, useEffect } from 'react';
import { SalesReturn, PurchaseReturn, Product, Customer, Supplier, SalesInvoice } from '../../types';
import { db } from '../../services/db';
import { formatIndianCurrency, formatIndianNumber, formatDateIndian } from '../../utils/indianFormatters';
import { useToast } from '../../context/ToastContext';
import { RotateCcw, Plus, Trash2, Printer, CheckCircle } from 'lucide-react';

export const ReturnsManagement: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'sales_returns' | 'purchase_returns'>('sales_returns');

  const [salesReturns, setSalesReturns] = useState<SalesReturn[]>([]);
  const [purchaseReturns, setPurchaseReturns] = useState<PurchaseReturn[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);

  // Create Sales Return Form
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [selectedCustId, setSelectedCustId] = useState('');
  const [selectedInvoiceNo, setSelectedInvoiceNo] = useState('');
  const [returnReason, setReturnReason] = useState('Damaged goods during transit');
  const [returnItems, setReturnItems] = useState<{ productId: string; qty: number; rate: number }[]>([]);

  const loadData = () => {
    setSalesReturns(db.getSalesReturns());
    setPurchaseReturns(db.getPurchaseReturns());
    setCustomers(db.getCustomers());
    setSuppliers(db.getSuppliers());
    setProducts(db.getProducts());
    setInvoices(db.getInvoices());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddReturnItemRow = () => {
    if (products.length > 0) {
      setReturnItems([...returnItems, { productId: products[0].id, qty: 1, rate: products[0].sellingPrice }]);
    }
  };

  const handleSaveSalesReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustId) {
      showToast('Validation Error', 'Please select a customer.', 'error');
      return;
    }
    if (returnItems.length === 0) {
      showToast('Validation Error', 'Please add at least one returned product.', 'error');
      return;
    }

    const customer = customers.find((c) => c.id === selectedCustId);
    if (!customer) return;

    let totalAmount = 0;
    const formattedItems = returnItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const lineTot = item.qty * item.rate;
      totalAmount += lineTot;

      return {
        productId: item.productId,
        productName: prod ? prod.name : 'Item',
        sku: prod ? prod.sku : '',
        hsn: prod ? prod.hsn : '',
        unit: prod ? prod.unit : 'pcs',
        quantity: item.qty,
        rate: item.rate,
        discountType: 'percentage' as const,
        discountValue: 0,
        discountAmount: 0,
        taxableAmount: lineTot,
        gstRate: prod ? prod.gstRate : 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        totalTaxAmount: 0,
        lineTotal: lineTot,
      };
    });

    const returnNo = db.generateNextReturnNumber('CRN');
    db.createSalesReturn({
      returnNo,
      originalInvoiceNo: selectedInvoiceNo || undefined,
      customerId: customer.id,
      customerName: customer.shopName,
      date: new Date().toISOString().split('T')[0],
      items: formattedItems,
      totalAmount,
      reason: returnReason,
      refundStatus: 'adjusted_in_ledger',
    });

    showToast('Credit Note Generated', `Stock restored and ledger credited with ₹${totalAmount}.`, 'success');
    setIsSalesModalOpen(false);
    setReturnItems([]);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Returns & Credit / Debit Notes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process sales returns from retailers (Credit Notes) and purchase returns to suppliers (Debit Notes).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (customers.length > 0) setSelectedCustId(customers[0].id);
              if (products.length > 0) {
                setReturnItems([{ productId: products[0].id, qty: 1, rate: products[0].sellingPrice }]);
              }
              setIsSalesModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + New Sales Return (Credit Note)
          </button>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-900">
            Credit Notes / Sales Returns
          </h3>
          <span className="text-xs text-slate-500 font-medium">Total: {salesReturns.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Credit Note No</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer / Retailer</th>
                <th className="py-2.5 px-3">Orig Invoice</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3 text-right">Credit Amount</th>
                <th className="py-2.5 px-3 text-center">Ledger Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesReturns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No sales returns recorded yet.
                  </td>
                </tr>
              ) : (
                salesReturns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                      {ret.returnNo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{formatDateIndian(ret.date)}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {ret.customerName}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {ret.originalInvoiceNo || 'Direct Return'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{ret.reason}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                      {formatIndianCurrency(ret.totalAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                        Adjusted in Ledger
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sales Return Modal */}
      {isSalesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200/80 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Create Credit Note (Sales Return)
            </h3>
            <form onSubmit={handleSaveSalesReturn} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Customer *</label>
                  <select
                    value={selectedCustId}
                    onChange={(e) => setSelectedCustId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.shopName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Original Invoice Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. SD/2026-27/0002"
                    value={selectedInvoiceNo}
                    onChange={(e) => setSelectedInvoiceNo(e.target.value)}
                    className="w-full font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700">Return Reason</label>
                <input
                  type="text"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Items returning */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700">Items Returned (Stock will be added back):</span>
                  <button
                    type="button"
                    onClick={handleAddReturnItemRow}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    + Add Item Line
                  </button>
                </div>
                <div className="space-y-2">
                  {returnItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const prod = products.find((p) => p.id === e.target.value);
                          const updated = [...returnItems];
                          updated[idx] = {
                            ...updated[idx],
                            productId: e.target.value,
                            rate: prod ? prod.sellingPrice : updated[idx].rate,
                          };
                          setReturnItems(updated);
                        }}
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) => {
                          const updated = [...returnItems];
                          updated[idx].qty = Number(e.target.value);
                          setReturnItems(updated);
                        }}
                        className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-center font-mono text-xs text-slate-900"
                      />
                      <input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => {
                          const updated = [...returnItems];
                          updated[idx].rate = Number(e.target.value);
                          setReturnItems(updated);
                        }}
                        className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-right font-mono text-xs text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setReturnItems(returnItems.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSalesModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Credit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
