# HƯỚNG DẪN VÀ QUY TẮC HỆ THỐNG DÀNH CHO AI (AI SYSTEM RULES)
*File này cung cấp ngữ cảnh bắt buộc cho bất kỳ AI Agent nào khi làm việc trong môi trường này.*

## KIẾN TRÚC ANTIGRAVITY PORTABLE WORKSPACE (MONOREPO V2.0)

Hệ thống này được thiết lập theo cơ chế đặc biệt: **"Portable USB to Local SSD"** nhằm tối ưu hiệu năng (tránh thắt cổ chai tốc độ I/O của USB) và tránh lỗi Symlink khi di chuyển giữa nhiều máy tính khác nhau.

### 1. Kiến trúc lưu trữ (Storage Architecture)
- **Nguồn dữ liệu gốc (Source of Truth):** Nằm trên USB (ổ G: hoặc tùy máy). Đây là nơi cất giữ code vĩnh viễn.
- **Không gian làm việc cục bộ (Local Workspace):** Được tạo tự động trên ổ cứng nội bộ của máy (VD: `C:\AntiGravity_Workspace` hoặc `D:\AntiGravity_Workspace`).
- **QUY TẮC AI:** Mọi thao tác chỉnh sửa code, viết script, cài thư viện, chạy dev server **PHẢI THỰC HIỆN TRONG LOCAL WORKSPACE (Ổ Cứng)**. AI tuyệt đối không sửa code trực tiếp trên USB để tránh crash.

### 2. Quản lý Dependencies & Cache
- **`node_modules` và `.next`:** Chỉ tồn tại trên Local Workspace. Hai thư mục siêu nặng này tuyệt đối không được copy ngược về USB.
- **Cấu hình Next.js (Dev vs Build):** BẮT BUỘC cấu hình scripts trong `package.json` theo chuẩn sau:
  - `"dev": "next dev --turbo"`: Sử dụng Turbopack khi lập trình để khởi động siêu tốc và tiết kiệm CPU/RAM (không sinh rác `node.exe`). Lỗi Symlink của Turbopack đã được khắc phục nhờ mã nguồn nằm hoàn toàn ở Local SSD.
  - `"build": "next build"`: **TUYỆT ĐỐI KHÔNG dùng `--turbo` khi build**. Turbopack build hiện tại đang bị lỗi mất phương hướng thư mục trong môi trường Monorepo. Phải để Next.js lùi về dùng Webpack ổn định khi đóng gói sản phẩm.

### 3. Quy trình làm việc hàng ngày (Boot & Save)
1. **BOOT (`USB_SYNC_BOOT.bat`):** Chạy từ USB. Tự động liên kết bộ nhớ AI (`.gemini`) và đồng bộ (copy) code của các dự án được chọn sang Local Workspace. Đồng thời, tên các dự án này được ghi dồn vào cuốn sổ tay `.synced_apps.txt`.
2. **SAVE (`USB_SYNC_SAVE.bat`):** Chạy từ USB vào cuối ca làm việc. Đọc cuốn sổ tay `.synced_apps.txt` và dùng `robocopy` để sao chép song phương cập nhật ngược code từ Local Workspace về lại USB. Nó bỏ qua `node_modules` và `.next` để tiết kiệm thời gian.
- **QUY TẮC AI:** Nếu User hỏi về luồng đồng bộ, AI cần hiểu rằng quá trình chọn nhiều app được tích lũy lại (Append Memory), chứ không ghi đè mất app cũ.

### 4. Quy định khi Coding
- **No Hardcoding Drives:** Tuyệt đối không hardcode đường dẫn ổ đĩa như `C:\` hay `G:\` trong mã nguồn. Hãy dùng đường dẫn tương đối (Relative paths) hoặc biến môi trường vì User sẽ thường xuyên di chuyển USB giữa các máy có số lượng ổ đĩa khác nhau.
- **Port Caching:** Khi phát triển, chú ý giải phóng cổng (port) như `3015` vì đôi khi Webpack bị treo do máy cấu hình thấp.
- **Nenkin & Apps:** Cấu trúc dự án theo mô hình Monorepo (tất cả các app nằm trong thư mục `apps/` và chia sẻ `packages/`). Lệnh `pnpm install` phải được chạy ở root (`AntiGravity_Workspace`), không chạy đơn lẻ trong từng folder app để tận dụng workspace.

### 5. Quản lý File Rác & Debug (Cleanup Rules)
- **THƯ MỤC CHỨA FILE TẠM:** Trong quá trình dev, nếu AI cần tạo các file script nháp để test, debug (như `test_api.js`, `check_db.py`, `.rar`, `.log`...) BẮT BUỘC phải tạo và lưu chúng vào thư mục `temp_ai/` nằm ở thư mục gốc của app đó (VD: `apps/nenkin/temp_ai/`).
- **Lý do:** Tuyệt đối không xả rác file test bừa bãi ra thư mục gốc dự án. Thư mục `temp_ai/` này đã được cấu hình trong `USB_SYNC_SAVE.bat` để chặn không cho copy về ổ USB, giúp mã nguồn gốc trên USB luôn sạch sẽ 100%.

### Data Fetching & Performance — LIST PAGES

**[RULE-DATA-1] Pagination bắt buộc cho mọi bảng dữ liệu:**
- KHÔNG BAO GIỜ dùng `.select('*')` không giới hạn cho bảng có tiềm năng &gt; 100 rows.
- LUÔN dùng Supabase `.range(from, to)` + `{ count: 'exact' }`. Default page size = **50 rows**.
- LUÔN dùng component `@/components/ui/Pagination` để render phân trang.
- Pattern chuẩn cho Server Component:
  ```typescript
  const page = Number(searchParams?.page) || 1
  const PAGE_SIZE = 50
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count, error } = await supabase
    .from('table_name')
    .select('col1, col2', { count: 'exact' })
    .range(from, to)
    .order('col1')
  ```

**[RULE-DATA-2] Server-side search — KHÔNG lọc client-side:**
- Search/filter phải chạy trên server qua Supabase `.ilike()` hoặc `.textSearch()`.
- KHÔNG fetch toàn bộ rồi `.filter()` trong JS — sẽ gây lag và tốn RAM.
- Search debounce 300ms trên client, sau đó navigate với `?q=...` để Server Component re-fetch.

**[RULE-DATA-3] UX Filter trên List Pages — "Default Filter + Toggle":**
- Khi một trang có bối cảnh rõ ràng (VD: trang Khách hàng), **mặc định filter theo context** đó.
- Hiển thị bộ lọc đang active bằng Filter Chip/Badge có thể bấm để bỏ/đổi.
- KHÔNG ẩn hoàn toàn bộ lọc — người dùng phải thấy và tự điều chỉnh.
- Ví dụ cho trang `/master/customers`:
  - Default: `company_type.cs.{CUSTOMER}` → chỉ show Khách hàng
  - Chip hiển thị: `[Khách hàng ×]` — bấm × để xem tất cả
  - Không tách URL khác nhau, dùng `?type=CUSTOMER` làm default
- Lý do: Nhân viên kinh doanh luôn cần KH, không cần thấy VENDOR lẫn lộn.
  Nhưng khi cần tìm một công ty VENDOR-CUSTOMER lẫn, họ tự bỏ filter được.

### Data Fetching & Performance — DROPDOWN / SELECT

**[RULE-DATA-4] Smart Async Dropdown — KHÔNG pre-load toàn bộ options:**
- KHÔNG truyền toàn bộ records (VD: 1,710 công ty) vào `options[]` của một `<select>` hay dropdown.
- LUÔN dùng **server-side search khi gõ** cho dropdown có nguồn dữ liệu &gt; 50 records.
- Dùng component `@/components/ui/SearchableSelect` với mode `async` (xem RULE-DATA-5).
- Pattern: Mở dropdown → hiện 10 records đầu (sorted) → người dùng gõ → gọi API → trả về max 20 kết quả.

**[RULE-DATA-5] SearchableSelect — hai chế độ:**

| Chế độ | Khi nào dùng | Cách hoạt động |
|:---|:---|:---|
| `static` | Nguồn &lt; 50 records (VD: danh mục loại khuôn, trạng thái) | Truyền `options[]` đầy đủ, filter client-side OK |
| `async` | Nguồn &gt; 50 records (VD: companies, products, employees) | Truyền `fetchOptions: (query) =&gt; Promise&lt;Option[]&gt;` — gọi API mỗi khi gõ |

- Component `SearchableSelect` hiện tại chỉ hỗ trợ `static`. Khi cần `async`, dùng `AsyncSearchableSelect`.
- `AsyncSearchableSelect` phải: debounce 300ms, show loading spinner, cache kết quả gần nhất.

**[RULE-DATA-6] API Route cho Async Dropdown:**
- Tạo route `/api/search/[entity]?q=...&limit=20` cho các entity lớn.
- Ví dụ: `/api/search/companies?q=JAE&type=CUSTOMER&limit=20`
- Response: `{ data: [{value, label}], total: number }`
- LUÔN có param `limit` (max 20 cho dropdown, max 50 cho list).

---

## UI DESIGN SYSTEM RULES (Bắt buộc cho mọi AI Agent khi xây dựng UI)
> Tham khảo: **Tabler** (MIT), **shadcn/ui** (MIT), **Linear App**, **SAP Fiori Horizon**
> Áp dụng từ 2026-06-17. Xem chi tiết utility classes trong `src/app/globals.css`.

### RULE-UI-1 — Không dùng màu hardcode
- **❌ KHÔNG:** `bg-blue-50`, `bg-purple-50`, `text-blue-800`, `#3B82F6`
- **✅ CÓ:** `var(--bg-surface-2)`, `var(--text-secondary)`, `var(--accent)`, `var(--status-info-bg)`
- Lý do: Dark mode hoạt động tự động, thay brand chỉ sửa 1 chỗ.

### RULE-UI-2 — Form dùng utility classes từ globals.css
- Cấu trúc chuẩn: `.form-section > .form-section-header + .form-section-body > .form-grid-{1|2|3} > .form-field > .form-label + .form-input`
- `form-section-header`: UPPERCASE 10px, text-muted, bg-surface-2 — **KHÔNG màu sắc, KHÔNG emoji**
- Dùng lucide-react icon 14×14 với class `section-icon` trong header
- Input classes: `form-input`, `form-select`, `form-textarea` — đã có focus/readonly/placeholder

### RULE-UI-3 — Màu accent duy nhất = Teal `var(--accent)`
- CHỈ dùng `var(--accent)` cho: link, btn-primary, active state, focus ring, tab active
- Status colors (success/warning/error/info) CHỈ dùng trong badge và callout

### RULE-UI-4 — Multi-select chips: `.type-chip` / `.type-chip--active`
- **❌ KHÔNG:** filled colored pills (`bg-purple-600`, `bg-blue-100`)
- **✅ CÓ:** `.type-chip` (border subtle) + `.type-chip--active` (border+text accent)

### RULE-UI-5 — Trang Detail: `.detail-layout`
- Cấu trúc: `.detail-layout > .detail-panel-left (240px) + .detail-panel-right (flex-1)`
- Tabs: `.tab-nav > .tab-item` + `.tab-item--active`
- **KHÔNG hardcode `bg-white`** — dùng `var(--bg-surface)`
- **Surface hierarchy** (cập nhật 2026-08-03): `--bg-surface: #FFFFFF` (crisp white) trên `--bg-page: #ECEEF1` (soft gray). Card/form nổi rõ ràng trên nền page, theo mô hình GitHub Primer / Linear.
- **Border radius** (cập nhật 2026-08-03): `--radius-sm: 6px` (mềm hơn cho buttons/inputs).

### RULE-UI-6 — Responsive (đã xây trong globals.css)
- `< 640px`: grid collapse 1 col, layout stack vertical, panel-left collapsed
- `640–1024px`: grid-3 → 2 col, panel-left 200px
- `> 1400px`: panel-left 280px, form-grid-4 available
- **KHÔNG override bằng Tailwind `sm:` `md:` nếu class đã xử lý**

### RULE-UI-7 — Compact density (Enterprise)
- Header bar: **48px** | Table row padding: **6px 10px** | Input height: **36px** | Section header: **7px 14px**
- Tránh khoảng trắng lãng phí. Sections stack thẳng đứng.

### RULE-UI-8 — Typography (Phương án A — chuẩn SAP/Salesforce, áp dụng 2026-06-17)
- **Body / input / btn**: **14px** `var(--text-primary)` — chuẩn SAP Fiori, Salesforce SLDS, MUI
- **Table cell (td)**: **13px** | Table header (th CAPS): **11px**
- **Label** (form): **12px** (font-medium hoặc bold tùy theme) — sử dụng `next-intl` (t()) cho đa ngôn ngữ
- **Section header (CAPS)**: **11px** + letter-spacing 0.07em — uppercase bù cho cỡ nhỏ
- **Badge / chip**: **11–12px** | **Tab**: **12px**
- **Input height**: **36px** (từ 34px — đảm bảo không chèn chữ 14px)
- **Mono (code/path)**: **13px** (1px nhỏ hơn body để phân biệt)
- ⚠️ **KHÔNG thay đổi padding/margin/gap** khi tăng font — giữ compact density


### RULE-UI-9 — Ổ C đầy: dùng node trực tiếp
- **❌** `npx tsc --noEmit` (ENOSPC nếu C: đầy)
- **✅** `node ".\node_modules\typescript\bin\tsc" --noEmit`
