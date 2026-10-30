import React, { useState, useEffect, useRef } from 'react';
import {
  Product,
  Customer,
  SalesInvoice,
  InvoiceItem,
  BusinessProfile,
  PaymentMode,
} from '../../types';
import { db } from '../../services/db';
import {
  calculateItemGst,
  calculateInvoiceTotals,
  recalculateItemsForState,
} from '../../utils/gstCalculations';
import {
  formatIndianCurrency,
  formatIndianNumber,
  numberToWordsIndian,
  formatDateIndian,
} from '../../utils/indianFormatters';
import { useToast } from '../../context/ToastContext';
import { InvoicePrintA4 } from './InvoicePrintA4';
import { InvoicePrintThermal } from './InvoicePrintThermal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Plus,
  Trash2,
  Printer,
  Save,
  Share2,
  AlertTriangle,
  UserPlus,
  Search,
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  Edit3,
  RotateCcw,
  X,
  Eye,
  Sparkles,
} from 'lucide-react';

interface SalesBillingProps {
  onNavigateToInvoice?: (invoiceId: string) => void;
}

export const SalesBilling: React.FC<SalesBillingProps> = () => {
  const { showToast } = useToast();
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(db.getBusinessProfile());
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);

  // Active view: 'new_invoice' or 'invoice_history'
  const [activeTab, setActiveTab] = useState<'new_invoice' | 'history'>('new_invoice');

  // Form states
  const [invoiceNo, setInvoiceNo] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('walk-in');
  const [customCustomerName, setCustomCustomerName] = useState<string>('');
  const [customCustomerPhone, setCustomCustomerPhone] = useState<string>('');

  // Items in current draft
  const [items, setItems] = useState<InvoiceItem[]>([]);

  // Item search / autocomplete
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Payment settings
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('credit');
  const [memoType, setMemoType] = useState<'CREDIT MEMO' | 'CASH MEMO'>('CREDIT MEMO');
  const [ewbNo, setEwbNo] = useState<string>('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState<string>('');

  // Print modal states
  const [printingInvoice, setPrintingInvoice] = useState<SalesInvoice | null>(null);
  const [printFormat, setPrintFormat] = useState<'A4' | 'THERMAL_80MM'>('A4');

  // Cancel invoice confirmation
  const [cancelInvoiceId, setCancelInvoiceId] = useState<string | null>(null);

  // Table view: Simple (clean essentials) vs Detailed (all 15 columns)
  const [isDetailedTable, setIsDetailedTable] = useState<boolean>(false);
  // Item detail spec modal (for editing Batch, Exp, MRP, DC in simple view)
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  // Quick Customer Creation modal
  const [showAddCustomerModal, setShowAddCustomerModal] = useState<boolean>(false);
  const [newCustCode, setNewCustCode] = useState('0020');
  const [newCustName, setNewCustName] = useState('');
  const [newCustShop, setNewCustShop] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('POTDAR SCHOOL.');
  const [newCustCity, setNewCustCity] = useState('CHALISGAON');
  const [newCustDlNo, setNewCustDlNo] = useState('20MH/JAL/465294 , 21MH/JAL/465295');
  const [newCustGstin, setNewCustGstin] = useState('');
  const [newCustCreditLimit, setNewCustCreditLimit] = useState(100000);

  // Load initial data
  const loadData = () => {
    const prof = db.getBusinessProfile();
    setBusinessProfile(prof);
    const prods = db.getProducts();
    setProducts(prods);
    const custs = db.getCustomers();
    setCustomers(custs);
    setInvoices(db.getInvoices());
    setInvoiceNo(db.generateNextInvoiceNumber());

    // Default select OM MEDICAL if exists
    const omMedical = custs.find((c) => c.customerCode === '0019' || c.shopName.includes('OM MEDICAL'));
    if (omMedical && (selectedCustomerId === 'walk-in' || !selectedCustomerId)) {
      setSelectedCustomerId(omMedical.id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Determine current customer object
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const customerStateCode = selectedCustomer ? selectedCustomer.stateCode : businessProfile.stateCode;
  const isInterState = customerStateCode !== businessProfile.stateCode;

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.hsn.includes(q) ||
        (p.mfr && p.mfr.toLowerCase().includes(q))
    );
    setSearchResults(matches.slice(0, 8));
    setIsSearchOpen(matches.length > 0);
  }, [searchQuery, products]);

  // Recalculate items when isInterState changes
  useEffect(() => {
    if (items.length > 0) {
      const updated = recalculateItemsForState(items, isInterState);
      setItems(updated);
    }
  }, [isInterState]);

  // Invoice Totals
  const totals = calculateInvoiceTotals(items);
  const totalUnitsWithFree = items.reduce((sum, item) => sum + (item.quantity || 0) + (item.freeQty || 0), 0);
  const totalGross = items.reduce((sum, item) => sum + (item.mrp || item.rate) * item.quantity, 0);

  // Automatically adjust paid amount when payment mode changes
  useEffect(() => {
    if (paymentMode === 'credit') {
      setPaidAmount(0);
      setMemoType('CREDIT MEMO');
    } else if (paymentMode === 'cash' || paymentMode === 'upi' || paymentMode === 'bank') {
      setPaidAmount(totals.grandTotal);
      setMemoType('CASH MEMO');
    }
  }, [paymentMode, totals.grandTotal]);

  const balanceDue = Math.max(0, totals.grandTotal - paidAmount);

  // Customer Credit Limit Warning
  const isCreditExceeded =
    selectedCustomer &&
    selectedCustomer.creditLimit > 0 &&
    selectedCustomer.currentBalance + balanceDue > selectedCustomer.creditLimit;

  const excessCreditAmount =
    selectedCustomer && isCreditExceeded
      ? selectedCustomer.currentBalance + balanceDue - selectedCustomer.creditLimit
      : 0;

  // Add Item to Invoice draft
  const handleAddItem = (product: Product) => {
    // Check if item already exists in table
    const existingIndex = items.findIndex((i) => i.productId === product.id);
    if (existingIndex !== -1) {
      handleQuantityChange(existingIndex, items[existingIndex].quantity + 1);
      setSearchQuery('');
      setIsSearchOpen(false);
      return;
    }

    const calc = calculateItemGst({
      rate: product.sellingPrice,
      quantity: 1,
      discountType: 'percentage',
      discountValue: 0,
      gstRate: product.gstRate,
      isInterState,
    });

    const newItem: InvoiceItem = {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      hsn: product.hsn,
      mfr: product.mfr || 'GEN',
      pack: product.pack || product.packSize || "10'S",
      mrp: product.mrp || product.sellingPrice,
      dc: product.dc || '',
      batchNo: product.batches?.[0]?.batchNo || 'HH2602078',
      expiryDate: product.batches?.[0]?.expiryDate || '01/28',
      unit: product.unit,
      quantity: 1,
      freeQty: 0,
      rate: product.sellingPrice,
      discountType: 'percentage',
      discountValue: 0,
      discountAmount: calc.discountAmount,
      taxableAmount: calc.taxableAmount,
      gstRate: product.gstRate,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: calc.igstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };

    setItems([...items, newItem]);
    setSearchQuery('');
    setIsSearchOpen(false);

    if (product.currentStock <= 0) {
      showToast('Low Stock Warning', `${product.name} is currently out of stock!`, 'warning');
    }
  };

  const handleFreeQtyChange = (index: number, val: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], freeQty: Math.max(0, val) };
    setItems(updated);
  };

  const handleDcChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], dc: val };
    setItems(updated);
  };

  const handleMfrChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], mfr: val.toUpperCase() };
    setItems(updated);
  };

  const handlePackChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], pack: val };
    setItems(updated);
  };

  const handleHsnChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], hsn: val };
    setItems(updated);
  };

  const handleMrpChange = (index: number, val: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], mrp: Math.max(0, val) };
    setItems(updated);
  };

  const handleBatchNoChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], batchNo: val };
    setItems(updated);
  };

  const handleExpiryChange = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], expiryDate: val };
    setItems(updated);
  };

  const handleGstRateChange = (index: number, newRate: number) => {
    const item = items[index];
    const calc = calculateItemGst({
      rate: item.rate,
      quantity: item.quantity,
      discountType: item.discountType,
      discountValue: item.discountValue,
      gstRate: newRate,
      isInterState,
    });

    const updated = [...items];
    updated[index] = {
      ...item,
      gstRate: newRate,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: calc.igstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };
    setItems(updated);
  };

  // Line item modifications
  const handleQuantityChange = (index: number, newQty: number) => {
    const qty = Math.max(1, newQty);
    const item = items[index];
    const product = products.find((p) => p.id === item.productId);

    if (product && qty > product.currentStock) {
      showToast(
        'Stock Alert',
        `Quantity (${qty}) exceeds available stock (${product.currentStock}) for ${item.productName}`,
        'warning'
      );
    }

    const calc = calculateItemGst({
      rate: item.rate,
      quantity: qty,
      discountType: item.discountType,
      discountValue: item.discountValue,
      gstRate: item.gstRate,
      isInterState,
    });

    const updated = [...items];
    updated[index] = {
      ...item,
      quantity: qty,
      discountAmount: calc.discountAmount,
      taxableAmount: calc.taxableAmount,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: calc.igstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };
    setItems(updated);
  };

  const handleRateChange = (index: number, newRate: number) => {
    const rate = Math.max(0, newRate);
    const item = items[index];

    const calc = calculateItemGst({
      rate,
      quantity: item.quantity,
      discountType: item.discountType,
      discountValue: item.discountValue,
      gstRate: item.gstRate,
      isInterState,
    });

    const updated = [...items];
    updated[index] = {
      ...item,
      rate,
      discountAmount: calc.discountAmount,
      taxableAmount: calc.taxableAmount,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: calc.igstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };
    setItems(updated);
  };

  const handleDiscountChange = (index: number, val: number, type: 'percentage' | 'fixed') => {
    const item = items[index];
    const calc = calculateItemGst({
      rate: item.rate,
      quantity: item.quantity,
      discountType: type,
      discountValue: Math.max(0, val),
      gstRate: item.gstRate,
      isInterState,
    });

    const updated = [...items];
    updated[index] = {
      ...item,
      discountType: type,
      discountValue: Math.max(0, val),
      discountAmount: calc.discountAmount,
      taxableAmount: calc.taxableAmount,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: calc.igstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Load authentic Sagar Distributor sample bill (INV 3525)
  const handleLoadSagarDistributorSampleBill = () => {
    const omCust = customers.find((c) => c.customerCode === '0019' || c.shopName.includes('OM MEDICAL'));
    if (omCust) {
      setSelectedCustomerId(omCust.id);
    } else {
      setSelectedCustomerId('walk-in');
      setCustomCustomerName('0019 OM MEDICAL');
      setCustomCustomerPhone('9421514788');
    }
    setInvoiceNo('INV 3525');
    setInvoiceDate('2026-08-26');
    setMemoType('CREDIT MEMO');
    setPaymentMode('credit');
    setPaidAmount(0);

    const sampleItems: InvoiceItem[] = [
      {
        productId: 'prod-pharma-1',
        productName: 'OPOX 200 TAB',
        sku: 'OPOX-200',
        hsn: '30042',
        mfr: 'HET',
        pack: "10'S",
        mrp: 148.5,
        dc: '',
        batchNo: 'HH2602078',
        expiryDate: '01/28',
        unit: 'box',
        quantity: 2.5,
        freeQty: 0.5,
        rate: 113.14,
        discountType: 'percentage',
        discountValue: 0,
        discountAmount: 0,
        taxableAmount: 282.85,
        gstRate: 5,
        cgstAmount: 7.07,
        sgstAmount: 7.07,
        igstAmount: 0,
        totalTaxAmount: 14.14,
        lineTotal: 282.85,
      },
      {
        productId: 'prod-pharma-2',
        productName: 'ARFLUR 3D TAB',
        sku: 'ARFLUR-3D',
        hsn: '30049',
        mfr: 'FDC',
        pack: "10'S",
        mrp: 97.9,
        dc: '',
        batchNo: '5226D002',
        expiryDate: '03/28',
        unit: 'box',
        quantity: 3,
        freeQty: 0,
        rate: 74.59,
        discountType: 'percentage',
        discountValue: 0,
        discountAmount: 0,
        taxableAmount: 223.77,
        gstRate: 5,
        cgstAmount: 5.59,
        sgstAmount: 5.59,
        igstAmount: 0,
        totalTaxAmount: 11.19,
        lineTotal: 223.77,
      },
      {
        productId: 'prod-pharma-3',
        productName: 'ARFLUR-P TAB',
        sku: 'ARFLUR-P',
        hsn: '30049',
        mfr: 'FDC',
        pack: "10'S",
        mrp: 56.92,
        dc: '',
        batchNo: '0726B028',
        expiryDate: '07/27',
        unit: 'box',
        quantity: 3,
        freeQty: 0,
        rate: 43.37,
        discountType: 'percentage',
        discountValue: 0,
        discountAmount: 0,
        taxableAmount: 130.11,
        gstRate: 5,
        cgstAmount: 3.25,
        sgstAmount: 3.25,
        igstAmount: 0,
        totalTaxAmount: 6.51,
        lineTotal: 130.11,
      },
    ];

    setItems(sampleItems);
    showToast('Sagar Bill Loaded', 'Loaded Sagar Distributor INV 3525 template. Ready to print or modify!', 'success');
  };

  // Preview current bill draft in Sagar Distributor A4 format
  const handleOpenLivePreview = () => {
    if (items.length === 0) {
      showToast('No Items', 'Add at least one item or click "Load Sample Bill" to preview the bill format.', 'warning');
      return;
    }
    const draftInvoice: SalesInvoice = {
      id: 'draft-preview',
      invoiceNo,
      memoType,
      date: invoiceDate,
      dueDate,
      ewbNo: ewbNo || undefined,
      customerId: selectedCustomerId,
      customerCode: selectedCustomer?.customerCode || (selectedCustomerId === 'walk-in' ? '' : undefined),
      customerName: selectedCustomer ? selectedCustomer.name : (customCustomerName || 'Cash Retail Counter'),
      customerShopName: selectedCustomer ? selectedCustomer.shopName : (customCustomerName || 'Walk-in Customer'),
      customerDlNo: selectedCustomer?.dlNo || '20MH/JAL/465294 , 21MH/JAL/465295',
      customerPhone: selectedCustomer ? selectedCustomer.phone : customCustomerPhone,
      customerAddress: selectedCustomer ? selectedCustomer.address : 'POTDAR SCHOOL.',
      customerCity: selectedCustomer ? selectedCustomer.city : 'CHALISGAON',
      customerState: selectedCustomer ? selectedCustomer.state : businessProfile.state,
      customerStateCode: selectedCustomer ? selectedCustomer.stateCode : businessProfile.stateCode,
      customerGstin: selectedCustomer?.gstin || '',
      isInterState,
      items,
      totalQtyWithFree: totalUnitsWithFree,
      grossAmount: totalGross,
      subTotal: totals.subTotal,
      totalDiscount: totals.totalDiscount,
      totalCgst: totals.totalCgst,
      totalSgst: totals.totalSgst,
      totalIgst: totals.totalIgst,
      totalTax: totals.totalTax,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
      paymentStatus: balanceDue === 0 ? 'paid' : (paidAmount > 0 ? 'partial' : 'unpaid'),
      paymentMode,
      paidAmount,
      balanceDue,
      status: 'active',
      createdBy: 'Sagar Patil',
      createdAt: new Date().toISOString(),
    };
    setPrintingInvoice(draftInvoice);
    setPrintFormat('A4');
  };

  // Reset form after saving
  const resetForm = () => {
    setItems([]);
    setSelectedCustomerId('walk-in');
    setCustomCustomerName('');
    setCustomCustomerPhone('');
    setPaymentMode('credit');
    setPaidAmount(0);
    setPaymentNotes('');
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setInvoiceNo(db.generateNextInvoiceNumber());
  };

  const handleClearDraft = () => {
    resetForm();
    showToast('Bill Reset', 'Draft cleared for a fresh bill.', 'info');
  };

  // Update item in simple view popup
  const handleUpdateEditingItem = (patch: Partial<InvoiceItem>) => {
    if (editingItemIndex === null || !items[editingItemIndex]) return;
    const curr = items[editingItemIndex];
    const merged = { ...curr, ...patch };
    const calc = calculateItemGst({
      rate: merged.rate,
      quantity: merged.quantity,
      discountType: merged.discountType,
      discountValue: merged.discountValue,
      gstRate: merged.gstRate,
      isInterState,
    });
    const updated = [...items];
    updated[editingItemIndex] = {
      ...merged,
      taxableAmount: calc.taxableAmount,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: calc.igstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };
    setItems(updated);
  };

  // Save Invoice
  const handleSaveInvoice = (printAfter = false, format: 'A4' | 'THERMAL_80MM' = 'A4') => {
    if (items.length === 0) {
      showToast('Cannot Save Empty Invoice', 'Please add at least one product line.', 'error');
      return;
    }

    let custName = 'Cash Retail Counter';
    let custShop = 'Walk-in Customer';
    let custCode = '';
    let custDlNo = '';
    let custPhone = customCustomerPhone;
    let custGstin = '';
    let custAddress = '';
    let custCity = businessProfile.city;
    let custState = businessProfile.state;
    let custStateCode = businessProfile.stateCode;

    if (selectedCustomer) {
      custName = selectedCustomer.name;
      custShop = selectedCustomer.shopName;
      custCode = selectedCustomer.customerCode || '';
      custDlNo = selectedCustomer.dlNo || '';
      custPhone = selectedCustomer.phone;
      custGstin = selectedCustomer.gstin || '';
      custAddress = selectedCustomer.address;
      custCity = selectedCustomer.city;
      custState = selectedCustomer.state;
      custStateCode = selectedCustomer.stateCode;
    } else if (customCustomerName.trim()) {
      custName = customCustomerName.trim();
      custShop = customCustomerName.trim();
    }

    const effectivePaid = Math.min(totals.grandTotal, Math.max(0, paidAmount));
    const effectiveBalance = Math.max(0, totals.grandTotal - effectivePaid);

    let paymentStatus: 'paid' | 'partial' | 'unpaid' = 'unpaid';
    if (effectiveBalance === 0) {
      paymentStatus = 'paid';
    } else if (effectivePaid > 0) {
      paymentStatus = 'partial';
    }

    const created = db.createInvoice({
      invoiceNo,
      memoType,
      date: invoiceDate,
      dueDate,
      ewbNo: ewbNo.trim() || undefined,
      customerId: selectedCustomerId,
      customerCode: custCode || undefined,
      customerName: custName,
      customerShopName: custShop,
      customerDlNo: custDlNo || undefined,
      customerPhone: custPhone,
      customerAddress: custAddress,
      customerCity: custCity,
      customerState: custState,
      customerStateCode: custStateCode,
      customerGstin: custGstin,
      isInterState,
      items,
      totalQtyWithFree: totalUnitsWithFree,
      grossAmount: totalGross,
      subTotal: totals.subTotal,
      totalDiscount: totals.totalDiscount,
      totalCgst: totals.totalCgst,
      totalSgst: totals.totalSgst,
      totalIgst: totals.totalIgst,
      totalTax: totals.totalTax,
      roundOff: totals.roundOff,
      grandTotal: totals.grandTotal,
      paymentStatus,
      paymentMode,
      paidAmount: effectivePaid,
      balanceDue: effectiveBalance,
      notes: paymentNotes,
    });

    showToast(
      'Invoice Created Successfully',
      `Invoice ${created.invoiceNo} generated for ${custShop} (${formatIndianCurrency(created.grandTotal)})`,
      'success'
    );

    loadData();
    resetForm();

    if (printAfter) {
      setPrintingInvoice(created);
      setPrintFormat(format);
    }
  };

  // Quick Customer Creation
  const handleSaveQuickCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustShop.trim() || !newCustName.trim()) {
      showToast('Validation Error', 'Shop Name and Contact Person are required.', 'error');
      return;
    }

    const newCust = db.saveCustomer({
      customerCode: newCustCode.trim() || undefined,
      name: newCustName.trim(),
      shopName: newCustShop.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim() || 'POTDAR SCHOOL.',
      city: newCustCity,
      state: 'Maharashtra',
      stateCode: '27',
      dlNo: newCustDlNo.trim() || undefined,
      gstin: newCustGstin.trim().toUpperCase() || undefined,
      creditLimit: Number(newCustCreditLimit) || 50000,
      creditDays: 15,
      openingBalance: 0,
    });

    setCustomers(db.getCustomers());
    setSelectedCustomerId(newCust.id);
    setShowAddCustomerModal(false);
    showToast('Customer Added', `${newCust.shopName} [Code: ${newCust.customerCode || '—'}] added & selected.`, 'success');

    // Reset inputs
    setNewCustName('');
    setNewCustShop('');
    setNewCustPhone('');
    setNewCustGstin('');
  };

  // Cancel an existing invoice
  const confirmCancelInvoice = () => {
    if (!cancelInvoiceId) return;
    const success = db.cancelInvoice(cancelInvoiceId, 'Cancelled from sales billing history');
    if (success) {
      showToast('Invoice Cancelled', 'Stock restored and customer balance adjusted.', 'info');
      loadData();
    }
    setCancelInvoiceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Sales Billing & POS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rapid wholesale invoicing with automatic GST, stock deduction, and ledger updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('new_invoice')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'new_invoice'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Create New Bill
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recent Invoices ({invoices.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'new_invoice' ? (
        <div className="space-y-6">
          {/* Top Quick Actions Banner for Sagar Distributor Format (Fresh Light Palette) */}
          <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/80 to-indigo-50/80 rounded-2xl p-4 sm:p-5 border border-blue-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 rounded text-[10px] font-bold tracking-wider uppercase">
                  SAGAR DISTRIBUTOR BILL
                </span>
                <span className="text-xs text-blue-900/80 font-semibold">
                  Official GST Wholesale Invoice Format
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Generates exact wholesale bills with HSN, D.C., MRP, Pack, Batch No, Exp., Free Qty & Mini Tax Box.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={handleLoadSagarDistributorSampleBill}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Fill sample bill (INV 3525) with authentic medicines"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Fill Sample Bill</span>
              </button>
              <button
                type="button"
                onClick={handleOpenLivePreview}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                title="Live preview of the printed bill"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Bill</span>
              </button>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearDraft}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  title="Clear items and start new bill"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 1: Customer and Invoice Meta */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Customer Select */}
              <div className="md:col-span-5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Details of Receiver (Billed To) <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomerModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    + New Customer
                  </button>
                </div>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs font-medium"
                >
                  <option value="walk-in">Cash Retail / Walk-in Counter Sale</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customerCode ? `[${c.customerCode}] ` : ''}{c.shopName} ({c.name}) - Bal: ₹{formatIndianNumber(c.currentBalance)}
                    </option>
                  ))}
                </select>

                {selectedCustomerId === 'walk-in' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Buyer Name (Optional)"
                      value={customCustomerName}
                      onChange={(e) => setCustomCustomerName(e.target.value)}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Mobile No (Optional)"
                      value={customCustomerPhone}
                      onChange={(e) => setCustomCustomerPhone(e.target.value)}
                      className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800"
                    />
                  </div>
                )}
              </div>

              {/* Customer GST & Outstanding Info Pill */}
              <div className="md:col-span-3 flex flex-col justify-center bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 text-xs">
                {selectedCustomer ? (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>Cust Code:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedCustomer.customerCode || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 mt-0.5">
                      <span>D.L.No:</span>
                      <span className="font-mono text-[10px] text-slate-800 truncate max-w-[140px]" title={selectedCustomer.dlNo}>
                        {selectedCustomer.dlNo || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 mt-0.5">
                      <span>GSTIN:</span>
                      <span className="font-mono font-medium text-slate-900">
                        {selectedCustomer.gstin || 'Unregistered'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 mt-0.5">
                      <span>Outstanding Bal:</span>
                      <span
                        className={`font-mono font-bold ${
                          selectedCustomer.currentBalance > 0
                            ? 'text-rose-600'
                            : 'text-emerald-700'
                        }`}
                      >
                        {formatIndianCurrency(selectedCustomer.currentBalance)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 italic">
                    Cash Retail / Immediate Counter Settlement
                  </div>
                )}
              </div>

              {/* Memo Type, Invoice Number & Date */}
              <div className="md:col-span-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Memo Type
                  </label>
                  <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setMemoType('CREDIT MEMO')}
                      className={`py-1 text-[10px] font-bold rounded uppercase transition-colors cursor-pointer ${
                        memoType === 'CREDIT MEMO'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Credit
                    </button>
                    <button
                      type="button"
                      onClick={() => setMemoType('CASH MEMO')}
                      className={`py-1 text-[10px] font-bold rounded uppercase transition-colors cursor-pointer ${
                        memoType === 'CASH MEMO'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Cash
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    EWB NO. (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 52182049182"
                    value={ewbNo}
                    onChange={(e) => setEwbNo(e.target.value)}
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    INV.NO.
                  </label>
                  <input
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    INV.DT.
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Credit Limit Exceeded Warning Banner */}
            {isCreditExceeded && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-900 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <strong>Credit Limit Warning:</strong> Customer's total outstanding after this invoice will exceed their credit limit of {formatIndianCurrency(selectedCustomer.creditLimit)} by{' '}
                  <span className="font-bold underline">{formatIndianCurrency(excessCreditAmount)}</span>.
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Rapid Product Search & Add */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search wholesale product by Name, SKU, Barcode, HSN, or Manufacturer (Type and press Enter)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchResults.length > 0) {
                        e.preventDefault();
                        handleAddItem(searchResults[0]);
                      }
                    }}
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-12 z-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden max-h-72 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleAddItem(product)}
                      className="p-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/60 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-0.5">
                          <span>HSN: {product.hsn}</span>
                          <span>Mfr: {product.mfr || 'GEN'}</span>
                          <span>Pack: {product.pack || product.packSize || "10'S"}</span>
                          <span>GST: {product.gstRate}%</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                          Rate: {formatIndianCurrency(product.sellingPrice)}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          MRP: ₹{product.mrp?.toFixed(2) || (product.sellingPrice * 1.3).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Distributor Catalog Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                ⚡ Quick Add:
              </span>
              {products.slice(0, 8).map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => handleAddItem(prod)}
                  className="px-3 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold border border-slate-200 hover:border-blue-300 transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>{prod.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">₹{prod.sellingPrice}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Line Items Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Table View Switcher Bar */}
            <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider">
                  Billed Items
                </span>
                <span className="font-mono text-slate-500">
                  {items.length} items · {totalUnitsWithFree} units
                </span>
              </div>

              {/* Toggle Simple View vs Full Detailed Columns */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-200/80 rounded-lg">
                <button
                  type="button"
                  onClick={() => setIsDetailedTable(false)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    !isDetailedTable
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Clean, spacious view with essential inputs"
                >
                  ⚡ Simple Table
                </button>
                <button
                  type="button"
                  onClick={() => setIsDetailedTable(true)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                    isDetailedTable
                      ? 'bg-white text-blue-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Full 15 columns (editable HSN, MRP, DC, Pack, Batch, Exp)"
                >
                  📝 Full 15 Columns
                </button>
              </div>
            </div>

            {/* Render Simple Table View (Default, Easy, Uncluttered) */}
            {!isDetailedTable ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-4 min-w-[240px]">Medicine / Item Name</th>
                      <th className="py-2.5 px-2 text-right w-24">Qty</th>
                      <th className="py-2.5 px-2 text-right w-20 text-emerald-700">Free</th>
                      <th className="py-2.5 px-3 text-right w-28">Rate (₹)</th>
                      <th className="py-2.5 px-2 text-center w-20">GST</th>
                      <th className="py-2.5 px-4 text-right w-32">Total (₹)</th>
                      <th className="py-2.5 px-3 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <p className="text-sm font-medium">No medicines added to bill yet.</p>
                          <p className="text-xs text-slate-400 mt-1">
                            Click <strong>&quot;Fill Sample Bill&quot;</strong> above or click any product in <strong>Quick Add</strong>.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      items.map((item, idx) => {
                        const prod = products.find((p) => p.id === item.productId);
                        const isLow = prod && item.quantity > prod.currentStock;

                        return (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-3 text-center text-slate-400 font-mono font-bold">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-bold text-sm text-slate-900 leading-tight">
                                    {item.productName}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-mono">
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                      Pack: {item.pack || "10'S"}
                                    </span>
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                      Batch: {item.batchNo || '—'}
                                    </span>
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                      Exp: {item.expiryDate || '—'}
                                    </span>
                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                      MRP: ₹{item.mrp?.toFixed(2)}
                                    </span>
                                    {item.hsn && (
                                      <span className="text-slate-400">
                                        HSN: {item.hsn}
                                      </span>
                                    )}
                                  </div>
                                  {isLow && (
                                    <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                                      Exceeds Available Stock ({prod?.currentStock})
                                    </span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setEditingItemIndex(idx)}
                                  className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold shrink-0 p-1 rounded hover:bg-blue-50 cursor-pointer"
                                  title="Edit Batch, Expiry, MRP, or HSN for this item"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Specs</span>
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-right">
                              <input
                                type="number"
                                step={0.5}
                                min={0.5}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                                className={`w-20 text-right font-mono text-sm font-bold rounded-lg border py-1.5 px-2.5 ${
                                  isLow
                                    ? 'border-rose-400 bg-rose-50 text-rose-900'
                                    : 'border-slate-200 bg-white text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                }`}
                              />
                            </td>
                            <td className="py-3 px-2 text-right">
                              <input
                                type="number"
                                step={0.5}
                                min={0}
                                value={item.freeQty || ''}
                                placeholder="0"
                                onChange={(e) => handleFreeQtyChange(idx, Number(e.target.value))}
                                className="w-16 text-right font-mono text-xs font-semibold text-emerald-700 rounded-lg border border-emerald-200 bg-emerald-50/60 py-1.5 px-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                              />
                            </td>
                            <td className="py-3 px-3 text-right">
                              <input
                                type="number"
                                step={0.01}
                                min={0}
                                value={item.rate}
                                onChange={(e) => handleRateChange(idx, Number(e.target.value))}
                                className="w-24 text-right font-mono text-sm font-bold rounded-lg border border-slate-200 bg-white text-slate-900 py-1.5 px-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              />
                            </td>
                            <td className="py-3 px-2 text-center font-mono">
                              <select
                                value={item.gstRate}
                                onChange={(e) => handleGstRateChange(idx, Number(e.target.value))}
                                className="text-xs font-mono font-semibold rounded-lg border border-slate-200 bg-white py-1.5 px-2 text-slate-900 focus:border-blue-500"
                              >
                                <option value={0}>0%</option>
                                <option value={5}>5%</option>
                                <option value={12}>12%</option>
                                <option value={18}>18%</option>
                                <option value={28}>28%</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right font-mono text-sm font-bold text-slate-900">
                              ₹{item.lineTotal.toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Render Full Detailed 15-Columns Table (For Power Users) */
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <th className="py-2 px-1 w-8 text-center">#</th>
                      <th className="py-2 px-1.5 w-18">HSN</th>
                      <th className="py-2 px-1 text-center w-12">D.C.</th>
                      <th className="py-2 px-1.5 text-right w-18">M.R.P.</th>
                      <th className="py-2 px-3 min-w-[170px]">Product</th>
                      <th className="py-2 px-1 text-center w-14">Mfr</th>
                      <th className="py-2 px-1 text-center w-16">Pack</th>
                      <th className="py-2 px-1.5 w-24">Batch No</th>
                      <th className="py-2 px-1 text-center w-16">Exp.</th>
                      <th className="py-2 px-1.5 text-right w-16">Qty.</th>
                      <th className="py-2 px-1.5 text-right w-14 text-emerald-700">Free</th>
                      <th className="py-2 px-1.5 text-right w-20">Rate (₹)</th>
                      <th className="py-2 px-1 text-center w-16">GST%</th>
                      <th className="py-2 px-2.5 text-right w-24">Amount (₹)</th>
                      <th className="py-2 px-1 w-8 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={15} className="py-12 text-center text-slate-400 dark:text-slate-500">
                          No items added yet. Click &quot;Fill Sample Bill (INV 3525)&quot; or search a product above to add bill lines.
                        </td>
                      </tr>
                    ) : (
                      items.map((item, idx) => {
                        const prod = products.find((p) => p.id === item.productId);
                        const isLow = prod && item.quantity > prod.currentStock;

                        return (
                          <tr key={idx} className="hover:bg-slate-50/70">
                            <td className="py-2 px-1 text-center text-slate-400 font-mono">{idx + 1}</td>
                            <td className="py-2 px-1.5 font-mono">
                              <input
                                type="text"
                                value={item.hsn || ''}
                                onChange={(e) => handleHsnChange(idx, e.target.value)}
                                className="w-16 font-mono text-xs rounded border border-slate-200 bg-white py-0.5 px-1 text-slate-900 focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-1 text-center font-mono">
                              <input
                                type="text"
                                placeholder="—"
                                value={item.dc || ''}
                                onChange={(e) => handleDcChange(idx, e.target.value)}
                                className="w-10 text-center font-mono text-xs uppercase rounded border border-slate-200 bg-white py-0.5 px-0.5 text-slate-900 focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-1.5 text-right font-mono">
                              <input
                                type="number"
                                step={0.01}
                                value={item.mrp || ''}
                                onChange={(e) => handleMrpChange(idx, Number(e.target.value))}
                                className="w-16 text-right font-mono text-xs rounded border border-slate-200 bg-white py-0.5 px-1 text-slate-900 focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <div className="font-bold text-slate-900 leading-tight">
                                {item.productName}
                              </div>
                              {isLow && (
                                <span className="text-[10px] text-rose-600 font-semibold">
                                  Exceeds Stock ({prod?.currentStock})
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-1 text-center font-mono">
                              <input
                                type="text"
                                placeholder="MFR"
                                value={item.mfr || 'GEN'}
                                onChange={(e) => handleMfrChange(idx, e.target.value)}
                                className="w-12 text-center font-mono text-xs uppercase font-semibold rounded border border-slate-200 bg-white py-0.5 px-0.5 text-slate-900 focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-1 text-center font-mono">
                              <input
                                type="text"
                                placeholder="PACK"
                                value={item.pack || "10'S"}
                                onChange={(e) => handlePackChange(idx, e.target.value)}
                                className="w-14 text-center font-mono text-xs rounded border border-slate-200 bg-white py-0.5 px-0.5 text-slate-900 focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-1.5">
                              <input
                                type="text"
                                value={item.batchNo || ''}
                                onChange={(e) => handleBatchNoChange(idx, e.target.value)}
                                className="w-22 font-mono text-xs font-semibold rounded border border-slate-200 bg-white py-0.5 px-1 text-slate-900 uppercase focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-1 text-center">
                              <input
                                type="text"
                                placeholder="MM/YY"
                                value={item.expiryDate || ''}
                                onChange={(e) => handleExpiryChange(idx, e.target.value)}
                                className="w-14 text-center font-mono text-xs rounded border border-slate-200 bg-white py-0.5 px-0.5 text-slate-900 focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-1.5 text-right">
                              <input
                                type="number"
                                step={0.5}
                                min={0.5}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                                className={`w-14 text-right font-mono text-xs font-bold rounded border py-0.5 px-1 ${
                                  isLow
                                    ? 'border-rose-400 bg-rose-50 text-rose-900'
                                    : 'border-slate-200 bg-white text-slate-900 focus:border-blue-500'
                                }`}
                              />
                            </td>
                            <td className="py-2 px-1.5 text-right">
                              <input
                                type="number"
                                step={0.5}
                                min={0}
                                value={item.freeQty || ''}
                                placeholder="0"
                                onChange={(e) => handleFreeQtyChange(idx, Number(e.target.value))}
                                className="w-12 text-right font-mono text-xs font-semibold text-emerald-700 rounded border border-emerald-200 bg-emerald-50/50 py-0.5 px-1 focus:border-emerald-500"
                              />
                            </td>
                            <td className="py-2 px-1.5 text-right">
                              <input
                                type="number"
                                step={0.01}
                                min={0}
                                value={item.rate}
                                onChange={(e) => handleRateChange(idx, Number(e.target.value))}
                                className="w-16 text-right font-mono text-xs font-bold rounded border border-slate-200 bg-white py-0.5 px-1 text-slate-900 focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-1 text-center font-mono">
                              <select
                                value={item.gstRate}
                                onChange={(e) => handleGstRateChange(idx, Number(e.target.value))}
                                className="text-[11px] font-mono font-semibold rounded border border-slate-200 bg-white py-0.5 px-0.5 text-slate-900 focus:border-blue-500"
                              >
                                <option value={0}>0%</option>
                                <option value={5}>5%</option>
                                <option value={12}>12%</option>
                                <option value={18}>18%</option>
                                <option value={28}>28%</option>
                              </select>
                            </td>
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                              {item.lineTotal.toFixed(2)}
                            </td>
                            <td className="py-2 px-1 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 4: Settlement, Totals & Actions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Payment & Settlement Configuration */}
            <div className="md:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Payment & Settlement
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {(['cash', 'upi', 'bank', 'cheque', 'credit'] as PaymentMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`py-2 px-2.5 text-xs font-semibold uppercase rounded-lg border text-center transition-all ${
                      paymentMode === mode
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={totals.grandTotal}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full text-sm font-mono font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Balance Due / Credit (₹)
                  </label>
                  <div className="w-full text-sm font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-rose-600">
                    {formatIndianCurrency(balanceDue)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">
                  Invoice Notes / Payment Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. UPI Ref 382940182 or Cheque No 849201"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Amount In Words Display */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Amount In Words:
                </span>
                <p className="text-xs font-medium text-slate-700 italic mt-0.5">
                  {numberToWordsIndian(totals.grandTotal)}
                </p>
              </div>
            </div>

            {/* Totals Summary & Submit Buttons */}
            <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal (Taxable Value):</span>
                  <span className="font-mono font-medium text-slate-900">
                    {formatIndianCurrency(totals.subTotal)}
                  </span>
                </div>
                {totals.totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span className="font-mono font-medium">
                      -{formatIndianCurrency(totals.totalDiscount)}
                    </span>
                  </div>
                )}
                {isInterState ? (
                  <div className="flex justify-between text-slate-600">
                    <span>IGST (Inter-State):</span>
                    <span className="font-mono font-medium text-slate-900">
                      {formatIndianCurrency(totals.totalIgst)}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-slate-600">
                      <span>CGST (Central):</span>
                      <span className="font-mono font-medium text-slate-900">
                        {formatIndianCurrency(totals.totalCgst)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SGST (State):</span>
                      <span className="font-mono font-medium text-slate-900">
                        {formatIndianCurrency(totals.totalSgst)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Total Tax:</span>
                  <span className="font-mono font-medium text-slate-900">
                    {formatIndianCurrency(totals.totalTax)}
                  </span>
                </div>
                {totals.roundOff !== 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Round Off:</span>
                    <span className="font-mono">
                      {totals.roundOff > 0 ? `+${totals.roundOff.toFixed(2)}` : totals.roundOff.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Grand Total:</span>
                  <span className="text-xl font-bold font-mono text-blue-700">
                    {formatIndianCurrency(totals.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2.5">
                {/* Primary: Save & Print A4 (Sagar Distributor Format) */}
                <button
                  type="button"
                  onClick={() => handleSaveInvoice(true, 'A4')}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Save & Print A4 Bill (Sagar Format)</span>
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleOpenLivePreview}
                    className="py-2 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveInvoice(false)}
                    className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-slate-500" />
                    <span>Save Only</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveInvoice(true, 'THERMAL_80MM')}
                    className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>80mm</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Section: Recent Invoices History */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900">
              Recent Sales Invoices
            </h3>
            <span className="text-xs text-slate-500">Total: {invoices.length} invoices</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Invoice No</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3 text-right">Taxable</th>
                  <th className="py-2.5 px-3 text-right">Grand Total</th>
                  <th className="py-2.5 px-3 text-center">Payment</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                      {inv.invoiceNo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {formatDateIndian(inv.date)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">
                        {inv.customerShopName || inv.customerName}
                      </div>
                      <div className="text-[10px] text-slate-500">{inv.customerPhone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {formatIndianCurrency(inv.subTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatIndianCurrency(inv.grandTotal)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.paymentStatus === 'partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {inv.paymentStatus} ({inv.paymentMode})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          inv.status === 'active'
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-slate-500 bg-slate-100'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setPrintingInvoice(inv);
                            setPrintFormat('A4');
                          }}
                          className="p-1 text-slate-600 hover:text-blue-700 rounded"
                          title="Print A4 GST Tax Invoice"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setPrintingInvoice(inv);
                            setPrintFormat('THERMAL_80MM');
                          }}
                          className="p-1 text-slate-600 hover:text-blue-700 rounded"
                          title="Print 80mm Slip"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        {inv.status === 'active' && (
                          <button
                            onClick={() => setCancelInvoiceId(inv.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Cancel Invoice & Restore Stock"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200/80 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Quick Add Retail Customer
            </h3>
            <form onSubmit={handleSaveQuickCustomer} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Cust Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0019"
                    value={newCustCode}
                    onChange={(e) => setNewCustCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Shop / Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0019 OM MEDICAL"
                    value={newCustShop}
                    onChange={(e) => setNewCustShop(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pravin Kulkarni"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="94215XXXXX"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Drug License (D.L.No.)
                </label>
                <input
                  type="text"
                  placeholder="20MH/JAL/465294 , 21MH/JAL/465295"
                  value={newCustDlNo}
                  onChange={(e) => setNewCustDlNo(e.target.value)}
                  className="w-full font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Address / Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. POTDAR SCHOOL."
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newCustCity}
                    onChange={(e) => setNewCustCity(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  placeholder="27XXXXX0000X1ZX"
                  value={newCustGstin}
                  onChange={(e) => setNewCustGstin(e.target.value)}
                  className="w-full uppercase font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Credit Limit (₹)
                </label>
                <input
                  type="number"
                  value={newCustCreditLimit}
                  onChange={(e) => setNewCustCreditLimit(Number(e.target.value))}
                  className="w-full font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Specs Edit Modal (For Simple View) */}
      {editingItemIndex !== null && items[editingItemIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Edit Item Specifications
                </h3>
                <p className="text-xs text-blue-700 font-semibold truncate max-w-[280px]">
                  {items[editingItemIndex].productName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingItemIndex(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Batch No
                </label>
                <input
                  type="text"
                  value={items[editingItemIndex].batchNo || ''}
                  onChange={(e) => handleUpdateEditingItem({ batchNo: e.target.value.toUpperCase() })}
                  className="w-full font-mono text-xs uppercase bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="06/28"
                  value={items[editingItemIndex].expiryDate || ''}
                  onChange={(e) => handleUpdateEditingItem({ expiryDate: e.target.value })}
                  className="w-full font-mono text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  M.R.P. (₹)
                </label>
                <input
                  type="number"
                  step={0.01}
                  value={items[editingItemIndex].mrp || ''}
                  onChange={(e) => handleUpdateEditingItem({ mrp: Number(e.target.value) })}
                  className="w-full font-mono text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  D.C. (Doctor/Dealer)
                </label>
                <input
                  type="text"
                  placeholder="—"
                  value={items[editingItemIndex].dc || ''}
                  onChange={(e) => handleUpdateEditingItem({ dc: e.target.value })}
                  className="w-full font-mono text-xs uppercase bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pack Size
                </label>
                <input
                  type="text"
                  placeholder="10'S"
                  value={items[editingItemIndex].pack || ''}
                  onChange={(e) => handleUpdateEditingItem({ pack: e.target.value })}
                  className="w-full font-mono text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Manufacturer (MFR)
                </label>
                <input
                  type="text"
                  placeholder="GEN"
                  value={items[editingItemIndex].mfr || ''}
                  onChange={(e) => handleUpdateEditingItem({ mfr: e.target.value.toUpperCase() })}
                  className="w-full font-mono text-xs uppercase bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  HSN Code
                </label>
                <input
                  type="text"
                  value={items[editingItemIndex].hsn || ''}
                  onChange={(e) => handleUpdateEditingItem({ hsn: e.target.value })}
                  className="w-full font-mono text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItemIndex(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar (When Bill Has Items) */}
      {items.length > 0 && activeTab === 'new_invoice' && (
        <div className="no-print fixed bottom-0 left-0 right-0 md:left-64 z-30 bg-white/95 text-slate-800 backdrop-blur-md border-t border-slate-200 px-4 sm:px-6 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <span className="text-[10px] text-slate-500 block leading-tight">
                Bill Total ({items.length} items · {totalUnitsWithFree} units):
              </span>
              <span className="text-base sm:text-lg font-bold font-mono text-blue-700 leading-tight">
                {formatIndianCurrency(totals.grandTotal)}
              </span>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline truncate max-w-[200px]">
              • {selectedCustomer ? selectedCustomer.shopName : (customCustomerName || 'Cash Sale')}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenLivePreview}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              type="button"
              onClick={() => handleSaveInvoice(true, 'A4')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Save & Print A4</span>
            </button>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal Container */}
      {printingInvoice && printFormat === 'A4' && (
        <InvoicePrintA4
          invoice={printingInvoice}
          business={businessProfile}
          onClose={() => setPrintingInvoice(null)}
        />
      )}

      {printingInvoice && printFormat === 'THERMAL_80MM' && (
        <InvoicePrintThermal
          invoice={printingInvoice}
          business={businessProfile}
          onClose={() => setPrintingInvoice(null)}
        />
      )}

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(cancelInvoiceId)}
        title="Cancel Sales Invoice?"
        message="Cancelling this invoice will immediately restore product inventory levels and reverse any credit balance charged to the customer's ledger. This action cannot be undone."
        confirmLabel="Yes, Cancel Invoice"
        isDestructive={true}
        onConfirm={confirmCancelInvoice}
        onCancel={() => setCancelInvoiceId(null)}
      />
    </div>
  );
};
