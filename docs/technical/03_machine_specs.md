# 03 — THÔNG SỐ MÁY MÓC & THIẾT BỊ (Machine Specs & Equipment)

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-07-02  
> **Nguồn:** `00_BUSINESS_FLOW_DETAIL.md` (PO confirmed 2026-06-03), thảo luận mold naming (2026-06-03)

---

## 1. Máy Thermoforming (定形機 / Máy Định Hình)

### 1.1 Danh Sách Máy

| Máy | Model | Kích thước tối đa | Chiều rộng tấm | Vật liệu | Ghi chú |
|:---:|:------|:------------------:|:---------------:|:---------:|---------|
| **4号機** | ⚠️ Chưa xác nhận (ILLIG hệ) | 405×300 | 520mm | PS, PVC | Nhỏ, chuyên dụng |
| **5号機** | ⚠️ Chưa xác nhận (ILLIG hệ) | 499×347 | 550mm | PS, PET, PP, PVC | Trung, chủ lực |
| **6号機** | **ILLIG RV-53b** ✅ | 470×347 | 520mm | PS, PET, PP | Chủ lực trung |
| **7号機** | **ILLIG RV-53b** ✅ | 470×347 | 520mm | PS, PET, PP | Chủ lực trung |
| **8号機** | **ILLIG RV-74c** ✅ | 590×350 | 670mm | PS, PET, PP | Lớn |
| **9号機** (青森) | **ILLIG RV-74d** ✅ | 585×285 | 640mm | PET | Nhà máy Aomori |
| **台湾機** | Chưa xác nhận | Mọi kích thước + ngoại cỡ | — | — | Toàn diện |

> **Lưu ý quan trọng:** Model máy 6号 và 7号 là **RV-53b** (KHÔNG phải RV-74c như một số tài liệu cũ ghi). 8号 mới là **RV-74c**. Đã xác nhận bởi PO ngày 2026-06-03.

### 1.2 CAV Type — Machine Compatibility

Mỗi CAV Type (quy cách khung khuôn) chỉ chạy được trên máy phù hợp kích thước:

| CAV | Kích thước (mm) | 4号 | 5号 | 6号 | 7号 | 8号 | 9号 | Ghi chú |
|:---:|:---------------:|:---:|:---:|:---:|:---:|:---:|:---:|---------|
| A | 470×300 | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | Phổ biến nhất |
| B | 335×265 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Nhỏ, chạy mọi máy |
| C | 499×347 | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | Chỉ 5号 và 8号 |
| D | 354×300 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| E | 430×260 | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| F | 340×285 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| G | 320×195 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Nhỏ |
| I | 405×300 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Vừa 4号 |
| K | 503×273 | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | Nhiều khuôn nhất (39) |
| M | 500×330 | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | |
| U | 498×245 | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| W | 492×270 | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| ZC | 515×347 | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | Chỉ 8号 |
| ZD | 470×347 | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | |

> Quy tắc: Kích thước khuôn ≤ kích thước tối đa của máy. Cần bảng `machine_cav_compatibility` trong DB.

---

## 2. Máy CNC (金型加工 / Gia Công Khuôn)

| Máy | Dùng cho | Kích thước | Ghi chú |
|:----|:---------|:----------:|---------|
| **CMX 1100V** | Khuôn nhôm CNC | Lớn | Chủ lực |
| **CMX 800V** | Khuôn nhôm CNC | Trung | |
| **DuraVertical 5080** | Khuôn nhôm CNC | | |
| **MILLAC 468V** | Khuôn nhôm CNC | | |
| **MILLTAP 700V** | **Plug gỗ chuyên dụng** | | Chỉ dùng cho plug |
| **ナスカ (NASUKA)** | CAM/NC data generation | — | Phần mềm, không phải máy |

---

## 3. Máy Press (プレス / Cắt Ép)

| Máy | Dùng cho | Ghi chú |
|:----|:---------|---------|
| Press 1号機 | Cắt ép (プレス抜き) | |
| Press 2号機 | Cắt ép | |
| Press 3号機 | Cắt ép | |

---

## 4. Thiết Bị Phụ Trợ

| Thiết bị | Dùng cho | Model |
|:---------|:---------|:------|
| **Máy nghiền** (粉砕機) | Nghiền nhựa thừa tái chế | DN250-750os型 |
| **Máy nén khí** (エアコンプレッサー) | Cung cấp khí cho máy thermoforming | |
| **Máy gấp mép** (折り曲げ機) | Gấp mép khay | |

---

## 5. Điều Kiện Thành Hình (成形条件 / Forming Conditions)

### 5.1 Cấu Trúc Dữ Liệu

Mỗi tổ hợp **Máy × Sản phẩm** có 1 bộ điều kiện thành hình:

```
┌────────────────────────────────────────────┐
│ Forming Condition Sheet                     │
├────────────────────────────────────────────┤
│ P/N:           KDS-036                      │
│ プラグ:        有 (Có plug)                 │
│ 水冷盤 TYPE:   D (CAV Type D = 354×300)     │
│ 枠 TYPE:       D                            │
│ 金型位置:      上型 (Upper)                 │
│ カッター:      35B                          │
│ スタッキング:  上D / 下D                    │
│ 下ヒーター位置: 250mm                       │
├────────────────────────────────────────────┤
│ F2: 12 vùng gia nhiệt (°C)                 │
│   430, 480, 410, 390, 410, 480, ...         │
│ F3: 4 thông số timing (s)                   │
│   6, 3, 1, 0                                │
│ F4: 9 thông số process                      │
│   2.9, 0, 0.5, 0.3, 20.0, 0.15, ...        │
└────────────────────────────────────────────┘
```

### 5.2 Đề Xuất Bảng DB

```sql
CREATE TABLE forming_conditions (
  condition_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(machine_id),
  product_id UUID NOT NULL REFERENCES products(product_id),
  -- Thiết lập
  cav_type_id UUID REFERENCES cav_types(cav_type_id),
  frame_type TEXT,             -- TYPE khung
  plug_used BOOLEAN,
  cutter_code TEXT,
  stacking_upper TEXT,
  stacking_lower TEXT,
  heater_position_mm INT,
  mold_position TEXT,          -- 上型/下型
  -- Thông số (JSON arrays)
  f2_heater_zones JSONB,       -- 12 vùng nhiệt độ
  f3_timing JSONB,             -- 4 thông số timing
  f4_process JSONB,            -- 9 thông số process
  f5_extra JSONB,              -- Thông số bổ sung
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by TEXT,
  UNIQUE(machine_id, product_id)
);
```

> **Dữ liệu hiện có:** ~1,379 records trong Excel (46 cột mỗi record). Import sau khi có bảng.

### 5.3 Bộ Dụng Cụ Thành Hình (Tooling Set)

Mỗi lần chạy máy cần chuẩn bị đầy đủ bộ:

```
┌─── Phần trên (Upper) ──────────┐
│  Plug (gỗ)                     │
│  Áp lực Base (Pressure Base)   │
│  Stacking                      │
├─── Phần dưới (Lower) ──────────┤
│  Khuôn nhôm (Mold)            │
│  Đế nước lạnh (Water Cooling) │
│  Bàn dưới (Lower Table)       │
├─── Phần cắt (Cutting) ─────────┤
│  Dao cắt (Cutter)             │
│  Base dao (Cutter Base)       │
└─────────────────────────────────┘
```

> Tất cả các phần đều được quản lý vị trí trên kệ (rack_layers). Cần kiểm tra đầy đủ trước khi lên lịch sản xuất.

---

## 6. Nhân Sự & Tổ Chức

> **Nguồn:** `00_BUSINESS_OVERVIEW.md` (PO confirmed)

### 6.1 Cơ Cấu Tổ Chức (~20 nhân viên)

| Bộ phận | Vai trò | Nhân viên chính |
|---------|---------|-----------------|
| **Lãnh đạo** | Giám đốc | 吉田社長 |
| **Kinh doanh (営業)** | Sales Director | 小林 (Kobayashi) — 1,583 emails |
| **Thiết kế (設計)** | Design Lead (VN) | クアン (Quan) — 467 emails |
| **Vận hành (業務)** | Office Operations | 桜井 (Sakurai) — 108 emails |
| **QC/Khuôn (品質/金型)** | QC + Mold Mgmt | 中村 (Nakamura) — 136 emails |
| **Đơn hàng (受注)** | Order Operations | 新井 (Arai) — 62 emails |
| **Logistics (出荷)** | Shipping | 山口 (Yamaguchi) — 40 emails |
| **Sản xuất (成形)** | Production | 谷口 (Taniguchi) — 9 emails |

### 6.2 Chứng Nhận

- **ISO 9001** — Quản lý chất lượng
- **ISO 14001** — Quản lý môi trường
- Hồ sơ hiệu chuẩn thiết bị: lưu trữ 10 năm

---

*Cập nhật lần cuối: 2026-07-02*
