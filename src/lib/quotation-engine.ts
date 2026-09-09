/**
 * YSDMS NextGen — Quotation Pricing Engine (Báo Giá Khuôn & Khay Nhựa)
 * Calculates tooling costs (molds, cutters, plugs) and thermoforming tray unit prices
 * based on CAD technical specifications (design_revisions) and YSD standard lookup tables.
 *
 * M26 UPGRADE: Replaced theoretical aluminium volume formulas with YSD master matrices.
 * Evidence base: docs/quotations/ (01_MOLD_PRICING_STANDARD.md, 02_TRAY_PRICING_CALCULATION_FORMULA.md)
 */

import {
  MOLD_BASE_PRICE_MATRIX,
  getMoldLotDiscount,
  PLASTIC_MATERIAL_SPECS,
  DEFAULT_PLASTIC_SPEC,
  SCRAP_RATE,
  PRICE_VOLATILITY_FACTOR,
  PACKAGING_CASE_BASE_COST,
  DEFAULT_SAMPLE_TRIAL_PRICE,
  SETUP_TIME_HOURS,
  FEED_PITCH_OFFSET_MM,
  FILM_WIDTH_OFFSET_MM,
  getFormingCycleRate,
  getMachiningHourlyRate,
  getDefaultPackagingQuantity,
} from './pricing-constants'

export interface DesignRevisionSpec {
  revision_id?: string
  design_code?: string
  design_length?: number | null
  design_width?: number | null
  design_height?: number | null
  design_depth?: number | null
  cutline_length?: number | null
  cutline_width?: number | null
  corner_r?: string | null
  chamfer_c?: string | null
  pocket_numbers?: number | null
  cavity_count?: number | null
  has_separate_cutter?: boolean | null
  plug_type?: string | null
  plastic_type_designed?: string | null
  machine_feed_pitch_mm?: number | null
  thickness_mm?: number | null
  legacy_specs?: Record<string, any> | null
}

export interface MoldPricingOptions {
  constructionType?: 'TOP_FLANGE' | 'SKIRTED'  // 天フランジ vs スカート付き (Default: TOP_FLANGE)
  applicationType?: 'STANDARD' | 'DEDICATED'   // 汎用 vs 専用 (Default: STANDARD)
  isExistingCutter?: boolean                   // Tái sử dụng dao cũ (Default: false)
  freeSampleTrial?: boolean                    // Miễn phí khuôn thử (Default: false)
  firstLotQuantity?: number                    // Quy mô LOT đợt đầu để tính chiết khấu tiền khuôn
}

export interface MoldPriceResult {
  moldBasePrice: number
  cutterPrice: number
  plugPrice: number
  samplePrice: number
  lotDiscount: number
  totalToolingPrice: number
  freeSampleTrial: boolean
  isExistingCutter: boolean
  breakdownSummary: string
  // Backward-compatibility fields (deprecated - replaced by YSD Master Matrix)
  aluminumBlockVolumeCm3?: number
  aluminumCost?: number
  cncMachiningCost?: number
}

export interface TrayPricingOptions {
  lotQuantity?: number                         // Quy mô LOT dập (Default: 5000)
  packagingQuantity?: number                   // Khay / thùng (nếu trống sẽ tự tính theo kích thước)
  factoryFloor?: '1F' | '2F'                   // Xưởng dập (Default: '1F')
  companyCode?: string                         // Mã KH (ví dụ: 'AMP' áp dụng khoán ¥12,000/h)
}

export interface TrayUnitPriceResult {
  sheetWidthMm: number
  feedPitchMm: number
  areaPerShotCm2: number
  areaPerPcsCm2: number
  thicknessMm: number
  densityGPerCm3: number
  weightPerPcsGrams: number
  rawMaterialCostPerPcs: number
  formingProcessCostPerPcs: number
  packingCostPerPcs: number
  estimatedUnitPrice: number
  suggestedSellingPrice: number
  effectivePackagingQty: number
  hourlyRate: number
  cycleRate: number
  breakdownSummary: string
}

// ── BACKWARD COMPATIBILITY: Re-export constants ─────────────────────────────
export const PRICE_CONSTANTS = {
  ALUMINUM_COST_PER_CM3: 12.5,
  CNC_MACHINING_RATE_PER_CM2: 18.0,
  CAVITY_FACTOR_COST: 4500,
  SEPARATE_CUTTER_BASE: 45000,
  INLINE_CUTTER_BASE: 25000,
  PLUG_BASE_COST: 30000,
  PLASTIC_PRICE_PER_KG: {
    PET: 265,
    PP: 285,
    PS: 285,
    PLA: 550,
    DEFAULT: 285,
  } as Record<string, number>,
  PLASTIC_DENSITY: {
    PET: 1.34,
    PP: 0.91,
    PS: 1.05,
    PLA: 1.25,
    DEFAULT: 1.05,
  } as Record<string, number>,
  FORMING_COST_PER_SHOT: 5.5,
  PACKING_COST_PER_PCS: 0.8,
  MARGIN_SCRAP_RATE: 0.05,
  STANDARD_PROFIT_MARGIN: 0.20,
}

// ── HELPER: Resolve CAD Dimensions with Legacy JSONB Fallback ──────────────
/**
 * M26: Fix NULL fallback from legacy_specs JSONB.
 * Hầu hết sản phẩm DB cũ các cột direct bị NULL nhưng có đầy đủ trong legacy_specs!
 */
export function resolveDimensions(rev: DesignRevisionSpec) {
  const legacy = rev.legacy_specs || {}

  // 1. Chiều dài khuôn / khay
  const length =
    Number(rev.design_length) ||
    Number(rev.cutline_length) ||
    Number(legacy.MoldDesignLength) ||
    Number(legacy.CutlineX) ||
    Number(legacy['外寸L']) ||
    Number(legacy.length_mm) ||
    300

  // 2. Chiều rộng khuôn / khay
  const width =
    Number(rev.design_width) ||
    Number(rev.cutline_width) ||
    Number(legacy.MoldDesignWidth) ||
    Number(legacy.CutlineY) ||
    Number(legacy['外寸W']) ||
    Number(legacy.width_mm) ||
    200

  // 3. Chiều cao / độ sâu khuôn
  const height =
    Number(rev.design_height) ||
    Number(rev.design_depth) ||
    Number(legacy.MoldDesignHeight) ||
    Number(legacy.MoldDesignDepth) ||
    35

  // 4. Số khoang dập (Cavity count)
  const cavityCount = Math.max(
    1,
    Number(rev.cavity_count) ||
    Number(rev.pocket_numbers) ||
    Number(legacy.PieceCount) ||
    Number(legacy.PocketNumbers) ||
    1
  )

  // 5. Cutline dimensions
  const cutlineLength = Number(rev.cutline_length) || Number(legacy.CutlineX) || length
  const cutlineWidth = Number(rev.cutline_width) || Number(legacy.CutlineY) || width
  const cornerR = rev.corner_r || legacy.CornerR || '10'

  return {
    length,
    width,
    height,
    cavityCount,
    cutlineLength,
    cutlineWidth,
    cornerR,
  }
}

// ── HELPER: Resolve Plastic Spec & Thickness ────────────────────────────────
export function resolvePlasticSpec(rev: DesignRevisionSpec) {
  const legacy = rev.legacy_specs || {}
  const plasticText = String(rev.plastic_type_designed || legacy.DesignForPlasticType || '').toUpperCase()

  // 1. Độ dày màng (mm)
  let thicknessMm = Number(rev.thickness_mm) || 0
  if (!thicknessMm && legacy['板厚']) {
    thicknessMm = Number(legacy['板厚']) || 0
  }
  if (!thicknessMm && plasticText) {
    const match = plasticText.match(/(\d+(\.\d+)?)\s*(mm|t|ｍｍ)/i)
    if (match) thicknessMm = parseFloat(match[1])
  }
  if (!thicknessMm || isNaN(thicknessMm)) {
    thicknessMm = 0.5 // Fallback chuẩn
  }

  // 2. Tra cứu loại nhựa
  let plasticKey = 'PS(N)'
  if (plasticText.includes('PETG') || plasticText.includes('PET-G')) {
    plasticKey = 'PET(G)'
  } else if (plasticText.includes('PET') || plasticText.includes('A-PET')) {
    plasticKey = 'PET(CL)'
  } else if (plasticText.includes('PP')) {
    if (plasticText.includes('白') || plasticText.includes('WHITE') || plasticText.includes('W')) {
      plasticKey = 'PP(W)'
    } else {
      plasticKey = 'PP(N)'
    }
  } else if (plasticText.includes('PS')) {
    if (plasticText.includes('練り込み') || plasticText.includes('練込') || plasticText.includes('BC')) {
      plasticKey = 'PS(BC)'
    } else if (plasticText.includes('印刷') || plasticText.includes('BP')) {
      plasticKey = 'PS(BP)'
    } else if (plasticText.includes('導電') || plasticText.includes('黒') || plasticText.includes('B')) {
      plasticKey = 'PS(B)'
    } else if (plasticText.includes('透明') || plasticText.includes('クリア') || plasticText.includes('CL')) {
      plasticKey = 'PS(CL)'
    } else if (plasticText.includes('白') || plasticText.includes('W')) {
      plasticKey = 'PS(W)'
    } else {
      plasticKey = 'PS(N)'
    }
  }

  const spec = PLASTIC_MATERIAL_SPECS[plasticKey] || DEFAULT_PLASTIC_SPEC

  return {
    plasticKey,
    spec,
    thicknessMm,
    rawText: plasticText,
  }
}

/**
 * A. calculateMoldPrice(designRevision, options)
 * M26: Thay thế hoàn toàn công thức thể tích nhôm bằng Ma trận Giá Chuẩn YSD (MOLD_BASE_PRICE_MATRIX).
 * Căn cứ: docs/quotations/01_MOLD_PRICING_STANDARD.md
 */
export function calculateMoldPrice(
  rev: DesignRevisionSpec,
  options?: MoldPricingOptions
): MoldPriceResult {
  const { length, width, height, cavityCount } = resolveDimensions(rev)

  const constructionType = options?.constructionType || 'TOP_FLANGE'
  const applicationType = options?.applicationType || 'STANDARD'
  const isExistingCutter = Boolean(options?.isExistingCutter)
  const freeSampleTrial = Boolean(options?.freeSampleTrial)
  const firstLotQuantity = options?.firstLotQuantity

  // 1. M26: Lookup giá khuôn từ Ma trận chuẩn YSD (金型見積もり基準)
  // M26: REMOVED - aluminium volume formula: (L * W * H / 1000) * 12.5 + (L * W / 100) * 18.0
  const matrix = MOLD_BASE_PRICE_MATRIX[applicationType][constructionType]
  const basePrice = isExistingCutter ? matrix.existingCutter : matrix.newCutter

  // 2. M26: Chiết khấu tiền khuôn theo quy mô LOT đặt hàng khay đợt đầu (発注ロット別特別値引き枠)
  const lotDiscount = getMoldLotDiscount(firstLotQuantity)
  const moldBasePrice = Math.max(0, basePrice - lotDiscount)

  // 3. Phụ phí dao bế (CUTTER):
  // Theo chuẩn YSD, giá khuôn 一式 đã bao gồm toàn bộ thiết kế + dao bế mới (¥220k)
  // Nếu dùng lại dao cũ (isExistingCutter = true), giá khuôn giảm ¥50,000 (còn ¥170k) và dao = ¥0
  let cutterPrice = 0
  if (rev.has_separate_cutter) {
    cutterPrice = isExistingCutter ? 0 : 45000
  } else {
    cutterPrice = 0 // Đã bao gồm trong giá khuôn chuẩn
  }

  // 4. Phụ phí Plug trợ lực nếu có
  let plugPrice = 0
  if (rev.plug_type && rev.plug_type !== 'NONE') {
    plugPrice = 30000
  }

  // 5. M26: Phí làm mẫu thử (SAMPLE)
  // Nếu freeSampleTrial = true -> ¥0 (無償提供)
  const samplePrice = freeSampleTrial ? 0 : DEFAULT_SAMPLE_TRIAL_PRICE

  const totalToolingPrice = moldBasePrice + cutterPrice + plugPrice + samplePrice

  const typeDesc = `${constructionType === 'TOP_FLANGE' ? '天フランジ' : 'スカート付き'}${applicationType === 'STANDARD' ? '汎用' : '専用'}`
  const cutterDesc = isExistingCutter ? '既存刃使用' : '刃新規'
  const discountDesc = lotDiscount > 0 ? ` (ロット特別値引き -¥${lotDiscount.toLocaleString()})` : ''
  const sampleDesc = freeSampleTrial ? 'サンプル無償' : `試作¥${samplePrice.toLocaleString()}`

  const breakdownSummary = `【${typeDesc}金型一式・${cutterDesc}】¥${moldBasePrice.toLocaleString()}${discountDesc} + ${sampleDesc} (外寸: ${length}x${width}x${height}mm Cavity x${cavityCount})`

  return {
    moldBasePrice,
    cutterPrice,
    plugPrice,
    samplePrice,
    lotDiscount,
    totalToolingPrice,
    freeSampleTrial,
    isExistingCutter,
    breakdownSummary,
    // Deprecated fields preserved for backward-compatibility
    aluminumBlockVolumeCm3: Math.round((length * width * height) / 1000),
    aluminumCost: 0,
    cncMachiningCost: 0,
  }
}

/**
 * B. calculateTrayUnitPrice(designRevision, options)
 * M26: Triển khai công thức 3 trụ cột chuẩn YSD: (d) Vật liệu + (e) Bao bì vận chuyển + (f) Dập theo LOT.
 * Căn cứ: docs/quotations/02_TRAY_PRICING_CALCULATION_FORMULA.md
 */
export function calculateTrayUnitPrice(
  rev: DesignRevisionSpec,
  options?: TrayPricingOptions
): TrayUnitPriceResult {
  const { length, width, cavityCount } = resolveDimensions(rev)
  const { spec, thicknessMm, plasticKey } = resolvePlasticSpec(rev)

  const lotQuantity = options?.lotQuantity || 5000
  const factoryFloor = options?.factoryFloor || '1F'
  const companyCode = options?.companyCode

  // 1. Kích thước màng nhựa dập định hình chuẩn YSD
  // M26: Bước tiến (Pitch) = Chiều dài khuôn + 15mm (REPLACED FROM L + 30mm)
  const feedPitchMm = Number(rev.machine_feed_pitch_mm) || (length + FEED_PITCH_OFFSET_MM)
  // M26: Khổ màng (Film Width) = Chiều rộng khuôn + 40mm kẹp mép xích
  const sheetWidthMm = width + FILM_WIDTH_OFFSET_MM

  const feedPitchM = feedPitchMm / 1000
  const filmWidthM = sheetWidthMm / 1000

  // 2. Trụ cột (d) — Chi phí nguyên vật liệu nhựa (材料費)
  // Công thức: ロス率(1.05) × 比重 × 材料巾(m) × 送り(m) × 厚み(mm) × 材料単価(¥/kg) × 変動比(1.2) / 面数
  const areaPerShotCm2 = (feedPitchMm * sheetWidthMm) / 100
  const areaPerPcsCm2 = areaPerShotCm2 / cavityCount
  const thicknessCm = thicknessMm / 10
  const weightPerPcsGrams = areaPerPcsCm2 * thicknessCm * spec.density * SCRAP_RATE

  const rawMaterialCostPerPcs =
    (SCRAP_RATE *
      spec.density *
      filmWidthM *
      feedPitchM *
      thicknessMm *
      spec.basePricePerKg *
      PRICE_VOLATILITY_FACTOR) /
    cavityCount

  // 3. Trụ cột (e) — Chi phí bao bì và vận chuyển nội địa (運賃・梱包費)
  // Công thức: 1,000 JPY / Số lượng khay đóng trong 1 thùng carton
  const effectivePackagingQty =
    options?.packagingQuantity && options.packagingQuantity > 0
      ? options.packagingQuantity
      : getDefaultPackagingQuantity(length, width)

  const packingCostPerPcs = PACKAGING_CASE_BASE_COST / effectivePackagingQty

  // 4. Trụ cột (f) — Chi phí gia công dập máy theo quy mô LOT (加工費)
  // Công thức: ((Lot / Năng suất shot/h) + 0.5h setup) × Đơn giá giờ máy / Lot
  const cycleRate = getFormingCycleRate(factoryFloor, plasticKey, thicknessMm)
  const hourlyRate = getMachiningHourlyRate(plasticKey, lotQuantity, companyCode)
  const machineHours = (lotQuantity / cycleRate) + SETUP_TIME_HOURS
  const formingProcessCostPerPcs = (machineHours * hourlyRate) / lotQuantity

  // 5. Tổng đơn giá trước làm tròn & Đơn giá bán chính thức (Quy tắc YSD: Math.ceil())
  const estimatedUnitPrice = rawMaterialCostPerPcs + packingCostPerPcs + formingProcessCostPerPcs
  // M26: Làm tròn LÊN số nguyên gần nhất (Math.ceil) theo chuẩn YSD gốc
  const suggestedSellingPrice = Math.ceil(estimatedUnitPrice)

  const breakdownSummary = `【3 trụ cột】材料費(d): ¥${rawMaterialCostPerPcs.toFixed(2)} (${spec.label} ${thicknessMm}mm ${weightPerPcsGrams.toFixed(1)}g) + 梱包運賃(e): ¥${packingCostPerPcs.toFixed(2)} (${effectivePackagingQty}枚/箱) + 成形加工費(f): ¥${formingProcessCostPerPcs.toFixed(2)} (Lot ${lotQuantity.toLocaleString()}枚, ¥${hourlyRate.toLocaleString()}/h) = ¥${suggestedSellingPrice}/枚`

  return {
    sheetWidthMm,
    feedPitchMm,
    areaPerShotCm2: Math.round(areaPerShotCm2),
    areaPerPcsCm2: Math.round(areaPerPcsCm2),
    thicknessMm,
    densityGPerCm3: spec.density,
    weightPerPcsGrams: Math.round(weightPerPcsGrams * 10) / 10,
    rawMaterialCostPerPcs: Math.round(rawMaterialCostPerPcs * 100) / 100,
    formingProcessCostPerPcs: Math.round(formingProcessCostPerPcs * 100) / 100,
    packingCostPerPcs: Math.round(packingCostPerPcs * 100) / 100,
    estimatedUnitPrice: Math.round(estimatedUnitPrice * 100) / 100,
    suggestedSellingPrice,
    effectivePackagingQty,
    hourlyRate,
    cycleRate,
    breakdownSummary,
  }
}
