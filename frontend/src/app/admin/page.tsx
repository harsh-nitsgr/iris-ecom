'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, Users, Heart, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface InterestEntry {
  productId: string;
  productName: string;
  totalClicks: number;
  updatedAt: string;
  image?: string;
}

export default function AdminDashboard() {
  const [interests, setInterests] = useState<InterestEntry[]>([]);
  const [loadingInterests, setLoadingInterests] = useState(true);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    // Fetch real product count from API
    api.get('/products?limit=1').then(({ data }) => {
      setProductCount(Array.isArray(data) ? data.length : (data.pages != null ? data.pages * 12 : (data.products?.length ?? 0)));
      // More accurately: use count from a dedicated endpoint or just show products length
      api.get('/products?limit=500').then(({ data: all }) => {
        setProductCount(Array.isArray(all) ? all.length : (all.products?.length ?? 0));
      }).catch(() => {});
    }).catch(() => {});

    api.get('/interests')
      .then(({ data }) => setInterests(data))
      .catch(() => setInterests([]))
      .finally(() => setLoadingInterests(false));
  }, []);

  const totalImpressions = interests.reduce((sum, i) => sum + i.totalClicks, 0);
  const maxClicks = interests[0]?.totalClicks || 1;

  // Product images are now served from backend — no local lookup needed
  const getProductImage = (_productId: string) => null;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time overview of your store</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <ShoppingBag size={18} className="text-gray-600" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Products</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{productCount}</p>
          <p className="text-xs text-gray-400 mt-1">In catalog</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center">
              <Heart size={18} className="text-rose-400" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Impressions</span>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{totalImpressions}</p>
          <p className="text-xs text-gray-400 mt-1">Total Show Interest clicks</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-500" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Top Product</span>
          </div>
          <p className="text-xl font-semibold text-gray-900 leading-snug truncate">
            {interests[0]?.productName || '—'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {interests[0] ? `${interests[0].totalClicks} interest clicks` : 'No data yet'}
          </p>
        </div>
      </div>

      {/* Product Impressions Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-900">Product Impressions</h2>
            <p className="text-xs text-gray-400 mt-0.5">Ranked by "Show Interest" clicks</p>
          </div>
          <Link href="/admin/interests"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition">
            View full data <ArrowRight size={12} />
          </Link>
        </div>

        {loadingInterests ? (
          <div className="px-6 py-12 text-center text-gray-300 text-sm">Loading impressions…</div>
        ) : interests.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Heart size={28} className="text-gray-200 mx-auto mb-3" strokeWidth={1} />
            <p className="text-gray-400 text-sm">No impressions yet.</p>
            <p className="text-gray-300 text-xs mt-1">They appear here when visitors click "Show Interest" on products.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {interests.slice(0, 8).map((item, idx) => {
              const pct = Math.round((item.totalClicks / maxClicks) * 100);
              return (
                <Link href={`/product/${item.productId}`} key={item.productId} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition cursor-pointer">
                  {/* Rank */}
                  <span className="w-5 text-xs font-semibold text-gray-300 flex-shrink-0">{idx + 1}</span>

                  {/* Product thumb */}
                  <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-full h-full object-cover"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={14} />
                      </div>
                    )}
                  </div>

                  {/* Name + bar */}
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-grow h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right flex-shrink-0">{pct}%</span>
                    </div>
                  </div>

                  {/* Click count */}
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Heart size={12} className="text-rose-400" fill="currentColor" />
                      <span className="text-sm font-semibold text-gray-900">{item.totalClicks}</span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {new Date(item.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {interests.length > 8 && (
          <div className="px-6 py-3 border-t border-gray-50 text-center">
            <Link href="/admin/interests" className="text-xs text-gray-400 hover:text-gray-700 transition">
              + {interests.length - 8} more products — View all →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
