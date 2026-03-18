'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react';
import { PRODUCTS, Product, ProductSize } from '@/lib/products';

const CATEGORIES = ['Dresses', 'Tops', 'Co-ords', 'Party Wear', 'Casual Wear'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const BLANK_PRODUCT: Omit<Product, '_id'> = {
  name: '',
  price: 0,
  category: 'Dresses',
  description: '',
  brand: { name: 'Iris' },
  images: [],
  sizes: [],
  isNew: false,
  tag: '',
};

type EditableProduct = Product;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<EditableProduct[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditableProduct | null>(null);
  const [form, setForm] = useState<Omit<Product, '_id'>>({ ...BLANK_PRODUCT });
  const [imageInput, setImageInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load from localStorage override, fallback to static catalog
  useEffect(() => {
    const raw = localStorage.getItem('admin_products');
    if (raw) {
      try { setProducts(JSON.parse(raw)); return; } catch {}
    }
    setProducts([...PRODUCTS]);
  }, []);

  const saveAll = (list: EditableProduct[]) => {
    setProducts(list);
    localStorage.setItem('admin_products', JSON.stringify(list));
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ ...BLANK_PRODUCT });
    setImageInput('');
    setShowForm(true);
  };

  const openEdit = (p: EditableProduct) => {
    setEditingProduct(p);
    setForm({ ...p });
    setImageInput('');
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    saveAll(products.filter(p => p._id !== id));
    setDeleteConfirm(null);
  };

  const toggleSize = (size: string) => {
    setForm(prev => {
      const exists = prev.sizes.find(s => s.size === size);
      if (exists) return { ...prev, sizes: prev.sizes.filter(s => s.size !== size) };
      return { ...prev, sizes: [...prev.sizes, { size, countInStock: 5 }] };
    });
  };

  const updateSizeStock = (size: string, stock: number) => {
    setForm(prev => ({ ...prev, sizes: prev.sizes.map(s => s.size === size ? { ...s, countInStock: stock } : s) }));
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    setForm(prev => ({ ...prev, images: [...prev.images, imageInput.trim()] }));
    setImageInput('');
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (editingProduct) {
        saveAll(products.map(p => p._id === editingProduct._id ? { ...form, _id: editingProduct._id } : p));
      } else {
        const newProduct: EditableProduct = { ...form, _id: `custom-${Date.now()}` };
        saveAll([newProduct, ...products]);
      }
      setShowForm(false);
      setSaving(false);
    }, 400);
  };

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
              <h2 className="font-serif text-xl text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Product Name *</label>
                <input required type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Price (₹) *</label>
                  <input required type="number" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
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
                <textarea required rows={4} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none" />
              </div>

              {/* Tag */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Tag (optional)</label>
                  <input type="text" placeholder="New / Bestseller" value={form.tag || ''} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}
                    className="w-full border border-gray-200 rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                </div>
                <div className="flex items-end pb-1 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isNew || false} onChange={e => setForm(p => ({ ...p, isNew: e.target.checked }))} />
                    <span className="text-sm text-gray-700">New Arrival</span>
                  </label>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-3">Sizes & Stock</label>
                <div className="space-y-2">
                  {ALL_SIZES.map(size => {
                    const entry = form.sizes.find(s => s.size === size);
                    return (
                      <div key={size} className="flex items-center gap-3">
                        <input type="checkbox" id={`sz-${size}`} checked={!!entry} onChange={() => toggleSize(size)} />
                        <label htmlFor={`sz-${size}`} className="w-8 text-sm font-medium text-gray-700 cursor-pointer">{size}</label>
                        {entry && (
                          <input type="number" min="0" value={entry.countInStock}
                            onChange={e => updateSizeStock(size, Number(e.target.value))}
                            className="w-20 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            placeholder="Stock" />
                        )}
                        {entry && <span className="text-xs text-gray-400">in stock</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-2">Images</label>
                <p className="text-xs text-gray-400 mb-3">Enter image paths like <code>/products/prod1.jpg</code> or full URLs.</p>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={imageInput} onChange={e => setImageInput(e.target.value)}
                    placeholder="/products/prod1.jpg"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    className="flex-grow border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
                  <button type="button" onClick={addImage} className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm font-medium transition">Add</button>
                </div>
                {form.images.length > 0 && (
                  <div className="space-y-2">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded px-3 py-2">
                        <img src={img} alt="" className="w-10 h-12 object-cover rounded" onError={e => { (e.target as HTMLImageElement).src = '/products/prod1.jpg'; }} />
                        <span className="flex-grow text-xs text-gray-500 truncate">{img}</span>
                        <button type="button" onClick={() => removeImage(idx)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-gray-900 text-white py-3 text-sm font-medium rounded hover:bg-gray-800 transition disabled:bg-gray-300">
                {saving ? 'Saving…' : editingProduct ? 'Save Changes' : 'Create Product'}
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
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 text-white py-2 rounded text-sm font-medium hover:bg-red-600 transition">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <span className="text-sm text-gray-500">Showing {filtered.length}</span>
        </div>

        <div className="overflow-x-auto">
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
                        {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                        {p.tag && <span className="text-xs text-gray-400">{p.tag}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{p.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.sizes.slice(0, 4).map(s => (
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
        </div>
      </div>
    </div>
  );
}
