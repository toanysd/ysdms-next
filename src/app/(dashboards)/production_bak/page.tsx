import React from 'react';

export default function ProductionDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Production Dashboard (Sakurai / Taniguchi)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-6 shadow-sm bg-white border-l-4 border-l-green-500">
          <h2 className="text-xl font-semibold mb-2">Production Schedule</h2>
          <p className="text-gray-600 mb-4">Manage machine assignments and plan production runs.</p>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">View Schedule</button>
        </div>
        
        <div className="border rounded-lg p-6 shadow-sm bg-white border-l-4 border-l-teal-500">
          <h2 className="text-xl font-semibold mb-2">Active Jobs</h2>
          <p className="text-gray-600 mb-4">Monitor currently running forming jobs and defect rates.</p>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded">View Jobs</button>
        </div>
      </div>
    </div>
  );
}
