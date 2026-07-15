# 05 — QUY TẮC PHÁT TRIỂN (Development Rules & AI Binding Rules)

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-07-02  
> **Phạm vi:** Áp dụng cho TẤT CẢ AI model và developer

---

## MỤC LỤC

1. [Quy Tắc Schema — KHÔNG NGOẠI LỆ](#1-quy-tắc-schema--không-ngoại-lệ)
2. [Quy Tắc Code](#2-quy-tắc-code)
3. [Quy Tắc UI/UX](#3-quy-tắc-uiux)
4. [Quy Tắc Query](#4-quy-tắc-query)
5. [Quy Tắc Performance](#5-quy-tắc-performance)
6. [Quy Tắc Bảng Dữ Liệu](#6-quy-tắc-bảng-dữ-liệu)
7. [Quy Tắc Điều Hướng](#7-quy-tắc-điều-hướng)
8. [Quy Tắc AI Model](#8-quy-tắc-ai-model)
9. [Quy Tắc Kiểm Tra](#9-quy-tắc-kiểm-tra)

---

## 1. Quy Tắc Schema — KHÔNG NGOẠI LỆ

### 1.1 Đọc Trước Khi Viết

```
TRƯỚC khi viết bất kỳ query/API nào:
1. ĐỌC 02_data_model.md → xác nhận tên bảng, cột, FK
2. ĐỌC 01_business_process.md → hiểu luồng nghiệp vụ
3. KHÔNG đoán tên cột — phải verify từ database.types.ts
```

### 1.2 KHÔNG Tự Ý Thay Đổi

| Hành động | Quy tắc |
|-----------|---------|
| Thêm cột mới | **DỪNG → hỏi user → chờ approval** |
| Sửa cột hiện có | **DỪNG → hỏi user → chờ approval** |
| Xóa cột/bảng | **DỪNG → hỏi user → chờ approval** |
| Tạo migration file | **DỪNG → hỏi user → chờ approval** |
| Đổi tên bảng/cột | **CẤM — trừ khi user yêu cầu rõ ràng** |
| Chạm vào `omni_*` | **CẤM TUYỆT ĐỐI** |

### 1.3 FK Quan Hệ Đã Chốt

```typescript
orders.company_id → companies   ✅  (KHÔNG PHẢI customer_id → customers)
products.company_id → companies ✅  (NOT NULL)
products.product_name            ✅  (KHÔNG PHẢI product_name_ja)
products.product_status          ✅  (KHÔNG PHẢI status)
shipments → orders → companies  ✅  (join 2 cấp)
```

---

## 2. Quy Tắc Code

### 2.1 TypeScript

- **Strict mode:** `"strict": true` trong tsconfig.json
- **Không any:** Sử dụng kiểu cụ thể từ `database.types.ts`
- **Naming convention:**
  - Components: PascalCase (`OrderListPage.tsx`)
  - Functions: camelCase (`fetchOrders()`)
  - Files: kebab-case cho routes (`cutting-dies/`)
  - Database columns: snake_case (`company_id`)

### 2.2 Import Pattern

```typescript
// Supabase client
import { createClient } from '@/lib/supabase/server';  // Server
import { createClient } from '@/lib/supabase/client';  // Client

// Types
import { Database } from '@/types/database.types';

// UI Components
import { Pagination } from '@/components/ui/Pagination';
import { SearchSuggestions } from '@/components/ui/SearchSuggestions';
import { useSearchHistory } from '@/hooks/useSearchHistory';
```

### 2.3 Server Actions

```typescript
'use server';

// Đặt tại: src/app/actions/<domain>.ts
// VD: src/app/actions/mold-job.ts

export async function fetchJobs(params: {...}): Promise<{...}> {
  const supabase = await createClient();
  // ... query
}
```

---

## 3. Quy Tắc UI/UX

### 3.1 Design System — CSS Classes (BẮT BUỘC)

**NGUYÊN TẮC: Không Hardcode, Không Inline Style**

| Element | Class đúng |
|---------|-----------|
| Bảng dữ liệu | `className="data-table"` |
| Input | `className="form-input"` |
| Search Input | `className="form-input form-input-search"` |
| Select | `className="form-input"` |
| Textarea | `className="form-textarea"` |
| Button primary | `className="btn btn-primary"` |
| Button secondary | `className="btn btn-secondary"` |
| Card | `className="card-flat"` hoặc `className="card"` |
| Grid | `className="form-grid-4"` hoặc `className="form-grid-2"` |
| Badge | `className="badge badge--info/success/warning/error/neutral"` |

### 3.2 Font & Color

```css
--accent: teal;                /* Accent color */
font-size: 14px;               /* Base */
input font-size: 13px;         /* Input */
table cell font-size: 13px;    /* Table */
label JA font-size: 12px;      /* Japanese label */
label VI font-size: 10px;      /* Vietnamese label */
```

### 3.3 Inline Style — Cho Phép Khi Nào

| Cho phép | Không cho phép |
|----------|---------------|
| Layout 1-lần (gap, grid cụ thể) | padding, margin đã có class |
| Giá trị dynamic từ state | font-size, color đã có variable |
| Positioning cụ thể | Style đã có CSS class tương ứng |

---

## 4. Quy Tắc Query

### 4.1 Query Mẫu ĐÚNG

```typescript
// Đơn hàng
supabase.from('orders').select('*, companies(company_name, company_code)')

// Sản phẩm
supabase.from('products').select('*, companies(company_name, company_code)')

// Giao hàng
supabase.from('shipments').select('*, orders(order_no, companies(company_name))')

// Khuôn vật lý → full chain
supabase.from('physical_molds').select(`
  *,
  mold_revisions(
    *,
    design_revisions(*),
    mold_masters(*, products(*))
  )
`)

// Filter
.eq('company_id', id)           // ✅ trên orders
.insert({ company_id: '...' })  // ✅ khi tạo order
```

### 4.2 Query SAI — Gây Lỗi 400

```typescript
// ❌ SAI — cột đã đổi tên
products(product_name_ja)        // → Đúng: products(product_name)
products.status                  // → Đúng: products.product_status

// ❌ SAI — cột KHÔNG TỒN TẠI trong products
products.material_id
products.thickness_mm
products.sact_qr_code

// ❌ SAI — bảng ĐÃ BỊ DROP
design_masters, design_projects, mold_designs

// ❌ SAI — FK sai
.eq('customer_id', id)           // → Đúng: .eq('company_id', id)
```

---

## 5. Quy Tắc Performance

### 5.1 Pagination

- **BẮT BUỘC:** Mọi bảng dữ liệu PHẢI dùng `.range(from, to)` + `Pagination` component
- **Page size:** 50 rows/page
- **Component:** `<Pagination>` từ `@/components/ui/Pagination`

### 5.2 Search

- **Server-side:** Dùng `.ilike()`, KHÔNG filter client
- **Debounce:** 300-500ms trước khi gọi API
- **History:** Dùng `useSearchHistory(key)` cho mọi ô tìm kiếm

### 5.3 Queries

- **Select only needed columns:** Tránh `select('*')` khi chỉ cần vài cột
- **Index-aware:** Sử dụng `.eq()` trên các cột có index

---

## 6. Quy Tắc Bảng Dữ Liệu

### 6.1 Cột Chính — Hyperlink (BẮT BUỘC)

```typescript
// ✅ ĐÚNG — cột chính là Link
<Link 
  href={`/equipment/molds/${row.physical_mold_id}`}
  style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', fontSize: 13 }}
>
  {row.system_code}
</Link>

// ❌ SAI — cột chính là text thường
<span>{row.system_code}</span>
```

### 6.2 Sorting (BẮT BUỘC)

- Tất cả bảng PHẢI có sorting trên các cột khả thi
- Click header → Ascending → Descending → Default
- Hiển thị icon: `ArrowUp`, `ArrowDown`, `ArrowUpDown`

### 6.3 Lịch Sử Tìm Kiếm (BẮT BUỘC)

```typescript
const { searchHistory, addToHistory } = useSearchHistory('molds');
// + <SearchSuggestions> khi focus
```

---

## 7. Quy Tắc Điều Hướng

### 7.1 Back/Up Pattern

| Nút | Hành vi | Code |
|-----|---------|------|
| ← 戻る (Back) | `router.back()` — giữ search state | Client component |
| ↑ 一覧 (Up) | Link cố định → trang danh sách cha | `<Link href="...">` |

### 7.2 URL Search Sync

```typescript
// Đọc ?search= từ URL
const searchParams = useSearchParams();
const initialSearch = searchParams.get('search') || '';
const [searchQuery, setSearchQuery] = useState(initialSearch);
```

### 7.3 Trang Nhất Quán

| Loại trang | Kiến trúc |
|------------|-----------|
| Danh sách | Header + Search + Table + Pagination |
| Chi tiết | Back/Up + Header + Tabs |
| Detail Header | Compact: padding 12px 16px, icon 20px, title 18px |

---

## 8. Quy Tắc AI Model

### 8.1 Đọc Tài Liệu

```
TRƯỚC khi bắt đầu phiên:
1. docs/technical/01_business_process.md → Luồng nghiệp vụ
2. docs/technical/02_data_model.md → Schema
3. docs/technical/05_development_rules.md → Quy tắc (file này)
```

### 8.2 Chuyển Model (Claude ↔ Gemini)

```
1. ĐỌC sổ cái: .agents/mempalace/blueprints/ysdms-nextgen_MASTER.md
2. ĐỌC transcript nếu đang giữa task
3. XÁC NHẬN context với user trước khi code
4. KHÔNG tự ý revert code model trước đã sửa đúng
```

### 8.3 KHÔNG Tự Động Git

```
CẤM: git add, git commit, git push
TRỪ KHI: User yêu cầu trực tiếp
```

### 8.4 Sau Mỗi Thay Đổi

```bash
npx tsc --noEmit
# Chỉ báo cáo hoàn thành khi 0 errors
```

---

## 9. Quy Tắc Kiểm Tra

### 9.1 TypeScript

```bash
npx tsc --noEmit  # PHẢI 0 errors
```

### 9.2 Runtime

```bash
npm run dev       # Kiểm tra app chạy không lỗi
```

### 9.3 Database

```bash
# Verify FK constraints
# Verify data integrity
# Verify RPC functions
```

---

*Cập nhật lần cuối: 2026-07-02*
*Phiên bản: 1.0*
