# PHÂN TÍCH CHUYÊN SÂU CƠ CHẾ DEDUPLICATION & ĐỀ XUẤT KIẾN TRÚC BỀN VỮNG (PHASE R2-B)

- **Người thực hiện:** AN (Kỹ sư triển khai)
- **Người nhận:** PE (Trưởng dự án) & Anh Thoan (Product Owner)
- **Ngày lập:** 2026-08-20
- **Tài liệu tham chiếu:** `temp_ai/R2B_proposal.md`, `temp_ai/R2_verification_report.md`

---

## 1. TRẢ LỜI CÂU HỎI 1: CƠ CHẾ PHÂN ĐỊNH RÕ RÀNG NGUỒN GHI (EXPLICIT ORIGIN vs HEURISTIC TIME WINDOW)

### 🔴 Điểm yếu của Heuristic Time Window (2 giây)
Cơ chế hiện tại dùng câu truy vấn:
```sql
SELECT EXISTS (
    SELECT 1 FROM product_lifecycle_logs
    WHERE product_id = NEW.product_id
      AND to_status = NEW.product_lifecycle_status
      AND created_at >= (now() - interval '2 seconds')
)
```
Đây là phương pháp **"đoán định xác suất" (Heuristic Estimation)**, tồn tại 2 rủi ro kỹ thuật:
1. **Clock Jitter / Async Latency:** Nếu Server Action gặp độ trễ mạng hoặc tải server cao khiến thời gian giữa lúc chèn `product_lifecycle_logs` và lúc `UPDATE products` vượt quá 2 giây $\rightarrow$ Trigger sẽ ghi thêm 1 dòng nữa (Double Write).
2. **False Suppression:** Nếu có 2 sự kiện hợp lệ liên tiếp chuyển trạng thái trong vòng dưới 2 giây $\rightarrow$ Sự kiện thứ 2 bị nuốt mất (mất vết dữ liệu).

### 🟢 Giải pháp Phân định Tường minh (100% Deterministic)
Thay vì đo thời gian, Postgres hỗ trợ cơ chế **Session Configuration Parameter** (`SET LOCAL` và `current_setting()`).

#### Cơ chế hoạt động:
1. **Khi thực thi từ Server Action / RPC:**
   Chạy lệnh cấu hình cục bộ trong transaction:
   ```sql
   SET LOCAL app.bypass_lifecycle_trigger = 'true';
   ```
2. **Khi Trigger `trg_product_lifecycle_audit` kích hoạt:**
   Trigger kiểm tra biến cấu hình session:
   ```sql
   IF current_setting('app.bypass_lifecycle_trigger', true) = 'true' THEN
       -- Đã được Server Action/RPC xử lý ghi log tường minh -> Bỏ qua, không ghi đúp!
       RETURN NEW;
   END IF;
   ```
3. **Khi thực thi trực tiếp từ SQL Console / Script / DBeaver:**
   Biến `app.bypass_lifecycle_trigger` không tồn tại hoặc bằng `false` $\rightarrow$ Trigger **chắc chắn 100%** kích hoạt và ghi log `SYSTEM_UPDATE` với `changed_by = NULL`, `reason = 'SYSTEM: ...'`.

---

## 2. TRẢ LỜI CÂU HỎI 2: RỦI RO KHI NHIỀU NHÂN VIÊN DUYỆT ĐỒNG THỜI (CONCURRENT HIGH-LOAD RISK)

### 🔍 Phân tích Kịch bản Đồng thời
**Tình huống:** Nhân viên A duyệt `REV-1` và Nhân viên B duyệt `REV-2` của cùng 1 sản phẩm `P-001` trong vòng 2 giây.

1. **Trường hợp trạng thái mục tiêu giống nhau (`DESIGN` $\rightarrow$ `PROTOTYPE`):**
   - Nhân viên A duyệt `REV-1` $\rightarrow$ Server Action ghi log A (`ref_id = REV-1`), update `products` sang `PROTOTYPE`.
   - Nhân viên B duyệt `REV-2` ngay sau đó 0.3 giây $\rightarrow$ Server Action ghi log B (`ref_id = REV-2`). Khi chạy lệnh `UPDATE products SET product_lifecycle_status = 'PROTOTYPE'`, vì giá trị cũ và mới đều là `PROTOTYPE` (`OLD.status IS NOT DISTINCT FROM NEW.status`) nên Postgres Trigger không bị trigger. Log B vẫn được ghi lại bởi Server Action.
2. **Trường hợp nguy hiểm (Direct Script song song với Server Action):**
   - Nếu Nhân viên A duyệt qua Server Action (chuyển sang `APPROVED`).
   - Cùng lúc đó (trong 2s), một script bảo trì chạy UPDATE direct sản phẩm đó sang `APPROVED`.
   - Với heuristic time-window 2s $\rightarrow$ Trigger hiểu nhầm lệnh direct script là của Server Action $\rightarrow$ **Nuốt mất log của direct script!**

👉 **Kết luận:** Heuristic 2 giây **không an toàn** cho môi trường đa tiến trình (concurrency). Bắt buộc phải thay thế bằng cơ chế phân định tường minh.

---

## 3. TRẢ LỜI CÂU HỎI 3: ĐỀ XUẤT KIẾN TRÚC BỀN VỮNG TOÀN DIỆN

AN đề xuất **Phương án Tối ưu: Atomic RPC Function + Session Flag Trigger (Phương án A)**.

### 📐 So sánh các phương án kỹ thuật:

| Tiêu chí | Phương án Heuristic (Cũ) | Phương án Trigger-Only | Phương án Unique Constraint | **Phương án A: Atomic RPC + Session Flag (Đề xuất)** |
|---|---|---|---|---|
| **Cơ chế** | So khớp thời gian `created_at >= now() - 2s` | Bỏ log ở Action, Trigger ghi 100% | Unique index trên `(product_id, ref_id)` | 1 Hàm RPC bao bọc Transaction + `SET LOCAL` |
| **Tính xác thực (Determinism)** | ❌ 95% (Có xác suất lỗi jitter) | ✅ 100% | ⚠️ Chỉ áp dụng khi có `ref_id` | ✅ **100% Tuyệt đối** |
| **Ngữ cảnh nghiệp vụ (Rich Context)** | ✅ Có | ❌ Kém (Trigger không lấy được lý do chi tiết từ client) | ✅ Có | ✅ **Đầy đủ (lý do, phản hồi KH, người duyệt)** |
| **Tính nguyên tử (ACID Atomicity)** | ❌ 2 lệnh riêng biệt (chèn log + update prod) | ✅ 1 lệnh | ❌ 2 lệnh | ✅ **Hoàn hảo (Tất cả trong 1 Transaction)** |
| **Lưới an toàn Direct SQL** | ⚠️ Bị ảnh hưởng bởi window | ✅ Có | ❌ Không bắt được | ✅ **Tự động bắt 100% khi không qua RPC** |

---

### 🛠️ Thiết kế Kỹ thuật Chi tiết cho Phương án A (Atomic RPC + Session Flag)

#### 1. Hàm RPC Postgres: `fn_transition_product_lifecycle`
```sql
CREATE OR REPLACE FUNCTION public.fn_transition_product_lifecycle(
    p_product_id UUID,
    p_to_status product_lifecycle_status,
    p_trigger_event TEXT,
    p_reference_table TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_reason TEXT DEFAULT NULL,
    p_changed_by UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_from_status product_lifecycle_status;
    v_log_id UUID;
BEGIN
    -- 1. Lấy trạng thái hiện tại (Lock dòng để tránh race condition)
    SELECT product_lifecycle_status INTO v_from_status
    FROM public.products
    WHERE product_id = p_product_id
    FOR UPDATE;

    -- 2. Kiểm tra validation lý do nếu là MANUAL_OVERRIDE
    IF p_trigger_event = 'MANUAL_OVERRIDE' AND (p_reason IS NULL OR trim(p_reason) = '') THEN
        RAISE EXCEPTION 'Bắt buộc phải nhập lý do khi thay đổi trạng thái thủ công (MANUAL_OVERRIDE)';
    END IF;

    -- 3. Đánh dấu cờ session: Báo cho Trigger biết lệnh này đã được ghi log tường minh
    PERFORM set_config('app.bypass_lifecycle_trigger', 'true', true);

    -- 4. Ghi nhận Audit Log
    INSERT INTO public.product_lifecycle_logs (
        product_id,
        from_status,
        to_status,
        trigger_event,
        reference_table,
        reference_id,
        changed_by,
        reason,
        metadata
    ) VALUES (
        p_product_id,
        v_from_status,
        p_to_status,
        p_trigger_event,
        p_reference_table,
        p_reference_id,
        COALESCE(p_changed_by, auth.uid()),
        p_reason,
        p_metadata
    ) RETURNING log_id INTO v_log_id;

    -- 5. Cập nhật bảng products
    UPDATE public.products
    SET 
        product_lifecycle_status = p_to_status,
        updated_at = now()
    WHERE product_id = p_product_id;

    RETURN v_log_id;
END;
$$;
```

#### 2. Trigger an toàn: `trg_product_lifecycle_audit` (Được rút gọn sạch sẽ)
```sql
CREATE OR REPLACE FUNCTION public.fn_trg_product_lifecycle_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_changed_by UUID := NULL;
    v_app_bypass TEXT;
BEGIN
    -- 1. Kiểm tra session flag: Nếu được gọi từ fn_transition_product_lifecycle -> BỎ QUA NGAY
    BEGIN
        v_app_bypass := current_setting('app.bypass_lifecycle_trigger', true);
    EXCEPTION WHEN OTHERS THEN
        v_app_bypass := 'false';
    END;

    IF v_app_bypass = 'true' THEN
        RETURN NEW;
    END IF;

    -- 2. Nếu không có flag -> Đây là UPDATE direct từ SQL Console / Migration bên ngoài
    BEGIN
        v_changed_by := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        v_changed_by := NULL;
    END;

    -- 3. Tự động chèn log SYSTEM_UPDATE
    INSERT INTO public.product_lifecycle_logs (
        product_id,
        from_status,
        to_status,
        trigger_event,
        reference_table,
        reference_id,
        changed_by,
        reason
    ) VALUES (
        NEW.product_id,
        OLD.product_lifecycle_status,
        NEW.product_lifecycle_status,
        'SYSTEM_UPDATE',
        NULL,
        NULL,
        v_changed_by,
        COALESCE(
            'SYSTEM: Tự động ghi nhận thay đổi trực tiếp sang ' || NEW.product_lifecycle_status::text,
            'SYSTEM: Direct database update'
        )
    );

    RETURN NEW;
END;
$$;
```

---

## 4. KẾ HOẠCH NÂNG CẤP (NẾU ĐƯỢC PE DUYỆT)
1. Tạo migration `20260820120000_r2b_deterministic_rpc_trigger.sql` triển khai `fn_transition_product_lifecycle` và cập nhật `fn_trg_product_lifecycle_audit`.
2. Cập nhật nhẹ các hàm trong `src/app/actions/product-lifecycle.ts`, `design-approval.ts`, `sample-requests.ts` để gọi `supabase.rpc('fn_transition_product_lifecycle', ...)`.
3. Toàn bộ UI (`R2-C`) và quy trình nghiệp vụ giữ nguyên 100% vì giao diện chỉ tương tác qua Server Actions.

---

## 5. XÁC NHẬN DỌN DẸP DỮ LIỆU TEST
AN xác nhận bản ghi kiểm thử `product_id = '6cfcab36-95c1-468d-a1de-3f1b515a6b14'` (`TEST-R2-VERIFY`) đã được xóa sạch sẽ (0 bản ghi tồn dư trong `products` và `product_lifecycle_logs`). Cơ sở dữ liệu hiện hoàn toàn tinh sạch sẵn sàng cho Phase R3.
