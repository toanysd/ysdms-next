import React from 'react';

export default function EngineeringDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Engineering Dashboard (Quan)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 shadow-sm bg-white border-l-4 border-l-indigo-500">
          <h2 className="text-xl font-semibold mb-2">Design Requests</h2>
          <p className="text-gray-600 mb-4">View and process incoming design requests for molds and cutters.</p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">View Requests</button>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm bg-white border-l-4 border-l-purple-500">
          <h2 className="text-xl font-semibold mb-2">CAD Files & Approval</h2>
          <p className="text-gray-600 mb-4">Upload tray and mold CAD drawings for customer review.</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Upload Designs</button>
        </div>
      </div>
    </div>
  );
}
