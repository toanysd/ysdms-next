# Xây dựng lại trang In — Kế hoạch v2 (Đã kiểm chứng thực tế)

## ⚠️ Phát hiện quan trọng từ kiểm tra database.types.ts

Sau khi đối chiếu `SCHEMA_REFERENCE.md` với file `src/types/database.types.ts` (sinh từ DB thật), tôi phát hiện:

> [!WARNING]
> **Các cột sau KHÔNG tồn tại trong `order_lines` thực tế:**
> - `packing_style` ❌ — SCHEMA_REFERENCE ghi có, nhưng DB thật không có
> - `shipping_notes` ❌ — Tương tự
> - `ship_date` ❌ — Nằm trong `production_lots`, KHÔNG phải `order_lines`
> - `design_revision_id` ❌ — KHÔNG có FK đến design_revisions
>
> **Các cột tồn tại thực tế nhưng KHÔNG trong SCHEMA_REFERENCE:**
> - `material_spec_id` → FK đến `product_material_specs` ← **Nguồn vật liệu mới**
> - `notes` (ghi chú riêng dòng)
> - `priority` (mức ưu tiên)

> [!IMPORTANT]
> **Bảng `orders` thực tế KHÔNG có `lot_no`** — `lot_no` nằm trong `production_lots`.

---

## Cấu trúc dữ liệu thực tế cho trang In

### Nguồn dữ liệu cần fetch:

```
1. orders → *
   + companies(company_code, company_name, address, tel)
   + order_lines(
       *,
       products(product_id, product_code, product_name, product_name_internal, pocket_count, pieces_per_box, box_spec),
       product_material_specs(material_type, material_grade, thickness_mm, sheet_width_mm, static_charge, silicone, coating, handling_notes)
     )

2. Riêng: delivery_sites (by site_ids from order_lines)

3. Riêng: design_revisions (by product_ids) 
   → design_code, cutline_length, cutline_width, cavity_count, 
     orientation, design_weight, customer_tray_name, drawing_pdf_path
```

---

## So sánh Excel mẫu vs Web — Mapping dữ liệu

### Khu vực 1: Header

| Phần tử | Excel | Nguồn dữ liệu | Ghi chú |
|---------|-------|----------------|---------|
| Tiêu đề | ✅ | Cố định | `注文書／納入指示書（成形）` |
| 3 Checkbox | `1面取`, `別抜き`, `袋詰め` | `orders.order_type` hoặc cố định | ⚠️ Cần xác nhận |
| Logo YSD | Hình + text | Cố định | `YOSHIDA PACKAGE CO.,LTD.` |
| `○○ 御中` | Tên KH | `companies.company_name` | |
| `伝票/LOT No.` | Mã phiếu | `orders.order_no` (thay cho lot_no không tồn tại) | |
| `発注/手配日` | Ngày | `orders.order_date` | |

### Khu vực 2: Chi tiết sản phẩm

| Phần tử | Excel mẫu | Nguồn dữ liệu |
|---------|-----------|----------------|
| 要求No. | `IP0000153229` | `orders.customer_order_no` |
| P/N | `IRI-001 K-16135T-01-01 2PP` | `products.product_name_internal` + `design_revisions.design_code` + cavity info |
| 品名 | Tên sản phẩm | `products.product_name` |
| 数量 (数) | `6` + đơn vị | `order_lines.quantity` + `order_lines.unit` |
| 荷姿 | Đóng gói | `order_lines.notes` (thay cho packing_style) |
| 納期 | 2 dòng: 出荷日/納品日 | `order_lines.due_date` (chỉ có 1 ngày trong DB thật) |
| 材質 | `PS(B)` | `product_material_specs.material_type` + `material_grade` |
| 厚み | `0.30` | `product_material_specs.thickness_mm` |
| 巾 | `520` | `product_material_specs.sheet_width_mm` |
| 帯電 | `帯電防止シート` | `product_material_specs.static_charge` |
| ｼﾘｺﾝ | Có/Không | `product_material_specs.silicone` |
| 塗布 | Có/Không | `product_material_specs.coating` |

### Khu vực 3: Ghi chú đặc biệt

| Phần tử | Excel | Nguồn dữ liệu |
|---------|-------|----------------|
| Ghi chú đóng gói | `イリソ電子 単独 梱包...` | `order_lines.notes` hoặc `orders.notes` |
| Chỉ thị riêng | `完了後 専用伝票PDメール送付` | `orders.notes` |
| Chỉ thị riêng | `出荷ラベル不要` | `orders.notes` |

### Khu vực 4: Hình ảnh + CUT LINE

| Phần tử | Excel | Nguồn dữ liệu |
|---------|-------|----------------|
| Sketch sản phẩm | Hình vẽ tay | `design_revisions.drawing_pdf_path` (nếu có) hoặc placeholder |
| CUT LINE | `400 × 360` | `design_revisions.cutline_width` × `cutline_length` |
| 包装外方 | Hướng mũi tên | `design_revisions.orientation` |
| 重量 | `0.0 g` | `design_revisions.design_weight` |

### Khu vực 5: Nơi giao hàng & Nguồn yêu cầu

| Phần tử | Excel | Nguồn dữ liệu |
|---------|-------|----------------|
| 納品先 | Tên công ty đầy đủ | `delivery_sites.site_name` |
| Bộ phận + NLH | `相立本部 資材部...` | `delivery_sites.contact_person` |
| Địa chỉ | `〒258-0083 神奈川県...` | `delivery_sites.site_address` |
| TEL | `0465-478-3525` | `delivery_sites.site_tel` |
| 依頼元 | Mã + Tên | `companies.company_code` + `company_name` |
| 内訳詳細 | Stamp box | Cố định (ô trống để đóng dấu) |

### Khu vực 6: Footer ký xác nhận

| Phần tử | Excel | Nguồn |
|---------|-------|-------|
| Dòng nhắc | `各部門の担当者は...` | Cố định |
| Ô ký | `総務 / 成形 / プレス / 総務` | Cố định |

---

## Proposed Changes

### [MODIFY] [print.css](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/%5Bid%5D/print/print.css)
- CSS hoàn chỉnh cho layout A4 giống Excel: font size 11-12px, padding 4px, border rõ ràng
- Styles cho: checkbox area, logo, packing notes, product sketch placeholder, stamp box

### [MODIFY] [page.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/orders/%5Bid%5D/print/page.tsx)
- **Fetch dữ liệu**: Thêm `product_material_specs` (via FK `material_spec_id`), thêm `product_name_internal` từ products
- **Fetch riêng**: `design_revisions` (by product_id) lấy design_code, cutline, cavity, weight, orientation, drawing_pdf_path
- **Layout**: Xây dựng lại 100% theo cấu trúc Excel mẫu gồm 6 khu vực
- **Sửa lỗi**: `各部門 of 担当者` → `各部門の担当者`

### [MODIFY] [route.ts](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/orders/%5Bid%5D/export/route.ts)
- Cập nhật query tương tự để export Excel cũng sử dụng đúng nguồn dữ liệu

---

## Open Questions

> [!IMPORTANT]
> 1. **3 Checkbox (`1面取 / 別抜き / 袋詰め`)**: Giá trị này được lấy từ đâu? Có phải từ `orders.order_type` hay cần thêm cột mới? Hay giữ cố định (tất cả đều unchecked) và nhân viên sẽ đánh dấu tay sau khi in?
>
> 2. **`lot_no` (伝票/LOT No.)**: DB thật không có cột này trong bảng `orders`. Có muốn dùng `orders.order_no` thay thế, hay cần fetch từ `production_lots`?
>
> 3. **Hình ảnh sản phẩm**: Dùng placeholder (ô trống có viền) để nhân viên dán hình thủ công, hay cố gắng hiển thị từ `drawing_pdf_path`?

## Verification Plan

```bash
npx tsc --noEmit
```
So sánh trực quan bản in web với ảnh Excel gốc.
