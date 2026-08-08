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

export interface CutlineSpecsResult {
  length: string | null
  width: string | null
  cornerR: string | null
  chamferC: string | null
  formatted: string
}

export interface CavTypeResult {
  code: string
  canonicalName: string
  badgeLabel: string
  length: number
  width: number
  notes?: string
}

export const YSD_CAV_MASTER = [
  { code: 'A-74B', length: 470, width: 300, notes: '' },
  { code: 'B', length: 335, width: 265, notes: '' },
  { code: 'C-74F', length: 499, width: 347, notes: '' },
  { code: 'D', length: 354, width: 300, notes: '' },
  { code: 'E', length: 430, width: 260, notes: '' },
  { code: 'F', length: 340, width: 285, notes: '' },
  { code: 'G', length: 320, width: 195, notes: '' },
  { code: 'H', length: 300, width: 246, notes: '' },
  { code: 'I', length: 405, width: 300, notes: '' },
  { code: 'J', length: 338, width: 175, notes: '' },
  { code: 'K', length: 503, width: 273, notes: '' },
  { code: 'L', length: 416, width: 336, notes: '' },
  { code: 'M', length: 500, width: 330, notes: '' },
  { code: 'O', length: 420, width: 220, notes: '' },
  { code: 'P', length: 443, width: 246, notes: '' },
  { code: 'Q', length: 310, width: 210, notes: '' },
  { code: 'R', length: 310, width: 240, notes: '' },
  { code: 'S', length: 385, width: 265, notes: '' },
  { code: 'T', length: 390, width: 330, notes: '' },
  { code: 'U', length: 498, width: 245, notes: '' },
  { code: 'V', length: 355, width: 240, notes: '' },
  { code: 'W', length: 492, width: 270, notes: '' },
  { code: 'Y', length: 435, width: 312, notes: '' },
  { code: 'Z', length: 355, width: 260, notes: '' },
  { code: 'ZA-74A', length: 460, width: 330, notes: '' },
  { code: 'ZB', length: 355, width: 347, notes: '' },
  { code: 'ZC', length: 515, width: 347, notes: '' },
  { code: 'ZD-74C', length: 470, width: 347, notes: '' },
  { code: 'ZE', length: 370, width: 320, notes: '' },
  { code: 'ZF', length: 300, width: 285, notes: '' },
  { code: 'ZG', length: 499, width: 253, notes: '' },
  { code: 'ZH', length: 385, width: 290, notes: '' },
  { code: '74A-ZA', length: 460, width: 330, notes: '' },
  { code: '74B-A', length: 470, width: 300, notes: '' },
  { code: '74C-ZD', length: 470, width: 347, notes: '' },
  { code: '74D', length: 470, width: 400, notes: '' },
  { code: '74E', length: 470, width: 450, notes: '' },
  { code: '74F-C', length: 499, width: 347, notes: '' },
  { code: '74G', length: 530, width: 380, notes: '' },
  { code: '74H', length: 585, width: 285, notes: '' },
  { code: '74I', length: 590, width: 350, notes: '' },
  { code: '74J', length: 590, width: 400, notes: '' },
  { code: '74K', length: 590, width: 450, notes: '' },
  { code: '74L', length: 640, width: 405, notes: '' },
  { code: '74M', length: 560, width: 360, notes: '' },
  { code: '74N', length: 620, width: 310, notes: '' },
  { code: '74O', length: 590, width: 300, notes: '' },
  { code: 'NICHI53b', length: 470, width: 300, notes: '日三化成' },
  { code: 'NICHI74C-1', length: 470, width: 300, notes: '日三化成' },
  { code: 'NICHI74C-2', length: 520, width: 370, notes: '日三化成' },
  { code: 'NICHI74C-3', length: 585, width: 310, notes: '日三化成' },
  { code: 'NCHI74C-4', length: 620, width: 310, notes: '日三化成' },
  { code: 'YMS', length: 620, width: 250, notes: '茨城工場' },
  { code: 'MTM-178', length: 440, width: 210, notes: '' },
  { code: 'A-74B', length: 469, width: 299, notes: '470ｘ300から改造' }
]

export function lookupCavType(lengthInput: any, widthInput: any): CavTypeResult | null {
  if (!lengthInput || !widthInput) return null
  const l = typeof lengthInput === 'number' ? lengthInput : parseFloat(String(lengthInput).replace(/[^0-9.]/g, ''))
  const w = typeof widthInput === 'number' ? widthInput : parseFloat(String(widthInput).replace(/[^0-9.]/g, ''))
  if (isNaN(l) || isNaN(w) || l <= 0 || w <= 0) return null

  let best: typeof YSD_CAV_MASTER[0] | null = null
  let minDiff = Infinity

  for (const c of YSD_CAV_MASTER) {
    const diffDirect = Math.abs(l - c.length) + Math.abs(w - c.width)
    const diffSwap = Math.abs(l - c.width) + Math.abs(w - c.length)
    const diff = Math.min(diffDirect, diffSwap)

    if (diff <= 5 && diff < minDiff) {
      minDiff = diff
      best = c
    }
  }

  if (best) {
    let canonical = best.code
    let badgeLabel = best.code
    if (best.code.includes('A')) {
      canonical = `Type A (${best.code})`
      badgeLabel = 'CAV A'
    } else if (best.code.includes('ZD')) {
      canonical = `Type ZD (${best.code})`
      badgeLabel = 'CAV ZD'
    } else if (best.code.includes('ZA')) {
      canonical = `Type ZA (${best.code})`
      badgeLabel = 'CAV ZA'
    } else {
      canonical = `Type ${best.code}`
      badgeLabel = `CAV ${best.code}`
    }

    return {
      code: best.code,
      canonicalName: canonical,
      badgeLabel: badgeLabel,
      length: best.length,
      width: best.width,
      notes: best.notes
    }
  }

  return null
}

/**
 * Formats Corner R value accurately without corrupting counts (e.g. '3R15', '4R10', '2R8', '15' -> 'R15')
 */
export function formatCornerRDisplay(val: any): string | null {
  if (val == null) return null
  const str = String(val).trim()
  if (!str || str === '0' || str === '0.0') return null
  if (/^[0-9]*[RC]/i.test(str)) return str
  if (/^[0-9.]+$/.test(str)) return `R${str}`
  return str
}

/**
 * Formats Chamfer C value accurately (e.g. 'C20', '2C8', '20' -> 'C20')
 */
export function formatChamferCDisplay(val: any): string | null {
  if (val == null) return null
  const str = String(val).trim()
  if (!str || str === '0' || str === '0.0') return null
  if (/^[0-9]*C/i.test(str)) return str
  if (/^[0-9.]+$/.test(str)) return `C${str}`
  return str
}

/**
 * Reads cutline specs DIRECTLY from structured DB columns only.
 * RULE-DATA-01: No text parsing, no fallback from physical dimensions.
 * Compact format: 530×350-3R15-C20
 * 
 * Accepted columns: cutline_length, cutline_width, corner_r, chamfer_c
 * (from design_revisions or cutters table)
 */
export function getCutlineSpecs(input: any): CutlineSpecsResult {
  const empty: CutlineSpecsResult = { length: null, width: null, cornerR: null, chamferC: null, formatted: '—' }
  if (!input) return empty

  const length = input.cutline_length != null && input.cutline_length !== '' ? String(input.cutline_length) : null
  const width = input.cutline_width != null && input.cutline_width !== '' ? String(input.cutline_width) : null
  const cornerR = formatCornerRDisplay(input.corner_r)
  const chamferC = formatChamferCDisplay(input.chamfer_c)

  if (!length && !width) {
    return { length: null, width: null, cornerR, chamferC, formatted: '—' }
  }

  let formatted = `${length || '?'}×${width || '?'}`

  if (cornerR) {
    formatted += `-${cornerR}`
  }

  if (chamferC) {
    formatted += `-${chamferC}`
  }

  return { length, width, cornerR, chamferC, formatted }
}

/** @deprecated Use getCutlineSpecs() instead. Kept for backward compatibility during migration. */
export function parseCutlineSpecs(input: any): CutlineSpecsResult {
  return getCutlineSpecs(input)
}

/**
 * Formats cutline spec string from design revision data.
 * RULE-DATA-01: Reads ONLY cutline_length, cutline_width, corner_r, chamfer_c columns.
 */
export function formatCutlineSpecString(rev: any): string {
  return getCutlineSpecs(rev).formatted
}

/**
 * Formats cutter spec string — reads from design_revisions via FK.
 * RULE-DATA-01: cutline specs come from design_revisions, not cutter physical dimensions.
 */
export function formatCutterSpecString(item: any, activeRev?: any): string {
  // Priority: design revision (canonical source), then cutter's own cutline columns
  return getCutlineSpecs(activeRev || item).formatted
}

/**
 * Builds wildcard ILIKE patterns for search queries, automatically stripping hyphens, spaces, and underscores.
 * E.g.: "SSM032" -> ["%SSM032%", "%SSM%032%"] (matches "SSM-032" and "SSM032")
 *       "JAE-345" -> ["%JAE-345%", "%JAE%345%"] (matches "JAE-345" and "JAE345")
 */
export function buildFuzzyPatterns(trimmed: string): string[] {
  if (!trimmed) return []
  const clean = trimmed.replace(/[%_]/g, '')
  const compact = clean.replace(/[\s\-_]/g, '')
  const chunks = compact.match(/[a-zA-Z]+|\d+/g)

  const patterns = new Set<string>()
  patterns.add(`%${clean}%`)
  if (chunks && chunks.length > 1) {
    patterns.add(`%${chunks.join('%')}%`)
  } else if (compact) {
    patterns.add(`%${compact}%`)
  }
  return Array.from(patterns)
}
