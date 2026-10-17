# 🗂️ YSDMS NextGen — Chỉ Mục Hồ Sơ Dự Án Theo Module (`docs/dossier/`)

> **SSOT Index (`WO-DOC-MODULAR`)** — Cập nhật: `2026-10-17 JST` (Post-Wave 3)
> **Quy tắc Token Economy:** Khi làm việc ở Module nào, chỉ đọc `business.md` + `schema.md` trong thư mục của Module đó (`<= 120` dòng, `<= 5 KB`/file). Không đọc toàn bộ `ysdms-nextgen_MASTER.md` hay `SCHEMA_REFERENCE.md`.

## 1. Bản Đồ 12 Module Hệ Thống & Trạng Thái Hiện Hành

| Mã | Thư mục Module | Phạm vi Nghiệp vụ & Route Chính | Bảng SSOT Chính (Row Count) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **00** | `00_core/` | Chỉ mục gốc & Bàn giao phiên (`00_ACTIVE_HANDOFF.md`) | `pe_an_messages`, `pe_evidence_items` | ✅ Active |
| **M01** | `M01_cases/` | Sự việc khách hàng (`/cases`, `/cases/[id]`) | `business_cases` (0) | ✅ E2E Verified |
| **M02** | `M02_tech_review_design/` | Thẩm định KT, Product Center & CAD (`/product-center`, `/engineering/designs`) | `technical_reviews` (0), `products` (8,543), `design_revisions` (4,781) | ✅ Wave 1 Synced |
| **M03** | `M03_quotations_pricing/` | Báo giá & Engine Giá 3 trụ cột (`/orders/quotations`) | `quotations` (0), `quotation_lines` (0) | ✅ E2E Verified |
| **M04** | `M04_orders/` | Đơn hàng & Đối soát dòng chi tiết (`/orders`) | `orders` (2,396), `order_lines` (6,279) | ✅ Verified |
| **M05** | `M05_equipment_set/` | Thiết bị hợp nhất, Khuôn, Dao cắt, Phôi nhôm & Bộ SET (`/equipment/*`) | `equipment` (6,525), `equipment_assignments` (2,970) | ✅ Wave 1/2 Synced |
| **M06** | `M06_mold_jobs/` | Gia công chế tạo khuôn, Lịch Gantt & Work Orders (`/equipment/jobs`, `/schedule`) | `work_orders` (1,230), `jobs` (1,232), `job_steps` (2,512) | ✅ Wave 2 Synced |
| **M07** | `M07_mold_custody/` | Lưu giữ, Mượn trả, Kiểm kê, Phí lưu kho, Teflon & Bảo trì (`/equipment/loans`, `/lifecycle`) | `equipment_history` (1,896), `equipment_ship_logs` (356), `mold_maintenance` (190), `mold_name_history` (35), `equipment_status_logs` (352) | ✅ Wave 3 Synced |
| **M08** | `M08_forming_subcontract/` | Định hình, Chỉ thị SX, Nhật ký & Thầu phụ (`/production*`, `/worklogs`) | `work_logs` (7,316), `production_instructions` (0) | ✅ Wave 2 Synced |
| **M09** | `M09_quality_sample_gate/` | Chất lượng KCS & Cổng duyệt mẫu thử (`/quality/*`) | `sample_requests` (0), `inspections` (0), `defect_reports` (0) | ⚪ Chưa liên thông |
| **M10** | `M10_shipments_billing/` | Giao hàng, Kho Cuộn Nhựa/Khay & Hóa đơn (`/shipments`, `/plastics`, `/invoices`) | `plastic_receipt_roll` (321), `material_stock` (180), `shipments` (0) | 🟡 Một phần |
| **M11** | `M11_companies_master/` | Chủ thể, Máy móc, Giá kệ & Nhân sự (`/companies`, `/master/*`) | `companies` (2,215), `employees` (25), `racks` (90), `rack_layers` (400) | ✅ Wave 1 Synced |
| **M12** | `M12_dashboard_admin/` | Dashboard điều hành, Báo cáo, Auth & Bridge (`/dashboard`, `/reports/*`, `/login`) | `profiles` (3), `pe_evidence_items` (35+) | ✅ Verified |

## 2. Phân Loại Bảng Legacy (Đã Xác Minh Qua `information_schema.tables`)
1. **KHÔNG TỒN TẠI (`NOT_FOUND` — cấm truy vấn):** `mold_masters`, `physical_molds`, `cutters`, `order_items`, `product_master`, `v_mold_health`, `v_maintenance_overdue`, `mold_maintenance_log`.
2. **TỒN TẠI nhưng CẤM DÙNG trong code mới (`0` dòng):** `auxiliary_equipments`, `mold_design_cutters`, `mold_work_orders`.

## 3. Quy Tắc Cập Nhật Hồ Sơ (`Governance`)
- **Ai ghi:** AN chỉ cập nhật `business.md` / `schema.md` của đúng module thuộc Work Order đang thực thi.
- **Khi nào:** Ở Pha 3 (Nghiệm thu Work Order) hoặc khi PE duyệt đặc tả/schema mới.
- **Giới hạn:** Mỗi file bắt buộc `<= 120` dòng và `<= 5 KB`.
