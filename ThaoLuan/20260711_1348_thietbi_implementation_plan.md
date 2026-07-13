# 🏭 Phân tích Kiến trúc: Hệ thống Thiết bị Sản xuất Khay Định hình

> **Trạng thái**: Bản phân tích — Chờ xác nhận trước khi triển khai
> **Ngày**: 2026-07-11

---

## 1. Bối cảnh & Vấn đề

### Hiện trạng trong sản xuất thực tế

Để sản xuất khay định hình (thermoforming), cần một **bộ thiết bị hoàn chỉnh (Tooling Set)** lắp trên máy, gồm:

```
Cấp 1 — MÁY (Machine)
│  Rv53B, Rv74C, Rv74D...
│
├─ Cấp 2 — BỘ THIẾT BỊ (Tooling Set) — theo cỡ CAV khuôn
│   ├── 金型 Mold (khuôn chính)
│   ├── プラグ Plug (khuôn phụ)
│   ├── フレーム上 Upper Frame (khung trên)
│   ├── フレーム下 Lower Frame (khung dưới)
│   ├── 水冷ベース Water Cooling Base (đế làm mát — trên/dưới)
│   ├── 圧空ベース Pressure Base (đế khí nén — trên/dưới)
│   ├── 抜型 Cutter (dao cắt)
│   └── スタキング Stacking Guide (dẫn hướng xếp chồng)
│
└─ Cấp 3 — VẬT LIỆU (Material)
    └── Cuộn nhựa (Plastic Roll)
```

### Vấn đề hiện tại trong CSDL

| Vấn đề | Chi tiết | Mức độ |
|--------|----------|--------|
| **Dữ liệu lẫn lộn** | 29 bản ghi PB (Pressure Base) và 17 bản ghi WB (Water Cooling Base) đang nằm trong bảng `products` — bảng dành cho **khay sản phẩm**, không phải thiết bị | 🔴 Nghiêm trọng |
| **Company liên kết sai** | Các thiết bị nội bộ YSD được gán `company_id` tùy tiện (VD: "OTHER", "PB") thay vì gán cho YSD | 🔴 Nghiêm trọng |
| **Không có bảng riêng** | Frames, Bases, Stacking chưa có bảng DB — chỉ có UI placeholder tại `/equipment/auxiliary` | 🟡 Thiếu |
| **item_types đã seed nhưng chưa dùng** | Bảng `item_types` có 11 loại (bao gồm WATER COOLING BASE, PRESSIER BASE, STAKING, FRAME) nhưng chưa được liên kết với bất kỳ bảng thiết bị nào ngoài `job_steps` | 🟡 Lãng phí |
| **Không phân loại theo CAV** | Thiết bị phụ trợ (bases, frames) phù hợp với **nhóm kích thước CAV** — nhưng không có cơ chế nhóm | 🟡 Thiếu |

### Dữ liệu thực tế trong DB

```
products bảng chứa lẫn:
  PB74          → PB74-H15 UPPER (Pressure Base)
  PB590         → PB 590x350
  PB355         → PB 355x347
  WB74530       → WB74 530x350 (Water Cooling Base)  
  WB74590       → WB74 590x350
  WB355         → WB-355X240
  ...
→ KHÔNG PHẢI sản phẩm khay, mà là thiết bị nội bộ YSD
```

```
item_types (11 loại, đã có trong DB):
  ID=1  ALUMI               (Nhôm)
  ID=2  MOLD                (Khuôn)
  ID=3  PLUG                (Plug)
  ID=4  CUTTER              (Dao cắt)
  ID=5  WATER COOLING BASE  (Đế làm mát)
  ID=6  PRESSIER BASE       (Đế áp suất) ← Note: "PRESSIER" → nên là "PRESSURE"
  ID=7  STAKING             (Xếp chồng) ← Note: nên là "STACKING"
  ID=8  FRAME               (Khung)
  ID=9  MACHINE             (Máy)
  ID=10 OTHER               (Khác)
  ID=11 TEST MOLD           (Khuôn test)
```

```
cav_types (26 loại CAV, VD):
  53A      375×290mm
  ZH       385×290mm
  74A-ZA   460×330mm
  74B-A    470×300mm  (= Rv53B compatible)
  74C-ZD   470×347mm
  74D      470×400mm
  74E      470×450mm
  ...
  74L      640×405mm
```

---

## 2. Phân tích & Đề xuất Thiết kế

### Nguyên tắc thiết kế

1. **Một bảng chung `tooling_assets`** cho tất cả thiết bị phụ trợ (frames, bases, stacking) — tránh tạo 5-6 bảng riêng cho mỗi loại vì chúng có cùng cấu trúc dữ liệu.
2. **Phân loại bằng `item_type_id`** (đã có sẵn 11 loại trong DB).
3. **Liên kết với `cav_types`** để biết thiết bị nào dùng được cho kích cỡ CAV nào.
4. **Sở hữu nội bộ YSD** — `owner_company_id` luôn = YSD, nhưng `keeper_company_id` (nơi đang giữ) có thể là chi nhánh khác.
5. **Tương thích với hệ thống Jobs hiện tại** — có thể tạo Job sản xuất/bảo trì cho thiết bị phụ trợ.

### So sánh các phương án

| Phương án | Ưu điểm | Nhược điểm |
|-----------|---------|------------|
| **A. Bảng `tooling_assets` chung** | Đơn giản, linh hoạt, dùng `item_type_id` phân loại | Cần filter theo type khi query |
| B. Mỗi loại 1 bảng (frames, bases...) | Rõ ràng schema | Quá nhiều bảng (5+), trùng lặp cấu trúc |
| C. Mở rộng bảng `physical_molds` | Tái sử dụng code sẵn | Ý nghĩa lệch (mold ≠ frame), gây nhầm lẫn |

> [!IMPORTANT]  
> **Đề xuất: Phương án A** — Tạo bảng `tooling_assets` chung, phân loại bằng `item_type_id`.

---

## 3. Thiết kế Chi tiết

### Bảng `tooling_assets` — Thiết bị phụ trợ sản xuất

```sql
CREATE TABLE tooling_assets (
  asset_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Phân loại
  item_type_id      INTEGER NOT NULL REFERENCES item_types(item_type_id),
  --   5 = WATER COOLING BASE
  --   6 = PRESSURE BASE  
  --   7 = STACKING
  --   8 = FRAME
  
  -- Định danh
  asset_code        TEXT UNIQUE NOT NULL,      -- VD: "PB-74-H15-UPPER", "WB-74-530x350"
  asset_name        TEXT,                       -- Tên hiển thị
  position          TEXT,                       -- 'UPPER' | 'LOWER' | NULL (cho Base/Frame có trên/dưới)
  
  -- Kích thước & Tương thích
  cav_type_id       UUID REFERENCES cav_types(cav_type_id),  -- Nhóm kích thước CAV tương thích
  compatible_machines TEXT[],                   -- Danh sách máy tương thích ['Rv74C', 'Rv74D']
  length_mm         NUMERIC,                   -- Kích thước dài (mm)
  width_mm          NUMERIC,                   -- Kích thước rộng (mm)
  height_mm         NUMERIC,                   -- Chiều cao (mm)
  
  -- Sở hữu & Vị trí
  owner_company_id  UUID REFERENCES companies(company_id) DEFAULT '<YSD_COMPANY_ID>',
  keeper_company_id UUID REFERENCES companies(company_id), -- Nơi đang giữ (chi nhánh)
  current_rack_layer_id UUID REFERENCES rack_layers(rack_layer_id),
  
  -- Trạng thái
  device_status     TEXT DEFAULT 'NORMAL',      -- NORMAL | MAINTENANCE | BROKEN | DISPOSED
  usage_status      TEXT DEFAULT 'ACTIVE',      -- ACTIVE | LOAN | DISPOSED
  manufacturing_date DATE,
  disposed_date     DATE,
  
  -- QR & Tracking
  qr_uuid           UUID DEFAULT gen_random_uuid(),
  system_code       TEXT,                       -- Mã hệ thống cũ (legacy)
  
  -- Metadata
  notes             TEXT,
  legacy_product_id UUID REFERENCES products(product_id), -- Link về record products cũ (migration)
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_tooling_assets_item_type ON tooling_assets(item_type_id);
CREATE INDEX idx_tooling_assets_cav_type ON tooling_assets(cav_type_id);
CREATE INDEX idx_tooling_assets_keeper ON tooling_assets(keeper_company_id);
```

### Bảng liên kết `tooling_set_members` — Gom thành bộ thiết bị

```sql
-- Mỗi khuôn (physical_mold) khi lên máy cần 1 bộ thiết bị đi kèm
-- Bảng này ghi nhận "bộ thiết bị nào đi kèm khuôn nào" trên thực tế
CREATE TABLE tooling_set_members (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  physical_mold_id  UUID REFERENCES physical_molds(physical_mold_id), -- Khuôn chính trong bộ
  asset_id          UUID REFERENCES tooling_assets(asset_id),          -- Thiết bị đi kèm
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);
```

### Mở rộng bảng `cav_types`

```sql
ALTER TABLE cav_types 
  ADD COLUMN machine_series TEXT,        -- 'Rv53B' | 'Rv74C' | 'Rv74D'
  ADD COLUMN description    TEXT;        -- Mô tả chi tiết
```

### Mở rộng bảng `machines`

> [!NOTE]
> Bảng `machines` đã tồn tại nhưng chưa có cột `machine_series`. Cần bổ sung để liên kết với `cav_types`.

```sql
ALTER TABLE machines
  ADD COLUMN machine_series TEXT;  -- 'Rv53B' | 'Rv74C' | 'Rv74D'
```

---

## 4. Sơ đồ Quan hệ Mới

```
machines (Cấp 1)
│  machine_series: 'Rv74C'
│
├── cav_types (Quy cách CAV — liên kết ngang)
│   │  cav_code: '74C-ZD', 470×347mm
│   │  machine_series: 'Rv74C'
│   │
│   ├── physical_molds (Khuôn — đã có)
│   │   cav_type_id → cav_types
│   │
│   └── tooling_assets (Thiết bị phụ trợ — MỚI)
│       cav_type_id → cav_types
│       item_type_id → item_types (FRAME/BASE/STACKING...)
│
├── tooling_set_members (Bộ thiết bị thực tế — MỚI)
│   physical_mold_id → physical_molds
│   asset_id → tooling_assets
│
└── plastic_receipt_roll (Vật liệu — Cấp 3, đã có)
```

---

## 5. Kế hoạch Migration Dữ liệu Cũ

### Bước 1: Di chuyển 46 bản ghi từ `products` sang `tooling_assets`

```sql
-- Ví dụ logic migration (Python script):
-- 1. Tìm tất cả products có product_code bắt đầu bằng PB, WB
-- 2. Phân loại: PB → item_type_id=6, WB → item_type_id=5
-- 3. Parse kích thước từ product_name (VD: "PB 590x350" → 590mm × 350mm)
-- 4. Tạo record trong tooling_assets
-- 5. Cập nhật legacy_product_id để truy vết
-- 6. Soft-delete products cũ (product_status = 'MIGRATED') hoặc đánh dấu
```

### Bước 2: Cập nhật `item_types`

```sql
-- Sửa typo
UPDATE item_types SET item_type_code = 'PRESSURE_BASE' WHERE item_type_id = 6;
UPDATE item_types SET item_type_code = 'STACKING' WHERE item_type_id = 7;

-- Thêm tên tiếng Việt
UPDATE item_types SET item_type_name_vi = 'Khuôn nhôm' WHERE item_type_id = 1;
UPDATE item_types SET item_type_name_vi = 'Khuôn' WHERE item_type_id = 2;
UPDATE item_types SET item_type_name_vi = 'Plug' WHERE item_type_id = 3;
UPDATE item_types SET item_type_name_vi = 'Dao cắt' WHERE item_type_id = 4;
UPDATE item_types SET item_type_name_vi = 'Đế làm mát' WHERE item_type_id = 5;
UPDATE item_types SET item_type_name_vi = 'Đế áp suất' WHERE item_type_id = 6;
UPDATE item_types SET item_type_name_vi = 'Xếp chồng' WHERE item_type_id = 7;
UPDATE item_types SET item_type_name_vi = 'Khung (Frame)' WHERE item_type_id = 8;
UPDATE item_types SET item_type_name_vi = 'Máy' WHERE item_type_id = 9;
UPDATE item_types SET item_type_name_vi = 'Khác' WHERE item_type_id = 10;
UPDATE item_types SET item_type_name_vi = 'Khuôn test' WHERE item_type_id = 11;
```

---

## 6. Kế hoạch UI

### Giai đoạn 1 (Ưu tiên): Danh sách & Quản lý cơ bản
- Thay thế UI placeholder `/equipment/auxiliary` bằng trang danh sách thực
- Filter theo `item_type_id` (Frame/Base/Stacking)
- Filter theo `cav_type_id` (kích cỡ)
- CRUD cơ bản

### Giai đoạn 2: Liên kết với Sản xuất
- Khi lên kế hoạch sản xuất → hiển thị "Bộ thiết bị cần chuẩn bị" theo CAV type
- Cảnh báo nếu thiếu thiết bị cho bộ

### Giai đoạn 3: Tích hợp Job
- Tạo Job sản xuất/bảo trì cho tooling_assets
- Track trên Gantt chart

---

## 7. Câu hỏi cần xác nhận

> [!IMPORTANT]
> Cần xác nhận các điểm sau trước khi triển khai:

1. **Phương án A (bảng `tooling_assets` chung)** có phù hợp không? Hay mỗi loại thiết bị cần bảng riêng?

2. **Bảng `tooling_set_members`**: Có cần ghi nhận "bộ thiết bị đi kèm khuôn nào" không? Hay chỉ cần liên kết gián tiếp qua `cav_type_id`?

3. **Stacking Guide**: Stacking là thiết bị vật lý riêng hay chỉ là thông số của sản phẩm (đã có `stacking_type`, `stacking_layers` trên bảng `products`)?

4. **Frames có phân trên/dưới rõ ràng không?** Hay 1 frame = 1 bộ (trên + dưới)?

5. **Khi nào nên bắt đầu migration dữ liệu?** Nên di chuyển 46 bản ghi PB/WB từ `products` sang `tooling_assets` ngay, hay chờ hoàn thiện module khác trước?

6. **Ưu tiên triển khai**: UI quản lý thiết bị phụ trợ có cần làm ngay không, hay tập trung hoàn thiện module đơn hàng/sản xuất trước?
