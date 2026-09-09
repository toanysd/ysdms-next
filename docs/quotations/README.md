# 📐 MODULE QUY CHUẨN & HỒ SƠ KỸ THUẬT TÍNH TOÁN BÁO GIÁ
> **Hệ thống Quản lý Báo giá & Định mức Chi phí YSD (Yoshida Package)**  
> **Tài liệu SSOT (Single Source of Truth) về Công thức Tính giá Báo giá Khay & Khuôn**  
> Phiên bản: 1.0 — Ngày lập: 2026-09-09  
> Người thực hiện: AN (Executing Agent) — Giám sát: PE & Anh Thoan

---

## 1. MỤC TIÊU & TỔNG QUAN HỒ SƠ

Module tài liệu này được biên soạn theo chỉ đạo của **Anh Thoan** và phán quyết kỹ thuật từ **PE** (Project Engineer), nhằm chuẩn hóa toàn bộ các công thức tính toán báo giá (`計算式`), định mức khuôn mẫu và giá thành khay nhựa định hình nhiệt của Yoshida Package Co., Ltd.

Trước đây, các công thức tính toán nằm phân tán trong nhiều bảng tính Excel nội bộ, bảng giá chuẩn và tài liệu Word qua các thời kỳ. Module này hệ thống hóa toàn bộ thành **quy chuẩn kỹ thuật thống nhất**, làm nền tảng cho việc nâng cấp **Auto-Pricing Engine** (`src/lib/quotation-engine.ts`) trong **Milestone 26**.

---

## 2. NGUỒN TÀI LIỆU CĂN CỨ THỰC TẾ (EVIDENCE BASE)

Mọi công thức, bảng định mức, hệ số và quy tắc nghiệp vụ trong module này đều được trích xuất 100% từ các file gốc của công ty Yoshida Package lưu trữ tại `source_data/Form lien quan/`:

| # | Tên file gốc | Định dạng | Nội dung trích xuất chính |
|---|---|---|---|
| 1 | `金型見積もり基準.xls` | Excel | Bảng định mức giá chuẩn khuôn (天フランジ vs スカート付き, 汎用 vs 専用, カット寸新規 vs 既存) và bảng chiết khấu theo LOT đặt hàng. |
| 2 | `計算/金型見積計算書.xlsx` | Excel | Bảng phân rã chi phí thiết kế 3D, gia công CNC, phôi nhôm 1,250 ¥/kg, nỉ dán, dao bế và khuôn mẫu thử (試作). |
| 3 | `見積り計算書(新）.xlsx` | Excel | Bảng tính chi tiết đơn giá khay: công thức vật liệu (ロス 1.05, 変動比 1.2), bước tiến `送り = キャビ寸 + 15mm`, vận chuyển đóng thùng, năng suất dập (h/shot), đơn giá giờ máy theo LOT. |
| 4 | `見積り計算式.xls` / `.xlsm` | Excel | Bảng phân cấp đơn giá gia công dập theo giờ (`加工費/h`) theo mức LOT khay PS/PET/PP. |
| 5 | `見積原価計算書フォーマットver6.xlsx` | Excel | Bảng định mức giá thành 14 thành phần chi phí chuyên nghiệp (trình nộp các tập đoàn Fujitsu, Rapidus, TE...). |
| 6 | `計算/価格改定計算用2024.6.26.xlsx` | Excel | Bảng công thức điều chỉnh biến động giá nhựa và kích thước khuôn quy cách chuẩn (A, D, E, H, G Series). |
| 7 | `ysd見積原紙.xls` / `見積り　原紙（エクセル）.xlsx` | Excel | Phôi mẫu báo giá in ấn chính thức của Yoshida Package gửi khách hàng. |

---

## 3. CẤU TRÚC MODULE HỒ SƠ KỸ THUẬT

Module bao gồm 4 tài liệu chuyên sâu được sắp xếp theo phân hệ nghiệp vụ:

```
docs/quotations/
├── README.md                                # Tài liệu này: Tổng quan module & căn cứ pháp lý kỹ thuật
├── 01_MOLD_PRICING_STANDARD.md             # Quy chuẩn định mức giá Khuôn nhôm, Dao bế & Dụng cụ gá lắp
├── 02_TRAY_PRICING_CALCULATION_FORMULA.md   # Quy chuẩn công thức tính giá Khay nhựa định hình 3 trụ cột
├── 03_COST_BREAKDOWN_STANDARD_V6.md        # Chuẩn phân rã giá thành 14 thành phần (Format Ver6)
└── 04_ENGINE_IMPLEMENTATION_SPEC_M26.md    # Đặc tả kỹ thuật nâng cấp Auto-Pricing Engine cho M26
```

---

## 4. TÓM TẮT MA TRẬN ĐỊNH MỨC CỐT LÕI

### A. Ma trận Giá Khuôn Chuẩn (Mold Master Matrix)
*Đơn vị: JPY (Chưa bao gồm thuế)*

| Loại kết cấu khuôn | Dao cắt MỚI (`カット寸新規`) | Tận dụng dao CÓ SẴN (`カット寸既存`) |
|---|---|---|
| **天フランジ汎用** (Top-flange Standard) | **¥220,000** | **¥170,000** (Giảm ¥50k dao + thanh xếp) |
| **スカート付き汎用** (Skirted Standard) | **¥250,000** | **¥200,000** |
| **天フランジ専用** (Top-flange Dedicated) | **¥290,000** | **¥240,000** |
| **スカート付き専用** (Skirted Dedicated) | **¥320,000** | **¥270,000** |

*Chiết khấu tiền khuôn theo LOT đặt hàng khay:*
- Đặt LOT 3,000 khay: Giảm **¥10,000**
- Đặt LOT 5,000 khay: Giảm **¥20,000**
- Đặt LOT 10,000 khay: Giảm **¥30,000**

---

### B. Công thức Đơn giá Khay Nhựa Chuẩn (Tray Pricing Formula)
$$\text{Đơn giá khay} = \left\lceil (d) \text{ Chi phí vật liệu} + (e) \text{ Chi phí bao bì/vận chuyển} + (f) \text{ Chi phí gia công dập} \right\rceil$$

1. **Chi phí vật liệu (d):**
   $$d = \frac{1.05 (\text{Scrap}) \times \text{比重} (\rho) \times W_{\text{film}} (\text{m}) \times P_{\text{feed}} (\text{m}) \times t (\text{mm}) \times \text{Đơn giá nhựa} (¥/\text{kg}) \times 1.2 (\text{Biến động})}{\text{Số khoang (Cavity count)}}$$
   - Bước tiến màng: $P_{\text{feed}} = \text{Chiều dài khoang khuôn } + 15\text{ mm}$ (hoặc $+20\text{ mm}$).
   - Khổ màng nhựa: $W_{\text{film}} = \text{Chiều rộng khoang khuôn } + 40\text{ mm}$.

2. **Chi phí bao bì & vận chuyển (e):**
   $$e = \frac{1,000 \text{ ¥}}{\text{Số lượng khay / 1 thùng carton}}$$

3. **Chi phí gia công dập (f):**
   $$f = \frac{\left( \frac{\text{Lot}}{\text{Tốc độ dập (shot/h)}} + 0.5\text{h setup} \right) \times \text{Đơn giá giờ máy } (¥/\text{h})}{\text{Lot}}$$
   - Đơn giá giờ máy giảm theo quy mô LOT: Từ 15,000 ¥/h (LOT 1k) xuống 12,000 ¥/h (LOT 5k) và 10,000 ¥/h (LOT 10k).
   - Quy tắc làm tròn YSD: `小数点以下すべて切り上げ` (Luôn làm tròn LÊN số nguyên gần nhất: `Math.ceil()`).

---

## 5. MỐI QUAN HỆ VỚI DATABASE SCHEMA V5

Module này trực tiếp kết nối với các thực thể trong cơ sở dữ liệu Supabase:
- **`quotations`**: Chứa Header báo giá, phân loại `quotation_type` (`'MOLD'`, `'PRODUCT'`, `'SET'`), thông tin điều khoản.
- **`quotation_lines`**: Chi tiết từng dòng sản phẩm/khuôn, đơn giá, số lượng, liên kết `product_id` và `design_revision_id`.
- **`products`**: Nguồn kích thước外寸 (`external_length_mm`, `external_width_mm`), các trường tiền đề dập vừa bổ sung trong Migration 105: `feed_length_mm`, `film_width_mm`, `thickness_mm`.
- **`design_revisions`**: Nguồn SSOT về thông số kỹ thuật thiết kế khuôn (`cutline_length`, `cutline_width`, `plastic_type_designed`, `cavity_count`).
- **`equipment`**: Quản lý thiết bị khuôn dập (`MOLD`), dao cắt (`CUTTER_SEPARATE`, `CUTTER_INLINE`), plug trợ lực (`PLUG`).
