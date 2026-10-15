# 💴 M03 — Báo Giá Khuôn & Khay Theo Định Mức 3 Trụ Cột (`M03_quotations_pricing/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 289 Threads / 2,279 Emails & `docs/quotations/`)
1. **Định mức Giá Khuôn (`01_MOLD_PRICING_STANDARD.md`):**
   - **Khuôn phổ thông (`汎用金型` — nội bộ):** `天フランジ` Dao mới **¥220,000** / Dao có sẵn **¥170,000**; `スカート付き` Dao mới **¥250,000** / Dao có sẵn **¥200,000**.
   - **Khuôn chuyên dụng (`専用金型` — thuê ngoài ¥110k + 検査表 ¥10k):** `天フランジ` Dao mới **¥290,000** / Dao có sẵn **¥240,000**; `スカート付き` Dao mới **¥320,000** / Dao có sẵn **¥270,000**.
   - **Chiết khấu theo LOT khay đợt đầu:** LOT `>= 3,000` giảm **¥10,000**; LOT `>= 5,000` giảm **¥20,000**; LOT `>= 10,000` giảm **¥30,000**.
   - **Giải trình 3 khối OEM:** CAD/CAM (**¥68,000**) + Phôi vật liệu (**¥90,000**, nhôm `1,250 ¥/kg`) + Gia công CNC (**¥70,000**) = **¥228,000**.
2. **Công thức Tính Giá Khay Nhựa 3 Trụ cột (`02_TRAY_PRICING_CALCULATION_FORMULA.md`):**
   - `Đơn giá khay = Math.ceil((d) Vật liệu + (e) Bao bì + (f) Gia công dập)`.
   - `(d)` Vật liệu: Bước tiến `P = CavityLen + 15 mm` (`+20 mm` khuôn sâu); Khổ màng `W = CavityWid + 40 mm`; nhân hệ số hao hụt `1.05` và biên lợi nhuận `1.20`.
   - `(e)` Bao bì & vận chuyển: `1,000 ¥ / số khay mỗi thùng`.
   - `(f)` Giờ máy theo LOT: Thời gian = `Lot / ShotPerHour + 0.5h setup`; đơn giá giờ máy giảm dần từ **¥15,000/h** (`<= 1k`) xuống **¥10,000/h** (`>= 10k`); riêng khách hàng AMP cố định **¥12,000/h**.

## 2. Cấu Trúc Route & Engine Chuẩn
- **Routes:** `/orders/quotations`, `/orders/quotations/[id]`, `/api/quotations/[id]/pdf` (redirect từ `/quotations*`).
- **Engine:** `src/lib/pricing/quotation-engine.ts` & `CreateQuotationModal.tsx`.

## 3. Trạng Thái Hiện Tại & Bằng Chứng Nghiệm Thu
- **Trạng thái:** **Hoàn thành & Đã kiểm thử E2E (`CLOSED`)**.
- **Commits:** `0ca262a8` & `0889b7e0` (Pricing Engine), `c6f20b98` (`WO-PIPE-FIX`: truyền đủ `product_id` & `design_revision_id` khi lưu `quotation_lines`, chuẩn hóa enum chữ hoa `DRAFT/SENT/APPROVED/CONVERTED`), `d51b5609` (`WO-SCHEMA-SAFETY-FIX`: khóa chặt RPC `fn_convert_quotation_to_order` theo Phương án A1).
