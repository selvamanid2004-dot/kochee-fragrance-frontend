import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  FileSpreadsheet,
  Download,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Image as ImageIcon,
  Eye,
  Filter,
  Sparkles
} from 'lucide-react';
import { productService } from '../../services/productService';
import { downloadProductExcelTemplate, parseProductsExcel } from '../../utils/excelHelper';
import ImageDropzone from './ImageDropzone';

export default function AdminProductsView({
  products = [],
  categories = [],
  onRefresh,
  setActionMessage
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    category_id: '',
    price: '',
    compare_price: '',
    stock: 25,
    gender: 'Unisex',
    volume: '50ml',
    concentration: 'Extrait de Parfum (25% Oil)',
    inspired_by: '',
    description: '',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    longevity: '10-12 Hours',
    projection: 'Strong',
    is_featured: 1,
    is_best_seller: 0,
    image1: '',
    image2: '',
    image3: '',
    image4: ''
  });

  // Excel Bulk Upload State
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [excelErrors, setExcelErrors] = useState([]);
  const [uploadingExcel, setUploadingExcel] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.inspired_by && p.inspired_by.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory ? String(p.category_id) === String(selectedCategory) : true;
    return matchSearch && matchCat;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setForm({
      title: '',
      category_id: categories.length > 0 ? categories[0].id : '',
      price: '',
      compare_price: '',
      stock: 25,
      gender: 'Unisex',
      volume: '50ml',
      concentration: 'Extrait de Parfum (25% Oil)',
      inspired_by: '',
      description: '',
      top_notes: '',
      heart_notes: '',
      base_notes: '',
      longevity: '10-12 Hours',
      projection: 'Strong',
      is_featured: 1,
      is_best_seller: 0,
      image1: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
      image2: '',
      image3: '',
      image4: ''
    });
    setShowProductModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    let imgs = [];
    try {
      imgs = Array.isArray(product.images)
        ? product.images
        : typeof product.images === 'string'
        ? JSON.parse(product.images)
        : [];
    } catch {
      imgs = product.images ? [product.images] : [];
    }

    setForm({
      title: product.title || '',
      category_id: product.category_id || (categories.length > 0 ? categories[0].id : ''),
      price: product.price || '',
      compare_price: product.compare_price || '',
      stock: product.stock !== undefined ? product.stock : 25,
      gender: product.gender || 'Unisex',
      volume: product.volume || '50ml',
      concentration: product.concentration || 'Extrait de Parfum (25% Oil)',
      inspired_by: product.inspired_by || '',
      description: product.description || '',
      top_notes: product.top_notes || '',
      heart_notes: product.heart_notes || '',
      base_notes: product.base_notes || '',
      longevity: product.longevity || '10-12 Hours',
      projection: product.projection || 'Strong',
      is_featured: product.is_featured ? 1 : 0,
      is_best_seller: product.is_best_seller ? 1 : 0,
      image1: imgs[0] || '',
      image2: imgs[1] || '',
      image3: imgs[2] || '',
      image4: imgs[3] || ''
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const imagesArray = [form.image1, form.image2, form.image3, form.image4]
        .map((img) => String(img || '').trim())
        .filter((img) => img.length > 0);

      const payload = {
        title: form.title.trim(),
        category_id: parseInt(form.category_id, 10),
        price: parseFloat(form.price),
        compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
        stock: parseInt(form.stock, 10),
        gender: form.gender,
        volume: form.volume,
        concentration: form.concentration,
        inspired_by: form.inspired_by,
        description: form.description,
        top_notes: form.top_notes,
        heart_notes: form.heart_notes,
        base_notes: form.base_notes,
        longevity: form.longevity,
        projection: form.projection,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'],
        is_featured: parseInt(form.is_featured, 10),
        is_best_seller: parseInt(form.is_best_seller, 10)
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        setActionMessage('Fragrance SKU updated successfully.');
      } else {
        await productService.createProduct(payload);
        setActionMessage('New luxury fragrance SKU created successfully.');
      }

      setShowProductModal(false);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Error saving product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await productService.deleteProduct(id);
        setActionMessage(`Deleted product "${title}".`);
        onRefresh();
      } catch (err) {
        alert(err.message || 'Failed to delete product');
      }
    }
  };

  // Excel handlers
  const handleExcelFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setExcelFile(file);
    setExcelErrors([]);
    setParsedRows([]);

    try {
      const { validProducts, errors } = await parseProductsExcel(file, categories);
      setParsedRows(validProducts);
      setExcelErrors(errors);
    } catch (err) {
      setExcelErrors([`Failed to parse Excel file: ${err.message}`]);
    }
  };

  const handleExecuteBulkUpload = async () => {
    if (!parsedRows || parsedRows.length === 0) return;
    setUploadingExcel(true);
    try {
      const res = await productService.bulkUpload(parsedRows);
      setActionMessage(
        `Bulk Import Complete: ${res.createdCount} products created, ${res.updatedCount} updated!`
      );
      setShowExcelModal(false);
      setExcelFile(null);
      setParsedRows([]);
      setExcelErrors([]);
      onRefresh();
    } catch (err) {
      alert(err.message || 'Error uploading products');
    } finally {
      setUploadingExcel(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Action Bar: Search, Category Filter, Add Product, Excel buttons */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search & Filter */}
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or inspiration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#181d26] border border-[#232936] rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="relative w-full sm:w-60">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#181d26] border border-[#232936] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="">All Fragrance Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={downloadProductExcelTemplate}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#181d26] hover:bg-[#202632] border border-[#2a303e] rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition"
            title="Download formatted Excel spreadsheet template with examples"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel Template</span>
          </button>

          <button
            onClick={() => {
              setExcelFile(null);
              setParsedRows([]);
              setExcelErrors([]);
              setShowExcelModal(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#181d26] hover:bg-[#202632] border border-[#2a303e] rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Import Excel</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Fragrance</span>
          </button>
        </div>
      </div>

      {/* 2. Products Table */}
      <div className="bg-[#13171f] border border-[#1e2430] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#1e2430] flex items-center justify-between text-xs text-gray-400">
          <span>Showing <strong className="text-white font-mono">{filteredProducts.length}</strong> of <strong className="text-white font-mono">{products.length}</strong> fragrance SKUs</span>
          <span className="hidden sm:inline">Multi-image enabled (up to 4 images per product)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171c24] text-gray-400 uppercase font-mono tracking-wider text-[11px] border-b border-[#1e2430]">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6">Stock Status</th>
                <th className="py-3.5 px-6">Images</th>
                <th className="py-3.5 px-6">Badges</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2430] text-gray-300 font-sans">
              {filteredProducts.map((p) => {
                let pImages = [];
                try {
                  pImages = Array.isArray(p.images)
                    ? p.images
                    : typeof p.images === 'string'
                    ? JSON.parse(p.images)
                    : [];
                } catch {
                  pImages = p.images ? [p.images] : [];
                }
                const primaryImg = pImages[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800';

                const discountPercent =
                  p.compare_price && p.compare_price > p.price
                    ? Math.round(((p.compare_price - p.price) / p.compare_price) * 100)
                    : null;

                const isOutOfStock = Number(p.stock) === 0;
                const isLowStock = Number(p.stock) > 0 && Number(p.stock) <= 5;

                return (
                  <tr key={p.id} className="hover:bg-[#181d26] transition-colors">
                    {/* Product Name & Inspiration */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={primaryImg}
                          alt={p.title}
                          className="w-12 h-12 object-cover rounded-xl border border-[#232936] flex-shrink-0"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <div>
                          <div className="font-bold text-white text-xs leading-tight">
                            {p.title}
                          </div>
                          {p.inspired_by && (
                            <div className="text-[11px] text-amber-300/80 font-mono mt-0.5">
                              {p.inspired_by}
                            </div>
                          )}
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {p.volume} • {p.gender}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-[#1e2430] text-gray-300 font-medium text-[11px]">
                        {p.category_name || 'Unassigned'}
                      </span>
                    </td>

                    {/* Price & Discount */}
                    <td className="py-3.5 px-6 font-mono">
                      <div className="text-white font-bold text-xs">
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </div>
                      {p.compare_price && (
                        <div className="text-[10px] text-gray-400 line-through">
                          ₹{Number(p.compare_price).toLocaleString('en-IN')}
                        </div>
                      )}
                      {discountPercent && (
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {discountPercent}% OFF
                        </span>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-6">
                      {isOutOfStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                          Out of Stock (0)
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Low Stock ({p.stock})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          In Stock ({p.stock})
                        </span>
                      )}
                    </td>

                    {/* Multi-Images Preview */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1">
                        {pImages.slice(0, 4).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="w-6 h-6 rounded-md object-cover border border-[#2a303e]"
                          />
                        ))}
                        <span className="text-[10px] text-gray-400 font-mono ml-1">
                          {pImages.length}
                        </span>
                      </div>
                    </td>

                    {/* Badges */}
                    <td className="py-3.5 px-6">
                      <div className="flex flex-col gap-1">
                        {p.is_featured === 1 && (
                          <span className="text-[10px] font-bold text-amber-400">
                            ★ Featured
                          </span>
                        )}
                        {p.is_best_seller === 1 && (
                          <span className="text-[10px] font-bold text-purple-400">
                            🔥 Bestseller
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#202632] transition"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.title)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Add/Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12161e] border border-[#232936] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-[#232936] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif tracking-wide">
                  {editingProduct ? 'Edit Fragrance SKU' : 'Add New Luxury Fragrance'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Configure scent specs, pricing, and multi-angle imagery.
                </p>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c222c] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Fragrance Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. KOCHEE IMPERIAL ROSE OUD"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    required
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price, Compare Price, Stock, Gender */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="1899"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.compare_price}
                    onChange={(e) => setForm({ ...form, compare_price: e.target.value })}
                    placeholder="2499"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Inspired By & Concentration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Inspired By / Fragrance Tribute
                  </label>
                  <input
                    type="text"
                    value={form.inspired_by}
                    onChange={(e) => setForm({ ...form, inspired_by: e.target.value })}
                    placeholder="e.g. Inspired by Tom Ford Tobacco Vanille"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Concentration
                  </label>
                  <input
                    type="text"
                    value={form.concentration}
                    onChange={(e) => setForm({ ...form, concentration: e.target.value })}
                    placeholder="e.g. Extrait de Parfum (25% Oil)"
                    className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Row 4: Olfactory Notes Pyramid */}
              <div className="p-4 rounded-xl bg-[#171c24] border border-[#232936] space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Olfactory Pyramid
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Top Notes</label>
                    <input
                      type="text"
                      value={form.top_notes}
                      onChange={(e) => setForm({ ...form, top_notes: e.target.value })}
                      placeholder="e.g. Bergamot, Saffron"
                      className="w-full bg-[#12161e] border border-[#2a303e] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Heart Notes</label>
                    <input
                      type="text"
                      value={form.heart_notes}
                      onChange={(e) => setForm({ ...form, heart_notes: e.target.value })}
                      placeholder="e.g. Grasse Jasmine, Rose"
                      className="w-full bg-[#12161e] border border-[#2a303e] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Base Notes</label>
                    <input
                      type="text"
                      value={form.base_notes}
                      onChange={(e) => setForm({ ...form, base_notes: e.target.value })}
                      placeholder="e.g. Oud, Ambergris, Vanilla"
                      className="w-full bg-[#12161e] border border-[#2a303e] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Multi-Images (1 to 4) with Drag & Drop */}
              <div className="p-4 rounded-xl bg-[#171c24] border border-[#232936] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Product Gallery (3–4 Images)
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5 block">
                      Drag and drop images directly from your computer or click to browse.
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                    Direct Device Upload
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageDropzone
                    label="Image 1 (Main Bottle)"
                    hint="Drag & drop primary product angle"
                    aspectRatio="h-32"
                    required
                    value={form.image1}
                    onChange={(url) => setForm({ ...form, image1: url })}
                  />

                  <ImageDropzone
                    label="Image 2 (Lifestyle / Spray)"
                    hint="Drag & drop secondary lifestyle photo"
                    aspectRatio="h-32"
                    value={form.image2}
                    onChange={(url) => setForm({ ...form, image2: url })}
                  />

                  <ImageDropzone
                    label="Image 3 (Packaging / Presentation Box)"
                    hint="Drag & drop box packaging photo"
                    aspectRatio="h-32"
                    value={form.image3}
                    onChange={(url) => setForm({ ...form, image3: url })}
                  />

                  <ImageDropzone
                    label="Image 4 (Ingredients / Texture)"
                    hint="Drag & drop ingredients closeup"
                    aspectRatio="h-32"
                    value={form.image4}
                    onChange={(url) => setForm({ ...form, image4: url })}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Detailed Scent Narrative & Description
                </label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the mood, fragrance evolution, and luxurious sensory experience..."
                  className="w-full bg-[#181d26] border border-[#2a303e] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured === 1}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked ? 1 : 0 })}
                    className="rounded bg-[#181d26] border-gray-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-xs text-gray-300 font-semibold">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_best_seller === 1}
                    onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked ? 1 : 0 })}
                    className="rounded bg-[#181d26] border-gray-700 text-amber-500 focus:ring-0"
                  />
                  <span className="text-xs text-gray-300 font-semibold">Mark as Best Seller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232936]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#181d26] hover:bg-[#202632] text-xs font-semibold text-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
                >
                  {savingProduct ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Fragrance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Bulk Excel Upload Modal */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#12161e] border border-[#232936] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#232936] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif tracking-wide">
                    Bulk Product Upload (.xlsx)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Upload multiple perfume SKUs at once with automated schema validation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowExcelModal(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-[#1c222c] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Template Download Prompt */}
              <div className="p-4 rounded-xl bg-[#171c24] border border-[#232936] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white">Need the correct Excel format?</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Download the pre-populated template with column headers and sample data.
                  </p>
                </div>
                <button
                  onClick={downloadProductExcelTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202632] hover:bg-[#2a303e] text-xs font-bold text-emerald-400 rounded-lg transition flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              {/* File Dropzone */}
              <div className="border-2 border-dashed border-[#2a303e] hover:border-amber-400/60 rounded-2xl p-8 text-center bg-[#151922] transition group">
                <input
                  type="file"
                  id="excelFileInput"
                  accept=".xlsx, .xls"
                  onChange={handleExcelFileSelect}
                  className="hidden"
                />
                <label htmlFor="excelFileInput" className="cursor-pointer block space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {excelFile ? excelFile.name : 'Click to select Excel spreadsheet (.xlsx)'}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      Supports .xlsx workbooks up to 10MB
                    </span>
                  </div>
                </label>
              </div>

              {/* Errors Display */}
              {excelErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>Validation Errors Found in Spreadsheet ({excelErrors.length}):</span>
                  </div>
                  <ul className="text-[11px] text-red-200/80 list-disc list-inside space-y-1 max-h-36 overflow-y-auto font-mono">
                    {excelErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Valid Rows Preview */}
              {parsedRows.length > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{parsedRows.length} Valid Fragrances Ready to Import:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
                    {parsedRows.map((p, i) => (
                      <span key={i} className="text-[10px] bg-[#1a2230] text-gray-300 border border-gray-700 px-2 py-0.5 rounded font-mono">
                        {p.title} (₹{p.price})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232936]">
                <button
                  type="button"
                  onClick={() => setShowExcelModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#181d26] hover:bg-[#202632] text-xs font-semibold text-gray-300 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={uploadingExcel || parsedRows.length === 0}
                  onClick={handleExecuteBulkUpload}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 transition disabled:opacity-50"
                >
                  {uploadingExcel ? 'Importing...' : `Import ${parsedRows.length} Products`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

