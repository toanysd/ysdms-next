# 📋 KẾ HOẠCH TRIỂN KHAI PHASE 1: TÁI TẠO NGHIỆP VỤ MOLDCUTTERSEARCH TRÊN YSDMS-NEXTGEN

**Ngày lập:** 2026-05-21
**Tiêu chuẩn áp dụng:** L0 Identity (Điều 17 & 18) — Enterprise Architect Mindset
**Mục tiêu:** Dựa trên xương sống dữ liệu đã xây dựng trên Supabase, xây dựng lần lượt các giao diện nhập liệu và nghiệp vụ thực tế để tái tạo đầy đủ chức năng của MoldCutterSearch cũ.

---

## 1. KẾT QUẢ XÁC MINH SUPABASE (Thực trạng Database — Đã Verify Trực Tiếp)

### 1.1 Bảng Master Data — ĐÃ CÓ DỮ LIỆU ✅

| Bảng Supabase | Rows | Tương ứng Access cũ | Ghi chú |
|---|---|---|---|
| `mold_base` | 4,434 | `tblMoldMaster` | Khoá gốc khuôn kinh doanh |
| `mold_design_revision` | 4,560 | `tblMoldDesign` | 42 cột — rất đầy đủ |
| `mold_physical` | 4,359 | `tblMold` | 32 cột — có `checkin_status`, `teflon_count`, `rack_layer_id` |
| `cutter_master` | 1,273 | `tblCutterMaster` + `tblCutter` | 27 cột — đã gộp Master + Physical |
| `product_master` | 6,151 | `tblTray` | 26 cột — đủ thông số sản phẩm |
| `machine_master` | 20 | `tblMachine` | 6 cột cơ bản |
| `employees` | 23 | `tblEmployee` | 8 cột |
| `companies` | 1,725 | `tblCompany` | 8 cột |
| `customers` | 1,837 | `tblCustomer` | 15 cột |
| `racks` | 91 | `tblRack` | Giá kệ |
| `rack_layers` | 400 | `tblRackLayer` | Tầng kệ (cần patch `rack_id`) |
| `destinations` | 17 | `destinations` | Điểm đến xuất/nhập |
| `item_types` | 11 | `tblItemType` | Loại vật tư |
| `operator_master` | 6 | N/A | Trực ca sản xuất |

### 1.2 Bảng Bridge/Config — ĐÃ CÓ ✅

| Bảng Supabase | Rows | Chức năng |
|---|---|---|
| `product_mold_map` | 3,337 | Sản phẩm ↔ Thiết kế khuôn |
| `mold_cutter_config` | 376 | Thiết kế khuôn ↔ Dao cắt |
| `mold_plastic_bom` | 0 | Định mức nhựa (chưa có dữ liệu) |

### 1.3 Bảng Transaction/Log — CẤU TRÚC CÓ nhưng DỮ LIỆU TRỐNG 🟡

| Bảng Supabase | Rows | Tương ứng Access cũ | Ghi chú |
|---|---|---|---|
| `mold_status_logs` | **0** | `statuslogs` | IN/OUT/AUDIT — **Chưa có form nhập** |
| `mold_teflon_logs` | **0** | `tblTeflonLog` | State machine 4 pha — **Chưa có form** |
| `mold_location_logs` | **0** | `tblLocationLog` | Đổi vị trí kệ — **Chưa có form** |
| `mold_ship_logs` | **0** | `tblShipLog` | Xuất/nhận hàng — **Chưa có form** |
| `mold_comments` | **0** | `usercomments` | Ghi chú — **Chưa có form** |
| `mold_maintenance_log` | **0** | N/A | Bảo trì — **Chưa có form** |

### 1.4 Bảng Đơn hàng & Sản xuất — ĐÃ CÓ ✅

| Bảng Supabase | Rows | Ghi chú |
|---|---|---|
| `orders` | 272 | Đơn hàng (Phiếu xuất) |
| `order_items` | 7,385 | Chi tiết đơn hàng |
| `production_plans` | 11 | Kế hoạch sản xuất |
| `production_log` | 3 | Nhật ký sản xuất |
| `process_tag_master` | 9 | Tag quy trình |

### 1.5 Bảng KHÔNG TỒN TẠI (Not Found qua PostgREST) ❌

> Các bảng này tồn tại trong DB nhưng **không được expose qua REST API** (thiếu GRANT hoặc chưa add vào `schemas` expose):

```
cutter_status_logs, cutter_location_logs, scrap_logs, ship_logs,
mold_job, mold_job_process, mold_job_material, mold_scrap_log,
mold_maintenance_part, tray_inventory, tray_txn,
app_users, audit_log
```

---

## 2. GAP ANALYSIS — NGHIỆP VỤ CŨ vs HỆ THỐNG MỚI

### 2.1 Nghiệp vụ MoldCutterSearch cũ cần tái tạo:

| # | Nghiệp vụ | Trạng thái trên YSDMS | Ưu tiên |
|---|---|---|---|
| 1 | **Tìm kiếm Khuôn/Dao** (Smart Search + Filter) | ✅ Có `/search` component | — |
| 2 | **Chi tiết Khuôn** (Detail Panel — xem thông tin) | 🟡 Có `/master/mold/[id]` nhưng thiếu tabs | P1 |
| 3 | **Check-in / Check-out** (Quét QR → IN/OUT) | ❌ Không có form → `mold_status_logs` trống | **P1** |
| 4 | **Quản lý Vị trí Kho** (Rack/Layer + di chuyển) | ❌ Không có form → `mold_location_logs` trống | **P1** |
| 5 | **Xử lý Teflon** (Gửi mạ/Nhận về 4 pha) | ❌ Không có form → `mold_teflon_logs` trống | **P1** |
| 6 | **Xuất/Nhập hàng** (Ship mold ra/vào) | ❌ Không có form → `mold_ship_logs` trống | P2 |
| 7 | **Quản lý Dao cắt vận hành** (Status/Location logs) | ❌ Bảng `cutter_status_logs` chưa tồn tại | P2 |
| 8 | **Thanh lý (Scrap)** | ❌ `mold_scrap_log` chưa tồn tại | P3 |
| 9 | **Mượn khuôn (Borrow Certificate)** | ❌ `moldborrow` ở legacy, chưa có bảng mới | P3 |
| 10 | **AR Locator** (Tìm vị trí kệ bằng camera) | ❌ Chưa thiết kế | P4 |

### 2.2 Vấn đề cấu trúc cần sửa trước khi xây form:

1. **`rack_layers.rack_id` = NULL** cho toàn bộ 400 rows → Cần patch dữ liệu để liên kết Tầng ↔ Giá.
2. **`cutter_master` gộp cả Master + Physical** → Cần quyết định: tách hay giữ nguyên? (Access cũ có `tblCutterMaster` + `tblCutter` riêng).
3. **Thiếu bảng log cho Dao** (`cutter_status_logs`, `cutter_location_logs`) → Cần migration mới.

---

## 3. LỘ TRÌNH THỰC THI PHASE 1 (CHI TIẾT)

Áp dụng Điều 18: Database → Service → UI

### 🔧 BƯỚC 1: Database Patches (Vá lỗ hổng Schema)

**Migration 056 — Cutter & Rack Patches:**
```
1. Tạo bảng `cutter_status_logs` (tương tự mold_status_logs)
2. Tạo bảng `cutter_location_logs` (tương tự mold_location_logs)  
3. Tạo bảng `cutter_ship_logs` (tương tự mold_ship_logs)
4. Patch `rack_layers.rack_id` — liên kết dữ liệu thực từ `rack_layers.code`
5. Expose missing tables (GRANT + RLS policies)
```

### ⚙️ BƯỚC 2: Server Actions (Dịch vụ Lõi)

Tạo các file trong `src/actions/`:

| File | Hàm chính | Bảng tương tác |
|---|---|---|
| `mold-status.ts` | `checkIn()`, `checkOut()` | `mold_status_logs`, `mold_physical` |
| `mold-location.ts` | `relocateMold()` | `mold_location_logs`, `mold_physical` |
| `mold-teflon.ts` | `requestTeflon()`, `approveTeflon()`, `sendTeflon()`, `receiveTeflon()` | `mold_teflon_logs`, `mold_physical` |
| `mold-ship.ts` | `shipOut()`, `returnIn()` | `mold_ship_logs` |
| `cutter-status.ts` | `checkInCutter()`, `checkOutCutter()` | `cutter_status_logs`, `cutter_master` |

### 🖥️ BƯỚC 3: UI Forms (Giao diện Nhập liệu)

| # | Trang / Component | Mô tả | Route |
|---|---|---|---|
| 1 | **Mold Detail Enhanced** | Tabs: Thông tin, Lịch sử Status, Teflon, Vị trí, Ship | `/master/mold/[id]` |
| 2 | **Check-in/Check-out Form** | Quét QR hoặc nhập mã → đổi trạng thái IN/OUT | `/master/mold/[id]/status` |
| 3 | **Teflon Processing Panel** | Giao diện 4 pha: Request → Approve → Send → Receive | `/master/mold/[id]/teflon` |
| 4 | **Location Transfer Wizard** | Chọn khuôn → chọn Giá/Tầng mới → xác nhận | `/master/mold/[id]/relocate` |
| 5 | **Cutter Detail Page** | Chi tiết dao + tabs tương tự mold | `/master/cutter/[id]` |
| 6 | **Rack Map Overview** | Bản đồ kệ — xem khuôn nào ở đâu | `/inventory/rack-map` |

---

## 4. THỨ TỰ TRIỂN KHAI ĐỀ XUẤT

```
Phase 1.1: Database Patches (Migration 056)
  └── Patch rack_layers.rack_id
  └── Tạo cutter_status_logs, cutter_location_logs, cutter_ship_logs
  └── GRANT/RLS cho bảng mới

Phase 1.2: Mold Detail Enhanced + Check-in/Check-out
  └── Server Action: mold-status.ts
  └── UI: Mold Detail Tabs + Status Toggle Form

Phase 1.3: Teflon Processing
  └── Server Action: mold-teflon.ts  
  └── UI: Teflon 4-phase Panel

Phase 1.4: Location Management
  └── Server Action: mold-location.ts
  └── UI: Relocate Wizard + Rack Map

Phase 1.5: Cutter Operations
  └── Server Action: cutter-status.ts
  └── UI: Cutter Detail + Status Logs

Phase 1.6: Ship/Export Management
  └── Server Action: mold-ship.ts
  └── UI: Ship Log Form
```

---

> [!IMPORTANT]
> **Yêu cầu phê duyệt:** Bạn đồng ý với lộ trình trên không? Nếu đồng ý, tôi sẽ bắt đầu từ **Phase 1.1** (Viết Migration SQL) → sau đó chạy tuần tự qua từng Phase.
