export interface PharmaCompany {
  id: string;
  name: string;
  tagline?: string;
  category: 'Top Indian MNC' | 'Global Pharma' | 'Chronic & Cardiac' | 'Acute & Anti-Infective' | 'Generics & PCD' | 'Ayurvedic & Herbal' | 'Critical Care';
  logoKey: string;
  accentColor: string;
  bgTint: string;
  brandCount: string;
  divisions?: string[];
  flagshipBrands?: string[];
  keyTherapies: string[];
  description: string;
  establishedYear?: string;
  isPopular?: boolean;
}

export interface Product {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  manufacturer: string;
  companyId?: string;
  category: 'Prescription Rx' | 'Generic Medicines' | 'Critical Care' | 'Cold Chain' | 'Ayurvedic' | 'Surgical & OTC';
  dosageForm: 'Tablets' | 'Capsules' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops' | 'Surgical' | 'Herbal';
  packSize: string;
  mrp: number;
  wholesaleRate: number;
  gstRate: number; // e.g. 12% or 18% or 5%
  marginPercentage: number;
  inStock: boolean;
  minOrderQty: number;
  requiresColdChain?: boolean;
  requiresPrescriptionDrugLicense?: boolean;
  hsnCode: string;
  batchInfo: string;
  description: string;
  image?: string;
  isFastMoving?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface InquiryFormData {
  storeName: string;
  contactPerson: string;
  phone: string;
  email: string;
  drugLicenseNo: string;
  gstNo: string;
  city: string;
  district: string;
  pincode: string;
  businessType: 'Retail Chemist' | 'Hospital / Nursing Home' | 'Generic Pharmacy' | 'Wholesaler / Sub-distributor' | 'Clinic / Doctor';
  message: string;
  orderItems: CartItem[];
}

export interface JalgaonTalukaCoverage {
  taluka: string;
  isMainHub?: boolean;
  zone: 'Central Hub' | 'South Jalgaon' | 'West Jalgaon' | 'East Jalgaon' | 'North Jalgaon';
  transitTime: string;
  deliveryFrequency: string;
  keyVillagesAndTowns: string[];
  sameDayAvailable: boolean;
  activeChemistCount: string;
}

export interface MaharashtraDistrictCoverage {
  district: string;
  region: string;
  transitTime: string;
  deliveryFrequency: string;
  keyTowns: string[];
  sameDayAvailable: boolean;
}
