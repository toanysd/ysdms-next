# 📋 Kế hoạch Cập nhật — STT-002 (Phản hồi Phiên 2026-07-10)

> **Mục đích:** Ghi nhận phản hồi người dùng, bổ sung thông tin nghiệp vụ chi tiết, và lập kế hoạch chỉnh sửa schema + module.
> **Ưu tiên:** Hoàn thiện các module hiện tại trước → Sau đó xây dựng module Báo giá.

---

## 1. SẢN PHẨM SET (A/B) — Cơ chế linh hoạt

### Thực tế nghiệp vụ (Xác nhận bởi User)
- Khuôn STT-002 sản xuất **đồng thời** khay A và khay B trên cùng 1 lần dập.
- Đặt hàng và giao hàng luôn theo **SET** (A+B), không bao giờ đặt lẻ.
- → Sản phẩm nên đặt mã là **STT-002AB** (gộp chung).

### Cần kiểm tra từ Email
Từ dữ liệu email đã phân tích:
- Tên SP khách hàng: **TR-S24-A** và **TR-S24-B** (riêng biệt).
- Đơn hàng nội bộ: Giao "10 sets" = 10 tấm A + 10 tấm B cùng lúc.
- Hóa đơn: Thanh toán theo **set**, không theo từng khay A hay B.
- → **Kết luận:** Mã sản phẩm YSD nên là `STT-002AB`, nhưng cần lưu tên khách hàng riêng biệt (TR-S24-A, TR-S24-B).

### Giải pháp thiết kế DB

> [!IMPORTANT]  
> **Phương án:** Bổ sung trường `product_set_type` và `set_components` vào bảng `products`.

```sql
-- Bổ sung vào bảng products
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_set_type TEXT;
-- Giá trị: NULL (sản phẩm đơn) | 'SET' (sản phẩm bộ, VD: AB)
-- Sản phẩm đơn thường (ADY-071): product_set_type = NULL
-- Sản phẩm set (STT-002AB): product_set_type = 'SET'

ALTER TABLE products ADD COLUMN IF NOT EXISTS set_component_names JSONB;
-- Lưu tên từng thành phần trong set
-- VD: {"A": "TR-S24-A", "B": "TR-S24-B"}
-- NULL nếu là sản phẩm đơn
```

**Lý do chọn phương án này thay vì tách riêng 2 bản ghi:**
1. Sản xuất luôn đồng thời → 1 khuôn = 1 sản phẩm = 1 dòng đơn hàng.
2. Tránh nhầm lẫn khi đặt lẻ A hoặc B (không xảy ra trong thực tế).
3. Vẫn lưu được tên riêng A, B cho hóa đơn/nhãn nếu cần.

---

## 2. QUY TẮC ĐẶT TÊN (Naming Convention)

### 2.1 Tên Bản vẽ Thiết kế (Design Drawing Name)

| Ký tự | Ý nghĩa | Ví dụ |
|-------|---------|-------|
| `STT-002` | Mã sản phẩm/khuôn | |
| `P` | **P**roduct — Bản vẽ sản phẩm (khay) | STT-002**P**(Q)R2 |
| `M` | **M**old — Bản vẽ khuôn | STT-002**M**(Q)R2 |
| `(Q)` | Chữ cái đầu tên người thiết kế | (Q) = Quan |
| `R2` | **R**evision 2 — Phiên bản thứ 2 | |

→ Quy tắc: `{product_code}{P|M}({designer_initial})R{version}`

### 2.2 Tên Khuôn tại Nhà máy (Factory Mold Name)

| Cách gọi | Bối cảnh | Ví dụ |
|----------|---------|-------|
| **STT-002AB** | Tên thường dùng trên sàn | "Lấy khuôn STT-002AB ra" |
| **STT-002AB R2** | Khi cần chỉ định phiên bản | "Dùng bản R2 nhé" |
| **STT-002P(Q)R2** | Bộ phận thiết kế tham chiếu bản vẽ | File CAD/PDF |

### 2.3 Ánh xạ vào DB hiện tại

| Trường DB | Giá trị | Ghi chú |
|-----------|---------|---------|
| `products.product_code` | `STT002AB` | Mã compact (bỏ gạch ngang) |
| `products.product_name_internal` | `STT-002AB` | Tên hiển thị nội bộ (giữ gạch ngang) |
| `products.product_name` | `TR-S24-A/B` | Tên chính thức từ KH |
| `design_revisions.design_code` | `STT-002P(Q)R2` | Mã bản vẽ SP |
| `design_revisions.designer` | `Quan` | Người thiết kế |
| `mold_revisions.revision_code` | `STT-002M(Q)R2` | Mã bản vẽ khuôn |

> [!NOTE]
> Hệ thống hiện tại đã có đủ các trường để lưu thông tin này. Không cần thêm cột mới cho naming convention — chỉ cần đảm bảo UI hướng dẫn nhập đúng format.

---

## 3. QUY TRÌNH JOB CHI TIẾT (Corrected from User Feedback)

### Track: 金型 MOLD (Khuôn chính — AB chung 1 khuôn)

| Step | Tên công đoạn | Tên JP | Nhân công | Máy | 予定H | Ghi chú |
|------|--------------|--------|-----------|------|------|---------|
| 1 | Lập trình mặt sau | 裏面プログラム | ✅ Có (lập trình) | ❌ Không | 3h | Lập trình CAM |
| 2 | Gia công CNC mặt sau | 裏面加工 | ❌ Không (tự chạy) | ✅ CNC | 5h | Chạy máy tự động |
| 3 | Lập trình mặt trước | 表面プログラム | ✅ Có (lập trình) | ❌ Không | 1-2h | Có thể làm song song với step 2 |
| 4 | Gia công CNC mặt trước | 表面加工 | ❌ Không (tự chạy) | ✅ CNC | **8h~240h** | Bước **quan trọng nhất**, 1-5 ngày máy |
| 5 | Khoan lỗ chân không | 金型穴あけ | ✅ Có | ✅ Khoan | ~4h | Sau khi CNC mặt trước xong |
| 6 | Đánh bóng / Mài khuôn | 磨き・仕上げ | ✅ Có | Thủ công | ~4h | |
| 7 | Rửa, hoàn thiện, đóng tên | 洗浄・刻印 | ✅ Có | Thủ công | ~2h | Tên khuôn + logo |

### Track: プラグ PLUG (Khuôn gỗ — đi theo SET với Mold)

| Step | Tên công đoạn | Tên JP | Nhân công | Máy | 予定H | Ghi chú |
|------|--------------|--------|-----------|------|------|---------|
| 1 | Lập trình & CNC Plug | プラグ加工 | ✅ Có | ✅ CNC | 5h | |
| 2 | Cắt đế gỗ & dán ネル | ベース切断・ネル貼り | ✅ Có | Thủ công | 3-4h | Đế gỗ 12mm + vải flannel |

> [!NOTE]
> **Plug có thể KHÔNG CẦN** nếu khuôn Mold quá mỏng (chiều sâu ít). Trường hợp STT-002 cần Plug vì khay có chiều sâu đáng kể.

### Track: 抜型 CUTTER (Dao cắt — đặt ngoài)

| Step | Tên công đoạn | Tên JP | Nhân công | Máy | 予定H | Ghi chú |
|------|--------------|--------|-----------|------|------|---------|
| 1 | Đặt hàng ngoài | 外注手配 | ❌ | ❌ | 0 | Gia công bên ngoài |
| 2 | Nhận dao cắt | 抜型受取 | ✅ Kiểm tra | ❌ | 1h | Đến kỳ hạn sẽ có người mang đến |

### Tổng thời gian ước tính (STT-002AB)
```
Mold:  3 + 5 + 2 + [8~240] + 4 + 4 + 2 = 28h ~ 260h (min 3.5 ngày ~ max 32.5 ngày)
Plug:  5 + 4                              = 9h (1.1 ngày)
Cutter: Đặt ngoài                          = phụ thuộc nhà cung cấp
────────────────────────────────────────────
Tổng (song song Mold+Plug): 28h ~ 260h chủ đạo (Mold Track quyết định tổng thời gian)
```

---

## 4. TRƯỜNG DB CẦN BỔ SUNG

### 4.1 Bảng `products` — Thông số kỹ thuật sản phẩm

Hiện tại bảng `products` thiếu nhiều trường cần thiết cho nghiệp vụ:

```sql
-- Thông số xếp chồng (Stacking) — Rất quan trọng cho thiết kế
ALTER TABLE products ADD COLUMN IF NOT EXISTS stacking_type TEXT;
-- Giá trị: 'SAME_DIRECTION' (同方向) | 'REVERSE_180' (180°反転) | 'NESTED' (入れ子) | NULL

ALTER TABLE products ADD COLUMN IF NOT EXISTS stacking_layers INTEGER;
-- Số tầng xếp chồng tiêu chuẩn (VD: 4)

ALTER TABLE products ADD COLUMN IF NOT EXISTS stacking_height_mm NUMERIC;
-- Chiều cao khi xếp chồng đầy đủ (VD: 177mm)

-- Sản phẩm Set A/B
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_set_type TEXT;
-- 'SET' | NULL (sản phẩm đơn)

ALTER TABLE products ADD COLUMN IF NOT EXISTS set_component_names JSONB;
-- {"A": "TR-S24-A", "B": "TR-S24-B"}

-- Kích thước ngoài khay (External dimensions)
ALTER TABLE products ADD COLUMN IF NOT EXISTS external_length_mm NUMERIC;
ALTER TABLE products ADD COLUMN IF NOT EXISTS external_width_mm NUMERIC;

-- Thông tin sản phẩm KH (End customer product specs — Free-form do đa dạng)
ALTER TABLE products ADD COLUMN IF NOT EXISTS customer_product_specs JSONB;
-- Lưu linh hoạt: {"size": "31×26mm", "height": "35mm", "weight": "40.7g", "lead_wire": "5mm"}
-- JSONB cho phép mỗi sản phẩm có thông số khác nhau mà không cần tạo cột cố định
```

> [!IMPORTANT]
> **Lý do dùng JSONB cho `customer_product_specs`:** Sản phẩm khách hàng rất đa dạng (tụ điện, IC, connector...), mỗi loại có thông số riêng. JSONB cho phép lưu linh hoạt mà không cần migration mỗi khi có loại sản phẩm mới.

### 4.2 Bảng `design_revisions` — Vật liệu thay thế

```sql
-- Vật liệu thay thế (khi có 2 loại nhựa cho cùng 1 bản vẽ)
ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS alt_plastic_type TEXT;
-- VD: "PS透明1.0mm 帯電防止付シリコン付【440】"

ALTER TABLE design_revisions ADD COLUMN IF NOT EXISTS alt_plastic_code TEXT;
-- VD: "440"
```

### 4.3 Bảng `products` — Liên kết vật liệu nhựa

```sql
-- Liên kết sản phẩm với mã nhựa chính
ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_plastic_code TEXT;
-- VD: "640" (PS黒1.0mm 導電練り込み)

ALTER TABLE products ADD COLUMN IF NOT EXISTS primary_plastic_spec TEXT;
-- VD: "PS黒1.0mm 導電練り込み"
```

---

## 5. KẾ HOẠCH NHẬP LIỆU KIỂM THỬ (CẬP NHẬT)

### Bước 1: Master Khách hàng
*(Không thay đổi so với bản trước)*

### Bước 2: Master Sản phẩm (CẬP NHẬT)

| Thao tác | Dữ liệu |
|----------|---------|
| Tạo 1 sản phẩm | Mã: `STT002AB`, Tên nội bộ: `STT-002AB`, Tên KH: `TR-S24-A/B` |
| Set type | `product_set_type = 'SET'` |
| Component names | `set_component_names = {"A": "TR-S24-A", "B": "TR-S24-B"}` |
| Stacking | `stacking_type = 'SAME_DIRECTION'`, `stacking_layers = 4`, `stacking_height_mm = 177` |
| Kích thước | `external_length_mm = 330`, `external_width_mm = 270` |
| Vật liệu | `primary_plastic_code = '640'`, `primary_plastic_spec = 'PS黒1.0mm 導電練り込み'` |
| KH specs | `customer_product_specs = {"size":"31×26mm","height":"35mm","weight":"40.7g","lead_wire":"5mm"}` |

### Bước 3: Thiết kế (CẬP NHẬT)

| Thao tác | Dữ liệu |
|----------|---------|
| Revision 1 | `design_code = 'STT-002P(Q)R1'`, designer: Quan, status: SUPERSEDED |
| Revision 2 | `design_code = 'STT-002P(Q)R2'`, designer: Quan, status: SUPERSEDED |
| Revision 3 (A/B) | `design_code = 'STT-002P(Q)_AB'`, designer: Quan, status: APPROVED |

### Bước 4: Khuôn (CẬP NHẬT)
| Thao tác | Dữ liệu |
|----------|---------|
| Mold Master | `STT-002`, loại: セット取り金型, kích thước khuôn: 590×350mm |
| Mold Revision | `revision_code = 'STT-002M(Q)R2'` |

### Bước 5: Job (CẬP NHẬT HOÀN TOÀN)
```
Job: STT-002AB — 金型製作
├── Track: MOLD (金型) — 7 công đoạn
│   ├── Step 1: 裏面プログラム (3h, nhân công)
│   ├── Step 2: 裏面加工 (5h, CNC)
│   ├── Step 3: 表面プログラム (2h, nhân công)
│   ├── Step 4: 表面加工 (24h, CNC) ← chạy sau step 2
│   ├── Step 5: 金型穴あけ (4h, khoan) ← chạy sau step 4
│   ├── Step 6: 磨き・仕上げ (4h, thủ công)
│   └── Step 7: 洗浄・刻印 (2h, thủ công)
├── Track: PLUG (プラグ) — 2 công đoạn (song song với Mold)
│   ├── Step 1: プラグ加工 (5h, CNC)
│   └── Step 2: ベース切断・ネル貼り (4h, thủ công)
└── Track: CUTTER (抜型) — 2 công đoạn (đặt ngoài)
    ├── Step 1: 外注手配 (0h, đặt hàng)
    └── Step 2: 抜型受取 (1h, nhận hàng)
```

### Các bước 6-10: *(Không thay đổi so với bản trước)*

---

## 6. OPEN QUESTIONS

> [!IMPORTANT]
> 1. **Schema migration:** Có đồng ý thêm các cột mới vào bảng `products` (stacking_type, product_set_type, customer_product_specs...) và `design_revisions` (alt_plastic_type) không? Tôi sẽ tạo migration file.
> 2. **Bước tiếp theo:** Sau khi ghi nhận xong, nên bắt đầu:
>    - (A) Chạy migration → Cập nhật UI product form → Bắt đầu nhập liệu kiểm thử?
>    - (B) Hoàn thiện tính năng nào đó trước (VD: Gantt Chart, Order Print)?
> 3. **Processing codes:** Các công đoạn mô tả ở trên (裏面プログラム, 裏面加工, 表面プログラム...) đã có trong bảng `processing_codes` chưa? Cần kiểm tra và bổ sung nếu thiếu.
