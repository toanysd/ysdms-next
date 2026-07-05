import React from 'react';

export default function QCDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Quality Control (Nakamura)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 shadow-sm bg-white border-l-4 border-l-red-500">
          <h2 className="text-xl font-semibold mb-2">Tray Inspections</h2>
          <p className="text-gray-600 mb-4">Input measurement data based on the drawing specs.</p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">New Inspection</button>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm bg-white border-l-4 border-l-rose-500">
          <h2 className="text-xl font-semibold mb-2">Defect Reports</h2>
          <p className="text-gray-600 mb-4">Review root causes and translated instructions for the factory.</p>
          <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded">View Reports</button>
        </div>
      </div>
    </div>
  );
}
