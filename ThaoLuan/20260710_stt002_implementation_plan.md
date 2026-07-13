# 📊 Phân tích Toàn diện Nghiệp vụ STT-002 & Kế hoạch Kiểm thử Hệ thống

> **Mã sản phẩm:** STT-002 (Khay dẫn điện A/B — 導電性トレー)  
> **Ngày lập:** 2026-07-10  
> **Mục đích:** Bóc tách toàn bộ thông tin kinh doanh thực tế từ lịch sử email để làm dữ liệu kiểm thử trên các module đã xây dựng, đồng thời xác định các module còn thiếu.

---

## PHẦN I — DỮ LIỆU KINH DOANH THỰC TẾ (Trích xuất từ Email)

### 1. Thông tin Khách hàng & Các bên liên quan

| Vai trò | Tên | Email | Công ty |
|---------|------|-------|---------|
| **Khách hàng cuối** (End Customer) | 原 正憲 (Hara), 唐澤 (Karasawa), 箕田 (Minoda) | mhara@rubycon.co.jp | ルビコン㈱ 松川事業所 PML技術課 |
| **Trung gian đặt hàng** (Intermediary) | 阿部 健太郎 (Abe Kentaro) | ken.abe@santec-tohoku.co.jp | ㈱サンテック東北 |
| **YSD Kinh doanh** | 小林 (Kobayashi) | kobayashi@ysd-pack.co.jp | ㈱ヨシダパッケージ |
| **YSD Thiết kế** | クアン (Quan) | quan@ysd-pack.co.jp | ㈱ヨシダパッケージ |
| **YSD Hành chính** | 桜井 麻子 (Sakurai) | gyoumu@ysd-pack.co.jp | ㈱ヨシダパッケージ |

> [!NOTE]
> **STT-002 KHÔNG liên quan đến Stanley Electric.** Mã "STT" là mã nội bộ YSD cho sản phẩm dùng bởi ルビコン (Rubycon), thông qua đại lý サンテック東北 (Santec Tohoku).

### 2. Địa chỉ Giao hàng

| # | Nơi giao | Địa chỉ | Điện thoại |
|---|----------|---------|------------|
| 1 | ルビコン㈱ 松川事業所 | 〒399-3303 長野県下伊那郡松川町元大島2932 | 0265-36-3311 |
| 2 | ㈱サンテック東北 | 〒981-3401 宮城県黒川郡大和町落合三ケ内字北沢54-8 | 022-344-2420 |

---

### 3. Thông số Sản phẩm (Product Specifications)

| Thuộc tính | Giá trị |
|-----------|---------|
| **Loại sản phẩm** | 導電性トレー (Khay dẫn điện) |
| **Sản phẩm khách hàng** | Tụ điện cao áp PML (高圧PMLCAP) |
| **Mã YSD** | STT-002 |
| **Tên SP khách hàng** | TR-S24-A / TR-S24-B |
| **Cấu hình** | Aトレイ/Bトレイ セット取り (Khuôn ghép A/B) |
| **Kích thước tụ điện** | 31mm × 26mm, Cao: 35mm, Dây dẫn: 5mm |
| **Trọng lượng tụ** | 40.7 g/cái |
| **Kích thước khay** | 330±1.0 × 270±1.0 mm |
| **Kích thước khuôn** | 590 × 350 mm (2 mặt, A/B đồng thời) |
| **Vật liệu** | PS黒1.0mm 導電練り込み【640】 |
| **Vật liệu thay thế** | PS透明1.0mm 帯電防止付シリコン付【440】 |
| **Máy thành hình** | ILLIG |
| **Cắt** | Inline (インライン) |
| **Xếp chồng** | Cùng hướng (同方向), kiểu đỡ sản phẩm, 4 tầng |
| **Chiều cao xếp chồng** | 43mm × 3 + 48mm ≈ 177mm |
| **Số lượng pocket** | 35 cái/khay |
| **Góc nghiêng (Draft)** | 5° |
| **Khắc chữ** | Rubycon, Recycling mark, TR-S24, A hoặc B |

---

### 4. Thông tin Báo giá & Chi phí (Quotation & Costs)

#### 4.1 Báo giá ban đầu (Khay đơn, xếp chồng ngược 180°)

| Hạng mục | Số tiền (¥) |
|----------|-------------|
| Phí thiết kế (設計費) | 40,000 |
| Khuôn thử nghiệm pocket (ポケット試作) | 70,000 |
| Khuôn chính thức (金型) | 250,000 |
| **Điều kiện:** Nếu đặt khuôn trước khi thiết kế → trừ phí thiết kế ||

#### 4.2 Sau khi đổi sang thông số A/B (Bản sửa đổi)

| Hạng mục | Số tiền (¥) | Ghi chú |
|----------|-------------|---------|
| Phí thiết kế (đã thanh toán) | 40,000 | Hóa đơn 2026-01-30 |
| Khuôn thử nghiệm lần 1 | 70,000 | Đã thanh toán |
| Khuôn thử nghiệm lần 2 (A/B × 2 khuôn) | 140,000 | Sửa từ ¥70,000 → ¥140,000 bằng FAX |
| Khuôn chính thức A/B ghép (A/B共取り金型) | 280,000 | |
| **Tổng đã thanh toán trước** | **180,000** | = 40,000 + 70,000 + 70,000 |
| **Số tiền còn lại (注文書)** | **100,000** | = 280,000 − 180,000 |

#### 4.3 Hóa đơn & Thanh toán

- Hóa đơn sửa đổi (納品書): Phát hành tháng 6/2026
- Doanh thu tháng 6 → Gửi hóa đơn cuối tháng 6 (桜井 xử lý)
- Đơn đặt hàng chính thức: ¥100,000 từ サンテック東北

---

### 5. Lịch trình Sự kiện Đầy đủ (Complete Timeline)

| Ngày | Sự kiện | Phân loại |
|------|---------|-----------|
| **2025-11-05** | Rubycon gửi yêu cầu khay dẫn điện qua Santec → YSD | 引き合い (Inquiry) |
| **2025-11-10** | Kobayashi bắt đầu làm layout & báo giá | 見積 (Quotation) |
| **2025-11-11** | Gửi layout + báo giá (35 cái/khay, xếp chồng 180°) | 見積 |
| **2025-12-09** | Santec hẹn họp Rubycon ngày 24/12 | 営業 (Sales) |
| **2025-12-26** | Báo cáo họp khách hàng — Dự kiến PO tháng 4/2026 | 営業 |
| **2026-01-05** | Yêu cầu thanh toán phí thiết kế ¥40,000 + prototype ¥70,000 trước khi bắt đầu | 見積 |
| **2026-01-06** | Thay đổi: Xếp chồng cùng hướng, kiểu đỡ sản phẩm | 設計変更 |
| **2026-01-07** | Xác nhận: A/B = 2 khuôn. Báo giá chính thức | 見積 |
| **2026-01-08** | Đơn đặt hàng ban đầu (PO) được phát hành | 受注 (Order) |
| **2026-01-13** | Thiết kế hoàn thành, gửi bản vẽ | 設計 (Design) |
| **2026-01-20** | Rubycon gửi 3 câu hỏi kỹ thuật (độ sâu, 4 tầng, khắc chữ) | 技術 (Technical) |
| **2026-01-21** | Trả lời câu hỏi, thêm dữ liệu 4 tầng + khắc chữ | 設計 |
| **2026-01-30** | Khách hàng duyệt bản vẽ → Phát hành hóa đơn thiết kế ¥40,000 | 承認 (Approval) |
| **2026-02-03** | Giao mẫu thử nghiệm trễ → dời đến 2/16 | 試作 (Prototype) |
| **2026-03-25** | Khách yêu cầu tăng overlap 5mm→10mm, giảm rung lắc | 設計変更 |
| **2026-04-13** | Yêu cầu lại: overlap 10mm + giữ bên + prototype lần 2 | 設計変更 |
| **2026-04-21** | Kiểm tra overlap 10mm OK. Gửi báo giá lần 2 | 見積 |
| **2026-04-24** | Đặt hàng prototype lần 2: ¥70,000 → sửa thành ¥140,000 (A/B) | 受注 |
| **2026-04-30** | Họp khách hàng → Yêu cầu chuyển sang thiết kế A/B riêng biệt | 設計変更 |
| **2026-05-02** | Báo giá A/B: Pocket ¥140,000 (cả A+B), ¥70,000 (1 loại) | 見積 |
| **2026-05-07** | Sửa đơn hàng ¥70,000 → ¥140,000 qua FAX | 受注修正 |
| **2026-05-08** | Lệnh thiết kế lại cho Quan: A/B, overlap, khắc chữ → Hoàn thành cùng ngày | 設計 |
| **2026-05-12** | Rubycon duyệt hình dạng cơ bản, hỏi 2 vấn đề kỹ thuật (góc 5°, chiều cao 177mm) | 承認 |
| **2026-05-13** | Bắt đầu chuẩn bị prototype A/B, yêu cầu Quan vẽ bản thử nghiệm | 試作 |
| **2026-05-18** | Quan gửi bản vẽ khuôn thử nghiệm A/B | 設計 |
| **2026-05-19** | Lệnh sản xuất prototype lần 2 — Giao 5/29, vật liệu PS đen + PS trong | 試作 |
| **2026-05-28** | Giao mẫu prototype. Santec chuyển Rubycon kiểm tra | 試作 |
| **2026-06-03** | **Rubycon xác nhận prototype A/B OK → Tiến hành khuôn chính thức** | 承認 |
| **2026-06-05** | Hóa đơn sửa đổi, thanh toán tháng 6 | 経理 (Accounting) |
| **2026-06-10** | Thảo luận: Lead time khuôn ~1 tháng, 500 bộ/lô, lặp lại 1-2 tuần | 営業 |
| **2026-06-16** | Xác nhận tên SP: TR-S24A / TR-S24B. Yêu cầu khắc logo Rubycon | 設計変更 |
| **2026-06-17** | **Đơn hàng chính thức ¥100,000 từ Santec Tohoku** | 受注 |
| **2026-06-19** | Gửi bản vẽ có khắc chữ | 設計 |
| **2026-06-22** | Rubycon yêu cầu thống nhất vị trí khắc A/B (góc trên-phải) | 設計変更 |
| **2026-06-23** | Gửi bản vẽ STT-002A sửa đổi | 設計 |
| **2026-06-24** | **Khách hàng duyệt bản vẽ cuối → Cho phép sản xuất khuôn** | 承認 |
| **2026-06-25** | **Bắt đầu sản xuất khuôn.** Mẫu đầu tiên ~giữa tháng 7. Giao 10 bộ Rubycon + 1 bộ Santec | 金型製作 |
| **2026-06-26** | Quan gửi dữ liệu khuôn | 金型 |
| **2026-07-03** | Xác nhận bản vẽ khuôn, chỉ thị làm plug + bản vẽ dao cắt. **Ngày giao: 7/15** | 金型+抜型 |
| **2026-07-04** | Quan gửi bản vẽ dao cắt STT-002 | 抜型 |

---

### 6. Chỉ thị Sản xuất Mẫu đầu tiên (Initial Sample Production Order)

| Hạng mục | Giá trị |
|----------|---------|
| **Ngày giao dự kiến** | 7/15 (水) |
| **Vật liệu** | PS黒1.0mm【640】導電練り込み |
| **Số lượng** | 10 bộ (miễn phí) + 1 bộ Santec (miễn phí) + 2 bộ văn phòng |
| **Giao cho Rubycon** | 10 bộ → 松川事業所 唐澤様 |
| **Giao cho Santec** | 1 bộ → サンテック東北 阿部様 |
| **Lead time khuôn** | ~1 tháng sau đặt hàng |
| **Lead time lặp lại** | 1-2 tuần |
| **Sản lượng dự kiến** | 1,000 tấm/tháng |
| **Bắt đầu sản xuất hàng loạt** | Tháng 10/2026 |

---

## PHẦN II — TRẠNG THÁI CÁC MODULE HIỆN TẠI

### Tổng quan Module

| Lĩnh vực | Module | Trạng thái | Mức hoàn thiện |
|-----------|--------|------------|----------------|
| **Kinh doanh** | Quản lý Khách hàng | ✅ Đã xây dựng | 90% |
| | **Báo giá (見積書)** | **🚧 Chưa xây dựng** | **0%** |
| | Đơn hàng (受注) | ✅ Đã xây dựng | 75% |
| | In Đơn hàng (指示書) | ✅ Đã xây dựng | 80% |
| | Giao hàng (出荷) | ✅ Đã xây dựng | 70% |
| **Master** | Sản phẩm | ✅ Đã xây dựng | 85% |
| | Máy móc | ✅ Đã xây dựng | 90% |
| | Kệ chứa | ✅ Đã xây dựng | 90% |
| **Thiết kế** | Design Revisions | ✅ Đã xây dựng | 80% |
| **Khuôn/Thiết bị** | Khuôn thực (Physical Molds) | ✅ Đã xây dựng | 85% |
| | Job Management | ✅ Đã xây dựng | 85% |
| | Gantt Chart | ✅ Đã xây dựng | 70% |
| | Dao cắt (Cutting Dies) | ✅ Đã xây dựng | 80% |
| | Kiểm kê (Lifecycle) | 🚧 Placeholder | 5% |
| **Sản xuất** | Kế hoạch sản xuất (Planning) | ✅ Đã xây dựng | 80% |
| | Kanban | ✅ Đã xây dựng | 75% |
| | Chỉ thị sản xuất | ✅ Đã xây dựng | 80% |
| | MRP | ✅ Đã xây dựng | 60% |
| | Nhập thực tế (Floor) | 🚧 Placeholder | 5% |
| **Vật liệu** | Nhựa Master | ✅ Đã xây dựng | 70% |
| | Nhựa tồn kho | ✅ Đã xây dựng | 70% |
| **Chất lượng** | QC / Kiểm tra | 🚧 Placeholder | 10% |

### Module cần xây dựng mới (Identified Gaps)

> [!WARNING]
> **Module Báo giá (見積書/Quotation) hoàn toàn chưa có:**
> - Không có bảng DB (`quotations`, `quotation_lines`)
> - Không có logic tính giá
> - Chỉ có trang placeholder tại `/orders/quotations`
> 
> Đây là module **cốt lõi** trong luồng kinh doanh thực tế (Stage 2/9 trong Product Lifecycle).

---

## PHẦN III — KẾ HOẠCH NHẬP LIỆU KIỂM THỬ TOÀN DIỆN

Dựa trên dữ liệu thực tế STT-002, chúng ta sẽ kiểm thử từng module theo đúng thứ tự luồng nghiệp vụ:

### Bước 1: Master — Khách hàng & Địa chỉ giao hàng
**Module:** `/master/customers`

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Tạo/Kiểm tra Công ty | ㈱サンテック東北 (Intermediary) |
| Tạo/Kiểm tra Công ty | ルビコン㈱ (End Customer) |
| Thêm Liên hệ (Contact) | 阿部 健太郎 — ken.abe@santec-tohoku.co.jp |
| Thêm Liên hệ (Contact) | 唐澤 — mhara@rubycon.co.jp |
| Thêm Địa chỉ giao hàng | ルビコン松川事業所 — 長野県下伊那郡松川町元大島2932 |
| Thêm Địa chỉ giao hàng | サンテック東北 — 宮城県黒川郡大和町落合三ケ内字北沢54-8 |

### Bước 2: Master — Sản phẩm
**Module:** `/master/products`

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Tạo Sản phẩm 1 | Mã: STT-002A, Tên: TR-S24-A, Kích thước: 330×270mm, Vật liệu: PS黒1.0mm【640】 |
| Tạo Sản phẩm 2 | Mã: STT-002B, Tên: TR-S24-B, Kích thước: 330×270mm, Vật liệu: PS黒1.0mm【640】 |
| Liên kết với Công ty | company_id → ㈱サンテック東北 |

### Bước 3: Thiết kế — Design Revisions
**Module:** `/engineering/designs`

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Tạo Revision 1 | Mã: STT-002P(Q)R2 — Bản vẽ ban đầu (khay đơn, xếp chồng 180°) |
| Tạo Revision 2 | Mã: STT-002P(Q)_A/B — Bản sửa đổi (A/B, xếp chồng cùng hướng, 4 tầng) |
| Đánh dấu trạng thái | Revision 1: SUPERSEDED, Revision 2: APPROVED |

### Bước 4: Master — Khuôn & Dao cắt
**Module:** `/equipment/molds` + `/equipment/cutting-dies`

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Tạo Mold Master | Mã: STT-002, Loại: セット取り金型 (Set Mold), Kích thước: 590×350mm |
| Liên kết Sản phẩm | STT-002 → STT-002A + STT-002B |
| Tạo Dao cắt | Mã: STT-002 (抜型), Liên kết với Mold |

### Bước 5: Đơn hàng — Tạo đơn
**Module:** `/orders` + `/orders/create`

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Tạo Đơn hàng | Khách hàng: ㈱サンテック東北, Ngày: 2026-06-17 |
| Thêm Order Line 1 | Sản phẩm: STT-002A, SL: 10 bộ, Giá: miễn phí (mẫu), Giao: ルビコン松川 |
| Thêm Order Line 2 | Sản phẩm: STT-002B, SL: 10 bộ, Giá: miễn phí (mẫu), Giao: ルビコン松川 |
| Thêm Order Line 3 | Sản phẩm: STT-002A, SL: 1 bộ, Giao: サンテック東北 |
| In Chỉ thị sản xuất | Kiểm tra form in A4 tại `/orders/[id]/print` |

### Bước 6: Lập kế hoạch Job (Khuôn)
**Module:** `/equipment/jobs` + `/equipment/schedule` (Gantt Chart)

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Tạo Job — Khuôn STT-002 | Loại: MOLD, Hạn chót: 2026-07-15 |
| Thêm Track: 金型 (Mold) | |
| → Công đoạn 1 | Phay CNC (Pocket A) — 予定H: 8h |
| → Công đoạn 2 | Phay CNC (Pocket B) — 予定H: 8h |
| → Công đoạn 3 | Khắc chữ (Engraving) — 予定H: 2h |
| → Công đoạn 4 | Lắp ráp (Assembly) — 予定H: 4h |
| Thêm Track: プラグ (Plug) | |
| → Công đoạn 5 | Làm Plug — 予定H: 6h |
| Thêm Track: 抜型 (Cutter) | |
| → Công đoạn 6 | Làm Dao cắt — 予定H: 4h |
| **Trên Gantt Chart** | Kéo thả gán ngày, phân công máy, kiểm tra cột 期限 |

### Bước 7: Ghi nhật ký sản xuất (Worklogs)
**Module:** `/equipment/jobs/[id]` (Chi tiết Job)

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Worklog CĐ1 | Ngày: 2026-07-05, Giờ thực tế: 7.5h, Trạng thái: 完了 |
| Worklog CĐ2 | Ngày: 2026-07-06, Giờ thực tế: 8h, Trạng thái: 完了 |
| Worklog CĐ3 | Ngày: 2026-07-07, Giờ thực tế: 1.5h, Trạng thái: 完了 |
| **Kiểm tra Gantt** | Xác nhận % tiến độ tăng, 実績H đúng, 状態 chuyển màu |

### Bước 8: Vật liệu Nhựa
**Module:** `/plastics/master` + `/plastics/inventory`

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Kiểm tra/Tạo Nhựa Master | Mã 【640】PS黒1.0mm 導電練り込み |
| Kiểm tra/Tạo Nhựa Master | Mã 【440】PS透明1.0mm 帯電防止付シリコン付 |
| Kiểm tra tồn kho | Xác nhận cuộn nhựa có sẵn cho sản xuất |

### Bước 9: MRP & Kế hoạch Sản xuất
**Module:** `/production/mrp` + `/production/planning`

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Kiểm tra MRP | Xác nhận yêu cầu vật liệu PS黒1.0mm cho đơn hàng STT-002 |
| Tạo kế hoạch sản xuất | Ngày sản xuất: ~2026-07-14, Máy: ILLIG, Sản phẩm: STT-002A/B |
| Kiểm tra Kanban | Xem trạng thái hiển thị trên bảng Kanban |

### Bước 10: Giao hàng
**Module:** `/orders/shipments`

| Thao tác | Dữ liệu nhập |
|----------|---------------|
| Tạo Shipment | Đơn hàng STT-002, Ngày giao: 2026-07-15, 10 bộ → ルビコン松川 |
| Tạo Shipment | 1 bộ → サンテック東北 |

---

## PHẦN IV — MODULE CẦN XÂY DỰNG MỚI

### 1. Module Báo giá (見積書 / Quotation Management)

Dựa trên dữ liệu STT-002, một hệ thống báo giá cần hỗ trợ:

**Bảng DB cần thiết:**
```
quotations:
  - quotation_no (Mã báo giá)
  - company_id (FK → companies)
  - contact_id (FK → company_contacts)  
  - quotation_date
  - valid_until (Ngày hết hạn)
  - status (DRAFT / SENT / APPROVED / REJECTED / ORDERED)
  - total_amount
  - notes
  - created_by

quotation_lines:
  - quotation_id (FK → quotations)
  - line_no
  - item_type (DESIGN_FEE / PROTOTYPE / MOLD / PRODUCT / OTHER)
  - description
  - quantity
  - unit_price
  - amount
  - notes
```

**Luồng nghiệp vụ thực tế (từ STT-002):**
```
Inquiry → Quotation v1 (¥250,000 khuôn đơn) 
       → Quotation v2 (¥280,000 khuôn A/B + ¥140,000 prototype)
       → PO (¥100,000 = ¥280,000 − ¥180,000 đã trả)
       → Order
```

**Tính năng cần có:**
- Tạo báo giá nhiều phiên bản (version)
- Tính toán trừ các khoản đã thanh toán trước
- Chuyển đổi Quotation → Order tự động
- In/Xuất PDF báo giá

### 2. Các module khác cần bổ sung

| Module | Ưu tiên | Lý do |
|--------|---------|-------|
| **Quotation (見積書)** | 🔴 Cao | Thiếu hoàn toàn, cốt lõi kinh doanh |
| **Production Floor (実績入力)** | 🟡 Trung bình | Nhập thực tế từ sàn sản xuất |
| **Equipment Lifecycle (棚卸)** | 🟡 Trung bình | Kiểm kê định kỳ |
| **Quality (品質管理)** | 🟡 Trung bình | QC trước giao hàng |
| **Outsource (外注管理)** | 🟢 Thấp | Quản lý gia công ngoài |

---

## PHẦN V — OPEN QUESTIONS

> [!IMPORTANT]
> **Cần xác nhận từ người dùng trước khi tiến hành nhập liệu:**
> 
> 1. **Khách hàng:** Có đúng là đơn hàng STT-002 qua trung gian サンテック東北 (không trực tiếp từ Rubycon)?
> 2. **Mã sản phẩm:** Nên tách riêng STT-002A và STT-002B hay gộp thành 1 mã STT-002 (Set)?
> 3. **Giá & Thanh toán:** Thông tin ¥100,000 còn lại có chính xác không?
> 4. **Kế hoạch Job:** Các công đoạn (Phay CNC, Khắc chữ, Plug, Dao cắt) có đúng với quy trình thực tế?
> 5. **Ưu tiên module mới:** Nên bắt tay xây dựng module Báo giá (見積書) trước hay tiếp tục hoàn thiện các module hiện tại?
