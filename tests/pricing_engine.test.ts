import { describe, it, expect } from 'vitest'
import {
  calculateMoldPrice,
  calculateTrayUnitPrice,
  resolveDimensions,
} from '../src/lib/quotation-engine'
import {
  FEED_PITCH_OFFSET_MM,
  FILM_WIDTH_OFFSET_MM,
} from '../src/lib/pricing-constants'

describe('calculateMoldPrice — YSD Master Matrix', () => {
  it('TC-01: TE Connectivity standard TOP_FLANGE → ¥240,000 total', () => {
    // 外寸 469x299x35mm, 汎用天フランジ型 (MOLD_BASE_PRICE_MATRIX: ¥220,000 + 試作サンプル: ¥20,000)
    const rev = {
      design_length: 469,
      design_width: 299,
      design_height: 35,
      cavity_count: 1,
      has_separate_cutter: false,
    }
    const result = calculateMoldPrice(rev)
    expect(result.moldBasePrice).toBe(220000)
    expect(result.cutterPrice).toBe(0) // Đã bao gồm trong giá khuôn chuẩn
    expect(result.samplePrice).toBe(20000)
    expect(result.totalToolingPrice).toBe(240000)
  })

  it('TC-02: Kobayashi Spring Lot 5k → lotDiscount ¥20,000 → base ¥200,000', () => {
    // Căn cứ: 金型見積もり基準.xls (R27-R30) - Lot 5,000 chiết khấu -¥20,000
    const rev = {
      design_length: 460,
      design_width: 330,
      design_height: 35,
      cavity_count: 1,
    }
    const result = calculateMoldPrice(rev, { firstLotQuantity: 5000 })
    expect(result.lotDiscount).toBe(20000)
    expect(result.moldBasePrice).toBe(200000) // ¥220,000 - ¥20,000
  })

  it('TC-03: Kobayashi Spring Lot 10k → lotDiscount ¥30,000 → base ¥190,000', () => {
    // Căn cứ: 金型見積もり基準.xls (R27-R30) - Lot 10,000 chiết khấu -¥30,000
    // Khớp 100% với giá thực tế báo cho KSP khi đặt lot lớn: ¥190,000
    const rev = {
      design_length: 460,
      design_width: 330,
      design_height: 35,
      cavity_count: 1,
    }
    const result = calculateMoldPrice(rev, { firstLotQuantity: 10000 })
    expect(result.lotDiscount).toBe(30000)
    expect(result.moldBasePrice).toBe(190000) // ¥220,000 - ¥30,000
  })

  it('TC-04: isExistingCutter=true → base ¥170,000 cutterPrice=0', () => {
    // Tận dụng dao bế cũ có sẵn trong kho: giảm ¥50,000 (¥220,000 -> ¥170,000)
    const rev = {
      design_length: 300,
      design_width: 200,
    }
    const result = calculateMoldPrice(rev, { isExistingCutter: true })
    expect(result.moldBasePrice).toBe(170000)
    expect(result.cutterPrice).toBe(0)
    expect(result.isExistingCutter).toBe(true)
  })

  it('TC-05: freeSampleTrial=true → samplePrice=0', () => {
    // Khách hàng đàm phán cung cấp mẫu thử nghiệm miễn phí (無償サンプル 2〜10枚)
    const rev = {
      design_length: 300,
      design_width: 200,
    }
    const result = calculateMoldPrice(rev, { freeSampleTrial: true })
    expect(result.samplePrice).toBe(0)
    expect(result.freeSampleTrial).toBe(true)
  })

  it('TC-06: DEDICATED TOP_FLANGE → ¥290,000', () => {
    // Khuôn chuyên dụng đặc thù (専用金型 - có kiểm định CMM và phí thiết kế riêng)
    const rev = {
      design_length: 300,
      design_width: 200,
    }
    const result = calculateMoldPrice(rev, {
      applicationType: 'DEDICATED',
      constructionType: 'TOP_FLANGE',
    })
    expect(result.moldBasePrice).toBe(290000)
  })
})

describe('resolveDimensions — Legacy JSONB Fallback', () => {
  it('TC-07: Direct cols null → reads CutlineX/CutlineY from legacy_specs', () => {
    // Sản phẩm import từ Access/Excel cũ có các cột trực tiếp = null nhưng có JSONB
    const rev = {
      design_length: null as any,
      design_width: null as any,
      design_height: null as any,
      legacy_specs: {
        CutlineX: 420,
        CutlineY: 280,
        MoldDesignHeight: 40,
        PieceCount: 4,
        CornerR: '15',
      },
    }
    const dim = resolveDimensions(rev)
    expect(dim.length).toBe(420)
    expect(dim.width).toBe(280)
    expect(dim.height).toBe(40)
    expect(dim.cavityCount).toBe(4)
    expect(dim.cornerR).toBe('15')
  })

  it('TC-08: All null → default 300x200x35', () => {
    // Dữ liệu trống hoàn toàn -> fallback kích thước chuẩn an toàn
    const rev = {}
    const dim = resolveDimensions(rev)
    expect(dim.length).toBe(300)
    expect(dim.width).toBe(200)
    expect(dim.height).toBe(35)
    expect(dim.cavityCount).toBe(1)
  })
})

describe('calculateTrayUnitPrice — 3 Pillar Formula', () => {
  it('TC-09: feedPitch = L + 15mm (FEED_PITCH_OFFSET_MM)', () => {
    // Căn cứ: 見積り計算書(新）.xlsx (R24) - Bước tiến màng = Chiều dài khuôn + 15mm
    const rev = {
      design_length: 460,
      design_width: 330,
      plastic_type_designed: 'PS(N) 0.5t',
    }
    const result = calculateTrayUnitPrice(rev, { lotQuantity: 5000 })
    expect(result.feedPitchMm).toBe(460 + FEED_PITCH_OFFSET_MM)
    expect(result.feedPitchMm).toBe(475)
  })

  it('TC-10: sheetWidth = W + 40mm (FILM_WIDTH_OFFSET_MM)', () => {
    // Căn cứ: 見積り計算書(新）.xlsx (R25) - Khổ cuộn nhựa = Chiều rộng khuôn + 40mm kẹp xích
    const rev = {
      design_length: 460,
      design_width: 330,
      plastic_type_designed: 'PS(N) 0.5t',
    }
    const result = calculateTrayUnitPrice(rev, { lotQuantity: 5000 })
    expect(result.sheetWidthMm).toBe(330 + FILM_WIDTH_OFFSET_MM)
    expect(result.sheetWidthMm).toBe(370)
  })

  it('TC-11: suggestedSellingPrice = Math.ceil(estimatedUnitPrice)', () => {
    // Quy chuẩn YSD: Làm tròn LÊN số nguyên JPY gần nhất (Math.ceil)
    const rev = {
      design_length: 460,
      design_width: 330,
      plastic_type_designed: 'PS(N) 0.5t',
    }
    const result = calculateTrayUnitPrice(rev, { lotQuantity: 5000 })
    expect(result.suggestedSellingPrice).toBe(Math.ceil(result.estimatedUnitPrice))
    expect(result.suggestedSellingPrice).toBeGreaterThanOrEqual(result.estimatedUnitPrice)
    expect(result.suggestedSellingPrice - result.estimatedUnitPrice).toBeLessThan(1)
  })

  it('TC-12: KSP PS(N) 0.5t → documented calculation explanation', () => {
    /**
     * NGUỒN GỐC & CƠ SỞ TÍNH TOÁN CỦA ĐƠN GIÁ ¥70/KHAY:
     * -------------------------------------------------------------------------
     * Đây là kết quả tính toán của Auto-Pricing Engine áp dụng chuẩn xác 100% công thức
     * "3 Trụ Cột Chi Phí" từ các file Excel gốc của Yoshida Package:
     * 1. 見積り計算書(新）.xlsx (Sheet: 見積り計算, R11-R36)
     * 2. 見積原価計算書フォーマットver6.xlsx (Sheet: 見積原価計算)
     * 
     * Phân rã chi tiết cho sản phẩm Kobayashi Spring (KSP-200 R2):
     * - Kích thước khay: 460 x 330 mm (Cavity: 1 khoang)
     * - Vật liệu: PS ナチュラル (帯電防止付) dày 0.5mm, Tỉ trọng: 1.05 g/cm³
     * - Bước tiến màng (Pitch): 460 + 15 = 475 mm
     * - Khổ màng nhựa (Film Width): 330 + 40 = 370 mm
     * - Diện tích phôi 1 shot: 47.5 x 37.0 = 1,757.5 cm²
     * - Trọng lượng 1 khay (có hao hụt biên 5%): 96.9 grams (0.0969 kg)
     * 
     * (d) Chi phí vật liệu:
     *     96.9g x ¥285/kg x 1.2 (hệ số biến động giá hạt nhựa 20%) = ¥33.13 / khay
     * (e) Chi phí bao bì & vận chuyển:
     *     Khay kích thước 460x330mm auto-detect quy cách: 50 khay / thùng carton đôi
     *     Định mức thùng chuẩn ¥1,000/thùng -> ¥1,000 / 50 = ¥20.00 / khay
     * (f) Chi phí dập định hình theo Lot 5,000 khay:
     *     Tầng 1 (1F), máy dập PS 0.5t đạt 800 shots/h
     *     Thời gian dập: 5,000 / 800 = 6.25 giờ + 0.5 giờ setup = 6.75 giờ
     *     Đơn giá máy khoán Kanto tiêu chuẩn: ¥12,000/h
     *     Tổng tiền dập: 6.75 x ¥12,000 = ¥81,000 -> ¥81,000 / 5,000 = ¥16.20 / khay
     * 
     * TỔNG CHI PHÍ DỰ TOÁN:
     *     ¥33.13 + ¥20.00 + ¥16.20 = ¥69.33 / khay
     * QUY TẮC LÀM TRÒN YSD (Math.ceil):
     *     Math.ceil(69.33) = ¥70 / khay
     * -------------------------------------------------------------------------
     */
    const rev = {
      design_length: 460,
      design_width: 330,
      plastic_type_designed: 'PS(N) 0.5t',
    }
    const result = calculateTrayUnitPrice(rev, { lotQuantity: 5000 })

    expect(result.rawMaterialCostPerPcs).toBeCloseTo(33.13, 1)
    expect(result.packingCostPerPcs).toBe(20.0)
    expect(result.formingProcessCostPerPcs).toBe(16.2)
    expect(result.estimatedUnitPrice).toBeCloseTo(69.33, 1)
    expect(result.suggestedSellingPrice).toBe(70)
  })
})
