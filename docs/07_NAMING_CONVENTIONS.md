# 07_NAMING_CONVENTIONS — Quy tắc đặt tên và Coding Standard
# YSDMS | YSD Manufacturing System

**Phiên bản:** 1.0
**Ngày ban hành:** 2026-07-14
**Trạng thái:** ACTIVE

Tài liệu này là "nguồn sự thật" (single source of truth) về quy ước đặt tên cho toàn bộ dự án YSDMS NextGen. Mọi AI Agent và Developer PHẢI đọc và tuân thủ trước khi viết code (DB, Backend, Frontend).

---

## 1. Database Naming Convention (Tầng DB)

| Loại | Quy tắc | Ví dụ | Ngoại lệ |
|---|---|---|---|
| **Primary Key** | `{bảng_số_ít}_id` | `physical_mold_id`, `employee_id` | `order_lines` → `line_id` |
| **Foreign Key** | Giữ nguyên tên PK gốc | `line_id` (tham chiếu order_lines) | KHÔNG TỰ CHẾ (`order_line_id` ❌) |
| **Boolean** | Prefix `is_` hoặc `approved_` | `is_free_sample`, `approved_mold_shop` | |
| **Timestamp** | Suffix `_at` | `created_at`, `updated_at` | `req_mold_date` (cho Date only) |
| **Status Enum** | Suffix `_status` | `mwo_status`, `line_status` | |

### Bảng tra cứu Primary Key các bảng Core:
- `orders` → `order_id`
- `order_lines` → `line_id`
- `products` → `product_id`
- `companies` → `company_id`
- `employees` → `employee_id` (Bảng User)
- `physical_molds` → `physical_mold_id`
- `mold_work_orders` → `mwo_id`

---

## 2. Migration File Convention (Tầng DB Script)

**Tên file:** `YYYYMMDDHHMMSS_sdXX_mô_tả_ngắn.sql`

**Cấu trúc bắt buộc bên trong mỗi file migration:**
1. Header comment (Migration ID, mô tả, PO approved)
2. DROP/ALTER bảng cũ (nếu có sự thay đổi cấu trúc)
3. CREATE TABLE mới
4. Indexes (Tối thiểu trên FK và status)
5. RLS + Policies
6. Comments cho Table và Columns quan trọng

**Quy tắc BẮT BUỘC trước khi viết Foreign Key (Dành cho AI):**
Luôn chạy câu lệnh sau để kiểm tra chính xác tên PK của bảng đích:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = '{target_table}' AND ordinal_position = 1;
```

---

## 3. TypeScript & Frontend Convention (Tầng Ứng Dụng)

### Kiểu Dữ Liệu (Types)
- **Tên type / interface:** Dùng `PascalCase` theo tên bảng.
```typescript
type MoldWorkOrder = Database['public']['Tables']['mold_work_orders']['Row']
```

### Tên Biến (Variables)
- **Tên biến:** Dùng `camelCase`. Phải ánh xạ đúng tên cột trong DB.
- KHÔNG dùng tên quá chung chung.
```typescript
// ✅ ĐÚNG
const moldWorkOrderId = row.mwo_id;
const lineId = row.line_id;

// ❌ SAI
const id = row.mwo_id; // Quá chung chung, dễ nhầm lẫn
```

### Routing (Next.js App Router)
- **Tên folder route:** Dùng `kebab-case`. Phải tương ứng với chức năng hoặc tên bảng.
```text
/production/mold-orders   → Tương ứng với bảng mold_work_orders
/production/orders        → Tương ứng với bảng production_orders
```

---
> ⚠️ **Lưu ý:** Việc không tuân thủ các quy tắc này (đặc biệt là mục 1) đã gây ra 3 lỗi khóa ngoại liên tiếp trong quá trình phát triển Phase 2. Việc tuân thủ là **BẮT BUỘC**.
