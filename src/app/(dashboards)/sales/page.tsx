import React from 'react';

export default function SalesDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard (Kobayashi)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Quotes & Orders</h2>
          <p className="text-gray-600 mb-4">Manage customer quotes and track active orders.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">View Orders</button>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-2">Design Requests</h2>
          <p className="text-gray-600 mb-4">Request new designs from the Engineering team.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">New Request</button>
        </div>
      </div>
    </div>
  );
}
