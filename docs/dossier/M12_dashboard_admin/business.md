# 🖥️ M12 — Dashboard Điều Hành, Báo Cáo, Xác Thực & Hạ Tầng Bridge (`M12_dashboard_admin/business.md`)

## 1. Phạm Vi Chức Năng Cốt Lõi
1. **Dashboard Điều hành & Báo cáo Tổng hợp (`/dashboard`, `/reports/*`):**
   - Hiển thị KPI toàn nhà máy từ view `v_dashboard_executive_kpis`, cảnh báo đơn hàng trễ hạn (`/reports/alerts`), báo cáo tồn kho (`/reports/inventory`), đơn hàng (`/reports/orders`), sản xuất (`/reports/production`) và nhật ký A4 (`/reports/daily-worklog`).
2. **Xác thực & Đồng bộ Hồ sơ Người dùng (`/login`, `auth.users` <-> `public.profiles`):**
   - Người dùng đăng nhập qua Supabase Auth (`/login`).
   - Trigger `on_auth_user_created_sync_profile` (Migration `20261014143000` trong `WO-SCHEMA-SAFETY-FIX`) tự động đồng bộ `auth.users` sang `public.profiles` (`3/3` tài khoản active, `missing_profiles = 0`), đảm bảo RBAC (`admin`, `sales`, `engineering`, `production`) hoạt động nhất quán.
3. **Hạ tầng Phối hợp Tự trị PE – THOAN – AN (`Realtime Bridge` & `Evidence Pack` — `RULE-PROC-01..03`):**
   - Mọi báo cáo Compact (`<= 150` dòng) gửi qua `public.pe_an_messages` ở **Tool Call cuối cùng**.
   - Mọi bằng chứng kiểm thử (`TSC`, `I18N`, `GIT_GREP`, `BROWSER`, `SQL_AUDIT`, `SCREENSHOT`) được commit vào `docs/audit_logs/YYYY-MM-DD_<work_order>.json` và lưu định danh vào bảng `public.pe_evidence_items`.

## 2. Cấu Trúc Route & Component Chuẩn (`Canonical Routes`)
- **Routes:** `/dashboard` (redirect từ `/`), `/login`, `/reports/alerts`, `/reports/inventory`, `/reports/orders`, `/reports/production`, `/reports/daily-worklog`, `/settings`.
- **Layout & Navigation:** `src/components/layout/Sidebar.tsx`, `src/components/layout/Topbar.tsx`.

## 3. Trạng Thái Hiện Tại & Bằng Chứng Nghiệm Thu
- **Trạng thái:** **Hoàn thành & Đang vận hành ổn định (`CLOSED`)**.
- **Commits:** `d51b5609` (`WO-SCHEMA-SAFETY-FIX`), `2c897d21` (`WO-EVIDENCE-INFRA`), `817f7b34` & `013f55bf` (`WO-ROUTE-CLEANUP`), `a587a5c2` & `97116e09` (`WO-EQUIPMENT-UI-FIX`).
