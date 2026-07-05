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

  // 1. Fetch Molds
  const { data: molds } = await supabase
    .from('physical_molds')
    .select(`
      physical_mold_id,
      system_code,
      display_name,
      device_status,
      keeper_company_id,
      companies ( company_name ),
      mold_revisions (
        revision_name,
        design_revisions (
          cavity_count, design_length, design_width, design_height, plastic_type_designed, tray_info
        ),
        products (
          product_id, product_code, product_name_internal
        )
      )
    `)

  // 2. Fetch Cutters
  const { data: cutters } = await supabase
    .from('cutters')
    .select(`
      cutter_id, cutter_no, cutter_name, cutter_type, cavity_count, pitch_mm, usage_status, notes, cutter_length_mm, cutter_width_mm
    `)

  const items: SearchableItem[] = []

  if (molds) {
    molds.forEach((m: any) => {
      const rev = m.mold_revisions
      const base = rev?.products
      const design = rev?.design_revisions
      const code = m.system_code || base?.product_code || 'UNKNOWN'
      const name = m.display_name || base?.product_name_internal || ''
      const dims = [design?.design_length, design?.design_width, design?.design_height].filter(Boolean).join('x')
      const keeperName = m.companies?.company_name || 'Chưa định vị'
      
      const searchableFields = [
        code, name, keeperName, m.device_status,
        design?.plastic_type_designed, design?.tray_info
      ].filter(Boolean).join(' ').toLowerCase()

      items.push({
        id: m.physical_mold_id,
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
      const dims = [c.cutter_length_mm, c.cutter_width_mm].filter(Boolean).join('x')
      
      const searchableFields = [
        c.cutter_no, c.cutter_name, c.cutter_type, c.usage_status, c.notes
      ].filter(Boolean).join(' ').toLowerCase()

      items.push({
        id: c.cutter_id,
        itemType: 'cutter',
        code: c.cutter_no,
        name: c.cutter_name || '',
        displayCode: c.cutter_no,
        displayName: c.cutter_name || '',
        displayDimensions: dims ? `${dims} mm` : '',
        displayLocation: '',
        cutterType: c.cutter_type || undefined,
        bladeCount: c.cavity_count || undefined,
        pitch: c.pitch_mm || undefined,
        usageStatus: c.usage_status || undefined,
        searchableText: searchableFields
      })
    })
  }

  return items
}
