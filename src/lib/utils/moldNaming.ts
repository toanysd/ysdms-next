export interface MoldOrDesignCategoryInput {
  design_category?: string | null
  mold_type?: string | null
  sub_type?: string | null
  design_code?: string | null
  equipment_code?: string | null
  display_name?: string | null
}

/**
 * Robustly checks whether a mold or design revision represents a Prototype (試作ポケット)
 * vs Mass Production (正規).
 *
 * 1. Prioritizes explicit DB fields (design_category, sub_type, mold_type)
 * 2. Parses code naming convention fallback by stripping client prefix & sequence number,
 *    checking for 'D' (試作ポケット) strictly in the suffix position.
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

  // Strip client prefix and product numeric sequence (e.g. "TDW001R3" -> "R3", "TDW-001D R2" -> "D R2")
  const suffix = code.replace(/^[A-Za-z]+[-_]?\d+/, '')
  if (suffix && suffix !== code) {
    // Check if remaining suffix contains D as a standalone mold type indicator or attached to R
    return /\bD\b|(?<=[R\d])D|D(?=[R\s\-_]|$)/i.test(suffix)
  }

  // Generic fallback if code doesn't match standard prefix-number structure
  return /(?:-D|-00D|D\s*R\d+|R\d+D|\b試作\b)/i.test(code)
}
