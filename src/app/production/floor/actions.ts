'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface FloorScheduleItem {
  schedule_id: string;
  schedule_date: string;
  shift: string | null;
  status: string | null;
  planned_quantity: number | null;
  actual_quantity: number | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  notes: string | null;
  machine_id: string;
  machines: {
    machine_id: string;
    machine_code: string;
    machine_name: string;
    feed_length_mm: number | null;
  } | null;
  product_id: string | null;
  products: {
    product_id: string;
    product_code: string;
    product_name_internal: string | null;
    product_name: string | null;
  } | null;
  mold_id: string | null;
  mold: {
    equipment_id: string;
    equipment_code: string;
    display_name: string | null;
    equipment_type: string;
  } | null;
  work_order_id: string | null;
  work_orders: {
    wo_id: string;
    wo_code: string;
    wo_name: string;
  } | null;
  roll_id: string | null;
  plastic_receipt_roll: {
    id: string;
    roll_barcode: string;
    current_length_m: number;
    nominal_length_m: number;
    lot_no: string | null;
    plastic_master: {
      plastic_code: string;
      thickness_mm: number | null;
      width_mm: number | null;
      plastic_family: string | null;
    } | null;
  } | null;
  lifecycle?: {
    lifecycle_status: 'NORMAL' | 'WARNING' | 'OVERDUE' | null;
    total_shots: number | null;
    pct_life_used: number | null;
  } | null;
}

export interface MachineSummary {
  machine_id: string;
  machine_code: string;
  machine_name: string;
  feed_length_mm: number | null;
  activeSchedule?: {
    schedule_id: string;
    product_code?: string;
    status: string;
  } | null;
}

export interface FloorRollItem {
  id: string;
  roll_barcode: string;
  current_length_m: number;
  nominal_length_m: number;
  lot_no: string | null;
  status: string | null;
  plastic_master: {
    plastic_code: string;
    thickness_mm: number | null;
    width_mm: number | null;
    plastic_family: string | null;
  } | null;
}

/**
 * Get all active machines with current schedule status
 */
export async function getFloorMachines(): Promise<MachineSummary[]> {
  const supabase = await createClient();

  const { data: machines, error } = await supabase
    .from('machines')
    .select('machine_id, machine_code, machine_name, feed_length_mm, is_active')
    .eq('is_active', true)
    .order('machine_code', { ascending: true });

  if (error || !machines) {
    return [];
  }

  // Find any in_progress or planned schedules for today/recent
  const { data: schedules } = await supabase
    .from('production_schedules')
    .select('schedule_id, machine_id, status, products(product_code)')
    .in('status', ['IN_PROGRESS', 'PLANNED'])
    .or('shift.eq.day,shift.eq.DAY,shift.is.null');

  const schedMap = new Map<string, { schedule_id: string; product_code?: string; status: string }>();
  if (schedules) {
    for (const s of schedules) {
      if (!schedMap.has(s.machine_id) || s.status === 'IN_PROGRESS') {
        const prod = Array.isArray(s.products) ? s.products[0] : s.products;
        schedMap.set(s.machine_id, {
          schedule_id: s.schedule_id,
          product_code: prod?.product_code,
          status: s.status || 'PLANNED',
        });
      }
    }
  }

  return machines.map((m) => ({
    machine_id: m.machine_id,
    machine_code: m.machine_code,
    machine_name: m.machine_name,
    feed_length_mm: m.feed_length_mm,
    activeSchedule: schedMap.get(m.machine_id) || null,
  }));
}

/**
 * Get machine data and schedules for floor cockpit
 */
export async function getMachineCockpitData(machineId: string): Promise<{
  machine: {
    machine_id: string;
    machine_code: string;
    machine_name: string;
    feed_length_mm: number | null;
  } | null;
  schedules: FloorScheduleItem[];
  employees: { employee_id: string; employee_name: string; employee_code: string }[];
}> {
  const supabase = await createClient();

  // 1. Machine info
  const { data: machine } = await supabase
    .from('machines')
    .select('machine_id, machine_code, machine_name, feed_length_mm')
    .eq('machine_id', machineId)
    .single();

  // 2. Schedules for this machine
  // Locked shift: day only
  const { data: schedData } = await supabase
    .from('production_schedules')
    .select(`
      schedule_id,
      schedule_date,
      shift,
      status,
      planned_quantity,
      actual_quantity,
      scheduled_start,
      scheduled_end,
      notes,
      machine_id,
      machines (
        machine_id,
        machine_code,
        machine_name,
        feed_length_mm
      ),
      product_id,
      products (
        product_id,
        product_code,
        product_name_internal,
        product_name
      ),
      mold_id,
      mold:equipment!production_schedules_mold_id_fkey (
        equipment_id,
        equipment_code,
        display_name,
        equipment_type
      ),
      work_order_id,
      work_orders (
        wo_id,
        wo_code,
        wo_name
      ),
      roll_id,
      plastic_receipt_roll (
        id,
        roll_barcode,
        current_length_m,
        nominal_length_m,
        lot_no,
        plastic_master (
          plastic_code,
          thickness_mm,
          width_mm,
          plastic_family
        )
      )
    `)
    .eq('machine_id', machineId)
    .or('shift.eq.day,shift.eq.DAY,shift.is.null')
    .order('schedule_date', { ascending: false })
    .limit(20);

  const rawSchedules = (schedData || []) as unknown as FloorScheduleItem[];

  // Collect mold IDs to query lifecycle view
  const moldIds = rawSchedules
    .map((s) => s.mold_id)
    .filter((id): id is string => Boolean(id));

  let lifecycleMap = new Map<string, { lifecycle_status: 'NORMAL' | 'WARNING' | 'OVERDUE' | null; total_shots: number | null; pct_life_used: number | null }>();
  if (moldIds.length > 0) {
    const { data: lcData } = await supabase
      .from('v_equipment_lifecycle_status')
      .select('equipment_id, lifecycle_status, total_shots, pct_life_used')
      .in('equipment_id', moldIds);

    if (lcData) {
      for (const row of lcData) {
        if (row.equipment_id) {
          lifecycleMap.set(row.equipment_id, {
            lifecycle_status: row.lifecycle_status,
            total_shots: row.total_shots,
            pct_life_used: row.pct_life_used,
          });
        }
      }
    }
  }

  const enrichedSchedules = rawSchedules.map((s) => ({
    ...s,
    lifecycle: s.mold_id ? lifecycleMap.get(s.mold_id) || null : null,
  }));

  // Sort: IN_PROGRESS first, then PLANNED by schedule_date asc, then others
  enrichedSchedules.sort((a, b) => {
    if (a.status === 'IN_PROGRESS' && b.status !== 'IN_PROGRESS') return -1;
    if (b.status === 'IN_PROGRESS' && a.status !== 'IN_PROGRESS') return 1;
    if (a.status === 'PLANNED' && b.status !== 'PLANNED') return -1;
    if (b.status === 'PLANNED' && a.status !== 'PLANNED') return 1;
    return (a.schedule_date || '').localeCompare(b.schedule_date || '');
  });

  // 3. Operators / Employees
  const { data: employees } = await supabase
    .from('employees')
    .select('employee_id, employee_name, employee_code')
    .eq('is_active', true)
    .order('employee_name', { ascending: true });

  return {
    machine: machine || null,
    schedules: enrichedSchedules,
    employees: employees || [],
  };
}

/**
 * Step 1: Start Shift for a schedule
 */
export async function startFloorShift(params: {
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
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const nowIso = new Date().toISOString();
    const today = nowIso.split('T')[0];

    // 1. Update schedule status
    const { data: schedule, error: schedErr } = await supabase
      .from('production_schedules')
      .update({
        status: 'IN_PROGRESS',
        operator_id: params.operatorId,
        scheduled_start: nowIso,
      })
      .eq('schedule_id', params.scheduleId)
      .select('schedule_id, product_id, mold_id, roll_id')
      .single();

    if (schedErr || !schedule) {
      return { success: false, error: schedErr?.message || 'Schedule not found' };
    }

    // 2. Fetch roll details if mounted
    let rollBarcode: string | null = null;
    let plasticId: string | null = null;
    if (schedule.roll_id) {
      const { data: roll } = await supabase
        .from('plastic_receipt_roll')
        .select('roll_barcode, plastic_id')
        .eq('id', schedule.roll_id)
        .single();
      if (roll) {
        rollBarcode = roll.roll_barcode;
        plasticId = roll.plastic_id;
      }
    }

    // 3. Insert forming daily log
    const { error: logErr } = await supabase.from('forming_daily_logs').insert([
      {
        schedule_id: schedule.schedule_id,
        log_date: today,
        start_time: nowIso,
        operator_id: params.operatorId,
        product_id: schedule.product_id,
        equipment_id: schedule.mold_id,
        roll_barcode: rollBarcode,
        plastic_id: plasticId,
        qty_ok: 0,
        qty_ng_a: 0,
        qty_ng_b: 0,
        qty_ng_c: 0,
        qty_ng_d: 0,
        qty_ng_e: 0,
        qty_ng_f: 0,
        qty_ng_g: 0,
        check_heater: params.checks.check_heater,
        check_mold: params.checks.check_mold,
        check_cutter: params.checks.check_cutter,
        check_plug: params.checks.check_plug,
        check_frame: params.checks.check_frame,
        check_water_base: params.checks.check_water_base,
        check_stacking: params.checks.check_stacking,
      },
    ]);

    if (logErr) {
      console.warn('Could not insert forming log:', logErr.message);
    }

    revalidatePath('/production/floor');
    revalidatePath('/production/schedule');
    revalidatePath('/production/daily-logs');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
}

/**
 * Step 2: Mount Plastic Roll onto schedule
 */
export async function mountFloorRoll(params: {
  scheduleId: string;
  rollId: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    // 1. Fetch roll info
    const { data: roll, error: rollErr } = await supabase
      .from('plastic_receipt_roll')
      .select('id, roll_barcode, plastic_id')
      .eq('id', params.rollId)
      .single();

    if (rollErr || !roll) {
      return { success: false, error: 'Roll not found' };
    }

    // 2. Update schedule
    const { error: schedErr } = await supabase
      .from('production_schedules')
      .update({ roll_id: params.rollId })
      .eq('schedule_id', params.scheduleId);

    if (schedErr) {
      return { success: false, error: schedErr.message };
    }

    // 3. Update forming log if exists
    await supabase
      .from('forming_daily_logs')
      .update({
        roll_barcode: roll.roll_barcode,
        plastic_id: roll.plastic_id,
      })
      .eq('schedule_id', params.scheduleId);

    revalidatePath('/production/floor');
    revalidatePath('/production/schedule');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
}

/**
 * Step 3: End Shift & Report Output
 */
export async function endFloorShift(params: {
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
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const nowIso = new Date().toISOString();
    const today = nowIso.split('T')[0];

    // 1. Fetch schedule details
    const { data: schedule, error: schedErr } = await supabase
      .from('production_schedules')
      .select('schedule_id, product_id, mold_id, operator_id, roll_id')
      .eq('schedule_id', params.scheduleId)
      .single();

    if (schedErr || !schedule) {
      return { success: false, error: schedErr?.message || 'Schedule not found' };
    }

    // 2. Mark schedule as COMPLETED
    const { error: updateErr } = await supabase
      .from('production_schedules')
      .update({
        status: 'COMPLETED',
        actual_quantity: params.actualQuantity,
        scheduled_end: nowIso,
        notes: params.notes || null,
      })
      .eq('schedule_id', params.scheduleId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // 3. Deduct plastic roll length if roll_id is present
    if (schedule.roll_id && params.consumedMeters > 0) {
      const { data: roll } = await supabase
        .from('plastic_receipt_roll')
        .select('id, current_length_m')
        .eq('id', schedule.roll_id)
        .single();

      if (roll) {
        const remainingM = Math.max(0, (roll.current_length_m || 0) - params.consumedMeters);
        await supabase
          .from('plastic_receipt_roll')
          .update({
            current_length_m: remainingM,
            status: remainingM <= 0 ? 'depleted' : 'in_stock',
          })
          .eq('id', schedule.roll_id);
      }
    }

    // 4. Update forming_daily_logs
    const totalNg =
      params.ng.qty_ng_a +
      params.ng.qty_ng_b +
      params.ng.qty_ng_c +
      params.ng.qty_ng_d +
      params.ng.qty_ng_e +
      params.ng.qty_ng_f +
      params.ng.qty_ng_g;

    const { error: formLogErr } = await supabase
      .from('forming_daily_logs')
      .update({
        qty_ok: params.actualQuantity,
        qty_ng_a: params.ng.qty_ng_a,
        qty_ng_b: params.ng.qty_ng_b,
        qty_ng_c: params.ng.qty_ng_c,
        qty_ng_d: params.ng.qty_ng_d,
        qty_ng_e: params.ng.qty_ng_e,
        qty_ng_f: params.ng.qty_ng_f,
        qty_ng_g: params.ng.qty_ng_g,
        end_time: nowIso,
        notes: params.notes || null,
      })
      .eq('schedule_id', params.scheduleId);

    if (formLogErr) {
      console.warn('Error updating forming log:', formLogErr.message);
    }

    // 5. Insert into press_daily_logs to drive shot_count in v_equipment_lifecycle_status
    if (schedule.mold_id && schedule.operator_id) {
      const calculatedShots = params.shotCount && params.shotCount > 0
        ? params.shotCount
        : params.actualQuantity;

      await supabase.from('press_daily_logs').insert([
        {
          schedule_id: schedule.schedule_id,
          log_date: today,
          operator_id: schedule.operator_id,
          equipment_id: schedule.mold_id,
          product_id: schedule.product_id,
          qty_ok: params.actualQuantity,
          qty_ng: totalNg,
          shot_count: calculatedShots,
          cutter_condition: 'NORMAL',
          notes_vi: params.notes || null,
        },
      ]);
    }

    revalidatePath('/production/floor');
    revalidatePath('/production/schedule');
    revalidatePath('/production/daily-logs');
    revalidatePath('/equipment/lifecycle');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
}

/**
 * Search available plastic rolls for mounting
 */
export async function searchFloorRolls(query?: string): Promise<FloorRollItem[]> {
  const supabase = await createClient();

  let q = supabase
    .from('plastic_receipt_roll')
    .select(`
      id,
      roll_barcode,
      current_length_m,
      nominal_length_m,
      lot_no,
      status,
      plastic_master (
        plastic_code,
        thickness_mm,
        width_mm,
        plastic_family
      )
    `)
    .gt('current_length_m', 0)
    .order('created_at', { ascending: false })
    .limit(30);

  if (query && query.trim()) {
    q = q.ilike('roll_barcode', `%${query.trim()}%`);
  }

  const { data, error } = await q;
  if (error || !data) {
    return [];
  }

  return data as unknown as FloorRollItem[];
}
