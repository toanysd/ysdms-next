# YSDMS NextGen — AI Agent & Developer Convention Guide

> **Mọi AI agent (Copilot, PE, Claude…) và developer BẮT BUỘC đọc file này trước khi chỉnh sửa codebase.**
> Đây là nguồn sự thật duy nhất (Single Source of Truth) về quy tắc tổ chức code, routing, naming và UI.

---

## 1. ROUTING RULES

Tất cả route có sidebar PHẢI nằm cùng cấp với `/dashboard`, `/orders`, `/equipment`…
Hiện tại layout Sidebar được inject toàn bộ ở `src/app/layout.tsx` — không dùng route group.

```
src/app/
  layout.tsx            ← Root layout: Sidebar + Topbar wrapper
  dashboard/page.tsx
  cases/
    page.tsx            ← List view (Server hoặc Client Component)
    new/page.tsx        ← Form tạo mới
    [id]/
      page.tsx          ← Detail view
      _components/      ← Client components riêng của page này
  orders/
    page.tsx
    [id]/
      page.tsx
      _components/
  equipment/
    ...
```

**Không được đặt route bên ngoài `src/app/` hoặc tạo layout group `(main)` nếu root layout đã handle sidebar.**

---

## 2. PAGE ANATOMY (Giải phẫu trang chuẩn)

Mỗi trang bắt buộc có 3 lớp theo thứ tự từ trên xuống:

```
┌──────────────────────────────────────────────────────────┐
│ PageHeader (flexShrink: 0)                               │
│  ← Icon (20px accent) + Title JA/VI + Action Buttons    │
├──────────────────────────────────────────────────────────┤
│ FilterBar / TabBar (flexShrink: 0)                       │
│  ← Tabs + Search input + Dropdown filters + Clear       │
├──────────────────────────────────────────────────────────┤
│ Content Area (flex: 1, overflow: auto)                   │
│  ← card-flat chứa data-table hoặc form-section          │
└──────────────────────────────────────────────────────────┘
```

Root wrapper: `display: flex; flex-direction: column; height: 100%; gap: 12px`

---

## 3. DETAIL PAGE PATTERN (Trang chi tiết record)

```
┌──────────────────────────────────────────────────────────┐
│ BackBar: ← 戻る  ↑ 一覧  [CaseCode]  [StatusBadge]      │
├──────────────────────────────────────────────────────────┤
│ Tab Navigation (.tab-nav)                                │
│  概要 | 技術 | 販売 | 製造 | 書類                        │
├──────────────────────────────────────────────────────────┤
│ Tab Content (flex: 1, overflow: auto)                    │
│  form-section blocks                                     │
└──────────────────────────────────────────────────────────┘
```

Detail page dùng layout đơn giản (không dùng `.detail-layout` left/right panel) cho các entity có nhiều tab.
Left/Right panel chỉ dùng cho màn hình master data (khuôn, máy móc…) không có nhiều tab.

---

## 4. FILE NAMING CONVENTION

| File | Mục đích | Loại Component |
|------|----------|----------------|
| `page.tsx` | Route entry point, fetch data | Server Component (ưu tiên) hoặc Client |
| `_components/XxxTable.tsx` | Bảng dữ liệu | Client Component |
| `_components/XxxForm.tsx` | Form nhập liệu | Client Component |
| `_components/XxxHeader.tsx` | Header phức tạp của trang | Client Component |
| `_components/XxxTabs.tsx` | Tab navigation logic | Client Component |
| `_components/XxxTab.tsx` | Nội dung từng tab | Client Component |
| `actions.ts` | Server Actions (insert/update/delete) | Server |
| `types.ts` | TypeScript types/interfaces của module | - |

Prefix `_` cho thư mục `_components` — Next.js sẽ không treat chúng là route.

---

## 5. COMPONENT RULES

### Server Component
- `import { createClient } from '@/lib/supabase/server'`
- Không có `'use client'` directive
- Dùng `async/await` trực tiếp
- Fetch data rồi pass xuống Client Components

### Client Component
- Bắt buộc có `'use client'` ở dòng đầu
- `import { createClient } from '@/lib/supabase/client'`
- Dùng `useState`, `useEffect`, `useCallback`
- Debounce search input: `setTimeout 400ms`

### Đa Ngôn Ngữ (i18n) với next-intl
Sử dụng thư viện `next-intl` thay vì hardcode hiển thị song ngữ:
```tsx
import { useTranslations } from 'next-intl';

export default function ExampleComponent() {
  const t = useTranslations('Namespace');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <label className="form-label">{t('customerName')}</label>
      <th>{t('orderCode')}</th>
    </div>
  );
}
```

---

## 6. CSS / DESIGN SYSTEM RULES

### 👁️ Quy tắc Font size & Tương phản (BẮT BUỘC để tránh mỏi mắt)
- **Màu chữ chính (`--text-primary`):** Sắc nét `#0F172A` (Slate 900) — KHÔNG dùng màu xám nhạt mờ.
- **Giá trị dữ liệu (Data Values):** BẮT BUỘC cỡ 13px - 14px Bold (dùng `fontFamily: monospace` cho thông số kỹ thuật, số lượng, kích thước). KHÔNG dùng cỡ chữ 10px-11px cho dữ liệu chính.
- **Nhãn dữ liệu (Labels):** Cỡ 11px - 12px Semi-bold (màu `--text-muted` `#475569`).
- **Visual Anchors (Nền phân vùng):** Dùng các biến màu nhạt `--tint-teal-bg`, `--tint-blue-bg`, `--tint-orange-bg`, `--tint-purple-bg` cho header các khối card để người dùng phân biệt khu vực dữ liệu ngay lập tức.
- **Dữ liệu nổi bật (Pill Badges):** Kích thước khay, loại nhựa, mã khuôn phải được bọc trong thẻ Pill có nền màu nhạt nổi bật.

### ✅ Được phép dùng
- CSS variables: `var(--accent)`, `var(--bg-surface)`, `var(--text-primary)`, `--tint-teal-bg`…
- CSS classes từ `globals.css`: `card-flat`, `badge`, `btn-primary`, `btn-secondary`, `form-input`, `form-select`, `form-section`, `data-table`, `tab-nav`, `tab-item`, `kpi-card`…
- Tailwind utilities cho layout: `flex`, `grid`, `hidden`, `md:flex`, `shrink-0`, `overflow-hidden`…
- Inline style cho dynamic values: `style={{ color: section.color }}`

### ❌ Tuyệt đối không dùng
- Tailwind color classes: `bg-blue-500`, `text-red-600`, `border-green-400`…
- Hardcode màu trong style: `style={{ color: '#3B82F6' }}`  
- Hardcode font-size tùy tiện: `style={{ fontSize: 17 }}`
- Tạo class CSS mới trong file `.module.css` riêng (dùng globals.css thay thế)

### Status Badge pattern
```tsx
const STATUS_CONFIG = {
  completed: { labelJA: '完了', badgeClass: 'badge badge--success' },
  warning:   { labelJA: '警告', badgeClass: 'badge badge--warning' },
  error:     { labelJA: 'エラー', badgeClass: 'badge badge--error' },
  info:      { labelJA: '情報', badgeClass: 'badge badge--info' },
  neutral:   { labelJA: '通常', badgeClass: 'badge badge--neutral' },
}
```

---

## 7. SUPABASE QUERY RULES

```typescript
// ✅ Correct: select với count
const { data, error, count } = await supabase
  .from('table_name')
  .select('col1, col2, related_table(col1, col2)', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(from, from + PAGE_SIZE - 1)

// ✅ Correct: FK alias
.select('sales_owner:employees!business_cases_sales_owner_id_fkey(full_name)')

// ❌ Wrong: select * (quá nhiều data)
.select('*')
```

**Pagination**: `PAGE_SIZE = 50` mặc định. Dùng component `<Pagination />` từ `@/components/ui/Pagination`.

---

## 8. SIDEBAR REGISTRATION

Khi tạo route mới, PHẢI thêm vào `src/components/layout/Sidebar.tsx`:
1. Import icon từ `lucide-react` (nếu chưa có)
2. Thêm vào `NAV_SECTIONS` section phù hợp:

```tsx
// Section d1 - Văn phòng
{ href: '/cases', icon: Briefcase, labelJA: '事案管理', labelVI: 'Quản lý Sự việc' },
```

---

## 9. OPEN QUESTIONS (Chờ quyết định từ Anh Thoan)

| # | Câu hỏi | Tác động |
|---|---------|----------|
| Q1 | Technical Review hiển thị dạng Tab riêng hay Timeline cuộn? | Layout `/cases/[id]` |
| Q2 | Nhân viên KD có được edit Case khi status = `ordered` không? | Permission logic |

---

## 10. BUSINESS MODULES STATUS

| Module | Route | Status | Priority |
|--------|-------|--------|----------|
| Business Cases | `/cases` | ✅ Built | P0 |
| Báo giá PDF | `/orders/quotations` | 🔨 In Progress | P0 |
| 棚卸 Kiểm kê khuôn | `/equipment/lifecycle` | ✅ Exists | P1 |
| 借用書 Giấy mượn | `/cases?type=loan` | ⬜ Planned | P1 |
| 納品書 Phiếu giao | `/orders/shipments` | ⬜ Planned | P1 |
| Nippo 日報 | `/worklog` | ✅ Exists | P2 |

---

## 🌍 QUY TẮC ĐA NGÔN NGỮ & I18N (BẮT BUỘC)

Hệ thống sử dụng `next-intl` để xử lý đa ngôn ngữ (Tiếng Nhật / Tiếng Việt) động. Bạn **TUYỆT ĐỐI KHÔNG ĐƯỢC** sử dụng kiểu song ngữ tĩnh (hiển thị đồng thời cả 2 ngôn ngữ).

1. **Quy trình i18n:**
   - Phải khai báo keys vào `messages/ja.json` và `messages/vi.json` **TRƯỚC KHI** hoặc **TRONG KHI** viết component UI.
   - Không được copy mã JSX (ví dụ `{count}`) hoặc code logic vào file JSON.

2. **Không Hardcode UI:**
   - Tuyệt đối không sử dụng các class như `className="ja"`, `className="vi"`, `className="label-ja"`.
   - Không chèn trực tiếp các đoạn text song ngữ dạng `Tiếng Nhật / Tiếng Việt`.
   - Bắt buộc sử dụng `const t = useTranslations('Namespace')` và gọi `t('key')`. Nếu cần xử lý linh hoạt, sử dụng `useLocale()` để kiểm tra locale là `ja` hay `vi`.

3. **Kiểm tra tự động:**
   - Sau khi thay đổi code UI hoặc file dịch, bạn **PHẢI CHẠY** lệnh sau để kiểm tra xem có thiếu key không:
     `node scripts/check_translations.mjs`
   - Báo cáo lỗi sẽ hiện ra nếu thiếu key. Bạn phải sửa trước khi tiếp tục.
   - Để tìm các chỗ còn sót mã hardcode song ngữ, chạy:
     `node scripts/find_hardcoded_bilingual.mjs`
