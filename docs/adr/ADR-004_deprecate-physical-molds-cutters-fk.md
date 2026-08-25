# ADR-004: Kế hoạch Migration dứt điểm 25 FK Constraints khỏi bảng physical_molds và cutters

- **Ngày:** 2026-08-25
- **Trạng thái:** APPROVED
- **Người quyết định:** Anh Thoan (Product Owner) / PE

## Bối cảnh

Tại [ADR-001](./ADR-001_unified-equipment-table.md), hệ thống đã thống nhất tạo bảng equipment làm Single Source of Truth (SSOT) cho mọi thiết bị, đồng thời đánh dấu physical_molds và cutters là DEPRECATED.
Tuy nhiên, qua đợt Audit Phase D (25/08/2026), phát hiện hệ thống vẫn còn **25 Foreign Key (FK) constraints** đang trỏ trực tiếp vào 2 bảng cũ này (19 FKs trỏ vào physical_molds, 6 FKs trỏ vào cutters). 

Việc FK cũ chưa được migrate gây ra 2 rủi ro lớn:
1. Không thể an toàn loại bỏ (drop) các bảng deprecated.
2. Các query UI join qua FK (ví dụ: production_orders, mold_design_cutters) vẫn bị dính chặt vào cấu trúc cũ, block quá trình refactor UI (Phase D).

## Quyết định

Chấp thuận chiến lược Migration 3 giai đoạn để bóc tách dần các FK constraints và UI phụ thuộc, nhằm loại bỏ hoàn toàn physical_molds và cutters khỏi hệ thống mà không gây downtime hay mất mát dữ liệu lịch sử.

### Giai đoạn 1: Migrate các FK an toàn (Low/Medium Risk)
Đây là các bảng lưu log, lịch sử, metadata phụ trợ hoặc ít có query phức tạp trên UI.
- **Action:** Đổi các cột FK hiện tại để tham chiếu (REFERENCES) tới bảng equipment(equipment_id).
- **Danh sách bảng (13 FKs):**
  - **Trỏ về Molds:** luminum_blanks, certificate_items, mold_disposal_logs, mold_inventory_items, mold_location_history, mold_maintenance, mold_measurements, mold_name_history, mold_owner_qr_labels, mold_photos, mold_return_logs.
  - **Trỏ về Cutters:** cutter_orders (2 FKs: cutter_id, euse_cutter_id).

### Giai đoạn 2: Migrate các FK phức tạp (High Risk / Nhiều UI dependent)
Đây là các bảng liên quan đến core production, scheduling, jobs và bảng trung gian (junction tables) có nhiều UI component đang sử dụng Alias Fetch của Supabase.
- **Action:** 
  1. Viết Migration SQL đổi FK constraint sang bảng equipment.
  2. Sửa đồng bộ toàn bộ Code UI/Server Actions đang dùng Alias cũ.
  > ⚠️ Điều kiện tiên quyết: equipment table phải có đủ data mirror từ physical_molds và cutters trước khi đổi FK — verify bằng COUNT(*) comparison.
- **Danh sách bảng (12 FKs):**
  - **Trỏ về Molds (8):** jobs.physical_mold_id, production_orders.physical_mold_id, production_orders.bom_reference_mold_id, production_instructions.physical_mold_id, production_lots.physical_mold_id, production_schedules.mold_id, mold_work_orders.physical_mold_id, 	echnical_reviews.mold_id.
  - **Trỏ về Cutters (4):** mold_design_cutters.cutter_id, mold_work_orders.cutter_id, production_orders.cutter_id, 	echnical_reviews.cutting_die_id.

### Giai đoạn 3: Data Archiving & Drop Tables
- **Action:**
  1. Verify data giữa bảng cũ và equipment để đảm bảo SSOT equipment đã chứa 100% dữ liệu lịch sử.
  2. Backup/Archive data của physical_molds và cutters vào file lưu trữ nội bộ (nếu cần).
  3. Thực thi DROP TABLE physical_molds CASCADE; và DROP TABLE cutters CASCADE;.

## Hệ quả

- **Giai đoạn 1:** Ít rủi ro, script migration có thể chạy trực tiếp trên production không ảnh hưởng tới workflow sản xuất chính.
- **Giai đoạn 2:** Yêu cầu lock code UI. Script DB migration và Code UI update phải được deploy cùng lúc để tránh sập chức năng trên giao diện (đặc biệt là bảng Lịch Sản Xuất và Chi Tiết Khuôn/Dao).
- **Giai đoạn 3:** Mã nguồn sạch hoàn toàn khỏi Technical Debt từ Access cũ. Bảng equipment chính thức là thực thể quản lý duy nhất.

## Tham chiếu
- Audit Report 25/08/2026: Chi tiết 25 FK Constraints tồn đọng.
- Bối cảnh trước đó: ADR-001, ADR-002.
- D-Fix-1 (commit aa5764d, 25/08/2026): 2 UI files đã được fix trực tiếp query equipment, không qua FK alias.
- Phase1_MoldCutter_Migration_Plan.md: Outdated, chỉ tham khảo yêu cầu nghiệp vụ gốc từ Access.
