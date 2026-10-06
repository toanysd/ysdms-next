# BÁO CÁO TINH LỌC DỮ LIỆU ACCESS & MA TRẬN PHÂN LOẠI 82 BẢNG
**Dự án:** YSDMS NextGen — Hệ thống Quản trị Sản xuất & Khuôn mẫu YSD  
**Thời gian lập:** 2026-10-06 15:55 JST  
**Thực hiện:** AN (Antigravity) theo định hướng của PE và Minh Chủ Thoan [Stamp: 2026-10-06 15:40 JST]  
**Thẩm định & Kiến trúc:** PE (Perplexity Pro)  
**Trạng thái phân loại:** **Đặc tả & Báo cáo Ma trận Tinh lọc Vòng A (Vòng A — Audit Phân loại Chỉ-đọc)**  

---

## 1. TIẾP THU ĐỊNH HƯỚNG VÀ HIỆU CHỈNH NGUYÊN TẮC KIẾN TRÚC

Theo chỉ đạo của Minh Chủ Thoan và Kiến trúc sư trưởng PE, AN đã điều chỉnh toàn diện nhận thức và phương pháp phân loại:
1. **Chuyển dịch mục tiêu:** Từ *"Import Access vào Supabase"* sang **"Access Delta Reconciliation"** — Supabase là nguồn sự thật duy nhất (SSOT), Access chỉ là nguồn đối soát bổ sung các bản ghi vận hành mới hoặc thiếu trong giai đoạn chuyển tiếp, tuyệt đối không tạo hệ thống song song thứ hai.
2. **Tách biệt rạch ròi 2 nhóm vật tư & vật liệu:**
   - **Nhóm 1: Nhựa định hình sản phẩm khay (`tblPlastic...`, `tblPLASTICforForming`)**: Thuần túy là **Tham chiếu vật liệu thiết kế (MATERIAL_REFERENCE & DESIGN_SPEC)** cho khay thành phẩm và revision khuôn. Tuyệt đối KHÔNG PHẢI là hệ thống quản lý kho cuộn màng nhựa, không có barcode, không có tồn kho mét/kg, không có giao dịch WMS.
   - **Nhóm 2: Vật tư & Phôi gia công cơ khí khuôn (`DatHangVTTbl`, `VatTuTbl`, `VatTuSDtbl`)**: Là **Vật tư gia công cơ khí khuôn thực tế** (phôi nhôm A5052, phôi thép, mũi dao phay CNC Ball Endmill / Square Endmill, găng tay bảo hộ và vật tư tiêu hao ca làm việc gắn trực tiếp với `JobID` và `WorkLogID`).

---

## 2. MA TRẬN PHÂN LOẠI TOÀN BỘ 82 BẢNG ACCESS (THEO CHUẨN ĐẶC TẢ PE)

Bảng phân loại chuẩn hóa gồm 17 cột thông tin bắt buộc, phân chia toàn bộ 82 bảng trong tập tin `ysdJOB_20261006.accdb`:

### 2.1. Nhóm A: Nguồn Vận hành Hằng ngày (Active Operational Source — Ưu tiên cao nhất)

| Tên bảng Access | Bộ phận phụ trách | Tính chất | Số dòng | Khóa chính | Lần cuối phát sinh | Đích Supabase | Khóa đích | Khớp | Mới | Xung đột | Mồ côi | Phân loại | Quyết định nạp | Vai trò dữ liệu | Tác động vận hành | Lý do nghiệp vụ |
|---|---|---|:---:|---|:---:|---|---|:---:|:---:|:---:|:---:|---|---|---|---|---|
| `tblJOB` | QLSX & Khuôn | Hằng ngày | 1,230 | `JobID` | 2026-10-06 | `work_orders`, `jobs` | `legacy_id` | 1,203 | 27 | 0 | 0 | `ACTIVE_OPERATIONAL_SOURCE` | `PILOT_STAGE_1` | `OPERATIONAL_RECORD` | `AFFECTS_JOB_INSTRUCTION` | 27 chỉ thị khuôn mới phát sinh từ cuối T8 đến 06/10/2026 |
| `tblProcessingDeadline` | QLSX & Khuôn | Hằng ngày | 2,527 | `ProcessingDeadlineID` | 2026-10-06 | `job_steps` | `legacy_id` | 2,446 | 81 | 0 | 20 | `ACTIVE_OPERATIONAL_SOURCE` | `PILOT_STAGE_1` | `OPERATIONAL_RECORD` | `AFFECTS_JOB_INSTRUCTION` | 55 steps thuộc 27 jobs mới, 26 steps bổ sung jobs cũ (20 steps giữ staging) |
| `tblWorkLog` | Xưởng cơ khí | Hằng ngày | 7,416 | `WorkLogID` | 2026-10-05 | `work_logs` | `legacy_id` | 7,105 | 311 | 0 | 94 | `ACTIVE_OPERATIONAL_SOURCE` | `PILOT_STAGE_1` | `OPERATIONAL_RECORD` | `AFFECTS_COST` | 210 logs phát sinh T8-T10/2026, 94 logs bảo trì xưởng giữ staging |
| `tblMoldBorrow` | Kho & Thiết bị | Vận hành/LS | 209 | `MoldBorrowID` | 2025-03-10 | `equipment_loans` | `loan_code` | 0 | 209 | 0 | 0 | `ACTIVE_OPERATIONAL_SOURCE` | `PILOT_STAGE_3` | `OPERATIONAL_RECORD` | `AFFECTS_LOAN` | Phiếu mượn khuôn Yoshida Package (Module M18), map enum chuẩn |
| `DatHangVTTbl` | Mua hàng khuôn | Hằng ngày | 1,396 | `IDMaDHVT` | 2026-09-30 | `mold_material_procurements` | `legacy_id` | 0 | 1,396 | 0 | 736 | `ACTIVE_OPERATIONAL_SOURCE` | `PILOT_STAGE_2` | `CONSUMPTION` | `AFFECTS_COST` | Đặt mua phôi nhôm, thép, dao phay CNC (660 dòng gắn trực tiếp với JobID) |
| `VatTuSDtbl` | Xưởng cơ khí | Hằng ngày | 64 | `IDVatTuSD` | 2026-08-15 | `work_log_material_usages` | `legacy_id` | 0 | 64 | 0 | 0 | `ACTIVE_OPERATIONAL_SOURCE` | `PILOT_STAGE_2` | `CONSUMPTION` | `AFFECTS_COST` | Vật tư tiêu hao từng ca làm việc (gỗ veneer, ốc cấy, lò xo gắn với WorkLogID) |

### 2.2. Nhóm B: Master & Thực thể đã có SSOT trên Supabase (Không import mù, chỉ kiểm tra delta)

| Tên bảng Access | Bộ phận phụ trách | Tính chất | Số dòng | Khóa chính | Đích Supabase | Khớp | Mới | Phân loại | Quyết định nạp | Vai trò dữ liệu | Lý do nghiệp vụ |
|---|---|---|:---:|---|---|:---:|:---:|---|---|---|---|
| `tblMold` | Kỹ thuật Khuôn | Master | 4,793 | `MoldID` | `equipment` (MOLD) | 4,736 | 57 | `MASTER_ALREADY_MAPPED` | `DELTA_ONLY_AUDIT` | `EQUIPMENT_MASTER` | SSOT tại equipment (4,736 khuôn), chỉ rà soát delta 57 khuôn |
| `tblCutter` | Kỹ thuật Khuôn | Master | 1,729 | `CutterID` | `equipment` (CUTTER) | 1,729 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `EQUIPMENT_MASTER` | Đã đồng bộ 100% sang equipment (1,731 dao cắt trên Supabase) |
| `tblMoldDesign` | Thiết kế CAD | Master | 4,781 | `MoldDesignID` | `design_revisions` | 4,693 | 88 | `MASTER_ALREADY_MAPPED` | `DELTA_ONLY_AUDIT` | `DESIGN_SPEC` | SSOT tại design_revisions, chỉ đối soát 88 revisions mới |
| `tblTray` | Kinh doanh/SP | Master | 4,112 | `TrayID` | `products` | 4,112 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | Toàn bộ 4,112 khay đã có trong 8,489 sản phẩm trên Supabase |
| `tblMoldCutter` | Kỹ thuật Khuôn | Quan hệ | 2,738 | `ID` | `equipment_assignments`| 1,633 | 1,105| `MASTER_ALREADY_MAPPED` | `DELTA_ONLY_AUDIT` | `EQUIPMENT_MASTER` | Rà soát liên kết khuôn - dao gá lắp chung N:N |
| `tblCompany` | Kinh doanh | Master | 1,725 | `CompanyID` | `companies` | 1,725 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | Toàn bộ đối tác đã có trong 2,214 companies trên Supabase |
| `tblCustomer` | Kinh doanh | Master | 415 | `CustomerID` | `companies` | 415 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | Khách hàng gia công cơ khí đã hợp nhất vào companies |
| `tblTrayCustomer` | Kinh doanh | Quan hệ | 1,069 | `ID` | `products.company_id` | 1,069 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | Quan hệ SP-Khách hàng đã gán trực tiếp vào products |
| `tblEmployee` | Nhân sự | Master | 23 | `EmployeeID` | `employees` | 23 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | 23 nhân viên xưởng đã có trong 25 employees trên Supabase |
| `tblMachine` | Thiết bị xưởng | Master | 14 | `MachineID` | `machines` | 14 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `EQUIPMENT_MASTER` | Khớp 100% 14/14 máy phay CNC trên Supabase |
| `tblProcessingCode` | Kỹ thuật | Master | 53 | `ProcessingCodeID` | `processing_codes` | 53 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `PRODUCTION_INSTRUCTION_SPEC` | Mã nguyên công gia công chi tiết đã đồng bộ |
| `tblProcessingItem` | Kỹ thuật | Master | 20 | `ProcessingItemID` | `processing_items` | 20 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `PRODUCTION_INSTRUCTION_SPEC` | Hạng mục đối tượng gia công đã đồng bộ |
| `tblProcessingStatus`| Kỹ thuật | Master | 13 | `ProcessingStatusID`| `processing_statuses` | 13 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `PRODUCTION_INSTRUCTION_SPEC` | Trạng thái công đoạn gia công đã đồng bộ |
| `tblRack` | Quản lý kho | Master | 90 | `RackID` | `racks` | 90 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `EQUIPMENT_MASTER` | Kệ chứa khuôn đã đồng bộ sang Supabase racks |
| `tblRackLayer` | Quản lý kho | Master | 400 | `RackLayerID` | `rack_layers` | 400 | 0 | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `EQUIPMENT_MASTER` | Tầng kệ chứa đã đồng bộ sang rack_layers |

### 2.3. Nhóm C: Vật liệu Nhựa Định hình & Vật tư Cơ khí

| Tên bảng Access | Bộ phận | Tính chất | Số dòng | Khóa chính | Đích Supabase | Phân loại | Quyết định nạp | Vai trò dữ liệu | Tác động vận hành | Lý do nghiệp vụ |
|---|---|---|:---:|---|---|---|---|---|---|---|
| `VatTuTbl` | Mua hàng | Master VT | 723 | `MSVatTu` | `machining_materials` | `UNMAPPED_REQUIRES_SPEC` | `PILOT_STAGE_2` | `MATERIAL_REFERENCE` | `AFFECTS_COST` | Master phôi nhôm A5052, thép, dao phay CNC |
| `tblPLASTICforForming` | CAD/CAM | Spec thiết kế | 330 | `PlasticForFormingID` | `design_revisions` | `REFERENCE_ONLY` | `NO_IMPORT_DESIGN_SPEC_ONLY` | `DESIGN_SPEC` | `AFFECTS_PRODUCT_OR_DESIGN` | Thông số nhựa định hình gắn 100% với MoldDesignID |
| `tblPlasticMaterial` | Kỹ thuật | Master | 5 | `PlasticMaterialID` | `plastic_master` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `MATERIAL_REFERENCE` | `AFFECTS_PRODUCT_OR_DESIGN` | Chất liệu cơ bản (PET, PP, PS...), đã có trong plastic_master |
| `tblPlasticGroup` | Kỹ thuật | Phân nhóm | 17 | `PlasticGroupID` | `plastic_groups` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `MATERIAL_REFERENCE` | `AFFECTS_PRODUCT_OR_DESIGN` | Nhóm phân loại tính chất nhựa, thuần túy tra cứu |
| `tblPlasticColor` | Kỹ thuật | Màu sắc | 7 | `PlasticColorID` | `plastic_colors` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `MATERIAL_REFERENCE` | `AFFECTS_PRODUCT_OR_DESIGN` | Màu sắc màng nhựa (Trong, Tự nhiên, Xanh...) |
| `tblPlasticThickness`| Kỹ thuật | Độ dày | 25 | `PlasticThicknessID` | `products.thickness_mm`| `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `MATERIAL_REFERENCE` | `AFFECTS_PRODUCT_OR_DESIGN` | Danh mục độ dày màng nhựa (0.25t, 0.3t, 0.5t...) |
| `tblPlasticWidth` | Kỹ thuật | Khổ màng | 26 | `PlasticWidthID` | `products.film_width_mm`| `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `MATERIAL_REFERENCE` | `AFFECTS_PRODUCT_OR_DESIGN` | Chiều rộng cuộn nhựa (350, 520, 640...) |
| `tblPlasticLength` | Kỹ thuật | Bước cấp | 24 | `PlasticLengthID` | `products.feed_length_mm`| `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `MATERIAL_REFERENCE` | `AFFECTS_PRODUCT_OR_DESIGN` | Chiều dài bước cấp màng mỏng |
| `tblPlasticStaticCharge`| Kỹ thuật | Chống tĩnh điện| 22 | `PlasticStaticChargeID` | `plastic_static_charges`| `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `MATERIAL_REFERENCE` | `AFFECTS_PRODUCT_OR_DESIGN` | Tiêu chuẩn chống tĩnh điện, dẫn điện |
| `tblPlasticCompany` | Mua hàng | Ký hiệu NCC | 23 | `PlasticCompanyID` | `plastic_suppliers` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `MATERIAL_REFERENCE` | `AFFECTS_PRODUCT_OR_DESIGN` | Ký hiệu nhà cung cấp màng nhựa (VN, SR, AB...) |

### 2.4. Nhóm D: Lịch sử, Vận chuyển, Sửa chữa & Kiểm kê

| Tên bảng Access | Bộ phận | Tính chất | Số dòng | Khóa chính | Đích Supabase | Phân loại | Quyết định nạp | Vai trò dữ liệu | Tác động vận hành | Lý do nghiệp vụ |
|---|---|---|:---:|---|---|---|---|---|---|---|
| `tblTeflonLog` | Quản lý khuôn | Bảo dưỡng | 4,692 | `TeflonLogID` | `equipment_history` / `teflon_coatings` | `UNMAPPED_REQUIRES_SPEC` | `PILOT_STAGE_4` | `OPERATIONAL_RECORD` | `AFFECTS_COST` | Nhật ký phủ Teflon định kỳ cho khuôn (SentDate, Cost) |
| `tblLocationLog` | Thủ kho khuôn | Vị trí | 1,488 | `LocationLogID`| `equipment_history` | `HISTORICAL_DELTA` | `PILOT_STAGE_4` | `OPERATIONAL_RECORD` | `NONE` | Nhật ký di chuyển tầng kệ chứa khuôn/dao |
| `tblShipLog` | Vận chuyển | Xuất khuôn | 358 | `ShipID` | `equipment_loans` / `history` | `HISTORICAL_DELTA` | `PILOT_STAGE_4` | `OPERATIONAL_RECORD` | `AFFECTS_LOAN` | Nhật ký vận chuyển/xuất trả khuôn cho khách hàng |
| `statuslogs` | Kiểm kê (棚卸) | Audit | 398 | `StatusLogID` | `inventory_audits` | `HISTORICAL_DELTA` | `PILOT_STAGE_4` | `OPERATIONAL_RECORD` | `NONE` | Dữ liệu kiểm kê kệ khuôn theo SessionID |
| `tblMoldLog` | Kỹ thuật khuôn | Cải tạo | 36 | `MoldLogID` | `equipment_history` | `HISTORICAL_DELTA` | `PILOT_STAGE_4` | `OPERATIONAL_RECORD` | `AFFECTS_PRODUCT_OR_DESIGN` | Nhật ký đổi thiết kế khuôn (OldDesign -> NewDesign) |
| `tblCutterLog` | Kỹ thuật khuôn | Sửa dao | 21 | `CutterLogID` | `equipment_history` | `HISTORICAL_DELTA` | `PILOT_STAGE_4` | `OPERATIONAL_RECORD` | `AFFECTS_PRODUCT_OR_DESIGN` | Nhật ký gửi mài/gia công lại dao cắt khuôn |
| `tblCalendar` | QLSX | Lịch xưởng | 730 | `ID` | `work_calendars` | `REFERENCE_ONLY` | `HOLD_REFERENCE_VERIFY` | `MATERIAL_REFERENCE` | `NONE` | Lịch làm việc/ngày nghỉ nhà máy 2025–2026 |
| `tblCase` | Đóng gói | Thùng carton | 18 | `CaseID` | `packaging_specs` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `PRODUCTION_INSTRUCTION_SPEC` | `NONE` | Quy cách thùng carton đóng gói khay |
| `destinations` | Xuất hàng | Điểm giao | 16 | `DestinationID` | `delivery_sites` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | `NONE` | Địa điểm giao hàng đã tích hợp trong delivery_sites |
| `tblCav` | CAD/CAM | Quy cách Cav | 57 | `CAVID` | `cav_types` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `DESIGN_SPEC` | `AFFECTS_PRODUCT_OR_DESIGN` | Quy cách bố trí số cavity trên khuôn |
| `tblResponsiblePerson`| Kỹ thuật | Nhân sự | 13 | `ResponsiblePersonID` | `employees` | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | `NONE` | Tập con của employees |
| `tblItemType` | Kỹ thuật | Loại đối tượng | 11 | `ItemTypeID` | `equipment_types` | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `PRODUCTION_INSTRUCTION_SPEC` | `NONE` | Phân loại đối tượng gia công |
| `tblEmployee_old` | Nhân sự | Lịch sử | 7 | `EmployeeID` | `employees (inactive)` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | `NONE` | Nhân viên cũ đã nghỉ việc |
| `tblMachiningCustomer`| Kinh doanh | Khách cơ khí | 5 | `MachiningCustomerID`| `companies` | `MASTER_ALREADY_MAPPED` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | `NONE` | Nhóm khách hàng cơ khí |
| `tblDefect` | QC | Lỗi khuôn | 4 | `DefectID` | `defect_types` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `PRODUCTION_INSTRUCTION_SPEC` | `NONE` | Danh mục mã lỗi gia công |
| `tblStakings` | Kỹ thuật khuôn | Gá Stacking | 2 | `StakingsID` | `equipment` (STACKING) | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `EQUIPMENT_MASTER` | `NONE` | Danh mục cụm stacking |
| `tblTrayOrder` | Kinh doanh | Đơn thử khay | 2 | `TrayOrderID` | `orders` | `REFERENCE_ONLY` | `NO_IMPORT_ALREADY_SSOT` | `COMMERCIAL_MASTER` | `NONE` | Đơn hàng khay thử nghiệm cũ |

### 2.5. Nhóm E: Bảng Tạm, Clipboard hoặc Bảng Trống (Tuyệt đối bỏ qua)

| Tên bảng Access | Số dòng | Phân loại | Quyết định | Lý do |
|---|:---:|---|---|---|
| `scraplog` | 0 | `TEMPORARY_ACCESS_ARTIFACT` | `IGNORE_PENDING_REVIEW` | Bảng phế phẩm trống 0 dòng trong Access |
| `tblMoldDesignLog` | 0 | `TEMPORARY_ACCESS_ARTIFACT` | `IGNORE_PENDING_REVIEW` | Bảng log thiết kế trống 0 dòng trong Access |
| `~TMPCLP...` (32 bảng) | 0–12 | `TEMPORARY_ACCESS_ARTIFACT` | `IGNORE_PENDING_REVIEW` | Bảng tạm clipboard Access sinh ra khi copy-paste controls giao diện |

---

## 3. PHÂN TÍCH CHUYÊN SÂU CHUỖI LIÊN KẾT THỰC TẾ

```mermaid
flowchart TD
    subgraph SP [Sản phẩm & Khách hàng]
        Tray["tblTray (4,112 rows)<br/>[products]"]
        Customer["tblCustomer / tblCompany<br/>[companies]"]
        Customer -->|CustomerID| Tray
    end

    subgraph Design [Thiết kế Khuôn]
        MoldDesign["tblMoldDesign (4,781 rows)<br/>[design_revisions]"]
        Tray -->|1:N (TrayID)| MoldDesign
        PlasticComb["tblPLASTICforForming (330 rows)<br/>[Design Spec]"]
        MoldDesign -->|1:1 (MoldDesignID)| PlasticComb
        PlasticLookups["tblPlastic... (Material, Color, Thickness...)<br/>[plastic_master / specs]"]
        PlasticLookups -.->|Lookup| PlasticComb
        PlasticLookups -.->|Sinh chuỗi| MoldDesign
    end

    subgraph Machining [Chỉ thị & Gia công Khuôn]
        JOB["tblJOB (1,230 rows)<br/>[work_orders / jobs]"]
        MoldDesign -->|MoldDesignID| JOB
        Equipment["tblMold / tblCutter (6,522 rows)<br/>[equipment]"]
        Equipment -->|MoldID / CutterID| JOB
        Deadline["tblProcessingDeadline (2,527 rows)<br/>[job_steps]"]
        JOB -->|1:N (JobID)| Deadline
        WorkLog["tblWorkLog (7,416 rows)<br/>[work_logs]"]
        Deadline -->|1:N (DeadlineID)| WorkLog
    end

    subgraph Tooling [Vật tư Cơ khí Khuôn]
        DatHang["DatHangVTTbl (1,396 rows)<br/>[Procurement]"]
        JOB -->|JobID (660 rows)| DatHang
        VatTu["VatTuTbl (723 rows)<br/>[Nhôm A5052, Mũi Dao CNC]"]
        VatTu -->|MSVatTu| DatHang
        VatTuSD["VatTuSDtbl (64 rows)<br/>[Tiêu hao ca làm việc]"]
        WorkLog -->|WorkLogID| VatTuSD
        VatTu -->|MSVatTu| VatTuSD
    end
```

### 3.1. Phân tích thực nghiệm quan hệ `tblTray` ↔ `tblMoldDesign` (Quan hệ 1:N)
- Kiểm tra truy vấn thực tế: Có **3,870 mã khay (`TrayID`)** xuất hiện trong `tblMoldDesign`.
- Có **296 mã khay có từ 2 đến hàng chục thiết kế/revision khuôn khác nhau**:
  * `TrayID 4734`: có 230 bản ghi khuôn (khay chuẩn dùng chung khuôn ghép).
  * `TrayID 2`: có 186 bản ghi khuôn.
  * Các khay tiêu chuẩn khác có từ 2 đến 5 revisions (`R1`, `R2`, `R3`).
- **Kết luận:** Khẳng định 100% tính đúng đắn của quan hệ **1:N giữa `products` và `design_revisions`**.

### 3.2. Bản chất các bảng nhựa `tblPlastic...` vs `DatHangVTTbl` / `VatTuTbl`
- **Nhựa định hình (`tblPlastic...` & `tblPLASTICforForming`)**:
  * Toàn bộ 9 bảng nhựa trong Access **KHÔNG CÓ BẤT KỲ CỘT NÀO** liên quan đến cuộn (`roll_code`, `barcode`), chiều dài mét còn lại (`remaining_meters`), số lượng tồn kho (`stock_qty`), hay ngày nhập xuất kho (`receipt_date`).
  * `tblPLASTICforForming` (330 dòng): 100% bản ghi gắn trực tiếp với `MoldDesignID` (`design_revisions`). Đây là cấu hình quy cách nhựa thiết kế cho từng bộ khuôn.
  * Đúng như nhận định của Minh Chủ Thoan và PE, các bảng này thuộc **Nhóm P1 (MATERIAL_REFERENCE & DESIGN_SPEC)**, tuyệt đối không đưa vào WMS.
- **Vật tư gia công cơ khí khuôn (`DatHangVTTbl`, `VatTuTbl`, `VatTuSDtbl`)**:
  * `VatTuTbl` (723 dòng): Chứa phôi nhôm (`A5052 80x351x600 切板`), mũi dao phay CNC (`ボールエンドミル CSEB 2060-1200`), găng tay bảo hộ chịu dầu xưởng cơ khí.
  * `DatHangVTTbl` (1,396 dòng): Chứa thông tin đặt mua phôi nhôm/thép cho từng Job gia công (`JobID` xuất hiện ở 660 dòng, có ngày nhận hàng, đơn giá, số lượng, trạng thái đã nhận hàng).
  * `VatTuSDtbl` (64 dòng): Chứa vật tư đã tiêu hao theo từng ca làm việc của thợ xưởng (gỗ veneer, ốc cấy, lò xo gắn trực tiếp với `WorkLogID`).

---

## 4. BẰNG CHỨNG GIẢI TRÌNH & HIỆU CHỈNH 6 ĐIỂM THEO YÊU CẦU CỦA PE

### 4.1. Bằng chứng Bảng `mold_work_orders` đã bị DEPRECATED
- **Bằng chứng Schema Supabase Production:** Bảng `public.mold_work_orders` hiện có **0 dòng** trên Supabase.
- **Bằng chứng Kiến trúc ADR-002 (2026-08-10):** Quyết định chuẩn hóa theo **Work Order Model Option C (4 tầng)**:
  `work_orders` (Chỉ thị tổng) $\rightarrow$ `jobs` (1 job = 1 thiết bị) $\rightarrow$ `job_steps` (công đoạn) $\rightarrow$ `work_logs` (giờ công Nippo).
- **Bằng chứng Mã nguồn Active Code (`src/`):** Tìm kiếm toàn bộ codebase `src/` xác nhận:
  * Không có bất kỳ trang UI (`page.tsx`), component hay Server Action nào tham chiếu đến `mold_work_orders`.
  * `mold_work_orders` chỉ xuất hiện trong file type tự sinh `src/types/database.types.ts`.
  * Toàn bộ màn hình Kanban, Gantt, Tạo nhanh (`quick-mold-job.ts`) đều sử dụng `work_orders` và `jobs`.
- **Kết luận:** Không bao giờ nạp dữ liệu vào `mold_work_orders`.

### 4.2. Hiệu chỉnh Enum bảng `equipment_loans` theo đúng Migration 097/098
AN nghiêm túc tiếp thu cảnh báo của PE. Việc đề xuất `status = 'ACTIVE'` và `loan_type = 'OUTGOING'` trước đó là lỗi mapping.  
Kiểm tra trực tiếp file Migration `20260907000004_097_equipment_loans.sql` xác nhận Check Constraint chặt chẽ của database:
- **`loan_type` BẮT BUỘC IN:** `('BORROW', 'RETURN', 'REPAIR_OUT')`.
- **`status` BẮT BUỘC IN:** `('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'IN_TRANSIT', 'RETURNED', 'CANCELLED')`.
- **Constraint ràng buộc:** `scheduled_return_date IS NOT NULL OR loan_type = 'RETURN'`.
- **Quy tắc mapping chuẩn hóa mới:**
  * Toàn bộ 209 hồ sơ mượn khuôn từ Access `tblMoldBorrow` sẽ được map thành: `loan_type = 'BORROW'`, `status = 'APPROVED'` (đối với hồ sơ đã duyệt/bàn giao lịch sử) hoặc `'RETURNED'` (nếu đã có ngày trả thực tế), và bắt buộc tính toán `scheduled_return_date`.

### 4.3. Bản chất 20 Job Steps có `JobID = NULL` trong `tblProcessingDeadline`
- Kiểm tra chi tiết 20 dòng này: Toàn bộ là các công đoạn gia công chi tiết phụ trợ (nhôm tấm, plug, dao) được tạo độc lập trong Access (từ năm 2024–2025) mà thợ xưởng không gán mã Job cha.
- Trong đó có 7 công đoạn có phát sinh work logs gắn vào.
- **Quyết định:** Phân loại là `HOLD_STAGING_UNRESOLVED_PARENT`. Tuyệt đối **không tự tạo Job giả** trên Production; dữ liệu này sẽ được giữ lại trên Staging chờ xác nhận của quản lý xưởng.

### 4.4. Bản chất 94 Work Logs có `ProcessingDeadlineID = NULL` trong `tblWorkLog`
- Đọc nội dung cột ghi chú (`ProcessingNotes`) của 94 dòng này:
  * `コンプレッサー故障の対応` (Xử lý sự cố hỏng máy nén khí xưởng)
  * `金型掃除・穴あけ` (Vệ sinh khuôn xưởng / khoan lỗ thoát khí)
  * `２面スタッキング` / `スタッキング下部` (Gia công cụm Stacking nội bộ)
  * `改善・寸法変更` / `改善` (Công việc cải tiến xưởng / Kaizen)
- **Bản chất thực tế:** Đây là **Giờ công bảo trì xưởng cơ khí, sửa chữa máy móc và Kaizen nội bộ**! Trong thực tế vận hành xưởng YSD, khi công nhân thực hiện bảo trì máy, họ không có mã đơn hàng khách hàng (`JobID`) hay hạn định (`ProcessingDeadlineID`).
- Do bảng `work_logs` trên Supabase có ràng buộc `job_id NOT NULL`, 94 dòng này trước đây bị script sync bỏ qua.
- **Quyết định:** Đánh dấu trạng thái `HOLD_INTERNAL_TASK_NEEDS_JOB_SPEC`. Đề xuất giải pháp kiến trúc: Cần tạo một Job nội bộ đại diện (ví dụ `JOB-INTERNAL-MAINTENANCE`) để gắn các giờ công bảo trì này, hoặc giữ nguyên trên Staging.

### 4.5. Nguồn gốc chính xác của 27 Jobs và 81 Steps MỚI
- **27 Jobs mới (JobID 1251 $\rightarrow$ 1278):** Toàn bộ có ngày bắt đầu và hạn giao hàng từ **29/08/2026 đến 19/10/2026**. Đây là các chỉ thị sản xuất khuôn thực tế phát sinh tại nhà máy sau đợt đồng bộ dữ liệu gần nhất (tháng 08/2026).
- **81 Steps mới:**
  * 55 steps gắn liền với 27 Jobs mới nêu trên.
  * 6 steps bổ sung cho 6 Jobs cũ đang chạy dở dang (JobID 623, 1170, 1247, 1248, 1249, 1250).
  * 20 steps độc lập có `JobID = NULL` (công việc phụ trợ không gán Job).

---

## 5. KẾT LUẬN & ĐỀ XUẤT BƯỚC TIẾP THEO

1. **Về An toàn Hệ thống:** Hoàn thành trọn vẹn Vòng A ở chế độ **100% Chỉ-đọc**, **0 thao tác ghi vào Supabase Production**, không tạo bảng staging, bảo toàn nguyên vẹn file Access.
2. **Về Mã nguồn:** Kiểm tra `npx tsc --noEmit` đạt **0 errors**.
3. **Đề xuất bước tiếp theo (Vòng B):**
   - Chờ PE thẩm định Ma trận phân loại 82 bảng.
   - Khi được phê duyệt, AN sẽ tiến hành soạn thảo **Đặc tả Pilot 1 (Chỉ thị khuôn & Nippo: 27 Jobs, 81 Steps, 311 Logs)** với đầy đủ schema staging, payload dry-run và cơ chế xử lý ngoại lệ cho 20 steps và 94 logs đặc thù.
