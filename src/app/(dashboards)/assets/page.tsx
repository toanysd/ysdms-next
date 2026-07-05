import React from 'react';

export default function AssetsDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Assets & Mold Management (Toan / Yamaguchi)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 shadow-sm bg-white border-l-4 border-l-amber-500">
          <h2 className="text-xl font-semibold mb-2">Mold Inventory</h2>
          <p className="text-gray-600 mb-4">Track physical molds, take photos, and measure dimensions.</p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded">Scan QR / Search</button>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm bg-white border-l-4 border-l-orange-500">
          <h2 className="text-xl font-semibold mb-2">Mold Lifecycle Events</h2>
          <p className="text-gray-600 mb-4">Record Teflon plating requests, mold returns, and disposal certificates.</p>
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">New Event</button>
        </div>
      </div>
    </div>
  );
}
