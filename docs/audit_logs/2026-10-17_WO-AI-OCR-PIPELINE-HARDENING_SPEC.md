# Đặc Tả Kỹ Thuật (`[KẾ HOẠCH]`): `WO-AI-OCR-PIPELINE-HARDENING`

- **Timestamp:** `2026-10-17 19:25 JST` (`NOW() = 2026-10-17 10:21:50.031280+00:00`)
- **Phản hồi Chỉ thị PE:** `ID: b8b411ce` (`2026-10-17 19:18 JST`)
- **Trạng thái:** `[KẾ HOẠCH]` — Đệ trình Đặc tả Kỹ thuật chi tiết chờ PE duyệt trước khi viết code (`RULE-PROC-01`).

---

## 1. Kết Quả Xác Minh Schema & Hiện Trạng DB Thực Tế (`RULE-DATA-02`)

Kiểm chứng trực tiếp trên Supabase Production (`2026-10-17 10:21:50 UTC`):

1. **`public.equipment.company_id` (Tách Khách hàng đặt khay vs. Nhà gia công khuôn):**
   - Trong `4,759` bản ghi `MOLD`: có **`4,735` dòng (`99.5%`) `company_id = NULL`** (chuẩn Wave 2 Decision 2.C: gia công nội bộ tại YSD `社内` $\rightarrow$ `NULL`).
   - Chỉ có **`24` dòng `MOLD`** và **`2` dòng `CUTTER`** bị gán `company_id` của công ty `CUSTOMER` (`CHG: 5`, `DIC: 4`, `YKW: 2`, `TOW: 2`, `JAE: 1`, `ADY: 1`...) do lỗi trong `/api/ocr/save/route.ts` (dòng `511, 591, 708`) và `fast-tooling-job.ts` (dòng `268, 299`) gán nhầm `company_id` của khách hàng đặt khay vào thiết bị.
   - Danh mục công ty gia công ngoài (`OUTSOURCE`) trong `public.companies` (`company_type` kiểu `text[]`):
     - `NSK` (`100084a1-6abe-4b07-8c29-68f8b00f7a9c`, `(有)日三化成`, `['OUTSOURCE']`)
     - `MRD` (`94023311-73e9-4e8c-bd8a-cefbb2fb8a64`, `(有)丸大商会`, `['OUTSOURCE']`)
     - `YSD` (`1b234ffe-deeb-46a3-8408-47285e7ec1e9`, `(株)ヨシダ成形`, `['MANUFACTURER']`)
2. **`public.equipment` (`equipment_type = 'PLUG'`):**
   - Hiện có **`6` bản ghi `PLUG`** lịch sử (`FHJ001PLUG`, `TE11777PLUG`, `KSP107`, `JAE034PLUG`, `JAE035Plug`, `NSE004`), tất cả đều có `company_id = NULL`.
   - Tuy nhiên `/api/ocr/save/route.ts` dòng `676` đang chặn `if (['MOLD', 'CUTTER', 'PLUG'].includes(comp.type_code)) continue`, khiến `PLUG` không bao giờ được tạo trong `public.equipment` và biến `plugEquipId` tại dòng `1035` luôn bằng `NULL`.
3. **`public.jobs` (`job_category = 'DESIGN'`):**
   - Bản ghi `DES-JAE380` (`job_id = c2c71352-00b8-45fc-8f07-9edf89bfe345`) hiện có `equipment_id = NULL`, trong khi khuôn `MOLD` cùng `design_revision_id` là `JAE380` (`equipment_id = f4ca591a-17d2-41af-b2f7-f969b6dd2e4f`).
4. **`public.equipment_photos` & Storage Bucket `equipment-photos`:**
   - Bucket `equipment-photos` (`public = true`) đã tồn tại trong `storage.buckets`.
   - Bảng `public.equipment_photos` có đầy đủ 13 cột: `photo_id`, `equipment_id`, `storage_path`, `file_name`, `file_size_bytes`, `mime_type`, `photo_type`, `caption`, `taken_at`, `taken_by`, `sort_order`, `created_at`, `updated_at`.
   - Hiện tại `public.equipment_photos` có **`0` dòng** vì `ManufacturingSheetOCRModal.tsx` chưa lưu ảnh phiếu công trình (`新規金型製造工程票`) sau khi trích xuất OCR.

---

## 2. Danh Mục Tọa Độ File & Dòng Sẽ Chỉnh Sửa (`RULE-EXEC`)

| STT | File | Tọa Độ Dòng | Nội Dung Thay Đổi Tóm Tắt |
| :--- | :--- | :--- | :--- |
| 1 | [`src/app/api/ocr/save/route.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts) | `6–60`, `78–126`, `480–750`, `770–1158` | Sửa 6 lỗi pipeline lưu OCR (Bỏ fallback công ty đầu tiên; Tách Customer vs Machining Vendor; Tạo `equipment` cho `PLUG` + gán `SET_MEMBER` & `plugEquipId`; Gắn `equipment_id = moldEquipmentId` cho Job `DESIGN` + `start_date`; Lưu `equipment_photos` cho ảnh phiếu gốc; Bọc toàn bộ trong Transaction nguyên tử). |
| 2 | [`src/app/api/ocr/extract/route.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/extract/route.ts) | `4–51`, `282–468` | Nhận thêm `emailText` (nội dung Email khách hàng / ghi chú đơn hàng) trong `multipart/form-data` hoặc JSON; bổ sung chỉ dẫn đối chiếu chéo `Image + Email` vào prompt Gemini và trả thêm trường `email_cross_check_notes`. |
| 3 | [`src/components/ocr/ManufacturingSheetOCRModal.tsx`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/components/ocr/ManufacturingSheetOCRModal.tsx) | `62–166`, `218–392`, `443–558`, `731–835`, `1216–1250` | Thêm ô dán nội dung Email (`emailText`) ở Bước 1 (`UPLOAD`) và hiển thị ghi chú đối chiếu ở Bước 2 (`REVIEW`); bắt buộc chọn `company_id` trước khi lưu; tự động upload ảnh phiếu gốc lên `equipment-photos` (`photo_type = 'DOCUMENT'`) kèm Privacy Blur Shield (`Rule 3 Global`). |
| 4 | [`src/app/actions/fast-tooling-job.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/actions/fast-tooling-job.ts) | `157–169`, `260–321`, `323–370` | Đồng bộ chuẩn schema: sửa `product_lifecycle_status` $\rightarrow$ `product_status: 'ACTIVE'`, đặt `equipment.company_id = null` (gia công nội bộ) thay vì `input.company_id`, và tự động tạo/liên kết `work_orders` để không sinh Job mồ côi. |
| 5 | `messages/ja.json` & `messages/vi.json` | Namespace `OCRModal` | Bổ sung các khóa dịch song ngữ Nhật–Việt cho ô dán Email, cảnh báo đối chiếu Email, và thông báo lỗi khi chưa chọn khách hàng. |

---

## 3. Đặc Tả Chi Tiết 7 Hạng Mục Kỹ Thuật

### Hạng Mục 1: Loại Bỏ Fallback Lấy Công Ty Đầu Tiên Bất Kỳ (`RULE-DATA-01`)
- **Tọa độ:** [`src/app/api/ocr/save/route.ts#L78-L126`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L78-L126) và [`src/components/ocr/ManufacturingSheetOCRModal.tsx#L443-L450`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/components/ocr/ManufacturingSheetOCRModal.tsx#L443-L450).
- **Thiết kế mới:**
  1. **Xóa hoàn toàn khối fallback dòng `111–119`** trong `src/app/api/ocr/save/route.ts` (`SELECT company_id FROM companies LIMIT 1`).
  2. Thứ tự phân giải `customerCompanyId` (`companyId`):
     - Ưu tiên 1: `body.company_id` (UUID khách hàng do người dùng đã xác nhận/chọn trên UI).
     - Ưu tiên 2: Khớp chính xác `company_code = prefix` (không dùng `ilike 'prefix%'` lấy bừa khi có nhiều công ty trùng chữ cái đầu, trừ khi chỉ có duy nhất 1 kết quả khớp chính xác mã).
     - Ưu tiên 3: Khớp chính xác `company_name = trimmedCustomer`.
     - Nếu vẫn không xác định được duy nhất 1 `customerCompanyId` $\rightarrow$ trả về HTTP `400`:
       ```json
       { "error": "得意先が特定できません。画面のドロップダウンから得意先を選択してください。", "error_code": "CUSTOMER_NOT_RESOLVED" }
       ```
  3. Trên UI `ManufacturingSheetOCRModal.tsx` (`handleSaveToDatabase` dòng `444`): kiểm tra `if (!formData.company_id)` ngay tại client, cuộn tới trường `得意先 (Customer)` và hiển thị cảnh báo yêu cầu người dùng chọn rõ công ty từ `AsyncSearchableSelect`.

### Hạng Mục 2: Tách Bạch `customer_company_id` (Khách Hàng Đặt Khay) vs. `machining_vendor_id` (Nhà Gia Công Khuôn)
- **Tọa độ:** [`src/app/api/ocr/save/route.ts#L178`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L178), [`#L321`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L321), [`#L397-L438`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L397-L438), [`#L511`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L511), [`#L591`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L591), [`#L708`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L708), [`#L773`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L773).
- **Quy tắc ánh xạ chuẩn (Wave 2 Decision 2.C):**
  - **`customerCompanyId` (`body.company_id`):** Ghi vào:
    - `public.products.company_id`
    - `public.design_revisions.company_id`
    - `public.work_orders.company_id`
    - `public.jobs.company_id`
  - **`equipment.company_id` (Nhà gia công thiết bị):**
    - Nếu linh kiện gia công nội bộ tại YSD (`comp.manufacture_location === 'IN_HOUSE'` hoặc mặc định): **`equipment.company_id = NULL`**.
    - Nếu linh kiện gia công ngoài (`comp.manufacture_location === 'OUTSOURCED'`): **`equipment.company_id = comp.machining_vendor_id || null`** (tuyệt đối không gán `customerCompanyId` vào `equipment.company_id`).
  - *(Ghi chú dọn dữ liệu: Đối với `24` dòng `MOLD` và `2` dòng `CUTTER` đã bị gán nhầm `CUSTOMER` company_id trước đây, nếu PE đồng ý làm sạch về `NULL` hoặc chuẩn hóa, AN sẽ trình kèm trong cổng SQL nếu chọn phương án RPC/DB).*

### Hạng Mục 3: Tạo Đầy Đủ Thiết Bị `PLUG` (`equipment_type = 'PLUG'`) & Liên Kết Bộ (`SET_MEMBER`) + Job `PLG-*`
- **Tọa độ:** [`src/app/api/ocr/save/route.ts#L673-L750`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L673-L750) và [`#L1028-L1046`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L1028-L1046).
- **Thiết kế mới:**
  1. Bổ sung bước **5b-2. Plug Equipment (`PLUG`)** ngay sau bước `5b. Cutter Equipment`:
     - Điều kiện kích hoạt: `plugComp` có `arrangement === 'REQUIRED'` hoặc `normalizedPlugType !== 'NONE'`.
     - Quy tắc mã `equipment_code` (đồng nhất với `6` bản ghi `PLUG` hiện có trong DB như `FHJ001PLUG`, `JAE034PLUG`):
       - Mã chuẩn: `revNum > 0 ? \`${baseCode}PLUG-R${revNum}\` : \`${baseCode}PLUG\``
       - Tên hiển thị (`display_name`): `revNum > 0 ? \`${baseInternal}PLUG R${revNum}\` : \`${baseInternal}PLUG\``
     - Tìm thiết bị `PLUG` hiện có theo danh sách mã tương đương (`[`${baseCode}PLUG`, `${baseInternal}PLUG`, `P-${cleanInternal}`, `${baseCode}`]`) với `equipment_type = 'PLUG'`.
     - Nếu `moldHandlingMode === 'REUSE_EXISTING'` hoặc `plugComp?.condition === 'EXISTING'` và tìm thấy $\rightarrow$ tái sử dụng & cập nhật `design_revision_id`, `material_spec`.
     - Nếu tạo mới (`NEW`) $\rightarrow$ `INSERT INTO public.equipment` với `equipment_type = 'PLUG'`, `company_id = null` (hoặc `plugComp.machining_vendor_id` nếu `OUTSOURCED`), `design_revision_id = revisionId`, `cav_type_id = matchedCavTypeId`, `material_spec = plugComp?.material_spec || body.plug_type || null`, `device_status = 'NORMAL'`, `usage_status = 'STORAGE'`.
     - Đẩy `{ type: 'PLUG', id: plugEquipmentId }` vào `createdEquipmentIds`.
  2. Nhờ có `{ type: 'PLUG', id: plugEquipmentId }` trong `createdEquipmentIds`:
     - Bước **5d (`lines 730–750`)** tự động tạo liên kết `SET_MEMBER` giữa `moldEquipmentId` (primary) và `plugEquipmentId` (related) trong `public.equipment_assignments`.
     - Bước **6c (`line 1035`)** tự động lấy được `plugEquipId` hợp lệ để gắn vào Job `JOB-${baseCode}-P` (`プラグ製作`).

### Hạng Mục 4: Gắn `equipment_id = moldEquipmentId` Cho Job `DESIGN` (`DES-*`) & Điền `start_date`
- **Tọa độ:** [`src/app/api/ocr/save/route.ts#L770-L780`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L770-L780) và [`#L1070-L1139`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts#L1070-L1139).
- **Thiết kế mới:**
  1. Trong `commonJobFields` (dòng `770`), bổ sung `start_date: body.sheet_date || new Date().toISOString().split('T')[0]` để mọi Job chế tạo (`MOLD_NEW`, `CUTTER_NEW`, `EQUIPMENT_NEW`) đều có `start_date` phục vụ vẽ thanh Gantt trên `/equipment/schedule`.
  2. Tại Bước 7 (`Auto-create Design Job`, dòng `1096–1118`):
     - Gán **`equipment_id: moldEquipmentId || null`** khi `INSERT` Job `DESIGN` (`DES-${cleanCode}`).
     - Nếu `existingDesignJob` đã tồn tại nhưng `equipment_id` đang `NULL` (như trường hợp `DES-JAE380`) và `moldEquipmentId` đã có $\rightarrow$ thực hiện `UPDATE public.jobs SET equipment_id = moldEquipmentId, work_order_id = COALESCE(work_order_id, workOrderId) WHERE job_id = existingDesignJob.job_id`.

### Hạng Mục 5: Lưu Ảnh Phiếu Công Trình (`新規金型製造工程票`) Vào `equipment-photos` & `public.equipment_photos` Kèm Privacy Blur Shield (`Rule 3 Global`)
- **Tọa độ:** [`src/components/ocr/ManufacturingSheetOCRModal.tsx#L530-L555`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/components/ocr/ManufacturingSheetOCRModal.tsx#L530-L555), [`src/lib/storage/EquipmentPhotoStore.ts#L100-L169`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/lib/storage/EquipmentPhotoStore.ts#L100-L169), và [`src/app/api/ocr/save/route.ts`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/save/route.ts).
- **Thiết kế luồng lưu ảnh & bảo mật riêng tư:**
  1. **Luồng Upload & Ghi DB:**
     - Để đảm bảo tính nguyên tử cùng giao dịch lưu DB:
       - Trong `ManufacturingSheetOCRModal.tsx` (khi `dryRunOverride === false` và có `selectedFile`), hoặc gửi kèm ảnh đã nén (`maxDimension = 1920, quality = 0.85`) / hoặc upload lên bucket `equipment-photos` theo đường dẫn chuẩn `ocr-sheets/${cleanCode}_${timestamp}.jpg` trước khi gọi `/api/ocr/save`, rồi truyền `sheet_photo: { storage_path, file_name, file_size_bytes, mime_type }` vào payload `/api/ocr/save`.
       - Bên trong giao dịch của `/api/ocr/save/route.ts`, sau khi xác định được `moldEquipmentId`, hệ thống `INSERT` trực tiếp bản ghi vào `public.equipment_photos`:
         - `equipment_id`: `moldEquipmentId`
         - `storage_path`: `body.sheet_photo.storage_path`
         - `file_name`: `body.sheet_photo.file_name`
         - `file_size_bytes`: `body.sheet_photo.file_size_bytes`
         - `mime_type`: `'image/jpeg'`
         - `photo_type`: `'DOCUMENT'` (hiển thị badge `工程票/図面` màu tím trong `EquipmentPhotoGallery.tsx`)
         - `caption`: `'新規金型製造工程票 (AI OCR 取込原本)'`
       - Nếu giao dịch DB bị rollback $\rightarrow$ `/api/ocr/save` (hoặc client `catch`) gọi `supabase.storage.from('equipment-photos').remove([storage_path])` để không để lại file rác trên Storage.
  2. **Privacy Blur Shield (`Rule 3 Global`):**
     - Toàn bộ khung hiển thị ảnh phiếu trong `ManufacturingSheetOCRModal.tsx` (cả Bước 1 `UPLOAD`, Bước 2 `REVIEW`, Bước 3 `SUCCESS`) và trong `EquipmentPhotoGallery.tsx` đều mặc định áp dụng `filter: blur(12px)` (`Privacy Blur Shield`), tự động làm rõ khi rê chuột (`:hover`), có nút bấm bật/tắt nhanh (`👁️ 表示 / 🔒 ぼかし`), và mở Lightbox chi tiết khi click.

### Hạng Mục 6: Chiến Lược Giao Dịch Nguyên Tử (Atomic Transaction) Cho Chuỗi Ghi Đa Bảng
- **Bối cảnh:** `/api/ocr/save/route.ts` ghi tuần tự qua 7 bảng: `products` $\rightarrow$ `design_revisions` $\rightarrow$ `work_orders` $\rightarrow$ `equipment` (`MOLD`, `CUTTER`, `PLUG`, `AUX`) $\rightarrow$ `equipment_assignments` $\rightarrow$ `jobs` $\rightarrow$ `job_steps` (+ `equipment_photos`).
- **So sánh 2 Phương án Kỹ thuật đệ trình PE chọn:**

| Tiêu Chí | **Phương Án A (Khuyến nghị): Server-Side PostgreSQL Transaction (`pg` Pool `BEGIN...COMMIT/ROLLBACK`) ngay trong `/api/ocr/save/route.ts`** | **Phương Án B: PostgreSQL Stored Procedure (`public.rpc_save_ocr_manufacturing_sheet(p_payload jsonb)`)** |
| :--- | :--- | :--- |
| **Tính nguyên tử (ACID)** | **100% ACID** — Mở 1 kết nối `pg` (`process.env.DATABASE_URL`), chạy `BEGIN`, thực thi toàn bộ chuỗi đọc/ghi trên cùng 1 transaction, lỗi bất kỳ bước nào sẽ `ROLLBACK` sạch sẽ 100%. | **100% ACID** — Chạy trong thân hàm PL/pgSQL. |
| **Hỗ trợ chế độ `dry_run: true`** | **Ưu việt tuyệt đối:** Chạy chính xác 100% câu lệnh thật trong `BEGIN` để thu thập `dry_run_logs` và kiểm tra mọi ràng buộc FK/Unique thật, sau đó gọi **`ROLLBACK`** ở cuối khối `dry_run`! | Phải viết nhánh `IF p_dry_run THEN ...` hoặc `RAISE EXCEPTION` giả lập trong PL/pgSQL. |
| **Thay đổi Schema / DDL (`RULE-PROC-03`)** | **Không phát sinh DDL mới** trên DB (0 migration, 0 nguy cơ lệch hàm giữa code và DB). Vẫn kiểm tra xác thực user qua `supabase.auth.getUser()` ở đầu route. | Cần tạo hàm RPC mới trên DB $\rightarrow$ Bắt buộc走 quy trình **2 cổng PE** (`Gate 1 Dry-run CREATE FUNCTION` $\rightarrow$ `Gate 2 COMMIT`). |
| **Bảo trì & Debug TypeScript** | Giữ nguyên toàn bộ kiểu dữ liệu TypeScript và helper `lookupCavType`, `calculateTargetCompletionDate` tại tầng Server Route. | Phải chuyển logic tính ngày lịch công ty (`companyCalendar.ts`) và `lookupCavType` sang SQL hoặc tính trước ở TS rồi truyền JSONB lớn. |

👉 **Đề xuất của AN:** Khuyến nghị chọn **Phương Án A** (bọc toàn bộ chuỗi ghi trong `BEGIN ... COMMIT / ROLLBACK` bằng `pg` Client trên cùng kết nối trong `/api/ocr/save/route.ts`, đồng thời tận dụng `BEGIN ... ROLLBACK` cho chế độ `dry_run: true`). Nếu PE muốn tạo thêm RPC hoặc muốn dọn luôn dữ liệu lịch sử (`DES-JAE380` + `24` dòng `equipment.company_id`), AN sẵn sàng thực hiện theo chỉ thị của PE.

### Hạng Mục 7: Hỗ Trợ Dán Nội Dung Email Khách Hàng (`Image + Email Text`)
- **Tọa độ:**
  - [`src/components/ocr/ManufacturingSheetOCRModal.tsx#L789-L835`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/components/ocr/ManufacturingSheetOCRModal.tsx#L789-L835) (UI Bước 1 `UPLOAD`) & [`#L960`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/components/ocr/ManufacturingSheetOCRModal.tsx#L960) (Banner đối chiếu ở Bước 2 `REVIEW`).
  - [`src/app/api/ocr/extract/route.ts#L291-L313`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/extract/route.ts#L291-L313) & [`#L330-L468`](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/src/app/api/ocr/extract/route.ts#L330-L468).
- **Thiết kế luồng dữ liệu:**
  1. Trên `ManufacturingSheetOCRModal.tsx` (Bước 1 `UPLOAD`):
     - Thêm state `emailText: string` và khung nhập liệu mở rộng **`📧 客先メール・補足テキスト (Nội dung Email / Ghi chú đặt hàng — Tùy chọn)`** (`<textarea rows={4} />`).
     - Khi nhấn `✨ AI OCR 解析開始`, đính kèm `bodyFormData.append('emailText', emailText.trim())` nếu có.
  2. Trên `/api/ocr/extract/route.ts`:
     - Đọc `emailText` từ `formData.get('emailText')` (hoặc `body.emailText`).
     - Nếu `emailText` có nội dung, bổ sung mục **`6. Customer Email Cross-Check & Enrichment`** vào `systemPrompt` và thêm part `{ text: "【客先メール・補足テキスト】\n" + emailText }` vào `promptPayload.contents[0].parts`:
       - Lấy thông số kỹ thuật khuôn/dao (`design_length/width/depth`, `cutline_length/width`, `components`) từ ảnh phiếu `新規金型製造工程票` làm gốc.
       - Bổ sung/làm rõ `customer_name`, `customer_product_name`, `shipping_deadline`, `mold_deadline`, `packaging_info`, `cost_amount` từ nội dung Email nếu trên phiếu viết tắt hoặc bỏ trống.
       - Trả thêm trường `email_cross_check_notes: string | null` tóm tắt các thông tin được bổ sung từ Email hoặc cảnh báo nếu phát hiện lệch ngày giao hàng / số lượng giữa Email và Phiếu công trình.
  3. Trên `ManufacturingSheetOCRModal.tsx` (Bước 2 `REVIEW`):
     - Nếu `email_cross_check_notes` có giá trị, hiển thị hộp thông báo màu xanh/vàng ở đầu cột phải để kỹ sư kiểm tra đối chiếu ngay.

---

## 4. Điểm Chờ PE Phê Duyệt Để Chuyển Sang Pha 2 (`[THI CÔNG]`)

Xin PE thẩm tra và cho chỉ thị **`GO`** đối với:
1. **7 hạng mục thiết kế kỹ thuật** nêu trên.
2. **Lựa chọn Phương án Transaction ở Hạng mục 6:**
   - **Phương án A (Khuyến nghị):** Bọc Transaction `BEGIN ... COMMIT / ROLLBACK` trực tiếp qua `pg` client trong `/api/ocr/save/route.ts` (hỗ trợ cả `dry_run` bằng `BEGIN ... ROLLBACK`, không cần DDL migration).
   - **Phương án B:** Tạo hàm RPC PL/pgSQL (qua 2 cổng PE).
3. **Làm sạch dữ liệu tồn đọng nhỏ liên quan (Tùy chọn):** Có cần cập nhật luôn bản ghi `DES-JAE380` (`equipment_id = 'f4ca591a-17d2-41af-b2f7-f969b6dd2e4f'`) và đưa `26` dòng `equipment.company_id` đang trỏ nhầm vào công ty `CUSTOMER` về `NULL` (hoặc giữ nguyên) không?
