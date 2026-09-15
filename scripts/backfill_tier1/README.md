# Quy Trình Backfill Quan Hệ Gá Lắp SET (Tier 1 - Gold Match) Cho equipment_assignments

Tài liệu hướng dẫn và đối chiếu thực thi Chốt chặn 2 cho 1.520 cặp Tier 1 còn lại.

> ⚠️ **LƯU Ý LỊCH SỬ QUAN TRỌNG (HISTORICAL REFERENCE ONLY)**:
> Các file script SQL trong thư mục này (`batch_2a_500.sql`, `batch_2b_500.sql`, `batch_2c_520.sql`, `full_batch_1520.sql`) **KHÔNG PHẢI SCRIPT ĐÃ THỰC THI THẬT TRÊN PRODUCTION**.
> Dữ liệu thực tế **1.577 dòng** đã được PE trực tiếp phân bổ và thực thi độc lập (qua các lô `AUTO_BACKFILL_TIER1_FULL_LOT1_PE`, `LOT2_PE`, `LOT3_PE`). Thư mục này chỉ được lưu lại làm tài liệu tham khảo lịch sử đối chiếu logic.

---

## 1. Câu SQL Nguyên Văn Tính Ra 1.571 Cặp Tier 1 (Gold Match)

Tiêu chuẩn Tier 1 quy định: Thiết bị phải cùng bản vẽ CAD (`design_revision_id`), đồng thời thỏa mãn ít nhất một trong hai tiêu chí:
- **Tiêu chí 1**: Trùng Tên hiển thị xưởng (`display_name`) sau khi chuẩn hóa chữ hoa và khoảng trắng.
- **Tiêu chí 2**: Trùng Mã cơ sở sau khi loại bỏ tiền tố `C-`, hậu tố số biến thể `-N`, và các ký tự phi chữ-số.

### Câu lệnh SQL truy vấn đối chiếu:

```sql
SELECT 
  count(*) AS total_tier1_pairs
FROM public.equipment c
JOIN public.equipment m 
  ON m.design_revision_id = c.design_revision_id
  AND m.equipment_type = 'MOLD'
WHERE c.equipment_type IN ('CUTTER_SEPARATE', 'CUTTER_INLINE')
  AND c.design_revision_id IS NOT NULL
  AND (
    -- Tiêu chí 1: Trùng Tên hiển thị xưởng (sau khi TRIM và UPPER)
    (
      c.display_name IS NOT NULL 
      AND m.display_name IS NOT NULL 
      AND UPPER(TRIM(c.display_name)) = UPPER(TRIM(m.display_name))
    )
    OR
    -- Tiêu chí 2: Trùng Mã thiết bị cơ sở (bỏ tiền tố C-, bỏ hậu tố -N, bỏ ký tự phi chữ-số)
    (
      UPPER(REGEXP_REPLACE(REGEXP_REPLACE(c.equipment_code, '^C-', '', 'i'), '(-[0-9]+$|[^a-zA-Z0-9])', '', 'g')) =
      UPPER(REGEXP_REPLACE(REGEXP_REPLACE(m.equipment_code, '^C-', '', 'i'), '(-[0-9]+$|[^a-zA-Z0-9])', '', 'g'))
    )
  );
```

---

## 2. Giải Trình Chênh Lệch Giữa 1.422 Cặp (PE đo) và 1.571 Cặp (AN đo)

Chênh lệch **149 cặp (~9.5%)** phát sinh từ 4 trường hợp đặc thù của dữ liệu sản xuất thực tế tại xưởng YSD:

1. **Trường hợp 1 (Chiếm đa số): Khuôn vật lý mang hậu tố `-2` thay vì dao**:
   - Ví dụ: Dao `OTAX011` ↔ Khuôn `OTAX011-2`, Dao `SKK005` ↔ Khuôn `SKK005-2`, Dao `TE61423` ↔ Khuôn `TE61423-2`, Dao `SLK121` ↔ Khuôn `SLK121-3`, Dao `MZT021` ↔ Khuôn `MZT021-2`.
   - Khi PE chỉ áp dụng `regexp_replace(c.equipment_code, '-[0-9]+$', '') = m.equipment_code`, phía dao được bỏ hậu tố nhưng phía khuôn không bỏ hậu tố, dẫn đến không khớp mã (`OTAX011` ≠ `OTAX011-2`). Tuy nhiên cả hai đều có `display_name = 'OTAX-011'` và cùng chung `design_revision_id`.
2. **Trường hợp 2: Chữ hoa / chữ thường**:
   - Ví dụ: Dao `smk180` (chữ thường) ↔ Khuôn `SMK180` (chữ hoa). Cùng `display_name = 'SMK-180'` và cùng `design_revision_id`.
3. **Trường hợp 3: Mã dao chứa thông số quy cách kích thước**:
   - Ví dụ: Dao `ADY(380x333)` ↔ Khuôn `ADY064`, Dao `DIC(405x310-4R15)` ↔ Khuôn `DIC105`.
   - Cả hai cùng có `display_name` giống nhau (`ADY-064`, `DIC-105`) và cùng chung `design_revision_id`.
4. **Trường hợp 4: Mã khuôn có hậu tố chất liệu nhựa**:
   - Ví dụ: Dao `SSJ015` ↔ Khuôn `SSJ015PP`. Cả hai cùng `display_name = 'SSJ-015'` và cùng chung `design_revision_id`.

Toàn bộ 149 cặp này đều là các cặp thiết bị thật của cùng một mã sản phẩm và cùng bản vẽ CAD gốc, hoàn toàn đủ điều kiện xếp vào Tier 1 (Gold Match).

---

## 3. Lộ Trình Thực Thi 3 Sub-Batch (Chốt Chặn 2)

Tổng số cặp Tier 1 còn lại: **1.520 cặp** (1.571 - 50 Pilot - 1 JAE380). Được chia thành 3 sub-batch:

| Sub-Batch | File SQL | Số Cặp | Số Dòng Trước Khi Chạy | Số Dòng Sau Khi Chạy (Kỳ vọng) | Nhãn Notes |
|---|---|---|---|---|---|
| **Batch 2A** | `scripts/backfill_tier1/batch_2a_500.sql` | 500 | 52 | **552** | `AUTO_BACKFILL_TIER1_BATCH_2A` |
| **Batch 2B** | `scripts/backfill_tier1/batch_2b_500.sql` | 500 | 552 | **1.052** | `AUTO_BACKFILL_TIER1_BATCH_2B` |
| **Batch 2C** | `scripts/backfill_tier1/batch_2c_520.sql` | 520 | 1.052 | **1.572** | `AUTO_BACKFILL_TIER1_BATCH_2C` |
