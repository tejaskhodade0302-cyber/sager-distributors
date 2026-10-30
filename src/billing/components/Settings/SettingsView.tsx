import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../services/db';
import { BusinessProfile } from '../../types';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Settings,
  Save,
  Download,
  Upload,
  RefreshCw,
  Building,
  CreditCard,
  Printer,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface SettingsViewProps {
  onProfileUpdated?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onProfileUpdated }) => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<BusinessProfile>(db.getBusinessProfile());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(db.getBusinessProfile());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateBusinessProfile(profile);
    showToast('Settings Saved', 'Business profile and invoice preferences updated.', 'success');
    if (onProfileUpdated) onProfileUpdated();
  };

  // Download Backup JSON
  const handleDownloadBackup = () => {
    const jsonStr = db.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sagar_Distributor_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Backup Exported', 'Full application data exported as JSON.', 'success');
  };

  // Restore Backup
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = db.importDatabaseJson(content);
      if (res.success) {
        showToast('Restore Successful', res.message, 'success');
        setProfile(db.getBusinessProfile());
        if (onProfileUpdated) onProfileUpdated();
      } else {
        showToast('Restore Failed', res.message, 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Reset to Demo Data
  const handleConfirmReset = () => {
    db.resetToDemoData();
    setProfile(db.getBusinessProfile());
    showToast('Database Reset', 'Initialized with demo wholesale catalog & records.', 'info');
    setShowResetConfirm(false);
    if (onProfileUpdated) onProfileUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Business Settings & Data Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure firm details, GSTIN, bank accounts, invoice formatting, and JSON backup/restore.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Firm & Registration Details */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Firm & GST Registration Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Business Name *</label>
              <input
                type="text"
                required
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-semibold block mb-1 text-slate-700">Business Tagline / Subtitle</label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold block mb-1 text-slate-700">Registered Godown Address *</label>
              <input
                type="text"
                required
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">City</label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">State & State Code</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Code"
                  value={profile.stateCode}
                  onChange={(e) => setProfile({ ...profile, stateCode: e.target.value })}
                  className="w-full font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-center text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Pincode</label>
              <input
                type="text"
                value={profile.pincode}
                onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                className="w-full font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Billing Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Firm GSTIN *</label>
              <input
                type="text"
                required
                value={profile.gstin}
                onChange={(e) => setProfile({ ...profile, gstin: e.target.value.toUpperCase() })}
                className="w-full uppercase font-mono font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Income Tax PAN</label>
              <input
                type="text"
                value={profile.pan}
                onChange={(e) => setProfile({ ...profile, pan: e.target.value.toUpperCase() })}
                className="w-full uppercase font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Bank & UPI Payment Settings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Bank Details & UPI Payment QR
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Bank Name</label>
              <input
                type="text"
                value={profile.bankName}
                onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Current Account Number</label>
              <input
                type="text"
                value={profile.accountNo}
                onChange={(e) => setProfile({ ...profile, accountNo: e.target.value })}
                className="w-full font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700">RTGS / NEFT IFSC Code</label>
              <input
                type="text"
                value={profile.ifscCode}
                onChange={(e) => setProfile({ ...profile, ifscCode: e.target.value.toUpperCase() })}
                className="w-full uppercase font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Bank Branch</label>
              <input
                type="text"
                value={profile.branch}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-semibold block mb-1 text-slate-700">UPI ID (For Instant QR Code Payment)</label>
              <input
                type="text"
                value={profile.upiId}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                className="w-full font-mono font-bold text-blue-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Invoice Prefix & Print Formatting */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Printer className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Invoice Prefix, Numbering & Terms
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-slate-700">Invoice Prefix</label>
              <input
                type="text"
                value={profile.invoicePrefix}
                onChange={(e) => setProfile({ ...profile, invoicePrefix: e.target.value })}
                className="w-full font-mono font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Format: {profile.invoicePrefix}/{profile.financialYear}/0001
              </span>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Financial Year (FY)</label>
              <input
                type="text"
                value={profile.financialYear}
                onChange={(e) => setProfile({ ...profile, financialYear: e.target.value })}
                className="w-full font-mono bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-700">Default Print Layout</label>
              <select
                value={profile.defaultPrintFormat}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    defaultPrintFormat: e.target.value as 'A4' | 'THERMAL_80MM',
                  })
                }
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="A4">A4 Full Tax Invoice (Standard)</option>
                <option value="THERMAL_80MM">80mm Thermal Receipt (POS Roll)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="font-semibold block mb-1 text-slate-700">Terms & Conditions / Footer Text</label>
              <textarea
                rows={3}
                value={profile.termsAndConditions}
                onChange={(e) => setProfile({ ...profile, termsAndConditions: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs leading-relaxed text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Configuration
            </button>
          </div>
        </div>
      </form>

      {/* Section 4: Data Backup, Restore & Reset */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase mb-2 tracking-wider">
          Database Backup & Restore
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          All records are stored securely in browser storage. Download a full JSON backup to safeguard your data or transfer it to another computer.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Complete JSON Backup
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleRestoreFile}
            accept=".json"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            Restore From JSON File
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-semibold text-xs rounded-xl ml-auto transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Demo Seeds
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset to Initial Demo Data?"
        message="This will overwrite all current changes and reload the 10 demo products, 5 retailers, 3 suppliers, and 5 sample invoices. Are you sure you wish to continue?"
        confirmLabel="Yes, Reset Database"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
