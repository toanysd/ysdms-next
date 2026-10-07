# QUY TẮC KÊNH ĐỌC HỒ SƠ PE ↔ AN
## (PE_AN_READ_CHANNEL_PROTOCOL — v1.0, 2026-10-07)

> **Cấp văn bản:** Quy chuẩn Phối hợp Kỹ thuật & Kiểm toán (Technical Coordination Protocol)  
> **Phiên bản:** 1.0  
> **Ngày ban hành:** 2026-10-07  
> **Bên ban hành & chấp thuận:** Kiến trúc sư trưởng PE & Minh Chủ THOAN  
> **Bên thực thi:** Kỹ sư thi công AN (Antigravity)

---

## 1. NGUYÊN TẮC GỐC
- **Nguyên tắc Kiểm chứng Độc lập:** PE chỉ phê duyệt nội dung kỹ thuật mà PE **TỰ đọc được** trực tiếp qua một trong các kênh đã kiểm chứng trong môi trường sandbox của PE.
- **Nguyên tắc Môi trường Mạng:** Tuyên bố *"AN test HTTP 200 từ terminal AN"* **KHÔNG tự động đồng nghĩa với việc *"PE đọc được"*** (do môi trường mạng sandbox của Perplexity có chính sách bảo mật, DNS và WAF riêng biệt).
- **Nguyên tắc Pilot:** Mọi kênh đọc tự động mới bắt buộc phải được PE pilot thử nghiệm thực tế bằng công cụ `fetch_url` trước khi đưa vào quy chuẩn chính thức.

---

## 2. CÁC KÊNH CHUẨN (ĐÃ KIỂM CHỨNG)
- **Kênh A (Mặc định cho file ≤ ~500 dòng hoặc ≤ ~50KB):**  
  - AN paste **TOÀN BỘ** nội dung vào chat trong **01 khối code block markdown duy nhất (1-Click Copy)** đặt ở dưới cùng của phản hồi.  
  - PE đọc trực tiếp từ chat và ra quyết định phê duyệt ngay lập tức.  
  - Minh Chủ THOAN chỉ cần 1 click copy chuyển tiếp, không phải tải hoặc đính kèm file.
- **Kênh B (Cho file > ~500 dòng):**  
  - Minh Chủ THOAN tải bản cập nhật mới nhất lên **Project Files** của Perplexity.  
  - PE sử dụng công cụ `file_explore` để đọc toàn văn tài liệu.  
  - (Kênh này phụ thuộc vào thao tác upload thủ công của THOAN).

---

## 3. KÊNH THÍ ĐIỂM (ĐANG TIẾN HÀNH PILOT)
- **Kênh C: Supabase Public Bucket (`ssot-artifacts`):**
  - **Mô tả:** AN sử dụng Supabase Client hoặc Storage API đẩy file tài liệu lên Bucket công khai `ssot-artifacts` trên hạ tầng Supabase Production.
  - **Cơ chế:** Cung cấp link HTTPS công khai không yêu cầu Authorization (`https://<project-ref>.supabase.co/storage/v1/object/public/ssot-artifacts/...`).
  - **Điều kiện Pilot:**  
    - AN upload file tài liệu thử nghiệm, gửi link HTTPS cho PE.  
    - PE chạy công cụ `fetch_url` trực tiếp trong môi trường của PE.  
    - **Nếu PE đọc thành công:** Nâng Kênh C thành **Kênh Chuẩn Thay Thế Kênh B**, giúp tự động hóa 100% quá trình chuyển giao tài liệu lớn mà THOAN không cần upload thủ công.  
    - **Nếu PE vẫn bị chặn:** Loại bỏ Kênh C khỏi quy trình, quay về Kênh A và Kênh B.

---

## 4. CÁC KÊNH KHÔNG SỬ DỤNG (ĐÃ FAIL THỬ NGHIỆM TỪ PE)
- ❌ **jsDelivr CDN (`cdn.jsdelivr.net`):** Công cụ `fetch_url` của PE báo lỗi "Failed to fetch content" do cơ chế chặn bot từ mạng Perplexity.
- ❌ **GitHub Raw / .patch / .diff:** Công cụ `fetch_url` của PE bị tường lửa mạng của GitHub/Perplexity chặn.
- ❌ **GitHub Connector (`get_file_contents`):** Chỉ trả về metadata/SHA, không giải mã hoặc không hiển thị text nội dung file.

---

## 5. NGHĨA VỤ CỦA KỸ SƯ THI CÔNG AN
1. Đối với file ngắn ($\le 500$ dòng): **Luôn paste toàn văn** trọn vẹn trong khối code block 1-click copy ở cuối báo cáo.
2. Đối với file dài ($> 500$ dòng): Đề xuất THOAN upload lên Project Files HOẶC cung cấp link Kênh C (Supabase Bucket) nếu đã được chuẩn hóa.
3. Tuyệt đối **không tuyên bố "PE đã đọc được"** nếu chưa có phản hồi xác nhận thử nghiệm thành công từ PE.
4. Ràng buộc bảo mật: Bucket `ssot-artifacts` chỉ chứa tài liệu/artifact đặc tả nghiệp vụ, tuyệt đối không chứa dữ liệu khách hàng nhạy cảm hoặc token bí mật. Không làm thay đổi schema hay RLS của DB.

---

## 6. NGHĨA VỤ CỦA KIẾN TRÚC SƯ TRƯỞNG PE
1. Mọi kết luận thẩm định phải **ghi rõ kênh đã đọc**:
   - `[Kênh đọc: chat-paste]`
   - `[Kênh đọc: file_explore]`
   - `[Kênh đọc: supabase-bucket]`
   - `[Kênh đọc: chưa đọc]`
2. Không sử dụng lý do *"chưa đọc được"* nếu AN đã paste toàn văn nội dung vào chat theo đúng Kênh A hoặc file đã được THOAN upload vào Project Files theo Kênh B.
