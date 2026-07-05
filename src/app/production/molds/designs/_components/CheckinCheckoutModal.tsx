"use client"

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MoldPhysical {
  id: string;
  physical_code: string;
  mold_name?: string;
}

interface Entity {
  id: string;
  name: string;
  code: string;
}

interface Layer {
  id: string;
  rack_id: string;
  label: string;
  code: string;
}

interface Company {
  id: string;
  name: string;
}

interface ItemType {
  id: string;
  name: string;
}

export function CheckinCheckoutModal({
  mold,
  mode,
  isOpen,
  onClose,
  racks,
  allLayers,
  employees,
  destinations,
  companies,
  itemTypes,
}: {
  mold: MoldPhysical | null;
  mode: 'in' | 'out';
  isOpen: boolean;
  onClose: () => void;
  racks: Entity[];
  allLayers: Layer[];
  employees: Entity[];
  destinations: Entity[];
  companies: Company[];
  itemTypes: ItemType[];
}) {
  const [employeeId, setEmployeeId] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [itemTypeId, setItemTypeId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mold) return;

    try {
      const supabase = createClient();
      const newStatus = mode === 'in' ? 'IN' : 'OUT';

      // 1. Insert into equipment_status_logs
      const { error: statusError } = await supabase
        .from('equipment_status_logs')
        .insert({
          physical_mold_id: mold.id,
          status: newStatus,
          employee_id: employeeId || null,
          destination_id: destinationId || null,
        });

      if (statusError) throw statusError;

      // 2. If company is selected, assume it's a ship out/return
      if (companyId) {
        const { error: shipError } = await supabase
          .from('equipment_ship_logs')
          .insert({
            physical_mold_id: mold.id,
            ship_status: mode === 'in' ? 'RETURN' : 'SHIP_OUT',
            company_id: companyId,
            item_type_id: itemTypeId ? parseInt(itemTypeId, 10) : null,
          });
          
        if (shipError) throw shipError;
      }

      onClose();
      // Optionally trigger a refresh
    } catch (err) {
      console.error('Error updating mold status:', err);
      alert('Failed to update mold status. See console for details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          {mode === 'in' ? 'Check-In' : 'Check-Out'} Mold {mold?.physical_code}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Employee</option>
              {employees?.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Destination/Location</label>
            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Destination</option>
              {destinations?.map(dest => (
                <option key={dest.id} value={dest.id}>{dest.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select Company</option>
              {companies?.map(comp => (
                <option key={comp.id} value={comp.id}>{comp.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Item Type</label>
            <select
              value={itemTypeId}
              onChange={(e) => setItemTypeId(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select Item Type</option>
              {itemTypes?.map(it => (
                <option key={it.id} value={it.id}>{it.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
