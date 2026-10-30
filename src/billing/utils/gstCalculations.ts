/**
 * GST Calculation and Tax Validation Utilities
 * Sagar Distributor - Wholesale Billing System
 */

import { InvoiceItem } from '../types';

/**
 * Calculates item-level pricing, discounts, and GST breakdown
 */
export function calculateItemGst(params: {
  rate: number;
  quantity: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  gstRate: number;
  isInterState: boolean;
}): {
  discountAmount: number;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTaxAmount: number;
  lineTotal: number;
} {
  const { rate, quantity, discountType, discountValue, gstRate, isInterState } = params;

  const grossAmount = Math.max(0, rate * quantity);

  let discountAmount = 0;
  if (discountType === 'percentage') {
    discountAmount = (grossAmount * Math.min(100, Math.max(0, discountValue))) / 100;
  } else {
    discountAmount = Math.min(grossAmount, Math.max(0, discountValue));
  }

  const taxableAmount = Math.round((grossAmount - discountAmount) * 100) / 100;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstAmount = Math.round(((taxableAmount * gstRate) / 100) * 100) / 100;
  } else {
    const halfRate = gstRate / 2;
    cgstAmount = Math.round(((taxableAmount * halfRate) / 100) * 100) / 100;
    sgstAmount = Math.round(((taxableAmount * halfRate) / 100) * 100) / 100;
  }

  const totalTaxAmount = Math.round((cgstAmount + sgstAmount + igstAmount) * 100) / 100;
  const lineTotal = Math.round((taxableAmount + totalTaxAmount) * 100) / 100;

  return {
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxableAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalTaxAmount,
    lineTotal,
  };
}

/**
 * Recalculates all items in an invoice when state changes (e.g., intra-state to inter-state)
 */
export function recalculateItemsForState(items: InvoiceItem[], isInterState: boolean): InvoiceItem[] {
  return items.map((item) => {
    const calc = calculateItemGst({
      rate: item.rate,
      quantity: item.quantity,
      discountType: item.discountType,
      discountValue: item.discountValue,
      gstRate: item.gstRate,
      isInterState,
    });

    return {
      ...item,
      discountAmount: calc.discountAmount,
      taxableAmount: calc.taxableAmount,
      cgstAmount: calc.cgstAmount,
      sgstAmount: calc.sgstAmount,
      igstAmount: calc.igstAmount,
      totalTaxAmount: calc.totalTaxAmount,
      lineTotal: calc.lineTotal,
    };
  });
}

/**
 * Calculates overall invoice totals including round-off and tax breakdowns
 */
export function calculateInvoiceTotals(items: InvoiceItem[]) {
  let subTotal = 0;
  let totalDiscount = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let totalTax = 0;
  let exactTotal = 0;

  for (const item of items) {
    subTotal += item.taxableAmount;
    totalDiscount += item.discountAmount;
    totalCgst += item.cgstAmount;
    totalSgst += item.sgstAmount;
    totalIgst += item.igstAmount;
    totalTax += item.totalTaxAmount;
    exactTotal += item.lineTotal;
  }

  subTotal = Math.round(subTotal * 100) / 100;
  totalDiscount = Math.round(totalDiscount * 100) / 100;
  totalCgst = Math.round(totalCgst * 100) / 100;
  totalSgst = Math.round(totalSgst * 100) / 100;
  totalIgst = Math.round(totalIgst * 100) / 100;
  totalTax = Math.round(totalTax * 100) / 100;
  exactTotal = Math.round(exactTotal * 100) / 100;

  const grandTotal = Math.round(exactTotal);
  const roundOff = Math.round((grandTotal - exactTotal) * 100) / 100;

  return {
    subTotal,
    totalDiscount,
    totalCgst,
    totalSgst,
    totalIgst,
    totalTax,
    roundOff,
    grandTotal,
  };
}

/**
 * Validates 15-character Indian Goods and Services Tax Identification Number (GSTIN)
 * Format: 2 digits (State code) + 10 chars (PAN) + 1 digit (Entity) + 'Z' + 1 checksum char
 */
export function validateGstin(gstin?: string): {
  isValid: boolean;
  stateCode?: string;
  pan?: string;
  error?: string;
} {
  if (!gstin || !gstin.trim()) {
    return { isValid: true }; // GSTIN can be optional for unregistered retail buyers
  }

  const cleanGstin = gstin.trim().toUpperCase();
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstinRegex.test(cleanGstin)) {
    return {
      isValid: false,
      error: 'Invalid GSTIN format. Expected: 22AAAAA0000A1Z5 (15 characters).',
    };
  }

  const stateCode = cleanGstin.substring(0, 2);
  const pan = cleanGstin.substring(2, 12);

  return {
    isValid: true,
    stateCode,
    pan,
  };
}

/**
 * Validate 10-digit Indian Mobile Number
 */
export function validatePhone(phone?: string): boolean {
  if (!phone) return true;
  const cleanPhone = phone.replace(/\D/g, '');
  // Allows 10 digits starting with 6, 7, 8, or 9
  return /^[6-9]\d{9}$/.test(cleanPhone.slice(-10));
}

/**
 * Validate 6-digit Indian Pincode
 */
export function validatePincode(pincode?: string): boolean {
  if (!pincode) return true;
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Validate 10-character Indian Permanent Account Number (PAN)
 */
export function validatePan(pan?: string): boolean {
  if (!pan) return true;
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
}

/**
 * Get financial year string for current date, e.g. "2026-27"
 * In India, FY runs from 1st April to 31st March.
 */
export function getCurrentFinancialYear(date: Date = new Date()): string {
  const month = date.getMonth(); // 0 is January, 3 is April
  const year = date.getFullYear();

  if (month >= 3) {
    // April to December
    const nextYearShort = String((year + 1) % 100).padStart(2, '0');
    return `${year}-${nextYearShort}`;
  } else {
    // January to March
    const currentYearShort = String(year % 100).padStart(2, '0');
    return `${year - 1}-${currentYearShort}`;
  }
}
