import React, { useState, useEffect } from 'react';
import { db } from '../../services/db';
import { SalesInvoice, PurchaseInvoice, Product, Customer, Supplier } from '../../types';
import { formatIndianCurrency, formatIndianNumber, formatDateIndian } from '../../utils/indianFormatters';
import { useToast } from '../../context/ToastContext';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  DollarSign,
  PieChart,
  Package,
  Layers,
  Clock,
  TrendingUp,
} from 'lucide-react';

export const ReportsDashboard: React.FC = () => {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState<
    'sales' | 'gst' | 'stock' | 'profit' | 'expiry'
  >('sales');

  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [purchases, setPurchases] = useState<PurchaseInvoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Date filters
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    setInvoices(db.getInvoices());
    setPurchases(db.getPurchases());
    setProducts(db.getProducts());
    setCustomers(db.getCustomers());
  }, []);

  // Filtered invoices within date range
  const filteredInvoices = invoices.filter(
    (inv) => inv.date >= startDate && inv.date <= endDate && inv.status === 'active'
  );

  // 1. Sales Report calculations
  const totalSalesRevenue = filteredInvoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalTaxCollected = filteredInvoices.reduce((s, i) => s + i.totalTax, 0);

  // 2. GSTR-1 Summary Calculations
  // B2B: Invoices where customer has GSTIN
  const b2bInvoices = filteredInvoices.filter((i) => Boolean(i.customerGstin && i.customerGstin.trim()));
  // B2C: Invoices where customer has no GSTIN
  const b2cInvoices = filteredInvoices.filter((i) => !i.customerGstin || !i.customerGstin.trim());

  // HSN-wise tax summary
  const hsnSummaryMap = new Map<
    string,
    { hsn: string; desc: string; qty: number; taxable: number; cgst: number; sgst: number; igst: number; totalTax: number }
  >();

  for (const inv of filteredInvoices) {
    for (const item of inv.items) {
      const existing = hsnSummaryMap.get(item.hsn) || {
        hsn: item.hsn,
        desc: item.productName,
        qty: 0,
        taxable: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0,
      };
      existing.qty += item.quantity;
      existing.taxable += item.taxableAmount;
      existing.cgst += item.cgstAmount;
      existing.sgst += item.sgstAmount;
      existing.igst += item.igstAmount;
      existing.totalTax += item.totalTaxAmount;
      hsnSummaryMap.set(item.hsn, existing);
    }
  }
  const hsnReportRows = Array.from(hsnSummaryMap.values());

  // 3. Profit Report Calculation (Sales vs Cost of Goods Sold)
  let totalCostOfGoodsSold = 0;
  for (const inv of filteredInvoices) {
    for (const item of inv.items) {
      const prod = products.find((p) => p.id === item.productId);
      const unitCost = prod ? prod.purchasePrice : item.rate * 0.85;
      totalCostOfGoodsSold += unitCost * item.quantity;
    }
  }
  const grossProfit = totalSalesRevenue - totalCostOfGoodsSold;
  const grossMarginPercent = totalSalesRevenue > 0 ? (grossProfit / totalSalesRevenue) * 100 : 0;

  // 4. Stock Valuation
  const totalStockAtCost = products.reduce((s, p) => s + p.currentStock * p.purchasePrice, 0);
  const totalStockAtSelling = products.reduce((s, p) => s + p.currentStock * p.sellingPrice, 0);

  // 5. Expiry List
  const now = new Date();
  const expiryList: {
    productName: string;
    sku: string;
    batchNo: string;
    expiryDate: string;
    daysLeft: number;
    stock: number;
    value: number;
  }[] = [];

  for (const p of products) {
    if (p.batches) {
      for (const b of p.batches) {
        if (b.expiryDate && b.quantity > 0) {
          const exp = new Date(b.expiryDate);
          const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays <= 90) {
            expiryList.push({
              productName: p.name,
              sku: p.sku,
              batchNo: b.batchNo,
              expiryDate: b.expiryDate,
              daysLeft: diffDays,
              stock: b.quantity,
              value: b.quantity * p.purchasePrice,
            });
          }
        }
      }
    }
  }

  // Export report to CSV
  const handleExportCSV = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let fileName = `Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'sales') {
      headers = ['Invoice No', 'Date', 'Customer', 'GSTIN', 'Taxable Val', 'Tax', 'Grand Total', 'Mode', 'Status'];
      rows = filteredInvoices.map((i) => [
        i.invoiceNo,
        i.date,
        `"${i.customerShopName || i.customerName}"`,
        i.customerGstin || '',
        i.subTotal,
        i.totalTax,
        i.grandTotal,
        i.paymentMode,
        i.paymentStatus,
      ]);
    } else if (reportType === 'gst') {
      headers = ['HSN Code', 'Item Description', 'Total Quantity', 'Taxable Value', 'CGST', 'SGST', 'IGST', 'Total GST Tax'];
      rows = hsnReportRows.map((h) => [
        h.hsn,
        `"${h.desc}"`,
        h.qty,
        h.taxable.toFixed(2),
        h.cgst.toFixed(2),
        h.sgst.toFixed(2),
        h.igst.toFixed(2),
        h.totalTax.toFixed(2),
      ]);
    } else if (reportType === 'stock') {
      headers = ['Product Name', 'SKU', 'HSN', 'Category', 'Unit', 'Stock Qty', 'Purchase Rate', 'Valuation at Cost', 'Selling Rate', 'Valuation at Retail'];
      rows = products.map((p) => [
        `"${p.name}"`,
        p.sku,
        p.hsn,
        `"${p.category}"`,
        p.unit,
        p.currentStock,
        p.purchasePrice,
        (p.currentStock * p.purchasePrice).toFixed(2),
        p.sellingPrice,
        (p.currentStock * p.sellingPrice).toFixed(2),
      ]);
    } else if (reportType === 'profit') {
      headers = ['Invoice No', 'Date', 'Customer', 'Sales Revenue', 'Estimated Cost', 'Gross Profit'];
      rows = filteredInvoices.map((inv) => {
        let cost = 0;
        for (const item of inv.items) {
          const prod = products.find((p) => p.id === item.productId);
          cost += (prod ? prod.purchasePrice : item.rate * 0.85) * item.quantity;
        }
        return [
          inv.invoiceNo,
          inv.date,
          `"${inv.customerShopName || inv.customerName}"`,
          inv.grandTotal,
          cost.toFixed(2),
          (inv.grandTotal - cost).toFixed(2),
        ];
      });
    } else if (reportType === 'expiry') {
      headers = ['Product Name', 'SKU', 'Batch No', 'Expiry Date', 'Days Left', 'Stock Qty', 'Inventory Value at Cost'];
      rows = expiryList.map((e) => [
        `"${e.productName}"`,
        e.sku,
        e.batchNo,
        e.expiryDate,
        e.daysLeft,
        e.stock,
        e.value.toFixed(2),
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report Exported', 'CSV report file downloaded.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Financial & Tax Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            GST GSTR-1 summaries, Sales & Purchase statements, Gross profit analysis, and Stock valuations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs & Date Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center p-1 bg-slate-100/90 rounded-xl text-xs border border-slate-200/60">
          <button
            onClick={() => setReportType('sales')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
              reportType === 'sales'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sales Report
          </button>
          <button
            onClick={() => setReportType('gst')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
              reportType === 'gst'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GSTR-1 Tax Summary
          </button>
          <button
            onClick={() => setReportType('stock')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
              reportType === 'stock'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Stock Valuation
          </button>
          <button
            onClick={() => setReportType('profit')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
              reportType === 'profit'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profit & Margin
          </button>
          <button
            onClick={() => setReportType('expiry')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-all cursor-pointer ${
              reportType === 'expiry'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expiry Watchlist
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Period:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 1. SALES REPORT VIEW */}
      {reportType === 'sales' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Total Sales Revenue</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {formatIndianCurrency(totalSalesRevenue)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Total Tax Collected</span>
              <span className="text-xl font-bold font-mono text-blue-600">
                {formatIndianCurrency(totalTaxCollected)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Total Bills Issued</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {filteredInvoices.length} invoices
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-800 bg-slate-50/50">
              Sales Invoices (Date Range Filtered)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3 text-right">Taxable (₹)</th>
                    <th className="py-2.5 px-3 text-right">GST Tax (₹)</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                    <th className="py-2.5 px-3 text-center">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-mono font-bold text-blue-600">{inv.invoiceNo}</td>
                      <td className="py-2 px-3 text-slate-600">{formatDateIndian(inv.date)}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{inv.customerShopName || inv.customerName}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">{formatIndianCurrency(inv.subTotal)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">{formatIndianCurrency(inv.totalTax)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">{formatIndianCurrency(inv.grandTotal)}</td>
                      <td className="py-2 px-3 text-center font-mono uppercase text-[10px]">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-medium">
                          {inv.paymentMode} ({inv.paymentStatus})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. GSTR-1 TAX SUMMARY VIEW */}
      {reportType === 'gst' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">B2B Registered Taxable Sales</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {formatIndianCurrency(b2bInvoices.reduce((s, i) => s + i.subTotal, 0))}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">({b2bInvoices.length} Registered Bills)</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">B2C Retail Consumer Sales</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {formatIndianCurrency(b2cInvoices.reduce((s, i) => s + i.subTotal, 0))}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">({b2cInvoices.length} Unregistered Bills)</span>
            </div>
          </div>

          {/* HSN-Wise Summary Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-800 flex justify-between bg-slate-50/50">
              <span>HSN-Wise GST Tax Return Summary (GSTR-1 Format)</span>
              <span className="text-[11px] text-slate-500 lowercase">CGST + SGST + IGST Breakdown</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">HSN / SAC</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-center">Total Qty</th>
                    <th className="py-2.5 px-3 text-right">Taxable Val (₹)</th>
                    <th className="py-2.5 px-3 text-right">CGST (₹)</th>
                    <th className="py-2.5 px-3 text-right">SGST (₹)</th>
                    <th className="py-2.5 px-3 text-right">IGST (₹)</th>
                    <th className="py-2.5 px-3 text-right font-bold">Total Tax (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hsnReportRows.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{h.hsn}</td>
                      <td className="py-2 px-3 text-slate-700">{h.desc}</td>
                      <td className="py-2 px-3 text-center font-mono">{h.qty}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-700">{formatIndianCurrency(h.taxable)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">{formatIndianCurrency(h.cgst)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">{formatIndianCurrency(h.sgst)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">{formatIndianCurrency(h.igst)}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-blue-600">
                        {formatIndianCurrency(h.totalTax)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. STOCK VALUATION REPORT */}
      {reportType === 'stock' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Total Inventory Value at Cost (Purchase)</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {formatIndianCurrency(totalStockAtCost)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Total Inventory Value at Wholesale Selling Price</span>
              <span className="text-xl font-bold font-mono text-emerald-600">
                {formatIndianCurrency(totalStockAtSelling)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-800 bg-slate-50/50">
              Itemized Stock Valuation
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">SKU</th>
                    <th className="py-2.5 px-3 text-center">Stock</th>
                    <th className="py-2.5 px-3 text-right">Cost Rate</th>
                    <th className="py-2.5 px-3 text-right">Total Cost Value</th>
                    <th className="py-2.5 px-3 text-right">Wholesale Rate</th>
                    <th className="py-2.5 px-3 text-right">Total Sales Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-900">{p.name}</td>
                      <td className="py-2 px-3 font-mono text-slate-500">{p.sku}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">{p.currentStock} {p.unit}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">{formatIndianCurrency(p.purchasePrice)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-900">
                        {formatIndianCurrency(p.currentStock * p.purchasePrice)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">{formatIndianCurrency(p.sellingPrice)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-600">
                        {formatIndianCurrency(p.currentStock * p.sellingPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. PROFIT & MARGIN REPORT */}
      {reportType === 'profit' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Sales Revenue (Gross)</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {formatIndianCurrency(totalSalesRevenue)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Cost of Goods Sold (COGS)</span>
              <span className="text-xl font-bold font-mono text-slate-600">
                {formatIndianCurrency(totalCostOfGoodsSold)}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 block mb-1">Gross Margin / Profit</span>
              <span className="text-xl font-bold font-mono text-emerald-600">
                {formatIndianCurrency(grossProfit)} ({grossMarginPercent.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-800 bg-slate-50/50">
              Invoice Level Profitability
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Invoice No</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3 text-right">Revenue</th>
                    <th className="py-2.5 px-3 text-right">Estimated Cost</th>
                    <th className="py-2.5 px-3 text-right font-bold">Gross Profit</th>
                    <th className="py-2.5 px-3 text-center">Margin %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => {
                    let cost = 0;
                    for (const item of inv.items) {
                      const prod = products.find((p) => p.id === item.productId);
                      cost += (prod ? prod.purchasePrice : item.rate * 0.85) * item.quantity;
                    }
                    const profit = inv.grandTotal - cost;
                    const margin = inv.grandTotal > 0 ? (profit / inv.grandTotal) * 100 : 0;

                    return (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3 font-mono font-bold text-blue-600">{inv.invoiceNo}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{inv.customerShopName || inv.customerName}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-800">{formatIndianCurrency(inv.grandTotal)}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-600">{formatIndianCurrency(cost)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">
                          {formatIndianCurrency(profit)}
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-semibold text-slate-700">
                          {margin.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. EXPIRY WATCHLIST */}
      {reportType === 'expiry' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-xs uppercase text-slate-800 flex justify-between bg-slate-50/50">
            <span>Batches Expiring in Next 90 Days</span>
            <span className="text-slate-500 font-normal">Immediate clearance recommendation</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Batch No</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3 text-center">Days Remaining</th>
                  <th className="py-2.5 px-3 text-center">Remaining Stock</th>
                  <th className="py-2.5 px-3 text-right">At-Risk Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expiryList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No stock batches expiring within 90 days.
                    </td>
                  </tr>
                ) : (
                  expiryList.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {row.productName}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-700">{row.batchNo}</td>
                      <td className="py-2 px-3 text-slate-600">{formatDateIndian(row.expiryDate)}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-rose-600">
                        {row.daysLeft} days
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-slate-800">{row.stock}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {formatIndianCurrency(row.value)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
