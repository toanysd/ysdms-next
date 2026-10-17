# 🔍 BÁO CÁO DEEP SCAN PART 3 — Source Data & Legacy System Analysis
## Phân tích toàn diện quy trình nghiệp vụ từ dữ liệu nguồn

> **Ngày phân tích:** 2026-07-15  
> **Phạm vi:** `source_data/` — CSV Access, CSV Web, Customer Data, Planning, Machines, ISO, Forms, Quotations, Delivery Notes  
> **Phương pháp:** Đọc header tất cả CSV, phân tích cấu trúc thư mục, đọc email nghiệp vụ thực tế  

---

## 📊 TỔNG QUAN DỮ LIỆU NGUỒN

### Thống kê file theo nhóm

| Nguồn dữ liệu | Số file CSV | Bảng dữ liệu chính | Ghi chú |
|:---|:---:|:---|:---|
| `csv-access-data/` | 62 | Legacy Access DB → 62 bảng | Hệ thống cũ hoàn chỉnh |
| `csv-web-data/` | 42 | Supabase Web App hiện tại | Thiếu 20+ bảng so với Access |
| `csv-merged_output/tool1_sync_new/` | 65 | Merged Access+Web | Bao gồm `moldmaster.csv`, `moldrevision.csv` |
| `csv-merged_output/tool2_smart_merge/` | 20 | Smart merge chọn lọc | Chỉ các bảng cốt lõi |
| `molddesigns_full.csv` | 1 | 4,626 thiết kế khuôn | Export riêng |
| `molds_seed_list_full.csv` | 1 | 4,657 khuôn vật lý | Export riêng |

---

## 🏗️ PHẦN 1: CÁC ENTITY NGHIỆP VỤ ĐƯỢC PHÁT HIỆN TỪ ACCESS DB

### 1.1 Master Data (Dữ liệu chủ)

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `companies.csv` | 1,725 | CompanyID, CompanyShortName, CompanyName, OrderFolderPath, CadFolderPath | Tất cả công ty liên quan (KH, nhà gia công, nhà cung cấp) |
| `customers.csv` | 414 | CustomerID, CustomerShortName, CustomerRomajiName, CustomerKanaName, ContactPerson | Khách hàng trực tiếp |
| `traycustomer.csv` | 1,069 | TrayCustomerID, CustomerNo, Destination, Address, Client, PhoneNumber, FAX | **Danh bạ giao hàng** — 1,069 địa chỉ giao |
| `employees.csv` | 23 | EmployeeID, EmployeeName, DivisionID | Nhân viên |
| `machine.csv` | 14 | MachineID, MachineName, MachineType, MachineLocation | Máy móc |
| `destinations.csv` | 16 | DestinationID, DestinationName, DestinationType | Điểm đến (vận chuyển khuôn) |
| `machiningcustomer.csv` | 5 | MachiningCustomerID, MachiningCustomer, TEL, FAX | Nhà gia công ngoài |
| `responsibleperson.csv` | 13 | ResponsiblePersonID, ResponsiblePerson | Người phụ trách job |
| `itemtype.csv` | 11 | ItemTypeID, ItemType, ItemTypeName | Phân loại thiết bị (khuôn, dao, khung, v.v.) |
| `calendar.csv` | 730 | CalDate, IsWorkday, StandardHours, Note | **Lịch làm việc 2 năm** |

### 1.2 Sản phẩm & Thiết kế

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `tray.csv` | 4,068 | TrayID, TrayName, TrayCode, CustomerTrayName, CustomerDrawingNo, CustomerEquipmentNo, TrayWeight | **Sản phẩm khay** — trung tâm nghiệp vụ |
| `designmaster.csv` | 4,588 | DesignMasterID, DesignMasterCode, ActiveRevisionID, DesignMasterStatus | Master thiết kế (nhóm revision) |
| `molddesign.csv` | 4,721 | MoldDesignID, MoldDesignName, PocketNumbers, MoldOrientation, CutlineX/Y, CornerR, ChamferC, Plug, DraftAngle, UnderAngle | **Bản vẽ khuôn chi tiết** — 36 trường kỹ thuật |
| `molddesignlog.csv` | 0 | MoldLogID, ChangeDate, OldVersion, NewVersion | Log thay đổi thiết kế (trống!) |
| `cav.csv` | 57 | CAVID, CAV, Serial, CAVlength, CAVwidth | Cavity (khoang khuôn) |
| `case.csv` | 18 | IDCaseNo, TatamuSize, Chouhen, tanpen, fukasa | **Case kích thước** — bảng tra kích thước khay theo tatami size |
| `formedtray.csv` | 2 | FormedTrayID, FormingID, FormedTrayLength, Width, Height, ActualTrayWeight | Khay thành phẩm — gần như trống |

### 1.3 Khuôn & Dao cắt (Mold & Cutter)

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `molds.csv` | 4,741 | MoldID, MoldName, MoldCode, MoldUsageStatus, MoldOnCheckList, MoldReturning, MoldReturnedDate, MoldDisposing, MoldDisposedDate, DeviceStatus, KeeperCompany | **Khuôn vật lý** — đầy đủ lifecycle |
| `cutters.csv` | 1,724 | CutterID, CutterNo, CutterName, BladeCount, CutterType, PostCutLength/Width, UsageStatus | **Dao cắt** — 37 trường chi tiết |
| `cuttermaster.csv` | 1,691 | CutterMasterID, CutterMasterCode, DesignMasterID, Status | Master dao cắt |
| `cutterlog.csv` | 21 | CutterLogID, ProcessingType, OutsourcingDate, PostReceiptDate, CutterDesignLength/Width | Log gia công dao |
| `moldcutter.csv` | 2,730 | MoldCutterID, CutterID, MoldDesignID | **Mapping khuôn↔dao** |
| `moldlog.csv` | 28 | MoldLogID, OldDesignID, NewDesignID, ChangeDescription | Log thay đổi khuôn |
| `stakings.csv` | 2 | StakingID, StakingName, StakingType, MaySo | **Staking (khuôn đục lỗ)** — ít dùng |

### 1.4 Vị trí & Kệ chứa

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `racks.csv` | 90 | RackID, RackNumber, RackSymbol, RackLocation, RackCompanyLocation | Kệ chứa khuôn |
| `racklayers.csv` | 400 | RackLayerID, RackID, RackLayerNumber | Tầng kệ |
| `locationlog.csv` | 1,488 | LocationLogID, OldRackLayer, NewRackLayer, MoldID, CutterID, EmployeeID | **Log di chuyển vị trí** |
| `statuslogs.csv` | 373 | StatusLogID, MoldID, CutterID, Status, AuditDate, AuditType, SessionID, AuditSessionID | **Log kiểm kê & trạng thái** |

### 1.5 Sản xuất & Gia công

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `jobs.csv` | 1,167 | JobID, JobName, ProcessingItemID, DeliveryDeadline, PriceQuote, UnitPrice, FormingLocation, LoaiThungDong, BaoNilon, PocketTEST | **Job gia công** — bao gồm cả giá, đóng gói |
| `processingdeadline.csv` | 2,403 | ProcessingDeadlineID, JobID, ProcessingStatusID, ProcessingDeadline, EstimatedHours, Set, Tehai, DrawingReceiptDate | **Deadline gia công** — xương sống quản lý tiến độ |
| `processingcode.csv` | 44 | ProcessingCodeID, ProcessingName | Mã công đoạn (44 loại!) |
| `processingitems.csv` | 20 | ProcessingItemID, ProcessingItemName, ProcessingImage | Hạng mục gia công |
| `processingstatus.csv` | 13 | ProcessingStatusID, ProcessingStatus, TinhTrangGiaCong | Trạng thái gia công (13 trạng thái, song ngữ JP/VN) |
| `worklog.csv` | 6,979 | WorkLogID, ProcessingDeadlineID, EmployeeID, ProcessingCodeID, ProcessingTime, ProcessingDate, Finished, Noidunglienlac | **Nhật ký công việc** — song ngữ JP/VN |
| `productionplan.csv` | 2 | ProductionPlanID, OrderLineID, PlanCode, PlannedQuantity | Kế hoạch sản xuất (mới, gần trống) |
| `productionplanstep.csv` | 3 | PlanStepID, StepNo, StepType, MoldID, CutterID, MachineID | Bước sản xuất |
| `productionlog.csv` | 0 | ProductionLogID, LogType, ActualQty, GoodQty, NGQty | Log sản xuất (trống) |
| `productionresult.csv` | 0 | ProductionResultID, ActualQty, GoodQty, NGQty, ReworkQty, ScrapQty | Kết quả sản xuất (trống) |
| `forming.csv` | 4 | FormingID, MoldID, CutterID, MachineID, SpreadOnOff, SpreadValue | **Thông số định hình** — gần trống |
| `cnc_schedule.csv` | 0 | ScheduleID, JobID, MoldID, MachineID, EstimatedHours, MoldReadyDate, TargetTrayDate | Lịch CNC (trống) |
| `moldtaskplan.csv` | 8 | TaskID, MoldID, ProcessingCodeID, EstimatedHours, PlannedStart/End, IsOT_Applied, OTHours | Kế hoạch task khuôn (có OT!) |

### 1.6 Đặt hàng & Giao hàng

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `orderhead.csv` | 3 | OrderHeadID, OrderNo, CustomerID, OrderDate, RequestedDeliveryDate, CustomerPO | **Đơn hàng** (mới, rất ít dữ liệu) |
| `orderline.csv` | 2 | OrderLineID, OrderHeadID, TrayID, MoldDesignID, Quantity, DueDate | Chi tiết đơn hàng |
| `trayorder.csv` | 2 | TrayOrderID, TrayOrderDate, CustomerID, TrayOderQuantity, TrayDeliveryDate | Đơn đặt khay (cũ) |
| `shiplog.csv` | 349 | ShipID, CustomerID, ShipItemName, ShipDate, ToCompanyID, FromCompanyID, MoldID, CutterID, FrameID | **Log vận chuyển** — khuôn, dao, khung |

### 1.7 Nhựa & Vật tư

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `plasticforforming.csv` | 326 | PlasticMaterialID, PlasticColorID, PlasticThicknessID, PlasticWidthID, PlasticStaticChargeID, Silicone | **Nhựa cho định hình** — kết nối với job |
| `plasticmaterial.csv` | 5 | PlasticMaterialID, PlasticMaterial | Loại nhựa (PS, PET, PP, PVC, ABS) |
| `plasticcolor.csv` | 7 | PlasticColorID, PlasticColor | Màu nhựa |
| `plasticthickness.csv` | 25 | PlasticThicknessID, PlasticThickness | Độ dày (25 loại) |
| `plasticwidth.csv` | 26 | PlasticWidthID, PlasticWidth | Chiều rộng cuộn |
| `plasticlength.csv` | 24 | PlasticLengthID, PlasticLengthPerPack | Chiều dài cuộn |
| `plasticstaticcharge.csv` | 22 | PlasticStaticChargeID, PlasticStaticCharge | Tính chất chống tĩnh điện |
| `plasticcompany.csv` | 23 | PlasticCompanyID, PlasticCompany | Nhà sản xuất nhựa |
| `plasticgroup.csv` | 17 | PlasticGroupID, PlasticGroup | Nhóm nhựa |
| `vattutbl.csv` | 694 | MSVatTu, TenVatTu, DoDayVL, ChieuRongVL, ChieuDaiVL, HangSXVatTu | **Bảng vật tư (tiếng Việt)** — 694 mã |
| `vattusdtbl.csv` | 64 | IDVatTuSD, MSVatTu, WorkLogID, SoLuongVTSD | Vật tư sử dụng |
| `dathangvttbl.csv` | 1,321 | IDMaDHVT, MSVatTu, JobID, DonGiaDH, NgayNhanVT, SoLuongDH, GiaThanhDH | **Đặt hàng vật tư** — 1,321 giao dịch |

### 1.8 Teflon & Bảo trì

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `teflonlog.csv` | 4,680 | TeflonLogID, MoldID, TeflonStatus, RequestedBy, SentDate, ReceivedDate, SupplierID, CoatingType, TeflonCost, Quality | **Teflon coating** — workflow hoàn chỉnh 4,680 lần |
| `scraplog.csv` | 0 | ScraptID, ItemID, IsMold, ScraptMethod, ScraptCompany, Cost | Log phế liệu/hủy bỏ (trống) |

### 1.9 Mượn khuôn & Tài sản cố định

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `moldborrow.csv` | 209 | MoldBorrowID, AssetCode, AssetMoldType, AssetName, BorrowYear, CertificateDate, DrawingNo, EquipmentNo, MoldPrice, MoldLifespan, VendorCode, VendorName | **Giấy mượn khuôn (借用書)** — 209 bản ghi, bao gồm giá, tuổi thọ, mã tài sản |

### 1.10 Chất lượng

| Bảng Access | Số dòng | Fields chính | Vai trò nghiệp vụ |
|:---|:---:|:---|:---|
| `defect.csv` | 4 | DefectID, JobID, DefectNumbers, DefectDate, DefectDetails, NguyenNhan, DoiSach, Anhfuguai1 | **Báo cáo lỗi (不具合)** — bao gồm nguyên nhân, đối sách, ảnh |

---

## 🆕 PHẦN 2: DỮ LIỆU CHỈ CÓ TRONG WEB APP (Không có trong Access)

Hệ thống Web mới bổ sung các bảng quản lý nhựa chi tiết hơn:

| Bảng Web | Số dòng | Mục đích | Trạng thái |
|:---|:---:|:---|:---|
| `plastic_master.csv` | 654 | Master nhựa normalized (family, subtype, additive_flags) | ✅ Có dữ liệu |
| `plastic_receipt.csv` | 1 | Phiếu nhập nhựa | 🟡 Mới bắt đầu |
| `plastic_receipt_roll.csv` | 410 | Cuộn nhựa nhập kho (lot_no, warehouse_location, roll_status) | ✅ Có dữ liệu |
| `plastic_inventory_snapshot.csv` | 1,211 | Snapshot kiểm kê nhựa | ✅ Có dữ liệu |
| `plastic_manufacturer_map.csv` | 6 | Mapping mã thương mại → mã nội bộ | 🟡 Ít |
| `plastic_adjustment_log.csv` | 0 | Log điều chỉnh tồn kho | ⬜ Trống |
| `plastic_inventory_count_line.csv` | 0 | Chi tiết kiểm kê | ⬜ Trống |
| `plastic_manufacturer_grade.csv` | 0 | Grade nhà sản xuất | ⬜ Trống |
| `plastic_pricing.csv` | 0 | Bảng giá nhựa | ⬜ Trống |
| `plastic_supplier.csv` | 0 | Nhà cung cấp nhựa | ⬜ Trống |
| `plastic_usage_plan.csv` | 0 | Kế hoạch sử dụng nhựa | ⬜ Trống |
| `plastic_usage_actual.csv` | 0 | Thực tế sử dụng nhựa | ⬜ Trống |
| `plastic_usage_plan_roll.csv` | 0 | Phân bổ cuộn cho kế hoạch | ⬜ Trống |
| `datachangehistory.csv` | 209 | **Lịch sử thay đổi dữ liệu** (có xử lý conflict!) | ✅ Có dữ liệu |
| `accesscommithistory.csv` | 0 | Lịch sử sync Access→Web | ⬜ Trống |
| `usercomments.csv` | 19 | Comment của user trên item | ✅ Có dữ liệu |

---

## 📋 PHẦN 3: DỮ LIỆU TỪ CÁC THƯ MỤC ĐẶC BIỆT

### 3.1 生産指示書 (Chỉ thị sản xuất)

**Cấu trúc:** 3 file Excel cơ sở + 5 thư mục khách hàng

| File/Thư mục | Nội dung |
|:---|:---|
| `A. 納入先一覧表.xlsx` | **Danh sách địa chỉ giao hàng** — file chủ |
| `B. トレイデータ一覧表.xlsx` | **Dữ liệu khay** — file chủ (831KB) |
| `C. 指示書作成シート(成形）.xlsx` | **Template tạo chỉ thị sản xuất** (1.1MB) — kết nối với tồn kho nhựa |
| `新HAE/`, `新NLC/`, `新SMK/`, `新YAE/`, `新一般/` | Chỉ thị sản xuất theo khách hàng |

> **⚠️ PHÁT HIỆN QUAN TRỌNG:** File `C. 指示書作成シート(成形）.xlsx` kết nối trực tiếp với file tồn kho nhựa (`材料在庫`) — đây là quy trình Excel liên kết chéo file hiện tại.

### 3.2 材料在庫 (Tồn kho nhựa)

**482 file Excel** — cập nhật **HÀNG NGÀY** từ 2024-03 đến 2026-07!

- Tên file: `材料在庫(YY-M-D)指示書連動.xlsx`
- **"指示書連動"** = Liên kết với chỉ thị sản xuất
- Đây là quy trình **thủ công hàng ngày**: nhân viên copy file, cập nhật tồn kho, liên kết với chỉ thị sản xuất

> **📍 GAP NGHIÊM TRỌNG:** 482 file thủ công = ~2 năm tracking tồn kho nhựa bằng Excel. Hệ thống mới cần thay thế hoàn toàn bằng `plastic_receipt_roll` + `plastic_usage_actual`.

### 3.3 材料在庫表(青森工場) — Nhà máy Aomori (Phía Bắc)

**348 file Excel** trong thư mục `廃棄/` (tên thư mục "phế thải" nhưng thực chất là kho Aomori)

- Tên file: `材料在庫表(青森工場)YYYY.M.D.xlsx`
- **Nhà máy Aomori** quản lý nhựa riêng, cập nhật hàng ngày
- Cần hệ thống **multi-site** để quản lý cả Saitama + Aomori

### 3.4 金型保管料 (Phí bảo quản khuôn)

| File | Nội dung |
|:---|:---|
| `フジクラ 金型保管料.xlsx` | Bảng tính phí bảo quản khuôn cho Fujikura |
| `フジクラ 金型保管料 請求書.pdf` | Hóa đơn phí bảo quản |
| `フジクラ 金型保管料 納品書.pdf` | Phiếu giao phí bảo quản 2023-2024 |
| Email `.msg` | Email trao đổi về tính phí bảo quản |

> **📍 NGHIỆP VỤ ĐẶC BIỆT:** YSD tính phí bảo quản khuôn cho khách hàng không sử dụng (non-active). Đây là nghiệp vụ tài chính cần module riêng.

### 3.5 見積書 (Báo giá)

**33 file** — hỗn hợp `.doc`, `.docx`, `.pdf`, `.xlsx`

**Phát hiện từ tên file:**
- **Khách hàng đa dạng:** ~20 khách hàng khác nhau (MARUWA, ミズサワセミコンダクタ, マックエイト, Rapidus, v.v.)
- **Loại báo giá:**
  - `規格トレイ` (Standard tray) — phổ biến nhất
  - `新規トレイ` (New tray) — khuôn mới
  - `ロット追加` (Lot addition) — thêm lot sản xuất
  - `価格改定` (Price revision) — cập nhật giá
  - `クラムシェルブリスタ` (Clamshell blister) — sản phẩm đặc biệt
- **固定資産借用書** (Giấy mượn tài sản cố định) — 3 file liên quan đến khuôn cho Rapidus/wafer

### 3.6 納品書_注文 (Phiếu giao hàng & Đơn đặt hàng)

**7 thư mục khách hàng:**

| Thư mục | Nội dung | Phát hiện |
|:---|:---|:---|
| `IRI/` | 8 file: PO, 見積書, 納品書, 金型手配依頼書, 図面 | Quy trình đầy đủ: RFQ→Quotation→PO→Delivery |
| `JAE-365/` | Khách hàng JAE | |
| `KYD/` | Khách hàng KYD | |
| `MCT/` | Khách hàng MCT | |
| `NLC 金型廃棄＆保管リスト/` | **Danh sách hủy & bảo quản khuôn NLC** — 4 file bao gồm hóa đơn, request, danh sách | Quy trình hủy khuôn có hợp đồng |
| `SJI/` | Khách hàng SJI | |
| `SMK/` | Khách hàng SMK | |

### 3.7 SMK-230 (Case Study hoàn chỉnh)

**36 file** bao gồm toàn bộ lifecycle:
1. Email trao đổi ban đầu (`.msg` — 14+ email)
2. Yêu cầu thay đổi từ khách (`トレイ_SMK-225の変更のお願い.pdf`)
3. Báo giá (`御見積書.pdf`)
4. Đơn đặt hàng (`注文書.pdf`)
5. Dữ liệu kỹ thuật (`.xlsx` — 2 phiên bản)
6. Hình ảnh (`SMK-230 20260615.jpg`)
7. Giấy ký gửi khuôn (`金型預かり証.pdf`)
8. Bản ghi email extracted (`extracted_content.md` — 6MB!)

### 3.8 Form liên quan (Form lien quan)

**56 file** — Kho template nghiệp vụ thực tế:

| Nhóm | File tiêu biểu | Mục đích |
|:---|:---|:---|
| **Nhật ký** | `F プレス＆検査部門日報記録書.xls` | Nhật ký Press & QC hàng ngày |
| | `F 設計&金型部門日報記録書.xls` | Nhật ký thiết kế & khuôn |
| | `プレス日報兼不適合製品記録書.xls` | Nhật ký Press + ghi nhận lỗi |
| | `検査作業日報兼日常点検(KSE専用).xls` | Nhật ký QC + kiểm tra hàng ngày |
| **Kiểm tra** | `F 機械点検報告書（金型）Hang ngay.xlsx` | Báo cáo kiểm tra máy hàng ngày |
| | `F 機械点検報告書（金型）bao cao cuoi nam.xls` | Báo cáo kiểm tra cuối năm |
| **Báo giá** | `見積り原紙.doc/docx` (5 phiên bản!) | Template báo giá gốc |
| | `見積り計算式.xls/xlsm` | Công thức tính giá |
| | `見積原価計算書フォーマットver6.xls/xlsx` | Template tính giá thành ver6 |
| | `汎用トレイ見積りフォーマット.doc` | Template báo giá khay tiêu chuẩn |
| | `金型見積もり基準.xls` | Tiêu chuẩn báo giá khuôn |
| | `ysd見積原紙.xls` | Template gốc YSD |
| **Tài sản** | `治具金型借用書_OL-HE.xlsx` | Giấy mượn khuôn (format khách hàng) |
| | `KDS - 金型確認20240614.xlsx` | Xác nhận khuôn KDS |
| **Giá** | `価格改定計算用2024.1.1.xlsx` | **Tính toán cải giá 2024** |
| | `★2026.5 価格改定案内 送付状況.xlsx` | Theo dõi gửi thông báo cải giá 2026 |
| **Vật tư** | `DSvattu.xlsx` | Danh sách vật tư (tiếng Việt) |
| | `機械加工部門.xlsx` (494MB!) | Dữ liệu bộ phận gia công (file cực lớn) |

### 3.9 ISO Documents (ISO 2026見直し済み)

**25 file + 13 thư mục** — Hệ thống quản lý ISO 9001 + 14001:

| Nhóm | File | Mục đích |
|:---|:---|:---|
| **Tổ chức** | `組織図/`, `職務分掌表2025.4.doc`, `責任分担表2025.4.doc` | Sơ đồ tổ chức, phân công |
| **Lịch & KH** | `ISO年間スケジュールカレンダー2025/2026.xls` | Lịch ISO hàng năm |
| **Đào tạo** | `年度教育訓練計画書/` | Kế hoạch đào tạo |
| **Nhà cung cấp** | `供給者一覧2025/2026.xls`, `購買製品区分別分類表兼供給者評価表.xls` | Đánh giá nhà cung cấp |
| **Chất lượng** | `品質方針.docx`, `品質環境方針.doc` | Chính sách chất lượng |
| **Thiết kế** | `設計・開発フローチャート.xls` | **Flowchart thiết kế & phát triển** |
| **Thiết bị** | `設備一覧表.doc` | Danh sách thiết bị |
| **Tài liệu** | `文書体系表2015版.xls`, `文書チェックリスト.xls`, `文書・記録管理リスト.xls` | Quản lý tài liệu ISO |
| **Kiểm toán** | `内部監査員認定者リスト2025.4.doc` | Kiểm toán viên nội bộ |
| **Khuôn** | `金型台帳060926.xls` (764KB) | **Sổ cái khuôn** — từ 2006! |
| **NG** | `NG品 保管場所 掲示用.xlsx` | Quy định lưu trữ sản phẩm NG |
| **Môi trường** | `YSD環境規定/`, `順守評価確認表/` | Quy định môi trường ISO 14001 |
| **Doanh thu** | `売上推移表/` | **Báo cáo xu hướng doanh thu** |
| **Nhân sự** | `従業員名簿2026.1.xls` | Danh sách nhân viên |

### 3.10 Machines Data

| Thư mục | Nội dung |
|:---|:---|
| `seikei/` | Manual máy ILLIG RV74d (PDF, 3MB) |
| `others/` | **25 thư mục + 12 file** — lịch sử mua/sửa máy từ 2013 đến nay |
| `machines_6789_config.csv` | 4 máy: MachineID, Maker, Model, MaxFormingLength, MaxCyclesPerMin, TotalPower |

**Máy quan trọng trong dữ liệu:**
- ILLIG RV-74c / RV-74d (Đức)
- SHANSHIN (Đài Loan)
- Asano (Nhật)
- Máy Press (nhập khẩu)
- Máy CNC (Brother MC)

### 3.11 Planning Data

**9 file Excel** trong `planning/`:

| File | Nội dung |
|:---|:---|
| `YSD-planning-4-21.xlsx` (5.2MB) | **Master planning file** — file chính lập kế hoạch |
| `YSDトレー受注一覧（改2）4-21.xlsx` | Danh sách đơn hàng khay |
| `YSDトレー受注一覧前受け表(受注専用).xlsx` | **Bảng tiền thu trước** đơn hàng |
| `RP在庫2026.4.10/17.xlsx` | Tồn kho Rapidus |
| `stock_list(2026.3末).xlsx` | Tồn kho cuối tháng 3/2026 |
| `成形＆金型＆紙器部門収支.xls` (3.4MB) | **Thu chi 3 bộ phận**: Thành hình, Khuôn, Giấy |
| `材料在庫棚4-21.xlsx` | Tồn kho nhựa trên kệ |
| `材料在庫表(青森工場)2026.4.21.xlsx` | Tồn kho Aomori |

### 3.12 MoldCutterSearch Reference (Hệ thống cũ)

**111 file JavaScript + CSS** — Toàn bộ source code hệ thống SACT/MoldCutterSearch cũ:

**Module đã xây dựng trong hệ thống cũ:**
- `search-module.js` — Tìm kiếm khuôn/dao
- `detail-panel.js` (354KB!) — Panel chi tiết rất phức tạp
- `photo-manager.js` / `photo-upload.js` — Quản lý ảnh
- `location-manager.js` — Quản lý vị trí
- `teflon-processing.js` — Quy trình Teflon
- `inventory-audit-module.js` — Kiểm kê
- `checkin-checkout.js` — Check-in/Check-out khuôn
- `scrap-wizard-module.js` — Wizard phế liệu
- `qr-scanner.js` / `qr-export.js` — QR Code
- `ar-locator-module.js` — AR định vị!
- `virtual-keyboard-module.js` — Bàn phím ảo (tablet)
- `filter-ui.js` (123KB) — UI lọc phức tạp
- `device-history-status.js` — Lịch sử thiết bị
- `global-teflon-module.js` — Teflon global
- `global-history-module.js` — Lịch sử global
- `quick-update-module.js` — Cập nhật nhanh
- `relocate-wizard-module.js` — Wizard di chuyển
- `transfer-location-module.js` — Chuyển vị trí
- `generate-master-ui.js` — Tạo master
- `generate-receipt-ui.js` — Tạo phiếu nhận

---

## 🔍 PHẦN 4: PHÂN TÍCH GAP — Access vs Web vs NextGen

### 4.1 Bảng có trong Access nhưng THIẾU trong Web

| Bảng Access | Dòng | Tầm quan trọng | Có trong NextGen? |
|:---|:---:|:---:|:---|
| `calendar.csv` | 730 | 🔴 Cao | ❌ Chưa |
| `moldborrow.csv` | 209 | 🔴 Cao | ⬜ Planned (cases?type=loan) |
| `dathangvttbl.csv` | 1,321 | 🔴 Cao | ❌ Chưa — Đặt hàng vật tư |
| `vattutbl.csv` | 694 | 🟡 TB | ❌ Chưa — Master vật tư |
| `vattusdtbl.csv` | 64 | 🟡 TB | ❌ Chưa — Vật tư sử dụng |
| `defect.csv` | 4 | 🟡 TB | ❌ Chưa — Báo cáo lỗi |
| `traycustomer.csv` | 1,069 | 🔴 Cao | ❌ Chưa — Địa chỉ giao hàng |
| `cuttermaster.csv` | 1,691 | 🟡 TB | ❌ Chưa |
| `cutterlog.csv` | 21 | 🟢 Thấp | ❌ Chưa |
| `designmaster.csv` | 4,588 | 🔴 Cao | ✅ design_masters (trong Supabase) |
| `processingcode.csv` | 44 | 🟡 TB | ❌ Chưa — 44 loại công đoạn |
| `employee_old.csv` | 7 | 🟢 Thấp | N/A |
| `formedtray.csv` | 2 | 🟢 Thấp | ❌ Chưa |
| `forming.csv` | 4 | 🟡 TB | ❌ Chưa |
| `productionplan.csv` | 2 | 🔴 Cao | ⬜ Planned |
| `cnc_schedule.csv` | 0 | 🟡 TB | ❌ Chưa |
| `moldtaskplan.csv` | 8 | 🟡 TB | ❌ Chưa |
| `stakings.csv` | 2 | 🟢 Thấp | ❌ Chưa |

### 4.2 Quy trình Excel cần số hóa

| Quy trình hiện tại | Tần suất | Độ phức tạp | Priority |
|:---|:---|:---|:---|
| 材料在庫 (Tồn kho nhựa) — 482 file | **Hàng ngày** | 🔴 Cao | P0 |
| 材料在庫表 青森工場 — 348 file | **Hàng ngày** | 🔴 Cao | P0 |
| 指示書作成シート (Chỉ thị SX) | Theo đơn hàng | 🔴 Cao | P0 |
| 見積り計算式 (Tính giá báo giá) | Theo yêu cầu KH | 🟡 TB | P1 |
| 価格改定 (Cải giá) | Hàng năm | 🟡 TB | P1 |
| 金型保管料 (Phí bảo quản khuôn) | Hàng năm | 🟡 TB | P1 |
| 部門日報 (Nhật ký bộ phận) | Hàng ngày | 🔴 Cao | P1 |
| 機械点検報告書 (Báo cáo kiểm tra máy) | Hàng ngày/năm | 🟡 TB | P2 |
| 借用書 (Giấy mượn khuôn) | Theo sự kiện | 🟡 TB | P1 |

---

## 🔄 PHẦN 5: LUỒNG NGHIỆP VỤ THỰC TẾ TỪ EMAIL

### 5.1 Luồng IRI (Iriso Denshi) — Sản phẩm mới

```
KH gửi 金型手配依頼書 (Yêu cầu gia công khuôn)
    ↓ Kobayashi (KD) nhận, forward cho Quan (KS)
    ↓ Quan yêu cầu 3D STEP data từ KH
    ↓ Quan thiết kế → Gửi bản vẽ YSD (IRI-003)
    ↓ KH duyệt → Kobayashi yêu cầu thiết kế plug + dao
    ↓ Nakamura (QC) tạo 検査表 (bảng kiểm tra)
    ↓ Arai (Sản xuất) nhận 生産指示 (chỉ thị SX)
        → Chỉ thị bao gồm: Ngày giao, Vật liệu, Số lượng, Máy, Địa chỉ giao
    ↓ Sản xuất → Giao hàng
```

**Edge cases phát hiện:**
- **Ưu tiên đơn hàng:** KH yêu cầu ưu tiên đơn này trước đơn khác của chính họ
- **Bottleneck thành hình:** Khuôn xong nhưng máy thành hình bận → delay
- **入検用サンプル:** Ngoài sample thông thường, cần thêm sample cho incoming inspection
- **事務所用:** Cần thêm mẫu cho văn phòng (2 tấm)

### 5.2 Luồng CHG (Chugen/JX Kim loại) — Sản phẩm phức tạp

```
KH (Chugen) yêu cầu báo giá cho 2 sản phẩm (040, 060) × 2 loại (A, B) = 4 khuôn
    ↓ Trước khi làm khuôn chính thức, cần ポケット試作 (thử nghiệm pocket)
    ↓ Đàm phán: Chi phí thử nghiệm ai trả? → YSD miễn phí
    ↓ Đàm phán: A/B giao xen kẽ = +5 yen/tấm phí thao tác
    ↓ Vật liệu đặc biệt: PET黒0.7㎜導電印刷 → 1 tháng lead time
    ↓ Thay thế bằng PET緑0.7㎜ (có sẵn) cho thử nghiệm
    ↓ Yêu cầu báo giá 3 mức: 20/50/100 tấm mỗi loại
```

**Edge cases phát hiện:**
- **導電印刷 (conductive printing):** Nhựa đặc biệt, lead time dài
- **Giao xen kẽ A/B (交互積層):** Yêu cầu xếp luân phiên A-B-A-B → phí thêm
- **Đàm phán giá khuôn vs giá thử nghiệm:** Giá khuôn đã giảm → cân nhắc miễn phí thử
- **Đóng gói:** Số lượng/thùng (200 vs 240), loại pallet (nhựa vs gỗ)
- **Giới hạn vận chuyển:** Max 5 pallet/ngày, trên 5 cần charter → phí cao

### 5.3 Luồng SMK-230 (Case Study đầy đủ nhất)

```
SMK yêu cầu thay đổi SMK-225 → SMK-230 (form change, not new design)
    ↓ 14+ email trao đổi kỹ thuật
    ↓ Báo giá ban đầu (26-05-02)
    ↓ Báo giá chính thức (26-06-12): Word + PDF
    ↓ Đơn hàng (注文書.pdf)
    ↓ Dữ liệu kỹ thuật (2 phiên bản Excel: 20260529, 20260615)
    ↓ Chụp ảnh khuôn xong (SMK-230 20260615.jpg)
    ↓ 金型預かり証 (Giấy ký gửi khuôn) — KH ký nhận khuôn
    ↓ 金型写真看板 (Bảng ảnh khuôn) — dán tại kệ lưu trữ
```

---

## 📊 PHẦN 6: TỔNG HỢP NGHIỆP VỤ PHÁT HIỆN

### 6.1 Danh sách đầy đủ các quy trình nghiệp vụ

| # | Quy trình | Nguồn phát hiện | Trạng thái trong NextGen |
|:---|:---|:---|:---|
| 1 | **Quản lý khách hàng & địa chỉ giao** | companies, customers, traycustomer | 🟡 Có companies, thiếu delivery_sites |
| 2 | **Tiếp nhận yêu cầu từ KH** (金型手配依頼) | IRI_order.md, SMK-230 | ⬜ Chưa — cần Cases module |
| 3 | **Thiết kế khay** (トレイ設計) | molddesign, designmaster | 🟡 Có design_revisions |
| 4 | **Phê duyệt bản vẽ** (図面承認) | IRI email | ⬜ Chưa — workflow approval |
| 5 | **Báo giá** (見積書) | 33 file 見積書, templates | ⬜ Chưa — quotation module |
| 6 | **Đơn hàng** (受注) | orderhead, SMK-230注文書 | 🟡 Có orders table |
| 7 | **Chỉ thị sản xuất** (生産指示書) | 生産指示書 folder, Excel templates | ⬜ Chưa |
| 8 | **Kế hoạch sản xuất** (生産計画) | productionplan, planning folder | ⬜ Chưa |
| 9 | **Gia công khuôn** (金型加工) | jobs, processingdeadline, worklog | 🟡 Có jobs trong SACT |
| 10 | **Gia công ngoài** (外注加工) | machiningcustomer, jobs.NoiGCkhuon | 🟡 Partial |
| 11 | **Quản lý tiến độ** (進捗管理) | processingdeadline, processingstatus | ⬜ Chưa rõ |
| 12 | **Nhật ký công việc** (日報/作業日誌) | worklog (6,979 dòng) | ✅ Có worklog trong SACT |
| 13 | **Quản lý khuôn vật lý** (金型管理) | molds, locationlog, statuslogs | ✅ Có physical_molds |
| 14 | **Quản lý dao cắt** (抜型管理) | cutters, cuttermaster, cutterlog | ✅ Có cutters |
| 15 | **Mapping khuôn↔dao** | moldcutter (2,730 mapping) | ✅ Có moldcutter |
| 16 | **Teflon coating** | teflonlog (4,680 lần) | ✅ Có trong SACT |
| 17 | **Di chuyển vị trí** (移動管理) | locationlog (1,488) | ✅ Có trong SACT |
| 18 | **Kiểm kê** (棚卸) | statuslogs, inventory-audit | ✅ Có SACT audit |
| 19 | **Vận chuyển khuôn** (出荷/入荷) | shiplog (349) | 🟡 Partial |
| 20 | **Mượn khuôn** (金型借用) | moldborrow (209) | ⬜ Chưa |
| 21 | **Giấy mượn tài sản** (固定資産借用書) | 見積書 folder | ⬜ Chưa |
| 22 | **Phế liệu/Hủy khuôn** (廃棄) | scraplog, NLC folder | ⬜ Chưa (scrap wizard có trong SACT cũ) |
| 23 | **Phí bảo quản khuôn** (金型保管料) | 金型保管料 folder | ⬜ Chưa |
| 24 | **Quản lý nhựa** (材料管理) | plasticforforming + 10 bảng Access cũ | 🟡 Có plastic_master + receipt_roll |
| 25 | **Tồn kho nhựa hàng ngày** | 482 file Excel! | ⬜ Chưa — GAP nghiêm trọng |
| 26 | **Tồn kho nhựa Aomori** | 348 file Excel! | ⬜ Chưa — multi-site |
| 27 | **Đặt hàng vật tư** (発注) | dathangvttbl (1,321) | ⬜ Chưa |
| 28 | **Giao hàng** (納品) | 納品書, trayorder | ⬜ Planned |
| 29 | **Cải giá** (価格改定) | 価格改定計算用.xlsx, ★2026.5 | ⬜ Chưa |
| 30 | **Báo cáo lỗi** (不具合報告) | defect.csv | ⬜ Chưa |
| 31 | **Kiểm tra máy** (機械点検) | Form templates | ⬜ Chưa |
| 32 | **Đào tạo nhân viên** (教育訓練) | ISO folder | ⬜ Chưa |
| 33 | **Đánh giá nhà cung cấp** (供給者評価) | ISO folder | ⬜ Chưa |
| 34 | **Lịch làm việc** (カレンダー) | calendar.csv (730 ngày) | ⬜ Chưa |
| 35 | **Thu chi bộ phận** (部門収支) | 成形&金型&紙器部門収支.xls | ⬜ Chưa |
| 36 | **QR Code** | SACT modules | ✅ Có trong SACT |
| 37 | **Quản lý ảnh thiết bị** | SACT photo modules | ✅ Có trong SACT |
| 38 | **Check-in/Check-out** | SACT checkin-checkout | ✅ Có trong SACT |
| 39 | **Sổ cái khuôn** (金型台帳) | ISO/金型台帳060926.xls | Legacy (từ 2006) |
| 40 | **Comment/Ghi chú người dùng** | usercomments.csv (19) | 🟡 Có trong web |
| 41 | **Lịch sử thay đổi dữ liệu** | datachangehistory (209) | ✅ Có trong web |

### 6.2 Phân tích theo mức độ ưu tiên

#### 🔴 P0 — Thiếu nghiêm trọng, ảnh hưởng vận hành hàng ngày
1. **Tồn kho nhựa real-time** — 830 file Excel thủ công (cả 2 site)
2. **Chỉ thị sản xuất** — đang dùng Excel template liên kết chéo file
3. **Kế hoạch sản xuất** — master planning file 5.2MB
4. **Báo giá** — 33+ file, nhiều template khác nhau

#### 🟡 P1 — Quan trọng, cần để hoàn thiện vòng đời sản phẩm  
5. **Mượn khuôn (借用書)** — 209 bản ghi, có format khách hàng riêng
6. **Đặt hàng vật tư** — 1,321 giao dịch trong Access
7. **Giao hàng (納品書)** — tích hợp với đơn hàng
8. **Phí bảo quản khuôn** — nghiệp vụ tài chính đặc thù
9. **Cải giá** — quy trình hàng năm
10. **Nhật ký bộ phận** — 4+ loại form khác nhau

#### 🟢 P2 — Cải tiến, tối ưu hóa
11. **Báo cáo lỗi (不具合)** — chỉ 4 bản ghi nhưng quan trọng cho ISO
12. **Kiểm tra máy hàng ngày/cuối năm**
13. **Đánh giá nhà cung cấp** — yêu cầu ISO
14. **Lịch làm việc** — tính toán deadline, capacity
15. **Thu chi bộ phận** — báo cáo quản lý

---

## 🎯 PHẦN 7: PHÁT HIỆN ĐẶC BIỆT & EDGE CASES

### 7.1 Multi-site Operation
- **Saitama** (chính) + **Aomori** (北) — tồn kho nhựa riêng
- Cần hỗ trợ `warehouse_area` / `warehouse_location` trong plastic management

### 7.2 Bilingual System (Song ngữ JP/VN)
- `processingstatus`: cả `ProcessingStatus` (JP) và `TinhTrangGiaCong` (VN)
- `worklog`: `Noidunglienlac` (tiếng Việt trong bảng Access!)
- `dathangvttbl`, `vattusdtbl`, `vattutbl`: Tên cột tiếng Việt
- Form templates: Nhiều file có phiên bản "ベトナム語含む" (bao gồm tiếng Việt)

### 7.3 Legacy Data Richness
- **Access DB** có 62 bảng, Web chỉ có 42 → thiếu 20 bảng
- `jobs.csv` là bảng phức tạp nhất: 37 trường, kết hợp gia công, giá, đóng gói, tolerance
- `traycustomer.csv` (1,069 địa chỉ) hoàn toàn bị bỏ quên trong Web

### 7.4 Quy trình đặc thù ngành
- **Teflon coating:** Workflow 7 bước (Request→Approve→Send→Receive), 4,680 lần
- **Pocket test (ポケット試作):** Thử nghiệm trước khi sản xuất khuôn chính thức
- **導電印刷 (conductive printing):** Nhựa đặc biệt, lead time 1 tháng
- **交互積層 (alternating stacking):** Xếp A-B-A-B, phí thao tác +5 yen/tấm
- **金型預かり証 (Giấy ký gửi khuôn):** Bản ghi chính thức khuôn thuộc sở hữu KH
- **入検用サンプル:** Sample cho incoming inspection riêng biệt với sample thông thường
- **Tatami size (畳サイズ):** Bảng tra kích thước khay theo đơn vị tatami

### 7.5 Data Conflict Management
- `datachangehistory.csv` có các trường: `IsConflict`, `ResolvedValue`, `ResolvedAt`, `ResolvedBy`
- Hệ thống Web đã thiết kế conflict resolution cho sync Access↔Web

### 7.6 File kích thước bất thường
- `機械加工部門.xlsx` — **494MB!** — Chứa gì mà lớn thế?
- `extracted_content.md` — **6MB** — Toàn bộ nội dung email SMK-230

---

## 📝 KẾT LUẬN

### Hệ thống YSDMS-NextGen cần quản lý:

1. **~4,700 khuôn** + **~1,700 dao cắt** + **~4,100 sản phẩm khay**
2. **~4,600 bản thiết kế** với revision management
3. **~1,700 công ty** + **~400 khách hàng** + **1,069 địa chỉ giao**
4. **~7,000 bản ghi nhật ký** + **2,400 deadline gia công**
5. **~4,700 lần Teflon** + **~1,500 log di chuyển**
6. **~1,300 đặt hàng vật tư** + **700 mã vật tư**
7. **~200 giấy mượn khuôn**
8. **482 + 348 = 830 file Excel tồn kho** cần thay thế
9. **33+ file báo giá** cần template hóa
10. **Hệ thống ISO 9001 + 14001** cần tích hợp

> **Ưu tiên tối cao:** Số hóa quy trình tồn kho nhựa hàng ngày (830 file Excel) và chỉ thị sản xuất liên kết chéo file.
