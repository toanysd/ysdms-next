# 🤖 HƯỚNG DẪN CHO GEMINI THỰC HIỆN PHASE 1
# ⚠️ FILE NÀY KHÔNG ĐƯỢC GHI ĐÈ

## PROMPT CHO GEMINI (Copy & Paste)

---

Hãy đọc file plan Phase 1 tại đường dẫn sau và thực hiện ĐÚNG theo hướng dẫn:

```
source_data/standardization_plans/PHASE1_COMPANY_STANDARDIZATION.md
```

**Yêu cầu cụ thể:**

1. ĐỌC file plan Phase 1 TRƯỚC KHI bắt đầu
2. Tạo 4 script Python trong `source_data/scripts/`:
   - `normalize_companies.py` — Chuẩn hóa tên công ty (Rule 1-5)
   - `extract_delivery_sites.py` — Tách delivery sites (Rule 6)
   - `generate_migration_sql.py` — Tạo SQL migration
   - `validate_output.py` — Kiểm tra output
3. CHẠY từng script theo thứ tự và báo cáo kết quả
4. KHÔNG chạy SQL trên production, chỉ tạo file .sql
5. KHÔNG ghi đè file plan — chỉ APPEND kết quả vào cuối file plan
6. Sau khi hoàn thành, cập nhật kết quả vào `MASTER_PLAN.md`

**Quy tắc BẮT BUỘC của dự án:**
- Đọc file `AGENTS.md` ở root dự án trước khi bắt đầu
- Bắt đầu và kết thúc mọi câu trả lời bằng `TRẢ LỜI TỪ AN`
- KHÔNG commit/push git
- KHÔNG thay đổi source code của ứng dụng
- Chỉ làm việc trong thư mục `source_data/`

---

## KIỂM TRA SAU KHI GEMINI LÀM XONG

Sau khi Gemini hoàn thành, Claude sẽ:
1. Đọc output files: `company_normalized.json`, `delivery_sites_normalized.json`
2. Review `company_migration.sql`
3. Kiểm tra validation results
4. Tổng hợp và báo cáo
5. Quyết định có cần fix gì không

