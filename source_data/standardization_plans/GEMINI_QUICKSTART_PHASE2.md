# 🤖 HƯỚNG DẪN CHO GEMINI THỰC HIỆN PHASE 2
# ⚠️ FILE NÀY KHÔNG ĐƯỢC GHI ĐÈ

## PROMPT CHO GEMINI (Copy & Paste)

---

Hãy đọc file plan Phase 2 tại đường dẫn sau và thực hiện ĐÚNG theo hướng dẫn:

```
source_data/standardization_plans/PHASE2_PRODUCT_STANDARDIZATION.md
```

**Yêu cầu cụ thể:**

1. ĐỌC file plan Phase 2 TRƯỚC KHI bắt đầu.
2. Tạo 4 script Python trong `source_data/scripts/`:
   - `parse_products.py` — Parse 3,872 sản phẩm khay từ sheet `トレイデータ一覧表`, apply Rule 1-3.
   - `generate_products_sql.py` — Sinh SQL INSERT/UPSERT cho bảng `products`.
   - `validate_products.py` — Validation kiểm tra dữ liệu đầu ra.
   - `import_phase2_rest.py` — Upsert dữ liệu lên Supabase DB qua REST API.
3. CHẠY lần lượt các script và kiểm tra kết quả validation.
4. APPEND kết quả vào cuối file `PHASE2_PRODUCT_STANDARDIZATION.md` và `MASTER_PLAN.md`.

**Quy tắc BẮT BUỘC:**
- Bắt đầu và kết thúc mọi câu trả lời bằng `TRẢ LỜI TỪ AN`.
- KHÔNG commit/push git.
- KHÔNG sửa source code ứng dụng trong `src/`.
- Chỉ thao tác trong `source_data/`.

---
