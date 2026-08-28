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

  const code = String(item.design_code || item.equipment_code || item.display_name || '').trim().toUpperCase()
  const name = String(item.display_name || '').trim().toUpperCase()
  const category = String(item.design_category || item.sub_type || item.mold_type || '').toUpperCase().trim()

  // 1. Code-based check (Highest Priority for Legacy Access Data)
  // Detect prototype D suffix: PNS-012D, MTM195DR1, MMT-021-D, R0-D, ADY071-D
  if (code) {
    // Use extractBaseMassCode: if stripping D changes the code, it has a prototype D suffix
    const normalized = code.replace(/[\s\-_]/g, '')
    const stripped = extractBaseMassCode(code)
    if (stripped && stripped !== normalized) {
      return true
    }
    // Explicit suffix patterns
    if (
      code.endsWith('-D') ||
      code.endsWith('_D') ||
      code.includes('-D-') ||
      code.includes('_D_') ||
      code.includes(' R0-D') ||
      code.includes('-D ')
    ) {
      return true
    }
  }

  // 2. Name-based check (Japanese keywords)
  if (name.includes('試作') || name.includes('PROTOTYPE')) {
    return true
  }

  // 3. Explicit DB classification check
  if (['PROTOTYPE_POCKET', 'PROTOTYPE', '試作ポケット'].includes(category)) {
    // Double-check: if code is standard (e.g. MMT-021 R0 without -D suffix and without 試作 in name),
    // it was wrongfully assigned PROTOTYPE_POCKET by the previous bug!
    if (code && !code.includes('D') && !name.includes('試作')) {
      return false
    }
    return true
  }

  return false
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
  // ── STANDARD (32 mã: A → ZH) ─────────────────────────
  { code: 'A',    length: 470, width: 300, series: 'C6',  alias: '74B',  notes: '' },
  { code: 'B',    length: 335, width: 265, series: 'PS',  alias: null,   notes: '' },
  { code: 'C',    length: 499, width: 347, series: 'JR',  alias: '74F',  notes: '' },
  { code: 'D',    length: 354, width: 300, series: 'C3',  alias: null,   notes: '' },
  { code: 'E',    length: 430, width: 260, series: null,  alias: null,   notes: '' },
  { code: 'F',    length: 340, width: 285, series: null,  alias: null,   notes: '' },
  { code: 'G',    length: 320, width: 195, series: null,  alias: null,   notes: '' },
  { code: 'H',    length: 300, width: 246, series: null,  alias: null,   notes: '' },
  { code: 'I',    length: 405, width: 300, series: null,  alias: null,   notes: '' },
  { code: 'J',    length: 338, width: 175, series: null,  alias: null,   notes: '' },
  { code: 'K',    length: 503, width: 273, series: 'HK',  alias: null,   notes: '' },
  { code: 'L',    length: 416, width: 336, series: null,  alias: null,   notes: '' },
  { code: 'M',    length: 500, width: 330, series: null,  alias: null,   notes: '' },
  { code: 'O',    length: 420, width: 220, series: null,  alias: null,   notes: '' },
  { code: 'P',    length: 443, width: 246, series: null,  alias: null,   notes: '' },
  { code: 'Q',    length: 310, width: 210, series: null,  alias: null,   notes: '' },
  { code: 'R',    length: 310, width: 240, series: null,  alias: null,   notes: '' },
  { code: 'S',    length: 385, width: 265, series: 'SMK', alias: null,   notes: '' },
  { code: 'T',    length: 390, width: 330, series: null,  alias: null,   notes: '' },
  { code: 'U',    length: 498, width: 245, series: 'SLK', alias: null,   notes: '' },
  { code: 'V',    length: 355, width: 240, series: null,  alias: null,   notes: '' },
  { code: 'W',    length: 492, width: 270, series: '2C',  alias: null,   notes: '' },
  { code: 'Y',    length: 435, width: 312, series: null,  alias: null,   notes: '' },
  { code: 'Z',    length: 355, width: 260, series: null,  alias: null,   notes: '' },
  { code: 'ZA',   length: 460, width: 330, series: null,  alias: '74A',  notes: '' },
  { code: 'ZB',   length: 355, width: 347, series: null,  alias: null,   notes: '' },
  { code: 'ZC',   length: 515, width: 347, series: null,  alias: null,   notes: '' },
  { code: 'ZD',   length: 470, width: 347, series: null,  alias: '74C',  notes: '' },
  { code: 'ZE',   length: 370, width: 320, series: 'NEC', alias: null,   notes: '' },
  { code: 'ZF',   length: 300, width: 285, series: 'JAE', alias: null,   notes: '' },
  { code: 'ZG',   length: 499, width: 353, series: null,  alias: null,   notes: '' },
  { code: 'ZH',   length: 385, width: 290, series: null,  alias: null,   notes: '' },
  // ── 74C (15 mã: 74A → 74O) ───────────────────────────
  { code: '74A',  length: 460, width: 330, series: null,  alias: 'ZA',   notes: '' },
  { code: '74B',  length: 470, width: 300, series: null,  alias: 'A',    notes: '' },
  { code: '74C',  length: 470, width: 347, series: null,  alias: 'ZD',   notes: '' },
  { code: '74D',  length: 470, width: 400, series: null,  alias: null,   notes: '' },
  { code: '74E',  length: 470, width: 450, series: null,  alias: null,   notes: '' },
  { code: '74F',  length: 499, width: 347, series: null,  alias: 'C',    notes: '' },
  { code: '74G',  length: 530, width: 380, series: null,  alias: null,   notes: '' },
  { code: '74H',  length: 585, width: 285, series: 'JAE', alias: null,   notes: '' },
  { code: '74I',  length: 590, width: 350, series: null,  alias: null,   notes: '' },
  { code: '74J',  length: 590, width: 400, series: null,  alias: null,   notes: '' },
  { code: '74K',  length: 590, width: 450, series: null,  alias: null,   notes: '' },
  { code: '74L',  length: 640, width: 405, series: 'KIK', alias: null,   notes: '' },
  { code: '74M',  length: 560, width: 360, series: 'TDK', alias: null,   notes: '' },
  { code: '74N',  length: 620, width: 310, series: 'TE',  alias: null,   notes: '' },
  { code: '74O',  length: 590, width: 300, series: 'DIC', alias: null,   notes: '' },
  // ── 日三化成 NICHI (5 mã) ─────────────────────────────
  { code: 'NICHI-53B',   length: 470, width: 300, series: '日三化成', alias: null, notes: '53b用' },
  { code: 'NICHI-74C-1', length: 470, width: 300, series: '日三化成', alias: null, notes: '74C用' },
  { code: 'NICHI-74C-2', length: 520, width: 370, series: '日三化成', alias: null, notes: '74C用' },
  { code: 'NICHI-74C-3', length: 585, width: 310, series: '日三化成', alias: null, notes: '74C用' },
  { code: 'NICHI-74C-4', length: 620, width: 310, series: '日三化成', alias: null, notes: '74C用' },
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
    const canonical = `Type ${best.code}`
    const badgeLabel = `CAV ${best.code}`

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
