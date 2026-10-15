# 📌 YSDMS NextGen — Active Handoff (`00_ACTIVE_HANDOFF.md`)

- **Cập nhật lần cuối:** `2026-10-15 11:44:50 JST`
- **Work Order đã đóng:** `WO-DOC-MODULAR` (**CLOSED**), `WO-EQUIPMENT-UI-FIX` (**CLOSED**).
- **Work Order hiện hành:** `WO-MOLD-SYNC-WAVE1` — **CỔNG 1 PAYLOAD V2 (`SUBMITTED`, Chờ PE duyệt)**.

## 1. Giải Quyết Triệt Để 4 Yêu Cầu Của PE Tại Payload V2 (`ID: f198b608`)
1. **Xử lý `COB001` theo Phương án A (PE đề xuất):** Tạo mới `1` dòng `public.companies` cho khách hàng `COB` (`CustomerID = 444` $ightarrow$ `legacy_id = 'CUST-444'`, `company_id = '2c08b859-50cb-57ad-9e5b-a52faaff3664'`) ở `Step 1.0`, sau đó gán `TRAY-5387` (`products`), `D-4942` (`design_revisions`), và `M-5927` (`equipment`) về đúng `CUST-444` (**0 gán tạm vào YSD**).
2. **Bằng chứng quy ước hậu tố `-2` cho `CUTTER_SEPARATE`:** Trong `1,725` dao cắt (`legacy_id LIKE 'C-%'`) hiện có trong `public.equipment`, có **`1,156` dao cắt (`67.01%`) dùng chính xác hậu tố `-2`** (`HAK001-2`, `NSM002-2`, `SRI002-2`, `SMK203-2`...) và **`1,452` dao cắt (`84.17%`) dùng hậu tố số** khi trùng mã với `MOLD`, trong khi `legacy_id` giữ nguyên `'C-<CutterID>'`.
3. **Kiểm chứng `unique legacy_id` (`0` trùng lặp trước & sau trong `BEGIN ... ROLLBACK`):**
   - `companies`: `1,991 -> 1,992` (`dup = 0`) | `rack_layers`: `380 -> 400` (`dup = 0`) | `products`: `4,083 -> 4,137` (`dup = 0`) | `design_revisions`: `4,692 -> 4,780` (`dup = 0`, `DESIGN-* = 0`) | `equipment`: `6,494 -> 6,522` (`dup = 0`).
4. **Tách 6 File SQL độc lập (`<= 120` dòng/file) kèm Preflight/Postflight riêng:** Lưu tại `docs/audit_logs/wave1_payload_v2/01_staging_ddl.sql` .. `06_full_rollback_plan.sql`.
