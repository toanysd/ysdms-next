/**
 * YSDMS NextGen — Quotation Pricing Constants & Master Lookup Tables
 * Nguồn dữ liệu sự thật (SSOT) về định mức chi phí theo chuẩn thực tế của Yoshida Package Co., Ltd.
 * Căn cứ hồ sơ: docs/quotations/ (01_MOLD_PRICING_STANDARD.md, 02_TRAY_PRICING_CALCULATION_FORMULA.md)
 */

// ── 1. HẰNG SỐ TOÁN HỌC & TỶ LỆ ĐỊNH MỨC CHUNG ─────────────────────────────
/** Tỷ lệ hao hụt biên nhựa (Scrap rate) chuẩn YSD: 5% hao hụt mép kẹp xích */
export const SCRAP_RATE = 1.05

/** Hệ số bù trừ rủi ro & biến động giá hạt nhựa nguyên liệu (変動比): 20% */
export const PRICE_VOLATILITY_FACTOR = 1.2

/** Chi phí bao bì 1 thùng carton đôi + túi PE lót trong + vận chuyển nội địa Kanto (JPY/case) */
export const PACKAGING_CASE_BASE_COST = 1000

/** Chi phí khuôn mẫu thử nghiệm mặc định có thu phí (SAMPLE) (JPY) */
export const DEFAULT_SAMPLE_TRIAL_PRICE = 20000

/** Thời gian chuẩn bị máy dập, gá cuộn màng và căn chỉnh nhiệt độ mặc định: 30 phút (0.5 giờ) */
export const SETUP_TIME_HOURS = 0.5

/** Độ bù chiều dài bước tiến màng dập mỗi shot (送り = Chiều dài khuôn + 15mm) */
export const FEED_PITCH_OFFSET_MM = 15

/** Độ bù khổ cuộn nhựa cho 2 mép kẹp xích máy dập (材料巾 = Chiều rộng khuôn + 40mm) */
export const FILM_WIDTH_OFFSET_MM = 40

// ── 2. BẢNG THUỘC TÍNH VẬT LIỆU NHỰA (比重 & 材料単価) ──────────────────────
/**
 * Trích xuất từ: 見積り計算書(新）.xlsx (R11-R23)
 */
export interface PlasticMaterialSpec {
  density: number          // Tỉ trọng (g/cm³ hoặc kg/L)
  basePricePerKg: number   // Đơn giá nhựa cuộn cơ sở (JPY/kg)
  label: string            // Nhãn hiển thị tiếng Nhật
}

export const PLASTIC_MATERIAL_SPECS: Record<string, PlasticMaterialSpec> = {
  'PS(N)': {
    density: 1.05,
    basePricePerKg: 285,
    label: 'PS ナチュラル (帯電防止付)',
  },
  'PS(W)': {
    density: 1.06,
    basePricePerKg: 285,
    label: 'PS 白 (帯電防止付)',
  },
  'PS(CL)': {
    density: 1.05,
    basePricePerKg: 380,
    label: 'PS 透明クリア',
  },
  'PS(B)': {
    density: 1.06,
    basePricePerKg: 320,
    label: 'PS 黒 導電性 (カーボン練り込み)',
  },
  'PS(BC)': {
    density: 1.18,
    basePricePerKg: 650,
    label: 'PS 黒 導電性練り込み高グレード',
  },
  'PS(BP)': {
    density: 1.06,
    basePricePerKg: 485,
    label: 'PS 黒 導電印刷',
  },
  'PP(N)': {
    density: 0.91,
    basePricePerKg: 285,
    label: 'PP ナチュラル 帯電防止',
  },
  'PP(W)': {
    density: 0.91,
    basePricePerKg: 285,
    label: 'PP 白 帯電防止',
  },
  'PET(CL)': {
    density: 1.34,
    basePricePerKg: 265,
    label: 'A-PET クリア 透明',
  },
  'PET(G)': {
    density: 1.34,
    basePricePerKg: 490,
    label: 'PET-G 高耐衝撃',
  },
  'PVC': {
    density: 1.40,
    basePricePerKg: 300,
    label: 'PVC 塩化ビニル',
  },
}

/** Fallback cho vật liệu nhựa không xác định */
export const DEFAULT_PLASTIC_SPEC: PlasticMaterialSpec = {
  density: 1.05,
  basePricePerKg: 285,
  label: '汎用樹脂 (PS基準)',
}

// ── 3. MA TRẬN GIÁ KHUÔN CHUẨN YSD (金型見積もり基準) ─────────────────────────
/**
 * Trích xuất từ: 金型見積もり基準.xls (R1-R26)
 * Đơn vị: JPY (Chưa thuế)
 */
export const MOLD_BASE_PRICE_MATRIX = {
  // Khuôn phổ thông đa năng (汎用金型)
  STANDARD: {
    TOP_FLANGE: {
      newCutter: 220000,      // カット寸新規 (Dao mới + Thanh xếp mới)
      existingCutter: 170000, // カット寸既存 (Tận dụng dao cũ, giảm ¥50k)
    },
    SKIRTED: {
      newCutter: 250000,
      existingCutter: 200000,
    },
  },
  // Khuôn chuyên dụng đặc thù (専用金型 - có kiểm định CMM)
  DEDICATED: {
    TOP_FLANGE: {
      newCutter: 290000,
      existingCutter: 240000,
    },
    SKIRTED: {
      newCutter: 320000,
      existingCutter: 270000,
    },
  },
} as const

/**
 * Bảng chiết khấu tiền khuôn theo quy mô LOT đặt hàng khay đợt đầu (発注ロット別特別値引き枠)
 * Trích xuất từ: 金型見積もり基準.xls (R27-R30)
 */
export const MOLD_LOT_DISCOUNTS = [
  { minLot: 10000, discountJpy: 30000 },
  { minLot: 5000, discountJpy: 20000 },
  { minLot: 3000, discountJpy: 10000 },
] as const

export function getMoldLotDiscount(lotQuantity?: number): number {
  if (!lotQuantity || lotQuantity <= 0) return 0
  for (const tier of MOLD_LOT_DISCOUNTS) {
    if (lotQuantity >= tier.minLot) {
      return tier.discountJpy
    }
  }
  return 0
}

// ── 4. BẢNG NĂNG SUẤT DẬP ĐỊNH HÌNH (生産数/h - サイクル目安) ─────────────────
/**
 * Trích xuất từ: 見積り計算書(新）.xlsx (R24-R36)
 * Đơn vị: shots/giờ
 */
export const FORMING_CYCLE_RATES: Record<'1F' | '2F', Record<string, Record<number, number>>> = {
  // Khuôn xưởng Tầng 1 (1F - Máy dập khổ lớn):
  '1F': {
    PS: {
      0.4: 900,
      0.5: 800,
      0.6: 700,
      0.8: 600,
      1.0: 500,
      1.1: 500,
    },
    PET: {
      0.5: 700,
      0.7: 600,
      0.8: 500,
      1.0: 450,
    },
    PP: {
      0.4: 600,
      0.5: 500,
      0.6: 450,
      0.8: 400,
      1.0: 350,
    },
  },
  // Khuôn xưởng Tầng 2 (2F - Máy dập linh hoạt):
  '2F': {
    PS: {
      0.4: 800,
      0.5: 700,
      0.6: 650,
      0.8: 600,
      1.0: 500,
      1.1: 450,
    },
    PET: {
      // 2F không dập PET, fallback sang thông số PS
      0.5: 650,
      0.8: 500,
    },
    PP: {
      0.4: 500,
      0.5: 450,
      0.6: 400,
      0.8: 350,
    },
  },
}

export function getFormingCycleRate(
  floor: '1F' | '2F' = '1F',
  plasticType: string,
  thicknessMm: number
): number {
  const pUpper = (plasticType || '').toUpperCase()
  let family = 'PS'
  if (pUpper.includes('PET')) family = 'PET'
  else if (pUpper.includes('PP')) family = 'PP'

  const floorTable = FORMING_CYCLE_RATES[floor] || FORMING_CYCLE_RATES['1F']
  const familyTable = floorTable[family] || floorTable['PS']

  // Tìm nấc độ dày gần nhất
  const thicknessKeys = Object.keys(familyTable)
    .map(Number)
    .sort((a, b) => a - b)

  if (thicknessKeys.length === 0) return 600

  let closest = thicknessKeys[0]
  let minDiff = Math.abs(thicknessMm - closest)
  for (const t of thicknessKeys) {
    const diff = Math.abs(thicknessMm - t)
    if (diff < minDiff) {
      minDiff = diff
      closest = t
    }
  }

  return familyTable[closest] || 600
}

// ── 5. BẢNG CHI PHÍ GIỜ MÁY DẬP THEO LOT (加工費/h) ───────────────────────────
/**
 * Trích xuất từ: 見積り計算書(新）.xlsx (R16-R20) & 見積り計算式.xls (R1-R5)
 * Đơn vị: JPY / giờ
 */
export function getMachiningHourlyRate(
  plasticType: string,
  lotQuantity: number,
  companyCode?: string
): number {
  // Khách hàng AMP có thỏa thuận khoán gia công cố định
  if (companyCode === 'AMP' || companyCode?.toUpperCase().includes('AMP')) {
    return 12000 // ¥12,000 / h
  }

  const pUpper = (plasticType || '').toUpperCase()

  // Phân loại vật liệu PP
  if (pUpper.includes('PP')) {
    if (lotQuantity >= 10000) return 10000 // Lot 10,000+: ¥10,000/h
    if (lotQuantity >= 3000) return 12000  // Lot 3,000 ~ 9,999: ¥12,000/h
    return 15000                           // Lot < 3,000: ¥15,000/h
  }

  // Phân loại vật liệu PS / PET (và các vật liệu thông thường khác)
  if (lotQuantity >= 10000) return 10000   // Lot 10,000+: ¥10,000/h
  if (lotQuantity >= 5000) return 12000    // Lot 5,000 ~ 9,999: ¥12,000/h
  if (lotQuantity >= 3000) return 13000    // Lot 3,000 ~ 4,999: ¥13,000/h
  if (lotQuantity >= 2000) return 14000    // Lot 2,000 ~ 2,999: ¥14,000/h
  return 15000                             // Lot < 2,000: ¥15,000/h
}

// ── 6. QUY TẮC ĐÓNG THÙNG MẶC ĐỊNH THEO KÍCH THƯỚC KHAY ───────────────────────
/**
 * Phục vụ: Tính chi phí bao bì và vận chuyển (1,000 JPY / số khay mỗi thùng)
 * Căn cứ: docs/quotations/04_ENGINE_IMPLEMENTATION_SPEC_M26.md
 */
export function getDefaultPackagingQuantity(
  lengthMm: number,
  widthMm: number
): number {
  const maxDim = Math.max(Number(lengthMm) || 0, Number(widthMm) || 0)

  if (maxDim > 450) {
    return 50   // Khay rất lớn (>450mm): 50 khay / thùng carton
  }
  if (maxDim > 300) {
    return 100  // Khay lớn (300mm - 450mm): 100 khay / thùng carton
  }
  if (maxDim > 200) {
    return 150  // Khay tiêu chuẩn (200mm - 300mm): 150 khay / thùng carton
  }
  return 250    // Khay nhỏ (<= 200mm): 250 khay / thùng carton
}
