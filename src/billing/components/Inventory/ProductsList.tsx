import React, { useState, useEffect, useRef } from 'react';
import { Product, BatchLot } from '../../types';
import { db } from '../../services/db';
import { formatIndianCurrency, formatIndianNumber } from '../../utils/indianFormatters';
import { useToast } from '../../context/ToastContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  AlertTriangle,
  Clock,
  Layers,
  X,
  Check,
} from 'lucide-react';

export const ProductsList: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    hsn: '',
    category: 'General FMCG',
    brand: '',
    mfr: 'GEN',
    pack: "10'S",
    dc: '',
    unit: 'pcs' as Product['unit'],
    packSize: '',
    purchasePrice: 0,
    sellingPrice: 0,
    mrp: 0,
    gstRate: 18,
    openingStock: 0,
    currentStock: 0,
    minStockLevel: 10,
    batchNo: '',
    expiryDate: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = () => {
    setProducts(db.getProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) ||
      p.hsn.includes(search) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    let matchesStock = true;
    if (stockStatusFilter === 'LOW') {
      matchesStock = p.currentStock <= p.minStockLevel && p.currentStock > 0;
    } else if (stockStatusFilter === 'OUT') {
      matchesStock = p.currentStock <= 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      barcode: '',
      hsn: '30042',
      category: 'Pharmaceuticals',
      brand: '',
      mfr: 'GEN',
      pack: "10'S",
      dc: '',
      unit: 'box',
      packSize: "10'S",
      purchasePrice: 0,
      sellingPrice: 0,
      mrp: 0,
      gstRate: 5,
      openingStock: 50,
      currentStock: 50,
      minStockLevel: 15,
      batchNo: '',
      expiryDate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      barcode: p.barcode,
      hsn: p.hsn,
      category: p.category,
      brand: p.brand,
      mfr: p.mfr || 'GEN',
      pack: p.pack || p.packSize || "10'S",
      dc: p.dc || '',
      unit: p.unit,
      packSize: p.packSize,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      mrp: p.mrp || 0,
      gstRate: p.gstRate,
      openingStock: p.openingStock,
      currentStock: p.currentStock,
      minStockLevel: p.minStockLevel,
      batchNo: p.batches?.[0]?.batchNo || '',
      expiryDate: p.batches?.[0]?.expiryDate || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim() || !formData.hsn.trim()) {
      showToast('Validation Error', 'Product Name, SKU and HSN Code are required.', 'error');
      return;
    }

    const batches: BatchLot[] = [];
    if (formData.batchNo.trim()) {
      batches.push({
        id: `batch-${Date.now()}`,
        batchNo: formData.batchNo.trim(),
        expiryDate: formData.expiryDate || '',
        quantity: Number(formData.currentStock) || 0,
        purchasePrice: Number(formData.purchasePrice) || 0,
        sellingPrice: Number(formData.sellingPrice) || 0,
        mrp: Number(formData.mrp) || 0,
      });
    }

    if (editingProduct) {
      db.saveProduct({
        id: editingProduct.id,
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim(),
        hsn: formData.hsn.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        mfr: formData.mfr.trim().toUpperCase() || 'GEN',
        pack: formData.pack.trim() || "10'S",
        dc: formData.dc.trim() || undefined,
        unit: formData.unit,
        packSize: formData.packSize.trim(),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        mrp: Number(formData.mrp),
        gstRate: Number(formData.gstRate),
        openingStock: Number(formData.openingStock),
        currentStock: Number(formData.currentStock),
        minStockLevel: Number(formData.minStockLevel),
        batches: batches.length > 0 ? batches : editingProduct.batches,
      });
      showToast('Product Updated', `${formData.name} updated successfully.`, 'success');
    } else {
      db.saveProduct({
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        barcode: formData.barcode.trim(),
        hsn: formData.hsn.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        mfr: formData.mfr.trim().toUpperCase() || 'GEN',
        pack: formData.pack.trim() || "10'S",
        dc: formData.dc.trim() || undefined,
        unit: formData.unit,
        packSize: formData.packSize.trim(),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        mrp: Number(formData.mrp),
        gstRate: Number(formData.gstRate),
        openingStock: Number(formData.openingStock),
        currentStock: Number(formData.openingStock),
        minStockLevel: Number(formData.minStockLevel),
        batches,
      });
      showToast('Product Added', `${formData.name} added to inventory.`, 'success');
    }

    setIsModalOpen(false);
    loadProducts();
  };

  const confirmDelete = () => {
    if (!deleteProductId) return;
    const success = db.deleteProduct(deleteProductId);
    if (success) {
      showToast('Product Deleted', 'Item removed from catalogue.', 'info');
      loadProducts();
    }
    setDeleteProductId(null);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'SKU',
      'Barcode',
      'HSN',
      'Category',
      'Brand',
      'Unit',
      'Pack Size',
      'Purchase Price',
      'Selling Price',
      'MRP',
      'GST %',
      'Current Stock',
      'Min Stock Level',
    ];

    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.barcode,
      p.hsn,
      `"${p.category}"`,
      `"${p.brand}"`,
      p.unit,
      `"${p.packSize}"`,
      p.purchasePrice,
      p.sellingPrice,
      p.mrp,
      p.gstRate,
      p.currentStock,
      p.minStockLevel,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sagar_Products_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export Complete', 'Inventory exported as CSV.', 'success');
  };

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          showToast('Import Error', 'CSV file appears empty or invalid.', 'error');
          return;
        }

        let importedCount = 0;
        // Skip header
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (cols.length >= 7 && cols[1]) {
            db.saveProduct({
              name: cols[1],
              sku: cols[2] || `SKU-${Date.now()}-${i}`,
              barcode: cols[3] || '',
              hsn: cols[4] || '190531',
              category: cols[5] || 'General',
              brand: cols[6] || '',
              unit: (cols[7] as Product['unit']) || 'pcs',
              packSize: cols[8] || '1 Unit',
              purchasePrice: Number(cols[9]) || 100,
              sellingPrice: Number(cols[10]) || 120,
              mrp: Number(cols[11]) || 130,
              gstRate: Number(cols[12]) || 18,
              openingStock: Number(cols[13]) || 50,
              currentStock: Number(cols[13]) || 50,
              minStockLevel: Number(cols[14]) || 10,
            });
            importedCount++;
          }
        }
        showToast('Import Finished', `Imported ${importedCount} products successfully.`, 'success');
        loadProducts();
      } catch (err) {
        showToast('Import Error', 'Failed to parse CSV.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Inventory & Products
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage wholesale catalog, GST tax slabs, barcodes, batches, and live stock levels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, SKU, HSN, barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-slate-900 focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Stock status filter buttons */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs">
            <button
              onClick={() => setStockStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                stockStatusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setStockStatusFilter('LOW')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                stockStatusFilter === 'LOW'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockStatusFilter('OUT')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                stockStatusFilter === 'OUT'
                  ? 'bg-white text-rose-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">SKU / HSN</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Cost Price</th>
                <th className="py-2.5 px-3 text-right">Sale Price</th>
                <th className="py-2.5 px-3 text-right">MRP</th>
                <th className="py-2.5 px-3 text-center">GST %</th>
                <th className="py-2.5 px-3 text-center">Live Stock</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No products match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.currentStock <= p.minStockLevel && p.currentStock > 0;
                  const isOut = p.currentStock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">
                          {p.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {p.brand ? `${p.brand} · ` : ''}{p.packSize}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <div className="text-slate-900 font-medium">{p.sku}</div>
                        <div className="text-[10px] text-slate-400">HSN: {p.hsn}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {p.category}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {formatIndianCurrency(p.purchasePrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        {formatIndianCurrency(p.sellingPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                        {formatIndianCurrency(p.mrp)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                          {p.gstRate}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-mono font-bold text-xs ${
                            isOut
                              ? 'text-rose-600'
                              : isLow
                              ? 'text-amber-600'
                              : 'text-emerald-600'
                          }`}
                        >
                          {p.currentStock} {p.unit}
                        </span>
                        {isLow && (
                          <div className="text-[9px] text-amber-500 font-medium">Low Stock</div>
                        )}
                        {isOut && (
                          <div className="text-[9px] text-rose-500 font-medium">Out of Stock</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 text-slate-500 hover:text-blue-600 rounded cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteProductId(p.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl p-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Inventory'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fortune Sunlite Refined Sunflower Oil 1L Pouch"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Barcode / EAN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8906007281012"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    HSN / SAC Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 151219"
                    value={formData.hsn}
                    onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                    className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pharmaceuticals, Beverages"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Manufacturer / Mfr Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HET, FDC, CIPLA"
                    value={formData.mfr}
                    onChange={(e) => setFormData({ ...formData, mfr: e.target.value })}
                    className="w-full uppercase font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Pack / Packaging (e.g. 10&apos;S)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10'S, 100ML, 15'S"
                    value={formData.pack}
                    onChange={(e) => setFormData({ ...formData, pack: e.target.value })}
                    className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Default D.C. (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DC-1"
                    value={formData.dc}
                    onChange={(e) => setFormData({ ...formData, dc: e.target.value })}
                    className="w-full font-mono uppercase bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hetero, FDC, Fortune"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Unit of Measurement
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value as Product['unit'] })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="box">Box (box)</option>
                    <option value="carton">Carton (carton)</option>
                    <option value="litre">Litre (litre)</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="pack">Pack (pack)</option>
                    <option value="bag">Bag (bag)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Pack Size Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Pouches / Box"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    GST Tax Slab (%)
                  </label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: Number(e.target.value) })}
                    className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500"
                  >
                    <option value={0}>0% (Exempt)</option>
                    <option value={5}>5% GST (2.5% + 2.5%)</option>
                    <option value={12}>12% GST (6% + 6%)</option>
                    <option value={18}>18% GST (9% + 9%)</option>
                    <option value={28}>28% GST (14% + 14%)</option>
                  </select>
                </div>
              </div>

              {/* Pricing section */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">
                  Pricing & Commercial Terms
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Purchase Cost (₹)
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                      className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Wholesale Rate (₹) *
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      required
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                      className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      MRP (₹)
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      min={0}
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                      className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Stock and Batch section */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">
                  Stock & Optional Batch Lots
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.currentStock}
                      onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                      className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Min Alert Level
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={formData.minStockLevel}
                      onChange={(e) => setFormData({ ...formData, minStockLevel: Number(e.target.value) })}
                      className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Batch / Lot No
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BATCH-2026-A"
                      value={formData.batchNo}
                      onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                      className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full font-mono bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xs cursor-pointer transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteProductId)}
        title="Delete Product?"
        message="Are you sure you want to delete this product from the inventory catalogue? This will not alter past sales records, but will remove it from future billing."
        confirmLabel="Yes, Delete Product"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteProductId(null)}
      />
    </div>
  );
};
