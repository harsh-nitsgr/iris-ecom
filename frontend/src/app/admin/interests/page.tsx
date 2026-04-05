'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Heart } from 'lucide-react';
import api from '@/lib/api';

interface InterestEntry {
  productId: string;
  productName: string;
  totalClicks: number;
  updatedAt: string;
  image?: string;
}

export default function AdminInterestsPage() {
  const [data, setData] = useState<InterestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/interests')
      .then(({ data }) => setData(data))
      .catch(e => setError(e.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const max = data[0]?.totalClicks || 1;

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Interest Data</h1>
        <p className="text-sm text-gray-500 mt-1">Products ranked by how many times visitors clicked "Show Interest"</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 text-sm rounded">{error}</div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <Heart size={32} className="text-gray-300 mx-auto mb-4" strokeWidth={1} />
          <p className="text-gray-500">No interest data yet. Visitors haven't clicked Show Interest.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['#', 'Product', 'Interest Count', 'Last Click', 'Popularity'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                  <tr key={item.productId} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-400 font-medium">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <Link href={`/product/${item.productId}`} className="flex items-center gap-3 hover:opacity-80 transition">
                        <div className="w-10 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.image && <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                          <p className="text-xs text-blue-500 hover:underline font-mono mt-0.5">View details &rarr;</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Heart size={14} className="text-rose-400" fill="currentColor" />
                        <span className="font-semibold text-gray-900 text-base">{item.totalClicks}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(item.updatedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-rose-400 h-2 rounded-full transition-all" style={{ width: `${(item.totalClicks / max) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
