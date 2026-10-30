/**
 * Data Storage & Service Layer for Sagar Distributor
 * Browser-persisted (localStorage with clean service abstraction)
 * Easily swappable for REST API or Firestore in the future.
 */

import {
  BusinessProfile,
  Product,
  Customer,
  Supplier,
  SalesInvoice,
  PurchaseInvoice,
  SalesReturn,
  PurchaseReturn,
  PaymentRecord,
  LedgerEntry,
  ActivityLog,
  User,
} from '../types';
import {
  INITIAL_BUSINESS_PROFILE,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_INVOICES,
  INITIAL_PURCHASES,
  INITIAL_PAYMENTS,
  INITIAL_ACTIVITY_LOGS,
} from './seedData';
import { getCurrentFinancialYear } from '../utils/gstCalculations';

const STORAGE_KEYS = {
  PROFILE: 'sagar_business_profile',
  USERS: 'sagar_users',
  CURRENT_USER_ID: 'sagar_current_user_id',
  AUTH_SESSION: 'sagar_billing_auth_session',
  PRODUCTS: 'sagar_products',
  CUSTOMERS: 'sagar_customers',
  SUPPLIERS: 'sagar_suppliers',
  INVOICES: 'sagar_invoices',
  PURCHASES: 'sagar_purchases',
  SALES_RETURNS: 'sagar_sales_returns',
  PURCHASE_RETURNS: 'sagar_purchase_returns',
  PAYMENTS: 'sagar_payments',
  ACTIVITY_LOGS: 'sagar_activity_logs',
};

class DatabaseService {
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.error(`Error loading key ${key}:`, e);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key}:`, e);
    }
  }

  public init(): void {
    if (this.isInitialized) return;

    const existingProfile = this.getItem<BusinessProfile | null>(STORAGE_KEYS.PROFILE, null);
    if (!existingProfile || !existingProfile.dlNo20B || existingProfile.city === 'Pune') {
      this.setItem(STORAGE_KEYS.PROFILE, INITIAL_BUSINESS_PROFILE);
    }

    // Initialize or migrate users to include passwords and staff accounts
    const existingUsers = this.getItem<User[]>(STORAGE_KEYS.USERS, []);
    if (!existingUsers || existingUsers.length === 0) {
      this.setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    } else {
      const updatedList = [...existingUsers];
      for (const initialUser of INITIAL_USERS) {
        const foundIndex = updatedList.findIndex(
          (u) => u.username.toLowerCase() === initialUser.username.toLowerCase() || u.id === initialUser.id
        );
        if (foundIndex === -1) {
          updatedList.push(initialUser);
        } else if (!updatedList[foundIndex].password) {
          updatedList[foundIndex].password = initialUser.password;
        }
      }
      this.setItem(STORAGE_KEYS.USERS, updatedList);
    }

    // Ensure products have pharma items from bill
    let currentProducts = this.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
    if (!currentProducts || currentProducts.length === 0) {
      this.setItem(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    } else if (!currentProducts.some((p) => p.sku === 'OPOX-200')) {
      currentProducts = [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[1], INITIAL_PRODUCTS[2], ...currentProducts];
      this.setItem(STORAGE_KEYS.PRODUCTS, currentProducts);
    }

    // Ensure customers have OM MEDICAL
    let currentCustomers = this.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    if (!currentCustomers || currentCustomers.length === 0) {
      this.setItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    } else if (!currentCustomers.some((c) => c.customerCode === '0019')) {
      currentCustomers = [INITIAL_CUSTOMERS[0], ...currentCustomers];
      this.setItem(STORAGE_KEYS.CUSTOMERS, currentCustomers);
    }

    if (!localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) {
      this.setItem(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    }

    // Ensure invoices have INV 3525
    let currentInvoices = this.getItem<SalesInvoice[]>(STORAGE_KEYS.INVOICES, []);
    if (!currentInvoices || currentInvoices.length === 0) {
      this.setItem(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
    } else if (!currentInvoices.some((i) => i.invoiceNo === 'INV 3525')) {
      currentInvoices = [INITIAL_INVOICES[0], ...currentInvoices];
      this.setItem(STORAGE_KEYS.INVOICES, currentInvoices);
    }

    if (!localStorage.getItem(STORAGE_KEYS.PURCHASES)) {
      this.setItem(STORAGE_KEYS.PURCHASES, INITIAL_PURCHASES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      this.setItem(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
      this.setItem(STORAGE_KEYS.ACTIVITY_LOGS, INITIAL_ACTIVITY_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SALES_RETURNS)) {
      this.setItem(STORAGE_KEYS.SALES_RETURNS, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PURCHASE_RETURNS)) {
      this.setItem(STORAGE_KEYS.PURCHASE_RETURNS, []);
    }

    this.isInitialized = true;
  }

  // Business Profile
  public getBusinessProfile(): BusinessProfile {
    return this.getItem<BusinessProfile>(STORAGE_KEYS.PROFILE, INITIAL_BUSINESS_PROFILE);
  }

  public updateBusinessProfile(profile: Partial<BusinessProfile>): BusinessProfile {
    const current = this.getBusinessProfile();
    const updated = { ...current, ...profile };
    this.setItem(STORAGE_KEYS.PROFILE, updated);
    this.logActivity('UPDATE_SETTINGS', 'Updated business profile settings');
    return updated;
  }

  // Users & Staff Authentication
  public getUsers(): User[] {
    const users = this.getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    if (!users || users.length === 0) return INITIAL_USERS;
    return users;
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  public getUserByUsername(username: string): User | undefined {
    return this.getUsers().find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  }

  public isAuthenticated(): boolean {
    try {
      const session = this.getItem<{ userId: string; username: string; timestamp: string } | null>(
        STORAGE_KEYS.AUTH_SESSION,
        null
      );
      if (!session || !session.userId) return false;
      const user = this.getUserById(session.userId);
      return !!user;
    } catch {
      return false;
    }
  }

  public getCurrentUser(): User {
    const session = this.getItem<{ userId: string } | null>(STORAGE_KEYS.AUTH_SESSION, null);
    if (session?.userId) {
      const user = this.getUserById(session.userId);
      if (user) return user;
    }
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (currentId) {
      const user = this.getUserById(currentId);
      if (user) return user;
    }
    const users = this.getUsers();
    return users[0] || INITIAL_USERS[0];
  }

  public login(
    username: string,
    pass: string
  ): { success: boolean; user?: User; error?: string } {
    const cleanUsername = username.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanUsername || !cleanPass) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    const users = this.getUsers();
    const user = users.find((u) => u.username.toLowerCase() === cleanUsername);

    if (!user) {
      return {
        success: false,
        error: `Username "${username}" not found. (Use 'staff' or 'owner')`,
      };
    }

    // Validate password
    const expectedPass = user.password || (user.role === 'admin' ? 'admin123' : 'staff123');
    if (cleanPass !== expectedPass) {
      return {
        success: false,
        error: `Incorrect password for @${user.username}. (Default is ${expectedPass})`,
      };
    }

    // Set auth session in localStorage
    const session = {
      userId: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      timestamp: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.AUTH_SESSION, session);
    this.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    this.logActivity('STAFF_LOGIN', `Staff/User ${user.name} (${user.role}) logged in to billing portal`);

    return { success: true, user };
  }

  public logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.logActivity('STAFF_LOGOUT', `User ${user.name} logged out`);
    }
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    } catch (e) {
      console.error('Error logging out:', e);
    }
  }

  public setCurrentUser(userId?: string): User {
    if (userId) {
      const user = this.getUserById(userId);
      if (user) {
        this.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
        const session = {
          userId: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          timestamp: new Date().toISOString(),
        };
        this.setItem(STORAGE_KEYS.AUTH_SESSION, session);
        return user;
      }
    }
    return this.getCurrentUser();
  }

  public updateUser(userId: string, userData: Partial<User>): User {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      const newUser: User = {
        id: userId,
        name: userData.name || 'User',
        username: userData.username || 'staff',
        role: userData.role || 'billing_staff',
        ...userData,
      };
      users.push(newUser);
      this.setItem(STORAGE_KEYS.USERS, users);
      return newUser;
    }

    const updated: User = {
      ...users[index],
      ...userData,
    };
    users[index] = updated;
    this.setItem(STORAGE_KEYS.USERS, users);
    this.logActivity('UPDATE_USER', `Updated user credentials / profile: ${updated.name}`);
    return updated;
  }

  public updateCurrentUser(userData: Partial<User>): User {
    const current = this.getCurrentUser();
    return this.updateUser(current.id, userData);
  }

  // Activity Logs
  public getActivityLogs(): ActivityLog[] {
    return this.getItem<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public logActivity(action: string, details: string): void {
    const user = this.getCurrentUser();
    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userName: user ? user.name : 'System',
      userRole: user ? user.role : 'admin',
      action,
      details,
    };
    const logs = this.getActivityLogs();
    logs.unshift(newLog);
    // Keep last 200 logs
    this.setItem(STORAGE_KEYS.ACTIVITY_LOGS, logs.slice(0, 200));
  }

  // Products
  public getProducts(): Product[] {
    return this.getItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  }

  public getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  public saveProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Product {
    const products = this.getProducts();
    const now = new Date().toISOString();

    if (productData.id) {
      const index = products.findIndex((p) => p.id === productData.id);
      if (index !== -1) {
        const updated: Product = {
          ...products[index],
          ...productData,
          id: productData.id,
          updatedAt: now,
        };
        products[index] = updated;
        this.setItem(STORAGE_KEYS.PRODUCTS, products);
        this.logActivity('EDIT_PRODUCT', `Updated product: ${updated.name} (SKU: ${updated.sku})`);
        return updated;
      }
    }

    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    products.unshift(newProduct);
    this.setItem(STORAGE_KEYS.PRODUCTS, products);
    this.logActivity('ADD_PRODUCT', `Added new product: ${newProduct.name} (SKU: ${newProduct.sku})`);
    return newProduct;
  }

  public deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) return false;

    const filtered = products.filter((p) => p.id !== id);
    this.setItem(STORAGE_KEYS.PRODUCTS, filtered);
    this.logActivity('DELETE_PRODUCT', `Deleted product: ${product.name} (SKU: ${product.sku})`);
    return true;
  }

  public adjustProductStock(id: string, delta: number, batchNo?: string): Product | null {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) return null;

    product.currentStock = Math.max(0, product.currentStock + delta);
    product.updatedAt = new Date().toISOString();

    if (batchNo && product.batches) {
      const batch = product.batches.find((b) => b.batchNo === batchNo);
      if (batch) {
        batch.quantity = Math.max(0, batch.quantity + delta);
      }
    }

    this.setItem(STORAGE_KEYS.PRODUCTS, products);
    return product;
  }

  // Customers
  public getCustomers(): Customer[] {
    return this.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id);
  }

  public saveCustomer(customerData: Omit<Customer, 'id' | 'createdAt' | 'currentBalance'> & { id?: string; currentBalance?: number }): Customer {
    const customers = this.getCustomers();
    const now = new Date().toISOString();

    if (customerData.id) {
      const index = customers.findIndex((c) => c.id === customerData.id);
      if (index !== -1) {
        const updated: Customer = {
          ...customers[index],
          ...customerData,
          id: customerData.id,
          currentBalance: customerData.currentBalance !== undefined ? customerData.currentBalance : customers[index].currentBalance,
        };
        customers[index] = updated;
        this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
        this.logActivity('EDIT_CUSTOMER', `Updated customer: ${updated.shopName} (${updated.name})`);
        return updated;
      }
    }

    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      currentBalance: customerData.openingBalance || 0,
      createdAt: now,
    };
    customers.unshift(newCustomer);
    this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
    this.logActivity('ADD_CUSTOMER', `Added customer: ${newCustomer.shopName} (${newCustomer.name})`);
    return newCustomer;
  }

  public deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const cust = customers.find((c) => c.id === id);
    if (!cust) return false;

    const filtered = customers.filter((c) => c.id !== id);
    this.setItem(STORAGE_KEYS.CUSTOMERS, filtered);
    this.logActivity('DELETE_CUSTOMER', `Deleted customer: ${cust.shopName}`);
    return true;
  }

  public adjustCustomerBalance(id: string, deltaDebitMinusCredit: number): void {
    if (id === 'walk-in') return;
    const customers = this.getCustomers();
    const cust = customers.find((c) => c.id === id);
    if (cust) {
      cust.currentBalance = Math.round((cust.currentBalance + deltaDebitMinusCredit) * 100) / 100;
      this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
    }
  }

  // Customer Ledger
  public getCustomerLedger(customerId: string): LedgerEntry[] {
    const customer = this.getCustomerById(customerId);
    if (!customer) return [];

    const entries: LedgerEntry[] = [];

    // Opening balance
    if (customer.openingBalance !== 0) {
      entries.push({
        id: `open-${customer.id}`,
        partyId: customer.id,
        partyType: 'customer',
        date: customer.createdAt.split('T')[0],
        type: 'opening_balance',
        referenceNo: 'OPENING',
        description: 'Opening Balance',
        debit: customer.openingBalance > 0 ? customer.openingBalance : 0,
        credit: customer.openingBalance < 0 ? Math.abs(customer.openingBalance) : 0,
        balance: customer.openingBalance,
      });
    }

    // Invoices for this customer
    const invoices = this.getInvoices().filter((inv) => inv.customerId === customerId && inv.status === 'active');
    for (const inv of invoices) {
      entries.push({
        id: `inv-entry-${inv.id}`,
        partyId: customer.id,
        partyType: 'customer',
        date: inv.date,
        type: 'invoice',
        referenceNo: inv.invoiceNo,
        description: `Sales Invoice - ${inv.items.length} items (${inv.paymentMode.toUpperCase()})`,
        debit: inv.grandTotal,
        credit: 0,
        balance: 0, // will calculate running
      });

      // If immediate payment was made
      if (inv.paidAmount > 0) {
        entries.push({
          id: `pay-entry-inv-${inv.id}`,
          partyId: customer.id,
          partyType: 'customer',
          date: inv.date,
          type: 'payment',
          referenceNo: `RC-${inv.invoiceNo}`,
          description: `Payment received at billing (${inv.paymentMode.toUpperCase()})`,
          debit: 0,
          credit: inv.paidAmount,
          balance: 0,
        });
      }
    }

    // Direct Payments received from this customer
    const payments = this.getPayments().filter((p) => p.partyId === customerId && p.type === 'receipt');
    for (const pay of payments) {
      // Avoid double counting if already tied to invoice creation above
      if (!pay.invoiceId) {
        entries.push({
          id: `pay-entry-${pay.id}`,
          partyId: customer.id,
          partyType: 'customer',
          date: pay.date,
          type: 'payment',
          referenceNo: pay.voucherNo,
          description: `Payment Received (${pay.paymentMode.toUpperCase()}) ${pay.referenceNo ? `Ref: ${pay.referenceNo}` : ''}`,
          debit: 0,
          credit: pay.amount,
          balance: 0,
        });
      }
    }

    // Returns
    const returns = this.getSalesReturns().filter((r) => r.customerId === customerId);
    for (const ret of returns) {
      entries.push({
        id: `ret-entry-${ret.id}`,
        partyId: customer.id,
        partyType: 'customer',
        date: ret.date,
        type: 'return',
        referenceNo: ret.returnNo,
        description: `Credit Note / Sales Return - ${ret.reason}`,
        debit: 0,
        credit: ret.totalAmount,
        balance: 0,
      });
    }

    // Sort chronologically
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate running balance
    let running = 0;
    for (const entry of entries) {
      running += entry.debit - entry.credit;
      entry.balance = Math.round(running * 100) / 100;
    }

    return entries;
  }

  // Suppliers
  public getSuppliers(): Supplier[] {
    return this.getItem<Supplier[]>(STORAGE_KEYS.SUPPLIERS, []);
  }

  public getSupplierById(id: string): Supplier | undefined {
    return this.getSuppliers().find((s) => s.id === id);
  }

  public saveSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt' | 'currentBalance'> & { id?: string; currentBalance?: number }): Supplier {
    const suppliers = this.getSuppliers();
    const now = new Date().toISOString();

    if (supplierData.id) {
      const index = suppliers.findIndex((s) => s.id === supplierData.id);
      if (index !== -1) {
        const updated: Supplier = {
          ...suppliers[index],
          ...supplierData,
          id: supplierData.id,
          currentBalance: supplierData.currentBalance !== undefined ? supplierData.currentBalance : suppliers[index].currentBalance,
        };
        suppliers[index] = updated;
        this.setItem(STORAGE_KEYS.SUPPLIERS, suppliers);
        this.logActivity('EDIT_SUPPLIER', `Updated supplier: ${updated.companyName}`);
        return updated;
      }
    }

    const newSupplier: Supplier = {
      ...supplierData,
      id: `supp-${Date.now()}`,
      currentBalance: supplierData.openingBalance || 0,
      createdAt: now,
    };
    suppliers.unshift(newSupplier);
    this.setItem(STORAGE_KEYS.SUPPLIERS, suppliers);
    this.logActivity('ADD_SUPPLIER', `Added supplier: ${newSupplier.companyName}`);
    return newSupplier;
  }

  public deleteSupplier(id: string): boolean {
    const suppliers = this.getSuppliers();
    const supp = suppliers.find((s) => s.id === id);
    if (!supp) return false;

    const filtered = suppliers.filter((s) => s.id !== id);
    this.setItem(STORAGE_KEYS.SUPPLIERS, filtered);
    this.logActivity('DELETE_SUPPLIER', `Deleted supplier: ${supp.companyName}`);
    return true;
  }

  public adjustSupplierBalance(id: string, deltaCreditMinusDebit: number): void {
    const suppliers = this.getSuppliers();
    const supp = suppliers.find((s) => s.id === id);
    if (supp) {
      supp.currentBalance = Math.round((supp.currentBalance + deltaCreditMinusDebit) * 100) / 100;
      this.setItem(STORAGE_KEYS.SUPPLIERS, suppliers);
    }
  }

  public getSupplierLedger(supplierId: string): LedgerEntry[] {
    const supplier = this.getSupplierById(supplierId);
    if (!supplier) return [];

    const entries: LedgerEntry[] = [];

    if (supplier.openingBalance !== 0) {
      entries.push({
        id: `open-${supplier.id}`,
        partyId: supplier.id,
        partyType: 'supplier',
        date: supplier.createdAt.split('T')[0],
        type: 'opening_balance',
        referenceNo: 'OPENING',
        description: 'Opening Balance (Payable)',
        debit: 0,
        credit: supplier.openingBalance,
        balance: supplier.openingBalance,
      });
    }

    const purchases = this.getPurchases().filter((p) => p.supplierId === supplierId && p.status === 'active');
    for (const purch of purchases) {
      entries.push({
        id: `pur-entry-${purch.id}`,
        partyId: supplier.id,
        partyType: 'supplier',
        date: purch.date,
        type: 'invoice',
        referenceNo: purch.supplierInvoiceNo || purch.purchaseNo,
        description: `Purchase Invoice (${purch.items.length} items)`,
        debit: 0,
        credit: purch.grandTotal,
        balance: 0,
      });

      if (purch.paidAmount > 0) {
        entries.push({
          id: `pay-entry-pur-${purch.id}`,
          partyId: supplier.id,
          partyType: 'supplier',
          date: purch.date,
          type: 'payment',
          referenceNo: `PM-${purch.purchaseNo}`,
          description: `Payment paid at purchase (${purch.paymentMode.toUpperCase()})`,
          debit: purch.paidAmount,
          credit: 0,
          balance: 0,
        });
      }
    }

    const payments = this.getPayments().filter((p) => p.partyId === supplierId && p.type === 'payment');
    for (const pay of payments) {
      if (!pay.invoiceId) {
        entries.push({
          id: `pay-supp-${pay.id}`,
          partyId: supplier.id,
          partyType: 'supplier',
          date: pay.date,
          type: 'payment',
          referenceNo: pay.voucherNo,
          description: `Payment to supplier (${pay.paymentMode.toUpperCase()}) ${pay.referenceNo ? `Ref: ${pay.referenceNo}` : ''}`,
          debit: pay.amount,
          credit: 0,
          balance: 0,
        });
      }
    }

    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let running = 0;
    for (const entry of entries) {
      // For supplier, credit increases our debt to them, debit reduces it
      running += entry.credit - entry.debit;
      entry.balance = Math.round(running * 100) / 100;
    }

    return entries;
  }

  // Invoices (Sales)
  public getInvoices(): SalesInvoice[] {
    return this.getItem<SalesInvoice[]>(STORAGE_KEYS.INVOICES, []);
  }

  public getInvoiceById(id: string): SalesInvoice | undefined {
    return this.getInvoices().find((i) => i.id === id);
  }

  public generateNextInvoiceNumber(): string {
    const profile = this.getBusinessProfile();
    const prefix = profile.invoicePrefix || 'INV';
    const invoices = this.getInvoices();

    // Check for "INV 3525" or "PREFIX NNNN" format
    let maxNumber = 0;
    const spacePattern = new RegExp(`^${prefix}\\s+(\\d+)`, 'i');

    for (const inv of invoices) {
      const match = inv.invoiceNo.match(spacePattern);
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed) && parsed > maxNumber) {
          maxNumber = parsed;
        }
      }
    }

    if (maxNumber > 0) {
      return `${prefix} ${maxNumber + 1}`;
    }

    // Look for matching format: PREFIX/FY/NNNN
    const fy = profile.financialYear || getCurrentFinancialYear();
    const searchPattern = `${prefix}/${fy}/`;

    for (const inv of invoices) {
      if (inv.invoiceNo.startsWith(searchPattern)) {
        const numPart = inv.invoiceNo.substring(searchPattern.length);
        const parsed = parseInt(numPart, 10);
        if (!isNaN(parsed) && parsed > maxNumber) {
          maxNumber = parsed;
        }
      }
    }

    if (maxNumber > 0) {
      const padded = String(maxNumber + 1).padStart(4, '0');
      return `${prefix}/${fy}/${padded}`;
    }

    return `${prefix} 3526`;
  }

  public createInvoice(invoiceData: Omit<SalesInvoice, 'id' | 'createdAt' | 'status' | 'createdBy'> & { createdBy?: string }): SalesInvoice {
    const user = this.getCurrentUser();
    const now = new Date().toISOString();
    const newInvoice: SalesInvoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      status: 'active',
      createdBy: invoiceData.createdBy || (user ? user.name : 'System'),
      createdAt: now,
    };

    // 1. Deduct Stock for all items
    for (const item of newInvoice.items) {
      this.adjustProductStock(item.productId, -item.quantity, item.batchNo);
    }

    // 2. Adjust Customer balance if there is balance due
    if (newInvoice.customerId !== 'walk-in' && newInvoice.balanceDue > 0) {
      this.adjustCustomerBalance(newInvoice.customerId, newInvoice.balanceDue);
    }

    // 3. Save invoice
    const invoices = this.getInvoices();
    invoices.unshift(newInvoice);
    this.setItem(STORAGE_KEYS.INVOICES, invoices);

    // 4. Log activity
    this.logActivity(
      'CREATE_INVOICE',
      `Created Invoice ${newInvoice.invoiceNo} for ${newInvoice.customerName} (₹${newInvoice.grandTotal.toLocaleString('en-IN')})`
    );

    return newInvoice;
  }

  public cancelInvoice(id: string, reason = 'Invoice cancelled by user'): boolean {
    const invoices = this.getInvoices();
    const invoice = invoices.find((i) => i.id === id);
    if (!invoice || invoice.status === 'cancelled') return false;

    // 1. Restore stock
    for (const item of invoice.items) {
      this.adjustProductStock(item.productId, item.quantity, item.batchNo);
    }

    // 2. Restore customer balance if credit was extended
    if (invoice.customerId !== 'walk-in' && invoice.balanceDue > 0) {
      this.adjustCustomerBalance(invoice.customerId, -invoice.balanceDue);
    }

    // 3. Mark as cancelled
    invoice.status = 'cancelled';
    this.setItem(STORAGE_KEYS.INVOICES, invoices);

    // 4. Log activity
    this.logActivity('CANCEL_INVOICE', `Cancelled Invoice ${invoice.invoiceNo}. Reason: ${reason}`);
    return true;
  }

  // Purchases
  public getPurchases(): PurchaseInvoice[] {
    return this.getItem<PurchaseInvoice[]>(STORAGE_KEYS.PURCHASES, []);
  }

  public generateNextPurchaseNumber(): string {
    const fy = getCurrentFinancialYear();
    const purchases = this.getPurchases();
    const prefix = `PUR/${fy}/`;
    let max = 0;
    for (const p of purchases) {
      if (p.purchaseNo.startsWith(prefix)) {
        const num = parseInt(p.purchaseNo.substring(prefix.length), 10);
        if (!isNaN(num) && num > max) max = num;
      }
    }
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
  }

  public createPurchase(purchaseData: Omit<PurchaseInvoice, 'id' | 'createdAt' | 'status' | 'createdBy'> & { createdBy?: string }): PurchaseInvoice {
    const user = this.getCurrentUser();
    const now = new Date().toISOString();
    const newPurchase: PurchaseInvoice = {
      ...purchaseData,
      id: `purch-${Date.now()}`,
      status: 'active',
      createdBy: purchaseData.createdBy || (user ? user.name : 'System'),
      createdAt: now,
    };

    // 1. Add Stock for all items
    for (const item of newPurchase.items) {
      this.adjustProductStock(item.productId, item.quantity, item.batchNo);
    }

    // 2. Increase Supplier balance if unpaid/partial
    if (newPurchase.balanceDue > 0) {
      this.adjustSupplierBalance(newPurchase.supplierId, newPurchase.balanceDue);
    }

    // 3. Save purchase
    const purchases = this.getPurchases();
    purchases.unshift(newPurchase);
    this.setItem(STORAGE_KEYS.PURCHASES, purchases);

    this.logActivity(
      'CREATE_PURCHASE',
      `Recorded Purchase ${newPurchase.purchaseNo} from ${newPurchase.supplierName} (₹${newPurchase.grandTotal.toLocaleString('en-IN')})`
    );

    return newPurchase;
  }

  // Sales Returns
  public getSalesReturns(): SalesReturn[] {
    return this.getItem<SalesReturn[]>(STORAGE_KEYS.SALES_RETURNS, []);
  }

  public generateNextReturnNumber(prefix = 'CRN'): string {
    const fy = getCurrentFinancialYear();
    const returns = this.getSalesReturns();
    const pattern = `${prefix}/${fy}/`;
    let max = 0;
    for (const r of returns) {
      if (r.returnNo.startsWith(pattern)) {
        const num = parseInt(r.returnNo.substring(pattern.length), 10);
        if (!isNaN(num) && num > max) max = num;
      }
    }
    return `${pattern}${String(max + 1).padStart(4, '0')}`;
  }

  public createSalesReturn(returnData: Omit<SalesReturn, 'id' | 'createdAt' | 'createdBy'> & { createdBy?: string }): SalesReturn {
    const user = this.getCurrentUser();
    const now = new Date().toISOString();
    const newReturn: SalesReturn = {
      ...returnData,
      id: `sret-${Date.now()}`,
      createdBy: returnData.createdBy || (user ? user.name : 'System'),
      createdAt: now,
    };

    // 1. Add stock back
    for (const item of newReturn.items) {
      this.adjustProductStock(item.productId, item.quantity, item.batchNo);
    }

    // 2. If adjusted in ledger, reduce customer balance
    if (newReturn.refundStatus === 'adjusted_in_ledger' && newReturn.customerId !== 'walk-in') {
      this.adjustCustomerBalance(newReturn.customerId, -newReturn.totalAmount);
    }

    const returns = this.getSalesReturns();
    returns.unshift(newReturn);
    this.setItem(STORAGE_KEYS.SALES_RETURNS, returns);

    this.logActivity('SALES_RETURN', `Created Sales Return ${newReturn.returnNo} for ${newReturn.customerName} (₹${newReturn.totalAmount})`);
    return newReturn;
  }

  // Purchase Returns
  public getPurchaseReturns(): PurchaseReturn[] {
    return this.getItem<PurchaseReturn[]>(STORAGE_KEYS.PURCHASE_RETURNS, []);
  }

  public createPurchaseReturn(returnData: Omit<PurchaseReturn, 'id' | 'createdAt' | 'createdBy'> & { createdBy?: string }): PurchaseReturn {
    const user = this.getCurrentUser();
    const now = new Date().toISOString();
    const newReturn: PurchaseReturn = {
      ...returnData,
      id: `pret-${Date.now()}`,
      createdBy: returnData.createdBy || (user ? user.name : 'System'),
      createdAt: now,
    };

    // 1. Deduct stock
    for (const item of newReturn.items) {
      this.adjustProductStock(item.productId, -item.quantity, item.batchNo);
    }

    // 2. Adjust supplier balance
    this.adjustSupplierBalance(newReturn.supplierId, -newReturn.totalAmount);

    const returns = this.getPurchaseReturns();
    returns.unshift(newReturn);
    this.setItem(STORAGE_KEYS.PURCHASE_RETURNS, returns);

    this.logActivity('PURCHASE_RETURN', `Created Debit Note ${newReturn.returnNo} for ${newReturn.supplierName} (₹${newReturn.totalAmount})`);
    return newReturn;
  }

  // Payments
  public getPayments(): PaymentRecord[] {
    return this.getItem<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS, []);
  }

  public generateNextVoucherNumber(type: 'receipt' | 'payment'): string {
    const fy = getCurrentFinancialYear();
    const prefix = type === 'receipt' ? `REC/${fy}/` : `PAY/${fy}/`;
    const payments = this.getPayments().filter((p) => p.type === type);
    let max = 0;
    for (const p of payments) {
      if (p.voucherNo.startsWith(prefix)) {
        const num = parseInt(p.voucherNo.substring(prefix.length), 10);
        if (!isNaN(num) && num > max) max = num;
      }
    }
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
  }

  public recordPayment(paymentData: Omit<PaymentRecord, 'id' | 'createdAt' | 'createdBy'> & { createdBy?: string }): PaymentRecord {
    const user = this.getCurrentUser();
    const now = new Date().toISOString();
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      createdBy: paymentData.createdBy || (user ? user.name : 'System'),
      createdAt: now,
    };

    // Adjust party balance
    if (newPayment.type === 'receipt') {
      // Customer payment received -> reduces customer receivable balance
      this.adjustCustomerBalance(newPayment.partyId, -newPayment.amount);

      // If linked to specific invoice, update invoice balance
      if (newPayment.invoiceId) {
        const invoices = this.getInvoices();
        const invoice = invoices.find((i) => i.id === newPayment.invoiceId);
        if (invoice) {
          invoice.paidAmount += newPayment.amount;
          invoice.balanceDue = Math.max(0, invoice.grandTotal - invoice.paidAmount);
          invoice.paymentStatus = invoice.balanceDue === 0 ? 'paid' : 'partial';
          this.setItem(STORAGE_KEYS.INVOICES, invoices);
        }
      }
    } else {
      // Payment made to supplier -> reduces supplier payable balance
      this.adjustSupplierBalance(newPayment.partyId, -newPayment.amount);

      if (newPayment.invoiceId) {
        const purchases = this.getPurchases();
        const purchase = purchases.find((p) => p.id === newPayment.invoiceId);
        if (purchase) {
          purchase.paidAmount += newPayment.amount;
          purchase.balanceDue = Math.max(0, purchase.grandTotal - purchase.paidAmount);
          purchase.paymentStatus = purchase.balanceDue === 0 ? 'paid' : 'partial';
          this.setItem(STORAGE_KEYS.PURCHASES, purchases);
        }
      }
    }

    const payments = this.getPayments();
    payments.unshift(newPayment);
    this.setItem(STORAGE_KEYS.PAYMENTS, payments);

    this.logActivity(
      newPayment.type === 'receipt' ? 'RECEIVE_PAYMENT' : 'PAY_SUPPLIER',
      `Recorded ${newPayment.type} ${newPayment.voucherNo} of ₹${newPayment.amount} for ${newPayment.partyName}`
    );

    return newPayment;
  }

  // Backup & Restore
  public exportDatabaseJson(): string {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      businessProfile: this.getBusinessProfile(),
      products: this.getProducts(),
      customers: this.getCustomers(),
      suppliers: this.getSuppliers(),
      invoices: this.getInvoices(),
      purchases: this.getPurchases(),
      salesReturns: this.getSalesReturns(),
      purchaseReturns: this.getPurchaseReturns(),
      payments: this.getPayments(),
      activityLogs: this.getActivityLogs(),
    };
    return JSON.stringify(exportData, null, 2);
  }

  public importDatabaseJson(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data.businessProfile && !data.products) {
        return { success: false, message: 'Invalid backup file format.' };
      }

      if (data.businessProfile) this.setItem(STORAGE_KEYS.PROFILE, data.businessProfile);
      if (data.products) this.setItem(STORAGE_KEYS.PRODUCTS, data.products);
      if (data.customers) this.setItem(STORAGE_KEYS.CUSTOMERS, data.customers);
      if (data.suppliers) this.setItem(STORAGE_KEYS.SUPPLIERS, data.suppliers);
      if (data.invoices) this.setItem(STORAGE_KEYS.INVOICES, data.invoices);
      if (data.purchases) this.setItem(STORAGE_KEYS.PURCHASES, data.purchases);
      if (data.salesReturns) this.setItem(STORAGE_KEYS.SALES_RETURNS, data.salesReturns);
      if (data.purchaseReturns) this.setItem(STORAGE_KEYS.PURCHASE_RETURNS, data.purchaseReturns);
      if (data.payments) this.setItem(STORAGE_KEYS.PAYMENTS, data.payments);
      if (data.activityLogs) this.setItem(STORAGE_KEYS.ACTIVITY_LOGS, data.activityLogs);

      this.logActivity('RESTORE_BACKUP', 'Successfully restored database from JSON backup file');
      return { success: true, message: 'Backup restored successfully!' };
    } catch (e) {
      return { success: false, message: 'Failed to parse JSON file. Please check file validity.' };
    }
  }

  public resetToDemoData(): void {
    localStorage.clear();
    this.isInitialized = false;
    this.init();
    this.logActivity('RESET_DEMO', 'Database reset to initial demo seeds');
  }
}

export const db = new DatabaseService();
