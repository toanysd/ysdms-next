# 📐 M02 — Thẩm Định Kỹ Thuật, Product Center & Thiết Kế CAD (`M02_tech_review_design/business.md`)

## 1. Bản Chất Nghiệp Vụ Thực Tế (Nguồn: `toanysdmail` — 361 Threads / 2,599 Emails)
- **Nguyên tắc cốt lõi:** Kinh doanh **không báo giá ngay** khi nhận bản vẽ khách hàng mà phải qua bước Thẩm định kỹ thuật của bộ phận Thiết kế (`quan@ysd-pack.co.jp`, `toan@ysd-pack.co.jp` — `01_COMPREHENSIVE_BUSINESS_PROCESS_PROFILE.md:73-106`).
- **Nội dung quyết định kỹ thuật (`technical_reviews` & `design_revisions`):**
  1. Phương án khuôn (`mold_decision_type`): Dùng lại (`reuse`) | Cải tạo (`modify`) | Làm lại (`remake`) | Làm mới (`new`).
  2. Kích thước đường cắt (`cutline_length x cutline_width`), chiều cao khay, bo góc `corner_r`, vát cạnh `chamfer_c`, góc thoát khuôn, kiểu xếp chồng (`stacking_type`).
  3. Chọn khổ khuôn chuẩn (`cav_types`), số lòng khuôn (`cavity_count` / `取数`), máy định hình tương thích (`machines`), phương pháp cắt (`CUTTER_INLINE` / `CUTTER_SEPARATE`), yêu cầu Plug (`plug_type`).
- **Quy tắc đặt mã bản vẽ (`design_revisions`):** `{product_code}{P|M}({designer_initial})R{version}` (VD: `STT-002P(Q)R2` cho bản vẽ SP `P`, `M` cho bản vẽ khuôn).
- **Sản phẩm SET (`セット取り金型`):** 1 khuôn dập đồng thời Khay A + Khay B gộp chung 1 mã YSD (`STT-002AB`), tên riêng phía khách lưu tại `set_component_names JSONB`.

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Product Center:** `/product-center` & `/product-center/[id]` (`TabOverview.tsx`, `TabDesignsEquipment.tsx` — hiển thị thiết bị liên kết qua `equipment_assignments` gồm cả `SET_MEMBER` và `SHARED`).
- **Thiết kế CAD:** `/engineering/designs`, `/engineering/designs/[moldMasterId]`, `/engineering/designs/revisions/[id]`.
- **Redirect từ route cũ (`WO-ROUTE-CLEANUP`):** `/master/products*` -> `/product-center*`; `/engineering` -> `/engineering/designs`.

## 3. Trạng Thái Hiện Tại & Bằng Chứng Nghiệm Thu
- **Trạng thái:** **Hoàn thành & Đã kiểm thử thực tế (`CLOSED`)**.
- **Commits:** `c6f20b98` (`WO-PIPE-FIX`: thay UUID input bằng `AsyncSearchableSelect` trong `TechnicalReviewForm.tsx`, sửa hiển thị header & thêm `'APPROVED'` trong `/engineering/designs/[moldMasterId]`), `c2d00dc9` (`WO-MOLD-UNIFY` Commit 2: chuyển `TabDesignsEquipment.tsx` sang `equipment_assignments` read-only).

## 4. Hạng Mục Còn Thiếu (`Backlog`)
- Đồng bộ `+88` `design_revisions` mới (`+54` `products`) và đối chiếu `71` dòng trùng `design_code` từ Access trong `WO-MOLD-SYNC-WAVE1`.
