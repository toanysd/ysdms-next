'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import FloorHeader from './_components/FloorHeader';
import MachineSelectorModal from './_components/MachineSelectorModal';
import ActiveScheduleCard from './_components/ActiveScheduleCard';
import StartShiftModal from './_components/StartShiftModal';
import RollMountModal from './_components/RollMountModal';
import EndShiftModal from './_components/EndShiftModal';
import TodayQueue from './_components/TodayQueue';
import {
  FloorScheduleItem,
  MachineSummary,
  getFloorMachines,
  getMachineCockpitData,
  startFloorShift,
  mountFloorRoll,
  endFloorShift,
} from './actions';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'ysd_floor_machine';

export default function FloorCockpitPage() {
  const t = useTranslations('Floor');

  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [machines, setMachines] = useState<MachineSummary[]>([]);
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);

  // Cockpit Data
  const [currentMachine, setCurrentMachine] = useState<{
    machine_id: string;
    machine_code: string;
    machine_name: string;
    feed_length_mm: number | null;
  } | null>(null);
  const [schedules, setSchedules] = useState<FloorScheduleItem[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<{ employee_id: string; employee_name: string; employee_code: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals for 3-touch flow
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isMountModalOpen, setIsMountModalOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // 1. Initial load of machine list and restore machine from localStorage
  useEffect(() => {
    getFloorMachines().then((list) => {
      setMachines(list);
      const savedMachineId = localStorage.getItem(STORAGE_KEY);
      if (savedMachineId && list.some((m) => m.machine_id === savedMachineId)) {
        setSelectedMachineId(savedMachineId);
      } else if (list.length > 0) {
        // If not set yet, prompt operator to select machine
        setIsMachineModalOpen(true);
      }
    });
  }, []);

  // 2. Fetch cockpit data when selectedMachineId changes
  const loadCockpitData = useCallback(async (machineId: string) => {
    setIsLoading(true);
    try {
      const data = await getMachineCockpitData(machineId);
      setCurrentMachine(data.machine);
      setSchedules(data.schedules);
      setEmployees(data.employees);

      // Select active schedule: IN_PROGRESS first, then first PLANNED
      const active = data.schedules.find((s) => s.status === 'IN_PROGRESS') || data.schedules.find((s) => s.status === 'PLANNED') || data.schedules[0];
      setSelectedScheduleId(active?.schedule_id || null);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to load cockpit data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedMachineId) {
      loadCockpitData(selectedMachineId);
    }
  }, [selectedMachineId, loadCockpitData]);

  // Handle machine selection
  const handleSelectMachine = (machineId: string) => {
    setSelectedMachineId(machineId);
    localStorage.setItem(STORAGE_KEY, machineId);
  };

  // Active Schedule item
  const activeSchedule = schedules.find((s) => s.schedule_id === selectedScheduleId) || schedules[0] || null;

  // Step 1: Start Shift Action
  const handleConfirmStart = async (params: {
    scheduleId: string;
    operatorId: string;
    checks: {
      check_heater: boolean;
      check_mold: boolean;
      check_cutter: boolean;
      check_plug: boolean;
      check_frame: boolean;
      check_water_base: boolean;
      check_stacking: boolean;
    };
  }) => {
    const res = await startFloorShift(params);
    if (res.success) {
      showToast('success', t('startSuccess'));
      if (selectedMachineId) {
        await loadCockpitData(selectedMachineId);
      }
    } else {
      showToast('error', res.error || 'Failed to start shift');
    }
  };

  // Step 2: Mount Roll Action
  const handleConfirmMount = async (rollId: string) => {
    if (!activeSchedule) return;
    const res = await mountFloorRoll({
      scheduleId: activeSchedule.schedule_id,
      rollId,
    });
    if (res.success) {
      showToast('success', t('mountSuccess'));
      if (selectedMachineId) {
        await loadCockpitData(selectedMachineId);
      }
    } else {
      showToast('error', res.error || 'Failed to mount roll');
    }
  };

  // Step 3: End Shift Action
  const handleConfirmEnd = async (params: {
    scheduleId: string;
    actualQuantity: number;
    consumedMeters: number;
    notes?: string;
    ng: {
      qty_ng_a: number;
      qty_ng_b: number;
      qty_ng_c: number;
      qty_ng_d: number;
      qty_ng_e: number;
      qty_ng_f: number;
      qty_ng_g: number;
    };
    shotCount?: number;
  }) => {
    const res = await endFloorShift(params);
    if (res.success) {
      showToast('success', t('completeSuccess'));
      if (selectedMachineId) {
        await loadCockpitData(selectedMachineId);
      }
    } else {
      showToast('error', res.error || 'Failed to complete shift');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto w-full p-2 md:p-4 min-h-[calc(100vh-64px)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium transition-all ${
            toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-100" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Header */}
      <FloorHeader
        machineCode={currentMachine?.machine_code}
        machineName={currentMachine?.machine_name}
        onChangeMachine={() => setIsMachineModalOpen(true)}
        onRefresh={() => {
          if (selectedMachineId) loadCockpitData(selectedMachineId);
        }}
        isLoading={isLoading}
      />

      {/* Main Touch Cockpit Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Active Schedule Card (Hero for Operator) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <ActiveScheduleCard
            schedule={activeSchedule}
            onStartShift={() => setIsStartModalOpen(true)}
            onMountRoll={() => setIsMountModalOpen(true)}
            onEndShift={() => setIsEndModalOpen(true)}
          />
        </div>

        {/* Right Side: Today Queue */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <TodayQueue
            schedules={schedules}
            selectedScheduleId={activeSchedule?.schedule_id}
            onSelectSchedule={(s) => setSelectedScheduleId(s.schedule_id)}
          />
        </div>
      </div>

      {/* Modal 1: Machine Selector */}
      <MachineSelectorModal
        isOpen={isMachineModalOpen}
        onClose={() => setIsMachineModalOpen(false)}
        machines={machines}
        selectedMachineId={selectedMachineId}
        onSelectMachine={handleSelectMachine}
      />

      {/* Modal 2: Start Shift */}
      <StartShiftModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        schedule={activeSchedule}
        employees={employees}
        onConfirmStart={handleConfirmStart}
      />

      {/* Modal 3: Mount Roll */}
      <RollMountModal
        isOpen={isMountModalOpen}
        onClose={() => setIsMountModalOpen(false)}
        scheduleId={activeSchedule?.schedule_id || ''}
        currentRollId={activeSchedule?.roll_id}
        onConfirmMount={handleConfirmMount}
      />

      {/* Modal 4: End Shift & Output */}
      <EndShiftModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        schedule={activeSchedule}
        onConfirmEnd={handleConfirmEnd}
      />
    </div>
  );
}
