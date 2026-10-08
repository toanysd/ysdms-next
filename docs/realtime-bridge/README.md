# Hệ Thống Cầu Nối Thời Gian Thực PE-AN (Zero Polling Realtime Bridge v3.3)

> **Dự án:** YSDMS NextGen & OmniLinguist  
> **Cơ chế:** State Machine (Supabase SSOT + Local SSE + Draggable Control Bar)  
> **Phiên bản:** v3.3 (Tháng 10/2026)  
> **Quy trình chuẩn:** PE - THOAN - AN

---

## 1. Vòng Đời Quy Trình Chuẩn (Workflow Lifecycle)

```
        ┌────────────────────────────────────────────────────────┐
        │ 1. THOAN gõ lệnh "PE đọc Bridge." trên Perplexity     │
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ 2. PE đọc Supabase, phân tích và tự nộp CHỈ THỊ        │
        │    lên bảng public.pe_an_messages (status=PENDING)    │
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ 3. Userscript nhận diện tin mới từ PE trên Supabase:   │
        │    - Chuyển CHẤM VÀNG 🟡 (Chờ AN xử lý)                 │
        │    - Bắn Webhook đánh thức Local Hub + Máy tính AN     │
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ 4. Kỹ sư AN đọc chỉ thị từ Supabase, THỰC THI THẬT SỰ  │
        │    (viết code, chạy test) và nộp REPORT lên Supabase   │
        └───────────────────────────┬────────────────────────────┘
                                    │
                                    ▼
        ┌────────────────────────────────────────────────────────┐
        │ 5. Hệ thống kích hoạt, chuyển CHẤM XANH 🟢             │
        │    - Nút [Điền vào PE] bật sáng rực rỡ                  │
        │    - THOAN chủ động bấm nút để điền "PE đọc Bridge."   │
        │    - THOAN bấm Enter để chuyển lượt cho PE!            │
        └────────────────────────────────────────────────────────┘
```

---

## 2. Giải Thích 3 Trạng Thái Của Chấm Điều Khiển (Status Dot)

| Màu sắc | Tên trạng thái | Ý nghĩa nghiệp vụ | Nút [Điền vào PE] |
| :---: | :--- | :--- | :---: |
| 🟡 **VÀNG** | `WAITING_AN` | PE đã nộp chỉ thị lên Supabase, AN đang trong quá trình thực thi. | Mờ / Không khả dụng |
| 🟢 **XANH** | `READY_PE` | AN đã nộp xong báo cáo lên Supabase, sẵn sàng để Thoan gọi PE. | **Sáng xanh rực rỡ** (Bấm để điền) |
| ⚪ **XÁM** | `IDLE` | Hệ thống đang chờ hoặc tạm dừng theo dõi. | Trạng thái nghỉ |

---

## 3. Danh Mục Tài Liệu Chi Tiết

- 📋 [USER_MANUAL.md](./USER_MANUAL.md): Sổ tay hướng dẫn từng bước dành cho Minh Chủ THOAN.
- 🏗️ [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md): Đặc tả kiến trúc kỹ thuật và luồng dữ liệu.
- 🗂️ [FILES_CATALOG.md](./FILES_CATALOG.md): Bảng tra cứu danh bạ toàn bộ các file.
