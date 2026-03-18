'use client';

import { Search, Eye } from 'lucide-react';

export default function AdminOrders() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Orders</h1>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-lg">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex space-x-4">
            <button className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-1">All Orders</button>
            <button className="text-sm font-medium text-gray-500 pb-1 hover:text-gray-900 transition">Pending</button>
            <button className="text-sm font-medium text-gray-500 pb-1 hover:text-gray-900 transition">Dispatched</button>
            <button className="text-sm font-medium text-gray-500 pb-1 hover:text-gray-900 transition">Delivered</button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by order ID..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-900">Order ID</th>
                <th className="px-6 py-4 font-medium text-gray-900">Date</th>
                <th className="px-6 py-4 font-medium text-gray-900">Customer</th>
                <th className="px-6 py-4 font-medium text-gray-900">Total</th>
                <th className="px-6 py-4 font-medium text-gray-900">Payment</th>
                <th className="px-6 py-4 font-medium text-gray-900">Status</th>
                <th className="px-6 py-4 font-medium text-gray-900 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">#ORD-{9000 + i}</td>
                  <td className="px-6 py-4">Oct 24, 2026</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">Jane Doe</div>
                    <div className="text-xs text-gray-500">jane@example.com</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">₹12,400</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select className="border border-gray-300 text-xs rounded px-2 py-1 outline-none focus:border-gray-900">
                      <option>Processing</option>
                      <option>Dispatched</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-gray-900 flex items-center justify-end w-full">
                      <Eye size={16} className="mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
