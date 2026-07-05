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
  code?: string;
}

interface Layer {
  id: string;
  rack_id: string;
  label: string;
  code?: string;
}

export function RelocateModal({
  mold,
  currentLayer,
  isOpen,
  onClose,
  racks,
  allLayers,
  employees,
}: {
  mold: MoldPhysical | null;
  currentLayer: Layer | null;
  isOpen: boolean;
  onClose: () => void;
  racks: Entity[];
  allLayers: Layer[];
  employees: Entity[];
}) {
  const [selectedRackId, setSelectedRackId] = useState('');
  const [selectedLayerId, setSelectedLayerId] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mold || !selectedLayerId) return;

    try {
      const supabase = createClient();

      // Update current rack layer on mold_physical
      const { error: updateError } = await supabase
        .from('physical_molds')
        .update({ current_rack_layer_id: selectedLayerId })
        .eq('physical_mold_id', mold.id);

      if (updateError) throw updateError;

      // Insert log
      const { error: logError } = await supabase
        .from('asset_location_logs')
        .insert({
          asset_id: mold.id,
          asset_type: 'MOLD',
          old_rack_layer_id: currentLayer?.id || null,
          new_rack_layer_id: selectedLayerId,
          moved_by: employeeId || null,
        });

      if (logError) throw logError;

      onClose();
      // Optionally trigger a refresh here if you have a callback
    } catch (err) {
      console.error('Error relocating mold:', err);
      alert('Failed to relocate mold. See console for details.');
    }
  };

  const filteredLayers = allLayers?.filter(layer => layer.rack_id === selectedRackId) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Relocate Mold {mold?.physical_code}</h2>
        
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Current Location:</p>
          <p className="font-medium">{currentLayer ? currentLayer.label : 'Unknown'}</p>
        </div>

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
            <label className="block text-sm font-medium mb-1">New Rack</label>
            <select
              value={selectedRackId}
              onChange={(e) => {
                setSelectedRackId(e.target.value);
                setSelectedLayerId('');
              }}
              className="w-full border rounded p-2"
              required
            >
              <option value="">Select Rack</option>
              {racks?.map(rack => (
                <option key={rack.id} value={rack.id}>{rack.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">New Layer</label>
            <select
              value={selectedLayerId}
              onChange={(e) => setSelectedLayerId(e.target.value)}
              className="w-full border rounded p-2"
              required
              disabled={!selectedRackId}
            >
              <option value="">Select Layer</option>
              {filteredLayers.map(layer => (
                <option key={layer.id} value={layer.id}>{layer.label}</option>
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
              Relocate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
