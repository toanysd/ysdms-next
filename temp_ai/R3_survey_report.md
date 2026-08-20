# BÁO CÁO KHẢO SÁT CẤU TRÚC PRODUCT CENTER & THỰC TRẠNG DỮ LIỆU SẴN CÓ (R3-A SURVEY REPORT)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày lập:** 2026-08-20
- **Mục tiêu:** Khảo sát chi tiết hiện trạng cấu trúc mã nguồn `/product-center/[id]/`, rà soát các bảng dữ liệu database sẵn có (chưa khai thác hoặc khai thác chưa triệt để), và đề xuất kiến trúc Tab **Product 360° View + Dashboard Lệnh Sản Xuất** cho Phase R3.

---

## 1. CẤU TRÚC THƯ MỤC HIỆN TẠI CỦA `/product-center/[id]/`

Toàn bộ màn hình chi tiết sản phẩm nằm tại `src/app/product-center/[id]/` gồm **27 file / component**:

```
src/app/product-center/[id]/
├── page.tsx                                  ← Root Client Entrypoint (Header + 6 Tab buttons + Layout wrapper)
└── _components/
    ├── TabOverview.tsx                       ← Tab 1: Tổng quan thông số kỹ thuật (Paper-style specs), bộ thiết bị, đơn hàng gần nhất
    ├── TabOrders.tsx                         ← Tab 2: Lịch sử đơn hàng & lịch xuất hàng
    ├── TabDesignsEquipment.tsx               ← Tab 3: Cây phả hệ phiên bản CAD (Revision Tree) & Thiết bị vật lý
    ├── TabJobs.tsx                           ← Tab 4: Lịch sử gia công chế tạo/sửa chữa khuôn & nhật ký giờ công (Worklogs)
    ├── TabApprovalLifecycle.tsx              ← Tab 5: [MỚI R2-C] Stepper 6 chặng vòng đời, Phê duyệt CAD & Mẫu thử
    ├── TabRelatedInfo.tsx                    ← Tab 6: Thông tin khách hàng đặt hàng, End-User, quy cách thùng
    │
    ├── ApprovalTimeline.tsx                  ← [MỚI R2-C] Visual Timeline 3 khối: Vòng duyệt CAD, Mẫu thử, Audit Trail
    ├── CreateApprovalLogModal.tsx            ← [MỚI R2-C] Modal ghi nhận log phê duyệt bản vẽ
    ├── CreateSampleRequestModal.tsx          ← [MỚI R2-C] Modal tạo yêu cầu làm mẫu thử Pocket/Khay
    ├── UpdateSampleResultModal.tsx           ← [MỚI R2-C] Modal cập nhật kết quả mẫu (CUSTOMER_OK / CUSTOMER_NG + lý do)
    ├── OverrideLifecycleModal.tsx            ← [MỚI R2-C] Modal can thiệp thủ công trạng thái vòng đời (bắt buộc lý do)
    │
    ├── EditProductModal.tsx                  ← Modal chỉnh sửa thông tin Master Sản phẩm (product_code, tên, status...)
    ├── CreateDesignRevisionModal.tsx         ← Modal tạo phiên bản thiết kế CAD mới (kế thừa thông số)
    ├── QuickAddRepairJobModal.tsx            ← Modal tạo nhanh Job sửa chữa/bảo trì khuôn
    ├── CenteredQuickJobWizardModal.tsx       ← Wizard tạo Job gia công khuôn nhanh
    ├── EquipmentQuickPreviewModal.tsx        ← Preview thông số nhanh của thiết bị khi hover/click
    ├── EquipmentContextMenu.tsx              ← Menu ngữ cảnh thao tác nhanh trên thiết bị
    ├── EquipmentJobDrawer.tsx                ← Drawer hiển thị tiến độ các Job liên quan đến thiết bị
    ├── ProductQuickSearch.tsx                ← Search gợi ý nhanh trong Product Center
    │
    ├── SectionShell.tsx                      ← Wrapper khung section chuẩn
    ├── SectionCustomer.tsx                   ← Component khối thông tin khách hàng
    ├── SectionDesigns.tsx                    ← Component khối thiết kế CAD
    ├── SectionEquipment.tsx                  ← Component khối thiết bị
    ├── SectionJobs.tsx                       ← Component khối công việc
    └── SectionOrders.tsx                     ← Component khối đơn hàng
```

---

## 2. RÀ SOÁT CÁC BẢNG DỮ LIỆU ĐÃ CÓ NHƯNG CHƯA KHAI THÁC TRIỆT ĐỂ

Hệ thống database Supabase hiện tại đã có đầy đủ dữ liệu thực tế nhưng trang chi tiết sản phẩm chưa hiển thị hoặc hiển thị rời rạc:

| Bảng Database Thực Tế (SSOT) | Hiện Trạng Dữ Liệu Sẵn Có | Thực Trạng Khai Thác Trên UI `/product-center/[id]` | Cơ Hội Nâng Cấp Ở Phase R3 |
|---|---|---|---|
| **`equipment_assignments`** | Quản lý quan hệ N:N giữa Khuôn chính (`primary_equipment_id`) và các thiết bị con (`assigned_equipment_id`) theo loại quan hệ `SET_MEMBER` (Bộ gá lắp) hoặc `SHARED` (Dùng chung). | ⚠️ **CHƯA ĐƯỢC QUERY/HIỂN THỊ**. UI hiện chỉ query bảng `equipment` đơn lẻ theo `product_id`, không hiển thị được bộ SET gá lắp hoàn chỉnh (Khuôn + Dao + Đế nước + Đế khí + Khung + Stacking + Plug) hoặc thiết bị dùng chung từ sản phẩm khác. | Hiển thị **Ma Trận Gá Lắp Bộ Thiết Bị (SET Completeness Matrix)**: Nhìn vào biết ngay bộ khuôn này đã đủ 8 món phụ kiện để lên máy dập chưa, món nào dùng riêng, món nào mượn dùng chung (`SHARED`). |
| **`plastic_receipt_roll`** / **`plastic_master`** | Quản lý kho cuộn nhựa nhập về (`plastic_receipt_roll`: mã cuộn, độ dày, khổ màng, khối lượng kg, số lô, nhà cung cấp) liên kết với `plastic_master`. | ⚠️ **CHƯA ĐƯỢC HIỂN THỊ**. Trang sản phẩm hiện chỉ hiển thị chuỗi text thô `plastic_type_designed` (ví dụ: `PET 0.5t 640mm`) từ `design_revisions`, chưa đối soát với tồn kho cuộn nhựa thực tế. | Hiển thị **Thẻ Tồn Kho Nhựa Phù Hợp (Matching Material Stock)**: Khi xem sản phẩm, tự động lọc ra các cuộn nhựa trong kho (`plastic_receipt_roll`) có cùng chủng loại/khổ/độ dày, báo ngay còn đủ kg để chạy đơn hàng hay không. |
| **`orders`** / **`order_lines`** / **`shipments`** | Quản lý toàn bộ lịch sử đơn hàng (`orders`), chi tiết số lượng đặt (`order_lines.quantity`), đơn giá, hạn giao (`delivery_date`), và lịch sử các đợt xuất hàng (`shipments.shipped_qty`). | ⚠️ **CHỈ HIỂN THỊ DẠNG BẢNG ĐƠN ĐIỆU**. Tab `TabOrders.tsx` hiện chỉ render một bảng tĩnh các dòng đơn hàng, chưa có tổng hợp chỉ số kinh doanh. | Xây dựng **KPI Khối Bán Hàng & Xuất Hàng 360°**: Tổng số lượng đặt lũy kế, Tồn đọng chưa giao (Backlog Qty = `Order Qty - Shipped Qty`), Doanh thu ước tính, Tần suất đặt hàng theo biểu đồ timeline. |
| **`work_orders`** / **`jobs`** / **`job_steps`** / **`work_logs`** | Mô hình sản xuất 4 cấp theo ADR-002: Lệnh sản xuất gốc (`work_orders`) $\rightarrow$ Jobs bộ phận (`jobs`) $\rightarrow$ Công đoạn gia công (`job_steps`) $\rightarrow$ Nhật ký giờ công thực tế (`work_logs`). | ⚠️ **HIỂN THỊ PHẲNG, THIẾU LIÊN KẾT LỆNH SẢN XUẤT**. Tab `TabJobs.tsx` hiện hiển thị các Job rời rạc, chưa gom nhóm theo Lệnh sản xuất (`work_orders`) và chưa so sánh được Giờ kế hoạch vs Giờ thực tế. | Xây dựng **Dashboard Lệnh Sản Xuất & Tiến Độ Gia Công 4 Cấp**: Theo dõi từng Lệnh SX (Chế tạo mới / Sửa chữa / Ép thử), đo lường tiến độ % hoàn thành công đoạn, và tổng giờ công thực tế (`hours_spent`). |

---

## 3. ĐỀ XUẤT CẤU TRÚC TAB "PRODUCT 360° VIEW" (DỰA TRÊN DỮ LIỆU THỰC TẾ)

Không cần tạo thêm bảng DB mới, AN đề xuất chuẩn hóa lại **6 Tabs của `/product-center/[id]`** thành một **Trung Tâm Điều Hành Sản Phẩm 360° (Product 360° Command Center)**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PRODUCT 360° COMMAND HEADER (flexShrink: 0)                                                      │
│ 🏷️ [Mã SP: ADY-071]  [Tên: Khay Linh Kiện IC]  [Status: ACTIVE]  [Lifecycle: MASS_PRODUCTION]   │
│ 📊 KPI Bar: ⚙️ Bộ Khuôn SET: 8/8 ĐỦ | 🧪 試作: ĐẠT | 📦 Đơn Hàng: 120,000 pcs | ⏱️ Giờ Công: 45h  │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB NAVIGATION (6 Tabs đồng bộ):                                                                │
│ [1. 360° 概要]  [2. 承認・試作]  [3. 設計・SET設備]  [4. 製造・作業ログ]  [5. 受注・出荷]  [6. 材料・関連]   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 🗺️ BẢNG MAPPING CHI TIẾT TỪNG TAB VỚI NGUỒN DỮ LIỆU DATABASE THỰC TẾ:

| Tab | Tên Tab (Đa ngữ JA / VI) | Bảng Nguồn Database (SSOT) | Nội Dung Trọng Tâm & Điểm Nâng Cấp |
|---|---|---|---|
| **Tab 1** | **360° 概要 (Product 360° Overview)** | `products`<br>`design_revisions`<br>`equipment`<br>`orders`<br>`plastic_receipt_roll` | **Trung tâm tổng quan toàn diện:**<br>• Thông số kỹ thuật thiết kế chuẩn (Paper-style specs).<br>• Tóm tắt độ sẵn sàng của bộ thiết bị SET (Khuôn, Dao, Gá).<br>• Thẻ tồn kho cuộn nhựa phù hợp đang có trong kho.<br>• Tóm tắt tình trạng đơn hàng & đợt giao hàng gần nhất. |
| **Tab 2** | **承認・試作・進捗 (Approvals & Lifecycle)** | `product_lifecycle_logs`<br>`design_approval_logs`<br>`sample_requests`<br>`products` | **Đã hoàn thiện 100% ở Phase R2:**<br>• Thanh Stepper 6 chặng vòng đời trực quan.<br>• Lịch sử các vòng duyệt bản vẽ CAD (Layout / Sample / Mass).<br>• Yêu cầu làm mẫu thử Pocket/Khay & Kết quả OK/NG.<br>• Audit trail bất biến từ Atomic RPC + Session Guard. |
| **Tab 3** | **設計・SET設備 (Designs & SET Tooling)** | `design_revisions`<br>`equipment`<br>`equipment_assignments`<br>`cav_types`<br>`rack_locations` | **Kiến trúc Thiết bị Hợp nhất (ADR-001):**<br>• Cây phả hệ phiên bản CAD (Revision Tree) với thông số Cutline/R/C.<br>• **Ma trận Bộ Thiết Bị SET gá lắp (SET Tooling Matrix)**: Thể hiện rõ 8 loại thiết bị, phân biệt món dùng riêng (`SET_MEMBER`) và món dùng chung mượn từ khuôn khác (`SHARED`).<br>• Vị trí lưu kho kệ chính xác của từng thiết bị. |
| **Tab 4** | **製造・作業ログ (Manufacturing & Worklogs)** | `work_orders`<br>`jobs`<br>`job_steps`<br>`work_logs`<br>`employees` | **Dashboard Lệnh Sản Xuất & Nhật Ký 4 Cấp (ADR-002):**<br>• Gom nhóm theo Lệnh sản xuất gốc (`work_orders`).<br>• Chi tiết từng Job chế tạo/sửa chữa & các bước công đoạn (`job_steps`).<br>• Bảng phân tích Giờ công kế hoạch (`estimated_hours`) vs Giờ công thực tế từ Nhật ký (`work_logs.hours_spent`). |
| **Tab 5** | **受注・出荷 (Orders & Shipments)** | `orders`<br>`order_lines`<br>`shipments`<br>`delivery_sites` | **Quản lý Đơn hàng & Tiến độ Giao hàng:**<br>• 4 thẻ KPI: Tổng đặt lũy kế, Đã xuất, Tồn đọng (Backlog), Đơn hàng đang mở.<br>• Danh sách đơn hàng chi tiết kèm trạng thái giao hàng.<br>• Nút chuyển hướng 1-click tạo đơn hàng mới với prefilled `product_id`. |
| **Tab 6** | **材料・関連情報 (Materials & Related)** | `companies`<br>`plastic_master`<br>`plastic_receipt_roll`<br>`products.customer_product_specs` | **Vật liệu & Thông tin Liên quan:**<br>• Chi tiết nhà cung cấp nhựa & định mức tiêu hao cuộn nhựa.<br>• Thông tin khách hàng & End-User (liên hệ, địa chỉ giao hàng).<br>• Quy cách đóng gói thùng carton (`box_spec`), quy cách xếp chồng. |

---

## 4. KẾT LUẬN & ĐỀ XUẤT BƯỚC TIẾP THEO

- Toàn bộ 6 Tabs đề xuất trên **đều sử dụng 100% các bảng dữ liệu thực tế sẵn có trong database**, hoàn toàn không phát sinh thêm bất kỳ bảng mới nào.
- Đáp ứng chuẩn xác các quy tắc thiết kế: **ADR-001** (Unified Equipment & SET Assignments), **ADR-002** (Luồng 4 cấp Work Orders), **RULE-DATA-01** (Không fallback dữ liệu kỹ thuật), và **RULE-DATA-02** (Schema Compliance).

Kính chuyển Trưởng dự án PE review và phê duyệt cấu trúc khảo sát trên để ra **Chỉ Thị #009** triển khai mã nguồn UI cho Phase R3!
