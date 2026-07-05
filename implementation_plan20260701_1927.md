# Kế Hoạch Xây Dựng Hồ Sơ Dự Án Chuẩn — YSDMS NextGen

> **Mục tiêu:** Tạo tài liệu BINDING duy nhất mà TẤT CẢ AI model phải tuân theo
> **Vị trí:** `d:\AntiGravity_Workspace\apps\ysdms-nextgen\PROJECT_DOSSIER.md`

---

## Lý Do Cần Xây Dựng Lại

1. `SCHEMA_REFERENCE.md` chỉ document 11/79 bảng — thiếu toàn bộ Job Management
2. `ysdms-nextgen_MASTER.md` (sổ cái) chủ yếu ghi session log — không phải tài liệu kỹ thuật binding
3. Code VBA từ Access chưa bao giờ được document hóa → AI model không hiểu nghiệp vụ thực tế
4. Gemini và các model khác tự sáng tạo schema vì thiếu tài liệu tham chiếu

---

## Cấu Trúc Hồ Sơ Đề Xuất (10 Phần)

### Phần 1: Tổng Quan Dự Án
- Tên, mục đích, ngành nghề
- Tech stack (Next.js 16, Supabase, React 19)
- Schema version hiện tại
- Quy ước đặt tên (bilingual JA/VI)

### Phần 2: Luồng Nghiệp Vụ Đã Chốt

> [!IMPORTANT]
> Đây là phần **QUAN TRỌNG NHẤT** — rút từ VBA code Access + user confirmation

#### 2A. Luồng Tạo Khuôn Mới (từ VBA `btnMoldDesignCreate_Click`, `btnMoldCreate_Click`)
```
Input: Customer + Number + Version (VD: JAE, 036, R2)
  ↓
[1] AUTO-CREATE Product/Tray = "JAE-036" (nếu chưa có)
    → products table: product_name = "JAE-036", company_id = CustomerID
  ↓
[2] CREATE Design Revision = "JAE-036 R2"
    → design_revisions: design_code = "JAE036R2", company_id, product_id*
  ↓  
[3] CREATE Physical Mold = "JAE-036 R2"
    → physical_molds: system_code = "JAE036R2", display_name = "JAE-036 R2"
```
*Lưu ý: Trong NextGen, `design_revisions` link qua `mold_masters.product_id` (gián tiếp)

#### 2B. Luồng Tạo Job (từ VBA `btnJOBcreate_Click`)
```
[4] CREATE Job từ Mold đã chọn
    → jobs: job_name = MoldName, job_code = MoldCode (no spaces/dashes)
    → design_revision_id, physical_mold_id
    → ProcessingItemID: 1 (金型) hoặc 2 (試作ポケット nếu test mold)
    → MachiningCustomerID: 2 (社内/In-house)
```

#### 2C. Luồng Tạo Bước Gia Công (từ VBA `btnCreateProcessingMold_Click`)
```
[5] CREATE Job Step (ProcessingDeadline) per ItemType
    → job_steps: job_id, item_type_id (2=MOLD, 3=PLUG)
    → processing_status_id = 1 (未確認)
    → deadline = DeliveryDeadline - 3 ngày làm việc
```

#### 2D. Luồng Ghi Nhật Ký (WorkLog)
```
[6] Daily WorkLog per JobStep
    → work_logs: job_step_id, employee_id, processing_code_id
    → hours_spent, work_date, is_finished
```

#### 2E. Nhận Định Về MoldMaster vs CutterMaster

> Dựa trên phân tích VBA và user confirmation:
> - **Product (Tray) = Master Mold** trong thực tế nghiệp vụ
>   - `products.product_name` = mã nội bộ = master mold code
>   - `products.company_pn` = mã từ khách hàng
> - **`mold_masters`** hiện tại vẫn tồn tại nhưng thực chất là **layer trung gian**
>   - Access cũng có `tblDesignMaster` nhưng đã bị bypass trong V3
> - **`cutter_masters`** — tương tự, có thể trùng vai trò với `mold_masters`
>   - Cutter có thể link trực tiếp đến `design_revisions` (như Access: `tblCutter.MoldDesignID`)
> - **Quyết định:** Document thực trạng hiện tại, ghi chú về sự trùng lặp tiềm tàng, nhưng KHÔNG thay đổi schema trong phiên này

### Phần 3: Schema Database — TOÀN BỘ (Thay thế SCHEMA_REFERENCE.md)

Sẽ document **đầy đủ** tất cả các bảng, nhóm theo:
- **3A.** Master Data (10 bảng): companies, products, employees, machines...
- **3B.** Tooling Hierarchy (20 bảng): mold_masters, design_revisions, physical_molds, mold_maintenance...
- **3C.** Cutter (5 bảng): cutter_masters, cutters, mold_design_cutters...
- **3D.** Job Management (10 bảng): jobs, job_steps, work_logs, processing_codes...
- **3E.** Order/Production (11 bảng)
- **3F.** Equipment/Logistics (4 bảng)
- **3G.** Quality/Inspection (4 bảng)
- **3H.** System/Support (3 bảng)
- **3I.** Lookup Tables (7 bảng)

Mỗi bảng ghi đầy đủ: PK, tất cả columns, FKs, enum values

> [!NOTE]
> **KHÔNG document bảng `omni_*`** — đây là app riêng biệt chạy chung Supabase account, KHÔNG liên quan đến YSDMS. Thêm vào quy tắc CẤM CHẠM.

### Phần 4: Data Mapping — Access → NextGen

| Access Table | NextGen Table | Import Status | Missing Columns |
|---|---|---|---|
| Đầy đủ 17 bảng chính | ... | ✅/❌ | chi tiết |

### Phần 5: Front-end Structure

- App directory tree (routes)
- Key components per module
- Server actions mapping
- Design system rules (từ globals.css)

### Phần 6: Trạng Thái Modules

| Module | Status | Notes |
|---|---|---|
| Danh sách đầy đủ | DONE/IN_PROGRESS/TODO | |

### Phần 7: Vấn Đề Đã Biết & Backlog

- Data import issues (từ audit)
- Missing features
- Technical debt

### Phần 8: Quy Tắc Binding Cho AI (SẼ CẬP NHẬT VÀO AGENTS.md)

```markdown
## 🔒 QUY TẮC SCHEMA — KHÔNG NGOẠI LỆ

1. ĐỌC PROJECT_DOSSIER.md TRƯỚC KHI viết bất kỳ query nào
2. KHÔNG thêm/sửa/xóa cột DB mà không có USER APPROVAL
3. KHÔNG tạo migration file mà không có USER APPROVAL
4. KHÔNG CHẠM vào bảng omni_* (app riêng biệt)
5. KHÔNG đổi tên bảng/cột đã chốt
6. Khi cần cột mới → DỪNG → hỏi user → chờ approval
7. PHẢI kiểm tra tương thích DB ↔ Front-end trước khi sửa
```

### Phần 9: Nhật Ký Phiên (giữ nguyên format từ Master Ledger)

### Phần 10: Glossary — Thuật Ngữ JA/VI/EN

---

## Kế Hoạch Thực Hiện

### Bước 1: Xây dựng `PROJECT_DOSSIER.md` (~3000 dòng)
- Tổng hợp từ: SCHEMA_REFERENCE.md + Master Ledger + database.types.ts + VBA analysis + audit results
- Vị trí: `d:\AntiGravity_Workspace\apps\ysdms-nextgen\PROJECT_DOSSIER.md`

### Bước 2: Cập nhật `AGENTS.md`
- Thêm pointer đến PROJECT_DOSSIER.md
- Thêm quy tắc Schema Binding
- Thêm quy tắc omni_* = KHÔNG CHẠM

### Bước 3: Deprecate files cũ
- `SCHEMA_REFERENCE.md` → thêm header redirect đến PROJECT_DOSSIER.md
- Master Ledger → giữ cho session logs, link đến dossier cho kỹ thuật

### Bước 4: Xác minh
```bash
npx tsc --noEmit  # Verify front-end vẫn build OK
```

---

## Open Questions

> [!IMPORTANT]
> **Về `mold_masters` ↔ `products`:**
> VBA code cho thấy Product/Tray được auto-create khi tạo MoldDesign, và tên giống nhau. Bạn có muốn tôi document rằng:
> 1. **Giữ nguyên cả 2 bảng** nhưng ghi chú `mold_masters ≈ products` trong dossier?
> 2. Hay **đề xuất merge** trong roadmap tương lai?
>
> **Về `cutter_masters`:**
> 1. **Giữ** nhưng ghi chú có thể thừa?
> 2. Hay **đề xuất loại bỏ** — cutters link trực tiếp vào `design_revisions` + `mold_masters`?
>
> **Về `processingdeadline.csv` → `job_steps`:**
> Trong Access, `tblProcessingDeadline` = bước gia công. Khi import, nên map vào `job_steps` hiện có. Xác nhận đồng ý?
