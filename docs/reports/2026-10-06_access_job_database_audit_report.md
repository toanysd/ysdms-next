# BÁO CÁO KIỂM TOÁN KỸ THUẬT CHỈ-ĐỌC: TẬP DỮ LIỆU ACCESS `ysdJOB_20261006.accdb`
**Dự án:** YSDMS NextGen — Hệ thống Quản trị Sản xuất & Khuôn mẫu YSD  
**Thời gian kiểm toán:** 2026-10-06 15:25 JST  
**Thực hiện:** AN (Antigravity) theo phê duyệt của THOAN [Stamp: 2026-10-06 15:12 JST]  
**Thẩm định & Kiến trúc:** PE (Perplexity Pro)  
**Trạng thái phân loại:** **Đặc tả & Báo cáo Kiểm toán (Audit Report — Read-Only)**  

---

## 1. THÔNG TIN FILE NGUỒN ACCESS & MÔI TRƯỜNG KẾT NỐI

### 1.1. Thông số tập tin nguồn
- **Đường dẫn tuyệt đối (Full Path):** `D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb`
- **Dung lượng tập tin:** `612,442,112 bytes` (~`584.07 MB`)
- **Thời gian cập nhật (Last Modified):** `2026-10-06 13:43:26 JST`
- **SHA-256 Checksum:** `e758da4311028db9d6bc7ecab17006ddce818c5e626e2e5ec44ce389270df1be`

### 1.2. Công cụ và Driver kết nối
- **Runtime:** Python 3.13.0 (Windows x64) + Thư viện `pyodbc` (v5.2.0)
- **ODBC Driver:** `Microsoft Access Driver (*.mdb, *.accdb)`
- **Connection String:**  
  `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb;ReadOnly=1;`
- **Cấu hình giải mã ký tự tiếng Nhật (Decoding Config):**
  ```python
  conn.setdecoding(pyodbc.SQL_CHAR, encoding='cp932')
  conn.setdecoding(pyodbc.SQL_WCHAR, encoding='utf-16-le')
  conn.setencoding(encoding='utf-8')
  ```
- **Xác nhận an toàn tuyệt đối:** Chế độ `ReadOnly=1` được kích hoạt ở cấp driver ODBC; **tuyệt đối không can thiệp, không sửa đổi file Access nguồn**.

---

## 2. INVENTORY TOÀN BỘ BẢNG DỮ LIỆU ACCESS (TỔNG HỢP 82 BẢNG)

Hệ thống Access chứa tổng cộng **82 bảng**, gồm **50 bảng nghiệp vụ** và **32 bảng tạm clipboard** (`~TMP...` do Access tự sinh khi sao chép giao diện):

| STT | Tên bảng Access | Số dòng (Rows) | Số cột (Cols) | Phân loại nghiệp vụ |
|:---:|:---|:---:|:---:|:---|
| 1 | `tblWorkLog` | **7,416** | 14 | Nhật ký gia công / Nippo |
| 2 | `tblMold` | **4,793** | 26 | Khuôn vật lý (Physical Molds) |
| 3 | `tblMoldDesign` | **4,781** | 37 | Thiết kế khuôn (Design Revisions) |
| 4 | `tblTeflonLog` | **4,692** | 21 | Nhật ký phủ Teflon |
| 5 | `tblTray` | **4,112** | 15 | Sản phẩm khay định hình (Products) |
| 6 | `tblMoldCutter` | **2,738** | 7 | Liên kết Khuôn - Dao (`equipment_assignments`) |
| 7 | `tblProcessingDeadline` | **2,527** | 15 | Công đoạn & Hạn định gia công (`job_steps`) |
| 8 | `tblCutter` | **1,729** | 39 | Dao cắt khuôn (`equipment` - Cutters) |
| 9 | `tblCompany` | **1,725** | 13 | Master Công ty & Đối tác (`companies`) |
| 10 | `tblLocationLog` | **1,488** | 10 | Nhật ký di chuyển vị trí thiết bị |
| 11 | `DatHangVTTbl` | **1,396** | 17 | Đặt hàng vật tư gia công |
| 12 | `tblJOB` | **1,230** | 39 | **Chỉ thị sản xuất / Gia công khuôn (`work_orders` / `jobs`)** |
| 13 | `tblTrayCustomer` | **1,069** | 12 | Khách hàng của khay định hình |
| 14 | `tblCalendar` | **730** | 4 | Lịch làm việc nhà máy 2025–2026 (`calendar`) |
| 15 | `VatTuTbl` | **723** | 13 | Master Vật tư gia công |
| 16 | `tblCustomer` | **415** | 12 | Khách hàng gia công |
| 17 | `tblRackLayer` | **400** | 7 | Tầng kệ chứa khuôn/dao |
| 18 | `statuslogs` | **398** | 17 | Log thay đổi trạng thái |
| 19 | `tblShipLog` | **358** | 22 | Nhật ký xuất hàng khuôn |
| 20 | `tblPLASTICforForming` | **330** | 18 | Thông số cuộn nhựa định hình |
| 21 | `tblMoldBorrow` | **209** | 32 | **Phiếu mượn khuôn (`equipment_loans` - M18)** |
| 22 | `tblRack` | **90** | 9 | Kệ lưu trữ vật lý |
| 23 | `VatTuSDtbl` | **64** | 7 | Vật tư đã sử dụng |
| 24 | `tblCav` | **57** | 9 | Cấu hình Cavity khuôn |
| 25 | `tblProcessingCode` | **53** | 5 | Mã nguyên công gia công |
| 26 | `tblMoldLog` | **36** | 12 | Nhật ký sửa chữa khuôn |
| 27 | `tblPlasticWidth` | **26** | 4 | Danh mục chiều rộng nhựa |
| 28 | `tblPlasticThickness` | **25** | 4 | Danh mục độ dày nhựa |
| 29 | `tblPlasticLength` | **24** | 4 | Danh mục chiều dài bước nhựa |
| 30 | `tblEmployee` | **23** | 11 | Danh sách công nhân/kỹ sư xưởng |
| 31 | `tblPlasticCompany` | **23** | 4 | Nhà cung cấp hạt/cuộn nhựa |
| 32 | `tblPlasticStaticCharge` | **22** | 5 | Tiêu chuẩn chống tĩnh điện |
| 33 | `tblCutterLog` | **21** | 20 | Nhật ký sửa chữa dao cắt |
| 34 | `tblProcessingItem` | **20** | 7 | Hạng mục gia công (Khuôn, Dao, Gá...) |
| 35 | `tblCase` | **18** | 9 | Danh mục thùng carton đóng gói |
| 36 | `tblPlasticGroup` | **17** | 4 | Nhóm vật liệu nhựa |
| 37 | `destinations` | **16** | 6 | Địa điểm giao hàng khuôn |
| 38 | `tblMachine` | **14** | 8 | Máy gia công xưởng cơ khí |
| 39 | `tblProcessingStatus` | **13** | 6 | Trạng thái công đoạn gia công |
| 40 | `tblResponsiblePerson` | **13** | 6 | Người phụ trách kỹ thuật |
| 41 | `tblItemType` | **11** | 5 | Loại đối tượng gia công |
| 42 | `tblEmployee_old` | **7** | 11 | Nhân viên cũ đã nghỉ |
| 43 | `tblPlasticColor` | **7** | 5 | Màu sắc nhựa |
| 44 | `tblMachiningCustomer` | **5** | 7 | Nhóm khách hàng gia công cơ khí |
| 45 | `tblPlasticMaterial` | **5** | 5 | Chất liệu nhựa (PET, PP, PS...) |
| 46 | `tblDefect` | **4** | 15 | Lỗi gia công khuôn |
| 47 | `tblStakings` | **2** | 11 | Cụm Stacking |
| 48 | `tblTrayOrder` | **2** | 12 | Đơn thử khay |
| 49 | `scraplog` | **0** | 14 | Log phế liệu (bảng trống) |
| 50 | `tblMoldDesignLog` | **0** | 8 | Log thiết kế (bảng trống) |
| 51–82 | `~TMP...` (32 bảng) | 0–12 | — | Bảng tạm Access (bỏ qua) |

---

## 3. CÁC BẢNG ỨNG VIÊN TRỌNG TÂM & MAPPING SANG YSDMS NEXTGEN

### 3.1. Bảng `tblJOB` (1,230 dòng) $\rightarrow$ `work_orders` & `jobs`
- **Khóa chính nguồn:** `JobID` (Integer, AutoNumber: 1 $\rightarrow$ 1278, **100% Unique**).
- **Trường mã nghiệp vụ:** `JobCode` (Text: VD `ADY133R1`, `JAE382`... Có 8 mã lặp lại qua các năm, không unique tuyệt đối).
- **Các trường dữ liệu kỹ thuật cốt lõi:**
  * `JobID`: Khóa định danh số nguyên.
  * `JobCode`: Mã ký hiệu chỉ thị.
  * `JobName`: Tên hiển thị chỉ thị.
  * `MoldDesignID`: FK liên kết thiết kế (`tblMoldDesign`).
  * `MachiningCustomerID`: FK khách hàng gia công.
  * `MoldID`: FK khuôn vật lý.
  * `JobStartDate`: Ngày bắt đầu gia công.
  * `DeliveryDeadline`: Hạn giao khuôn/sản phẩm.
  * `JobQuantity`: Số lượng khuôn cần gia công.
  * `UnitPrice`: Đơn giá gia công.
  * `Approved`: Cờ phê duyệt chỉ thị.
  * `NoiGCkhuon`: Nơi gia công khuôn (Nội bộ / Thuê ngoài).
- **Mapping mục tiêu YSDMS:**
  * `work_orders`: `wo_code = 'WO-' || JobCode`, `legacy_id = 'JOB-' || JobID`, `deadline = DeliveryDeadline`, `start_date = JobStartDate`.
  * `jobs`: `job_code = JobCode`, `legacy_id = 'JOB-' || JobID`, `work_order_id = work_orders.wo_id`.
  * Lưu ý: `mold_work_orders` (0 dòng trên Supabase) là bảng đã bị DEPRECATED theo kiến trúc **ADR-002 (Work Order Model Option C)**. Tuyệt đối không nạp vào `mold_work_orders`.

### 3.2. Bảng `tblProcessingDeadline` (2,527 dòng) $\rightarrow$ `job_steps`
- **Khóa chính nguồn:** `ProcessingDeadlineID` (Integer: 1 $\rightarrow$ 3918, **100% Unique**).
- **FK cha:** `JobID` (liên kết `tblJOB.JobID`). Có 20 dòng `JobID = NULL`.
- **Các trường công đoạn:**
  * `ProcessingStatusID`: FK trạng thái (1.Program, 2.Material, 3.Machining, 4.EDM, 5.Finishing, 8.Completed...).
  * `ItemTypeID`: Phân loại đối tượng (1.Nhôm, 2.Khuôn, 3.Plug, 4.Dao cắt, 5.Đế nước, 6.Đế khí, 8.Khung...).
  * `ProcessingDeadline`: Hạn hoàn thành công đoạn.
  * `EstimatedHours`: Giờ công định mức dự kiến.
  * `DrawingReceiptDate`: Ngày nhận bản vẽ kỹ thuật.
  * `Tehai`: Tình trạng chuẩn bị vật tư/phôi.
- **Mapping mục tiêu YSDMS:**
  * `job_steps`: `step_id = uuid`, `legacy_id = 'LEGACY-STEP-' || ProcessingDeadlineID`, `job_id = jobs.job_id`, `item_type_id = ItemTypeID`, `processing_status_id = ProcessingStatusID`, `deadline = ProcessingDeadline`, `drawing_receipt_date = DrawingReceiptDate`.

### 3.3. Bảng `tblWorkLog` (7,416 dòng) $\rightarrow$ `work_logs` (Nippo)
- **Khóa chính nguồn:** `WorkLogID` (Integer: 1 $\rightarrow$ 7416, **100% Unique**).
- **FK công đoạn:** `ProcessingDeadlineID` (liên kết `tblProcessingDeadline`). Có 94 dòng `ProcessingDeadlineID = NULL`.
- **Các trường ghi nhận lao động:**
  * `EmployeeID`: Mã thợ/kỹ sư thực hiện.
  * `ProcessingCodeID`: Mã công việc chi tiết (Phay, EDM, Lập trình CAM, Lắp ráp, Đánh bóng...).
  * `ProcessingTime`: Thời gian gia công thực tế (giờ).
  * `ProcessingDate`: Ngày thực hiện công việc.
  * `ProcessingNotes`: Ghi chú nội dung công việc.
  * `ProcessingNumbers`: Số lượng chi tiết hoàn thành.
  * `Finished`: Cờ hoàn tất công đoạn (True/False).
- **Mapping mục tiêu YSDMS:**
  * `work_logs`: `log_id = uuid`, `legacy_id = 'LEGACY-LOG-' || WorkLogID`, `job_step_id = job_steps.step_id`, `job_id = jobs.job_id`, `employee_id = employees.employee_id`, `work_date = ProcessingDate`, `hours_spent = ProcessingTime`, `processing_code_id = ProcessingCodeID`, `is_finished = Finished`.

### 3.4. Bảng `tblMoldBorrow` (209 dòng) $\rightarrow$ `equipment_loans` (Module M18)
- **Khóa chính nguồn:** `MoldBorrowID` (Integer: 1 $\rightarrow$ 210, **100% Unique**).
- **Dữ liệu mượn khuôn:**
  * `CustomerID`: Khách hàng/đơn vị mượn khuôn (Chủ yếu `（株）ヨシダパッケージ`).
  * `MoldDesignID` / `EquipmentNo`: Định danh khuôn được mượn.
  * `CertificateDate`: Ngày lập giấy mượn khuôn.
  * `MoldSheetTitle`: Tên quy cách khuôn mượn.
  * `CreatedBy`: Nhân viên phụ trách xuất mượn.
- **Mapping mục tiêu YSDMS:**
  * `equipment_loans`: `loan_id = uuid`, `loan_code = 'LN-BORROW-' || LPAD(MoldBorrowID, 4, '0')`, `loan_date = CertificateDate`, `status = 'ACTIVE'`, `loan_type = 'OUTGOING'`.

### 3.5. Bảng `tblCalendar` (730 dòng) $\rightarrow$ `production_schedules` / `work_calendars`
- Chứa lịch làm việc 365 ngày/năm cho 2025 và 2026 (ngày làm việc, ngày nghỉ nhà máy).

---

## 4. KẾT QUẢ ĐỐI SOÁT CHÉO ĐỘC LẬP VỚI SUPABASE PRODUCTION

Tất cả các truy vấn Supabase đều được thực hiện ở chế độ **CHỈ-ĐỌC (READ-ONLY)** trên `https://iirezrszalmecsslbruo.supabase.co`.

```
┌───────────────────────────┬──────────────┬──────────────┬──────────────┬────────────────────────────────┐
│ Thực thể dữ liệu          │ Access Nguồn │ Supabase Hiện│ Khớp (Matched)│ Chênh lệch (Delta Mới / Thiếu) │
├───────────────────────────┼──────────────┼──────────────┼──────────────┼────────────────────────────────┤
│ Chỉ thị / Job             │ 1,230        │ 1,203 (wo)   │ 1,203 (97.8%)│ ⊕ 27 Jobs MỚI CHƯA CÓ          │
│                           │              │ 1,204 (jobs) │              │                                │
│ Công đoạn (Job Steps)     │ 2,527        │ 2,447        │ 2,446 (96.8%)│ ⊕ 81 Steps MỚI CHƯA CÓ         │
│ Nhật ký công việc (Nippo) │ 7,416        │ 7,105        │ 7,105 (95.8%)│ ⊕ 311 Work Logs MỚI CHƯA CÓ    │
│ Phiếu mượn khuôn (Loans)  │ 209          │ 0            │ 0 (0%)       │ ⊕ 209 Phiếu CHƯA NẠP           │
│ Thiết bị Khuôn/Dao        │ 6,522 (tổng) │ 6,497        │ 6,497 (99.6%)│ 25 mục phụ trợ                 │
│ Khách hàng / Công ty      │ 1,725        │ 2,214        │ 1,725        │ 0 thiếu (Supabase đầy đủ hơn)   │
│ Nhân viên xưởng           │ 23           │ 25           │ 23           │ 0 thiếu (Supabase có thêm 2 TK) │
│ Máy móc gia công          │ 14           │ 14           │ 14 (100%)    │ 0 thiếu (Khớp hoàn toàn)        │
└───────────────────────────┴──────────────┴──────────────┴──────────────┴────────────────────────────────┘
```

---

## 5. PHÂN TÍCH CHI TIẾT DỮ LIỆU DELTA (PHÁT SINH MỚI & BẤT THƯỜNG)

### 5.1. Danh sách chính xác 27 Jobs MỚI (chưa có trên Supabase)
Đây là các chỉ thị gia công khuôn thực tế phát sinh gần đây tại xưởng YSD từ cuối tháng 08/2026 đến ngày **06/10/2026**:

| # | JobID | JobCode | Tên hiển thị (JobName) | Ngày bắt đầu | Hạn giao (Deadline) | Khách hàng ID | SL |
|:---:|:---:|:---|:---|:---:|:---:|:---:|:---:|
| 1 | **1251** | `ADY133R1` | ADY-133 R1 | — | 2026-09-15 | 2 | 1 |
| 2 | **1252** | `YKW009` | YKW-009 | 2026-08-29 | 2026-09-10 | 2 | 1 |
| 3 | **1253** | `TOW005DR2` | TOW-005D R2 | — | 2026-09-11 | 2 | 1 |
| 4 | **1254** | `SSK011R3` | SSK-011 R3 | — | 2026-09-14 | 2 | 1 |
| 5 | **1255** | `CHG019D` | CHG-019 D | — | 2026-09-05 | 2 | 1 |
| 6 | **1256** | `DIC0642面` | DIC-064 2面 | — | 2026-09-07 | 2 | 1 |
| 7 | **1257** | `MTM194R3` | MTM-194 R3 | — | 2026-09-04 | 2 | 1 |
| 8 | **1258** | `CHG020D` | CHG-020 D | — | 2026-09-09 | 2 | 1 |
| 9 | **1259** | `CHG016DR4` | CHG-016D R4 | — | 2026-09-09 | 2 | 1 |
| 10 | **1260** | `JAE382` | JAE-382 | 2026-09-03 | 2026-09-28 | 5 | 1 |
| 11 | **1261** | `CHG017DR4` | CHG-017 DR4 | — | 2026-09-14 | 2 | 1 |
| 12 | **1262** | `DIC0692CAV`| DIC-069-2CAV | — | 2026-09-18 | 2 | 1 |
| 13 | **1263** | `SSM059R1` | SSM-059 R1 | — | 2026-09-25 | 2 | 1 |
| 14 | **1264** | `JAE193` | JAE-193 | — | 2026-09-15 | 2 | 1 |
| 15 | **1265** | `STD013` | STD-013 | — | 2026-09-24 | 2 | 1 |
| 16 | **1266** | `NHC010` | NHC-010 | — | 2026-10-02 | 2 | 1 |
| 17 | **1268** | `ASH005R1` | ASH-005 R1 | — | 2026-09-17 | 2 | 1 |
| 18 | **1269** | `DIC145R12CAV`| DIC-145R1-2CAV | — | 2026-09-28 | 2 | 1 |
| 19 | **1270** | `CHG018DR1`| CHG-018D R1 | — | 2026-10-01 | 2 | 1 |
| 20 | **1271** | `IRI017` | IRI-017 | — | 2026-10-05 | 2 | 1 |
| 21 | **1272** | `DIC165DR6` | DIC-165D R6 | — | 2026-10-06 | 2 | 1 |
| 22 | **1273** | `TOW005R2` | TOW-005 R2 | — | 2026-10-07 | 2 | 1 |
| 23 | **1274** | `SHT022AR5` | SHT-022A R5 | — | 2026-10-08 | 2 | 1 |
| 24 | **1275** | `WB385X290` | WB-385X290 | — | 2026-09-30 | 2 | 1 |
| 25 | **1276** | `COB001` | COB-001 | — | 2026-10-09 | 2 | 1 |
| 26 | **1277** | `SMK232` | SMK-232 | — | 2026-10-13 | 2 | 1 |
| 27 | **1278** | `YCM082R1` | YCM-082 R1 | 2026-10-06 | 2026-10-19 | 1 | 1 |

*Ghi chú:* JobID 1267 bị khuyết trong Access (do người dùng xóa nháp trong Access). Dải JobID liên tục từ 1251 đến 1278.

### 5.2. Phân tích 81 Job Steps MỚI
- **55 steps** thuộc về 27 Jobs mới nêu trên.
- **26 steps** thuộc về:
  * 6 Jobs cũ bổ sung công đoạn mới: `JobID 623` (+1 step), `JobID 1170` (+1 step), `JobID 1247` (+1 step), `JobID 1248` (+1 step), `JobID 1249` (+1 step), `JobID 1250` (+1 step).
  * **20 steps** có `JobID = NULL` trong Access (là các công đoạn gá lắp độc lập hoặc phế phẩm không gán mã Job cha).

### 5.3. Phân tích 311 Work Logs MỚI (Nippo)
- **210 logs** phát sinh gần đây từ **tháng 08/2026 đến ngày 05/10/2026** (26 logs tháng 8, 155 logs tháng 9, 29 logs tháng 10).
- **94 logs** có `ProcessingDeadlineID = NULL` (trong đợt sync tháng 8/2026 script cũ đã bỏ qua bằng lệnh `if (!dlineId) continue;`).
- **7 logs** là các bản ghi hiệu chỉnh lịch sử.

---

## 6. ĐỀ XUẤT KHÓA IDEMPOTENCY & NGUYÊN TẮC ÁNH XẠ (IDEMPOTENCY KEYS)

Qua kiểm tra tính toàn vẹn (Uniqueness check), AN phát hiện trường `JobCode` trong Access có **8 trường hợp trùng mã** (do sản xuất lặp lại khuôn cùng mã qua các năm, ví dụ: `TE50522`, `A0351`, `ATS020`, `NNP001`...).  
Vì vậy, **KHÔNG ĐƯỢC dùng `JobCode` làm khóa định danh duy nhất (Unique Key)**.

### Bảng đề xuất Khóa Idempotency an toàn:

| Bảng YSDMS | Khóa Idempotency đề xuất | Cột nguồn Access | Lý do & Cơ chế bảo đảm Idempotent |
|---|---|---|---|
| `work_orders` | `legacy_id = 'JOB-' || JobID` | `tblJOB.JobID` | `JobID` là AutoNumber duy nhất 100% trong Access. Khớp chuẩn với 1,203 dòng hiện có. |
| `jobs` | `legacy_id = 'JOB-' || JobID` | `tblJOB.JobID` | Đảm bảo 1:1 giữa work_order và job, không bị xung đột khi JobCode trùng. |
| `job_steps` | `legacy_id = 'LEGACY-STEP-' || ProcessingDeadlineID` | `tblProcessingDeadline.ProcessingDeadlineID` | Khóa số nguyên duy nhất 100%. Khớp chuẩn với 2,446 dòng trên Supabase. |
| `work_logs` | `legacy_id = 'LEGACY-LOG-' || WorkLogID` | `tblWorkLog.WorkLogID` | Khóa số nguyên duy nhất 100%. Khớp chuẩn với 7,105 dòng trên Supabase. |
| `equipment_loans` | `loan_code = 'LN-BORROW-' || LPAD(MoldBorrowID, 4, '0')` | `tblMoldBorrow.MoldBorrowID` | Định dạng chuẩn module M18, chống ghi đúp tuyệt đối. |

---

## 7. XÁC NHẬN AN TOÀN HỆ THỐNG PRODUCTION

AN long trọng xác nhận:
1. **100% Thao tác Chỉ-đọc:** Quá trình kiểm toán chỉ chạy các lệnh `SELECT count(*)` và `SELECT ... range(...)`.
2. **0 Thao tác Ghi:** Không có bất kỳ câu lệnh `INSERT`, `UPDATE`, `DELETE`, `ALTER`, `CREATE` nào được thực thi trên Supabase Production.
3. **Chưa tạo bảng staging:** Tuân thủ nghiêm ngặt chỉ đạo của Minh Chủ Thoan và PE, AN chưa tạo bất kỳ bảng staging nào trên Supabase.
4. **Không sửa đổi Access nguồn:** File `ysdJOB_20261006.accdb` được mở ở chế độ `ReadOnly=1`, nguyên vẹn 100%.

---

## 8. ĐỀ XUẤT KẾ HOẠCH BƯỚC TIẾP THEO (CHỜ PE VÀ THOAN DUYỆT)

Sau khi PE thẩm định và phê duyệt báo cáo audit này:
- **Bước 1 (Staging):** Tạo các bảng staging trên Supabase:
  * `staging_access_jobs_delta` (chứa 27 Jobs)
  * `staging_access_job_steps_delta` (chứa 81 Steps)
  * `staging_access_work_logs_delta` (chứa 311 Logs)
  * `staging_access_mold_borrows` (chứa 209 Loans)
- **Bước 2 (Preflight & Audit):** Chạy kiểm tra ràng buộc FK (Customer, Equipment, Employee) trên Staging trước khi nạp vào bảng chính.
- **Bước 3 (Pilot Execution):** Chạy thử nghiệm trên 5 Jobs gần nhất (JobID 1274 $\rightarrow$ 1278) để nghiệm thu giao diện Kanban / Nippo / Gantt Chart trước khi nạp toàn bộ.

---
*Báo cáo được đính kèm đầy đủ script thực thi và dữ liệu chi tiết trong repository.*
