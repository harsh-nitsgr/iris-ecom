'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Package, User, MapPin, LogOut, Plus, Trash2, Star, Eye, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';

interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  status: string;
}

const TABS = [
  { id: 'orders',    icon: Package, label: 'Orders' },
  { id: 'profile',   icon: User,    label: 'Profile' },
  { id: 'addresses', icon: MapPin,  label: 'Addresses' },
  { id: 'interests', icon: Eye,     label: 'Interests' },
];

const EMPTY_ADDRESS: Omit<Address, 'isDefault'> = { street: '', city: '', state: '', postalCode: '', country: 'India' };

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [saveMsg, setSaveMsg] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ ...EMPTY_ADDRESS });
  const [addrSaving, setAddrSaving] = useState(false);
  const [interests, setInterests] = useState<any[]>([]);

  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      // Load addresses from profile
      api.get('/users/profile').then(({ data }) => setAddresses(data.addresses || [])).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (activeTab !== 'orders' || !user) return;
    setLoadingOrders(true);
    api.get('/orders/myorders').then(({ data }) => setOrders(data)).catch(() => setOrders([])).finally(() => setLoadingOrders(false));
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab !== 'interests') return;
    // Users see their own interests from localStorage; admins can call the API
    const raw = localStorage.getItem('my_interests');
    if (raw) setInterests(JSON.parse(raw));
  }, [activeTab]);

  if (!user) return null;

  const handleLogout = () => { logout(); router.push('/'); };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', { name: profileName });
      useAuthStore.setState({ user: { ...user, name: data.name }, token: data.token });
      setSaveMsg('Saved successfully!');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch {
      setSaveMsg('Failed to save. Please try again.');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrSaving(true);
    try {
      const { data } = await api.put('/users/profile', { addAddress: { ...newAddr, isDefault: false } });
      setAddresses(data.addresses || []);
      setShowAddForm(false);
      setNewAddr({ ...EMPTY_ADDRESS });
    } catch { alert('Failed to add address'); }
    finally { setAddrSaving(false); }
  };

  const handleDeleteAddress = async (index: number) => {
    if (!confirm('Delete this address?')) return;
    try {
      const { data } = await api.put('/users/profile', { deleteAddressIndex: index });
      setAddresses(data.addresses || []);
    } catch { alert('Failed to delete address'); }
  };

  const handleSetDefault = async (index: number) => {
    try {
      const { data } = await api.put('/users/profile', { setDefaultIndex: index });
      setAddresses(data.addresses || []);
    } catch { alert('Failed to set default'); }
  };

  const statusColor: Record<string, string> = {
    Processing: 'bg-blue-500/15 text-blue-400',
    Shipped: 'bg-yellow-500/15 text-yellow-400',
    Delivered: 'bg-green-500/15 text-green-400',
    Cancelled: 'bg-red-500/15 text-red-400',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16 px-4 sm:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-white/30 text-xs tracking-[0.5em] uppercase mb-3">Account</p>
          <h1 className="text-4xl md:text-5xl font-serif text-white">Hello, {user.name.split(' ')[0]}.</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full md:w-52 flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map(({ id, icon: Icon, label }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${activeTab === id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={16} strokeWidth={1.5} />{label}
                </button>
              ))}
              <div className="pt-6">
                {user.role === 'admin' && (
                  <button onClick={() => router.push('/admin')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-purple-400/80 hover:text-purple-400 hover:bg-purple-900/20 transition-colors mb-1">
                    <LayoutDashboard size={16} strokeWidth={1.5} />Admin Panel
                  </button>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-950/30 transition-colors">
                  <LogOut size={16} strokeWidth={1.5} />Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-grow">

            {/* ── Orders ── */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-serif text-white mb-6">Order History</h2>
                {loadingOrders ? (
                  <p className="text-white/30 text-sm">Loading…</p>
                ) : orders.length === 0 ? (
                  <div className="border border-white/10 p-12 text-center">
                    <p className="text-white/30 text-sm mb-4">No orders yet.</p>
                    <button onClick={() => router.push('/products')} className="text-xs tracking-widest uppercase border border-white/20 text-white/60 hover:text-white px-6 py-3 transition-colors">Start Shopping</button>
                  </div>
                ) : (
                  <div className="border border-white/10 overflow-hidden">
                    <table className="w-full text-left text-sm text-white/60">
                      <thead className="border-b border-white/10 bg-white/[0.03]">
                        <tr>
                          {['Order', 'Date', 'Total', 'Status'].map(h => (
                            <th key={h} className="px-6 py-4 font-medium text-white/50 uppercase tracking-widest text-xs">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition">
                            <td className="px-6 py-4 text-white font-medium text-xs">{o._id.slice(-8).toUpperCase()}</td>
                            <td className="px-6 py-4 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                            <td className="px-6 py-4 text-xs">₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs ${statusColor[o.status] ?? 'bg-white/10 text-white/50'}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Profile ── */}
            {activeTab === 'profile' && (
              <div className="max-w-xl">
                <h2 className="text-xl font-serif text-white mb-6">Profile Details</h2>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">Full Name</label>
                    <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)}
                      className="w-full bg-transparent border border-white/15 text-white px-4 py-3.5 text-sm focus:border-white/50 outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">Email</label>
                    <input type="email" value={user.email} disabled
                      className="w-full bg-white/5 border border-white/10 text-white/30 px-4 py-3.5 text-sm outline-none cursor-not-allowed" />
                    <p className="mt-2 text-white/20 text-xs">Email cannot be changed.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button type="submit" className="bg-white text-black px-8 py-3.5 text-xs font-medium tracking-widest uppercase hover:bg-white/90 transition-colors">Save Changes</button>
                    {saveMsg && <span className={`text-sm ${saveMsg.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>{saveMsg}</span>}
                  </div>
                </form>
              </div>
            )}

            {/* ── Addresses ── */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif text-white">Saved Addresses</h2>
                  <button onClick={() => setShowAddForm(!showAddForm)}
                    className="flex items-center gap-2 text-xs tracking-widest uppercase border border-white/20 text-white/60 hover:text-white hover:border-white/40 px-4 py-2 transition-colors">
                    <Plus size={14} />{showAddForm ? 'Cancel' : 'Add New'}
                  </button>
                </div>

                {/* Add address form */}
                {showAddForm && (
                  <form onSubmit={handleAddAddress} className="border border-white/10 p-6 mb-6 space-y-4">
                    <p className="text-white/40 text-xs tracking-widest uppercase mb-4">New Address</p>
                    {[
                      { label: 'Street / Flat No.', key: 'street', type: 'text' },
                      { label: 'City', key: 'city', type: 'text' },
                      { label: 'State', key: 'state', type: 'text' },
                      { label: 'Postal Code', key: 'postalCode', type: 'text' },
                      { label: 'Country', key: 'country', type: 'text' },
                    ].map(({ label, key, type }) => (
                      <div key={key}>
                        <label className="block text-xs uppercase tracking-widest text-white/30 mb-2">{label}</label>
                        <input type={type} required value={(newAddr as any)[key]}
                          onChange={e => setNewAddr(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full bg-transparent border border-white/15 text-white px-4 py-3 text-sm focus:border-white/50 outline-none transition-colors" />
                      </div>
                    ))}
                    <button type="submit" disabled={addrSaving}
                      className="bg-white text-black px-6 py-3 text-xs tracking-widest uppercase hover:bg-white/90 transition-colors disabled:bg-white/30">
                      {addrSaving ? 'Saving…' : 'Save Address'}
                    </button>
                  </form>
                )}

                {/* Address list */}
                {addresses.length === 0 && !showAddForm ? (
                  <div className="border border-white/10 p-12 text-center">
                    <p className="text-white/30 text-sm">No saved addresses yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr, idx) => (
                      <div key={idx} className={`relative border p-6 ${addr.isDefault ? 'border-white/40' : 'border-white/10'}`}>
                        {addr.isDefault && (
                          <span className="absolute top-3 right-3 text-[10px] tracking-widest uppercase text-white/50 bg-white/10 px-2 py-1">Default</span>
                        )}
                        <div className="text-sm text-white/70 space-y-1 leading-relaxed">
                          <p className="text-white font-medium">{addr.street}</p>
                          <p>{addr.city}, {addr.state}</p>
                          <p>{addr.postalCode}</p>
                          <p>{addr.country}</p>
                        </div>
                        <div className="mt-4 flex gap-3">
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefault(idx)} className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
                              <Star size={12} /> Set Default
                            </button>
                          )}
                          <button onClick={() => handleDeleteAddress(idx)} className="flex items-center gap-1 text-xs text-red-400/60 hover:text-red-400 transition-colors">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Interests ── */}
            {activeTab === 'interests' && (
              <div>
                <h2 className="text-xl font-serif text-white mb-2">Products You Liked</h2>
                <p className="text-white/30 text-xs mb-6">Products you've expressed interest in.</p>
                {interests.length === 0 ? (
                  <div className="border border-white/10 p-12 text-center">
                    <p className="text-white/30 text-sm mb-4">You haven't expressed interest in any products yet.</p>
                    <button onClick={() => router.push('/products')} className="text-xs tracking-widest uppercase border border-white/20 text-white/60 hover:text-white px-6 py-3 transition-colors">Browse Collection</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {interests.map((item: any) => (
                      <div key={item.productId} className="border border-white/10 p-4">
                        <p className="text-white text-sm font-medium mb-1">{item.productName}</p>
                        <p className="text-white/40 text-xs">Size: {item.size || '—'}</p>
                        <p className="text-white/30 text-xs mt-1">{new Date(item.at).toLocaleDateString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
