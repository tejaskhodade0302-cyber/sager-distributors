import React, { useState, useEffect } from 'react';
import { Supplier, PurchaseInvoice, Product, InvoiceItem, LedgerEntry } from '../../types';
import { db } from '../../services/db';
import { calculateItemGst, calculateInvoiceTotals } from '../../utils/gstCalculations';
import { formatIndianCurrency, formatIndianNumber, formatDateIndian } from '../../utils/indianFormatters';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Truck,
  Plus,
  Search,
  FileText,
  CreditCard,
  Trash2,
  Edit,
  X,
  Save,
  CheckCircle,
} from 'lucide-react';

export const SuppliersAndPurchases: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'purchases' | 'new_purchase' | 'suppliers'>('purchases');

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Search & Filters
  const [search, setSearch] = useState('');

  // Supplier modal
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteSupplierId, setDeleteSupplierId] = useState<string | null>(null);

  // Supplier form
  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Pune',
    state: 'Maharashtra',
    stateCode: '27',
    gstin: '',
    openingBalance: 0,
  });

  // New Purchase Form
  const [purchaseNo, setPurchaseNo] = useState('');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [purchaseItems, setPurchaseItems] = useState<InvoiceItem[]>([]);
  const [purchasePaymentMode, setPurchasePaymentMode] = useState<'cash' | 'bank' | 'credit' | 'upi'>('credit');
  const [purchasePaidAmount, setPurchasePaidAmount] = useState(0);

  // Supplier Ledger Modal
  const [selectedLedgerSupplier, setSelectedLedgerSupplier] = useState<Supplier | null>(null);
  const [supplierLedgerEntries, setSupplierLedgerEntries] = useState<LedgerEntry[]>([]);

  const loadData = () => {
    setSuppliers(db.getSuppliers());
    setPurchases(db.getPurchases());
    setProducts(db.getProducts());
    setPurchaseNo(db.generateNextPurchaseNumber());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (suppliers.length > 0 && !selectedSupplierId) {
      setSelectedSupplierId(suppliers[0].id);
    }
  }, [suppliers, selectedSupplierId]);

  // Totals for purchase draft
  const purchaseTotals = calculateInvoiceTotals(purchaseItems);

  useEffect(() => {
    if (purchasePaymentMode === 'credit') {
      setPurchasePaidAmount(0);
    } else {
      setPurchasePaidAmount(purchaseTotals.grandTotal);
    }
  }, [purchasePaymentMode, purchaseTotals.grandTotal]);

  const purchaseBalanceDue = Math.max(0, purchaseTotals.grandTotal - purchasePaidAmount);

  // Add Item to Purchase Draft
  const handleAddPurchaseItem = (product: Product) => {
    const existingIndex = purchaseItems.findIndex((i) => i.productId === product.id);
    if (existingIndex !== -1) {
      const updated = [...purchaseItems];
      const newQty = updated[existingIndex].quantity + 1;
      const calc = calculateItemGst({
        rate: updated[existingIndex].rate,
        quantity: newQty,
        discountType: 'percentage',
        discountValue: 0,
        gstRate: updated[existingIndex].gstRate,
        isInterState: false,
      });
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        taxableAmount: calc.taxableAmount,
        cgstAmount: calc.cgstAmount,
        sgstAmount: calc.sgstAmount,
        totalTaxAmount: calc.totalTaxAmount,
        lineTotal: calc.lineTotal,
      };
      setPurchaseItems(updated);
      return;
    }

    const calc = calculateItemGst({
      rate: product.purchasePrice,
      quantity: 10,
      discountType: 'percentage',
      discountValue: 0,
      gstRate: product.gstRate,
      isInterState: false,
    });

    const newItem: InvoiceItem = {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      hsn: product.hsn,
      unit: product.unit,
      quantity: 10,
      rate: product.purchasePrice,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: 0,
      taxableAmount: calc.taxableAmount,
      gstRate: product.gstRate,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: 0,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };

    setPurchaseItems([...purchaseItems, newItem]);
  };

  const handleUpdateItemQty = (index: number, qty: number) => {
    const item = purchaseItems[index];
    const calc = calculateItemGst({
      rate: item.rate,
      quantity: Math.max(1, qty),
      discountType: item.discountType,
      discountValue: item.discountValue,
      gstRate: item.gstRate,
      isInterState: false,
    });
    const updated = [...purchaseItems];
    updated[index] = {
      ...item,
      quantity: Math.max(1, qty),
      taxableAmount: calc.taxableAmount,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };
    setPurchaseItems(updated);
  };

  const handleUpdateItemRate = (index: number, rate: number) => {
    const item = purchaseItems[index];
    const calc = calculateItemGst({
      rate: Math.max(0, rate),
      quantity: item.quantity,
      discountType: item.discountType,
      discountValue: item.discountValue,
      gstRate: item.gstRate,
      isInterState: false,
    });
    const updated = [...purchaseItems];
    updated[index] = {
      ...item,
      rate: Math.max(0, rate),
      taxableAmount: calc.taxableAmount,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };
    setPurchaseItems(updated);
  };

  const handleRemovePurchaseItem = (index: number) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  // Save Purchase
  const handleSavePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      showToast('Validation Error', 'Please select a supplier.', 'error');
      return;
    }
    if (purchaseItems.length === 0) {
      showToast('Validation Error', 'Please add at least one product to the purchase bill.', 'error');
      return;
    }

    const supplier = suppliers.find((s) => s.id === selectedSupplierId);
    if (!supplier) return;

    const effectivePaid = Math.min(purchaseTotals.grandTotal, Math.max(0, purchasePaidAmount));
    const effectiveBalance = Math.max(0, purchaseTotals.grandTotal - effectivePaid);

    let paymentStatus: 'paid' | 'partial' | 'unpaid' = 'unpaid';
    if (effectiveBalance === 0) paymentStatus = 'paid';
    else if (effectivePaid > 0) paymentStatus = 'partial';

    const created = db.createPurchase({
      purchaseNo,
      supplierInvoiceNo: supplierInvoiceNo || `INV-${Date.now().toString().slice(-4)}`,
      date: purchaseDate,
      supplierId: supplier.id,
      supplierName: supplier.companyName,
      supplierGstin: supplier.gstin,
      items: purchaseItems,
      subTotal: purchaseTotals.subTotal,
      totalTax: purchaseTotals.totalTax,
      roundOff: purchaseTotals.roundOff,
      grandTotal: purchaseTotals.grandTotal,
      paymentStatus,
      paymentMode: purchasePaymentMode,
      paidAmount: effectivePaid,
      balanceDue: effectiveBalance,
    });

    showToast(
      'Purchase Recorded',
      `Inward stock increased for ${purchaseItems.length} products (Bill: ₹${formatIndianNumber(created.grandTotal)})`,
      'success'
    );

    setPurchaseItems([]);
    setSupplierInvoiceNo('');
    loadData();
    setActiveTab('purchases');
  };

  // Save Supplier
  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierFormData.companyName.trim() || !supplierFormData.name.trim()) {
      showToast('Validation Error', 'Supplier Company Name and Contact Person are required.', 'error');
      return;
    }

    if (editingSupplier) {
      db.saveSupplier({
        id: editingSupplier.id,
        name: supplierFormData.name.trim(),
        companyName: supplierFormData.companyName.trim(),
        phone: supplierFormData.phone.trim(),
        email: supplierFormData.email.trim() || undefined,
        address: supplierFormData.address.trim(),
        city: supplierFormData.city.trim(),
        state: supplierFormData.state.trim(),
        stateCode: supplierFormData.stateCode.trim(),
        gstin: supplierFormData.gstin.trim().toUpperCase() || undefined,
        openingBalance: Number(supplierFormData.openingBalance) || 0,
      });
      showToast('Supplier Updated', `${supplierFormData.companyName} updated.`, 'success');
    } else {
      db.saveSupplier({
        name: supplierFormData.name.trim(),
        companyName: supplierFormData.companyName.trim(),
        phone: supplierFormData.phone.trim(),
        email: supplierFormData.email.trim() || undefined,
        address: supplierFormData.address.trim(),
        city: supplierFormData.city.trim(),
        state: supplierFormData.state.trim(),
        stateCode: supplierFormData.stateCode.trim(),
        gstin: supplierFormData.gstin.trim().toUpperCase() || undefined,
        openingBalance: Number(supplierFormData.openingBalance) || 0,
      });
      showToast('Supplier Added', `${supplierFormData.companyName} registered.`, 'success');
    }

    setIsSupplierModalOpen(false);
    loadData();
  };

  const handleOpenSupplierLedger = (s: Supplier) => {
    setSelectedLedgerSupplier(s);
    setSupplierLedgerEntries(db.getSupplierLedger(s.id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Suppliers & Inward Purchases
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record supplier bills, stock arrivals, payables, and purchase ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100/90 rounded-xl text-xs border border-slate-200/60">
            <button
              onClick={() => setActiveTab('purchases')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'purchases'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Purchase Bills ({purchases.length})
            </button>
            <button
              onClick={() => setActiveTab('new_purchase')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'new_purchase'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Inward Entry
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'suppliers'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Supplier Master ({suppliers.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: Purchases List */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">
              Inward Purchase Invoices
            </h3>
            <button
              onClick={() => setActiveTab('new_purchase')}
              className="text-xs bg-blue-600 text-white px-3.5 py-1.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              + Record Purchase Bill
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Purchase No</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Supplier Invoice No</th>
                  <th className="py-2.5 px-3">Supplier Name</th>
                  <th className="py-2.5 px-3 text-center">Items</th>
                  <th className="py-2.5 px-3 text-right">Taxable</th>
                  <th className="py-2.5 px-3 text-right">Grand Total</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-600">
                      {p.purchaseNo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {formatDateIndian(p.date)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-900">
                      {p.supplierInvoiceNo}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {p.supplierName}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">{p.items.length} items</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {formatIndianCurrency(p.subTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatIndianCurrency(p.grandTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          p.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {p.paymentStatus} ({p.paymentMode})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: New Inward Purchase Entry Form */}
      {activeTab === 'new_purchase' && (
        <form onSubmit={handleSavePurchase} className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase mb-3 tracking-wider">
              Supplier & Invoice Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Supplier / Vendor *
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.companyName} (Payable: ₹{formatIndianNumber(s.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Supplier Invoice No *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AW/PUN/26/9021"
                  value={supplierInvoiceNo}
                  onChange={(e) => setSupplierInvoiceNo(e.target.value)}
                  className="w-full font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Internal Entry Ref
                </label>
                <input
                  type="text"
                  disabled
                  value={purchaseNo}
                  className="w-full font-mono bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Product selector for inward purchase */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase mb-2">
              Select Products to Add to Inward Bill
            </h3>
            <div className="flex flex-wrap gap-2">
              {products.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleAddPurchaseItem(prod)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-xs font-medium text-slate-700 hover:text-blue-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3 h-3 text-blue-600" />
                  <span>{prod.name}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    (₹{prod.purchasePrice})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Inward Items Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-center w-24">Inward Qty</th>
                  <th className="py-2.5 px-3 text-right w-28">Cost Rate (₹)</th>
                  <th className="py-2.5 px-3 text-right w-28">Taxable</th>
                  <th className="py-2.5 px-3 text-right w-24">GST (₹)</th>
                  <th className="py-2.5 px-3 text-right w-28">Total (₹)</th>
                  <th className="py-2.5 px-3 text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No products added to this inward purchase bill. Select from above.
                    </td>
                  </tr>
                ) : (
                  purchaseItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {item.productName}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => handleUpdateItemQty(idx, Number(e.target.value))}
                          className="w-16 text-center font-mono py-1 border border-slate-200 rounded-lg bg-white text-slate-900 text-xs focus:border-blue-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          step={0.5}
                          value={item.rate}
                          onChange={(e) => handleUpdateItemRate(idx, Number(e.target.value))}
                          className="w-20 text-right font-mono py-1 px-1.5 border border-slate-200 rounded-lg bg-white text-slate-900 text-xs focus:border-blue-500"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">
                        {formatIndianCurrency(item.taxableAmount)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">
                        {formatIndianCurrency(item.totalTaxAmount)} ({item.gstRate}%)
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {formatIndianCurrency(item.lineTotal)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemovePurchaseItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Payment Mode and Save */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-700">Payment Terms:</div>
              <div className="flex gap-2">
                {(['credit', 'bank', 'cash', 'upi'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPurchasePaymentMode(m)}
                    className={`px-3 py-1.5 rounded-xl uppercase text-xs font-semibold border transition-all cursor-pointer ${
                      purchasePaymentMode === m
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs text-slate-500">
                Grand Total: <span className="font-mono font-bold text-base text-slate-900">{formatIndianCurrency(purchaseTotals.grandTotal)}</span>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save & Update Stock
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: Supplier Master */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">
              Supplier Directory
            </h3>
            <button
              onClick={() => {
                setEditingSupplier(null);
                setSupplierFormData({
                  name: '',
                  companyName: '',
                  phone: '',
                  email: '',
                  address: '',
                  city: 'Pune',
                  state: 'Maharashtra',
                  stateCode: '27',
                  gstin: '',
                  openingBalance: 0,
                });
                setIsSupplierModalOpen(true);
              }}
              className="text-xs bg-blue-600 text-white px-3.5 py-1.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              + Register Supplier
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Company / Depot Name</th>
                  <th className="py-2.5 px-3">Contact Person</th>
                  <th className="py-2.5 px-3">Phone & GSTIN</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3 text-right">Outstanding Payable</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {s.companyName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {s.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-slate-800 font-medium">{s.phone}</div>
                      <div className="font-mono text-[10px] text-slate-400">{s.gstin || 'N/A'}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{s.city}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-600">
                      {formatIndianCurrency(s.currentBalance)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenSupplierLedger(s)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Supplier Ledger"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSupplier(s);
                            setSupplierFormData({
                              name: s.name,
                              companyName: s.companyName,
                              phone: s.phone,
                              email: s.email || '',
                              address: s.address,
                              city: s.city,
                              state: s.state,
                              stateCode: s.stateCode,
                              gstin: s.gstin || '',
                              openingBalance: s.openingBalance,
                            });
                            setIsSupplierModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Edit Supplier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Supplier Register Modal */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200/80 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {editingSupplier ? 'Edit Supplier' : 'Register New FMCG Supplier'}
            </h3>
            <form onSubmit={handleSaveSupplier} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700">Company / Depot Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adani Wilmar & ITC C&F Depot"
                  value={supplierFormData.companyName}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, companyName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={supplierFormData.name}
                    onChange={(e) => setSupplierFormData({ ...supplierFormData, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={supplierFormData.phone}
                    onChange={(e) => setSupplierFormData({ ...supplierFormData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-slate-700">GSTIN</label>
                <input
                  type="text"
                  placeholder="27AACCA1829D1Z5"
                  value={supplierFormData.gstin}
                  onChange={(e) => setSupplierFormData({ ...supplierFormData, gstin: e.target.value })}
                  className="w-full uppercase font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSupplierModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supplier Ledger Modal */}
      {selectedLedgerSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200/80 shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Supplier Ledger: {selectedLedgerSupplier.companyName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Current Payable: <strong className="text-rose-600 font-mono">{formatIndianCurrency(selectedLedgerSupplier.currentBalance)}</strong>
                </p>
              </div>
              <button 
                onClick={() => setSelectedLedgerSupplier(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Ref No</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Debit (-)</th>
                    <th className="py-2.5 px-3 text-right">Credit (+)</th>
                    <th className="py-2.5 px-3 text-right">Payable Bal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {supplierLedgerEntries.map((e, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2 px-3 text-slate-600">{formatDateIndian(e.date)}</td>
                      <td className="py-2 px-3 font-mono text-slate-800">{e.referenceNo}</td>
                      <td className="py-2 px-3 text-slate-700">{e.description}</td>
                      <td className="py-2 px-3 text-right font-mono text-emerald-600 font-semibold">
                        {e.debit > 0 ? formatIndianCurrency(e.debit) : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-rose-600 font-semibold">
                        {e.credit > 0 ? formatIndianCurrency(e.credit) : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {formatIndianCurrency(e.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
