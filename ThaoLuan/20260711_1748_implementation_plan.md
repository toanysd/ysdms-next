# Kế hoạch Ánh xạ (Mapping) và Import Dữ liệu Access CSV (Cập nhật Mới nhất)

Bản kế hoạch này mô tả chi tiết quy trình di chuyển (migration) dữ liệu từ các file CSV của Access sang cơ sở dữ liệu Supabase theo đúng chuẩn Schema v3/v4 hiện hành (sau Migration 075, 076, 077 mới nhất).

## User Review Required

> [!IMPORTANT]
> **Điểm Kiểm tra Quan trọng (Audit Checklist):**
> 1. **Quan hệ Dao cắt (Cutter Relation):** Xác nhận dữ liệu dao cắt đi từ `cuttermaster.csv` (Cutter Master) -> `cutters.csv` (Cutter vật lý) -> `moldcutter.csv` (Junction `mold_design_cutters`).
> 2. **Khóa Ngoại & Khóa Chính:** Các bảng `racks` và `rack_layers` sử dụng cột khóa chính là `id` (thay vì `rack_id` hay `rack_layer_id`) để đồng bộ với DB DDL thực tế.
> 3. **Di chuyển Thiết bị Phụ trợ (Auxiliary Equipments):** Toàn bộ 46 bản ghi PB/WB cũ đang nằm lẫn lộn trong bảng `products` (hoặc `tray.csv`) sẽ được di chuyển sang bảng `auxiliary_equipments` độc lập với phân loại `item_type_id` phù hợp (5: WCB, 6: PB) và CAV Type tương thích.

---

## 1. Thứ tự Import và Di chuyển (Execution Order)

Để đảm bảo tính toàn vẹn dữ liệu (đáp ứng các ràng buộc khóa ngoại FK), quá trình import sẽ diễn ra tuần tự:
1. **`racks.csv` & `racklayers.csv`** → Bảng `racks` và `rack_layers` (Sử dụng khóa chính `id`).
2. **`tray.csv`** (Sản phẩm/Khay) → Bảng `products` (Thay thế hoàn toàn cho `mold_masters` cũ đã deprecated).
3. **`molddesign.csv`** (Thiết kế khuôn) → Bảng `design_revisions` (Liên kết với `products` qua `TrayID` -> `product_id`).
4. **`molds.csv`** (Khuôn vật lý) → Bảng `physical_molds` & `mold_revisions` (Sinh phiên bản khuôn tương ứng).
5. **`cuttermaster.csv`** (Thiết kế dao cắt) → Bảng `cutter_masters` (Mới bổ sung theo chuẩn V4).
6. **`cutters.csv`** (Dao cắt vật lý) → Bảng `cutters` (Sử dụng `cutter_no` làm khóa độc nhất thay cho `cutter_code` cũ).
7. **`moldcutter.csv`** (Quan hệ dao cắt - khuôn) → Bảng nối **`mold_design_cutters`** (Liên kết `cutter_id` và `design_revision_id`).
8. **Di chuyển PB/WB** → Lọc từ `products`/`tray.csv` các mã bắt đầu bằng `PB` hoặc `WB` để nạp vào bảng `auxiliary_equipments`.
9. **`jobs.csv` & `worklog.csv`** → Bảng `jobs` và `work_logs` (Liên kết lịch trình và tiến độ gia công).

---

## 2. Chi tiết Ánh xạ Cột (Field Mapping Specifications)

### 2.1. `racks.csv` & `racklayers.csv` → `racks` và `rack_layers`
* **Racks DDL:** Khóa chính `id`, khóa độc nhất `rack_code`.
  - `rack_code` ← `RackNumber`
  - `rack_name` ← `RackName` hoặc `RackSymbol`
  - `location_in_factory` ← `RackLocation`
  - `notes` ← `RackNotes`
* **Rack Layers DDL:** Khóa chính `id`, khóa độc nhất `layer_code` (`{RackID}-{RackLayerNumber}`).
  - `layer_number` ← `RackLayerNumber`
  - `notes` ← `RackLayerNotes`

### 2.2. `tray.csv` → `products` (Khay / Sản phẩm)
* **Bảng `mold_masters` cũ đã DEPRECATED**, tất cả khay được gom vào `products`.
  - `product_code` ← `TrayCode` (Mã YSD compact viết liền, ví dụ: ADY071)
  - `product_name_internal` ← `TrayName` (Tên hiển thị nội bộ, ví dụ: ADY-071)
  - `product_name` ← `CustomerTrayName` (Tên chính thức từ khách hàng)
  - `company_id` ← `CustomerID` (Khách đặt hàng)
  - `notes` ← `TrayOrderNotes`
  - `product_status` ← 'ACTIVE'

### 2.3. `molddesign.csv` → `design_revisions`
* **Sửa các cột kích thước cutline bị lệch chuẩn:**
  - `product_id` ← Tra cứu từ `TrayID` sang `products.product_id` đã import ở Bước 2.2.
  - `design_code` ← `MoldDesignCode`
  - `design_length` / `width` / `height` / `depth` ← `MoldDesignLength` / `Width` / `Height` / `Depth`
  - `cutline_length` ← **`CutlineX`** (Thay cho `CutlineLength` cũ không có trong CSV)
  - `cutline_width` ← **`CutlineY`** (Thay cho `CutlineWidth` cũ không có trong CSV)
  - `cavity_count` ← `CAVID` hoặc `PieceCount`
  - `pitch_mm` ← `Pitch`
  - `plug_type` ← `Plug` (Nếu 'TRUE' -> 'OWNED', ngược lại 'NONE')
  - `customer_tray_name` ← `CustomerTrayName`
  - `customer_equipment_no` ← `CustomerEquipmentNo`
  - `customer_drawing_no` ← `CustomerDrawingNo`

### 2.4. `molds.csv` → `physical_molds` & `mold_revisions`
* **Sinh tự động `mold_revisions` trung gian:** Khóa ngoại `mold_revision_id` liên kết khuôn vật lý với bản vẽ thiết kế (`MoldDesignID`).
  - `system_code` ← `MoldCode`
  - `display_name` ← `MoldName`
  - `device_status` ← `DeviceStatus` (Ví dụ: 'IN_USE')
  - `usage_status` ← `MoldUsageStatus` (Ví dụ: 'ACTIVE')
  - `actual_length_mm` ← `MoldLengthModified`
  - `actual_width_mm` ← `MoldWidthModified`
  - `actual_height_mm` ← `MoldHeightModified`
  - `actual_weight` ← `MoldWeight`
  - `keeper_company_id` ← `KeeperCompany`
  - `current_rack_layer_id` ← Tra cứu `RackLayerID` sang `rack_layers.id`
  - `notes` ← `MoldNotes`

### 2.5. `cuttermaster.csv` → `cutter_masters` (Thiết kế Dao cắt)
* **Bổ sung tầng Master quản lý bản vẽ dao cắt:**
  - `cutter_master_code` ← `CutterMasterCode`
  - `cutter_master_name` ← `CutterMasterName`
  - `company_id` ← `CustomerID`
  - `status` ← `Status` (Ví dụ: 'ACTIVE')

### 2.6. `cutters.csv` → `cutters` (Dao cắt vật lý)
* **Sử dụng đúng DDL đã thay đổi sau Migration 067:**
  - `cutter_no` ← `CutterNo` (Khóa độc nhất dạng chuỗi, ví dụ: "C-0105", không dùng `cutter_code` làm key)
  - `cutter_name` ← `CutterName`
  - `cutter_master_id` ← Tra cứu `CutterMasterID` sang `cutter_masters.cutter_master_id` ở Bước 2.5.
  - `cutter_design_code` ← `CutterCode` hoặc `CutterDesignCode`
  - `company_id` ← `CustomerID`
  - `cavity_count` ← `BladeCount` (Bảng DB đã rename `blade_count` -> `cavity_count`)
  - `pitch_mm` ← `Pitch`
  - `plastic_cut_type` ← `PlasticCutType`
  - `cutline_length` / `width` ← `CutlineLength` / `CutlineWidth`
  - `cutter_length_mm` ← `CutterLength` (Tên cột DB có hậu tố `_mm`)
  - `cutter_width_mm` ← `CutterWidth` (Tên cột DB có hậu tố `_mm`)
  - `cutter_height_mm` ← `CutterHeight` (Tên cột DB có hậu tố `_mm`)
  - `current_rack_layer_id` ← Tra cứu `RackLayerID` sang `rack_layers.id`
  - `keeper_company_id` ← `KeeperCompany`
  - `usage_status` ← `UsageStatus`

### 2.7. `moldcutter.csv` → `mold_design_cutters` (Bảng nối M:N)
* Bảng nối thể hiện quan hệ khuôn thiết kế và dao cắt dùng chung (Junction Table).
* **Migration 067 đã đổi cột `mold_design_id` → `design_revision_id`.**
  - `cutter_id` ← Tra cứu `CutterID` sang `cutters.cutter_id`
  - `design_revision_id` ← Tra cứu `MoldDesignID` sang `design_revisions.revision_id`
  - `notes` ← `MoldCutterNotes`
  - `date_entry` ← `DateEntry`

### 2.8. Di chuyển PB/WB → `auxiliary_equipments`
* Lọc từ `products` hoặc file `tray.csv` các bản ghi thiết bị phụ trợ (gồm 29 Pressure Base và 17 Water Cooling Base).
* **Quy tắc chuyển đổi:**
  - Nếu mã bắt đầu bằng `PB` (ví dụ: `PB590`) → `item_type_id` = 6 (PRESSURE_BASE)
  - Nếu mã bắt đầu bằng `WB` (ví dụ: `WB74530`) → `item_type_id` = 5 (WATER_COOLING_BASE)
  - `equipment_code` ← Chuẩn hóa lại mã (ví dụ: `PB-590`, `WB-74530`) theo quy chuẩn Thermoforming Set đã duyệt.
  - Tự động map `cav_type_id` nếu mã thiết bị chứa thông số CAV tương thích (ví dụ: `WB-74CZD` -> CAV `74C-ZD`).

### 2.9. `jobs.csv` → `jobs` (Lịch trình gia công)
* **Tương thích với Migration 078 bổ sung `auxiliary_equipment_id`:**
  - `job_code` ← `JobCode`
  - `job_name` ← `JobName`
  - `design_revision_id` ← Tra cứu `MoldDesignID`
  - `physical_mold_id` ← Tra cứu `MoldID`
  - `company_id` ← `MachiningCustomerID`
  - `outsource_company` ← `OutsourcingID`
  - `start_date` / `deadline` ← `JobStartDate` / `DeliveryDeadline`

---

## 3. Xác minh kịch bản Import (Verification)

* **Script đã nâng cấp:** `scripts/migrate_v4_final_import.ts` đã được refactor hoàn chỉnh theo toàn bộ các quy tắc sửa đổi trên.
* **Biên dịch:** Đã chạy `npx tsc scripts/migrate_v4_final_import.ts --noEmit` và đạt kết quả **0 lỗi**.
* **Đồng bộ hóa:** Tất cả tên bảng junction, hậu tố đơn vị đo (`_mm`), cột đổi tên (`blade_count` -> `cavity_count`), khóa chính của racks/rack_layers (`id`) đều khớp chính xác với CSDL thực tế.
