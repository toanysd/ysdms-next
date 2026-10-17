# 📊 Báo Cáo Tổng Hợp Kiểm Toán Dữ Liệu 3 Đợt Đồng Bộ (`WO-DATA-AUDIT-SUMMARY`)

- **Chỉ thị PE:** `ID: 715539cb` (`2026-10-17 17:47 JST`)
- **Chế độ thực thi:** Read-Only (`0` DB mutations, `readonly=True`)
- **Nguồn đối chiếu:** Access `docs/ysdJOB_20261006.accdb` (`51` bảng: `42` bảng người dùng + `9` bảng hệ thống `~TMPCLP*`) $\leftrightarrow$ Supabase Production (`iirezrszalmecsslbruo`)
- **Tổng số phép biến đổi qua 3 bảng Staging (`100% applied`):** `7,438` dòng (`Wave 1 = 1,824` | `Wave 2 = 2,785` | `Wave 3 = 2,829`)

---

## 1. Số Dòng Đã Nạp / Cập Nhật Theo Bảng Qua 3 Wave (`Wave 1 + Wave 2 + Wave 3`)

### 1.1. `WO-MOLD-SYNC-WAVE1` (`CLOSED` — Commit `c6f3ca9e98f88856fb3ef7d6ee8da6701a4ba412`, Staging `1,824/1,824`)
| Bước | Bảng Đích (`public.*`) | Thao Tác | Số Dòng | Trước $\rightarrow$ Sau | Nội Dung Nghiệp Vụ |
| :--- | :--- | :---: | ---: | :---: | :--- |
| **1.0** | `companies` | `INSERT` | `1` | `2,214` $\rightarrow$ `2,215` | Thêm `CUST-444` (`COB` — コバヤシ) từ `tblCustomer` |
| **1.1** | `rack_layers` | `INSERT` | `20` | `380` $\rightarrow$ `400` | Thêm `20` tầng giá kệ (`RackLayerID 381..400`) từ `tblRackLayer` |
| **1.2A** | `design_revisions` | `UPDATE` | `70` | `4,693` $\rightarrow$ `4,693` | Chuẩn hóa tiền tố `legacy_id` từ `DESIGN-*` $\rightarrow$ `D-*` (`4786..4916`) |
| **1.2B** | `products` | `INSERT` | `54` | `8,489` $\rightarrow$ `8,543` | Tạo `54` sản phẩm cha còn thiếu (`22 TRAY-*` + `32 P-*`) cho `88` bản vẽ mới |
| **1.2C** | `design_revisions` | `INSERT` | `88` | `4,693` $\rightarrow$ `4,781` | Thêm `88` bản vẽ thiết kế khuôn (`D-*`) từ `tblMoldDesign` |
| **1.3A** | `equipment` | `INSERT` | `24` | `6,497` $\rightarrow$ `6,521` | Thêm `24` khuôn (`M-*`) từ `tblMold` |
| **1.3B** | `equipment` | `INSERT` | `4` | `6,521` $\rightarrow$ `6,525` | Thêm `4` dao cắt (`C-*`) từ `tblCutter` |
| **1.4** | `equipment` | `UPDATE` | `226` | `0` $\rightarrow$ `226` | Backfill `keeper_company_id` khớp nghiêm ngặt `COMP-*` (`225 MOLD` + `1 CUTTER`) |
| **1.5** | `equipment_assignments` | `INSERT` | `1,337` | `1,633` $\rightarrow$ `2,970` | Thêm `1,337` cặp ghép Khuôn–Dao (`265 SET_MEMBER` + `1,072 SHARED`) từ `tblMoldCutter` |

### 1.2. `WO-MOLD-SYNC-WAVE2` (`CLOSED` — Commit `3cff159d744d68daff09293d3c1479c704b6c319`, Staging `2,785/2,785`)
| Bước | Bảng Đích (`public.*`) | Thao Tác | Số Dòng | Trước $\rightarrow$ Sau | Nội Dung Nghiệp Vụ |
| :--- | :--- | :---: | ---: | :---: | :--- |
| **2.0** | `equipment` | `UPDATE` | `67` | `4,726` $\rightarrow$ `4,793` | Backfill `design_revision_id` cho `67` khuôn `M-*` qua `tblJOB.MoldDesignID` (`100%` `M-*` có bản vẽ) |
| **2.1A** | `work_orders` | `UPDATE` | `1,202` | `1,203` $\rightarrow$ `1,203` | Backfill 7 cột FK/trạng thái/kỳ hạch toán cho `1,202` lệnh SX hiện hữu từ `tblJOB` |
| **2.1B** | `jobs` | `UPDATE` | `1,202` | `1,205` $\rightarrow$ `1,205` | Backfill `mold_design_id` & `equipment_id` cho `1,202` jobs hiện hữu từ `tblJOB` |
| **2.2A** | `work_orders` | `INSERT` | `27` | `1,203` $\rightarrow$ `1,230` | Thêm `27` lệnh gia công khuôn mới từ `tblJOB` |
| **2.2B** | `jobs` | `INSERT` | `27` | `1,205` $\rightarrow$ `1,232` | Thêm `27` jobs gia công khuôn mới từ `tblJOB` (cùng `2` jobs gốc NextGen = `1,232`) |
| **2.3** | `job_steps` | `INSERT` | `55` | `2,457` $\rightarrow$ `2,512` | Thêm `55` công đoạn hợp lệ từ `tblProcessingDeadline` (`2,507` legacy + `5` native = `2,512`) |
| **2.4** | `work_logs` | `INSERT` | `205` | `7,111` $\rightarrow$ `7,316` | Thêm `205` nhật ký giờ công hợp lệ từ `tblWorkLog` (`7,315` legacy + `1` native = `7,316`) |
| **2.5** | `equipment` | `UPDATE` | `27` | `0` $\rightarrow$ `27` | Backfill `equipment.company_id` (nhà cung cấp gia công khuôn: `TKC=18`, `NSB=7`, `MTY=2`) |

### 1.3. `WO-MOLD-SYNC-WAVE3` (`CLOSED` — Commit `8a6b7db922cfbc58f73a3c9a9c5b32475ea55dec`, Staging `2,829/2,829`)
| Bước | Bảng Đích (`public.*`) | Thao Tác | Số Dòng | Trước $\rightarrow$ Sau | Nội Dung Nghiệp Vụ |
| :--- | :--- | :---: | ---: | :---: | :--- |
| **3.1** | `equipment_history` | `INSERT` | `1,488` | `0` $\rightarrow$ `1,488` | Ghi `1,488` dòng `tblLocationLog` (`LOCATION_CHANGE`); bảo toàn `asset_location_logs = 1,450` |
| **3.2** | `equipment_ship_logs` | `INSERT` | `356` | `0` $\rightarrow$ `356` | Tạo bảng & ghi `356` dòng `tblShipLog` có `ShipDate IS NOT NULL` (`Q2`) |
| **3.3** | `mold_maintenance` | `INSERT` | `190` | `0` $\rightarrow$ `190` | Ghi `190` dòng `tblTeflonLog` có `SentDate IS NOT NULL` (`TEFLON_COATING` — `Q3`) |
| **3.4A** | `mold_name_history` | `INSERT` | `35` | `0` $\rightarrow$ `35` | Tạo bảng & ghi `35` dòng đổi tên khuôn từ `tblMoldLog` (`Q4`) |
| **3.4B** | `equipment_history` | `INSERT` | `56` | `1,488` $\rightarrow$ `1,544` | Ghi `35` `MODIFICATION` (`tblMoldLog`) + `21` `CUTTER_MAINTENANCE` (`tblCutterLog`) |
| **3.5A** | `equipment_status_logs` | `INSERT` | `352` | `0` $\rightarrow$ `352` | Tạo bảng & ghi `352` dòng `statuslogs` có `Status IS NOT NULL` (`Q5/5A`) |
| **3.5B** | `equipment_history` | `INSERT` | `352` | `1,544` $\rightarrow$ `1,896` | Ghi `352` sự kiện `STATUS_*` (`CHECK_IN: 215`, `CHECK_OUT: 112`, `AUDIT: 23`, `CHANGE: 2`) |

---

## 2. Thống Kê Đầy Đủ Các Dòng Excluded Theo Lý Do Qua 3 Wave

| Wave | Bảng Nguồn Access | Số Dòng Excluded | Lý Do Kỹ Thuật & Quy Quyết Kiến Trúc Của PE |
| :---: | :--- | ---: | :--- |
| **Wave 1** | `tblMoldDesign` (`4,782` dòng) | **`1`** | `MoldDesignID=4725` trùng mã bản vẽ `CHG001D` với `MoldDesignID=4724` (`D-4724`) và có `0` khuôn/dao tham chiếu $\rightarrow$ Bỏ qua insert, ánh xạ về `D-4724` (`Condition 4.1`). |
| **Wave 1** | `tblMold` / `tblCutter` (`KeeperCompany`) | **`3,717`** | Quy tắc khớp nghiêm ngặt `COMP-*` (`Condition 4.4`): `KeeperCompany=2` (YSD nội bộ: `3,714` khuôn + `1` dao) và `KeeperCompany=1540` (MTM: `2` khuôn `M-2926, M-4412`) không có dòng `COMP-2`/`COMP-1540` $\rightarrow$ Giữ `keeper_company_id = NULL`. |
| **Wave 1** | `tblMoldCutter` (`2,738` dòng) | **`152`** | `152` dòng trỏ tới `MoldDesignID` không có khuôn vật lý `M-*` trong `tblMold` (dao cắt đã liên kết trực tiếp qua `equipment.design_revision_id`). `2,586` dòng có khuôn vật lý đã bung thành `2,970` cặp `(MOLD, CUTTER)` trong `equipment_assignments`. |
| **Pre-W1** | `tblTray` (`4,112` dòng) | **`7`** | `7` dòng trống hoàn toàn (`TrayID: 5206, 5223, 5226, 5244, 5277, 5370, 5381` có `TrayName = NULL` và `TrayCode = NULL`); `4,105` khay hợp lệ đã nạp vào `public.products` (`TRAY-*`). |
| **Wave 2** | `tblProcessingDeadline` (`2,527` dòng) | **`20`** | Cột `JobID` mồ côi (`Decision 2.D`): `19` dòng có `JobID IS NULL` và `1` dòng có `JobID=575` không tồn tại trong `tblJOB` (`EXCLUDED_ORPHAN_JOB_STEPS`). |
| **Wave 2** | `tblWorkLog` (`7,416` dòng) | **`7`** | Cột `ProcessingDeadlineID` mồ côi (`Decision 2.E`): `6` dòng trỏ tới step có `JobID IS NULL` và `1` dòng trỏ tới `ProcessingDeadlineID=1736` không tồn tại (`EXCLUDED_ORPHAN_WORK_LOGS`). |
| **Wave 2** | `tblWorkLog` (`7,416` dòng) | **`94`** | Cột `ProcessingDeadlineID IS NULL` (`Decision 2.E`): Không thể gán `work_logs.job_step_id` (`NOT NULL`); đã lưu danh sách kiểm toán trong `EXCLUDED_LEGACY_WORK_LOGS`. |
| **Wave 2** | `tblJOB` (`MachiningCustomerID`) | **`166`** | Tự gia công nội bộ & vendor chưa định danh (`Decision 2.C`): `164` jobs có `MachiningCustomerID=4` (`YSD` tự gia công $\rightarrow$ `equipment.company_id = NULL`) và `2` jobs có `MachiningCustomerID=5` (`NULL`). |
| **Wave 3** | `tblShipLog` (`358` dòng) | **`2`** | Thiếu ngày vận chuyển (`Decision Q2`): `ShipID=619` và `ShipID=620` có `ShipDate IS NULL` (`EXCLUDED_SHIPLOGS`). |
| **Wave 3** | `tblTeflonLog` (`4,692` dòng) | **`4,502`** | Chưa gửi đi phủ Teflon (`Decision Q3`): `78` dòng pending chỉ có `RequestedDate` (`EXCLUDED_TEFLON_PENDING_78`) + `4,424` dòng trống (`RequestedDate IS NULL AND SentDate IS NULL`). Chỉ nạp `190` dòng có `SentDate IS NOT NULL`. |
| **Wave 3** | `tblMoldLog` (`36` dòng) | **`1`** | Dòng trống hoàn toàn (`Decision Q4`): `MoldLogID=24` có `MoldID=NULL, ChangeDate=NULL, OldMoldName=NULL, NewMoldName=NULL` (`EXCLUDED_MOLDLOGS`). |
| **Wave 3** | `statuslogs` (`398` dòng) | **`46`** | Thiếu mã trạng thái (`Decision Q5`): `46` dòng có `Status IS NULL` (`EXCLUDED_STATUSLOGS_46`). |

---

## 3. Kiểm Kê Toàn Bộ 51 Bảng Access (`ysdJOB_20261006.accdb`) & Dữ Liệu Còn Lại Chưa Đồng Bộ

- **Nhóm A — Đã đồng bộ hoàn chỉnh (`30/42` bảng người dùng):** Toàn bộ dữ liệu khuôn, dao cắt, thiết kế, sản phẩm, công ty, giá kệ, lệnh gia công, công đoạn, nhật ký giờ công, mượn trả khuôn (`tblMoldBorrow = 209` $\rightarrow$ `mold_loan_certificates = 209`), và 6 bảng lịch sử vòng đời/bảo trì (`Wave 1 + Wave 2 + Wave 3`).
- **Nhóm B — Bảng danh mục nhựa (`9/42` bảng người dùng):** `tblPLASTICforForming` (`330` dòng) và 8 bảng tra cứu `tblPlastic*` (`149` dòng) đã được chuẩn hóa/tích hợp vào `public.plastic_master` (`818` dòng) và thông số vật liệu trên `public.design_revisions`.
- **Nhóm C — Các bảng Access còn lại chưa đồng bộ hoặc không cần đồng bộ (`12` mục: `3` bảng vật tư gia công khuôn, `3` bảng nhỏ, `6` bảng rỗng/lịch sử cũ/clipboard):**

| STT | Bảng Access | Số Dòng Access | Bảng Đích Ứng Viên Trên Supabase (Hiện Tại) | Phân Loại & Trạng Thái Chi Tiết |
| :---: | :--- | :---: | :--- | :--- |
| **1** | `VatTuTbl` | `723` | `public.materials` (`0` dòng) | **CHƯA ĐỒNG BỘ (Tùy chọn):** Danh mục phôi vật tư / nhôm / thép chế tạo khuôn (`MSVatTu`, `TenVatTu`, kích thước). |
| **2** | `DatHangVTTbl` | `1,396` | `public.mold_material_bom` (`0` dòng) | **CHƯA ĐỒNG BỘ (Tùy chọn):** Lịch sử đặt mua vật tư chế tạo khuôn gắn theo `JobID` (`1,396` dòng). |
| **3** | `VatTuSDtbl` | `64` | `public.material_consumption_logs` (`0` dòng) | **CHƯA ĐỒNG BỘ (Tùy chọn):** Nhật ký xuất dùng vật tư chế tạo khuôn gắn theo `WorkLogID` (`64` dòng). |
| **4** | `tblDefect` | `4` | `public.defect_reports` / `job_qc_logs` (`0` dòng) | **CHƯA ĐỒNG BỘ (Tùy chọn):** `4` bản ghi lỗi gia công khuôn lịch sử (`JobID: 94, 552, 159, 7`). |
| **5** | `tblCase` | `18` | Chưa có bảng riêng (Tra cứu kích thước thùng carton) | **CHƯA ĐỒNG BỘ (Tùy chọn):** `18` dòng thông số quy cách thùng đóng gói (`TatamuSize`, `Chouhen`, `tanpen`, `fukasa`). |
| **6** | `tblResponsiblePerson` | `13` | `public.employees` (`25` dòng) | **ĐÃ ÁNH XẠ QUA TÊN:** Bảng tra cứu 13 người phụ trách trong Access; đã đối chiếu sang `employees` khi nạp `work_orders`. |
| **7** | `tblEmployee_old` | `7` | Không áp dụng (Bản lưu cũ của `tblEmployee`) | **KHÔNG CẦN ĐỒNG BỘ:** Đã được thay thế bởi `tblEmployee` (`23` dòng $\rightarrow$ `public.employees = 25`). |
| **8** | `tblStakings` | `2` | `public.equipment` (`STACKING = 1`) | **KHÔNG CẦN ĐỒNG BỘ:** Chỉ có 2 dòng nháp thiếu tên (`'MZT-007'`, `'ZA'`); khuôn stacking thực tế nằm ở `tblMold` (`M-5212`). |
| **9** | `tblTrayOrder` | `2` | `public.orders` (`2,396` dòng) | **KHÔNG CẦN ĐỒNG BỘ:** Chỉ chứa 2 dòng dữ liệu test (`seed-plan-20260310-01`); đơn hàng thực tế (`2,396` orders / `6,279` lines) đã nạp từ nguồn CSV/Excel. |
| **10** | `scraplog` | `0` | `public.mold_disposal_logs` (`0` dòng) | **BẢNG RỖNG TRONG ACCESS (`0` dòng).** |
| **11** | `tblMoldDesignLog` | `0` | `public.design_approval_logs` (`0` dòng) | **BẢNG RỖNG TRONG ACCESS (`0` dòng).** |
| **12** | `~TMPCLP*` (`9` bảng) | `23` | Không áp dụng (Bảng tạm hệ thống MS Access) | **BỎ QUA:** Dữ liệu clipboard/paste error nội bộ của MS Access. |
