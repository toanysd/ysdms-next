# Walkthrough — Migration 075 & Product UI Update

## Tóm tắt

Đã hoàn thành migration 075 (thêm 12 cột mới) và cập nhật UI chi tiết sản phẩm để hỗ trợ:
- **Sản phẩm SET** (A/B sản xuất đồng thời)
- **Thông số xếp chồng** (loại, số tầng, chiều cao)
- **Kích thước ngoài khay** (dài × rộng)
- **Vật liệu nhựa chính** (mã + thông số)
- **Thông số SP khách hàng** (JSONB linh hoạt)
- **Vật liệu thay thế** cho thiết kế (alt_plastic_type/code)

## Các thay đổi

### 1. Database Migration
- **File**: [20260710190000_product_specs_and_sets.sql](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/supabase/migrations/20260710190000_product_specs_and_sets.sql)
- 10 cột mới trong `products` + 2 cột mới trong `design_revisions`
- Tất cả đều `ADD COLUMN IF NOT EXISTS` (idempotent)
- ✅ Đã áp dụng thành công qua pg client

### 2. TypeScript Types
- **File**: [database.types.ts](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/types/database.types.ts)
- Cập nhật Row, Insert, Update cho cả `products` và `design_revisions`

### 3. Product Detail Page
- **File**: [page.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/master/products/%5Bid%5D/page.tsx)
  - `ProductDetailData` type: +10 trường mới
  - `handleSave`: +10 trường mới trong payload

### 4. Product Overview Tab
- **File**: [OverviewTab.tsx](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/master/products/%5Bid%5D/tabs/OverviewTab.tsx)
  - **Read mode**: 4 card mới (SET info, Stacking/Dimensions, Primary Material, Customer Specs)
  - **Edit mode**: 3 section mới (SET & Stacking 6 fields, Material 2 fields, được tổ chức theo form-grid)
  - Cards chỉ hiển thị khi có dữ liệu (conditional rendering)

### 5. Schema Reference
- **File**: [SCHEMA_REFERENCE.md](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/SCHEMA_REFERENCE.md)
- Cập nhật đầy đủ cho cả `products` và `design_revisions`

## Kiểm tra

| Kiểm tra | Kết quả |
|----------|---------|
| `npx tsc --noEmit` | ✅ 0 errors |
| Migration apply | ✅ All 12 columns verified |
| Column verification | ✅ All columns respond to Supabase queries |

## Bước tiếp theo

Sẵn sàng để bắt đầu **nhập dữ liệu kiểm thử STT-002AB** qua UI:
1. Mở trang sản phẩm → Tạo sản phẩm mới hoặc chỉnh sửa
2. Nhập thông tin SET, stacking, dimensions, material
3. Kiểm tra hiển thị read-only
4. Kiểm tra lưu và load lại
