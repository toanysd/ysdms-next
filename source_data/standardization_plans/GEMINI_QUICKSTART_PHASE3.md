# 🤖 HƯỚNG DẪN CHO GEMINI THỰC HIỆN PHASE 3
# ⚠️ FILE NÀY KHÔNG ĐƯỢC GHI ĐÈ

## PROMPT CHO GEMINI (Copy & Paste)

---

Hãy đọc file plan Phase 3 tại đường dẫn sau và thực hiện ĐÚNG theo hướng dẫn:

```
source_data/standardization_plans/PHASE3_MOLD_STANDARDIZATION.md
```

**Yêu cầu cụ thể:**

1. ĐỌC file plan Phase 3 TRƯỚC KHI bắt đầu.
2. Nắm vững **4 Quy tắc Bảo lưu (Rule P1, P2, P3, P4)**:
   - Rule P1: TUYỆT ĐỐI BẢO LƯU các trường thông số/vị trí kệ/liên kết jobs đã xác thực trong DB hiện tại.
   - Rule P2: CHỈ BỔ SUNG (Enrich) các trường bị NULL/trống từ dữ liệu quét trên Server.
   - Rule P3: THÊM MỚI các khuôn trên Server chưa từng có trong DB.
   - Rule P4: Chuẩn hóa liên kết với `company_id` (Phase 1) và `product_id` (Phase 2).
3. Tạo và chạy 4 script Python trong `source_data/scripts/`:
   - `scan_server_molds.py` — Quét thư mục CAD server & file Excel lưu trữ.
   - `export_db_equipment.py` — Export DB equipment snapshot.
   - `reconcile_molds.py` — Đối chiếu và áp dụng Rule P1-P4 để tạo JSON kết hợp.
   - `import_phase3_rest.py` — Upsert an toàn lên Supabase DB qua REST API.
4. APPEND kết quả vào cuối file `PHASE3_MOLD_STANDARDIZATION.md` và `MASTER_PLAN.md`.

**Quy tắc BẮT BUỘC:**
- Bắt đầu và kết thúc mọi câu trả lời bằng `TRẢ LỜI TỪ AN`.
- KHÔNG commit/push git.
- KHÔNG xóa hoặc ghi đè dữ liệu khuôn đã được xác thực trong DB.
- Chỉ thao tác trong `source_data/`.

---
