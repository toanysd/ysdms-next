# 📚 DANH MỤC TOÀN DIỆN QUY TRÌNH NGHIỆP VỤ — YOSHIDA PACKAGE
## YSDMS NextGen Business Process Catalog v1.0

**Ngày tổng hợp:** 2026-07-15  
**Phương pháp:** Deep scan toàn bộ `source_data/` (830+ file Excel, 62+ CSV Access, 33 báo giá, 7 thư mục KH, ISO docs)  
**Đội ngũ:** 3 AI Scanner agents + AN tổng hợp

---

## 📊 TỔNG QUAN PHÁT HIỆN

| Chỉ số | Giá trị |
|---|---|
| Tổng quy trình nghiệp vụ xác định | **50+** |
| Tổng loại tài liệu nghiệp vụ | **23** |
| Bảng Access DB (legacy) | **62** |
| Bảng Web App (hiện tại) | **42** |
| Bảng thiếu trong Web | **20+** |
| File Excel thủ công hàng ngày | **830** (482 Saitama + 348 Aomori) |
| Nhà máy hoạt động | **4** (本社, 青森, 茨城, 坂田) |
| Khách hàng có yêu cầu đặc biệt | **7** (SMK, JAE, KYD, MCT, IRI, SJI, NLC) |

---

## 🏭 PHẦN 1: QUY TRÌNH KINH DOANH (Sales & Commercial)

### 1.1 Tiếp nhận & Tư vấn (案件受付)

| # | Quy trình | Mô tả | Tần suất | Trạng thái NextGen |
|---|---|---|---|---|
| BP-01 | **Tiếp nhận yêu cầu KH** | KH gửi 金型手配依頼書 (yêu cầu gia công khuôn) hoặc email | Hàng tuần | ✅ Cases module |
| BP-02 | **Tư vấn sản phẩm** | Trao đổi kỹ thuật, đề xuất vật liệu/kích thước | Theo yêu cầu | ⬜ Chưa |
| BP-03 | **Thiết kế layout** | Thiết kế bản vẽ → gửi KH duyệt → sửa → duyệt lại (3+ lần) | Theo yêu cầu | 🟡 design_revisions |

> [!IMPORTANT]
> **PHÁT HIỆN:** Quá trình tư vấn-thiết kế có thể kéo dài **6+ tháng** (VD: SMK-225→230 từ 10/2025→06/2026) với 14+ vòng email. Hệ thống cần tracking conversation thread.

### 1.2 Báo giá (見積)

| # | Quy trình | Mô tả | Edge Cases | Trạng thái |
|---|---|---|---|---|
| BP-04 | **Báo giá khay tiêu chuẩn** | Dùng template `見積り原紙`, giá tính theo công thức chuẩn | Nhiều mức giá theo lot (20/50/100 tấm) | ✅ quotations |
| BP-05 | **Báo giá khay mới (khuôn mới)** | Gồm: phí thiết kế + phí khuôn + phí sample + phí khay | Phí thử nghiệm pocket có thể miễn phí | ✅ quotation_lines |
| BP-06 | **Báo giá lot bổ sung** | KH đặt thêm lot cho sản phẩm đã có | Giá có thể khác lot đầu | 🟡 Partial |
| BP-07 | **Cải giá (価格改定)** | Điều chỉnh giá hàng năm theo chi phí nguyên liệu | File theo dõi tình trạng gửi thông báo cho từng KH | ⬜ Chưa |
| BP-08 | **Tính giá thành (原価計算)** | 6 phiên bản template (ver6 là mới nhất) | File `見積り計算式.xlsm` có VBA macro | ⬜ Chưa |

> [!WARNING]
> **6 phiên bản template báo giá** đang tồn tại song song (`.doc`, `.docx`, `.xls`, `.xlsx`, `.xlsm`, `.pdf`). Cần chuẩn hóa thành 1 template duy nhất trong YSDMS.

### 1.3 Đơn hàng (受注)

| # | Quy trình | Mô tả | Edge Cases | Trạng thái |
|---|---|---|---|---|
| BP-09 | **Nhận đơn hàng chính thức** | KH gửi PO/注文書 | Đơn có thể kiêm phiếu giao (注文書兼納品書) | ✅ orders |
| BP-10 | **Theo dõi đơn hàng nội bộ** | Bảng tracking sản lượng hàng ngày, phân theo KH chính | Sheet Excel 12 tháng, ~40 dòng/tháng | ⬜ Chưa |
| BP-11 | **Đơn hàng nội bộ (社内受注)** | Đơn hàng giữa các bộ phận nội bộ YSD | 2 file Excel riêng (2025, 2026) | ⬜ Chưa |

### 1.4 Phí dịch vụ đặc biệt

| # | Quy trình | Mô tả | Tần suất | Trạng thái |
|---|---|---|---|---|
| BP-12 | **Phí bảo quản khuôn (金型保管料)** | Thu phí hàng năm cho KH không sử dụng khuôn (non-active) | Hàng năm | ⬜ Chưa |
| BP-13 | **Phí phế bỏ khuôn (廃棄料)** | Thu phí phá hủy khuôn cũ | Theo yêu cầu | ⬜ Chưa |
| BP-14 | **Phí thao tác đặc biệt** | VD: Giao xen kẽ A/B (+5 yen/tấm) | Rất hiếm | ⬜ Chưa |
| BP-15 | **Phí vận chuyển charter** | Khi giao >5 pallet/ngày cần thuê xe riêng | Hiếm | ⬜ Chưa |

---

## 🔧 PHẦN 2: QUY TRÌNH KỸ THUẬT & THIẾT KẾ

### 2.1 Thiết kế sản phẩm

| # | Quy trình | Mô tả | Edge Cases | Trạng thái |
|---|---|---|---|---|
| BP-16 | **Thiết kế khuôn mới** | Thiết kế bản vẽ 2D/3D, pocket layout, corner R, draft angle | 36 thông số kỹ thuật trên mỗi thiết kế | ✅ design_revisions |
| BP-17 | **Thử nghiệm pocket (ポケット試作)** | Thử nghiệm trước khi sản xuất khuôn chính thức | KH có thể yêu cầu thử 3+ lần (VD: MCT) | ⬜ Chưa |
| BP-18 | **Phê duyệt bản vẽ** | KH xem bản vẽ → OK/NG → sửa → duyệt lại | Layout có thể thay đổi 3+ lần | ⬜ Chưa |
| BP-19 | **Thay đổi thiết kế (設計変更)** | KH yêu cầu thay đổi hình dáng → tạo revision mới | VD: SMK-225→SMK-230 (đổi tên + đổi hình dáng) | 🟡 Partial |
| BP-20 | **Bảng tra kích thước Tatami** | Bảng tra kích thước khay theo đơn vị tatami (畳サイズ) | 18 kích thước chuẩn | ⬜ Chưa |

### 2.2 Quản lý khuôn (金型管理)

| # | Quy trình | Mô tả | Dữ liệu | Trạng thái |
|---|---|---|---|---|
| BP-21 | **Đăng ký khuôn mới** | Tạo record khuôn vật lý + ảnh + vị trí kệ | 4,741 khuôn trong Access | ✅ physical_molds |
| BP-22 | **Di chuyển vị trí khuôn** | Log mỗi lần di chuyển khuôn giữa các kệ | 1,488 log di chuyển | ✅ SACT |
| BP-23 | **Kiểm kê khuôn (棚卸)** | Kiểm kê định kỳ, so sánh thực tế vs hệ thống | 373 log kiểm kê | ✅ SACT |
| BP-24 | **Mượn khuôn (借用書)** | Phát hành giấy mượn khuôn cho KH (tài sản cố định) | 209 giấy mượn, bao gồm giá/tuổi thọ | ⬜ Planned |
| BP-25 | **Giấy nhận bảo quản khuôn (金型預かり証)** | YSD giữ khuôn KH → phát hành giấy nhận | Phát hành lại khi có thay đổi | ⬜ Chưa |
| BP-26 | **Chứng nhận sử dụng khuôn (金型使用開始証明書)** | Xác nhận khuôn bắt đầu đưa vào sử dụng | Tài liệu pháp lý | ⬜ Chưa |
| BP-27 | **Phế bỏ khuôn (金型廃棄)** | KH gửi DS khuôn không hoạt động → YSD đánh giá → 4 cấp xác nhận | 4 cấp: 担当→管理職→事業部 | ⬜ Chưa |
| BP-28 | **Teflon coating** | Gửi khuôn phủ Teflon → 7 bước workflow | 4,680 lần, bao gồm chi phí | ✅ SACT |
| BP-29 | **Vận chuyển khuôn (出荷/入荷)** | Log giao/nhận khuôn giữa YSD và KH/nhà gia công | 349 log vận chuyển | 🟡 Partial |
| BP-30 | **Quản lý dao cắt (抜型管理)** | Đăng ký, gia công, mapping với khuôn | 1,724 dao + 2,730 mapping | ✅ cutters |

---

## 🏭 PHẦN 3: QUY TRÌNH SẢN XUẤT (Production)

### 3.1 Chỉ thị sản xuất

| # | Quy trình | Mô tả | Edge Cases | Trạng thái |
|---|---|---|---|---|
| BP-31 | **Chỉ thị SX khuôn mới (新規金型製造工程票)** | Luân chuyển: 設計→金型→成形→設計, 1 lần duy nhất | Bao gồm BOM vật tư, thời gian gia công | ⬜ Chưa |
| BP-32 | **Chỉ thị SX khay (注文書/成形指示書)** | Mỗi đơn hàng → chỉ thị cho xưởng định hình | Template riêng theo 5 nhóm KH (HAE, NLC, SMK, YAE, General) | ⬜ Chưa |
| BP-33 | **Kế hoạch sản xuất** | Master planning file 5.2MB, lập kế hoạch theo ngày | Ghi rõ nơi SX: 青=Aomori, S=Sakata, 初回=Lần đầu | ⬜ Chưa |

> [!CAUTION]
> **Master data chỉ thị SX: 7,094 dòng × 110 cột** trong 1 file Excel. Đây là file VBA liên kết chéo với file tồn kho. Cần thiết kế module thay thế rất cẩn thận.

### 3.2 Gia công khuôn (金型加工)

| # | Quy trình | Mô tả | Dữ liệu | Trạng thái |
|---|---|---|---|---|
| BP-34 | **Job gia công** | Tạo job, gán khuôn/dao/máy, tracking tiến độ | 1,167 jobs, 37 trường | 🟡 jobs table |
| BP-35 | **Deadline gia công** | 13 trạng thái, deadline từng công đoạn, ước tính giờ | 2,403 deadline records | ⬜ Chưa đầy đủ |
| BP-36 | **44 loại công đoạn** | processingcode: CNC, EDM, polishing, assembly, etc. | 44 mã chuẩn | ⬜ Chưa import |
| BP-37 | **Nhật ký công việc (日報)** | Log hàng ngày: ai làm gì, bao lâu, công đoạn nào | 6,979 bản ghi, song ngữ JP/VN | 🟡 work_logs (SACT) |
| BP-38 | **Gia công ngoài (外注)** | Gửi job cho nhà gia công bên ngoài (5 nhà gia công) | Tracking ngày gửi/nhận | ⬜ Chưa |
| BP-39 | **Kế hoạch OT (Overtime)** | Lập kế hoạch tăng ca cho job khuôn | Có flag `IsOT_Applied` + `OTHours` | ⬜ Chưa |

### 3.3 Sản xuất khay (成形)

| # | Quy trình | Mô tả | Edge Cases | Trạng thái |
|---|---|---|---|---|
| BP-40 | **Định hình (Thermoforming)** | Dùng máy ILLIG/Asano/Shanshin để tạo hình khay | Thông số: MoldID, CutterID, MachineID, SpreadOnOff | ⬜ Chưa |
| BP-41 | **Multi-site production** | SX tại 4 nhà máy: 本社, 青森, 茨城, 坂田 | Mỗi site có tồn kho + máy riêng | ⬜ Chưa |

---

## 📦 PHẦN 4: QUY TRÌNH VẬT TƯ & TỒN KHO

### 4.1 Quản lý nhựa nguyên liệu

| # | Quy trình | Mô tả | Dữ liệu | Trạng thái |
|---|---|---|---|---|
| BP-42 | **Tồn kho nhựa hàng ngày** | 482 file Excel Saitama + 348 file Aomori, cập nhật HÀNG NGÀY | 325 dòng × 114 cột mỗi file | 🔴 **GAP NGHIÊM TRỌNG** |
| BP-43 | **Tồn kho multi-factory** | 4 nhà máy quản lý tồn kho riêng (本社, 青森, 茨城, 坂田) | Mỗi file có cột riêng cho mỗi site | ⬜ Chưa |
| BP-44 | **Đặt hàng vật tư (発注)** | Tracking đặt hàng nhựa: đơn giá, SL, ngày nhận | 1,321 giao dịch trong Access | ⬜ Chưa |
| BP-45 | **Master vật tư (tiếng Việt)** | 694 mã vật tư với tên tiếng Việt | Cũ từ Access | ⬜ Chưa |
| BP-46 | **Trừ lùi tồn kho theo chỉ thị SX** | File tồn kho LIÊN ĐỘNG trừ tự động khi có chỉ thị SX mới | 残数 = Tồn kho − Đã cấp cho SX | ⬜ Chưa |
| BP-47 | **Tracking hàng đang về** | Cột 納入数量 + 納期 theo dõi nhựa đang trên đường | Multi-supplier (NP, RP東プラ, Sagamihara, Regulus) | ⬜ Chưa |

> [!CAUTION]
> **830 file Excel tồn kho thủ công** = ~2.5 năm tracking bằng tay. Đây là GAP nghiêm trọng nhất cần số hóa ưu tiên P0. Mỗi file có 325 dòng × 114 cột.

### 4.2 Vật liệu nhựa — Phân loại

| Loại | Ký hiệu | Đặc tính | Độ dày (mm) | Chiều rộng (mm) |
|---|---|---|---|---|
| Polystyrene | PS(N), PS(CL), PS(茶), PS(W), PS(B) | Natural/Clear/Brown/White/Black | 0.38~1.0 | 405~640 |
| Polypropylene | PP(N) | Natural | 0.4~0.8 | 405~640 |
| PVC | PVC, PVC(CL) | Standard/Clear | 0.5~1.0 | |
| PET | PET, A-PET(CL) | Standard/Clear | 0.5~1.2 | |

**Thuộc tính đặc biệt:** 帯電防止 (chống tĩnh điện), シリコン (silicon), 塗布 (phủ bề mặt), 導電印刷 (in dẫn điện — 1 tháng lead time)

---

## ✅ PHẦN 5: QUY TRÌNH CHẤT LƯỢNG (QC / Quality)

| # | Quy trình | Mô tả | Edge Cases | Trạng thái |
|---|---|---|---|---|
| BP-48 | **Kiểm tra đầu vào (入検)** | Kiểm tra vật liệu khi nhập kho | Sample riêng cho incoming inspection | ⬜ Chưa |
| BP-49 | **Kiểm tra trong quá trình SX** | Tách Good/NG, phân loại lỗi | 5 loại NG category | ✅ inspections (SD-08) |
| BP-50 | **Bảng kiểm KH chỉ định** | SMK có format riêng (32-100_FMT ver2.0), MCT có 2 bảng kiểm | 4 cấp ký duyệt trên bảng kiểm SMK | ⬜ Chưa |
| BP-51 | **Đo kích thước (寸法測定)** | Đo chi tiết theo thước kẹp/thước sâu, so với quy cách | Dung sai: ±0.3, ±0.5, ±1.0mm | ⬜ Chưa |
| BP-52 | **Báo cáo lỗi (不具合報告)** | Ghi nhận nguyên nhân, đối sách, ảnh lỗi | Song ngữ JP/VN | ⬜ Chưa |
| BP-53 | **Báo cáo thử nghiệm** | Báo cáo kết quả thử nghiệm cho KH (pocket test, sample) | | ⬜ Chưa |

---

## 🚚 PHẦN 6: QUY TRÌNH GIAO HÀNG (Delivery)

| # | Quy trình | Mô tả | Edge Cases | Trạng thái |
|---|---|---|---|---|
| BP-54 | **Phiếu giao hàng chuẩn YSD** | Form nội bộ YSD dùng cho đa số KH | | ⬜ Planned |
| BP-55 | **Phiếu giao KH chỉ định** | SMK, KYD có format Excel riêng (3-4 sheet) | SMK thay đổi format 04/2025 | ⬜ Chưa |
| BP-56 | **Hóa đơn (請求書)** | Phát hành sau khi giao hàng | Densai payment (電子記録) | ⬜ Chưa |
| BP-57 | **Danh sách địa chỉ giao** | 1,864 địa chỉ, mã đặc biệt (888=chưa xác định, 999=xác nhận sau) | Cần cập nhật thường xuyên | ⬜ Chưa |
| BP-58 | **Nhãn dán (ラベル)** | Một số KH (HAE, YAE) yêu cầu dán nhãn trên thùng hàng | Nội dung nhãn theo KH | ⬜ Chưa |

---

## 📋 PHẦN 7: QUY TRÌNH QUẢN LÝ NỘI BỘ

### 7.1 Nhật ký & Báo cáo

| # | Quy trình | Mô tả | Tần suất | Trạng thái |
|---|---|---|---|---|
| BP-59 | **Nhật ký Press & Kiểm tra (プレス＆検査部門日報)** | Nhật ký hàng ngày bộ phận Press + QC | Hàng ngày | ⬜ Chưa |
| BP-60 | **Nhật ký Thiết kế & Khuôn (設計＆金型部門日報)** | Nhật ký hàng ngày bộ phận thiết kế + khuôn | Hàng ngày | 🟡 work_logs |
| BP-61 | **Nhật ký Press + NG (プレス日報兼不適合)** | Kết hợp nhật ký SX + ghi nhận sản phẩm lỗi | Hàng ngày | ⬜ Chưa |
| BP-62 | **Báo cáo kiểm tra máy hàng ngày** | Kiểm tra tình trạng máy mỗi ngày | Hàng ngày | ⬜ Chưa |
| BP-63 | **Báo cáo kiểm tra máy cuối năm** | Kiểm tra tổng hợp máy cuối năm | Hàng năm | ⬜ Chưa |
| BP-64 | **Báo cáo xu hướng doanh thu (売上推移表)** | Phân tích doanh thu theo thời gian | Hàng tháng | ⬜ Chưa |
| BP-65 | **Thu chi bộ phận (部門収支)** | Thu chi 3 bộ phận: Thành hình, Khuôn, Giấy | Hàng tháng | ⬜ Chưa |

### 7.2 ISO & Compliance

| # | Quy trình | Mô tả | Yêu cầu ISO | Trạng thái |
|---|---|---|---|---|
| BP-66 | **Quản lý tài liệu ISO (文書管理)** | Checklist tài liệu, sổ cái, lịch sử phiên bản | ISO 9001 | ⬜ Chưa |
| BP-67 | **Đánh giá nhà cung cấp (供給者評価)** | Bảng đánh giá nhà cung cấp hàng năm | ISO 9001 | ⬜ Chưa |
| BP-68 | **Đào tạo nhân viên (教育訓練)** | Kế hoạch đào tạo hàng năm, chứng nhận kiểm toán viên | ISO 9001 | ⬜ Chưa |
| BP-69 | **Lịch ISO hàng năm** | Lịch trình kiểm toán, đánh giá, training | ISO 9001+14001 | ⬜ Chưa |
| BP-70 | **Quy định môi trường (環境規定)** | Quản lý chất thải, đánh giá tuân thủ | ISO 14001 | ⬜ Chưa |
| BP-71 | **Lịch làm việc (カレンダー)** | 730 ngày, ghi rõ ngày làm việc/nghỉ, giờ chuẩn | Tính toán deadline, capacity | ⬜ Chưa |

---

## ⚡ PHẦN 8: EDGE CASES & VẤN ĐỀ ĐẶC THÙ NGÀNH

### 8.1 Yêu cầu đặc biệt theo khách hàng

| KH | Phiếu giao riêng | Bảng kiểm riêng | Giấy mượn | Nhãn dán | Format chỉ thị SX | Phí khuôn |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **SMK** | ✅ Excel 3 sheet | ✅ 32-100_FMT | ✅ 金型預かり証 | ❌ | ✅ Template riêng | ✅ |
| **JAE/HAE/YAE/NLC** | ❌ Form YSD | ✅ 検査表 | ❌ | ✅ ラベル | ✅ Template riêng | ❌ |
| **KYD** | ✅ 指定納品書 | ✅ 量産検査表 | ✅ 貸与資料覚書 | ❌ | ❌ | ❌ |
| **MCT** | ❌ | ✅ 2 bảng kiểm (YSD+MCT) | ❌ | ❌ | ❌ | ✅ 金型注文書 |
| **IRI** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ 金型手配依頼書 |
| **SJI** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ 金型廃棄 |
| **NLC** | ❌ | ❌ | ✅ 貸出書 | ❌ | ❌ | ✅ 廃棄料+保管料 |

> [!IMPORTANT]
> **Mỗi KH lớn có quy trình riêng.** Hệ thống cần module **Customer-specific Configuration** để lưu template, format phiếu giao, bảng kiểm, và quy trình riêng cho từng KH.

### 8.2 Vấn đề phát sinh trong SX-KD (kể cả nhỏ nhất)

| # | Vấn đề | Mô tả chi tiết | Nguồn phát hiện |
|---|---|---|---|
| IS-01 | **Bottleneck máy thành hình** | Khuôn xong nhưng máy bận → delay toàn bộ đơn hàng | IRI email chain |
| IS-02 | **Ưu tiên đơn hàng** | KH yêu cầu ưu tiên đơn này trước đơn khác của chính họ | IRI email |
| IS-03 | **Sample cho inspection riêng** | Ngoài sample thường, cần thêm sample cho incoming inspection (入検用) | IRI email |
| IS-04 | **Sample cho văn phòng** | Cần thêm 2 tấm cho văn phòng (事務所用) | IRI email |
| IS-05 | **Vật liệu lead time dài** | 導電印刷 PET đen → 1 tháng lead time | CHG email |
| IS-06 | **Thay thế vật liệu tạm** | Dùng PET xanh thay PET đen cho thử nghiệm (KH chấp nhận) | CHG email |
| IS-07 | **Đàm phán phí thử nghiệm** | Chi phí pocket test ai trả? → YSD miễn phí để giữ KH | CHG email |
| IS-08 | **Giao xen kẽ A/B** | Khách yêu cầu xếp luân phiên A-B-A-B → phí thao tác +5 yen/tấm | CHG email |
| IS-09 | **Số lượng/thùng thay đổi** | 200 vs 240 tấm/thùng tùy KH yêu cầu | CHG email |
| IS-10 | **Loại pallet** | Nhựa vs gỗ, tùy KH/nơi giao | CHG email |
| IS-11 | **Giới hạn vận chuyển** | Max 5 pallet/ngày, trên 5 → charter xe → phí cao | CHG email |
| IS-12 | **Thay đổi hình dáng mid-project** | KH yêu cầu đổi form → đổi tên SP (SMK-225→230) | SMK-230 case |
| IS-13 | **14+ vòng email đàm phán** | 1 dự án có thể cần 14+ email trao đổi kỹ thuật | SMK-230 case |
| IS-14 | **Phát hành lại giấy khuôn** | Khi thay đổi SP → cần phát hành lại 金型預かり証 | SMK-230 case |
| IS-15 | **Bảng ảnh khuôn (金型写真看板)** | Cần chụp ảnh + in bảng dán tại kệ lưu trữ | SMK-230 case |
| IS-16 | **Khuôn không hoạt động** | NLC gửi DS hàng năm, YSD đánh giá phế bỏ/giữ | NLC folder |
| IS-17 | **Xác nhận giấy mượn trước khi phế bỏ** | Phải check 貸出書 trước khi hủy khuôn | NLC folder |
| IS-18 | **4 cấp xác nhận phế bỏ** | 担当→管理職→事業部 (riêng cho NLC) | NLC folder |
| IS-19 | **Format phiếu giao thay đổi** | SMK đổi format phiếu giao 04/2025 | SMK delivery notes |
| IS-20 | **Mã nơi giao đặc biệt** | 888=chưa xác định, 999=xác nhận sau | Delivery address list |
| IS-21 | **Nhiều nơi giao cho 1 KH** | JAE có 3 nơi giao (ひたち, 本社, YAE) | JAE delivery notes |
| IS-22 | **Trung gian logistics** | NLC là trung gian giữa JAE và YSD | JAE-365 folder |
| IS-23 | **File tồn kho 494MB** | `機械加工部門.xlsx` — 1 file Excel cực lớn | Form lien quan |
| IS-24 | **% nhựa tái chế** | SMK yêu cầu ghi rõ 粉砕材含有率 (recycled %) trên bảng kiểm | SMK QC form |
| IS-25 | **Multi-model báo giá** | Cần báo giá 3 mức giá cùng lúc (20/50/100 tấm) | CHG email |

---

## 📊 PHẦN 9: MA TRẬN MODULE → QUY TRÌNH

| Module YSDMS | Quy trình bao phủ | Trạng thái |
|---|---|---|
| **Cases (事案管理)** | BP-01, BP-02, BP-03 | ✅ Cơ bản |
| **Quotation (見積)** | BP-04~BP-08 | ✅ Cơ bản |
| **Orders (受注)** | BP-09~BP-11 | 🟡 Partial |
| **Mold Lifecycle (金型)** | BP-21~BP-30 | ✅ SACT + physical_molds |
| **Design (設計)** | BP-16~BP-20 | 🟡 design_revisions |
| **Production Orders (製造指示)** | BP-31~BP-33 | ⬜ Chưa |
| **Job Tracking (加工)** | BP-34~BP-39 | 🟡 jobs table |
| **Production (成形)** | BP-40~BP-41 | ⬜ Chưa |
| **Material Inventory (材料)** | BP-42~BP-47 | 🔴 GAP nghiêm trọng |
| **QC (品質)** | BP-48~BP-53 | ⬜ SD-08 schema only |
| **Delivery (納品)** | BP-54~BP-58 | ⬜ Planned |
| **Finance (経理)** | BP-12~BP-15, BP-56, BP-64~BP-65 | ⬜ Chưa |
| **Daily Reports (日報)** | BP-59~BP-63 | 🟡 work_logs |
| **ISO/Compliance** | BP-66~BP-71 | ⬜ Chưa |
| **Customer Config** | IS-01~IS-25 (edge cases) | ⬜ Chưa |

---

## 🎯 PHẦN 10: ĐỀ XUẤT ƯU TIÊN

### P0 — Ảnh hưởng vận hành hàng ngày
1. ⬜ **Tồn kho nhựa real-time** (thay 830 file Excel)
2. ⬜ **Chỉ thị sản xuất** (thay Excel VBA liên kết chéo)
3. ⬜ **Kế hoạch sản xuất** (thay master planning file 5.2MB)

### P1 — Hoàn thiện vòng đời sản phẩm
4. ⬜ **Giao hàng + Phiếu giao multi-format**
5. ⬜ **Mượn khuôn / Giấy nhận khuôn**
6. ⬜ **Đặt hàng vật tư**
7. ⬜ **QC + Bảng kiểm KH chỉ định**
8. ⬜ **Nhật ký bộ phận**

### P2 — Tối ưu hóa & Compliance
9. ⬜ **Báo cáo lỗi (不具合)**
10. ⬜ **ISO integration**
11. ⬜ **Customer-specific Configuration**
12. ⬜ **Cải giá / Phí bảo quản khuôn**
13. ⬜ **Lịch làm việc + Capacity planning**

> [!NOTE]
> Bản danh mục này sẽ được cập nhật khi Scanner 1 (Quotation/ISO chi tiết) hoàn thành. Nội dung hiện tại đã bao phủ **>90%** quy trình nghiệp vụ phát hiện được.
