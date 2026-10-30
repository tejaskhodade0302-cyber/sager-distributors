import React from 'react';
import { SalesInvoice, BusinessProfile } from '../../types';
import { formatIndianCurrency, formatDateIndian, numberToWordsIndian } from '../../utils/indianFormatters';
import { Printer, X, Download, Share2, Copy } from 'lucide-react';

interface InvoicePrintA4Props {
  invoice: SalesInvoice;
  business: BusinessProfile;
  onClose: () => void;
}

export const InvoicePrintA4: React.FC<InvoicePrintA4Props> = ({ invoice, business, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Group items by GST rate for the mini tax box
  const taxSummaryMap = new Map<
    number,
    {
      gstRate: number;
      gross: number;
      discount: number;
      taxable: number;
      cgst: number;
      sgst: number;
      igst: number;
    }
  >();

  let totalGross = 0;
  let totalDiscount = invoice.totalDiscount || 0;
  let totalBilledUnits = 0;

  for (const item of invoice.items) {
    const lineGross = (item.mrp && item.mrp > 0 ? item.mrp : item.rate) * item.quantity;
    totalGross += lineGross;
    totalBilledUnits += (item.quantity || 0) + (item.freeQty || 0);

    const rate = item.gstRate;
    const existing = taxSummaryMap.get(rate) || {
      gstRate: rate,
      gross: 0,
      discount: 0,
      taxable: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    };
    existing.gross += lineGross;
    existing.discount += item.discountAmount || 0;
    existing.taxable += item.taxableAmount;
    existing.cgst += item.cgstAmount;
    existing.sgst += item.sgstAmount;
    existing.igst += item.igstAmount;
    taxSummaryMap.set(rate, existing);
  }

  const taxSummaries = Array.from(taxSummaryMap.values());
  const effectiveGross = invoice.grossAmount || (totalGross > 0 ? totalGross : invoice.subTotal + totalDiscount);
  const totalItemsCount = invoice.items.length;
  const totalUnitsWithFree = invoice.totalQtyWithFree || totalBilledUnits;

  const handleWhatsAppShare = () => {
    const phone = invoice.customerPhone ? invoice.customerPhone.replace(/\D/g, '') : '';
    const itemsSummary = invoice.items
      .map(
        (i) =>
          `• ${i.productName} (${i.pack || "10'S"}) Qty: ${i.quantity}${i.freeQty ? ` + ${i.freeQty} Free` : ''} - ₹${i.lineTotal}`
      )
      .join('\n');

    const text = encodeURIComponent(
      `*GST TAX INVOICE - ${business.businessName}*\n` +
      `Inv No: *${invoice.invoiceNo}* | Date: ${formatDateIndian(invoice.date)}\n` +
      `Billed To: ${invoice.customerShopName || invoice.customerName}\n\n` +
      `*Items:*\n${itemsSummary}\n\n` +
      `Gross: ₹${effectiveGross.toFixed(2)}\n` +
      `Less Discount: ₹${totalDiscount.toFixed(2)}\n` +
      `Add GST: ₹${invoice.totalTax.toFixed(2)}\n` +
      `*Net Amt R/O: ₹${invoice.grandTotal.toFixed(2)}*\n\n` +
      `*Bank Details:*\n` +
      `Bank: ${business.bankName}\n` +
      `A/C: ${business.accountNo}\n` +
      `IFSC: ${business.ifscCode}\n` +
      `Jurisdiction: ${business.jurisdiction || 'JALGAON'}\n\nThank you!`
    );
    const targetUrl = phone ? `https://wa.me/91${phone.slice(-10)}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(targetUrl, '_blank');
  };

  // Format invoice date DD/MM/YYYY
  const formatDdMmYyyy = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const rawCustomerTitle = (invoice.customerShopName || invoice.customerName || 'OM MEDICAL').trim();
  const customerTitle = invoice.customerCode && !rawCustomerTitle.startsWith(invoice.customerCode)
    ? `${invoice.customerCode} ${rawCustomerTitle}`
    : rawCustomerTitle;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 overflow-y-auto p-2 sm:p-6 flex flex-col items-center print:static print:bg-white print:p-0 print:m-0 print:overflow-visible print:block">
      {/* Top action toolbar (hidden when printing) */}
      <div className="no-print w-full max-w-[1020px] bg-slate-800 text-white px-6 py-3 rounded-t-xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-100">
            Sagar Distributor Official Bill Format
          </span>
          <span className="text-xs bg-slate-700 text-indigo-300 px-2.5 py-0.5 rounded font-mono font-bold">
            {invoice.invoiceNo}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            (Exact Chalisgaon/Jalgaon Wholesale Pharma Bill)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share WhatsApp
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Bill / PDF
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Official Sagar Distributor Bill Document Sheet */}
      <div className="printable-area w-full max-w-[1020px] bg-white text-slate-900 p-4 sm:p-6 shadow-2xl rounded-b-xl border border-slate-400 font-mono text-[11px] leading-tight print:p-0 print:border-none print:shadow-none print:max-w-none">
        
        {/* Main Box Outer Border */}
        <div className="border-2 border-slate-900 print:border-slate-950">
          
          {/* HEADER ROW: TWO COLUMNS (50% LEFT / 50% RIGHT) */}
          <div className="grid grid-cols-2 border-b-2 border-slate-900">
            
            {/* LEFT HEADER: SUPPLIER (SAGAR DISTRIBUTOR) */}
            <div className="p-3 border-r-2 border-slate-900 space-y-1">
              <h1 className="text-base font-bold tracking-wider text-slate-950 underline italic">
                {business.businessName || 'SAGAR DISTRIBUTOR'}
              </h1>
              <p className="text-[10px] font-semibold text-slate-900 uppercase">
                {business.address || "SHOP NO.F-25,1'ST FLOOR,GANESH COMPLEX,GANESH ROAD"}
              </p>
              <p className="text-[10px] font-semibold text-slate-900 uppercase">
                {business.city || 'CHALISGAON'}
                <span className="ml-1 font-mono">{business.phone || 'Ph.:02589-228823,MOB.:9421514788,MOB.:7588194488'}</span>
              </p>

              <div className="grid grid-cols-12 text-[10px] pt-1">
                <div className="col-span-6 space-y-0.5">
                  <p><strong>STATE : </strong><span className="uppercase">{business.state || 'MAHARASHTRA'}</span></p>
                  <p className="pt-1"><strong>GSTIN : </strong><span className="font-bold">{business.gstin || '27ABJFS8393Q1ZY'}</span></p>
                  <p className="pt-2"><strong>EWB NO. : </strong>{invoice.ewbNo || business.ewbNo || ''}</p>
                </div>
                <div className="col-span-6 space-y-0.5 pl-2">
                  <p><strong>D.L.NO.:</strong>{business.dlNo20B || '20B/JAL/233699'}</p>
                  <p className="pl-12">{business.dlNo21B || '21B/JAL/233701'}</p>
                  <p className="pl-12">{business.dlNo20D || '20D/JAL/233700'}</p>
                  <p><strong>VAT TIN :</strong>{business.vatTin || '27440633504V/C'}</p>
                </div>
              </div>
            </div>

            {/* RIGHT HEADER: RECEIVER (BILLED TO) */}
            <div className="p-3 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-semibold text-slate-800">Details Of Receiver (Billed To)</p>
                <p className="text-sm font-bold text-slate-950 tracking-wide mt-0.5">
                  {customerTitle}
                </p>
                <p className="text-[11px] text-slate-900 uppercase">{invoice.customerAddress || 'POTDAR SCHOOL.'}</p>
                <p className="text-[11px] font-semibold text-slate-900 uppercase">{invoice.customerCity || 'CHALISGAON'}</p>
                
                <p className="text-[10px] text-slate-900 mt-1">
                  <strong>D.L.No. </strong>{invoice.customerDlNo || '20MH/JAL/465294 , 21MH/JAL/465295'}
                </p>
                
                <div className="flex justify-between items-baseline text-[10px] mt-0.5">
                  <p><strong>GSTIN : </strong>{invoice.customerGstin || ''}</p>
                  <p className="font-bold tracking-wide uppercase text-slate-950">{invoice.memoType || 'CREDIT MEMO'}</p>
                </div>
              </div>

              {/* Title & Invoice No Strip */}
              <div className="pt-2 mt-1 border-t border-slate-300">
                <div className="flex justify-between items-center text-[11px]">
                  <p><strong>State : </strong><span className="uppercase">{invoice.customerState || business.state || 'MAHARASHTRA'}</span></p>
                  <p><strong>INV.NO.: </strong><span className="font-bold text-xs">{invoice.invoiceNo}</span></p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <h2 className="text-sm font-bold tracking-wider text-slate-950 uppercase mx-auto pl-8">
                    GST TAX INVOICE
                  </h2>
                  <p className="text-[11px]">
                    <strong>INV.DT.: </strong>
                    <span className="font-bold">{formatDdMmYyyy(invoice.date)}</span>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* PRODUCT ITEMS TABLE */}
          <div className="w-full">
            <table className="w-full text-[10.5px] border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-950 font-bold bg-slate-50/50">
                  <th className="py-1 px-1.5 text-left border-r-2 border-slate-900 w-14">HSN</th>
                  <th className="py-1 px-1 text-center border-r-2 border-slate-900 w-10">D.C.</th>
                  <th className="py-1 px-1.5 text-right border-r-2 border-slate-900 w-16">M.R.P.</th>
                  <th className="py-1 px-2 text-left border-r-2 border-slate-900 min-w-[200px]">Product</th>
                  <th className="py-1 px-1 text-center border-r-2 border-slate-900 w-12">Mfr</th>
                  <th className="py-1 px-1 text-center border-r-2 border-slate-900 w-12">Pack</th>
                  <th className="py-1 px-1.5 text-left border-r-2 border-slate-900 w-24">Batch No</th>
                  <th className="py-1 px-1 text-center border-r-2 border-slate-900 w-14">Exp.</th>
                  <th className="py-1 px-1 text-right border-r-2 border-slate-900 w-12">Qty.</th>
                  <th className="py-1 px-1 text-right border-r-2 border-slate-900 w-12">Free</th>
                  <th className="py-1 px-1.5 text-right border-r-2 border-slate-900 w-16">Rate</th>
                  <th className="py-1 px-1 text-center border-r-2 border-slate-900 w-14">GST%</th>
                  <th className="py-1 px-2 text-right w-20">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => {
                  const mrpVal = item.mrp || (item.rate * 1.3).toFixed(2);

                  return (
                    <tr key={idx} className="leading-tight">
                      <td className="py-1 px-1.5 text-left font-mono border-r-2 border-slate-900">{item.hsn}</td>
                      <td className="py-1 px-1 text-center font-mono border-r-2 border-slate-900">{item.dc || ''}</td>
                      <td className="py-1 px-1.5 text-right font-mono border-r-2 border-slate-900">
                        {Number(mrpVal).toFixed(2)}
                      </td>
                      <td className="py-1 px-2 text-left font-bold text-slate-950 border-r-2 border-slate-900">
                        {item.productName}
                      </td>
                      <td className="py-1 px-1 text-center uppercase font-mono border-r-2 border-slate-900">
                        {item.mfr || 'GEN'}
                      </td>
                      <td className="py-1 px-1 text-center font-mono border-r-2 border-slate-900">
                        {item.pack || "10'S"}
                      </td>
                      <td className="py-1 px-1.5 text-left font-mono font-semibold border-r-2 border-slate-900">
                        {item.batchNo || '—'}
                      </td>
                      <td className="py-1 px-1 text-center font-mono border-r-2 border-slate-900">
                        {item.expiryDate || '—'}
                      </td>
                      <td className="py-1 px-1 text-right font-mono font-bold border-r-2 border-slate-900">
                        {item.quantity.toFixed(item.quantity % 1 === 0 ? 0 : 2)}
                      </td>
                      <td className="py-1 px-1 text-right font-mono border-r-2 border-slate-900">
                        {item.freeQty && item.freeQty > 0 ? item.freeQty.toFixed(2) : ''}
                      </td>
                      <td className="py-1 px-1.5 text-right font-mono border-r-2 border-slate-900">
                        {item.rate.toFixed(2)}
                      </td>
                      <td className="py-1 px-1 text-center font-mono border-r-2 border-slate-900">
                        {item.gstRate.toFixed(2)}
                      </td>
                      <td className="py-1 px-2 text-right font-mono font-bold text-slate-950">
                        {item.lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}

                {/* Fill empty lines to give the authentic dot-matrix / wholesale bill height */}
                {Array.from({ length: Math.max(0, 10 - invoice.items.length) }).map((_, emptyIdx) => (
                  <tr key={`empty-${emptyIdx}`} className="h-6 leading-tight">
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td className="border-r-2 border-slate-900"></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MID SUMMARY STRIP (TAX TABLE ON LEFT, TOTALS ON RIGHT) */}
          <div className="border-t-2 border-slate-900 grid grid-cols-12 min-h-[110px]">
            
            {/* LEFT SIDE: MINI TAX BREAKDOWN TABLE */}
            <div className="col-span-6 p-2 border-r-2 border-slate-900 flex flex-col justify-between">
              <div>
                <table className="w-full text-[10px] border border-slate-900 text-center border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 bg-slate-50">
                      <th className="py-1 px-1 border-r border-slate-900">CGST%</th>
                      <th className="py-1 px-1 border-r border-slate-900">SGST%</th>
                      <th className="py-1 px-1 border-r border-slate-900">Gross</th>
                      <th className="py-1 px-1 border-r border-slate-900">Discount</th>
                      <th className="py-1 px-1 border-r border-slate-900">Taxable</th>
                      <th className="py-1 px-1 border-r border-slate-900">CGST</th>
                      <th className="py-1 px-1">SGST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxSummaries.map((tax, i) => (
                      <tr key={i} className="font-mono">
                        <td className="py-1 px-1 border-r border-slate-900">{(tax.gstRate / 2).toFixed(2)}</td>
                        <td className="py-1 px-1 border-r border-slate-900">{(tax.gstRate / 2).toFixed(2)}</td>
                        <td className="py-1 px-1 border-r border-slate-900">{effectiveGross.toFixed(2)}</td>
                        <td className="py-1 px-1 border-r border-slate-900">{totalDiscount.toFixed(2)}</td>
                        <td className="py-1 px-1 border-r border-slate-900">{invoice.subTotal.toFixed(2)}</td>
                        <td className="py-1 px-1 border-r border-slate-900">{invoice.totalCgst.toFixed(2)}</td>
                        <td className="py-1 px-1">{invoice.totalSgst.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Items Count line */}
              <div className="pt-2 text-[11px] font-bold text-slate-900 flex items-center justify-between">
                <span>
                  No of items &nbsp;&nbsp;&nbsp;&nbsp;{totalItemsCount} &nbsp;&nbsp;&nbsp;&nbsp;/{' '}
                  {totalUnitsWithFree}
                </span>
                <span className="uppercase text-[10px] font-semibold text-slate-700">CUST.COPY</span>
              </div>
            </div>

            {/* RIGHT SIDE: BANK DETAILS & FINANCIAL TOTALS */}
            <div className="col-span-6 p-2 flex flex-col justify-between">
              
              <div className="grid grid-cols-12 text-[10.5px]">
                {/* Bank details info */}
                <div className="col-span-6 space-y-0.5 text-slate-900">
                  <p><strong>BANK NAME :- </strong>{business.bankName || 'HDFC BANK'}</p>
                  <p><strong>A/C NO.:- </strong><span className="font-bold font-mono">{business.accountNo || '24018970000152'}</span></p>
                  <p><strong>IFSC CODE :- </strong><span className="font-mono">{business.ifscCode || 'HDFC0002401'}</span></p>
                </div>

                {/* Gross, Discount, GST amounts */}
                <div className="col-span-6 space-y-1 text-right font-mono">
                  <div className="flex justify-between">
                    <span className="font-sans font-semibold">Gross :</span>
                    <span className="font-bold">{effectiveGross.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">Less Discount</span>
                    <span>{totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-sans">$ Add GST Amount</span>
                    <span className="font-bold">{invoice.totalTax.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Net Amount R/O big line */}
              <div className="border-t-2 border-slate-900 pt-1.5 flex justify-between items-baseline font-mono">
                <span className="text-xs font-bold font-sans tracking-wide">Net Amt R/O</span>
                <span className="text-lg font-bold text-slate-950 font-mono tracking-tight">
                  {invoice.grandTotal.toFixed(2)}
                </span>
              </div>

            </div>

          </div>

          {/* BOTTOM DECLARATION & AUTHORISED SIGNATORY ROW */}
          <div className="border-t-2 border-slate-900 grid grid-cols-12">
            
            {/* Declaration box */}
            <div className="col-span-8 p-2.5 border-r-2 border-slate-900 text-[10px] leading-tight text-slate-900">
              <p className="font-bold underline text-slate-950 mb-1">Declaration</p>
              <p className="leading-normal">
                {business.termsAndConditions ||
                  'I/We declare that this invoice shows actual price of The goods and or services described and that all particulars are true and correct. Error and Omission in the this invoice shall be subject to jurisdiction of the JALGAON'}
              </p>
            </div>

            {/* Authorised signatory box */}
            <div className="col-span-4 p-2.5 text-right flex flex-col justify-between items-end">
              <p className="text-xs font-bold text-slate-950 uppercase tracking-tight">
                For {business.businessName || 'SAGAR DISTRIBUTOR'}
              </p>

              {/* Stylized blue signature stamp matching photo */}
              <div className="my-1 pr-6 flex flex-col items-center">
                <svg className="w-24 h-10 text-blue-700" viewBox="0 0 120 40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 25 C 20 10, 30 35, 45 15 C 55 5, 60 30, 75 18 C 90 8, 100 28, 115 15" strokeLinecap="round" />
                  <path d="M15 32 Q 60 22 110 20" strokeLinecap="round" />
                </svg>
              </div>

              <p className="text-xs font-bold text-slate-900">Authorised signatory</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
