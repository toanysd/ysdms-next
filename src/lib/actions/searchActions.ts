'use server'

import { createClient } from '@/lib/supabase/server'

export type SearchableItemType = 'mold' | 'cutter'

export interface SearchableItem {
  id: string
  itemType: SearchableItemType
  code: string
  name: string
  displayCode: string
  displayName: string
  displayDimensions: string
  displayLocation: string
  cavid?: string
  pieceCount?: number
  keeperCompany?: string
  usageStatus?: string
  deviceStatus?: string
  material?: string
  baseId?: string
  cutterType?: string
  bladeCount?: string
  plasticCutType?: string
  pitch?: number
  searchableText: string
}

export async function fetchAllSearchableItems(): Promise<SearchableItem[]> {
  const supabase = await createClient()

  // 1. Fetch Molds from equipment table
  const { data: molds } = await supabase
    .from('equipment')
    .select(`
      equipment_id,
      equipment_code,
      display_name,
      device_status,
      keeper_company_id,
      companies!equipment_keeper_company_id_fkey ( company_name ),
      design_revisions (
        cavity_count, design_length, design_width, design_height, plastic_type_designed, tray_info,
        products (
          product_id, product_code, product_name_internal
        )
      )
    `)
    .in('equipment_type', ['MOLD', 'WATER_BASE', 'PRESSURE_BASE'])

  // 2. Fetch Cutters from equipment table
  const { data: cutters } = await supabase
    .from('equipment')
    .select(`
      equipment_id, equipment_code, display_name, sub_type, piece_count, usage_status, notes, actual_length_mm, actual_width_mm
    `)
    .in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE'])

  const items: SearchableItem[] = []

  if (molds) {
    molds.forEach((m: any) => {
      const design = m.design_revisions
      const base = design?.products
      const code = m.equipment_code || base?.product_code || 'UNKNOWN'
      const name = m.display_name || base?.product_name_internal || ''
      const dims = [design?.design_length, design?.design_width, design?.design_height].filter(Boolean).join('x')
      const keeperName = m.companies?.company_name || '—'
      
      const searchableFields = [
        code, name, keeperName, m.device_status,
        design?.plastic_type_designed, design?.tray_info
      ].filter(Boolean).join(' ').toLowerCase()

      items.push({
        id: m.equipment_id,
        itemType: 'mold',
        code: code,
        name: name,
        displayCode: code,
        displayName: name,
        displayDimensions: dims ? `${dims} mm` : '',
        displayLocation: keeperName,
        pieceCount: design?.cavity_count ? Number(design.cavity_count) : undefined,
        keeperCompany: keeperName,
        deviceStatus: m.device_status || undefined,
        baseId: base?.product_id,
        searchableText: searchableFields
      })
    })
  }

  if (cutters) {
    cutters.forEach((c: any) => {
      const dims = [c.actual_length_mm, c.actual_width_mm].filter(Boolean).join('x')
      
      const searchableFields = [
        c.equipment_code, c.display_name, c.sub_type, c.usage_status, c.notes
      ].filter(Boolean).join(' ').toLowerCase()

      items.push({
        id: c.equipment_id,
        itemType: 'cutter',
        code: c.equipment_code,
        name: c.display_name || '',
        displayCode: c.equipment_code,
        displayName: c.display_name || '',
        displayDimensions: dims ? `${dims} mm` : '',
        displayLocation: '',
        cutterType: c.sub_type || undefined,
        bladeCount: c.piece_count ? String(c.piece_count) : undefined,
        usageStatus: c.usage_status || undefined,
        searchableText: searchableFields
      })
    })
  }

  return items
}
