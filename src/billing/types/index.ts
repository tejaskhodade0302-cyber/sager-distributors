export type UserRole = 'admin' | 'owner' | 'billing_staff' | 'accountant';

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  phone?: string;
  email?: string;
}

export interface BusinessProfile {
  businessName: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  stateCode: string; // e.g. "27" for Maharashtra
  pincode: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  dlNo20B: string;
  dlNo21B: string;
  dlNo20D: string;
  vatTin: string;
  jurisdiction: string;
  ewbNo?: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  branch: string;
  upiId: string;
  termsAndConditions: string;
  invoicePrefix: string;
  financialYear: string; // e.g. "2026-27"
  defaultPrintFormat: 'A4' | 'THERMAL_80MM';
  logoUrl?: string;
}

export interface BatchLot {
  id: string;
  batchNo: string;
  expiryDate: string; // MM/YY or YYYY-MM-DD
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  hsn: string;
  category: string;
  brand: string;
  mfr?: string; // Manufacturer code e.g. "HET", "FDC"
  pack?: string; // Pack size e.g. "10'S"
  dc?: string; // DC code
  unit: 'pcs' | 'box' | 'carton' | 'kg' | 'litre' | 'pack' | 'bag';
  packSize: string; // e.g. "10'S" or "12 pcs / box"
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  gstRate: number; // 0, 5, 12, 18, 28
  openingStock: number;
  currentStock: number;
  minStockLevel: number;
  batches?: BatchLot[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  customerCode?: string; // e.g. "0019"
  name: string;
  shopName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  gstin?: string;
  dlNo?: string; // e.g. "20MH/JAL/465294 , 21MH/JAL/465295"
  pan?: string;
  creditLimit: number;
  creditDays: number;
  openingBalance: number;
  currentBalance: number; // positive = customer owes money (debit)
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  stateCode: string;
  gstin?: string;
  openingBalance: number;
  currentBalance: number; // positive = we owe supplier (credit)
  createdAt: string;
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  sku: string;
  hsn: string;
  mfr?: string;
  pack?: string;
  dc?: string;
  mrp?: number;
  batchNo?: string;
  expiryDate?: string;
  unit: string;
  quantity: number;
  freeQty?: number;
  rate: number; // unit rate before tax
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  taxableAmount: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTaxAmount: number;
  lineTotal: number;
}

export type PaymentMode = 'cash' | 'upi' | 'bank' | 'cheque' | 'credit';

export interface SalesInvoice {
  id: string;
  invoiceNo: string;
  memoType?: 'CREDIT MEMO' | 'CASH MEMO';
  date: string; // YYYY-MM-DD
  dueDate?: string;
  ewbNo?: string;
  customerId: string; // 'walk-in' or UUID
  customerCode?: string;
  customerName: string;
  customerShopName?: string;
  customerDlNo?: string;
  customerPhone?: string;
  customerAddress?: string;
  customerCity?: string;
  customerState?: string;
  customerStateCode: string;
  customerGstin?: string;
  isInterState: boolean;
  items: InvoiceItem[];
  totalQtyWithFree?: number;
  subTotal: number;
  grossAmount?: number;
  totalDiscount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMode: PaymentMode;
  paidAmount: number;
  balanceDue: number;
  notes?: string;
  status: 'active' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface PurchaseInvoice {
  id: string;
  purchaseNo: string;
  supplierInvoiceNo: string;
  date: string;
  supplierId: string;
  supplierName: string;
  supplierGstin?: string;
  items: InvoiceItem[];
  subTotal: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentMode: PaymentMode;
  paidAmount: number;
  balanceDue: number;
  notes?: string;
  status: 'active' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export interface SalesReturn {
  id: string;
  returnNo: string;
  originalInvoiceId?: string;
  originalInvoiceNo?: string;
  customerId: string;
  customerName: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  reason: string;
  refundStatus: 'adjusted_in_ledger' | 'refunded_cash';
  createdBy: string;
  createdAt: string;
}

export interface PurchaseReturn {
  id: string;
  returnNo: string;
  originalPurchaseId?: string;
  originalPurchaseNo?: string;
  supplierId: string;
  supplierName: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  voucherNo: string;
  type: 'receipt' | 'payment'; // receipt from customer, payment to supplier
  partyType: 'customer' | 'supplier';
  partyId: string;
  partyName: string;
  date: string;
  amount: number;
  paymentMode: PaymentMode;
  referenceNo?: string;
  invoiceId?: string;
  invoiceNo?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  partyId: string;
  partyType: 'customer' | 'supplier';
  date: string;
  type: 'invoice' | 'payment' | 'return' | 'opening_balance';
  referenceNo: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
}
