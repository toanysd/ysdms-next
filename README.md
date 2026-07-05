# YSDMS Next-Gen 🏭

**YSD Management System — Next Generation**
Enterprise-grade Manufacturing Execution & Warehouse Management System
Built on Next.js 16 (App Router) + Supabase (PostgreSQL)

## 📋 Dự Án
Hệ thống quản lý sản xuất, kho vật tư và nghiệp vụ kinh doanh toàn diện cho YSD.
Đây là kiến trúc Greenfield thay thế hoàn toàn hệ thống MoldCutterSearch legacy.

- **Supabase Project:** `iirezrszalmecsslbruo`
- **Legacy Repo (Read-Only Reference):** `MoldCutterSearch`

## 🏗️ Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | TailwindCSS v3 + Dense Industrial UI (Teal/YSD) |
| **Backend** | Supabase (PostgreSQL, RLS, Auth, Storage) |
| **ORM** | supabase-js v2 |

## 🗄️ Database Schema V1 — Supabase
**Bảng hiện có (12 bảng — Giai đoạn 1-2)**
```text
Master Data
├── customers           — Quản lý Khách hàng (Mới)
├── plastic_master      — Quy cách vật liệu nhựa
├── mold_base           — Khuôn gốc kinh doanh (VD: JAE-001)
├── mold_design_revision — Phiên bản thiết kế (VD: JAE-001-R02)
├── mold_physical       — Khuôn vật lý thực tế lắp máy
├── product_master      — Khay sản phẩm (Tray)
├── cutter_master       — Dao cắt
└── machine_master      — Máy đúc nhựa

Bridge & BOM
├── product_mold_map    — Map Khay ↔ Revision thiết kế
├── mold_plastic_bom    — Định mức nhựa (gram/shot)
└── mold_cutter_config  — Liên kết Khuôn ↔ Dao

Inventory WMS
├── plastic_roll        — Cuộn nhựa vật lý (QR Code)
└── inventory_txn       — Sổ cái kho (IN/OUT/ADJUST)
```

## 🛣️ Lộ Trình 10 Module
1. Foundations: Next.js scaffold, Supabase connect, Auth, Layout
2. **Master Data CRUD: Nhựa, Khuôn 3 lớp, Khay, Dao, Máy (Đang thực hiện)**
3. Bridge Logic: Search Engine Khuôn-Nhựa-Dao
4. Sales Management: Order Header/Line
5. Production Dispatch: Work Order, Lịch
6. MRP: Tự động tính toán nhu cầu nhựa
7. Inbound WMS: Nhập cuộn nhựa, QR Labelling
8. Outbound & Factory App: Màn hình cảm ứng xưởng máy
9. Scrap & QC: Hủy phế, khuôn hỏng
10. Import Engine & Analytics: Migration dữ liệu Access/CSV

## ⚙️ Thiết Lập Local
```bash
git clone https://github.com/toanysd/ysdms-next.git
cd ysdms-next
npm install
# Rename .env.example to .env.local and add your keys
npm run dev
```
