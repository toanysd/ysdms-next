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
  - Form trung tâm: `BangDuDinhFrm` — **Bằng chứng tĩnh từ Macro AutoExec:**  
    Trích xuất tĩnh metadata bằng `Access.Application.SaveAsText(4, "AutoExec")` (không mở/chạy macro) xác nhận định nghĩa XML gốc:
    ```xml
    <Action Name="OpenForm">
        <Argument Name="FormName">BangDuDinhFrm</Argument>
    </Action>
    ```
    Điều này chứng minh `BangDuDinhFrm` là form đích mở đầu của ứng dụng Access mà không cần phải thực thi bất kỳ macro runtime nào.
  - Form xử lý chi tiết: `frmMOLDProcessing` (RecordSource: `qryMOLDprocessing`, 606 dòng VBA), `Form_KyHanGcFrms`, `Form_KyHanGcFrms2`.
  - Subforms gá lắp: `YoteiMoldFrms` (khuôn chính), `YoteiPlugFrms` (khuôn Plug), `YoteiStakingFrms` (Stacking), `YoteiTeflonFrms` (Teflon), `YoteiMachineFrms` (Máy gia công CNC/phay).
  - Query điều phối: `BangDuDinh_FullQry`.
- **Cơ chế chuyển đổi trạng thái trong `tblProcessingStatus` & Ý kiến chỉ đạo từ Minh Chủ Thoan:**
  - *Ghi nhận nghiệp vụ từ Minh Chủ Thoan [Stamp: 2026-10-06 16:12 JST]:*  
    Các mã trạng thái `ZR`, `ZN`, `ZF` thuộc về hệ thống cũ dành cho trạng thái đặt hàng vật liệu (`Z` = zairyou / 材料, `N` = NOW / đang chờ, `R` = Request / yêu cầu, `F` = Finish / hoàn thành), **trong hệ thống YSDMS NextGen KHÔNG DÙNG ĐẾN (DEPRECATED)**.
  - *Pha Gia công Cơ khí thực tế trên xưởng:*  
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
- **Bảng mã phân loại công việc chuẩn (`tblProcessingCode`) & Bằng chứng 94 Work Logs không gắn JobID:**
  Audit chi tiết toàn bộ 94 bản ghi `tblWorkLog` có `ProcessingDeadlineID IS NULL` (lưu tại `scripts/evidence_94_internal_logs.json`) xác nhận phân bổ nghiệp vụ thực tế tại xưởng:
  * **36 logs:** Mã `40: スタッキング` (Gia công đồ gá Stacking xếp chồng sản phẩm, làm ván gỗ).
  * **24 logs:** Mã `13: 本型ネル貼り` (Dán nỉ thủ công khuôn chính).
  * **15 logs:** Mã `23: 試作ネル貼り` (Dán nỉ thủ công khuôn mẫu thử).
  * **5 logs:** Mã `42: 金型・プラグ・ベース修理、穴あけなど` (Sửa chữa khuôn/plug/đế bị va chạm, khoan thêm lỗ).
  * **4 logs:** Mã `14: 演算＆加工` (Cải tiến Kaizen khuôn, gọt chu vi ngoài).
  * **3 logs:** Mã `10: 金型演算＆加工` (Gia công cải tạo bề mặt khuôn).
  * **2 logs:** Mã `50: 5S` (Hoạt động 5S vệ sinh xưởng).
  * **1 log:** Mã `54: メンテナンス` (Ghi chú rõ: `コンプレッサー故障の対応` — Xử lý sự cố máy nén khí hỏng).
  * **1 log:** Mã `11: 本型穴あけ` (Ghi chú: `金型掃除・穴あけ` — Vệ sinh khuôn & khoan lỗ).
  * **3 logs:** Mã `15, 20, 24` (Gia công khuôn mẫu thử).  
  $\rightarrow$ **Kết luận chính xác theo yêu cầu PE:** Tuyệt đối **KHÔNG gán ép 94 logs này vào bất kỳ job_id khách hàng nào**. Đây là các giờ công lao động độc lập của thợ xưởng (Stacking, Dán nỉ, Bảo trì máy, Kaizen nội bộ).
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
  - Bảng dữ liệu vật lý (Single Source of Truth từ `scripts/access_table_stats.json` & DAO):
    * `tblTeflonLog`: **4,692 dòng** toàn bảng.
    * `tblLocationLog`: **1,488 dòng** toàn bảng (trong đó 1,361 dòng ghi vết di chuyển Khuôn `MoldID`, 127 dòng ghi vết di chuyển Dao cắt `CutterID`).
    * `tblShipLog`: **358 dòng** xuất xưởng.
  - Module tự động hóa: `ModTeflonSync` (109 dòng VBA), `ModCutterLogRackLayerChange` (53 dòng VBA).
  - Form & Query: `frmTeflonLog`, `frmsMoldLocationLog`, `qryTeflonTuJobSangMold`, `qryTeflon` (4,692 dòng).
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
| **G5** | **Nhật ký Di chuyển Kệ & Chu kỳ mạ Teflon** | Bắt sự kiện tự động ghi vào `tblLocationLog` và `tblTeflonLog` | Đã có bảng chuẩn hóa `asset_location_logs` (ADR-008) ghi vết di chuyển kệ; `equipment` lưu trạng thái hiện tại | **P2** | Sử dụng trực tiếp `asset_location_logs` (KHÔNG tạo `equipment_location_logs` mới) để lưu vết lịch sử di chuyển kệ khi thay đổi `rack_layer_id`. |

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

## 6. GÓI A — EVIDENCE PACK CHUẨN HÓA (STANDARDIZED EVIDENCE AUDIT PACK)

### 6.1. Bằng chứng Trích xuất Tĩnh Macro `AutoExec`
Được trích xuất nguyên văn bằng phương thức tĩnh `Access.Application.SaveAsText(4, "AutoExec")` (không mở/chạy macro):
```xml
Version = 196611
Action = "SetDisplayedCategories" (Category = acNavigationCategoryObjectType)
Condition = "Not [CurrentProject].[IsTrusted]" -> Action = "OpenForm" (FormName = "BangDuDinhFrm")
Condition = "[CurrentProject].[IsTrusted]"     -> Action = "OpenForm" (FormName = "BangDuDinhFrm")
```
$\rightarrow$ Xác nhận 100%: `AutoExec` có mục đích duy nhất là khởi chạy `BangDuDinhFrm` khi người dùng mở Access. Quá trình audit tĩnh của AN không thực thi macro này.

### 6.2. Danh mục Đầy đủ 16 Action Queries Phát hiện trong Access
| # | Tên QueryDef | Loại Action | Bảng tác động | Đoạn mã SQL trích xuất |
|---|---|---|---|---|
| 1 | `~TMPCLP495211` | `RECORD_INSERT` | — (Dynamic) | `INSERT INTO tblOrderHead (OrderNo, CustomerID, OrderDate...)` |
| 2 | `qryAppendProductionPlanStep` | `RECORD_INSERT` | `tblMold, tblMoldCutter` | `INSERT INTO tblProductionPlanStep (ProductionPlanID, StepNo, StepType, MoldID, CutterID, MachineID...)` |
| 3 | `qryMoldOnCheckListYES` | `RECORD_UPDATE` | `tblMold` | `UPDATE tblMold SET MoldOnCheckList = Yes;` |
| 4 | `qrySeed01_Append_tblDesignMaster_v801` | `RECORD_INSERT` | `tblMoldDesign` | `INSERT INTO tblDesignMaster (DesignMasterCode, DesignMasterName, CustomerID, TrayID...)` |
| 5 | `qrySeed02_Update_tblMoldDesign_DesignMasterID_v801` | `RECORD_UPDATE` | `tblMoldDesign` | `UPDATE tblMoldDesign INNER JOIN tblDesignMaster ON tblDesignMaster.DesignMasterCode = ...` |
| 6 | `qrySeed03_Append_tblMoldMaster_v801` | `RECORD_INSERT` | — (Dynamic) | `INSERT INTO tblMoldMaster (MoldMasterCode, MoldMasterName, DesignMasterID, CustomerID, TrayID...)` |
| 7 | `qrySeed04_Append_tblMoldRevision_v801` | `RECORD_INSERT` | `tblMoldDesign` | `INSERT INTO tblMoldRevision (MoldMasterID, MoldDesignID, RevisionNo, RevisionName...)` |
| 8 | `qrySeed05_Update_tblMold_MoldRevisionID_v801` | `RECORD_UPDATE` | `tblMold` | `UPDATE tblMold INNER JOIN tblMoldRevision ON tblMold.MoldDesignID = tblMoldRevision.MoldDesignID...` |
| 9 | `qrySeed06_Update_tblDesignMaster_ActiveRevisionID_v801` | `RECORD_UPDATE` | `tblMoldDesign` | `UPDATE tblDesignMaster INNER JOIN (tblMoldDesign INNER JOIN tblMoldRevision...` |
| 10 | `qrySeed07_Append_tblCutterMaster_v801` | `RECORD_INSERT` | `tblCutter, tblMoldDesign` | `INSERT INTO tblCutterMaster (CutterMasterCode, CutterMasterName, DesignMasterID, CustomerID, TrayID...)` |
| 11 | `qrySeed08_Update_tblCutter_CutterMasterID_v801` | `RECORD_UPDATE` | `tblCutter` | `UPDATE tblCutter INNER JOIN tblCutterMaster ON tblCutterMaster.CutterMasterCode = ...` |
| 12 | `qryTeflonTuJobSangMold` | `RECORD_UPDATE` | `tblJOB, tblMold` | `UPDATE tblMold SET TeflonCoating = "テフロン加工済" WHERE MoldID IN (SELECT DISTINCT MoldID FROM tblJob WHERE (TeflonShippingDate IS NOT NULL)...)` |
| 13 | `qryUpdateMoldCodeCheck` | `RECORD_UPDATE` | `tblMold` | `UPDATE tblMold SET MoldCodeCheck = Replace(Replace([MoldName], "-", ""), " ", "");` |
| 14 | `qryUpdatetblMoldItemTypeID` | `RECORD_UPDATE` | `tblMold` | `UPDATE tblMold SET ItemTypeID = 11 WHERE MoldName LIKE '*###D*';` |
| 15 | `Query2` | `RECORD_INSERT` | — (Dynamic) | `INSERT INTO tblOrderLine (OrderHeadID, LineNo, TrayID, MoldDesignID, TrayOrderID, Quantity, Unit...)` |
| 16 | `UpdateThayKyTu` | `RECORD_UPDATE` | — (NukigataTbl) | `UPDATE NukigataTbl SET IDnukigata = Replace(IDnukigata, "-", ".") WHERE IDnukigata LIKE "*-*";` |

### 6.3. Bảng Top 20 Procedures có Tác động Ghi Dữ liệu Nhiều Nhất
Tổng số thủ tục có thao tác ghi dữ liệu: **89 thủ tục** (49 INSERT, 27 UPDATE, 13 DELETE). Dưới đây là 20 thủ tục tác động nhiều bảng nhất:
| # | Module | Procedure | Hành vi | LOC | Bảng bị tác động |
|---|---|---|---|---|---|
| 1 | `ModUpdateDesignForPlasticType` | `UpdateDesignForPlasticType` | `RECORD_UPDATE` | 56 | `tblMoldDesign, tblPLASTICforForming, tblPlasticMaterial, tblPlasticColor, tblPlasticThickness, tblPlasticWidth, tblPlasticStaticCharge` |
| 2 | `ModUpdateCurrentDesignForPlasticType` | `UpdateCurrentDesignForPlasticType` | `RECORD_UPDATE` | 56 | `tblMoldDesign, tblPLASTICforForming, tblPlasticMaterial, tblPlasticColor, tblPlasticThickness, tblPlasticWidth, tblPlasticStaticCharge` |
| 3 | `Form_frmMoldSearchSubMoldDetails` | `cmdShipMold_Click` | `RECORD_INSERT` | 434 | `tblLocationLog, tblShipLog, statuslogs, tblMold, tblCompany` |
| 4 | `Form_frmMOLDlocation` | `CreateOrCheckMold` | `RECORD_INSERT` | 344 | `tblMold, tblMoldDesign, tblTray, tblCustomer` |
| 5 | `Form_frmMOLDentry` | `btnMoldCreate_Click` | `RECORD_INSERT` | 210 | `tblMold, tblMoldDesign, tblTray, tblCustomer` |
| 6 | `Form_frmMOLDlocation_ng` | `CreateOrCheckMold` | `RECORD_INSERT` | 177 | `tblMold, tblMoldDesign, tblTray, tblCustomer` |
| 7 | `Form_frmMoldSearch` | `cmdTeflonUpdate_Click` | `RECORD_INSERT` | 427 | `tblTeflonLog, tblShipLog, tblEmployee` |
| 8 | `Form_frmMoldSearch` | `cmdBulkDispose_Click` | `RECORD_INSERT` | 196 | `tblLocationLog, statuslogs, tblMold` |
| 9 | `Form_frmMoldSearch` | `cmdBulkCheckOut_Click` | `RECORD_INSERT` | 193 | `statuslogs, tblEmployee, destinations` |
| 10 | `Form_frmMoldSearch` | `cmdCheckOut_Click` | `RECORD_INSERT` | 177 | `statuslogs, tblEmployee, destinations` |
| 11 | `Form_frmMoldSearchSubMoldDetails` | `cmdDisposeMold_Click` | `RECORD_INSERT` | 165 | `tblLocationLog, statuslogs, tblMold` |
| 12 | `ModAddStatuslogs` | `UpdateMoldTeflonFields` | `RECORD_INSERT` | 158 | `tblShipLog, statuslogs, tblMold` |
| 13 | `Form_frmMOLDentry` | `btnMoldDesignCreate_Click` | `RECORD_INSERT` | 121 | `tblMoldDesign, tblTray, tblCustomer` |
| 14 | `Form_frmMOLDentry` | `txtMoldDesignCreate_Exit` | `RECORD_INSERT` | 120 | `tblMoldDesign, tblTray, tblCustomer` |
| 15 | `Form_frmsCUTTERdataEntry` | `cbMoldDesign_AfterUpdate` | `RECORD_INSERT` | 106 | `tblCutter, tblMoldDesign, tblMoldCutter` |
| 16 | `Form_frmCUTTERsearchSubEntry` | `MoldDesignID_AfterUpdate` | `RECORD_UPDATE` | 103 | `tblCutter, tblMoldDesign, tblMoldCutter` |
| 17 | `modMoldWBS_V2` | `SyncActualHours` | `RECORD_UPDATE` | 39 | `tblJOB, tblProcessingDeadline, tblWorkLog` |
| 18 | `Form_frmMOLDlocation` | `cbMoldCode_AfterUpdate` | `RECORD_INSERT` | 209 | `tblLocationLog, tblMold` |
| 19 | `Form_frmMOLDlocation` | `txtMoldNumber_AfterUpdate` | `RECORD_INSERT` | 201 | `tblLocationLog, tblMold` |
| 20 | `Form_frmMOLDProcessing` | `btnCheckCreateCutter_Click` | `RECORD_INSERT` | 188 | `tblCutter, tblMoldCutter` |

### 6.4. Bảng Bằng chứng Chi tiết 94 Tác vụ Nội bộ Không có JobID
Toàn văn 94 bản ghi được lưu tại file artifact: `scripts/evidence_94_internal_logs.json`. Dưới đây là bảng trích yếu đại diện theo từng nhóm công việc:
| WorkLogID | ProcessingCodeID | Tên công đoạn | Ghi chú thực tế (ProcessingNotes) | Ngày thực hiện | DeadlineID | Phân loại đề xuất | Nguồn chứng cứ |
| :---: | :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| `3414` | 54 | メンテナンス (Bảo trì) | コンプレッサー故障の対応 (Xử lý sự cố máy nén khí) | 2024-01-17 | NULL | `SHOP_MAINTENANCE` | `tblWorkLog` |
| `2677` | 42 | Sửa khuôn/đế | ぶつかったかな (Sửa chữa do va đập) | 2023-08-07 | NULL | `SHOP_REPAIR` | `tblWorkLog` |
| `2686` | 11 | Khoan khuôn | 金型掃除・穴あけ (Vệ sinh khuôn & khoan lỗ) | 2023-08-08 | NULL | `SHOP_CLEANING_DRILL` | `tblWorkLog` |
| `2259` | 14 | Gia công phay | 改善 (Kaizen cải tiến công cụ) | 2023-05-18 | NULL | `SHOP_KAIZEN` | `tblWorkLog` |
| `2613` | 14 | Gia công phay | 改善・寸法変更 (Kaizen & đổi kích thước) | 2023-07-25 | NULL | `SHOP_KAIZEN` | `tblWorkLog` |
| `4075` | 42 | Sửa khuôn/đế | プラグの調整 (Cân chỉnh khuôn Plug) | 2024-05-27 | NULL | `SHOP_PLUG_ADJUST` | `tblWorkLog` |
| `4811` | 40 | スタッキング | 修理・銅板作成 (Sửa chữa & làm tấm đồng) | 2024-10-18 | NULL | `SHOP_STACKING` | `tblWorkLog` |
| `3814` | 40 | スタッキング | スタキング・木板 (Làm ván gỗ xếp chồng) | 2024-03-27 | NULL | `SHOP_STACKING` | `tblWorkLog` |
| `2030` | 40 | スタッキング | 外形調整　530以下 (Chỉnh hình dạng ngoài) | 2023-03-25 | NULL | `SHOP_STACKING` | `tblWorkLog` |
| `3166` | 50 | 5S | — (Hoạt động 5S xưởng) | 2023-11-28 | NULL | `SHOP_5S` | `tblWorkLog` |
| `1764...` (36 logs) | 40 | スタッキング | Gia công bộ đồ gá Stacking | 2023–2026 | NULL | `SHOP_STACKING` | `tblWorkLog` |
| `2409...` (24 logs) | 13 | 本型ネル貼り | Dán nỉ thủ công khuôn chính | 2023–2025 | NULL | `SHOP_FLANNEL_MOLD` | `tblWorkLog` |
| `2596...` (15 logs) | 23 | 試作ネル貼り | Dán nỉ thủ công khuôn mẫu | 2023–2025 | NULL | `SHOP_FLANNEL_PROTO` | `tblWorkLog` |

$\rightarrow$ **Quyết định phân loại:** Tuyệt đối không gán ép vào job của khách hàng. Sẽ quản lý dưới dạng `task_category = 'SHOP_INTERNAL'` hoặc Job nội bộ `JOB-INTERNAL-SHOP`.

---

## 7. GÓI B — KHUNG ĐẶC TẢ PILOT VẬN HÀNH BỘ PHẬN KHUÔN (PILOT SPECIFICATION)

### 7.1. Mục tiêu Nghiệp vụ Cốt lõi
Xây dựng chuỗi vận hành khép kín, tinh gọn cho bộ phận gia công khuôn theo mô hình:
$$\text{Chỉ thị khuôn (Job)} \longrightarrow \text{Lập lịch (Steps \& Deadlines)} \longrightarrow \text{Nhật ký Nippo} \longrightarrow \text{Báo cáo Tiến độ}$$
- **Nguyên tắc thiết kế:** Không sao chép giao diện cũ cồng kềnh của Access; tận dụng tối đa schema chuẩn ADR-002 (`work_orders` $\rightarrow$ `jobs` $\rightarrow$ `job_steps` $\rightarrow$ `work_logs`) và các components UI NextGen hiện hữu.

### 7.2. Giải phẫu 4 Khâu Vận hành Pilot
1. **Khâu 1: Tiếp nhận Chỉ thị & Khởi tạo Job khuôn (`/production/jobs`)**
   - Nguồn gốc: Tự động sinh từ Đơn hàng (`orders`) hoặc tạo thủ công Job nội bộ cho xưởng.
   - Phân cấp Job theo thiết bị: Tách riêng Job khuôn (`MOLD`), Job dao (`CUTTER`), Job Plug (`PLUG`), Job Stacking (`STACKING`).
   - Thông tin gá lắp: Chọn lòng khuôn (CAV) và dao cắt (Shared qua `equipment_assignments` hoặc Dedicated).
2. **Khâu 2: Lập lịch Công đoạn & Hạn chót (Step Scheduling & Dispatching)**
   - Khởi tạo mẫu công đoạn chuẩn cho khuôn:
     1. `CAD/CAM`: Lập trình đường chạy dao (1.プログラム).
     2. `CNC_MACHINING`: Phay cơ khí CNC (2.機械加工).
     3. `DRILLING`: Khoan lỗ thoát khí/chân không (3.穴あけ).
     4. `POLISHING`: Đánh bóng lòng khuôn (4.ミガキ).
     5. `PLUG_MAKING`: Gia công/cân chỉnh Plug (5.プラグ作成).
     6. `FLANNEL`: Dán nỉ bề mặt (6.ネル貼り).
     7. `QC_INSPECTION`: Nghiệm thu hoàn tất (F.完了).
   - Gán người phụ trách (`assigned_employee_id`), máy phụ trách (`assigned_machine_id`), hạn hoàn thành (`planned_end_date`).
3. **Khâu 3: Ghi nhận Nippo Hàng ngày & Tác vụ Nội bộ (`/worklog`)**
   - Giao diện thân thiện trên Tablet/Điện thoại/PC xưởng.
   - Thợ chọn: Ngày làm việc $\rightarrow$ Chọn Job & Step đang làm $\rightarrow$ Nhập giờ công (`actual_hours`) $\rightarrow$ Ghi chú.
   - **Xử lý Tác vụ Nội bộ:** Cung cấp tùy chọn "Công việc xưởng không gắn Job" với danh mục mã chuẩn (5S, Bảo trì máy móc, Dọn kho, Sửa chữa đồ gá) $\rightarrow$ Lưu vào `work_logs` với `task_category = 'SHOP_INTERNAL'`, không bắt buộc `job_id`.
4. **Khâu 4: Báo cáo Tiến độ & Cảnh báo Chậm hạn (Dispatching Dashboard)**
   - Dashboard Kanban hoặc Danh sách trực quan hiển thị:
     * Tỷ lệ hoàn thành công đoạn từng bộ khuôn.
     * Cảnh báo màu đỏ/vàng cho các bước cận hạn hoặc quá hạn (`planned_end_date < CURRENT_DATE`).
     * Tổng hợp tổng giờ công thực tế so với giờ dự kiến theo từng máy/thợ.
     * Xuất báo cáo công việc hàng ngày gửi Quản lý xưởng (tương đương `Nippo_Final_ThoanRpt`).

---
*Báo cáo được hoàn thiện và lưu vết đầy đủ trong hệ thống tài liệu dự án NextGen.*
