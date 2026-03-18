'use client';

import { Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminBrands() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif text-gray-900">Brands & Partners</h1>
        <button className="bg-gray-900 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-800 transition flex items-center">
          <Plus size={16} className="mr-2" /> Add Brand
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-lg">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search brands..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium text-gray-900">Brand Name</th>
                <th className="px-6 py-4 font-medium text-gray-900">Description</th>
                <th className="px-6 py-4 font-medium text-gray-900">Featured</th>
                <th className="px-6 py-4 font-medium text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'Anavila', desc: 'Handwoven Linen', featured: true },
                { name: 'Péro', desc: 'Handmade Luxury', featured: true },
                { name: 'Eka', desc: 'Textile Rich', featured: false },
                { name: 'Runaway', desc: 'Street Couture', featured: true },
              ].map((brand, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{brand.name}</td>
                  <td className="px-6 py-4">{brand.desc}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${brand.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {brand.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button className="text-blue-600 hover:text-blue-800" title="Edit Brand"><Edit size={16} /></button>
                    <button className="text-red-600 hover:text-red-800" title="Delete Brand"><Trash2 size={16} /></button>
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
