/**
 * YSDMS NextGen — Quotation Pricing Engine (Báo Giá Khuôn & Khay Nhựa)
 * Calculates tooling costs (molds, cutters, plugs) and thermoforming tray unit prices
 * based on CAD technical specifications (design_revisions).
 */

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
}

export interface MoldPriceResult {
  aluminumBlockVolumeCm3: number
  aluminumCost: number
  cncMachiningCost: number
  moldBasePrice: number
  cutterPrice: number
  plugPrice: number
  totalToolingPrice: number
  breakdownSummary: string
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
  breakdownSummary: string
}

// ── PRICE CONSTANTS (Tạm thời dùng hằng số config, Phase sau đưa vào DB) ─────
export const PRICE_CONSTANTS = {
  // Đơn giá nhôm A5052 phôi (¥/cm³)
  ALUMINUM_COST_PER_CM3: 12.5,
  // Đơn giá gia công CNC nhôm cơ bản theo diện tích và độ sâu (¥/cm²)
  CNC_MACHINING_RATE_PER_CM2: 18.0,
  // Phí lòng khuôn cavity (¥/cavity)
  CAVITY_FACTOR_COST: 4500,
  // Phụ phí dao cắt riêng biệt (CUTTER_SEPARATE)
  SEPARATE_CUTTER_BASE: 45000,
  // Dao cắt dập liền (CUTTER_INLINE)
  INLINE_CUTTER_BASE: 25000,
  // Phụ phí plug trợ lực (PLUG)
  PLUG_BASE_COST: 30000,
  // Đơn giá nhựa nguyên liệu trung bình theo loại (¥/kg)
  PLASTIC_PRICE_PER_KG: {
    PET: 380,
    PP: 420,
    PS: 400,
    PLA: 550,
    DEFAULT: 400,
  } as Record<string, number>,
  // Tỷ trọng nhựa (g/cm³)
  PLASTIC_DENSITY: {
    PET: 1.34,
    PP: 0.91,
    PS: 1.05,
    PLA: 1.25,
    DEFAULT: 1.20,
  } as Record<string, number>,
  // Chi phí dập máy ép định hình mỗi shot (¥/shot)
  FORMING_COST_PER_SHOT: 5.5,
  // Chi phí thùng carton và bao bì đóng gói (¥/pcs)
  PACKING_COST_PER_PCS: 0.8,
  // Hệ số hao hụt mép biên nhựa (%)
  MARGIN_SCRAP_RATE: 0.12,
  // Hệ số lợi nhuận định mức (Markup Margin %)
  STANDARD_PROFIT_MARGIN: 0.25,
}

/**
 * A. calculateMoldPrice(designRevision)
 * Tính toán giá thành bộ khuôn nhôm và dao cắt dựa trên kích thước CAD
 */
export function calculateMoldPrice(rev: DesignRevisionSpec): MoldPriceResult {
  const length = Number(rev.design_length) || Number(rev.cutline_length) || 300
  const width = Number(rev.design_width) || Number(rev.cutline_width) || 200
  const height = Number(rev.design_height) || Number(rev.design_depth) || 35
  const cavityCount = Math.max(1, Number(rev.cavity_count) || Number(rev.pocket_numbers) || 1)

  // 1. Thể tích phôi nhôm (cm³) = (L × W × H) / 1000
  const volumeCm3 = (length * width * height) / 1000
  const aluminumCost = Math.round(volumeCm3 * PRICE_CONSTANTS.ALUMINUM_COST_PER_CM3)

  // 2. Chi phí gia công CNC phôi nhôm
  const surfaceAreaCm2 = (length * width) / 100
  const cncMachiningCost = Math.round(
    surfaceAreaCm2 * PRICE_CONSTANTS.CNC_MACHINING_RATE_PER_CM2 + cavityCount * PRICE_CONSTANTS.CAVITY_FACTOR_COST
  )

  // 3. Giá khuôn chính (MOLD)
  const moldBasePrice = Math.round((aluminumCost + cncMachiningCost) * (1 + PRICE_CONSTANTS.STANDARD_PROFIT_MARGIN))

  // 4. Phụ phí dao cắt (Cutter)
  let cutterPrice = 0
  if (rev.has_separate_cutter) {
    cutterPrice = PRICE_CONSTANTS.SEPARATE_CUTTER_BASE
  } else {
    cutterPrice = PRICE_CONSTANTS.INLINE_CUTTER_BASE
  }

  // 5. Phụ phí Plug trợ lực
  let plugPrice = 0
  if (rev.plug_type && rev.plug_type !== 'NONE') {
    plugPrice = PRICE_CONSTANTS.PLUG_BASE_COST
  }

  const totalToolingPrice = moldBasePrice + cutterPrice + plugPrice

  const breakdownSummary = `Phôi nhôm (${length}x${width}x${height}mm: ¥${aluminumCost.toLocaleString()}) + Gia công CNC (Cavity x${cavityCount}: ¥${cncMachiningCost.toLocaleString()}) + Dao cắt (¥${cutterPrice.toLocaleString()}) + Plug (¥${plugPrice.toLocaleString()})`

  return {
    aluminumBlockVolumeCm3: Math.round(volumeCm3),
    aluminumCost,
    cncMachiningCost,
    moldBasePrice,
    cutterPrice,
    plugPrice,
    totalToolingPrice,
    breakdownSummary,
  }
}

/**
 * B. calculateTrayUnitPrice(designRevision)
 * Tính toán đơn giá khay nhựa dựa trên định mức nguyên vật liệu và chu kỳ dập máy
 */
export function calculateTrayUnitPrice(rev: DesignRevisionSpec): TrayUnitPriceResult {
  const widthMm = Number(rev.design_width) || Number(rev.cutline_width) || 200
  const feedPitchMm = Number(rev.machine_feed_pitch_mm) || (Number(rev.design_length) || 300) + 30 // Mặc định pitch = dài + 30mm mép kéo
  const sheetWidthMm = widthMm + 40 // Khổ màng nhựa = rộng + 40mm kẹp biên
  const cavityCount = Math.max(1, Number(rev.cavity_count) || Number(rev.pocket_numbers) || 1)

  // Parse độ dày từ text plastic_type_designed hoặc cột thickness_mm
  let thicknessMm = Number(rev.thickness_mm) || 0.5
  if (!rev.thickness_mm && rev.plastic_type_designed) {
    const thickMatch = rev.plastic_type_designed.match(/(\d+(\.\d+)?)\s*(mm|t)/i)
    if (thickMatch) thicknessMm = parseFloat(thickMatch[1])
  }

  // Parse loại nhựa (PET, PP, PS, PLA)
  let plasticType = 'DEFAULT'
  const plasticStr = (rev.plastic_type_designed || '').toUpperCase()
  if (plasticStr.includes('PET') || plasticStr.includes('A-PET')) plasticType = 'PET'
  else if (plasticStr.includes('PP')) plasticType = 'PP'
  else if (plasticStr.includes('PS') || plasticStr.includes('HIPS')) plasticType = 'PS'
  else if (plasticStr.includes('PLA')) plasticType = 'PLA'

  const density = PRICE_CONSTANTS.PLASTIC_DENSITY[plasticType] || PRICE_CONSTANTS.PLASTIC_DENSITY.DEFAULT
  const plasticPricePerKg = PRICE_CONSTANTS.PLASTIC_PRICE_PER_KG[plasticType] || PRICE_CONSTANTS.PLASTIC_PRICE_PER_KG.DEFAULT
  const plasticPricePerGram = plasticPricePerKg / 1000

  // 1. Diện tích màng tiêu hao trên mỗi shot và mỗi khay (cm²)
  const areaPerShotCm2 = (feedPitchMm * sheetWidthMm) / 100
  const areaPerPcsCm2 = areaPerShotCm2 / cavityCount

  // 2. Trọng lượng nhựa tiêu hao mỗi chiếc (Gram) = Diện tích (cm²) × Độ dày (cm) × Tỷ trọng (g/cm³) × (1 + Scrap)
  const thicknessCm = thicknessMm / 10
  const weightPerPcsGrams = areaPerPcsCm2 * thicknessCm * density * (1 + PRICE_CONSTANTS.MARGIN_SCRAP_RATE)

  // 3. Chi phí nguyên vật liệu nhựa (¥/pcs)
  const rawMaterialCostPerPcs = weightPerPcsGrams * plasticPricePerGram

  // 4. Chi phí dập máy ép định hình (¥/pcs) = Phí mỗi shot / cavity_count
  const formingProcessCostPerPcs = PRICE_CONSTANTS.FORMING_COST_PER_SHOT / cavityCount

  // 5. Chi phí đóng gói (¥/pcs)
  const packingCostPerPcs = PRICE_CONSTANTS.PACKING_COST_PER_PCS

  // 6. Tổng giá thành sản xuất & Đơn giá bán đề xuất
  const estimatedUnitPrice = rawMaterialCostPerPcs + formingProcessCostPerPcs + packingCostPerPcs
  const suggestedSellingPrice = Math.round(estimatedUnitPrice * (1 + PRICE_CONSTANTS.STANDARD_PROFIT_MARGIN) * 10) / 10

  const breakdownSummary = `Nhựa ${plasticType} ${thicknessMm}mm (${weightPerPcsGrams.toFixed(1)}g: ¥${rawMaterialCostPerPcs.toFixed(2)}) + Dập định hình (¥${formingProcessCostPerPcs.toFixed(2)}) + Đóng gói (¥${packingCostPerPcs.toFixed(2)})`

  return {
    sheetWidthMm,
    feedPitchMm,
    areaPerShotCm2: Math.round(areaPerShotCm2),
    areaPerPcsCm2: Math.round(areaPerPcsCm2),
    thicknessMm,
    densityGPerCm3: density,
    weightPerPcsGrams: Math.round(weightPerPcsGrams * 10) / 10,
    rawMaterialCostPerPcs: Math.round(rawMaterialCostPerPcs * 100) / 100,
    formingProcessCostPerPcs: Math.round(formingProcessCostPerPcs * 100) / 100,
    packingCostPerPcs,
    estimatedUnitPrice: Math.round(estimatedUnitPrice * 100) / 100,
    suggestedSellingPrice,
    breakdownSummary,
  }
}
