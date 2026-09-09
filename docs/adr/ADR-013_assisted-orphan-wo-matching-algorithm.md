# ADR-013: Thuật toán Đối soát & Khớp Bán tự động cho 561 Work Orders Mồ Côi (M23-A Follow-up)

- **Ngày:** 2026-09-09
- **Trạng thái:** DRAFT (Chờ PE review & phê duyệt)
- **Người đề xuất:** AN (Antigravity Executing Agent)
- **Người thẩm định:** PE (Project Engineer)
- **Tham chiếu:** Chỉ thị #047, Chỉ thị #051, Migration 104-A, View `v_product_stock_summary`

---

## 1. Bối cảnh (Context)

1. **Kết quả Migration 104-A:**
   - Đã backfill thành công `product_id` cho **641 Work Orders** dựa trên quy tắc **EXACT MATCH** tuyệt đối:
     ```sql
     TRIM(wo.wo_name) = p.product_code AND (SELECT COUNT(*) FROM products p2 WHERE p2.product_code = p.product_code) = 1
     ```
   - Tỷ lệ khớp hiện tại đạt **53.4%** (642/1,203 WOs).
   - View tồn kho thành phẩm `v_product_stock_summary` đã chạy ổn định với 8,488 sản phẩm ACTIVE.

2. **Vấn đề tồn tại với 561 WOs còn lại (Orphan Work Orders):**
   - Còn **561 WOs** chưa có `product_id` (`product_id IS NULL`).
   - Kiểm toán cho thấy có các nhóm nguyên nhân sau:
     - **Nhóm Ambiguous Matches (Đa nghĩa):** `TE-243252-1`, `MTM-179 3.4CAV VN`, `KSP-203`, `DIC-058`, `DIC-155` — mỗi mã khớp với từ 2 sản phẩm khác nhau trong DB (khác hậu tố revision hoặc khác công ty).
     - **Nhóm Hậu tố Phiên bản / Quy cách (Suffix Variation):** Tên WO chứa các chuỗi như `R1`, `R2`, `3.4CAV`, `VN`, `REV2`, `改` trong khi `product_code` trong bảng `products` là mã compact hoặc mã chuẩn (ví dụ: `MTM-179`).
     - **Nhóm Khác biệt Ký tự Phân tách (Delimiter Variation):** Tên WO dùng gạch dưới `_`, khoảng trắng ` `, hoặc gạch ngang `-` không nhất quán với `product_code`.
     - **Nhóm Tên Mô tả Tự do (Legacy Access Free-text):** Một số WO thời kỳ cũ được ghi theo tên mô tả sản phẩm (品名) thay vì mã định danh.

3. **Nguy cơ tiềm ẩn nếu tự động chạy UPDATE hàng loạt không kiểm soát:**
   - Nếu đoán sai `product_id`, sản lượng dập khay (`quantity_done`) từ `work_logs` sẽ bị cộng dồn nhầm sang mã sản phẩm khác -> Tồn kho thành phẩm tính sai vĩnh viễn, ảnh hưởng trực tiếp đến xuất hàng và MRP.

---

## 2. Quyết định Đề xuất (Proposed Decisions)

### Quyết định 1: Phân loại 561 WO thành 3 Bậc Độ Tin cậy (Confidence Tiering)

| Bậc (Tier) | Tiêu chí nhận diện | Độ tin cậy (Confidence) | Phương thức xử lý |
|---|---|:---:|---|
| **Tier 1 — High Confidence (>= 90%)** | Mã WO sau khi chuẩn hóa regex (bỏ khoảng trắng thừa, bỏ các hậu tố thông dụng `R[0-9]+`, `VN`, `CAV`) khớp CHÍNH XÁC với DUY NHẤT 1 sản phẩm có cùng Khách hàng (`company_id`). | 🟢 Cao | Đề xuất danh sách Dry-run cho PE duyệt trước khi chạy script SQL. |
| **Tier 2 — Medium Confidence (50% - 89%)** | Mã WO khớp với 2+ sản phẩm (Ambiguous), HOẶC có độ tương đồng Levenshtein/Trigram similarity >= 0.75 với sản phẩm thuộc cùng Khách hàng. | 🟡 Trung bình | **BẮT BUỘC** qua giao diện Đối soát Bán tự động (Assisted Matching UI) để con người xác nhận 1-click. |
| **Tier 3 — Low Confidence (< 50%)** | Tên WO là văn bản tự do, không tìm thấy sản phẩm tương đồng, hoặc không có thông tin khách hàng đối chiếu. | 🔴 Thấp | Đánh dấu là `MANUAL_REVIEW_REQUIRED`. Người dùng tra cứu thủ công từ Product Center. |

---

### Quyết định 2: Thuật toán Tiền xử lý & Tính Điểm Tương Đồng (Matching Heuristics)

Thuật toán chuẩn hóa chuỗi tên WO:
```typescript
function normalizeWoNameForMatching(woName: string): string {
  return woName
    .trim()
    .toUpperCase()
    // Bỏ hậu tố revision dạng R1, R2, R-1, REV.A...
    .replace(/[ -]?(R[0-9]+|REV[0-9A-Z]*|改[0-9]*)$/i, '')
    // Bỏ các tag địa lý / công xưởng: VN, VN1, VN2, YSD
    .replace(/[ -]?(VN[0-9]*|YSD)$/i, '')
    // Bỏ ghi chú khuôn: 3.4CAV, 2CAV, 4CAV...
    .replace(/[ -]?[0-9.]+CAV$/i, '')
    // Chuẩn hóa khoảng trắng và gạch ngang
    .replace(/[ _]+/g, '-')
    .trim();
}
```

Điểm tương đồng (Score S trong [0, 100]) được tính bằng hàm trọng số:
- S = 0.5 * StringSimilarity + 0.3 * SameCustomerBonus + 0.2 * ActiveProductBonus
- SameCustomerBonus = 100 nếu WO (qua đơn hàng/máy) có cùng company_id với sản phẩm, ngược lại = 0.
- ActiveProductBonus = 100 nếu sản phẩm có trạng thái product_status = 'ACTIVE'.

---

### Quyết định 3: Giao diện Đối soát Bán tự động (Assisted Matching Drawer)
- **Vị trí tích hợp:** Bổ sung tab phụ hoặc Drawer **「WO未紐付整理」(Khớp WO mồ côi)** tại Product Center hoặc Inventory.
- **Cơ chế hoạt động:**
  1. Hiển thị danh sách các WO chưa có product_id, sắp xếp theo thứ tự ưu tiên (các WO có work_logs nhiều giờ công hoặc sản lượng lớn lên trước).
  2. Với mỗi dòng WO, hệ thống tự động chạy thuật toán gợi ý **Top 3 sản phẩm có điểm tương đồng cao nhất**.
  3. Kèm theo nhãn cảnh báo rõ ràng: Khách hàng, Mã sản phẩm, Thông số khay, Số sản phẩm trùng khớp.
  4. Người dùng chỉ cần bấm **「✓ 確定」(Xác nhận)** -> Hệ thống thực thi Server Action cập nhật work_orders.product_id tức thì.

---

## 3. Lộ trình Thực thi & Cam kết An toàn

1. **Giai đoạn 1 (Draft ADR & Thu thập ý kiến):** PE xem xét và phê duyệt thuật toán tại ADR này.
2. **Giai đoạn 2 (Dry-run Report Tier 1):** Xuất file JSON phân tích chi tiết toàn bộ 561 WOs, chia rõ Tier 1, Tier 2, Tier 3 gửi PE thẩm định trước.
3. **Giai đoạn 3 (Xây dựng UI Assisted Matching):** Chỉ triển khai sau khi PE approve chính thức.

---

## 4. Hệ quả & Tác động (Consequences)

### Tích cực:
- Nâng tỷ lệ khớp của 1,203 WOs từ 53.4% lên ước tính **92% - 97%**.
- Tồn kho thành phẩm tính từ v_product_stock_summary đạt độ chính xác gần như tuyệt đối.
- Loại bỏ hoàn toàn rủi ro sai lệch dữ liệu do tự động ép khớp mù.

### Tiêu cực / Rủi ro:
- Cần thời gian kiểm toán bán tự động của người dùng đối với các ca đa nghĩa phức tạp (ước tính khoảng 50 - 80 WOs).
