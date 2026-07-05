"use client"

import React from 'react';

interface BaseEntity {
  id: string;
  code: string;
  name: string;
  customer_id?: string;
}

export default function DesignCenterClient({ initialBases }: { initialBases: BaseEntity[] }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Design Center Bases</h2>
      
      {initialBases && initialBases.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border-b">Code</th>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Customer ID</th>
              </tr>
            </thead>
            <tbody>
              {initialBases.map((base) => (
                <tr key={base.id} className="hover:bg-gray-50 border-b last:border-b-0">
                  <td className="p-3">{base.code}</td>
                  <td className="p-3">{base.name}</td>
                  <td className="p-3">{base.customer_id || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-500 text-center py-4">No bases available.</p>
      )}
    </div>
  )
}
