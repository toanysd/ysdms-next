# PROJECT_STATUS.md
> Cập nhật lần cuối: **2026-07-15** bởi **PE (Perplexity)**

---

## 🟢 Đã hoàn thành (Done)

| Ngày | Commit / File | Mô tả |
|---|---|---|
| 2026-07-01 | `implementation_plan20260701.md` | Kiểm toán toàn diện 79 bảng — phát hiện 5 nhóm data chưa import |
| 2026-07-15 | `d085261` | Deep scan 3 agent → Business Process Catalog v1.1 (71 quy trình, 25 edge cases) |
| 2026-07-15 | — | Dọn repo: 43 file rác chuyển vào `scratch/` — root còn ~30 files sạch |
| 2026-07-15 | `docs/AN_deep_scan_part1/2/3.md` | 3 báo cáo scan chi tiết: Quotation/ISO, Delivery/Production, Legacy CSV |
| 2026-07-15 | `docs/02_BUSINESS_PROCESS_CATALOG.md` | Danh mục nghiệp vụ v1.1 — tổng hợp từ 3 scanner |

---

## 🔨 Đang làm (In Progress)

| Task | Ai làm | % | ETA | Ghi chú |
|---|---|---|---|---|
| Rotate Supabase service-role key | Anh Thoan (manual) | 0% | ASAP | Key cũ xuất hiện trong transcript. Xem hướng dẫn trong DECISIONS.md |
| Import V5 Seed (job_steps, work_logs, cutters) | AN | 0% | Sau khi rotate key | Phụ thuộc key mới |
| Implement Module Chỉ thị SX (BP-32) | AN | 0% | Sprint 1 | Phụ thuộc V5 Seed + spec dưới đây |

---

## 🚧 Blockers

| Vấn đề | Cần ai giải quyết | Mức độ |
|---|---|---|
| **Supabase service-role key bị lộ trong transcript local** | Anh Thoan — vào Dashboard > Settings > API > Regenerate | 🔴 Bảo mật |
| **5 file CSV chưa import vào DB** (`cutters`, `cutter_masters`, `mold_design_cutters`, `work_logs`, `job_steps`) | AN — viết V5 seed script | 🔴 Data integrity |
| **31 cột Jobs bị mất** khi import từ Access (thiếu `deadline`, `start_date`, `physical_mold_id`...) | AN — bổ sung trong V5 seed | 🔴 Data integrity |
| **`JobQuantity` đang map sai vào `estimated_hours`** — cần xác nhận `JobQuantity` là gì | Anh Thoan xác nhận | 🟡 Semantic |

---

## 📋 Backlog (Theo thứ tự ưu tiên)

### Sprint 1 (Hiện tại)
- [ ] **S1-01** — Rotate Supabase key (Anh Thoan, 5 phút)
- [ ] **S1-02** — `PROJECT_STATUS.md` + `DECISIONS.md` + Spec BP-32 (PE ✅ đã làm)
- [ ] **S1-03** — V5 Seed Script: import job_steps, work_logs, cutters (AN, ~3h)
- [ ] **S1-04** — Implement Module Chỉ thị SX — BP-32 (AN, ~6h, xem spec tại `docs/specs/BP-32_production_instruction.md`)

### Sprint 2 (Kế tiếp)
- [ ] Module Phiếu giao hàng (BP-54~55) — hỗ trợ multi-format YSD + SMK + KYD
- [ ] Module Mượn khuôn / Giấy nhận khuôn (BP-24~26)
- [ ] Module QC + Bảng kiểm KH chỉ định (BP-48~53)
- [ ] Tồn kho nhựa real-time — thay 830 file Excel (BP-42~47) [P0 vận hành]

### Sprint 3+
- [ ] Module Đặt hàng vật tư (BP-44)
- [ ] Nhật ký bộ phận Press + QC (BP-59~63)
- [ ] ISO/Compliance docs (BP-66~71)
- [ ] Customer-specific Config (edge cases IS-01~25)
- [ ] DROP 8 bảng `omni_*` + fix FK `mold_design_cutters`

---

## 📌 Quy trình làm việc PE ↔ AN

```
PE đọc GitHub (docs/, PROJECT_STATUS.md)
    ↓
PE viết spec vào docs/specs/ → Anh Thoan duyệt
    ↓
AN đọc spec → implement → push commit lên main
    ↓
PE verify spec vs implementation
    ↓
Anh Thoan test → feedback → AN update PROJECT_STATUS.md
```

**Nguyên tắc:**
- PE chỉ đọc GitHub (không cần access Supabase trực tiếp)
- AN chỉ code khi có spec đã duyệt
- Mọi quyết định schema/flow → ghi vào `docs/DECISIONS.md`
- AN cập nhật file này sau **mỗi phiên làm việc**
