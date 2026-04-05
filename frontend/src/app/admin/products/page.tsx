'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, ImagePlus, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const CATEGORIES = ['Dresses', 'Tops', 'Co-ords', 'Party Wear', 'Casual Wear'];
const ALL_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const BLANK = () => ({
  name: '', price: 0, category: 'Dresses',
  description: '', tag: '', isNew: false,
  brand: { name: 'Iris' }, images: [] as string[], sizes: [] as { size: string; countInStock: number }[],
});

export default function AdminProductsPage() {
  const [products, setProducts]         = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [showForm, setShowForm]         = useState(false);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [form, setForm]                 = useState(BLANK());
  const [saving, setSaving]             = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [dragOver, setDragOver]         = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch products from real API ─────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Backend returns paginated { products, page, pages } — fetch all with a large limit
      const { data } = await api.get('/products?pageNumber=1&limit=200');
      // Support both paginated response and plain array fallback
      setProducts(Array.isArray(data) ? data : (data.products ?? []));
    } catch (e) { console.error('Failed to load products', e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Image upload to Cloudinary via backend ───────────────────────────────
  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    for (let i = 0; i < arr.length; i++) {
      setUploadingIdx(i);
      try {
        const fd = new FormData();
        fd.append('image', arr[i]);
        const { data } = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setForm(prev => ({ ...prev, images: [...prev.images, data.url] }));
      } catch (e) { console.error('Upload failed', e); }
    }
    setUploadingIdx(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  // ── Form helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null); setForm(BLANK()); setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p._id);
    setForm({
      name: p.name, price: p.price, category: p.category,
      description: p.description, tag: p.tag || '', isNew: p.isNew || false,
      brand: p.brand || { name: 'Iris' },
      images: p.images || [], sizes: p.sizes || [],
    });
    setShowForm(true);
  };

  const toggleSize = (size: string) =>
    setForm(prev => {
      const exists = prev.sizes.find(s => s.size === size);
      if (exists) return { ...prev, sizes: prev.sizes.filter(s => s.size !== size) };
      return { ...prev, sizes: [...prev.sizes, { size, countInStock: 5 }] };
    });

  const updateStock = (size: string, n: number) =>
    setForm(prev => ({ ...prev, sizes: prev.sizes.map(s => s.size === size ? { ...s, countInStock: n } : s) }));

  const removeImage = (idx: number) =>
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  // ── Save (create or update) ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
      } else {
        await api.post('/products', form);
      }
      await fetchProducts();
      setShowForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch { alert('Delete failed'); }
    setDeleteConfirm(null);
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <button onClick={openAdd}
          className="bg-gray-900 text-white px-4 py-2.5 text-sm font-medium rounded hover:bg-gray-800 transition flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* ── Product Form Drawer ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative z-10 w-full max-w-xl h-screen bg-white overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="font-serif text-xl text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Product Name *</label>
                <input required type="text" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Price (₹) *</label>
                  <input required type="number" min="0" value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Description *</label>
                <textarea required rows={4} value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none" />
              </div>

              {/* Tag + New Arrival */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Tag (optional)</label>
                  <input type="text" placeholder="New / Bestseller" value={form.tag}
                    onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}
                    className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isNew}
                      onChange={e => setForm(p => ({ ...p, isNew: e.target.checked }))} />
                    <span className="text-sm text-gray-700">New Arrival</span>
                  </label>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">Sizes &amp; Stock</label>
                <div className="space-y-2">
                  {ALL_SIZES.map(size => {
                    const entry = form.sizes.find(s => s.size === size);
                    return (
                      <div key={size} className="flex items-center gap-3">
                        <input type="checkbox" id={`sz-${size}`} checked={!!entry} onChange={() => toggleSize(size)} />
                        <label htmlFor={`sz-${size}`} className="w-8 text-sm font-medium text-gray-700 cursor-pointer">{size}</label>
                        {entry && (
                          <input type="number" min="0" value={entry.countInStock}
                            onChange={e => updateStock(size, Number(e.target.value))}
                            className="w-20 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            placeholder="Stock" />
                        )}
                        {entry && <span className="text-xs text-gray-400">in stock</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Image Upload ── */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">
                  Images {form.images.length > 0 && <span className="text-gray-400 normal-case">({form.images.length} added)</span>}
                </label>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${dragOver ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}`}
                >
                  <input ref={fileInputRef} type="file" multiple accept="image/*"
                    className="hidden" onChange={handleFileSelect} />

                  {uploadingIdx !== null ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={28} className="text-gray-400 animate-spin" />
                      <p className="text-sm text-gray-500">Uploading image {uploadingIdx + 1}…</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImagePlus size={28} className="text-gray-400" />
                      <p className="text-sm font-medium text-gray-700">Click or drag photos here</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP — multiple allowed</p>
                    </div>
                  )}
                </div>

                {/* Uploaded image previews */}
                {form.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded overflow-hidden bg-gray-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center
                                     opacity-0 group-hover:opacity-100 transition text-white hover:bg-red-500"
                        >
                          <X size={10} />
                        </button>
                        {idx === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5">
                            COVER
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={saving || uploadingIdx !== null}
                className="w-full bg-gray-900 text-white py-3 text-sm font-medium rounded hover:bg-gray-800 transition disabled:bg-gray-300 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : editingId ? 'Save Changes' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Delete product?</h3>
            <p className="text-sm text-gray-600 mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 text-white py-2 rounded text-sm font-medium hover:bg-red-600 transition">Delete</button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search products…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <span className="text-sm text-gray-500">Showing {filtered.length}</span>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
              <Loader2 size={20} className="animate-spin" /> Loading products…
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Sizes', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                          {p.tag && <span className="text-xs text-gray-400">{p.tag}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{p.category}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{p.price?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.sizes?.slice(0, 4).map((s: any) => (
                          <span key={s.size} className={`text-xs px-1.5 py-0.5 rounded ${s.countInStock === 0 ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-700'}`}>{s.size}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition"><Edit size={15} /></button>
                      <button onClick={() => setDeleteConfirm(p._id)} className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No products found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
