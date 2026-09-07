'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface LifecycleItem {
  equipment_id: string;
  equipment_code: string;
  display_name: string | null;
  equipment_type: string;
  maintenance_shot_threshold: number | null;
  shots_at_last_maintenance: number | null;
  total_shots: number;
  current_shots_since_service: number;
  pct_life_used: number;
  lifecycle_status: 'NORMAL' | 'WARNING' | 'OVERDUE';
}

export interface LifecycleStats {
  total: number;
  overdue: number;
  warning: number;
  normal: number;
}

export async function getLifecycleDashboard(params: {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  data: LifecycleItem[];
  totalRecords: number;
  stats: LifecycleStats;
}> {
  const supabase = await createClient();
  const page = params.page || 1;
  const pageSize = params.pageSize || 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 1. Get stats across all equipment (or filtered by type if specified)
  let statsQuery = supabase
    .from('v_equipment_lifecycle_status')
    .select('lifecycle_status, equipment_type');

  if (params.type && params.type !== 'ALL') {
    if (params.type === 'CUTTER') {
      statsQuery = statsQuery.in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE']);
    } else {
      statsQuery = statsQuery.eq('equipment_type', params.type);
    }
  }

  const { data: statsRows } = await statsQuery;
  const stats: LifecycleStats = {
    total: statsRows?.length || 0,
    overdue: 0,
    warning: 0,
    normal: 0,
  };

  if (statsRows) {
    for (const r of statsRows) {
      if (r.lifecycle_status === 'OVERDUE') stats.overdue++;
      else if (r.lifecycle_status === 'WARNING') stats.warning++;
      else stats.normal++;
    }
  }

  // 2. Query filtered & paginated records
  let query = supabase
    .from('v_equipment_lifecycle_status')
    .select('*', { count: 'exact' });

  // Type filter
  if (params.type && params.type !== 'ALL') {
    if (params.type === 'CUTTER') {
      query = query.in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE']);
    } else {
      query = query.eq('equipment_type', params.type);
    }
  }

  // Status filter
  if (params.status && params.status !== 'ALL') {
    query = query.eq('lifecycle_status', params.status as 'NORMAL' | 'WARNING' | 'OVERDUE');
  }

  // Search filter
  if (params.search && params.search.trim()) {
    const s = params.search.trim();
    query = query.or(`equipment_code.ilike.%${s}%,display_name.ilike.%${s}%`);
  }

  // Priority Sort: OVERDUE / highest pct_life_used first
  query = query
    .order('pct_life_used', { ascending: false, nullsFirst: false })
    .order('total_shots', { ascending: false })
    .range(from, to);

  const { data, count, error } = await query;

  if (error || !data) {
    console.error('Error querying v_equipment_lifecycle_status:', error);
    return { data: [], totalRecords: 0, stats };
  }

  const items: LifecycleItem[] = data.map((d: any) => ({
    equipment_id: d.equipment_id,
    equipment_code: d.equipment_code || '—',
    display_name: d.display_name,
    equipment_type: d.equipment_type || 'MOLD',
    maintenance_shot_threshold: d.maintenance_shot_threshold || 50000,
    shots_at_last_maintenance: d.shots_at_last_maintenance || 0,
    total_shots: d.total_shots || 0,
    current_shots_since_service: d.current_shots_since_service || 0,
    pct_life_used: d.pct_life_used || 0,
    lifecycle_status: d.lifecycle_status || 'NORMAL',
  }));

  return {
    data: items,
    totalRecords: count || 0,
    stats,
  };
}

/**
 * Action: Mark equipment maintenance completed
 * Updates equipment.shots_at_last_maintenance = totalShots
 */
export async function completeEquipmentMaintenance(params: {
  equipmentId: string;
  totalShots: number;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('equipment')
      .update({
        shots_at_last_maintenance: params.totalShots,
        updated_at: new Date().toISOString(),
      })
      .eq('equipment_id', params.equipmentId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath('/equipment/lifecycle');
    revalidatePath('/production/floor');
    revalidatePath('/equipment/molds');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' };
  }
}
