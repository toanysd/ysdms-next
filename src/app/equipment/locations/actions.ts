'use server'

import { createClient } from '@/lib/supabase/server'

export interface RackLayerSummary {
  id: string
  layer_number: number
  layer_code: string
  equipment_count: number
}

export interface RackSummary {
  id: string
  rack_code: string
  rack_name: string
  rack_code_new: string
  zone_code: string
  location_in_factory: string
  notes: string | null
  layers: RackLayerSummary[]
  total_layers: number
  total_equipment: number
}

export interface LocationKpis {
  totalRacks: number
  totalLayers: number
  totalEquipment: number
  occupiedLayers: number
  occupancyRate: number
  zoneCounts: Record<string, number>
}

export interface LocationsOverviewData {
  racks: RackSummary[]
  kpis: LocationKpis
  zones: string[]
}

export interface RackEquipmentItem {
  equipment_id: string
  equipment_code: string
  display_name: string
  equipment_type: string
  device_status: string | null
  usage_status: string | null
  notes: string | null
  current_rack_layer_id: string
}

export interface RackDetailWithLayers {
  rack: {
    id: string
    rack_code: string
    rack_name: string
    rack_code_new: string
    zone_code: string
    location_in_factory: string
    notes: string | null
  }
  layers: {
    id: string
    layer_number: number
    layer_code: string
    equipment: RackEquipmentItem[]
  }[]
  total_equipment: number
  total_layers: number
}

export async function getLocationsOverview(params?: {
  zone?: string
  search?: string
  status?: string
}): Promise<LocationsOverviewData> {
  const supabase = await createClient()

  // 1. Fetch all racks with layers
  const { data: racksRaw, error: racksErr } = await supabase
    .from('racks')
    .select(`
      id,
      rack_code,
      rack_name,
      rack_code_new,
      zone_code,
      location_in_factory,
      notes,
      rack_layers (
        id,
        layer_number,
        layer_code
      )
    `)
    .order('rack_code_new', { ascending: true })

  if (racksErr || !racksRaw) {
    console.error('Error fetching racks:', racksErr)
    return {
      racks: [],
      kpis: {
        totalRacks: 0,
        totalLayers: 0,
        totalEquipment: 0,
        occupiedLayers: 0,
        occupancyRate: 0,
        zoneCounts: {},
      },
      zones: [],
    }
  }

  // 2. Fetch equipment layer counts in parallel batches (handles 4,761+ items)
  const batchRanges = [
    [0, 999],
    [1000, 1999],
    [2000, 2999],
    [3000, 3999],
    [4000, 4999],
    [5000, 5999],
  ]

  const batchResults = await Promise.all(
    batchRanges.map(([from, to]) =>
      supabase
        .from('equipment')
        .select('current_rack_layer_id')
        .not('current_rack_layer_id', 'is', null)
        .range(from, to)
    )
  )

  const layerEquipmentCount: Record<string, number> = {}
  let totalStoredEquipment = 0

  for (const res of batchResults) {
    if (res.data) {
      for (const row of res.data) {
        if (row.current_rack_layer_id) {
          totalStoredEquipment++
          layerEquipmentCount[row.current_rack_layer_id] =
            (layerEquipmentCount[row.current_rack_layer_id] || 0) + 1
        }
      }
    }
  }

  // 3. Map into structured summaries
  let totalLayersCount = 0
  let occupiedLayersCount = 0
  const zoneCounts: Record<string, number> = {}
  const distinctZonesSet = new Set<string>()

  const allSummaries: RackSummary[] = racksRaw.map((r: any) => {
    const zone = r.zone_code || 'SP'
    distinctZonesSet.add(zone)
    zoneCounts[zone] = (zoneCounts[zone] || 0) + 1

    const sortedLayers: RackLayerSummary[] = (r.rack_layers || [])
      .map((l: any) => {
        const count = layerEquipmentCount[l.id] || 0
        totalLayersCount++
        if (count > 0) occupiedLayersCount++
        return {
          id: l.id,
          layer_number: l.layer_number,
          layer_code: l.layer_code || `${r.rack_code_new || r.rack_name}-L${l.layer_number}`,
          equipment_count: count,
        }
      })
      .sort((a: RackLayerSummary, b: RackLayerSummary) => a.layer_number - b.layer_number)

    const rackEqTotal = sortedLayers.reduce((sum, l) => sum + l.equipment_count, 0)

    return {
      id: r.id,
      rack_code: r.rack_code || '—',
      rack_name: r.rack_name || '—',
      rack_code_new: r.rack_code_new || r.rack_name || '—',
      zone_code: zone,
      location_in_factory: r.location_in_factory || '—',
      notes: r.notes,
      layers: sortedLayers,
      total_layers: sortedLayers.length,
      total_equipment: rackEqTotal,
    }
  })

  // 4. Apply filters (zone, search, status)
  let filtered = allSummaries

  if (params?.zone && params.zone !== 'ALL') {
    filtered = filtered.filter((r) => r.zone_code === params.zone)
  }

  if (params?.status === 'IN_USE') {
    filtered = filtered.filter((r) => r.total_equipment > 0)
  } else if (params?.status === 'EMPTY') {
    filtered = filtered.filter((r) => r.total_equipment === 0)
  }

  if (params?.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase()
    filtered = filtered.filter(
      (r) =>
        r.rack_code_new.toLowerCase().includes(q) ||
        r.rack_code.toLowerCase().includes(q) ||
        r.rack_name.toLowerCase().includes(q) ||
        r.location_in_factory.toLowerCase().includes(q) ||
        r.layers.some((l) => l.layer_code.toLowerCase().includes(q))
    )
  }

  const occupancyRate =
    totalLayersCount > 0
      ? Number(((occupiedLayersCount / totalLayersCount) * 100).toFixed(1))
      : 0

  const zoneOrder = [
    'MR', '2F', 'CS', 'GT', 'OF', 'MD', 'PS', 'TC', 'MT', 'M8', 'TW', 'SC', 'SP',
  ]
  const sortedZones = Array.from(distinctZonesSet).sort((a, b) => {
    const ia = zoneOrder.indexOf(a)
    const ib = zoneOrder.indexOf(b)
    if (ia !== -1 && ib !== -1) return ia - ib
    return a.localeCompare(b)
  })

  return {
    racks: filtered,
    kpis: {
      totalRacks: allSummaries.length,
      totalLayers: totalLayersCount,
      totalEquipment: totalStoredEquipment,
      occupiedLayers: occupiedLayersCount,
      occupancyRate,
      zoneCounts,
    },
    zones: sortedZones,
  }
}

export async function getRackDetailWithLayers(
  rackIdOrCode: string
): Promise<RackDetailWithLayers | null> {
  const supabase = await createClient()

  // Find rack by id or rack_code_new
  let query = supabase
    .from('racks')
    .select(`
      id,
      rack_code,
      rack_name,
      rack_code_new,
      zone_code,
      location_in_factory,
      notes,
      rack_layers (
        id,
        layer_number,
        layer_code
      )
    `)

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    rackIdOrCode
  )

  if (isUuid) {
    query = query.eq('id', rackIdOrCode)
  } else {
    query = query.or(`rack_code_new.eq.${rackIdOrCode},rack_name.eq.${rackIdOrCode}`)
  }

  const { data: rackData, error: rackErr } = await query.single()

  if (rackErr || !rackData) {
    console.error('Error fetching rack detail:', rackErr)
    return null
  }

  const layerIds = (rackData.rack_layers || []).map((l: any) => l.id)

  let equipmentRows: any[] = []
  if (layerIds.length > 0) {
    const { data: eqData, error: eqErr } = await supabase
      .from('equipment')
      .select(`
        equipment_id,
        equipment_code,
        display_name,
        equipment_type,
        device_status,
        usage_status,
        notes,
        current_rack_layer_id
      `)
      .in('current_rack_layer_id', layerIds)
      .order('equipment_code', { ascending: true })

    if (!eqErr && eqData) {
      equipmentRows = eqData
    }
  }

  // Group equipment by layer_id
  const eqByLayer: Record<string, RackEquipmentItem[]> = {}
  for (const eq of equipmentRows) {
    if (!eqByLayer[eq.current_rack_layer_id]) {
      eqByLayer[eq.current_rack_layer_id] = []
    }
    eqByLayer[eq.current_rack_layer_id].push({
      equipment_id: eq.equipment_id,
      equipment_code: eq.equipment_code,
      display_name: eq.display_name,
      equipment_type: eq.equipment_type,
      device_status: eq.device_status,
      usage_status: eq.usage_status,
      notes: eq.notes,
      current_rack_layer_id: eq.current_rack_layer_id,
    })
  }

  // Sort layers from highest layer_number down to 1 (top to bottom physical shelf)
  const sortedLayers = (rackData.rack_layers || [])
    .map((l: any) => ({
      id: l.id,
      layer_number: l.layer_number,
      layer_code: l.layer_code || `${rackData.rack_code_new || rackData.rack_name}-L${l.layer_number}`,
      equipment: eqByLayer[l.id] || [],
    }))
    .sort((a: any, b: any) => b.layer_number - a.layer_number)

  return {
    rack: {
      id: rackData.id,
      rack_code: rackData.rack_code || '—',
      rack_name: rackData.rack_name || '—',
      rack_code_new: rackData.rack_code_new || rackData.rack_name || '—',
      zone_code: rackData.zone_code || 'SP',
      location_in_factory: rackData.location_in_factory || '—',
      notes: rackData.notes,
    },
    layers: sortedLayers,
    total_equipment: equipmentRows.length,
    total_layers: sortedLayers.length,
  }
}
