# 📊 BÁO CÁO TỔNG THỂ: RÀ SOÁT NGUỒN MAIL, NGHIỆP VỤ PHÒNG KHUÔN, HỒ SƠ MODULE, TRẠNG THÁI HỆ THỐNG & LỘ TRÌNH TIẾP THEO

- **Mã báo cáo:** `WO-PROJECT-STATUS-REVIEW` (Trả lời Chỉ thị `2fd59151` của PE & Minh Chủ THOAN lúc `2026-10-15 08:08 JST`)
- **Thời gian kiểm toán DB (`SELECT NOW()`):** `2026-10-14 23:42:23.952242+00:00` (`2026-10-15 08:42:23 JST`)
- **Nguyên tắc tuân thủ:** Chỉ đọc (`0` INSERT/UPDATE/DELETE trên các bảng nghiệp vụ Production, `0` migration, `0` sửa `src/`, chưa tạo `docs/dossier/`).
- **File JSON chi tiết đối ứng:** [`docs/audit_logs/2026-10-15_PROJECT_STATUS_REVIEW.json`](./2026-10-15_PROJECT_STATUS_REVIEW.json) & [`docs/audit_logs/2026-10-14_WO-MOLD-SYNC-WAVE1-DRYRUN.json`](./2026-10-14_WO-MOLD-SYNC-WAVE1-DRYRUN.json)

---

## 1. NGUỒN MAIL (`D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\mail_data`)

### 1a) Trạng thái đọc `toanysdmail.xlsx` & toàn bộ thư mục `mail_data`
- **Trước thời điểm chỉ thị `2fd59151`:** **`MỘT PHẦN`** (Các tài liệu trước đây lọc 500 email mẫu trong `00_BUSINESS_INSIGHTS.md`, 1,000 email trong `10_email_derived_business_workflows.md`, và đọc sâu các thread tiêu biểu trong `01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md` & `MOLD_CUSTODY_BUSINESS_SPEC.md`).
- **Tại lượt kiểm toán này (`2026-10-15 08:38 JST`):** **`CÓ (Đã quét tự động 100% số dòng của cả 4 file bằng Python openpyxl & csv.reader)`**:

| Tên file trong `source_data/mail_data` | Dung lượng | Số sheet | Số cột | Số dòng vật lý (`max_row`) | Số dòng không rỗng | Số bản ghi Email gốc (`SMTP`/`EX`) | Số Thread duy nhất (Normalized) |
| :--- | ---: | :---: | :---: | ---: | ---: | ---: | ---: |
| **`toanysdmail.xlsx`** | `17,049,991 B` | `1` (`toanysdmail`) | `19` | `706,674` | `295,259` | `3,152` (`3,708` headers) | `690` |
| **`toanysdmail.CSV`** | `116,572,312 B` | — | `19` | `3,875` records | `3,875` | **`3,856`** | **`725`** |
| **`toanysdmail2.xlsx`** | `14,989,789 B` | `1` (`toanysdmail2`) | `19` | `706,674` | `242,278` | `2,899` (`4,052` headers) | `642` |
| **`toanysdmail2.csv`** | `76,874,572 B` | — | `19` | `706,673` | `242,278` | `2,899` | `642` |

- **19 cột chính:** `Subject`, `Body`, `From: (Name)`, `From: (Address)`, `From: (Type)`, `To: (Name)`, `To: (Address)`, `To: (Type)`, `CC: (Name)`, `CC: (Address)`, `CC: (Type)`, `BCC: (Name)`, `BCC: (Address)`, `BCC: (Type)`, `Billing Information`, `Categories`, `Importance`, `Mileage`, `Sensitivity`.
- **Giải thích kỹ thuật vì sao `toanysdmail.xlsx` có `706,674` dòng:** File gốc xuất từ Outlook là `toanysdmail.CSV` có **`3,875` bản ghi đa dòng** (`3,856` email hợp lệ). Khi chuyển sang `toanysdmail.xlsx`, các ký tự xuống dòng (`\n`) bên trong cột `Body` làm nội dung thân email tràn xuống `295,259` dòng Excel liên tiếp kèm `411,414` dòng trống (`1 + 295,259 + 411,414 = 706,674`). Bên trong thân `Body` của `3,708` email cấp 1 chứa tổng cộng **`69,102` lượt hội thoại trích dẫn (`From:/Sent:/差出人:/送信日時:`)**.
- **Khoảng thời gian:** **`2016-02-02` đến `2026-07-06`** (`1,853` mốc ngày trích xuất trong `Subject`/`Body`, tập trung cao điểm từ `2024` đến `2026-07`; có 5 trích dẫn lịch sử từ năm `2013`).
- **Phạm vi đã đọc vs chưa đọc:**
  - **Đã đọc (`CÓ`):** Đã quét tự động 100% (`3,856` emails / `725` threads trong `toanysdmail.CSV` và `295,259` dòng không rỗng trong `toanysdmail.xlsx`) để phân loại theo 10 module nghiệp vụ và trích xuất mã khuôn/khay; đã đọc sâu toàn văn ~150 thread tiêu biểu của 11 khách hàng lớn.
  - **Chưa đọc (`CHƯA`):** Chưa đọc thủ công từng câu chữ của toàn bộ `69,102` đoạn trích dẫn lịch sử lồng nhau để bóc tách thành dữ liệu seed tự động vào bảng `business_cases`.

### 1b) Phân loại Thread Mail theo từng Module Nghiệp vụ (`CÓ` — trên toàn bộ `725` unique threads / `3,856` emails)
*(Một thread kéo dài qua nhiều giai đoạn từ Báo giá $\rightarrow$ Thiết kế $\rightarrow$ Làm khuôn $\rightarrow$ Giao hàng sẽ được đếm vào các module liên quan)*

| Mã Module Nghiệp vụ | Số Thread khớp | Số Email khớp | Ví dụ 2–3 Thread tiêu biểu (Chỉ nêu Mã Khuôn/Khay, Ngày, Dòng CSV/Excel — Không dán nội dung nhạy cảm) |
| :--- | ---: | ---: | :--- |
| **M01. Sự việc & Yêu cầu mới (`Cases / Intake`)** | **95** | 895 | • `JAE-357, JAE-358, JAE-365` (`2025-11-02`, CSV rec `1989..1991` / XLSX row `241404`)<br>• `JAE-341, JAE-342, JAE-360` (`2025-10-02`, CSV rec `1682, 1720`)<br>• `SRI-006, SRI-007` (`2025`, CSV rec `3278..3280` / XLSX row `499364`) |
| **M02. Thẩm định Kỹ thuật & Thiết kế CAD (`Tech Review & Design`)** | **361** | 2,599 | • `RPD-001, RPD-002` (`2025`, CSV rec `795, 796, 876`)<br>• `1-912163-2` (`2025`, CSV rec `500, 534, 567`)<br>• `MTM-194, MTM-195` (`2026-04-02`, CSV rec `3451, 3486, 3491`) |
| **M03. Báo giá Khuôn & Khay (`Quotations & Pricing`)** | **289** | 2,279 | • `MTM-189, MTM-190` (`2025-12-01..2026-03-02`, CSV rec `2251, 2811` / XLSX row `280012`)<br>• `DIC-161` (`2025-05-01`, CSV rec `207, 212, 213`)<br>• `JAE-346, JAE-347, JAE-348` (`2025`, CSV rec `410..425`) |
| **M04. Đơn hàng & PO (`Orders / PO`)** | **207** | 1,674 | • `JAE-343, JAE-344` (`2025-06-02`, CSV rec `648..650` / XLSX row `51098`)<br>• `RPD-005, RPD-006` (`2025-09-01`, CSV rec `1322..1327` / XLSX row `165534`)<br>• `ASH-010 / L288` (`2025-03-02`, CSV rec `167..169` / XLSX row `167`) |
| **M05. Thiết bị Khuôn, Dao cắt & Bộ SET (`Equipment & SET`)** | **320** | 1,529 | • `CHG-002, SMK-222` (`2025`, CSV rec `1249, 1252` / XLSX row `164836`)<br>• `MTM-076` (`2025-09-05`, CSV rec `1308, 1311, 1312`)<br>• `ADY-131` (`2025`, CSV rec `1027, 1031, 1107`) |
| **M06. Gia công Chế tạo & Cải tạo Khuôn (`Mold Jobs & Mod`)** | **142** | 1,515 | • `MTM-196, MTM-197` (`2026-04-02`, CSV rec `3466, 3534, 3535`)<br>• `5-912159-1, 6-912161-1` (`2025`, CSV rec `1808, 1905` / XLSX row `113684`)<br>• `TKD-023` (`2025`, CSV rec `882..884` / XLSX row `114923`) |
| **M07. Lưu giữ, Mượn trả, Kiểm kê & Phí lưu kho (`Mold Custody`)** | **181** | 1,149 | • `SMK-138, SMK-140, SMK-163` (`2019-03-01`, CSV rec `776, 778, 805`)<br>• `ADY-078` (`2025-09-01`, CSV rec `1340, 1345, 1348`)<br>• `ADV-036 / DIC-001 / XMN0P0-0020` (`2025`, XLSX rows `15, 30, 50, 70, 100, 697, 3096`) |
| **M08. Chỉ thị SX Định hình & Thầu phụ (`Forming & Subcontract`)** | **468** | 2,966 | • `5-912159-1..3` (`2025`, CSV rec `845, 847, 849` / XLSX row `113276`)<br>• `JAE-375, JAE-376` (`2025`, CSV rec `3309, 3356, 3357`)<br>• `ADY-077, ADY-088, ADY-089` (`2024-07-01`, XLSX row `2389, 3089`) |
| **M09. Chất lượng KCS & Duyệt mẫu thử (`Quality & Sample`)** | **107** | 961 | • `RPD-007` (`2025`, CSV rec `3805, 3807, 3808`)<br>• `CHG-002, CHG-007, CHG-008` (`2026-05-01`, CSV rec `3507, 3509, 3608`)<br>• `CHG-007, CHG-008, CHG-009` (`2026-06-03`, CSV rec `3645, 3648, 3769`) |
| **M10. Giao hàng, Chứng từ KH & Hóa đơn (`Shipments & Billing`)** | **464** | 3,049 | • `ADY-078` (`2025-09-01`, CSV rec `1340, 1345, 1348`)<br>• `ASH-008, ASH-009` (`2025`, CSV rec `155..157`)<br>• `RPD-007` (`2025`, CSV rec `3805..3808`) |

### 1c) Các file trong `docs/mail_analysis/` và `docs/business/` sinh ra từ Mail (`CÓ`)
1. `docs/mail_analysis/00_BUSINESS_INSIGHTS.md` (103 dòng), `docs/mail_analysis/00_README.md` (32 dòng), `docs/mail_analysis/00_SUMMARY.csv` (11 dòng) — Commit `ea0787d5b9057d04f91b590a3c1cdb2ddcd51886` (`2026-07-14 18:44:58 +0900`).
2. `docs/mail_analysis/toanysdmail.zip` (`11,983,621 B`) — Commit `a66343f095f5797de09e4c30dca78a06225e97de` (`2026-07-14 20:03:00 +0900`).
3. `docs/mail_analysis/01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md` (605 dòng) — Commit `b5a3c991e583ed95fd890155a073f1d7ae1b0b40` (`2026-07-14 20:28:20 +0900`).
4. `docs/business/MOLD_CUSTODY_BUSINESS_SPEC.md` (406 dòng) — Commit `2b282c00ba303b9d0201bb26de9274f73a2e06d0` (`2026-10-07 17:23:32 +0900`) & `b8a28b7d93935263796b4984fcd4695fc4645b5b` (`2026-10-07 17:42:56 +0900`).
5. Ngoài ra: `docs/technical/10_email_derived_business_workflows.md` (119 dòng, `2026-07-09`) và `docs/master_plan_v2/02_REAL_BUSINESS_FLOW_AND_MOLD_DEPT_SYNTHESIS.md` (133 dòng, Commit `b3513bd0d504cbd002254bbe31bdc7cb0837de57`, `2026-10-14 10:03:19 +0900`).

### 1d) Phần nào của Mail đã đưa vào Đặc tả / Code, phần nào chưa?
- **Đã đưa vào Đặc tả & Code (`CÓ` / `MỘT PHẦN`):**
  1. **Luồng `Case -> Technical Review -> Quotation -> Order` (Stage A–C):** Đã triển khai và kiểm chứng E2E qua `WO-PIPE-FIX` (`c6f20b9848636b2c6df552ef55365cb814210742`), `WO-SCHEMA-SAFETY-FIX` (`d51b5609014ba1583db6955ff73a3d214e7597fd`), `WO-PIPE-E2E-PILOT` & `WO-PIPE-E2E-CLEANUP`.
  2. **Engine Báo giá Khuôn & Khay 3 Trụ cột:** Đã đưa vào `docs/quotations/01..04` (`0ca262a828afb93f457c45072a31645948a31da8`) và code tại `src/lib/pricing/quotation-engine.ts`.
  3. **Quản trị Lưu giữ, Mượn trả & Kiểm kê Khuôn (Stage D):** Đã có Migration 098 (`equipment_loans`), `MoldLoanPDFDocument.tsx` (Biển Placard, thước dây, 2 con dấu, Pallet `1100x1100` + QR Panasonic), `/equipment/loans` và xuất Excel kiểm kê (`WO-P1-001..010`).
  4. **Hợp nhất Thiết bị, Bộ SET & Vòng đời (`WO-MOLD-UNIFY`):** Đã hoàn thành 3 commits (`8e10b6aa`, `c2d00dc9`, `9de2c64c`).
- **Chưa đưa vào Code (`CHƯA`):**
  1. **Stage E (`Sample Approval Gate`):** Bảng `sample_requests=0`, `sample_submissions=0`; chưa có cổng chặn xuất hàng thương mại khi mẫu chưa được duyệt.
  2. **Stage F (`Production Instruction` / `BP-32`):** Bảng `production_instructions=0`; trang `/production-instructions` mới là bản dựng sơ bộ (vi phạm CSS/i18n, chưa tách `Free / Paid / Office sample`).
  3. **Stage G (`External Subcontract Coordination` — Marudai `MRDI`):** Chưa có bảng/UI điều phối lịch máy thầu phụ và giờ cắt 15:00.
  4. **Chủ đề 3 `MOLD_CUSTODY` (`型保管料` Fujikura `307.5¥/tháng + 3% lãi`):** Đã có trong Spec, chưa có UI tính phí và in bộ 4 chứng từ.
  5. **Stage I (`Post-delivery child events` & Báo cáo môi trường `PPWR`):** Chưa triển khai trên UI.

---

## 2. NGHIỆP VỤ BỘ PHẬN KHUÔN & LỊCH SỬ THẢO LUẬN

### 2a) Bảng đối chiếu Yêu cầu Nghiệp vụ Phòng Khuôn

| Mã | Yêu cầu Nghiệp vụ Phòng Khuôn | Nguồn (Mail / Spec / Thảo luận) | Có trong Kế hoạch? | Có trong Code / DB? | Còn thiếu gì? |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **MOLD-R01** | Hợp nhất 8 loại thiết bị (`MOLD`, `PLUG`, `CUTTER_*`, `WATER_BASE`, `PRESSURE_BASE`, `FRAME`, `STACKING`) & Bộ SET (`SET_MEMBER`/`SHARED`) | Mail (`金型とカッターの互換`) + `ADR-001/004/010` + `WO-MOLD-UNIFY` | **CÓ** | **MỘT PHẦN** (`equipment=6,497`, `equipment_assignments=1,633`, `WO-MOLD-UNIFY` xong) | Hoàn tất `WO-EQUIPMENT-UI-FIX` (đang trong stash) & đồng bộ `+24` khuôn, `+4` dao, `+1,337` assignments ở `Wave 1`. |
| **MOLD-R02** | Vị trí giá-tầng kệ (`racks`/`rack_layers`) & Công ty lưu giữ (`keeper_company_id`) | Mail (Terada Row 3096, JAE Cột I) + Access (`tblRackLayer`, `KeeperCompany`) | **CÓ** | **MỘT PHẦN** (`racks=90`, `rack_layers=380`) | Thiếu `+20` `rack_layers` và backfill `3,940` `keeper_company_id` ở `Wave 1`; thêm selector trong `WO-EQUIPMENT-UI-FIX`. |
| **MOLD-R03** | Gia công chế tạo khuôn 4 tầng (`work_orders -> jobs -> job_steps -> work_logs`), 3 tracks & in A4 QR | Access `ysdJOB_20261006.accdb` + `ADR-002` + `WO-MOLD-DATA-SYNC-AUDIT` | **CÓ** | **MỘT PHẦN** (`work_orders=1,203`, `jobs=1,205`, `job_steps=2,457`, `work_logs=7,111`) | Hoàn tất `CreateJobModal` (`WO-EQUIPMENT-UI-FIX`); đồng bộ `+262` jobs, `+635` steps (`Wave 2`) & `+2,437` work_logs + `LEGACY-STEP-SHOP-INTERNAL` (`Wave 3`). |
| **MOLD-R04** | Chứng từ Mượn/Trả khuôn (`CUSTOMER_LOAN` / `RETURN_TO_CUSTOMER`): Placard, thước dây, 2 dấu, Pallet `1100x1100` + QR | `MOLD_CUSTODY_BUSINESS_SPEC.md` (Row 30, 52, 100) + Sprint P1 | **CÓ** | **MỘT PHẦN** (`equipment_loans=1`, `MoldLoanPDFDocument.tsx`) | Đồng bộ `587` dòng `tblMoldShipLog` & đối chiếu `209` dòng `mold_loan_certificates` sang `equipment_loans` (`Wave 4`). |
| **MOLD-R05** | Kiểm kê định kỳ T10–T2 (`INVENTORY_AUDIT` JAE/Canon/Panasonic/Rhythm/A&T): Xuất Excel cột G/H/I/J/K | `MOLD_CUSTODY_BUSINESS_SPEC.md` (Chủ đề 2, Row 15/16/50/9) | **CÓ** | **MỘT PHẦN** (`exportCustomerSurveyExcel` trong `/equipment/loans/actions.ts`) | Cần dữ liệu `keeper_company_id` (`Wave 1`) & lịch sử sử dụng thực tế (`Wave 4`) để điền đủ cột I và cột J/K. |
| **MOLD-R06** | Xuất gia công bề mặt (`OUTSOURCE_PROCESSING` Teflon/Mạ Minebea) & dập thử 24–60 tấm khi về | `MOLD_CUSTODY_BUSINESS_SPEC.md` (Row 697) + Access `tblTeflonLog` (`4,692` dòng) | **CÓ** | **MỘT PHẦN** (`OutsourceProcessingPDFDocument.tsx`) | Đồng bộ `4,686` dòng có `SentDate` của `tblTeflonLog` theo Quyết định 3.D Phương án B (`Wave 4`); thêm cổng bắt buộc dập mẫu thử sau Teflon. |
| **MOLD-R07** | Cảnh báo khuôn ngưng $\ge 3$ năm (`非稼働金型`) & Tính phí lưu kho (`型保管料` Fujikura `307.5¥/tháng + 3% lãi`) | `MOLD_CUSTODY_BUSINESS_SPEC.md` (Chủ đề 3, `source_data/金型保管料(20250704)`) | **CÓ** | **MỘT PHẦN** (`/equipment/lifecycle` đọc `v_equipment_lifecycle_status`) | **CHƯA LÀM** công cụ tính phí lưu kho `307.5¥/tháng + 3% lãi` và xuất bộ 4 chứng từ kế toán Fujikura. |
| **MOLD-R08** | Thủ tục bàn giao tiêu hủy khuôn (`廃棄対応` Omura Giken / SMK): Gom Khuôn + Phụ tùng + Bản vẽ + Biên nhận gốc gửi `着払い` | `MOLD_CUSTODY_BUSINESS_SPEC.md` (Mục 3.8, Row 70 & 82) | **CÓ** | **CHƯA LÀM** (`mold_disposal_logs=0`) | Bổ sung checklist thu hồi đủ 4 thành phần và cờ `着払い` khi tạo lệnh trả/hủy khuôn. |

### 2b) Thống kê định lượng số mục đã triển khai vs chưa triển khai
1. **`docs/business/MOLD_CUSTODY_BUSINESS_SPEC.md` (Tổng cộng 15 hạng mục nghiệp vụ cụ thể):**
   - **Đã triển khai đầy đủ trong Code & Schema:** **`7 / 15` mục** (Phân loại 3 `loan_type`; Lưu 2 khung ảnh; PDF Biển Placard + 2 con dấu; PDF Xuất gia công ngoài; PDF Trả khuôn Pallet `1100x1100` + QR; View `v_equipment_loans_summary` & UI `/equipment/loans`; Xuất Excel khảo sát kiểm kê).
   - **Đã triển khai một phần:** **`4 / 15` mục** (Vị trí kệ & `keeper_company_id` chờ Wave 1; Cảnh báo ngưng hoạt động trên `/equipment/lifecycle` chờ lịch sử sử dụng; Ký điện tử Oita Canon; Lịch sử Teflon chờ Wave 4).
   - **Chưa triển khai (`CHƯA LÀM`):** **`4 / 15` mục** (Tính phí lưu kho Fujikura `307.5¥/tháng + 3% lãi` & bộ 4 chứng từ; Cổng bắt buộc dập mẫu 24–60 tấm sau khi khuôn Teflon về; Checklist 4 thành phần hủy khuôn SMK/Omura Giken; Quản lý lịch đón đoàn kiểm toán hiện trường Terada Deimu).
2. **`docs/master_plan_v2/02_REAL_BUSINESS_FLOW_AND_MOLD_DEPT_SYNTHESIS.md` (Tổng cộng 11 khối chức năng: 8 Giai đoạn + 3 Chuyên đề Phòng Khuôn):**
   - **Đã triển khai & kiểm chứng E2E:** **`4 / 11` khối** (Giai đoạn 1 `Case Intake`, Giai đoạn 2 `Technical Review & CAD Design`, Giai đoạn 3 `Quotation & Pricing`, Chuyên đề 1 `Bộ SET 8 thiết bị`).
   - **Đã triển khai một phần:** **`5 / 11` khối** (Giai đoạn 4 & Chuyên đề 2 `Mold & SET Manufacturing`; Giai đoạn 6 `Order & Forming Instruction`; Giai đoạn 7 `Delivery & Billing`; Chuyên đề 3 `Mold Custody Lifecycle`).
   - **Chưa triển khai (`CHƯA LÀM`):** **`2 / 11` khối** (Giai đoạn 5 `Sample & KCS Approval Gate`; Điều phối thầu phụ định hình `Marudai MRDI`).

### 2c) 6 Mâu thuẫn giữa Mail, Spec và Code/DB hiện tại
1. **Luồng khởi đầu (`Order-first` vs `Case/Review-first`):** `docs/01_BRD.md:88-103` ghi `Email KH -> Order -> Design Revision`, mâu thuẫn với Mail thực tế (`01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:20-36`: `Case -> Technical Review -> Quotation -> Order`).
2. **Tên bảng thiết bị trong Spec cũ vs Schema V3:** `00_BUSINESS_INSIGHTS.md:76-78`, `10_email_derived_business_workflows.md:45,80` và `.agents/mempalace/knowledge/thermoforming_equipment_set.md:50,82-104` vẫn chỉ định dùng `physical_molds`, `mold_masters`, `auxiliary_equipments`, mâu thuẫn với `equipment` + `equipment_assignments`.
3. **Tự mâu thuẫn trong `SCHEMA_REFERENCE.md`:** Bảng `equipment_loans` được định nghĩa 2 lần khác nhau (`dòng 280-320` dùng `BORROW/RETURN/REPAIR_OUT` vs `dòng 738-785` dùng `CUSTOMER_LOAN/RETURN_TO_CUSTOMER/OUTSOURCE_PROCESSING`); bảng `shipments` lặp 2 lần (`dòng 575` vs `dòng 818`).
4. **Phân mảnh 3 bảng chứng từ lưu giữ khuôn trong DB Production:** `public.mold_loan_certificates` có `209` dòng, trong khi `public.equipment_loans` (màn hình `/equipment/loans` đang đọc) chỉ có `1` dòng, và `public.asset_custody_certificates` có `0` dòng.
5. **Lệch cột trong `MoldModal.tsx` trên `HEAD` (`a2a90587`):** `MoldModal.tsx:96` ghi `mold_revision_id` (sai tên cột `design_revision_id`) và thiếu `equipment_type` phụ trợ, `keeper_company_id`, `current_rack_layer_id`; `/equipment/unified/page.tsx:18` thiếu `'PLUG'` (đã sửa trong bản nháp `git stash` của `WO-EQUIPMENT-UI-FIX`).
6. **Lịch sử Teflon & Bảo trì:** Mail (`Minebea` Row 697) và Access (`tblTeflonLog = 4,692` dòng) ghi nhận gửi phủ Teflon thường xuyên, nhưng trên Supabase `mold_maintenance = 0` và `equipment_history = 0` (PE đã chốt Phương án D: tách lớp lịch sử Teflon, chỉ nạp `4,686` dòng có `SentDate`).

---

## 3. TỔ CHỨC HỒ SƠ THEO MODULE (`docs/dossier/`)

### 3a) Xác nhận trạng thái `docs/dossier/` trên `main`
- **XÁC NHẬN:** Trên nhánh `main` (`HEAD a2a90587c503844416985f4164380171130df940`) và trên ổ cứng hiện **CHƯA CÓ thư mục `docs/dossier/`**. AN chưa tạo thư mục này khi chưa được PE duyệt.

### 3b) Hiện trạng hồ sơ nghiệp vụ & các file dài / trùng lặp
- Hiện tại hồ sơ nằm rải rác tại `docs/` (gồm root `docs/*.md`, `docs/mail_analysis/`, `docs/business/`, `docs/quotations/`, `docs/technical/`, `docs/specs/`, `docs/adr/`, `docs/reports/`, `docs/master_plan_v2/`) và `SCHEMA_REFERENCE.md`.
- **Các file quá dài / trùng lặp / lỗi thời:**
  1. `docs/ysdms-nextgen_MASTER.md`: `1,463 dòng` (`136,791 B` ~ 136.8 KB) — sổ cái nối đuôi quá lớn.
  2. `docs/SESSION_HANDOFF.md`: `1,334 dòng` (`115,908 B` ~ 115.9 KB) — nối đuôi lịch sử nhiều tháng.
  3. `SCHEMA_REFERENCE.md`: `875 dòng` (`47,748 B` ~ 47.7 KB) — lặp định nghĩa 2 lần cho `equipment_loans`, `orders`, `shipments`.
  4. `docs/AN_deep_scan_part1/2/3.md`: `2,342 dòng` (`123,646 B`) — trùng lặp với `docs/02_BUSINESS_PROCESS_CATALOG.md` (`343 dòng`).
  5. `docs/Phase1_MoldCutter_Migration_Plan.md` (`169 dòng`), `docs/Phase2_ERP_Realignment_Plan.md` (`47 dòng`), `docs/PROJECT_STATUS.md` (`87 dòng`) — đóng băng từ tháng 7/2026, dùng tên bảng V1.

### 3c) Đề xuất Cấu trúc Thư mục `docs/dossier/`: Mỗi Module 1 Folder riêng chứa `business.md` + `schema.md` (Chưa tạo — Trình PE duyệt)
- **Nguyên tắc thiết kế (theo đúng yêu cầu 3c của THOAN & PE):**
  - Mỗi module được đặt trong **1 thư mục riêng biệt** dưới `docs/dossier/`.
  - Trong mỗi thư mục module có đúng **2 file song hành**:
    1. `business.md` ($\le 120$ dòng, $\le 5\text{ KB}$): Luồng nghiệp vụ thực tế, quy tắc khách hàng đặc thù, route chuẩn, trạng thái triển khai, và backlog của riêng module đó.
    2. `schema.md` ($\le 120$ dòng, $\le 5\text{ KB}$): Định nghĩa bảng, cột, PK/FK, CHECK constraint, View, RPC, RLS đã xác minh từ `information_schema` của riêng module đó.
  - Khi AI/Dev làm việc ở module nào, chỉ cần mở đúng **1 folder của module đó** (`business.md` + `schema.md` $\approx 8\text{--}10\text{ KB}$ tổng cộng).

```
docs/dossier/
├── 00_core/                           ← Chỉ mục gốc & Bàn giao phiên (<= 80 dòng/file)
│   ├── 00_INDEX.md
│   └── 00_ACTIVE_HANDOFF.md
├── M01_cases_reviews/                 ← Sự việc (/cases) & Thẩm định kỹ thuật (business_cases, technical_reviews)
│   ├── business.md
│   └── schema.md
├── M02_quotations_pricing/            ← Báo giá (/orders/quotations) & Engine Giá 3 trụ cột (quotations, quotation_lines)
│   ├── business.md
│   └── schema.md
├── M03_orders_pipe/                   ← Đơn hàng (/orders) & Đối soát dòng chi tiết (orders, order_lines)
│   ├── business.md
│   └── schema.md
├── M04_products_designs/              ← Product Center (/product-center) & Thiết kế CAD (/engineering/designs)
│   ├── business.md
│   └── schema.md
├── M05_equipment_set/                 ← Thiết bị hợp nhất (/equipment/unified, /molds, /cutting-dies) & Bộ SET 8 loại
│   ├── business.md
│   └── schema.md
├── M06_mold_jobs_schedule/            ← Gia công Khuôn (/equipment/jobs, /schedule, /production/work-orders)
│   ├── business.md
│   └── schema.md
├── M07_mold_custody_loans/            ← Lưu giữ, Mượn trả, Kiểm kê, Phí lưu kho, Teflon, Bảo trì (/equipment/loans, /lifecycle)
│   ├── business.md
│   └── schema.md
├── M08_thermoforming_nippo/           ← Sản xuất Định hình (/production, /production-instructions) & Nhật ký (/worklogs)
│   ├── business.md
│   └── schema.md
├── M09_quality_kcs_sample/            ← Duyệt mẫu thử KCS & Kiểm tra chất lượng (/quality/*)
│   ├── business.md
│   └── schema.md
├── M10_shipments_wms_finance/         ← Giao hàng (/shipments), Kho Nhựa/Khay (/plastics, /inventory) & Hóa đơn (/invoices)
│   ├── business.md
│   └── schema.md
└── M11_companies_master/              ← Chủ thể, Máy móc, Giá kệ, Nhân sự (/companies, /master/*)
    ├── business.md
    └── schema.md
```

- **Quy tắc cập nhật:**
  - **Ai ghi:** AN chỉ cập nhật `business.md` / `schema.md` của đúng module thuộc Work Order đang thực thi.
  - **Khi nào:** Ở Pha 3 (Nghiệm thu Work Order) hoặc khi PE duyệt đặc tả/migration mới.
  - **Ai duyệt:** PE kiểm toán diff trên GitHub và Minh Chủ THOAN phê duyệt.

---

## 4. TRẠNG THÁI TOÀN BỘ 12 MODULE CỦA HỆ THỐNG

- **Module đang thi công hiện tại:** **M05 & M06** (Đang tạm dừng `WO-EQUIPMENT-UI-FIX` ở `git stash` và chuẩn bị `WO-MOLD-SYNC-WAVE1` để lập Báo cáo tổng thể này theo chỉ thị `2fd59151`).
- **Tiến độ `WO-EQUIPMENT-UI-FIX`:**
  - **Đã bắt đầu chưa:** **ĐÃ BẮT ĐẦU** (đã viết xong code local trên 10 file theo đúng đặc tả PE duyệt lúc `2026-10-14 18:50 JST`; đã pass `npx tsc --noEmit` = 0 lỗi và `node scripts/check_translations.mjs` = 0 missing keys).
  - **Commit SHA:** **`CHƯA CÓ COMMIT`** (Toàn bộ 10 file đang được cất trong `git stash` `wip: WO-EQUIPMENT-UI-FIX held per PE directive 2fd59151` để giữ nguyên trạng `src/` trên nhánh `main` đúng yêu cầu chỉ thị `2fd59151`).
  - **Còn gì:** Ngay khi PE xem báo cáo này và cho phép tiếp tục, AN sẽ `git stash pop`, chạy Playwright (sau khi login xác thực) chụp 4 ảnh minh chứng, commit code + `docs/audit_logs/2026-10-15_WO-EQUIPMENT-UI-FIX.json` và nạp `pe_evidence_items`.

| Mã & Tên Module | Phân loại | Trạng thái 5 cấp | Commit SHA gần nhất | Evidence (`docs/audit_logs` / `pe_evidence_items` / DB Count) | Việc còn thiếu |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **M01. Sự việc & Thẩm định KT (`/cases`)** | **Hoàn thành & có bằng chứng** | Đã kiểm thử thực tế (E2E PASS) | `d51b5609014ba1583db6955ff73a3d214e7597fd` | `WO-PIPE-FIX`, `WO-SCHEMA-SAFETY-FIX`, `WO-PIPE-E2E-PILOT/CLEANUP`; DB `profiles=3`, `business_cases=0`, `technical_reviews=0` | Tạo nhanh SP/Bản vẽ từ Review; child-events hậu giao hàng (Stage I). |
| **M02. Báo giá & Engine Giá (`/orders/quotations`)** | **Hoàn thành & có bằng chứng** | Đã kiểm thử thực tế (E2E PASS) | `d51b5609014ba1583db6955ff73a3d214e7597fd` | `WO-PIPE-FIX`, `WO-SCHEMA-SAFETY-FIX` (Method A1 RPC); DB `quotations=0`, `quotation_lines=0` | Hỗ trợ so sánh nhiều phương án báo giá trên cùng 1 Case (giai đoạn sau). |
| **M03. Đơn hàng (`/orders`)** | **Hoàn thành & có bằng chứng** | Đã kiểm thử thực tế | `013f55bf8716a81c50445c5673b5903a5c49ac9a` | `WO-ORDER-NOTES-BACKFILL`, `WO-ORDER-SHIPMENT-UI-FIX`, Option C Audit (`orders=2,396`, `order_lines=6,279` khớp 100% staging) | Chốt thời điểm đóng/archive bảng `staging_order_lines_backfill`. |
| **M04. Product Center & CAD (`/product-center`, `/engineering/designs`)** | **Hoàn thành & có bằng chứng** | Đã kiểm thử thực tế | `013f55bf8716a81c50445c5673b5903a5c49ac9a` | `2026-10-14_WO-MOLD-UNIFY.json`, `2026-10-14_WO-ROUTE-CLEANUP.json`; DB `products=8,489`, `design_revisions=4,693` | Đồng bộ `+88` `design_revisions` mới (`+54` `products`) & map `71` dòng trùng `design_code` ở `Wave 1`. |
| **M05. Thiết bị Hợp nhất & Bộ SET (`/equipment/unified`, `/molds`, `/cutting-dies`)** | **Tạm dừng** *(Giữ ở `git stash` theo chỉ thị `2fd59151`)* | Mã đã viết (Local stash `WO-EQUIPMENT-UI-FIX`) | `817f7b340b65dfbbc600344430ac150bef41afda` | `2026-10-14_WO-MOLD-UNIFY.json`, `2026-10-14_WO-MOLD-DATA-SYNC-AUDIT.json`; DB `equipment=6,497`, `equipment_assignments=1,633` | Pop stash & nộp Evidence Pack cho `WO-EQUIPMENT-UI-FIX`; chạy `WO-MOLD-SYNC-WAVE1` sau khi qua Cổng 1 PE. |
| **M06. Gia công Khuôn & Lịch biểu (`/equipment/jobs`, `/schedule`, `/production/work-orders`)** | **Hoàn thành một phần** | Đã kiểm thử thực tế (UI) / Chờ đồng bộ delta Access | `42851ee3f98af1ae353f81cb922c8719ae554ef0` | `2026-10-14_WO-MOLD-UNIFY.json`, `2026-10-14_WO-ROUTE-CLEANUP.json`; DB `work_orders=1,203`, `jobs=1,205`, `job_steps=2,457`, `work_logs=7,111` | Hoàn tất `CreateJobModal` (`WO-EQUIPMENT-UI-FIX`); đồng bộ `Wave 2` (`+262` jobs, `+635` steps) & `Wave 3` (`+2,437` work_logs). |
| **M07. Lưu giữ, Mượn trả, Kiểm kê & Bảo trì (`/equipment/loans`, `/lifecycle`, `/maintenance`)** | **Hoàn thành một phần** | Đã kiểm thử thực tế (UI & PDF P1) / Chờ đồng bộ lịch sử | `9de2c64ca0137b52cc29f87445abd216013e10a5` | `2026-10-14_WO-MOLD-UNIFY.json`; DB `equipment_loans=1`, `mold_loan_certificates=209`, `v_equipment_lifecycle_status=6,497`, `equipment_history=0` | Đồng bộ `Wave 4` (`587` ShipLog, `4,686` TeflonLog có SentDate, `209` loan certificates); làm tính phí lưu kho Fujikura & checklist hủy khuôn SMK. |
| **M08. Định hình, Chỉ thị SX & Nhật ký (`/production`, `/production-instructions`, `/worklogs`)** | **Hoàn thành một phần** | Mã đã viết (`/worklogs` có 7,111 dòng; `/production-instructions` sơ bộ) | `42851ee3f98af1ae353f81cb922c8719ae554ef0` | `2026-10-14_WO-ROUTE-CLEANUP.json`; DB `work_logs=7,111`, `production_schedules=30`, `production_instructions=0` | Chuẩn hóa `/production-instructions` theo Stage F (Free/Paid/Office sample, sửa Tailwind/i18n); bổ sung điều phối thầu phụ Marudai (Stage G). |
| **M09. Chất lượng KCS & Duyệt mẫu (`/quality/*`)** | **Chưa bắt đầu** *(ở mức Sample Gate)* | Mã đã viết (Khung UI) / DB `0` dòng | `013f55bf8716a81c50445c5673b5903a5c49ac9a` | DB `inspections=0`, `tray_inspections=0`, `sample_requests=0`, `defect_reports=0` | Triển khai `WO-SAMPLE-QC-GATE` nối Mẫu thử $\rightarrow$ KCS $\rightarrow$ Mở khóa xuất hàng. |
| **M10. Giao hàng, Kho Nhựa/Khay & Hóa đơn (`/shipments`, `/plastics`, `/inventory`, `/invoices`)** | **Hoàn thành một phần** | Đã áp dụng vào Supabase (Kho có dữ liệu; Shipments/Invoices `0` dòng) | `013f55bf8716a81c50445c5673b5903a5c49ac9a` | `WO-ORDER-SHIPMENT-UI-FIX`, `2026-10-14_WO-ROUTE-CLEANUP.json`; DB `plastic_master=818`, `plastic_receipt_roll=321`, `material_stock=180`, `shipments=0`, `invoices=0` | Kiểm thử E2E tạo phiếu giao hàng (`納品書` chuẩn & SMK/KYD) + hóa đơn (`請求書`) từ Order. |
| **M11. Chủ thể, Máy móc, Giá kệ & Nhân sự (`/companies`, `/master/*`)** | **Hoàn thành & có bằng chứng** | Đã kiểm thử thực tế | `013f55bf8716a81c50445c5673b5903a5c49ac9a` | `WO-SCHEMA-SAFETY-FIX`, `WO-ROUTE-CLEANUP`; DB `companies=2,214`, `employees=25`, `profiles=3`, `machines=14`, `racks=90`, `rack_layers=380` | Bổ sung `+20` `rack_layers` từ Access trong `WO-MOLD-SYNC-WAVE1`. |
| **M12. Dashboard, Báo cáo & Xác thực (`/dashboard`, `/reports/*`, `/login`)** | **Hoàn thành & có bằng chứng** | Đã kiểm thử thực tế | `817f7b340b65dfbbc600344430ac150bef41afda` | `WO-SCHEMA-SAFETY-FIX`, `WO-ROUTE-CLEANUP`; DB `pe_an_messages=163`, `pe_evidence_items=20` | Hoàn tất sửa ngày hardcode & dead link trên `/equipment/dashboard` trong `WO-EQUIPMENT-UI-FIX`. |

---

## 5. KẾ HOẠCH TIẾP THEO (TỪ NHU CẦU THỰC TẾ MAIL, PHÒNG KHUÔN & ACCESS)

### 5a, 5b, 5c) Thứ tự Ưu tiên Đề xuất (Tách rõ Nhóm UI/Read-Only và Nhóm DB 2 Cổng)

| Thứ tự | Mã Work Order | Phân nhóm Cổng Rủi ro | Mục tiêu & Phạm vi | Rủi ro | Đụng DB? | Cần Minh Chủ THOAN / PE duyệt gì? |
| :---: | :--- | :--- | :--- | :---: | :---: | :--- |
| **1** | **`WO-EQUIPMENT-UI-FIX`** | **Nhóm UI / Form Actions** (Batch 1 commit + Evidence Pack) | Hoàn tất 5 mục UI Thiết bị & Job đã duyệt lúc `18:50 JST` hôm qua (10 files đang nằm sẵn trong `git stash`, đã pass `tsc` & `i18n`). | Thấp | **Không** (0 migration, 0 backfill) | Cho phép pop stash, chạy Playwright chụp 4 ảnh sau khi login và đẩy commit nghiệm thu. |
| **2** | **`WO-DOC-MODULAR`** | **Nhóm Tài liệu / Read-Only** | Khởi tạo `docs/dossier/` theo đúng Mục 3c (12 folders: `00_core` + `M01..M11`, mỗi folder chứa `business.md` + `schema.md` $\le 120$ dòng). | Không | **Không** | Duyệt cấu trúc 12 folders tại Mục 3c. |
| **3** | **`WO-MOLD-SYNC-WAVE1`** | **Nhóm DB / Dữ liệu (Bắt buộc qua 2 Cổng PE)** | Đồng bộ Master Phòng Khuôn từ Access: `+20` `rack_layers`, `+88` `design_revisions` mới (`+54` `products`) + map `71` dòng trùng `design_code`, `+24` khuôn `M-*`, `+4` dao `C-*`, backfill `3,940` `keeper_company_id`, `+1,337` `equipment_assignments`. | Trung bình | **CÓ** (`INSERT/UPDATE` có `ROW_COUNT` guard) | Duyệt 2 quyết định xử lý `design_revisions` (xem Mục 5d) và duyệt chạy sau Cổng 1 PE. |
| **4** | **`WO-MOLD-SYNC-WAVE2 & WAVE3`** | **Nhóm DB / Dữ liệu (Bắt buộc qua 2 Cổng PE)** | Đồng bộ `+262` `jobs`, `+635` `job_steps`, tạo `LEGACY-STEP-SHOP-INTERNAL` (Wave 2) và nạp `+2,437` `work_logs` (Wave 3) từ Access. | Trung bình | **CÓ** (Qua 2 cổng PE) | Duyệt payload Dry-Run chi tiết sau khi Wave 1 hoàn tất. |
| **5** | **`WO-MOLD-SYNC-WAVE4`** | **Nhóm DB / Dữ liệu (Bắt buộc qua 2 Cổng PE)** | Đồng bộ `587` `tblMoldShipLog`, `4,686` `tblTeflonLog` có `SentDate` (theo Quyết định 3.D Phương án B) và hợp nhất `209` dòng `mold_loan_certificates`. | Trung bình | **CÓ** (Qua 2 cổng PE) | Xác nhận cách ánh xạ `209` dòng `mold_loan_certificates` sang `equipment_loans`. |
| **6** | **`WO-PRODUCTION-INSTRUCTION-AND-SAMPLE-GATE`** | **Nhóm Nghiệp vụ Mail (Stage E & Stage F)** | Chuẩn hóa `/production-instructions` (Free/Paid/Office sample) và triển khai Cổng Duyệt Mẫu Thử KCS (`Sample Approval Gate`). | Thấp–TB | Dùng bảng sẵn có (`production_instructions`, `sample_requests`) | Duyệt đặc tả chi tiết sau khi hoàn tất đồng bộ dữ liệu Phòng Khuôn. |

### 5d) Đối chiếu `WO-MOLD-DATA-SYNC-AUDIT`: Trạng thái Wave 1–4 & Quyết định cần từ THOAN
1. **Wave 1 (`WO-MOLD-SYNC-WAVE1`):** **Đã hoàn tất phân tích Dry-Run chỉ-đọc** (lưu tại [`docs/audit_logs/2026-10-14_WO-MOLD-SYNC-WAVE1-DRYRUN.json`](./2026-10-14_WO-MOLD-SYNC-WAVE1-DRYRUN.json)):
   - `rack_layers`: `+20` dòng thiếu khớp `20/20` với `public.racks`.
   - `equipment`: `+24` khuôn (`M-5904..M-5929`, gồm 23 `MOLD` + 1 `WATER_BASE` `WB-385X290`) và `+4` dao cắt (`C-3148, 3150, 3152, 3154`) khớp 100% FK.
   - Backfill `keeper_company_id`: **`3,940 / 3,940` khuôn `M-*` hiện có** và **`3 / 3` dao cắt `C-*`** có `KeeperCompany` trong Access ánh xạ 100% (`0` unresolved) sang `public.companies.company_id`.
   - `equipment_assignments`: `+1,337` cặp liên kết Khuôn–Dao mới từ `tblMoldCutter` (`265` `SET_MEMBER` + `1,072` `SHARED`).
   - **Quyết định cần từ THOAN / PE cho Wave 1:** Trong `159` dòng `tblMoldDesign` chưa khớp `legacy_id = 'D-' || MoldDesignID`, có **`71` dòng đã tồn tại trong `public.design_revisions` theo `design_code`** và **`88` dòng thực sự mới** (`34` dòng đã có `products`, `54` dòng chưa có `products`). Đề nghị duyệt: (a) Với `71` dòng trùng `design_code`, map thẳng vào `design_revision_id` hiện có (không tạo trùng); (b) Với `54` dòng chưa có `products`, cho phép tạo `54` dòng `products` trước khi insert `88` `design_revisions`.
2. **Wave 2 (`Jobs & Job Steps`):** Đã chốt Quyết định 3.C Phương án A (`LEGACY-STEP-SHOP-INTERNAL`). Chờ Wave 1 chạy xong để xuất payload Dry-Run chi tiết.
3. **Wave 3 (`Work Logs`):** Đã chốt phương án gắn `118` dòng nội bộ vào `LEGACY-STEP-SHOP-INTERNAL` cùng `2,319` dòng có `ProcessingDeadlineID`. Chờ Wave 2.
4. **Wave 4 (`ShipLog, TeflonLog & Loan Certificates`):** Đã chốt Quyết định 3.D Phương án B (`4,686` dòng `tblTeflonLog` có `SentDate` + `587` dòng `tblMoldShipLog`). Cần quyết định phương án hợp nhất `209` dòng `mold_loan_certificates` hiện có trên Supabase vào `equipment_loans`.

### 5e) 5 Hạng mục nên DỪNG hoặc BỎ HẲN vì không còn đúng nhu cầu thực tế
1. **BỎ HẲN** các kế hoạch migration/UI dựa trên bảng V1 (`mold_base`, `mold_physical`, `cutter_master`, `product_master`, `mold_work_orders`, `mold_design_cutters`, `auxiliary_equipments`) trong `docs/Phase1_MoldCutter_Migration_Plan.md` và `docs/Phase2_ERP_Realignment_Plan.md`.
2. **BỎ HẲN** việc đổ tràn 100% `4,692` dòng `tblTeflonLog` vào `public.mold_maintenance` (tuân thủ Quyết định 3.D Phương án B).
3. **BỎ HẲN** việc gỡ ràng buộc `NOT NULL` trên `work_logs.job_step_id` (tuân thủ Quyết định 3.C Phương án A).
4. **DỪNG** mọi phát triển trên 29+1 route trùng lặp đã chuyển hướng về Canonical V3 trong `WO-ROUTE-CLEANUP` (`/production/mold-orders`, `/master/molds`, `/master/products`, `/master/cutters`, `/production/worklog`, `/production/inventory`, `/warehouse/rolls`).
5. **DỪNG** việc ghi nối đuôi (`append-only`) vào `docs/ysdms-nextgen_MASTER.md` (`136.8 KB`) và `docs/SESSION_HANDOFF.md` (`115.9 KB`), chuyển sang kiến trúc `docs/dossier/` ngay sau khi được duyệt.
