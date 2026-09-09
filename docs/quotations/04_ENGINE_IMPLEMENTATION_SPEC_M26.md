# 📐 ĐẶC TẢ KỸ THUẬT NÂNG CẤP AUTO-PRICING ENGINE (MILESTONE 26)
> **Tài liệu Kỹ thuật Hướng dẫn Lập trình Engine Báo giá Tự động**  
> **Mã hồ sơ:** `YSD-SPEC-QUOTE-04`  
> Phục vụ: Refactor toàn diện `src/lib/quotation-engine.ts` trong Milestone 26

---

## 1. MỤC TIÊU TÁI CẤU TRÚC (REFACTORING OBJECTIVES)

Hiện tại, `src/lib/quotation-engine.ts` đang sử dụng hằng số tĩnh (`PRICE_CONSTANTS`) mang tính lý thuyết và chưa phản ánh các quy chuẩn thực tế của Yoshida Package (như PE đã cảnh báo).

Mục tiêu Milestone 26 là nâng cấp Engine tính giá tự động đạt 4 tiêu chuẩn:
1. **Chuyển từ công thức tính thể tích nhôm lý thuyết sang Ma trận Giá chuẩn khuôn YSD** (`金型見積もり基準`).
2. **Triển khai công thức 3 trụ cột tính giá khay nhựa** (`見積り計算書(新）.xlsx`) với bước tiến màng chuẩn `送り = キャビ寸 + 15mm` và đơn giá giờ máy theo quy mô LOT.
3. **Xử lý trọn vẹn 3 trường hợp nghiệp vụ đặc biệt**:
   - Tặng khuôn thử miễn phí (`free_sample_trial = true` $\rightarrow$ ¥0, nhãn `無償提供`).
   - Báo giá độc lập khuôn (`quotation_type = 'MOLD'` $\rightarrow$ Không sinh dòng khay).
   - Chiết khấu tiền khuôn theo LOT đặt hàng khay (`発注ロット別特別値引き枠`).
4. **Hỗ trợ Báo giá phân tầng nhiều mức LOT (Multi-Tier LOT Pricing)** trên cùng một sản phẩm (ví dụ: cột giá cho 1,000 / 3,000 / 5,000 / 10,000 khay).

---

## 2. THIẾT KẾ KIỂU DỮ LIỆU & INTERFACE MỚI (TYPESCRIPT SPEC)

```typescript
// src/lib/quotation-engine.ts (M26 Draft Specification)

export type QuotationType = 'SET' | 'MOLD' | 'PRODUCT'
export type MoldConstructionType = 'TOP_FLANGE' | 'SKIRTED'  // 天フランジ vs スカート付き
export type MoldApplicationType = 'STANDARD' | 'DEDICATED'   // 汎用 vs 専用

export interface TrayPricingParams {
  productId: string
  productCode: string
  productName: string
  plasticType: string          // e.g. 'PS(N)', 'PET(CL)', 'PP(N)'
  thicknessMm: number          // e.g. 0.5, 0.6, 0.8
  cavityCount: number          // Số khoang dập
  externalLengthMm: number     // Chiều dài khay/khuôn
  externalWidthMm: number      // Chiều rộng khay/khuôn
  lotQuantity: number          // Quy mô LOT dập (e.g. 1000, 5000)
  packagingQuantity?: number   // Số khay/thùng carton (mặc định 150)
  factoryFloor?: '1F' | '2F'   // Khu xưởng dập (mặc định '1F')
}

export interface MoldPricingParams {
  constructionType: MoldConstructionType // TOP_FLANGE | SKIRTED
  applicationType: MoldApplicationType   // STANDARD | DEDICATED
  isExistingCutter: boolean              // true nếu tận dụng dao cắt có sẵn (giảm ¥50,000)
  freeSampleTrial: boolean               // true nếu miễn phí khuôn thử nghiệm
  firstLotQuantity?: number              // Số lượng khay đặt đợt đầu để tính chiết khấu
  requiresCmmInspection?: boolean        // Cần bảng đo kiểm CMM (専用 mặc định có)
}

export interface AutoPricingInput {
  quotationType: QuotationType
  trayParams?: TrayPricingParams
  moldParams?: MoldPricingParams
}
```

---

## 3. THUẬT TOÁN TÍNH TOÁN CHI TIẾT (CORE ALGORITHMS)

### A. Thuật toán Tính Giá Khuôn (`calculateMoldCost`)
```typescript
export function calculateMoldCost(params: MoldPricingParams) {
  const { constructionType, applicationType, isExistingCutter, freeSampleTrial, firstLotQuantity } = params

  // 1. Base Price Lookup từ Bảng Master
  let basePrice = 0
  if (applicationType === 'STANDARD') {
    if (constructionType === 'TOP_FLANGE') {
      basePrice = isExistingCutter ? 170000 : 220000
    } else {
      basePrice = isExistingCutter ? 200000 : 250000
    }
  } else {
    // DEDICATED
    if (constructionType === 'TOP_FLANGE') {
      basePrice = isExistingCutter ? 240000 : 290000
    } else {
      basePrice = isExistingCutter ? 270000 : 320000
    }
  }

  // 2. Chiết khấu theo LOT đặt hàng khay (発注ロット別特別値引き)
  let lotDiscount = 0
  if (firstLotQuantity && firstLotQuantity >= 10000) {
    lotDiscount = 30000
  } else if (firstLotQuantity && firstLotQuantity >= 5000) {
    lotDiscount = 20000
  } else if (firstLotQuantity && firstLotQuantity >= 3000) {
    lotDiscount = 10000
  }

  const finalMoldPrice = Math.max(0, basePrice - lotDiscount)

  // 3. Phí khuôn thử (SAMPLE)
  const samplePrice = freeSampleTrial ? 0 : 20000

  return {
    basePrice,
    lotDiscount,
    finalMoldPrice,
    samplePrice,
    freeSampleTrial,
    isExistingCutter
  }
}
```

---

### B. Thuật toán Tính Đơn Giá Khay 3 Trụ Cột (`calculateTrayPrice`)
```typescript
export function calculateTrayPrice(params: TrayPricingParams) {
  const {
    plasticType,
    thicknessMm,
    cavityCount = 1,
    externalLengthMm,
    externalWidthMm,
    lotQuantity,
    packagingQuantity = 150,
    factoryFloor = '1F'
  } = params

  // 1. Kích thước phôi màng
  const feedPitchM = (externalLengthMm + 15) / 1000  // 送り = キャビ寸 + 15mm
  const filmWidthM = (externalWidthMm + 40) / 1000   // 材料巾 = キャビ巾 + 40mm

  // 2. Tra cứu thuộc tính nhựa (比重 & 材料単価)
  const matSpec = getMaterialSpec(plasticType)       // e.g. PS: density=1.05, price=285
  const scrapRate = 1.05                             // 5% hao hụt biên
  const markupFactor = 1.2                           // 20% hệ số biến động

  // (d) Chi phí vật liệu mỗi khay
  const materialCost = (scrapRate * matSpec.density * filmWidthM * feedPitchM * thicknessMm * matSpec.basePrice * markupFactor) / cavityCount

  // (e) Chi phí đóng gói & vận chuyển
  const packagingCost = 1000 / packagingQuantity

  // (f) Chi phí gia công dập theo LOT
  const cycleRate = getFormingCycleRate(factoryFloor, plasticType, thicknessMm) // shot/h
  const hourlyRate = getMachiningHourlyRate(plasticType, lotQuantity)          // ¥/h
  const machineHours = (lotQuantity / cycleRate) + 0.5                          // +0.5h setup
  const formingCost = (machineHours * hourlyRate) / lotQuantity

  // Tổng đơn giá trước làm tròn và sau khi làm tròn LÊN
  const rawUnitPrice = materialCost + packagingCost + formingCost
  const finalUnitPrice = Math.ceil(rawUnitPrice) // Quy tắc YSD: Math.ceil

  return {
    materialCost,
    packagingCost,
    formingCost,
    rawUnitPrice,
    finalUnitPrice,
    feedPitchMm: externalLengthMm + 15,
    filmWidthMm: externalWidthMm + 40
  }
}
```

---

## 4. KẾ HOẠCH TRIỂN KHAI CHO MILESTONE 26

| Sprint | Nội dung thực hiện | File đích |
|---|---|---|
| **M26-A** | Khởi tạo cấu hình bảng giá Master (Config / DB Seeds) cho Tỉ trọng, Đơn giá nhựa, Năng suất dập, Bảng giá khuôn chuẩn | `src/lib/pricing-constants.ts` hoặc Supabase table |
| **M26-B** | Refactor toán tử logic tính toán trong `quotation-engine.ts` | `src/lib/quotation-engine.ts` |
| **M26-C** | Nâng cấp UI Form nhập liệu tạo Báo giá: Bổ sung các checkbox `free_sample_trial`, `is_existing_cutter`, phân loại kết cấu khuôn | `src/app/orders/quotations/_components/CreateQuotationModal.tsx` |
| **M26-D** | Unit test & Benchmark đối soát tự động với các file Excel gốc YSD | `tests/pricing_engine.test.ts` |
