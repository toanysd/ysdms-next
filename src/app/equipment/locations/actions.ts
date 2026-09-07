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

export interface SelectorLookups {
  racks: {
    id: string
    rack_code: string
    rack_code_new: string
    zone_code: string
    location_in_factory: string
    layers: {
      id: string
      layer_number: number
      layer_code: string
    }[]
  }[]
  employees: {
    employee_id: string
    employee_code: string
    employee_name: string
  }[]
  companies: {
    company_id: string
    company_code: string
    company_name: string
  }[]
  zones: string[]
}

export async function getSelectorLookups(): Promise<SelectorLookups> {
  const supabase = await createClient()

  const [racksRes, empsRes, compsRes] = await Promise.all([
    supabase
      .from('racks')
      .select(`
        id,
        rack_code,
        rack_code_new,
        zone_code,
        location_in_factory,
        rack_layers (
          id,
          layer_number,
          layer_code
        )
      `)
      .order('rack_code_new', { ascending: true }),
    supabase
      .from('employees')
      .select('employee_id, employee_code, employee_name')
      .eq('is_active', true)
      .order('employee_name', { ascending: true }),
    supabase
      .from('companies')
      .select('company_id, company_code, company_name')
      .eq('is_active', true)
      .order('company_name', { ascending: true }),
  ])

  const zonesSet = new Set<string>()
  const racks = (racksRes.data || []).map((r: any) => {
    const zone = r.zone_code || 'SP'
    zonesSet.add(zone)
    const sortedLayers = (r.rack_layers || [])
      .map((l: any) => ({
        id: l.id,
        layer_number: l.layer_number,
        layer_code: l.layer_code || `${r.rack_code_new || r.rack_name}-L${l.layer_number}`,
      }))
      .sort((a: any, b: any) => a.layer_number - b.layer_number)

    return {
      id: r.id,
      rack_code: r.rack_code || '—',
      rack_code_new: r.rack_code_new || r.rack_name || '—',
      zone_code: zone,
      location_in_factory: r.location_in_factory || '—',
      layers: sortedLayers,
    }
  })

  const zoneOrder = [
    'MR', '2F', 'CS', 'GT', 'OF', 'MD', 'PS', 'TC', 'MT', 'M8', 'TW', 'SC', 'SP',
  ]
  const sortedZones = Array.from(zonesSet).sort((a, b) => {
    const ia = zoneOrder.indexOf(a)
    const ib = zoneOrder.indexOf(b)
    if (ia !== -1 && ib !== -1) return ia - ib
    return a.localeCompare(b)
  })

  return {
    racks,
    employees: empsRes.data || [],
    companies: compsRes.data || [],
    zones: sortedZones,
  }
}

export async function moveEquipmentLocation(params: {
  equipmentId: string
  oldRackLayerId: string | null
  newRackLayerId: string
  employeeId?: string | null
  notes?: string | null
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  if (!params.equipmentId || !params.newRackLayerId) {
    return { success: false, error: 'Thiếu equipmentId hoặc newRackLayerId' }
  }

  // 1. Update equipment current_rack_layer_id
  const { error: updateErr } = await supabase
    .from('equipment')
    .update({
      current_rack_layer_id: params.newRackLayerId,
    })
    .eq('equipment_id', params.equipmentId)

  if (updateErr) {
    console.error('Error updating equipment location:', updateErr)
    return { success: false, error: updateErr.message }
  }

  // 2. Insert into asset_location_logs
  const { error: logErr } = await supabase.from('asset_location_logs').insert({
    asset_id: params.equipmentId,
    asset_type: 'EQUIPMENT',
    old_rack_layer_id: params.oldRackLayerId || null,
    new_rack_layer_id: params.newRackLayerId,
    moved_by: params.employeeId || null,
    moved_at: new Date().toISOString(),
    notes: params.notes || null,
  })

  if (logErr) {
    console.warn('Warning inserting asset_location_logs:', logErr)
  }

  return { success: true }
}

export async function transferEquipmentCompany(params: {
  equipmentId: string
  fromCompanyId: string | null
  toCompanyId: string
  employeeId?: string | null
  shipDate?: string
  notes?: string | null
  itemName?: string | null
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  if (!params.equipmentId || !params.toCompanyId) {
    return { success: false, error: 'Thiếu equipmentId hoặc toCompanyId' }
  }

  // 1. Update equipment keeper_company_id
  const { error: updateErr } = await supabase
    .from('equipment')
    .update({
      keeper_company_id: params.toCompanyId,
    })
    .eq('equipment_id', params.equipmentId)

  if (updateErr) {
    console.error('Error updating equipment keeper company:', updateErr)
    return { success: false, error: updateErr.message }
  }

  // 2. Insert into equipment_ship_logs
  const { error: logErr } = await supabase.from('equipment_ship_logs').insert({
    equipment_id: params.equipmentId,
    from_company_id: params.fromCompanyId || null,
    to_company_id: params.toCompanyId,
    ship_date: params.shipDate || new Date().toISOString().slice(0, 10),
    ship_item_name: params.itemName || null,
    employee_id: params.employeeId || null,
    notes: params.notes || null,
  })

  if (logErr) {
    console.warn('Warning inserting equipment_ship_logs:', logErr)
  }

  return { success: true }
}

export async function returnEquipmentToOwner(params: {
  equipmentId: string
  ownerCompanyId: string
  currentKeeperCompanyId: string
  employeeId?: string | null
  notes?: string | null
  itemName?: string | null
}): Promise<{ success: boolean; error?: string }> {
  return transferEquipmentCompany({
    equipmentId: params.equipmentId,
    fromCompanyId: params.currentKeeperCompanyId,
    toCompanyId: params.ownerCompanyId,
    employeeId: params.employeeId,
    shipDate: new Date().toISOString().slice(0, 10),
    notes: params.notes ? `[金型返却] ${params.notes}` : '[金型返却] Trả khuôn cho khách hàng',
    itemName: params.itemName,
  })
}

export interface LocationMoveLogItem {
  id: string
  moved_at: string | null
  notes: string | null
  moved_by_name: string | null
  old_layer_code: string | null
  old_rack_code: string | null
  new_layer_code: string | null
  new_rack_code: string | null
}

export async function getLocationMoveLogs(
  equipmentId: string,
  limit = 10
): Promise<LocationMoveLogItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('asset_location_logs')
    .select(`
      id,
      moved_at,
      notes,
      employees!asset_location_logs_moved_by_fkey(employee_name),
      old_layer:rack_layers!asset_location_logs_old_rack_layer_id_fkey(
        layer_code,
        racks(rack_code_new, rack_code)
      ),
      new_layer:rack_layers!asset_location_logs_new_rack_layer_id_fkey(
        layer_code,
        racks(rack_code_new, rack_code)
      )
    `)
    .eq('asset_id', equipmentId)
    .order('moved_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error('Error fetching location move logs:', error)
    return []
  }

  return data.map((d: any) => ({
    id: d.id,
    moved_at: d.moved_at,
    notes: d.notes,
    moved_by_name: d.employees?.employee_name || null,
    old_layer_code: d.old_layer?.layer_code || null,
    old_rack_code: d.old_layer?.racks?.rack_code_new || d.old_layer?.racks?.rack_code || null,
    new_layer_code: d.new_layer?.layer_code || null,
    new_rack_code: d.new_layer?.racks?.rack_code_new || d.new_layer?.racks?.rack_code || null,
  }))
}

export interface EquipmentShipLogItem {
  ship_log_id: string
  ship_date: string
  ship_item_name: string | null
  notes: string | null
  from_company_name: string | null
  to_company_name: string | null
  employee_name: string | null
}

export async function getEquipmentShipLogs(
  equipmentId: string,
  limit = 10
): Promise<EquipmentShipLogItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('equipment_ship_logs')
    .select(`
      ship_log_id,
      ship_date,
      ship_item_name,
      notes,
      from_company:companies!equipment_ship_logs_from_company_id_fkey(company_name),
      to_company:companies!equipment_ship_logs_to_company_id_fkey(company_name),
      employees!equipment_ship_logs_employee_id_fkey(employee_name)
    `)
    .eq('equipment_id', equipmentId)
    .order('ship_date', { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error('Error fetching equipment ship logs:', error)
    return []
  }

  return data.map((d: any) => ({
    ship_log_id: d.ship_log_id,
    ship_date: d.ship_date,
    ship_item_name: d.ship_item_name,
    notes: d.notes,
    from_company_name: d.from_company?.company_name || null,
    to_company_name: d.to_company?.company_name || null,
    employee_name: d.employees?.employee_name || null,
  }))
}

export interface ScannedEquipmentResult {
  equipment_id: string
  equipment_code: string
  display_name: string
  equipment_type: string
  device_status: string | null
  usage_status: string | null
  current_rack_layer_id: string | null
  current_layer_code: string | null
  current_rack_code: string | null
  current_rack_name: string | null
  current_zone_code: string | null
  current_location_in_factory: string | null
  company_id: string | null
  owner_company_name: string | null
  keeper_company_id: string | null
  keeper_company_name: string | null
}

export interface ScannedLayerResult {
  layer_id: string
  layer_code: string
  layer_number: number
  rack_id: string
  rack_code: string
  rack_code_new: string
  rack_name: string
  zone_code: string
  location_in_factory: string
  equipment_count: number
}

export type ScannedQRResolution =
  | { type: 'EQUIPMENT'; data: ScannedEquipmentResult }
  | { type: 'LAYER'; data: ScannedLayerResult }
  | { type: 'UNKNOWN'; raw: string; error?: string }

export async function resolveScannedQRCode(rawPayload: string): Promise<ScannedQRResolution> {
  const payload = rawPayload.trim()
  if (!payload) {
    return { type: 'UNKNOWN', raw: rawPayload, error: 'Empty payload' }
  }

  const supabase = await createClient()

  // 1. Kiểm tra UUID pattern trước (cả trong URL và chuỗi trần)
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  const uuidMatch = payload.match(uuidRegex)
  if (uuidMatch) {
    const matchedUuid = uuidMatch[0]
    const { data: eqData, error: eqErr } = await supabase
      .from('equipment')
      .select(`
        equipment_id,
        equipment_code,
        display_name,
        equipment_type,
        device_status,
        usage_status,
        current_rack_layer_id,
        company_id,
        keeper_company_id,
        owner:companies!equipment_company_id_fkey(company_name),
        keeper:companies!equipment_keeper_company_id_fkey(company_name),
        rack_layers(
          id,
          layer_number,
          layer_code,
          racks(
            id,
            rack_code,
            rack_code_new,
            rack_name,
            zone_code,
            location_in_factory
          )
        )
      `)
      .or(`equipment_id.eq.${matchedUuid},qr_uuid.eq.${matchedUuid}`)
      .maybeSingle()

    if (!eqErr && eqData) {
      const rl: any = eqData.rack_layers
      const rk: any = rl?.racks
      return {
        type: 'EQUIPMENT',
        data: {
          equipment_id: eqData.equipment_id,
          equipment_code: eqData.equipment_code,
          display_name: eqData.display_name,
          equipment_type: eqData.equipment_type,
          device_status: eqData.device_status,
          usage_status: eqData.usage_status,
          current_rack_layer_id: eqData.current_rack_layer_id,
          current_layer_code: rl?.layer_code || null,
          current_rack_code: rk?.rack_code_new || rk?.rack_code || null,
          current_rack_name: rk?.rack_name || null,
          current_zone_code: rk?.zone_code || null,
          current_location_in_factory: rk?.location_in_factory || null,
          company_id: eqData.company_id,
          owner_company_name: (eqData.owner as any)?.company_name || null,
          keeper_company_id: eqData.keeper_company_id,
          keeper_company_name: (eqData.keeper as any)?.company_name || null,
        },
      }
    }
  }

  // 2. Kiểm tra Rack Layer Code (/^[A-Z0-9]{2}-\d{2}-L\d+$/i)
  const layerRegex = /^[A-Z0-9]{2}-\d{2}-L\d+$/i
  if (layerRegex.test(payload)) {
    const { data: layerData, error: layerErr } = await supabase
      .from('rack_layers')
      .select(`
        id,
        layer_number,
        layer_code,
        racks(
          id,
          rack_code,
          rack_code_new,
          rack_name,
          zone_code,
          location_in_factory
        )
      `)
      .ilike('layer_code', payload)
      .maybeSingle()

    if (!layerErr && layerData) {
      const rk: any = layerData.racks
      const { count } = await supabase
        .from('equipment')
        .select('*', { count: 'exact', head: true })
        .eq('current_rack_layer_id', layerData.id)

      return {
        type: 'LAYER',
        data: {
          layer_id: layerData.id,
          layer_code: layerData.layer_code,
          layer_number: layerData.layer_number,
          rack_id: rk?.id || '',
          rack_code: rk?.rack_code || '',
          rack_code_new: rk?.rack_code_new || '',
          rack_name: rk?.rack_name || '',
          zone_code: rk?.zone_code || '',
          location_in_factory: rk?.location_in_factory || '',
          equipment_count: count || 0,
        },
      }
    }
  }

  // 3. Kiểm tra Short Code (/^[MCPWBSF]-[A-Z0-9_\-]+$/i) hoặc mã thiết bị
  let targetCode = payload
  const shortCodeRegex = /^[MCPWBSF]-([A-Z0-9_\-]+)$/i
  const shortMatch = payload.match(shortCodeRegex)
  if (shortMatch) {
    targetCode = shortMatch[1]
  }

  // Truy vấn tìm equipment theo targetCode hoặc nguyên payload
  const { data: codeEqData, error: codeEqErr } = await supabase
    .from('equipment')
    .select(`
      equipment_id,
      equipment_code,
      display_name,
      equipment_type,
      device_status,
      usage_status,
      current_rack_layer_id,
      company_id,
      keeper_company_id,
      owner:companies!equipment_company_id_fkey(company_name),
      keeper:companies!equipment_keeper_company_id_fkey(company_name),
      rack_layers(
        id,
        layer_number,
        layer_code,
        racks(
          id,
          rack_code,
          rack_code_new,
          rack_name,
          zone_code,
          location_in_factory
        )
      )
    `)
    .or(`equipment_code.ilike.${targetCode},equipment_code.ilike.${payload}`)
    .maybeSingle()

  if (!codeEqErr && codeEqData) {
    const rl: any = codeEqData.rack_layers
    const rk: any = rl?.racks
    return {
      type: 'EQUIPMENT',
      data: {
        equipment_id: codeEqData.equipment_id,
        equipment_code: codeEqData.equipment_code,
        display_name: codeEqData.display_name,
        equipment_type: codeEqData.equipment_type,
        device_status: codeEqData.device_status,
        usage_status: codeEqData.usage_status,
        current_rack_layer_id: codeEqData.current_rack_layer_id,
        current_layer_code: rl?.layer_code || null,
        current_rack_code: rk?.rack_code_new || rk?.rack_code || null,
        current_rack_name: rk?.rack_name || null,
        current_zone_code: rk?.zone_code || null,
        current_location_in_factory: rk?.location_in_factory || null,
        company_id: codeEqData.company_id,
        owner_company_name: (codeEqData.owner as any)?.company_name || null,
        keeper_company_id: codeEqData.keeper_company_id,
        keeper_company_name: (codeEqData.keeper as any)?.company_name || null,
      },
    }
  }

  // 4. Fallback: không tìm thấy
  return {
    type: 'UNKNOWN',
    raw: payload,
  }
}

