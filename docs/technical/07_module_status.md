# 07 — TRẠNG THÁI MODULE & TRANG (Module Status)

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-07-02  
> **Nguồn:** `src/app/` directory scan, `Sidebar.tsx` routes, `04_system_architecture.md`

---

## 1. Tổng Quan

| Trạng thái | Số trang | Tỷ lệ |
|:----------:|:--------:|:------:|
| ✅ DONE | 31 | 72% |
| 🔧 IN_PROGRESS | 4 | 9% |
| 🔲 PLACEHOLDER | 8 | 19% |
| **Tổng** | **43** | **100%** |

---

## 2. Chi Tiết Theo Module

### 2.1 Dashboard & Global

| Route | Trang | Size | Trạng thái |
|-------|-------|------|:----------:|
| `/` / `/dashboard` | Dashboard chính | 9.8 KB | ✅ |
| `/login` | Đăng nhập | 5.4 KB | ✅ |
| `/worklog` | Nhật ký | 673 B | ✅ |
| `/settings` | Cài đặt | 678 B | ✅ |

### 2.2 Module: Master Data (マスター)

| Route | Trang | Size | Trạng thái |
|-------|-------|------|:----------:|
| `/master` | Master Dashboard | 22.5 KB | ✅ |
| `/master/customers` | Khách hàng list | 9.3 KB | ✅ |
| `/master/customers/[id]` | Khách hàng detail | ✅ | ✅ |
| `/master/customers/new` | Tạo KH mới | ✅ | ✅ |
| `/master/products` | Sản phẩm list | **43.6 KB** | ✅ |
| `/master/products/[id]` | Sản phẩm detail | ✅ | ✅ |
| `/master/molds` | Mold Masters list | 14.8 KB | ✅ |
| `/master/molds/[id]` | Mold Master detail | ✅ | ✅ |
| `/master/molds/new` | Tạo mold mới | ✅ | ✅ |
| `/master/machines` | Máy móc list | **35.3 KB** | ✅ |
| `/master/plastics` | Nhựa list | 9.5 KB | ✅ |
| `/master/plastics/new` | Tạo nhựa mới | ✅ | ✅ |
| `/master/racks` | Kệ chứa grid | 28.7 KB | ✅ |
| `/master/cutters` | Dao cắt list | 4.3 KB | ✅ |
| `/master/cutters/new` | Tạo dao cắt | ✅ | ✅ |
| `/master/employees` | Nhân viên | 674 B | 🔲 |

### 2.3 Module: Engineering (設計)

| Route | Trang | Size | Trạng thái |
|-------|-------|------|:----------:|
| `/engineering` | Engineering Dashboard | 745 B | ✅ |
| `/engineering/designs` | Thiết kế list | 16.4 KB | ✅ |
| `/engineering/designs/[id]` | Thiết kế detail | ✅ | ✅ |

### 2.4 Module: Equipment & Tooling (設備・金型)

| Route | Trang | Size | Trạng thái |
|-------|-------|------|:----------:|
| `/equipment/dashboard` | Equipment Dashboard | 9.2 KB | ✅ |
| `/equipment/molds` | Khuôn vật lý list | **31.8 KB** | ✅ |
| `/equipment/molds/[id]` | Khuôn detail + tabs | ✅ | ✅ |
| `/equipment/jobs` | Job list | 18.8 KB | ✅ |
| `/equipment/jobs/[id]` | Job detail + tabs | ✅ | ✅ |
| `/equipment/cutting-dies` | Dao cắt list | 2.5 KB | ✅ |
| `/equipment/schedule` | Gantt/Schedule | 4.3 KB | 🔧 |
| `/equipment/auxiliary` | TB phụ trợ | 7.7 KB | 🔧 |
| `/equipment/aluminum` | Phôi nhôm | 18.3 KB | ✅ |
| `/equipment/lifecycle` | Kiểm kê | 691 B | 🔲 |

### 2.5 Module: Orders (受注)

| Route | Trang | Size | Trạng thái |
|-------|-------|------|:----------:|
| `/orders` | Đơn hàng list | 21.7 KB | ✅ |
| `/orders/[id]` | Đơn hàng detail + tabs | 6 KB + components | ✅ |
| `/orders/shipments` | Xuất hàng list | 24.4 KB | ✅ |
| `/orders/quotations` | Báo giá | 668 B | 🔲 |

### 2.6 Module: Production (生産)

| Route | Trang | Size | Trạng thái |
|-------|-------|------|:----------:|
| `/production` | Planning calendar | 9.7 KB | ✅ |
| `/production/planning` | Planning view | 3.4 KB + 10 components | 🔧 |
| `/production/worklog` | Work log | 15.2 KB | ✅ |
| `/production/inventory` | Production inventory | 5 KB + 5 components | ✅ |
| `/production/dashboard` | SX Dashboard | 403 B | 🔲 |
| `/production/kanban` | Kanban | 758 B | 🔲 |
| `/production/floor` | Factory floor | 684 B | 🔲 |
| `/production/mrp` | MRP | 680 B | 🔲 |
| `/production/instructions` | Lệnh SX | 675 B | 🔲 |

### 2.7 Module: Quality (品質)

| Route | Trang | Size | Trạng thái |
|-------|-------|------|:----------:|
| `/quality` | QC Dashboard | 673 B | ✅ |
| `/quality/inspections` | Kiểm tra | 11.3 KB | ✅ |
| `/quality/defects` | Báo cáo lỗi | 662 B | 🔲 |

### 2.8 Module: Reports (レポート)

| Route | Trang | Size | Trạng thái |
|-------|-------|------|:----------:|
| `/reports` | Reports Dashboard | 669 B | ✅ |
| `/reports/alerts` | Cảnh báo | 15.7 KB | ✅ |
| `/reports/inventory` | Tồn kho | 12.4 KB | ✅ |
| `/reports/orders` | Đơn hàng | 15 KB | ✅ |
| `/reports/production` | Sản xuất | 2.5 KB | 🔧 |

### 2.9 Trang Khác (Ngoài Sidebar)

| Route | Trang | Size | Trạng thái | Ghi chú |
|-------|-------|------|:----------:|---------|
| `/materials` | Kho vật tư | 5.4 KB | ✅ | Trên sidebar Office |
| `/maintenance` | Bảo dưỡng | 14.2 KB | ✅ | Không trong sidebar Equipment |
| `/inventory` | Tồn kho riêng | 5.3 KB | ✅ | Duplicate? |

---

## 3. Sidebar ↔ File System — Bất Nhất

### 3.1 Route trên Sidebar nhưng KHÔNG có file

| Sidebar Route | Label | Cần tạo? |
|---------------|-------|:--------:|
| `/equipment/outsource` | 外注管理 / Gia công ngoài | ✅ Cần |
| `/equipment/maintenance` | 保守・メンテ / Bảo dưỡng | ⚠️ Có `/maintenance` nhưng path khác |
| `/equipment/materials` | アルミブランク / Phôi nhôm | ⚠️ Thực tế là `/equipment/aluminum` |
| `/admin/ingest` | データ取込 / Nhập DL tự động | ✅ Cần |

### 3.2 File tồn tại nhưng KHÔNG trong Sidebar

| Route | Mô tả | Nên thêm vào sidebar? |
|-------|-------|:---------------------:|
| `/production/planning` | Planning view phức tạp | ✅ Có (thay `/production`) |
| `/production/molds` | Quản lý khuôn SX | ⚠️ Review |
| `/production/products` | Upsert sản phẩm | ⚠️ Review |
| `/maintenance` | Bảo dưỡng | → Di chuyển vào `/equipment/maintenance` |
| `/inventory` | Tồn kho | → Gộp vào `/materials` |
| `/docs` | Tài liệu | ❌ Internal |

---

## 4. Server Actions — Coverage

| Action File | Size | Module | Có trang tương ứng? |
|-------------|------|--------|:-------------------:|
| `production.ts` | **28.9 KB** | Production | ✅ |
| `mold-job.ts` | **22.9 KB** | Equipment/Jobs | ✅ |
| `reports.ts` | 11.7 KB | Reports | ✅ |
| `mold.ts` | 11 KB | Equipment/Molds | ✅ |
| `order.ts` | 8.3 KB | Orders | ✅ |
| `inventory.ts` | 7.8 KB | Inventory | ✅ |
| `customer.ts` | 5.7 KB | Master/Customers | ✅ |
| `machine.ts` | 4.5 KB | Master/Machines | ✅ |
| `mrp.ts` | 4.5 KB | MRP | 🔲 (placeholder page) |
| `maintenance.ts` | 3.5 KB | Maintenance | ✅ |
| `dashboard.ts` | 3.5 KB | Dashboard | ✅ |
| `engineering.ts` | 3 KB | Engineering | ✅ |
| `master-dashboard.ts` | 2.5 KB | Master | ✅ |
| `mold-revise.ts` | 2.4 KB | Engineering | ✅ |
| `quality.ts` | 1.8 KB | Quality | ✅ |
| `product.ts` | 1.7 KB | Products | ✅ |
| `production_logs.ts` | 1.8 KB | Production Logs | ✅ |
| `plastic.ts` | 1.3 KB | Master/Plastics | ✅ |
| `auth.ts` | 1.2 KB | Auth | ✅ |
| `cutter.ts` | 921 B | Master/Cutters | ✅ |
| `tags.ts` | 683 B | Tags | ✅ |

---

## 5. Ưu Tiên Phát Triển

### Phase 1: Sửa bất nhất (1-2 ngày)
- [ ] Fix sidebar routes: `/equipment/materials` → `/equipment/aluminum`
- [ ] Di chuyển `/maintenance` → `/equipment/maintenance`
- [ ] Tạo `/equipment/outsource` (placeholder hoặc basic)
- [ ] Tạo `/admin/ingest` (data import tool)

### Phase 2: Hoàn thiện placeholder (1-2 tuần)
- [ ] `/master/employees` — CRUD nhân viên
- [ ] `/orders/quotations` — Quản lý báo giá
- [ ] `/quality/defects` — Báo cáo lỗi
- [ ] `/equipment/lifecycle` — Kiểm kê định kỳ

### Phase 3: Modules chính chưa làm (2-4 tuần)
- [ ] `/production/kanban` — Kanban board
- [ ] `/production/dashboard` — SX Dashboard
- [ ] `/production/floor` — Factory floor input
- [ ] `/production/mrp` — MRP

---

*Cập nhật lần cuối: 2026-07-02*
