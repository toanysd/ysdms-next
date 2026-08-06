export interface MoldOrDesignCategoryInput {
  design_category?: string | null
  mold_type?: string | null
  sub_type?: string | null
  design_code?: string | null
  equipment_code?: string | null
  display_name?: string | null
}

export interface DesignStatusItem {
  revision_id: string
  status?: string | null
  design_category?: string | null
  parent_design_id?: string | null
  design_code?: string | null
}

/**
 * Extracts base mass production design code by stripping 'D' indicator (e.g. MTM195DR1 -> MTM195R1, MTM195R1D -> MTM195R1)
 */
export function extractBaseMassCode(code: string | null | undefined): string {
  if (!code) return ''
  const trimmed = code.trim().toUpperCase().replace(/[\s\-_]/g, '')
  let base = trimmed.replace(/(?<=\d)D(?=R\d+)/, '')
  base = base.replace(/(?<=R\d+)D$/, '')
  base = base.replace(/(?<=\d)D$/, '')
  return base
}

/**
 * Robustly checks whether a mold or design revision represents a Prototype (試作ポケット)
 * vs Mass Production (正規).
 */
export function isPrototypeDesignOrMold(item: MoldOrDesignCategoryInput): boolean {
  if (!item) return false

  // 1. Explicit DB classification check (Highest Priority)
  const category = String(item.design_category || item.sub_type || item.mold_type || '').toUpperCase().trim()
  if (['PROTOTYPE_POCKET', 'PROTOTYPE', '試作ポケット', 'D'].includes(category)) {
    return true
  }
  if (['MASS_PRODUCTION', 'REGULAR', '正規', 'M'].includes(category)) {
    return false
  }

  // 2. Legacy Naming Convention Parsing
  const code = String(item.design_code || item.equipment_code || item.display_name || '').trim()
  if (!code) return false

  const suffix = code.replace(/^[A-Za-z]+[-_]?\d+/, '')
  if (suffix && suffix !== code) {
    return /\bD\b|(?<=[R\d])D|D(?=[R\s\-_]|$)/i.test(suffix)
  }

  return /(?:-D|-00D|D\s*R\d+|R\d+D|\b試作\b)/i.test(code)
}

/**
 * Computes effective design status
 */
export function getEffectiveDesignStatus(item: DesignStatusItem, allRevs: DesignStatusItem[] = []): string {
  if (!item) return 'PENDING_APPROVAL'
  const rawStatus = (item.status || 'PENDING_APPROVAL').toUpperCase().trim()

  if (['SUPERSEDED', 'REJECTED', 'PENDING_APPROVAL'].includes(rawStatus)) {
    return rawStatus
  }

  if (rawStatus === 'APPROVED' && isPrototypeDesignOrMold(item)) {
    const isParentOfMass = allRevs.some(r => !isPrototypeDesignOrMold(r) && (r.parent_design_id === item.revision_id || extractBaseMassCode(r.design_code) === extractBaseMassCode(item.design_code)))
    if (!isParentOfMass && item.parent_design_id && allRevs.some(r => r.revision_id === item.parent_design_id)) {
      return 'SUPERSEDED'
    }
  }

  return rawStatus
}

export function getDesignStatusBadgeInfo(status: string): { label: string; badgeClass: string; icon: string } {
  const st = (status || '').toUpperCase().trim()
  switch (st) {
    case 'APPROVED':
      return { label: '🟢 承認済', badgeClass: 'badge badge--success', icon: '🟢' }
    case 'PENDING_APPROVAL':
      return { label: '🟡 承認待ち', badgeClass: 'badge badge--warning', icon: '🟡' }
    case 'REJECTED':
      return { label: '🔴 不採用', badgeClass: 'badge badge--error', icon: '🔴' }
    case 'SUPERSEDED':
    default:
      return { label: '⚪ 舊版', badgeClass: 'badge badge--neutral', icon: '⚪' }
  }
}

/**
 * Formats cutter equipment code into standard Cutter No. format ("No.1042", "No.JAE MW42")
 */
export function formatCutterDisplayCode(code: string | null | undefined): string {
  if (!code) return '—'
  const trimmed = code.trim()
  if (/^CT[\-_ ]/i.test(trimmed)) {
    return trimmed.replace(/^CT[\-_ ]/i, 'No.')
  }
  if (/^CT(?=[A-Z0-9])/i.test(trimmed) && trimmed.length > 2 && !trimmed.toLowerCase().startsWith('no.')) {
    return trimmed.replace(/^CT/i, 'No.')
  }
  if (!trimmed.toLowerCase().startsWith('no.')) {
    return `No.${trimmed}`
  }
  return trimmed
}

/**
 * Formats physical mold code into compact code format ("TDW001R3", "TDW001DR3")
 */
export function formatMoldDisplayCode(code: string | null | undefined, designCode?: string | null): string {
  if (designCode) return designCode.trim()
  if (!code) return '—'
  const trimmed = code.trim()
  if (/^[A-Za-z]+[-_]?\d+[\s-_]?[A-Za-z]*\d*$/i.test(trimmed)) {
    return trimmed.replace(/[\s\-_]/g, '')
  }
  return trimmed
}

/**
 * Formats Rack and Layer location into standard display string:
 * - Legacy format: RackID-LayerNumber (e.g. 71-1, 70-0)
 * - Zone format: Zone-RackNo-LayerNo (e.g. OFF-17-1, M08-01-1)
 */
export function formatRackLocationDisplay(rl: any): string {
  if (!rl) return '—'

  const rawRack = String(rl.racks?.rack_code || rl.rack_code || rl.rack_name || '').trim()
  if (!rawRack || rawRack === '未確認' || rawRack === '—') return '—'

  let cleanRack = rawRack.replace(/[\u2460-\u2473]/g, m => String(m.charCodeAt(0) - 0x245f))
  cleanRack = cleanRack.replace(/[\u3251-\u325f]/g, m => String(m.charCodeAt(0) - 0x3250))

  let layerStr = ''
  if (rl.layer_number != null && rl.layer_number !== '' && !isNaN(Number(rl.layer_number))) {
    layerStr = String(rl.layer_number).trim()
  } else if (rl.layer_code) {
    const rawLayer = String(rl.layer_code).trim()
    const match = rawLayer.match(/(?:LAYER-)?\d*?(\d)$/i)
    if (match) {
      layerStr = match[1]
    } else {
      layerStr = rawLayer.replace(/^LAYER-/i, '')
    }
  }

  if (cleanRack && layerStr) {
    return `${cleanRack}-${layerStr}`
  }

  return cleanRack || layerStr || '—'
}

/**
 * Formats standard design cutline specification string from design revision
 */
export function formatCutlineSpecString(rev: any): string {
  if (!rev) return '—'
  let length = rev.cutline_length || rev.design_length || null
  let width = rev.cutline_width || rev.design_width || null
  let cornerR = rev.corner_r || null
  let chamferC = rev.chamfer_c || null

  if (!length && !width) {
    const str = String(rev.tray_info || rev.customer_tray_name || rev.version_note || '')
    const match = str.match(/(\d+)\s*[x×]\s*(\d+)(?:[^\d]*(\d+)\s*R)?(?:[^\d]*(\d+)\s*C)?/i)
    if (match) {
      length = match[1]
      width = match[2]
      if (match[3] && !cornerR) cornerR = match[3]
      if (match[4] && !chamferC) chamferC = match[4]
    }
  }

  if (!length && !width) return '—'

  let spec = `${length || '—'} × ${width || '—'}`

  if (cornerR) {
    const cleanR = String(cornerR).replace(/[^0-9.]/g, '')
    if (cleanR) spec += ` - 2R${cleanR}`
  }

  if (chamferC) {
    const cleanC = String(chamferC).replace(/[^0-9.]/g, '')
    if (cleanC) spec += ` - 2C${cleanC}`
  }

  return spec
}

/**
 * Formats cutter physical specification string in standard YSD format
 */
export function formatCutterSpecString(item: any, activeRev?: any): string {
  if (!item && !activeRev) return '—'
  const target = item || activeRev || {}
  let length = target.actual_length_mm || target.cutter_length_mm || target.cutline_length || activeRev?.cutline_length || activeRev?.design_length || null
  let width = target.actual_width_mm || target.cutter_width_mm || target.cutline_width || activeRev?.cutline_width || activeRev?.design_width || null
  let cornerR = target.corner_r || activeRev?.corner_r || null
  let chamferC = target.chamfer_c || activeRev?.chamfer_c || null

  if (!length && !width) {
    const str = String(target.dimensions || target.display_name || target.cutter_name || target.cutter_no || '')
    const match = str.match(/(\d+)\s*[x×]\s*(\d+)(?:[^\d]*(\d+)\s*R)?(?:[^\d]*(\d+)\s*C)?/i)
    if (match) {
      length = match[1]
      width = match[2]
      if (match[3] && !cornerR) cornerR = match[3]
      if (match[4] && !chamferC) chamferC = match[4]
    }
  }

  if (!length && !width) return '—'
  
  let spec = `${length || '—'} × ${width || '—'}`
  
  if (cornerR) {
    const cleanR = String(cornerR).replace(/[^0-9.]/g, '')
    if (cleanR) spec += ` - 2R${cleanR}`
  }

  if (chamferC) {
    const cleanC = String(chamferC).replace(/[^0-9.]/g, '')
    if (cleanC) spec += ` - 2C${cleanC}`
  }

  return spec
}
