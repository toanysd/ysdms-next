# BÁO CÁO NGHIỆM THU AUDIT LOGIC ỨNG DỤNG ACCESS (GIAI ĐOẠN 1 — STATIC EXTRACTION PIPELINE)
**Mã báo cáo:** `2026-10-06_access_application_logic_audit_report`  
**Thời gian thực hiện:** 2026-10-06 16:15 JST  
**Người thực hiện:** AN (Antigravity Senior Engineer)  
**Cơ chế thi công:** 100% Chế độ Chỉ-Đọc Tĩnh (Static Extraction — Read-Only Mode)  
**Phê duyệt chỉ đạo:** Minh Chủ Thoan [Stamp: 2026-10-06 16:02 JST] & PE [Stamp: 2026-10-06 16:01 JST]

---

## 1. THÔNG SỐ FILE & MÔI TRƯỜNG THỰC THI (FILE METADATA & ENVIRONMENT)

| Thông số | Giá trị thực tế đã xác minh | Ghi chú kỹ thuật |
| :--- | :--- | :--- |
| **Đường dẫn file nguồn** | `D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb` | File vật lý trong kho dự án |
| **Dung lượng file** | **612,442,112 bytes** (584.07 MB) | Bảo toàn nguyên vẹn |
| **Mã băm SHA-256** | `1cb7cb09b279d0b104b586b05661e962211c8180245eed948558eba0b0591d5f` | Không suy hao dữ liệu |
| **Cơ chế đọc QueryDefs** | Microsoft DAO 3.6 / ACE Engine (`DAO.DBEngine.120`) | Truy xuất trực tiếp COM Engine (< 1s) |
| **Cơ chế đọc VBA / GUI** | Access Object Model (`Access.Application.SaveAsText` & `VBE.VBProjects`) | Đọc tĩnh không mở giao diện người dùng |
| **Kiểm soát an toàn** | **0 Macro chạy, 0 AutoExec, 0 RunSQL/Execute, 0 UI tương tác** | Đảm bảo tính toàn vẹn 100% |
| **Tác động Supabase** | **0 writes, 0 staging tables, 0 migration** | Chưa ghi bất kỳ dữ liệu nào |

---

## 2. TỔNG KẾT TÀI SẢN TRÍCH XUẤT TĨNH (INVENTORY & SIDE-EFFECT MATRIX)

Đã hoàn thành trích xuất toàn diện và đóng gói thành công 4 bộ hồ sơ JSON lưu trữ tại thư mục `scripts/`:

### 2.1. Phân loại QueryDefs (585 Queries) — `scripts/access_query_inventory.json`
- **Tổng số QueryDefs:** **585**
  - **Named Business Queries:** **107 queries** (truy vấn nghiệp vụ có tên định danh rõ ràng).
  - **Form / Report Embedded Queries:** **478 queries** (tiền tố `~sq_c...`, `~sq_f...`, `~sq_r...`).
- **Phân loại tác động (Side-effect Distribution):**
  - `READ_ONLY` (SELECT / JOIN / GROUP BY): **569 queries** (97.26%)
  - `RECORD_INSERT` (INSERT INTO): **7 queries**
  - `RECORD_UPDATE` (UPDATE / SET): **9 queries**
  - `RECORD_DELETE` (DELETE FROM): **0 queries**
- **16 Action Queries quan trọng được phát hiện:**
  1. `qryAppendProductionPlanStep` (`RECORD_INSERT`): Thêm bước công đoạn vào kế hoạch sản xuất.
  2. `qryTeflonTuJobSangMold` (`RECORD_UPDATE`): Cập nhật trạng thái `TeflonCoating = 'テフロン加工済'` trên `tblMold` từ Job.
  3. `qryUpdateMoldCodeCheck` (`RECORD_UPDATE`): Chuẩn hóa mã khuôn, loại bỏ gạch ngang và khoảng trắng (`Replace(Replace([MoldName], "-", ""), " ", "")`).
  4. `UpdateThayKyTu` (`RECORD_UPDATE`): Chuẩn hóa dấu chấm mã dao cắt trong `NukigataTbl`.
  5. `qryMoldOnCheckListYES` (`RECORD_UPDATE`): Đánh dấu checklist kiểm tra khuôn.
  6. `qryUpdatetblMoldItemTypeID` (`RECORD_UPDATE`): Gán loại thiết bị cho khuôn `*###D*`.
  7. `qrySeed01_Append_tblDesignMaster_v801` đến `qrySeed08_Update_tblCutter_CutterMasterID_v801` (8 queries): Bộ script legacy nội bộ Access v801 phục vụ tái cấu trúc bảng Master.
  8. `~TMPCLP495211` & `Query2` (`RECORD_INSERT`): Truy vấn ghi tạm order line cũ.

### 2.2. Phân loại VBA Components & Procedures — `scripts/access_vba_inventory.json`
- **Tổng số VBComponents:** **180 components**
  - `STANDARD_MODULE` (Module chuẩn xử lý nghiệp vụ): **82 modules**
  - `CLASS_MODULE` (Class điều khiển giao diện & sự kiện): **7 modules** (`clsFAYTCombo`, ...)
  - `DOCUMENT_FORM_REPORT` (Code sau Form & Report): **91 modules**
- **Tổng số dòng mã nguồn VBA:** **28,020 lines**
- **Tổng số hàm/thủ tục (Procedures):** **837 procedures**
- **Phân loại hành vi thủ tục (Side-effect Classification):**
  - `READ_ONLY` (Tính toán, nạp dữ liệu, tra cứu): **671 procedures** (80.17%)
  - `UI_NAVIGATION` (Mở Form, đóng cửa sổ, Requery, Filter): **60 procedures** (7.17%)
  - `RECORD_INSERT` (`AddNew`, thêm dữ liệu): **49 procedures** (5.85%)
  - `RECORD_UPDATE` (`Edit`, sửa bản ghi): **27 procedures** (3.23%)
  - `RECORD_DELETE` (`Delete`, xóa dữ liệu): **13 procedures** (1.55%)
  - `EXTERNAL_FILE_IO` (Xuất PDF, ghi file ra ổ đĩa): **17 procedures** (2.03%)

### 2.3. Danh mục Forms & Reports — `scripts/access_form_report_inventory.json`
- **Tổng số đối tượng giao diện:** **236 đối tượng**
  - **Forms (Biểu mẫu thao tác):** **166 forms**
  - **Reports (Phiếu in / Báo cáo):** **70 reports**
- **Cấu trúc sự kiện:** Bắt vết chi tiết tất cả các binding sự kiện (`Form_BeforeUpdate`, `Form_Current`, `OnClick`, `AfterUpdate`, `OnDblClick`).

### 2.4. Đồ thị phụ thuộc logic — `scripts/access_logic_dependency_graph.json`
- Ánh xạ hoàn chỉnh chuỗi liên kết:  
  **Form/Report $\rightarrow$ RecordSource $\rightarrow$ Referenced Tables/Queries $\rightarrow$ Event Handlers $\rightarrow$ Target Tables Affected**.

---

## 3. PHÂN TÍCH CHUYÊN SÂU 5 QUY TRÌNH VẬN HÀNH CỐT LÕI (OPERATIONAL WORKFLOWS DEEP-DIVE)

### 3.1. Quy trình 1: Chỉ thị & Lập lịch gia công khuôn (Shop-Floor Dispatching Cockpit)
- **Đối tượng cốt lõi:**
  - Form trung tâm: `BangDuDinhFrm` (Form khởi động mặc định từ Macro `AutoExec`).
  - Form xử lý chi tiết: `frmMOLDProcessing` (RecordSource: `qryMOLDprocessing`, 606 dòng VBA), `Form_KyHanGcFrms`, `Form_KyHanGcFrms2`.
  - Subforms gá lắp: `YoteiMoldFrms` (khuôn chính), `YoteiPlugFrms` (khuôn Plug), `YoteiStakingFrms` (Stacking), `YoteiTeflonFrms` (Teflon), `YoteiMachineFrms` (Máy gia công CNC/phay).
  - Query điều phối: `BangDuDinh_FullQry`.
- **Cơ chế chuyển đổi trạng thái (State Machine) trong `tblProcessingStatus`:**
  Hệ thống xưởng phân cấp trạng thái thành 2 pha rõ rệt:
  1. *Pha Chuẩn bị Phôi & Vật tư (Material Readiness Pipeline):*  
     `ZR.材料 Request` (Yêu cầu đặt phôi) $\rightarrow$ `ZN.材料待ち` (Đang chờ nhà cung cấp giao phôi) $\rightarrow$ `ZF.材料有` (Phôi đã nhập về xưởng sẵn sàng lên máy).
  2. *Pha Gia công Cơ khí (Machining Pipeline):*  
     `1.プログラム` (Lập trình CAD/CAM) $\rightarrow$ `2.機械加工` (Phay/tiện CNC) $\rightarrow$ `3.穴あけ` (Khoan thoát khí) $\rightarrow$ `4.ミガキ` (Đánh bóng khuôn) $\rightarrow$ `5.プラグ作成` (Gia công khuôn đực Plug) $\rightarrow$ `6.ネル貼り` (Dán nỉ) $\rightarrow$ `F.完了` (Hoàn tất toàn bộ công đoạn).
- **Thuật toán ghép dao và lòng khuôn (CAV Matching Algorithm):**
  Trong `Form_frmMOLDProcessing`, hàm `FindCAVIDFlexible(dblLength, dblWidth)` tự động tính toán sai số kỹ thuật:
  $$\text{Sai số} = | \text{CAVwidth} - W | \le 0.1\text{ mm} \quad \text{và} \quad | \text{CAVlength} - L | \le 0.1\text{ mm}$$
  Hệ thống tự động quét bảng `tblCAV` để gợi ý mã lòng khuôn phù hợp nhất theo thứ tự ưu tiên độ lệch nhỏ nhất.
- **Quy tắc gá lắp dao cắt (`btnCheckCreateCutter_Click`):**
  Phân biệt rạch ròi 2 cơ chế sở hữu:
  - *Dao dùng chung (Shared Cutter):* Kiểm tra liên kết trong `tblMoldCutter`.
  - *Dao riêng biệt (Dedicated Cutter):* Quét bảng `tblCutter` theo mã định danh `CutterDesignCode`.

---

### 3.2. Quy trình 2: Nhập Nippo & Tính giờ công xưởng (Daily Work Logging & Overtime)
- **Đối tượng cốt lõi:**
  - Form ghi nhận: `ThoiLuongGcFrms3`, `frmDaiLyWorkLog`, `F_ThoiLuongGC Subform1`.
  - Query tổng hợp: `Nippo_FullQry`, `ChamCongQry`, `qryDailyWorkLog_Sakata`.
  - Báo cáo phê duyệt: `Nippo_Final_ThoanRpt`, `Nippo_Final_DuyenRpt`, `Nippo_today_SakataRpt`, `Zangyou_ThisMonthRpt`.
- **Bảng mã phân loại công việc chuẩn (`tblProcessingCode` — Giải mã trường hợp 94 Work Logs không gắn JobID):**
  Audit chi tiết bảng `tblProcessingCode` cho thấy cấu trúc mã công việc bao quát từ khâu kỹ thuật đến vận hành nội bộ:
  - **Nhóm Thiết kế & Lập trình (0–8):** 0 (Thiết kế Tray), 1 (3D Tray), 2 (3D Khuôn), 3 (3D Plug), 6 (Vẽ lỗ sau), 7 (Lập trình gia công mặt trước).
  - **Nhóm Gia công Khuôn Chính (10–17):** 10 (Tính toán & phay CNC), 11 (Khoan lỗ thoát khí), 12 (Đánh bóng), 13 (Dán nỉ), 16 (Gia công bổ sung).
  - **Nhóm Gia công Khuôn Mẫu Thử (20–24):** 20 (Tính toán & phay mẫu thử), 21 (Khoan), 22 (Đánh bóng).
  - **Nhóm Gia công Plug (30–34):** 31 (Tính toán & phay Plug), 33 (Làm Plug thủ công khuôn chính).
  - **Nhóm Đồ gá & Dao Cắt (40–43):** 40 (Stacking), 41 (Làm ván gỗ), 42 (Sửa chữa khuôn/đế khí), 43 (Gá dao cắt).
  - **Nhóm Tác vụ Nội bộ Xưởng & Kaizen (50–56):** 50 (5S nhà xưởng), 51 (Đóng gói), 52 (Nghiền phế), 53 (Sắp xếp kho khuôn), 54 (Bảo trì máy móc), 55 (Vệ sinh khuôn), 56 (Cân chỉnh Plug).  
    $\rightarrow$ **Kết luận chính xác:** 94 bản ghi Work Log có `ProcessingDeadlineID = null` chính là các giờ công thực hiện công việc nhóm 50–56 (5S, bảo trì định kỳ, dọn kho), không phát sinh từ một đơn hàng/khuôn cụ thể.
  - **Nhóm Hỗ trợ & Khác (250–999):** 250 (Nghiệp vụ văn phòng), 560 (Hỗ trợ dập), 610 (Đóng hàng xuất khẩu), 630 (Kiểm tra chất lượng), 750 (Họp khách hàng), 999 (Họp giao ban toàn công ty).
- **Cơ chế tính lương & giờ làm việc:**
  Truy vấn `Nippo_FullQry` tự động tính ngày chốt chấm công: `[ProcessingDate] + 10 AS DateChamCong`, hỗ trợ phân nhóm theo nhân sự và xuất báo cáo PDF tự động gửi cho từng cấp quản lý (Thoan, Duyên, Sakata).

---

### 3.3. Quy trình 3: Đặt phôi nhôm & Vật tư cơ khí tiêu hao (Tooling Materials & Consumables)
- **Đối tượng cốt lõi:**
  - Bảng dữ liệu: `DatHangVTTbl` (1,396 dòng), `VatTuTbl` (723 dòng danh mục vật tư), `VatTuSDtbl` (64 dòng tiêu hao).
  - Form thao tác: `DatHangVtMainFrm`, `DatHangvtSubFrm`, `TehaiAlumi Subform`, `TehaiPlug Subform`.
  - Query & Report: `ChuumonshoQry`, `ChuumonshoRpt` (Phiếu đặt hàng nhôm).
- **Công thức tính toán giá thành cơ khí theo tỷ trọng nhôm (Aluminum Density Formula):**
  Trong truy vấn `ChuumonshoQry`, hệ thống Access tự động tính đơn giá thực tế trên 1 kg phôi nhôm:
  $$\text{Gia１ｋｇAL} = \frac{\text{DonGiaDH} \times 1,000,000}{2.8 \times \text{DoDayVL} \times \text{ChieuRongVL} \times \text{ChieuDaiVL}}$$
  *Cơ sở cơ học:* Khối lượng riêng chuẩn của hợp kim nhôm (A5052) là $2.8\text{ g/cm}^3$ (hay $2.8 \times 10^{-6}\text{ kg/mm}^3$). Thể tích phôi tính bằng mm³ là:
  $$V = \text{DoDayVL} \times \text{ChieuRongVL} \times \text{ChieuDaiVL}$$
  Khối lượng phôi (kg) là $M = \frac{V \times 2.8}{1,000,000}$. Do đó đơn giá trên 1 kg nhôm được quy đổi tự động để thẩm định chi phí mua phôi của các xưởng cơ khí gia công ngoài.
- **Phân định rõ ràng với hạt nhựa định hình:**
  Bộ 3 bảng này chuyên quản lý phôi kim loại gia công khuôn (A5052, S50C, mũi phay Endmill, đồ gá), hoàn toàn độc lập với danh mục nhựa màng định hình khay (`tblPlastic...`). Có tới 660 dòng đặt phôi liên kết trực tiếp với mã `JobID`.

---

### 3.4. Quy trình 4: Mượn/Trả khuôn & Chứng nhận bàn giao (Mold Loans & JAE/ATS Certificates)
- **Đối tượng cốt lõi:**
  - Bảng dữ liệu: `tblMoldBorrow` (209 dòng hồ sơ mượn/trả).
  - Module đồng bộ: `ModCopyDataToMoldBorrow`, `UpdateMoldBorrowFromJAEmoldCheck`.
  - Phiếu in báo cáo: `BaoCaoChoMuonThietBiJAErpt`, `ChungNhanMuonKhuonATSrpt`, `ChungNhanMuonKhuonATSRpt2`.
  - Form quản lý: `frmMOLDBorrowSubCertificate`, `frmMoldBorrowSubList`.
- **Cấu trúc trường đặc thù của khách hàng JAE và ATS:**
  Trong module `ModCopyDataToMoldBorrow`, hồ sơ mượn khuôn được quản lý nghiêm ngặt theo các tiêu chuẩn pháp lý thiết bị:
  - `BorrowMonth`: Tháng mượn / tháng xuất kiểm kê.
  - `DrawingNo` (`JAEDrawingNo`): Số bản vẽ chế tạo khuôn của JAE.
  - `EquipmentNo` (`JAEEquipmentNumber`): Mã quản lý tài sản cố định của khách hàng.
  - `FeedPitch` (`ATSfeedPitch`): Bước tiến khuôn (bước dịch màng).
  - `MoldLifespan` (`SSMMoldLifespan`): Tuổi thọ bảo hành số lần dập của bộ khuôn.
  - `MoldPrice` (`ATSprice`): Giá trị tài sản bàn giao (phục vụ bảo hiểm thiết bị).
  - `MoldPicture` / `fileLink`: Hình ảnh biên bản bàn giao thực tế tại xưởng.
- **Ý nghĩa chuyển đổi NextGen:**
  Toàn bộ 209 hồ sơ này chính là nguồn dữ liệu thực tế duy nhất để backfill vào bảng `equipment_loans` của YSDMS NextGen.

---

### 3.5. Quy trình 5: Bảo dưỡng khuôn, Phủ Teflon & Điều chuyển vị trí Kệ (Maintenance, Teflon & Location History)
- **Đối tượng cốt lõi:**
  - Bảng dữ liệu: `tblTeflonLog` (186 dòng), `tblLocationLog` (406 dòng vết chuyển kệ), `tblShipLog` (381 dòng xuất xưởng).
  - Module tự động hóa: `ModTeflonSync` (109 dòng VBA), `ModCutterLogRackLayerChange` (53 dòng VBA).
  - Form & Query: `frmTeflonLog`, `frmsMoldLocationLog`, `qryTeflonTuJobSangMold`, `qryTeflon`.
- **Cơ chế tự động hóa ghi vết chuyển vị trí Kệ (`ModCutterLogRackLayerChange`):**
  Mỗi khi dao cắt hoặc khuôn được di chuyển sang tầng kệ mới (`RackLayerID` thay đổi), thủ tục VBA tự động bắt sự kiện:
  ```vba
  If oldRackLayer <> newRackLayer Then
      rsLog.AddNew
      rsLog!CutterID = CutterID
      rsLog!oldRackLayer = oldRackLayer
      rsLog!newRackLayer = newRackLayer
      rsLog!DateEntry = Now()
      rsLog.Update
  End If
  ```
  Ngăn chặn triệt để tình trạng thất lạc dao/khuôn trong khoang chứa 14 dãy kệ xưởng.
- **Quy trình chu kỳ mạ phủ Teflon (`ModTeflonSync`):**
  Đồng bộ chặt chẽ 3 giai đoạn: `テフロン加工承認待ち` (Chờ duyệt mạ) $\rightarrow$ `テフロン加工中` (Đang gửi xưởng mạ ngoài) $\rightarrow$ `テフロン加工済` (Đã nghiệm thu về kho), với nhà cung cấp mạ cố định (`SupplierID = 7`).

---

## 4. MA TRẬN KHOẢNG TRỐNG TÍNH NĂNG (FEATURE GAP ANALYSIS: ACCESS VS. NEXTGEN)

| STT | Phân hệ nghiệp vụ | Hiện trạng Legacy Access | Hiện trạng YSDMS NextGen | Mức độ ưu tiên | Khuyến nghị giải pháp cho NextGen |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **G1** | **Bảng điều phối dự định gia công xưởng (Cockpit)** | Có `BangDuDinhFrm` tích hợp 6 subforms (Khuôn, Plug, Stacking, Teflon, Máy) | Đã có `jobs` và Kanban cơ bản tại `/production/jobs`, nhưng thiếu màn hình tổng thể quy tụ theo tuần/tháng | **P0** | Xây dựng trang `/production/schedule-board` mô phỏng cockpit đa luồng của `BangDuDinhFrm`. |
| **G2** | **Bộ mã công đoạn chuẩn & Tác vụ 5S nội bộ** | Phân cấp mã 0–999 rõ ràng trong `tblProcessingCode` (gồm cả 5S, bảo trì, đóng gói) | Bảng `work_logs` chỉ gắn với `job_id`, chưa hỗ trợ ghi nhận tác vụ nội bộ không có Job | **P1** | Bổ sung trường `task_category` vào `work_logs` hoặc tạo Job nội bộ cố định cho tác vụ 5S/Bảo trì. |
| **G3** | **Quản lý Đặt phôi kim loại & Vật tư cơ khí tiêu hao** | `DatHangVTTbl` + `ChuumonshoQry` tự động tính giá phôi nhôm theo khối lượng riêng ($2.8$) | Chỉ có quản lý cuộn nhựa định hình màng (`raw_materials`), hoàn toàn chưa có phôi cơ khí | **P1** | Thiết kế phân hệ `/equipment/materials` quản lý tồn kho và đặt phôi nhôm/thép gia công khuôn. |
| **G4** | **In phiếu Mượn/Trả khuôn chuẩn JAE / ATS** | Đầy đủ thông số bản vẽ, bước tiến, tuổi thọ, giá trị và ảnh chụp trong `tblMoldBorrow` | Đã có cấu trúc bảng `equipment_loans` (Migration 097/098) và UI M18 nhưng đang trống dữ liệu | **P0** | Thực hiện backfill 209 bản ghi mượn/trả và bổ sung mẫu in PDF phiếu bàn giao chuẩn JAE/ATS. |
| **G5** | **Nhật ký Di chuyển Kệ & Chu kỳ mạ Teflon** | Bắt sự kiện tự động ghi vào `tblLocationLog` và `tblTeflonLog` | Chỉ lưu vị trí hiện tại trên `equipment`, chưa có bảng lưu lịch sử dịch chuyển kệ theo thời gian | **P2** | Tạo bảng `equipment_location_logs` và trigger lưu vết khi thay đổi `rack_layer_id`. |

---

## 5. CAM KẾT AN TOÀN TUYỆT ĐỐI (SAFETY ASSURANCE CONFIRMATION)

1. **Đối với cơ sở dữ liệu Supabase Production:**
   - **Xác nhận 0 ghi (Zero Writes):** Toàn bộ pipeline thực hiện ở Giai đoạn 1 là trích xuất tĩnh cục bộ.
   - Chưa tạo bất kỳ bảng staging nào (`stg_legacy_jobs`, `stg_legacy_work_logs`, v.v.).
   - Chưa thực thi bất kỳ lệnh `INSERT`, `UPDATE`, `DELETE`, hoặc `ALTER TABLE` nào lên Production.
2. **Đối với file vật lý Access:**
   - File `docs/ysdJOB_20261006.accdb` được mở hoàn toàn ở chế độ `ReadOnly = True`.
   - Dung lượng giữ nguyên tuyệt đối: **612,442,112 bytes**.
   - Không có bất kỳ Macro hay lệnh RunSQL nào được kích hoạt.
3. **Kiểm tra biên dịch mã nguồn:**
   - Đã chạy lệnh `npx tsc --noEmit` $\rightarrow$ Kết quả: **0 errors**.

---
*Báo cáo được lập và lưu vết đầy đủ trong hệ thống tài liệu dự án NextGen.*
