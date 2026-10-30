import React from 'react';
import { SalesInvoice, BusinessProfile } from '../../types';
import { formatIndianCurrency, formatDateIndian } from '../../utils/indianFormatters';
import { Printer, X, Share2 } from 'lucide-react';

interface InvoicePrintThermalProps {
  invoice: SalesInvoice;
  business: BusinessProfile;
  onClose: () => void;
}

export const InvoicePrintThermal: React.FC<InvoicePrintThermalProps> = ({ invoice, business, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const phone = invoice.customerPhone ? invoice.customerPhone.replace(/\D/g, '') : '';
    const text = encodeURIComponent(
      `*${business.businessName}* (Bill No: ${invoice.invoiceNo})\n` +
      `Date: ${formatDateIndian(invoice.date)}\n` +
      `Customer: ${invoice.customerShopName || invoice.customerName}\n` +
      `Total Amount: ${formatIndianCurrency(invoice.grandTotal)}\n` +
      `Payment: ${invoice.paymentMode.toUpperCase()}\n` +
      `UPI ID: ${business.upiId}\nThank you!`
    );
    const targetUrl = phone ? `https://wa.me/91${phone.slice(-10)}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 overflow-y-auto p-4 md:p-8 flex flex-col items-center">
      {/* Top action toolbar */}
      <div className="no-print w-full max-w-sm bg-slate-800 text-white px-4 py-2.5 rounded-t-xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-200">Thermal 80mm Slip</span>
          <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">{invoice.invoiceNo}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleWhatsAppShare}
            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs transition-colors"
            title="Share via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold transition-colors"
          >
            <Printer className="w-3 h-3" />
            Print
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 80mm Thermal Receipt Canvas (approx 300px width for standard 80mm thermal paper) */}
      <div className="printable-area w-full max-w-sm bg-white text-slate-900 p-4 shadow-2xl rounded-b-xl border border-slate-300 font-mono text-xs print:p-0 print:border-none print:shadow-none print:w-[76mm]">
        {/* Header */}
        <div className="text-center pb-2 border-b border-dashed border-slate-400">
          <h2 className="text-base font-bold uppercase tracking-tight text-slate-950">{business.businessName}</h2>
          <p className="text-[10px] text-slate-600 uppercase">{business.tagline}</p>
          <p className="text-[10px] text-slate-700">{business.address}, {business.city}</p>
          <p className="text-[10px] text-slate-700">Ph: {business.phone}</p>
          <p className="text-[10px] font-bold text-slate-900">GSTIN: {business.gstin}</p>
        </div>

        {/* Invoice Info */}
        <div className="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[11px]">
          <div className="flex justify-between">
            <span>Bill No:</span>
            <span className="font-bold">{invoice.invoiceNo}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{formatDateIndian(invoice.date)}</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span className="font-semibold truncate max-w-[170px]">{invoice.customerShopName || invoice.customerName}</span>
          </div>
          {invoice.customerGstin && (
            <div className="flex justify-between">
              <span>GSTIN:</span>
              <span>{invoice.customerGstin}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Mode / Status:</span>
            <span className="uppercase font-semibold">{invoice.paymentMode} / {invoice.paymentStatus}</span>
          </div>
        </div>

        {/* Item Rows */}
        <div className="py-2 border-b border-dashed border-slate-400 text-[11px]">
          <div className="flex justify-between font-bold border-b border-slate-200 pb-1 mb-1">
            <span className="w-1/2">Item</span>
            <span className="w-1/4 text-center">Qty x Rate</span>
            <span className="w-1/4 text-right">Amt</span>
          </div>
          {invoice.items.map((item, idx) => (
            <div key={idx} className="py-1">
              <div className="font-semibold text-slate-900 leading-tight">{item.productName}</div>
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>
                  {item.quantity} {item.unit} @ ₹{item.rate} ({item.gstRate}% GST)
                </span>
                <span className="font-bold text-slate-900 font-mono">₹{item.lineTotal.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span>Taxable Amount:</span>
            <span>{formatIndianCurrency(invoice.subTotal)}</span>
          </div>
          {invoice.totalDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount:</span>
              <span>-{formatIndianCurrency(invoice.totalDiscount)}</span>
            </div>
          )}
          {invoice.isInterState ? (
            <div className="flex justify-between">
              <span>IGST Total:</span>
              <span>{formatIndianCurrency(invoice.totalIgst)}</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <span>CGST Total:</span>
                <span>{formatIndianCurrency(invoice.totalCgst)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST Total:</span>
                <span>{formatIndianCurrency(invoice.totalSgst)}</span>
              </div>
            </>
          )}
          {invoice.roundOff !== 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Round Off:</span>
              <span>{invoice.roundOff.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold border-t border-slate-800 pt-1 text-slate-950">
            <span>NET PAYABLE:</span>
            <span className="text-base">{formatIndianCurrency(invoice.grandTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount Paid:</span>
            <span className="font-semibold text-emerald-800">{formatIndianCurrency(invoice.paidAmount)}</span>
          </div>
          {invoice.balanceDue > 0 && (
            <div className="flex justify-between font-bold text-rose-700">
              <span>Balance Due:</span>
              <span>{formatIndianCurrency(invoice.balanceDue)}</span>
            </div>
          )}
        </div>

        {/* QR Code & Footer */}
        <div className="pt-2 text-center text-[10px] space-y-1">
          <p className="font-bold">Pay via UPI: <span className="text-indigo-700">{business.upiId}</span></p>
          <p className="text-slate-500">A/C: {business.accountNo} | IFSC: {business.ifscCode}</p>
          <p className="font-medium text-slate-700 mt-2">*** THANK YOU! VISIT AGAIN ***</p>
          <p className="text-[9px] text-slate-400">Software: Sagar Distributor POS</p>
        </div>
      </div>
    </div>
  );
};
