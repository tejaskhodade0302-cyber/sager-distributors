import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Product, Customer, SalesInvoice, Supplier } from '../types';
import { formatIndianCurrency, formatIndianNumber, formatDateIndian } from '../utils/indianFormatters';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Users,
  CreditCard,
  FileText,
  Calendar,
  Layers,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (module: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [invoices, setInvoices] = useState<SalesInvoice[]>([]);
  const [expiryFilterDays, setExpiryFilterDays] = useState<30 | 60 | 90>(60);

  useEffect(() => {
    setProducts(db.getProducts());
    setCustomers(db.getCustomers());
    setSuppliers(db.getSuppliers());
    setInvoices(db.getInvoices());
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthPrefix = todayStr.substring(0, 7); // e.g. "2026-10"

  // 1. Today's sales
  const todayInvoices = invoices.filter((i) => i.date === todayStr && i.status === 'active');
  const todaySalesAmount = todayInvoices.reduce((sum, i) => sum + i.grandTotal, 0);

  // 2. This month's sales
  const monthInvoices = invoices.filter((i) => i.date.startsWith(currentMonthPrefix) && i.status === 'active');
  const monthSalesAmount = monthInvoices.reduce((sum, i) => sum + i.grandTotal, 0);

  // 3. Total outstanding from customers (Receivables)
  const totalCustomerReceivables = customers.reduce((sum, c) => sum + Math.max(0, c.currentBalance), 0);

  // 4. Total payable to suppliers
  const totalSupplierPayables = suppliers.reduce((sum, s) => sum + Math.max(0, s.currentBalance), 0);

  // 5. Low stock alerts
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minStockLevel);

  // 6. Expiring items
  const now = new Date();
  const expiringLots: {
    product: Product;
    batchNo: string;
    expiryDate: string;
    daysLeft: number;
    quantity: number;
  }[] = [];

  for (const prod of products) {
    if (prod.batches) {
      for (const b of prod.batches) {
        if (b.expiryDate && b.quantity > 0) {
          const exp = new Date(b.expiryDate);
          const diffTime = exp.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= expiryFilterDays) {
            expiringLots.push({
              product: prod,
              batchNo: b.batchNo,
              expiryDate: b.expiryDate,
              daysLeft: diffDays,
              quantity: b.quantity,
            });
          }
        }
      }
    }
  }

  // 7. Last 30 Days Sales Trend Data for SVG Chart
  const days30: { date: string; label: string; amount: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dStr = d.toISOString().split('T')[0];
    const dayTotal = invoices
      .filter((inv) => inv.date === dStr && inv.status === 'active')
      .reduce((s, inv) => s + inv.grandTotal, 0);
    days30.push({
      date: dStr,
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      amount: dayTotal,
    });
  }
  const maxDayAmount = Math.max(...days30.map((d) => d.amount), 10000);

  // 8. Top 5 selling products by total quantity & revenue
  const productSalesMap = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const inv of invoices.filter((i) => i.status === 'active')) {
    for (const item of inv.items) {
      const existing = productSalesMap.get(item.productId) || {
        name: item.productName,
        qty: 0,
        revenue: 0,
      };
      existing.qty += item.quantity;
      existing.revenue += item.lineTotal;
      productSalesMap.set(item.productId, existing);
    }
  }
  const topProducts = Array.from(productSalesMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // 9. Top 5 customers by sales revenue
  const customerSalesMap = new Map<string, { name: string; shop: string; orders: number; total: number }>();
  for (const inv of invoices.filter((i) => i.status === 'active')) {
    const key = inv.customerId;
    const existing = customerSalesMap.get(key) || {
      name: inv.customerName,
      shop: inv.customerShopName || inv.customerName,
      orders: 0,
      total: 0,
    };
    existing.orders += 1;
    existing.total += inv.grandTotal;
    customerSalesMap.set(key, existing);
  }
  const topCustomers = Array.from(customerSalesMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Wholesale Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time financial position, stock levels, receivables & sales insights.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('billing')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            + New Sales Bill
          </button>
          <button
            onClick={() => onNavigate('purchases')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Package className="w-3.5 h-3.5 text-slate-500" />
            New Purchase
          </button>
          <button
            onClick={() => onNavigate('payments')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            Record Payment
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (4-grid, clean light elevation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Today's Sales</span>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-mono">
              {todayInvoices.length} bills
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {formatIndianCurrency(todaySalesAmount)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Date:</span>
            <span className="font-mono text-slate-600 font-medium">{formatDateIndian(todayStr)}</span>
          </div>
        </div>

        {/* This Month's Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">This Month's Sales</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-mono">
              {monthInvoices.length} bills
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {formatIndianCurrency(monthSalesAmount)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Active Financial Year 2026-27</span>
          </div>
        </div>

        {/* Total Customer Outstanding (Receivable) */}
        <div
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs cursor-pointer hover:border-blue-300 transition-all hover:shadow-xs"
          onClick={() => onNavigate('payments')}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Customer Receivables</span>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full font-mono">
              Outstanding
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {formatIndianCurrency(totalCustomerReceivables)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>From wholesale retailers</span>
            <span className="text-blue-600 text-[11px] font-semibold">View Aging →</span>
          </div>
        </div>

        {/* Total Payable to Suppliers */}
        <div
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs cursor-pointer hover:border-blue-300 transition-all hover:shadow-xs"
          onClick={() => onNavigate('suppliers')}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Supplier Payables</span>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full font-mono">
              Due
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {formatIndianCurrency(totalSupplierPayables)}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>To C&F depots & stockists</span>
            <span className="text-blue-600 text-[11px] font-semibold">View Ledgers →</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & Stock / Expiry Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 30-Day Sales Chart */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Sales Volume Trend (Last 30 Days)
              </h2>
              <p className="text-[11px] text-slate-500">
                Daily billed invoices distribution across wholesale retail network
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg">
              Peak: {formatIndianCurrency(maxDayAmount)}
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-44 w-full flex items-end gap-1 pt-6 px-1 border-b border-slate-100">
            {days30.map((d, i) => {
              const heightPercent = maxDayAmount > 0 ? Math.max(4, (d.amount / maxDayAmount) * 100) : 4;
              const hasSales = d.amount > 0;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  {/* Tooltip */}
                  <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap pointer-events-none z-20 font-mono">
                    {d.date}: {formatIndianCurrency(d.amount)}
                  </div>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xs transition-all ${
                      hasSales
                        ? 'bg-blue-600 hover:bg-blue-500'
                        : 'bg-slate-100'
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 px-1">
            <span>{days30[0]?.label}</span>
            <span>{days30[14]?.label}</span>
            <span>{days30[29]?.label} (Today)</span>
          </div>
        </div>

        {/* Low Stock & Expiry Quick Widget */}
        <div className="lg:col-span-4 space-y-4">
          {/* Low Stock Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Low Stock Alerts ({lowStockProducts.length})</span>
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
              >
                View all
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">All product stock levels healthy.</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 truncate max-w-[170px]">
                        {prod.name}
                      </div>
                      <div className="text-[10px] text-slate-500">Min: {prod.minStockLevel} {prod.unit}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-600">
                        {prod.currentStock} {prod.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiring Soon Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>Expiring Batches</span>
              </div>
              {/* Segmented control for days */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-[10px] font-semibold">
                {([30, 60, 90] as const).map((days) => (
                  <button
                    key={days}
                    onClick={() => setExpiryFilterDays(days)}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      expiryFilterDays === days
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>

            {expiringLots.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No lots expiring within {expiryFilterDays} days.
              </p>
            ) : (
              <div className="space-y-2 mt-2">
                {expiringLots.slice(0, 3).map((lot, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 truncate max-w-[150px]">
                        {lot.product.name}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Batch: {lot.batchNo} · {lot.expiryDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-rose-600 block">
                        {lot.daysLeft} days
                      </span>
                      <span className="text-[10px] text-slate-400">Qty: {lot.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Selling Products & Top Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Top 5 Selling Products
            </h2>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Sales Report →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2 text-center">Qty Sold</th>
                  <th className="pb-2 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProducts.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-2.5 font-semibold text-slate-900 truncate max-w-[200px]">
                      {p.name}
                    </td>
                    <td className="py-2.5 text-center font-mono text-slate-600">
                      {p.qty}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      {formatIndianCurrency(p.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Customers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">
              Top Wholesale Customers
            </h2>
            <button
              onClick={() => onNavigate('customers')}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Customer Directory →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="pb-2">Retailer / Shop</th>
                  <th className="pb-2 text-center">Orders</th>
                  <th className="pb-2 text-right">Total Billed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topCustomers.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-900 truncate max-w-[180px]">
                        {c.shop}
                      </div>
                      <div className="text-[10px] text-slate-500">{c.name}</div>
                    </td>
                    <td className="py-2.5 text-center font-mono text-slate-600">
                      {c.orders}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      {formatIndianCurrency(c.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
