# ADR-007: Shopfloor Tablet Cockpit & Equipment Lifecycle (Milestone 14)

**Trạng thái:** Accepted  
**Ngày:** 2026-09-04  
**Người quyết định:** Anh Thoan (Product Owner), PE (Kỹ thuật)  
**Bối cảnh:** Phiên thảo luận M14 Kickoff — AN đề xuất Phương án A+B, PE & anh Thoan chấp thuận toàn bộ scope

---

## Bối Cảnh

Sau khi hoàn thành Milestone 13 (Tray Production Schedule — Gantt + Grid + Machine Heatmap) và Security Hardening Sprint (Migration 091–092), hệ thống YSD-MS đã có đầy đủ năng lực lập kế hoạch sản xuất trên văn phòng. Tuy nhiên, **vòng lặp thực thi tại phân xưởng vẫn còn đứt gãy**:

- `/production/floor` hiện là placeholder (`🚧 このモジュールは開発中です`) — thợ đứng máy không có công cụ số để báo sản lượng, gá cuộn nhựa, hay cập nhật trạng thái ca dập.
- `/production/daily-logs` đã có khung giao diện (Forming & Press tabs) và Server Actions, nhưng DB có **0 rows** vì chưa có luồng ghi nhận thực tế từ xưởng.
- `/equipment/lifecycle` là placeholder — thiếu hoàn toàn cơ chế tích lũy `shot_count` và cảnh báo ngưỡng bảo trì dao/khuôn.
- Bảng `equipment` (`MOLD`, `CUTTER_INLINE`, `CUTTER_SEPARATE`) chưa có cột ngưỡng bảo trì (`maintenance_shot_threshold`), khiến cảnh báo "Cần mài dao" / "Cần vệ sinh khuôn" phải làm thủ công theo kinh nghiệm.

AN đề xuất kiến trúc **Dual-Sprint (Phương án A+B)** để biến hệ thống từ công cụ lập kế hoạch thành **hệ thống vận hành số hóa thực tế tại phân xưởng (Shopfloor Execution System)**.

---

## Các Phương Án Đã Xem Xét

### Phương án A — Sprint 1: Shopfloor Tablet Cockpit
Xây dựng UI touch-friendly tại `/production/floor` cho thợ đứng tại 14 máy dập (`MACH-1` → `MACH-14`). Quy trình 3 bước 1 chạm: Bắt đầu ca → Gá cuộn nhựa → Kết thúc & báo sản lượng. Tự động ghi `material_consumption_logs` và trừ kho cuộn nhựa.

### Phương án B — Sprint 2: Daily Logs & Equipment Lifecycle
Kích hoạt luồng ghi nhật ký ca thực tế (`forming_daily_logs`, `press_daily_logs`) với checklist 7 thiết bị đầu ca và phân loại 7 nhóm phế phẩm NG (A→G). Xây dựng Dashboard Giám Sát Vòng Đời Thiết Bị tại `/equipment/lifecycle` với cơ chế ngưỡng cảnh báo tự động.

### Phương án chỉ A
Chỉ làm Shopfloor Tablet — thợ báo sản lượng được nhưng không có nhật ký ca chi tiết và không có cảnh báo bảo trì. Vẫn thiếu dữ liệu để quản lý tuổi thọ dao/khuôn.

### Phương án chỉ B
Chỉ làm Daily Logs — nhưng nhật ký ca sẽ vẫn phải nhập qua giao diện văn phòng, thiếu tính thực tiễn tại xưởng (tablet-first).

---

## Quyết Định: **Chọn Phương Án A+B (Dual-Sprint)**

Triển khai toàn bộ Milestone 14 theo 2 sprint song song, A và B bổ trợ nhau trực tiếp:

```
Shopfloor Tablet (A) ──→ báo sản lượng ──→ ghi forming_daily_logs (B)
                   ──→ ghi shot_count ──→ kích hoạt lifecycle alerts (B)
                   ──→ trừ kho cuộn nhựa ──→ material_consumption_logs
```

---

## Quyết Định Chi Tiết

### Sprint 1 (M14-S1): Shopfloor Tablet Cockpit (`/production/floor`)

#### UX/UI Principles (Tablet-First, Operator-Friendly)
- **Touch-optimized:** Nút tối thiểu 48px, cỡ chữ 16–20px, độ tương phản cao cho môi trường xưởng.
- **Auto machine memory:** `machine_id` lưu vào `localStorage` — tablet gắn tại máy nào tự nhận diện máy đó, không cần chọn lại mỗi ca.
- **Song ngữ động:** Chuyển đổi Nhật / Việt (`useTranslations`) phục vụ quản lý người Nhật và công nhân Việt Nam.

#### Luồng 3 Bước (3-Touch Workflow)

| Bước | Hành động | Cập nhật DB |
|------|-----------|-------------|
| **① BẮT ĐẦU (開始)** | Công nhân bấm Start ca dập | `production_schedules.status = 'IN_PROGRESS'` |
| **② GÁ CUỘN NHỰA (原反セット)** | Quét barcode hoặc chọn cuộn từ danh sách `plastic_receipt_roll` | `production_schedules.roll_id = <roll_id>` |
| **③ KẾT THÚC & BÁO SẢN LƯỢNG (完了報告)** | Nhập `actual_quantity` bằng numpad số to; hệ thống tự gợi ý số mét nhựa tiêu hao | `production_schedules.status = 'COMPLETED'`, `actual_quantity`, ghi `material_consumption_logs`, trừ `plastic_receipt_roll.current_length_m` |

- **Công thức gợi ý tiêu hao nhựa:** `suggested_m = (actual_quantity × feed_length_mm) / 1000`
- Công nhân có thể xác nhận hoặc hiệu chỉnh số mét thực tế trước khi lưu.
- Hỗ trợ nút **"Thay cuộn nhựa giữa chừng"**: cho phép gắn tiếp cuộn thứ 2 vào cùng `schedule_id` khi cuộn cũ hết trước khi lệnh dập xong.

### Sprint 2 (M14-S2): Daily Logs & Equipment Lifecycle

#### Nhật Ký Ca Chi Tiết (Forming & Press Daily Logs)
- **Checklist 7 Thiết Bị Đầu Ca** (toggle 1 chạm Đạt/Chưa đạt):
  `check_mold`, `check_cutter`, `check_heater`, `check_plug`, `check_frame`, `check_water_base`, `check_stacking`
- **Bảng Phân Loại Phế Phẩm NG (7 nhóm chuẩn YSD):**
  `qty_ng_a` (Ba-via), `qty_ng_b` (Biến dạng), `qty_ng_c` (Cháy nhiệt), `qty_ng_d` (Mỏng đáy), `qty_ng_e` (Rách góc), `qty_ng_f` (Bọt khí), `qty_ng_g` (Bẩn)
- **Nhật Ký Dập Cắt (`press_daily_logs`):** `shot_count` và `cutter_condition` (`NORMAL` / `WORN` / `CHIPPED`)
- **Logic Shot Count:**
  - Mặc định: `shot_count = actual_quantity / cav_count` (tự tính từ số cavity của khuôn trong `design_revisions`)
  - Công nhân có thể nhập trực tiếp nếu biết số shot thực tế

#### Dashboard Vòng Đời Thiết Bị (`/equipment/lifecycle`)
- Nâng cấp từ placeholder thành **Maintenance Cockpit**:
  - Tự động tích lũy `accumulated_shots` từ `press_daily_logs.shot_count` theo `equipment_id`
  - **Ngưỡng Cảnh Báo Chuẩn YSD:**

| Loại thiết bị | Ngưỡng Vàng (WARNING) | Ngưỡng Đỏ (OVERDUE) | Hành động đề xuất |
|---|---|---|---|
| `CUTTER_INLINE`, `CUTTER_SEPARATE` | 40,000 shots | 50,000 shots | Cần mài dao (刃研ぎ) |
| `MOLD` | 80,000 shots | 100,000 shots | Kiểm tra / vệ sinh lỗ hút khí |
| `PLUG` | 60,000 shots | 80,000 shots | Kiểm tra bề mặt plug |

  - Thanh tiến độ tuổi thọ và badge cảnh báo hiển thị đồng bộ trên: Equipment List, Gantt Schedule, Shopfloor Tablet.

---

## Nâng Cấp Schema (Migration 093)

Để kết nối 2 sprint thành thể thống nhất, Migration 093 sẽ bổ sung:

### 1. Liên kết Schedule với Daily Logs
```sql
ALTER TABLE forming_daily_logs
  ADD COLUMN schedule_id UUID REFERENCES production_schedules(schedule_id);

ALTER TABLE press_daily_logs
  ADD COLUMN schedule_id UUID REFERENCES production_schedules(schedule_id);
```
Giúp liên kết chính xác nhật ký ca với đúng phiên chạy lịch dập trên máy.

### 2. Cấu hình Ngưỡng Bảo Trì trên Bảng `equipment`
```sql
ALTER TABLE equipment
  ADD COLUMN maintenance_shot_threshold INTEGER DEFAULT 50000,
  ADD COLUMN shots_at_last_maintenance  INTEGER DEFAULT 0;
```
Ngưỡng có thể override per-equipment (ví dụ khuôn đặc biệt thay đổi ngưỡng mặc định).

### 3. View `v_equipment_lifecycle_status`
```sql
CREATE VIEW v_equipment_lifecycle_status AS
SELECT
  e.equipment_id,
  e.equipment_code,
  e.display_name,
  e.equipment_type,
  e.maintenance_shot_threshold,
  e.shots_at_last_maintenance,
  COALESCE(SUM(p.shot_count), 0)                          AS total_shots,
  COALESCE(SUM(p.shot_count), 0) - e.shots_at_last_maintenance AS current_shots_since_service,
  ROUND(
    (COALESCE(SUM(p.shot_count), 0) - e.shots_at_last_maintenance)::numeric
    / NULLIF(e.maintenance_shot_threshold, 0) * 100, 1
  )                                                        AS pct_life_used,
  CASE
    WHEN (COALESCE(SUM(p.shot_count), 0) - e.shots_at_last_maintenance)
         >= e.maintenance_shot_threshold              THEN 'OVERDUE'
    WHEN (COALESCE(SUM(p.shot_count), 0) - e.shots_at_last_maintenance)
         >= e.maintenance_shot_threshold * 0.8        THEN 'WARNING'
    ELSE 'NORMAL'
  END                                                      AS lifecycle_status
FROM equipment e
LEFT JOIN press_daily_logs p ON p.equipment_id = e.equipment_id
GROUP BY e.equipment_id;
```

---

## Tương Thích Ngược

- **ADR-001 (Unified Equipment):** Không ảnh hưởng — lifecycle view vẫn đọc từ bảng `equipment` duy nhất.
- **ADR-002 (Work Order Option C):** Không ảnh hưởng — Shopfloor Tablet đọc `production_schedules` (liên kết `work_order_id`), không thay đổi luồng WO.
- **ADR-003 (Separate Equipment Jobs):** Bổ trợ — `shot_count` được tích lũy đúng per-equipment nhờ 1 Job = 1 Equipment.
- **ADR-006 (Multi-Perspective Schedule):** Bổ trợ — Tablet cockpit là "góc nhìn thứ 4": theo máy vật lý (`machine_id`) theo thời gian thực, khác với 3 góc nhìn đã định nghĩa trong ADR-006.

---

## Hệ Quả

1. `/production/floor` trở thành điểm chạm số duy nhất giữa công nhân phân xưởng và hệ thống — thay thế hoàn toàn việc báo sản lượng qua giấy tờ / Excel.
2. `forming_daily_logs` và `press_daily_logs` bắt đầu có dữ liệu thực từ luồng Shopfloor Tablet, không phụ thuộc nhập thủ công từ văn phòng.
3. `/equipment/lifecycle` cung cấp visibility đầu tiên về tuổi thọ dao/khuôn — nền tảng để mở rộng sang Planned Maintenance (M15+).
4. `v_equipment_lifecycle_status` là SSOT cho mọi widget cảnh báo bảo trì trên toàn hệ thống.
5. **Migration 093** cần PE apply qua MCP sau khi AN soạn xong file SQL — tuân thủ Playbook Rule về IPv6 direct DB.
6. **Tech Debt tạo ra:** TD-013 — Migration script tách 75 legacy jobs gộp nhiều `ItemTypeID` (đã ghi nhận từ ADR-006) cần hoàn thành trước khi lifecycle stats legacy có thể tin cậy.
