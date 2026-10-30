import React, { useState, useRef } from 'react';
import { SdLogo } from './SdLogo';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  MapPin,
  Phone,
  Sparkles
} from 'lucide-react';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCompany?: string;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  initialCompany = '',
}) => {
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [companyTarget, setCompanyTarget] = useState(initialCompany);
  const [rawTextList, setRawTextList] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (initialCompany) {
      setCompanyTarget(initialCompany);
    }
  }, [initialCompany, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmitWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    
    let msg = `*DIRECT PURCHASE ORDER / SHORTAGE LIST*\n`;
    msg += `*To:* Sagar Distributor, Chalisgaon Main Hub (Jalgaon Dist.)\n`;
    msg += `------------------------------------\n`;
    if (companyTarget) {
      msg += `*Target Pharma Company:* ${companyTarget}\n`;
    }
    msg += `*Store Name:* ${storeName || 'Registered Medical Store'}\n`;
    msg += `*Phone:* ${phone || 'Not Provided'}\n`;
    msg += `*Taluka / City:* ${city || 'Jalgaon District'}\n`;
    if (dlNumber) msg += `*Drug Lic (20B/21B):* ${dlNumber}\n`;
    msg += `------------------------------------\n`;
    
    if (selectedFile) {
      msg += `*Attachment Attached:* ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)\n`;
    }
    
    if (rawTextList.trim()) {
      msg += `*SHORTAGE / MEDICINE REQUIREMENTS:*\n`;
      msg += `${rawTextList.trim()}\n`;
    }
    
    msg += `------------------------------------\n`;
    msg += `Please review and send wholesale quotation / dispatch confirmation.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/917709737577?text=${encoded}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 relative">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <SdLogo size="sm" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Upload Purchase Order / Shortage List
              </h3>
              <p className="text-xs text-slate-500">
                Send your handwritten pharmacy notebook photo, Excel PO, or type shortage items directly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Purchase Order Forwarded Successfully!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your order is forwarded to our Chalisgaon wholesale dispatch desk via WhatsApp (+91 77097 37577). Our billing officer will send your proforma invoice and dispatch slot shortly.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitWhatsApp} className="py-4 space-y-4 text-xs">
            
            {/* Target Pharma Company (if any) */}
            {companyTarget && (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  <span className="text-teal-900 font-bold">Target Company: {companyTarget}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCompanyTarget('')}
                  className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold underline cursor-pointer"
                >
                  Clear / All Companies
                </button>
              </div>
            )}

            {/* Store & Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Medical Store / Hospital Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mahavir Medical Stores"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  WhatsApp Contact Mobile *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98220 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  City / Town & District *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chalisgaon / Pachora / Malegaon"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Drug License No. (20B/21B)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 20MH/JAL/465294"
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Upload PO Document (Excel, PDF, or Photo of Shortage Register)
              </label>
              
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/40 rounded-xl p-5 text-center cursor-pointer transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
                  className="hidden"
                />
                
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-teal-600 shrink-0" />
                    <div className="text-left">
                      <span className="font-bold text-slate-800 block">{selectedFile.name}</span>
                      <span className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-slate-500">
                    <UploadCloud className="w-8 h-8 mx-auto text-teal-600 mb-1" />
                    <span className="font-semibold text-slate-700 block">
                      Click to choose file or drag & drop here
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Supports Excel (.xlsx), PDF, or Camera Photos (JPG, PNG)
                    </span>
                  </div>
                )}
              </div>

              {previewUrl && (
                <div className="mt-2 p-2 bg-slate-100 rounded-lg flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                  <span className="text-[11px] text-slate-600 font-medium">Image preview attached</span>
                </div>
              )}
            </div>

            {/* Quick Text Medicine Entry Box */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Or Type / Paste Medicine Names & Quantities:
              </label>
              <textarea
                rows={3}
                value={rawTextList}
                onChange={(e) => setRawTextList(e.target.value)}
                placeholder="Example:&#10;1. Augmentin 625 Duo - 10 boxes&#10;2. Pan-D Capsules - 15 boxes&#10;3. Paracetamol 650 Generic - 50 boxes&#10;4. Clexane 40mg - 5 boxes"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Dispatch PO to WhatsApp
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
