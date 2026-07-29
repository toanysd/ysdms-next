# YSDMS NextGen — Hướng Dẫn Thiết Kế UI/UX

> **Trạng thái:** Đang áp dụng  
> **Đối tượng:** Lập trình viên, Thiết kế viên UI/UX, AI Agents  
> **Nguyên tắc Cốt lõi:** Mật độ Hiển thị Cấp Doanh nghiệp, Đa Ngôn Ngữ (i18n), Không Hardcode Màu Sắc, Hiệu suất Server-Side

---

## 1. Hệ Thống Thiết Kế & Theming

### 1.1 Bảng Màu & Biến CSS
- **Không Hardcode Màu Sắc:** Không bao giờ dùng mã màu Tailwind nguyên bản như `bg-blue-500`, `text-red-600`, hoặc style nội tuyến như `style={{ color: '#3B82F6' }}`. Luôn sử dụng các biến CSS định nghĩa sẵn trong `globals.css`.
- **Màu Nền (Backgrounds):** `var(--bg-page)`, `var(--bg-surface)`, `var(--bg-surface-2)`, `var(--bg-hover)`, `var(--bg-active)`.
- **Màu Chữ (Text):** `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`.
- **Màu Điểm Nhấn (Accent):** Một màu Teal duy nhất (`var(--accent)`). Dùng vừa phải cho các link, nút bấm chính, trạng thái active, vòng focus, và tab đang active.
- **Màu Trạng Thái:** Dùng `var(--status-success)`, `var(--status-warning)`, `var(--status-error)`, `var(--status-info)` CHỈ cho các badge trạng thái và callout.

### 1.2 Mật Độ Hiển Thị Cấp Doanh Nghiệp (Enterprise Compact Density)
- Tránh khoảng trắng lãng phí. Tuân thủ nghiêm ngặt kích thước để tối đa lượng dữ liệu hiển thị trên một màn hình mà không cần cuộn:
  - **Thanh Header:** Chiều cao `48px`.
  - **Khoảng Đệm Hàng Bảng:** `6px 10px`.
  - **Chiều Cao Input:** `36px`.
  - **Khoảng Đệm Tiêu Đề Mục:** `7px 14px`.
- **Kích Thước Chữ (Typography):**
  - Chữ thường / Input / Button: **14px** `var(--text-primary)`.
  - Ô trong Bảng (`td`): **13px**.
  - Font Mono (Mã/Đường dẫn): **13px**.
  - Nhãn Trường (Labels): **12px** (font-medium hoặc bold tùy trạng thái active) cho cả tiếng Nhật (JA) và tiếng Việt (VI) khi hiển thị động.
  - Tiêu đề Cột Bảng (`th`): **11px** (Viết hoa với khoảng cách chữ `0.05em`).
  - Tiêu đề Mục (Section Header): **11px** (Viết hoa với khoảng cách chữ `0.07em`).

---

## 2. Hệ Thống Đa Ngôn Ngữ (i18n) bằng next-intl

Ứng dụng không còn sử dụng hiển thị song ngữ cứng (cùng lúc hiển thị JA và VI) mà chuyển sang sử dụng thư viện `next-intl` cho phép người dùng chuyển đổi ngôn ngữ.

- **Hook:** Sử dụng `const t = useTranslations('Namespace')` trong Client/Server Components.
- **Keys:** Khai báo key ngôn ngữ trong thư mục `messages/ja.json` và `messages/vi.json`.
- **Trạng thái ngôn ngữ:** Lưu bằng cookie/state, không sử dụng i18n routing (không làm thay đổi URL `/ja/orders` mà giữ nguyên `/orders`).

**Ví dụ Triển Khai:**
```tsx
import { useTranslations } from 'next-intl';

export default function OrderTable() {
  const t = useTranslations('Orders');

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t('orderCode')}</th>
          <th>{t('customerName')}</th>
        </tr>
      </thead>
      {/* ... */}
    </table>
  );
}
```

### 2.2 Xử Lý Chênh Lệch Độ Dài Bản Dịch (Translation Length Differences)
Do tiếng Việt (VI) thường dài hơn tiếng Nhật (JA) khoảng 20-30%, giao diện hệ thống cần thiết kế linh hoạt để không bị vỡ bố cục hoặc đè chữ:
- **Sử dụng Flex-wrap:** Cho các container chứa nhãn hoặc nút bấm (ví dụ: `flex flex-wrap gap-2`) nhằm tự động xuống dòng khi nội dung dịch của tiếng Việt quá dài.
- **Bố cục Lưới Co giãn (Responsive Grids):** Sử dụng các class lưới linh hoạt như `.form-grid-2`, `.form-grid-3`... để nhãn và trường nhập liệu luôn thẳng hàng và không đè lên nhau.
- **Cắt chữ & Tooltip (Truncation & Tooltips):** Đối với các khu vực bị giới hạn không gian hiển thị (như cột bảng dữ liệu), bắt buộc sử dụng CSS truncation (`text-overflow: ellipsis`, `overflow: hidden`, `white-space: nowrap`) hoặc class `truncate` của Tailwind, đồng thời đặt thuộc tính `title` trên phần tử cha để người dùng có thể xem toàn bộ nội dung khi hover.

### 2.3 Quản Lý Font-Family Tự Động (Dynamic Font-Family Management)
Hệ thống quản lý font-family động thông qua thuộc tính `lang` của thẻ `<html>` được cập nhật bởi `next-intl` khi thay đổi locale:
- **Cơ chế hoạt động:** Trạng thái locale hoạt động (`ja` hoặc `vi`) được đồng bộ động vào `<html lang="...">`.
- **Cấu hình CSS trong `globals.css`:**
  ```css
  html[lang="ja"] {
    font-family: var(--font-jp); /* Noto Sans JP cho tiếng Nhật */
  }
  html[lang="vi"] {
    font-family: var(--font-vi); /* Inter cho tiếng Việt */
  }
  body {
    font-family: inherit; /* Tự động kế thừa từ thẻ html */
  }
  ```
- **Lợi ích:** Tránh việc khai báo font-family thủ công ở từng component, tối ưu hóa hiển thị font chân/không chân tự động và nhất quán trên toàn hệ thống.

---

## 3. Cấu Trúc Bố Cục Trang

### 3.1 Trang Danh Sách (Góc Nhìn Chuẩn)
Trang danh sách (vd: `/orders`, `/cases`) phải tuân thủ đúng cấu trúc dọc này bằng cách dùng Flexbox `gap: 12px`:
1. **PageHeader:** Icon (20px accent) + Tiêu đề (JA/VI) + Nút chức năng. `flexShrink: 0`.
2. **FilterBar / TabBar:** Các tab, ô tìm kiếm, dropdown bộ lọc, nút xóa bộ lọc. `flexShrink: 0`.
3. **Content Area:** Thẻ `.card-flat` bao ngoài `.data-table` hoặc `.form-section`. `flex: 1, overflow: auto`.

### 3.2 Trang Chi Tiết (Nhiều Tab)
Các trang chi tiết dành cho thực thể có quan hệ phức tạp phải tối đa hóa chiều cao hiển thị dữ liệu:
- **BackBar:** Đặt chung một dòng "← 戻る" (Quay Lại), "↑ 一覧" (Lên Danh Sách), Mã Thực Thể, Badge Trạng Thái.
- **Tab Navigation:** `.tab-nav` > `.tab-item` > `.tab-item--active`.
- **Tab Content:** Các khối `.form-section` có thể cuộn (`flex: 1`, `overflow: auto`).
*Lưu ý:* Phần Header + Back + Tabs chiếm không quá 25% chiều cao màn hình. Không để nút quay lại nằm đơn độc trên một dòng.

### 3.3 Layout Chi Tiết Master Data (`.detail-layout`)
Dành cho cài đặt master data (vd: Khách Hàng, Sản Phẩm) chứa nhiều thông tin nhưng ít tab con, dùng màn hình chia đôi:
- **Khung Trái (Left Panel):** `.detail-panel-left` (rộng 240px).
- **Khung Phải (Right Panel):** `.detail-panel-right` (flex-1).

---

## 4. Components & Styling

### 4.1 Bảng Dữ Liệu (Data Tables)
- Luôn sử dụng `className="data-table"`.
- **Cột Liên Kết Chính (Primary Hyperlink):** Cột định danh chính (mã hoặc tên) phải dùng `<Link>` định dạng `color: var(--accent)`, `fontWeight: 700`, `fontFamily: monospace`, `fontSize: 13`. **Tuyệt đối không** dùng `<span>` thông thường cho định danh chính.
- **Sắp Xếp (Sorting):** Tiêu đề cột phải bấm được để chuyển đổi sắp xếp (Tăng -> Giảm -> Mặc định) và hiển thị biểu tượng mũi tên chỉ thị (`ArrowUp`, `ArrowDown`, `ArrowUpDown`).
- **Thứ Tự Mặc Định:** Các bản ghi thường được hiển thị theo thứ tự mới nhất nằm trên cùng (`ORDER BY created_at DESC`).

### 4.2 Hệ Thống Form
- Các Form phải khớp khít với các tiện ích của `globals.css`. Không được tạo thêm CSS module mới cho layout.
- **Cấu trúc:** `.form-section` > `.form-section-header` + `.form-section-body` > `.form-grid-{1|2|3|4}` > `.form-field` > `.form-label` + `.form-input`.
- **Nhãn Form (Form Labels):** Sử dụng class `.form-label` cho nhãn dynamic với kích thước đồng nhất **12px**, `font-semibold` / `font-medium` cho cả hai ngôn ngữ. Loại bỏ việc phân tách nhãn song ngữ tĩnh `.label-ja` (12px bold) và `.label-vi` (10px muted) lồng nhau.
- **Section Headers (Tiêu đề mục):** In hoa 11px, `text-muted`, `bg-surface-2`. Kèm theo icon từ thư viện `lucide-react` (14x14) gắn thẻ `.section-icon`. Tránh màu mè và biểu tượng cảm xúc.
- **Inputs:** Sử dụng `.form-input` (cấu hình `font-family: inherit` để tự động chọn font theo ngôn ngữ), `.form-select`, `.form-textarea`.
- **Multi-select Chips (Thẻ chọn nhiều):** Dùng `.type-chips` chứa `.type-chip` và `.type-chip--active`. Đừng dùng các viên thuốc có nền tô màu đặc.

### 4.3 Badge Trạng Thái (Status Badges)
Các chỉ báo trạng thái phải nhất quán với thiết lập sau:
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

## 5. Tương Tác, UX, và Hiệu Suất

### 5.1 Hành vi Lọc & Tìm Kiếm
- **Truy vấn Server-Side:** Không được tải toàn bộ dữ liệu rồi gọi `.filter()` ở client. Tìm kiếm phải chạy qua Supabase (`.ilike()` hoặc `.textSearch()`).
- **Đồng Bộ URL:** State tìm kiếm local phải đồng bộ với tham số URL `?search=`. Ô nhập Form phải chờ (debounce) khoảng 300-500ms trước khi đẩy cập nhật URL.
- **Lịch Sử Tìm Kiếm:** Bắt buộc áp dụng Hook `useSearchHistory(key)`, lưu tối đa 10 tìm kiếm mới nhất vào `localStorage`, hiển thị qua dropdown `<SearchSuggestions>`.
- **Smart Async Dropdowns:** Các trường `<select>` lấy dữ liệu từ >50 bản ghi (Công ty, Sản phẩm) phải dùng `AsyncSearchableSelect`. Hiển thị 10 giá trị mặc định đầu tiên, khi gõ sẽ gọi API (`/api/search/[entity]?q=...&limit=20`) và render tối đa 20 dòng.
- **Lọc Mặc Định Thông Minh:** Thiết lập bộ lọc ngữ cảnh từ đầu. Ví dụ, `/master/customers` tải sẵn `type=CUSTOMER` và hiển thị chip UI `[Khách hàng ×]`. Người dùng bấm dấu '×' để xem tất cả loại mà không phải điều hướng sang trang khác.

### 5.2 Lối Điều Hướng
- **Logic Trở Về (Back / Up):** 
  - **← 戻る (Quay Lại):** Dùng `router.back()` để quay lại đồng thời giữ state tìm kiếm.
  - **↑ 一覧 (Lên Danh Sách):** Dùng thẻ `<Link>` cứng chỉ ngược về danh sách gốc.
- **Workflow Links ("関連 / Liên kết"):** Cung cấp đường dẫn ngữ cảnh sang các khâu vận hành liền kề (vd: Modal Thiết Kế có link tới Khuôn Vật Lý) giúp nối liền quy trình rời rạc.

### 5.3 Mở Rộng Theo Kích Thước Màn Hình (Responsive)
- Phụ thuộc mạnh mẽ vào các media query tích hợp trong `globals.css`. Tránh dùng vô tội vạ các tiền tố của Tailwind (`sm:`, `md:`).
- **Mobile (< 640px):** Form Grid chuyển về 1 cột. Bảng trái `.detail-panel-left` biến thành dạng accordion theo chiều dọc.
- **Tablet (640–1024px):** Form Grid điều chỉnh về 2 cột. Bảng trái thu lại thành `200px`.
- **Wide Screens (> 1400px):** Form Grid `.form-grid-4` tự kích hoạt, tăng mật độ theo chiều ngang.
