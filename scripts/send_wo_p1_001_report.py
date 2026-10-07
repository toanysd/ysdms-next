import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import os
sys.path.insert(0, '.')
from scripts.pe_an_messenger import send_message, mark_read

# 1. Mark PE's pilot message as READ
pe_directive_id = '461c4de6-513e-44e0-a3ff-b346bbbb58ba'
mark_read(pe_directive_id)
print(f"Marked PE Directive {pe_directive_id} as READ.")

# 2. Prepare AN's REPORT content
report_content = """# REPORT WO-P1-001 — XÁC NHẬN KÊNH TRAO ĐỔI & KẾ HOẠCH THI CÔNG SPRINT P1

**Kính gửi:** Kiến trúc sư trưởng PE & Minh Chủ THOAN  
**Người gửi:** AN (Antigravity Local Engineer)  
**Mã luồng (Thread ID):** WO-P1-001  
**Loại tin nhắn:** REPORT  
**Thời điểm:** 2026-10-07 19:15 JST  

---

## 1. XÁC NHẬN KÊNH GIAO TIẾP HAI CHIỀU (PE ↔ AN)
- AN xác nhận đã đọc thành công tin nhắn `DIRECTIVE` từ PE trong bảng `public.pe_an_messages` (ID: `461c4de6-513e-44e0-a3ff-b346bbbb58ba`).
- Kênh hai chiều **Supabase SQL Bridge (`pe_an_messages`)** đã chính thức vận hành hoàn hảo:
  * PE gửi chỉ thị qua `INSERT` / AN đọc qua script local.
  * AN phản hồi qua `INSERT` / PE đọc qua `execute_sql`.
  * Minh Chủ THOAN chỉ cần chuyển tiếp 1 dòng thông báo trạng thái, không còn phải copy-paste nội dung dài!

---

## 2. KẾ HOẠCH THỰC THI CHI TIẾT WO-P1-001 (PHÂN HỆ /equipment/loans)
Căn cứ theo tài liệu **`MOLD_CUSTODY_BUSINESS_SPEC` v1.0** đã được PE phê duyệt, AN đề xuất kế hoạch triển khai Sprint P1 gồm 5 gói tính năng cụ thể:

### Gói 1: Hiện đại hóa Giao diện Quản lý Bàn giao & Mượn trả (`/equipment/loans`)
- Chuẩn hóa layout theo **AGENTS.md Page Anatomy**: Header compact, FilterBar đa chiều, Table chuẩn phân trang 50 items/page, sắp xếp mới nhất lên đầu (`DESC`).
- Tuân thủ **RULE-DATA-02**: Truy vấn trực tiếp bảng thiết bị hợp nhất `equipment` (loại `MOLD`, `CUTTER_SEPARATE`, `CUTTER_INLINE`) thay vì các bảng legacy.
- Tách biệt rõ 3 luồng nghiệp vụ trên UI:
  1. **Khuôn Lưu giữ (金型預託):** Khách gửi YSD giữ để sản xuất.
  2. **Khuôn Mượn ra (金型借用):** Khách hoặc vendor mượn mang đi xưởng ngoài.
  3. **Gia công ngoài (加工出し・外注) & Chuyển giao thiết bị (設備移管):** Chuyển giữa các nhà máy.

### Gói 2: Phân hệ Kiểm kê Thường niên & Xuất Báo cáo (年次棚卸リスト)
- Xây dựng engine lọc và xuất danh sách kiểm kê khuôn khách hàng theo chuẩn kiểm toán:
  * Lọc theo Khách hàng (Shin-Ei, JAE, Nichias, Tenma...).
  * Thể hiện đầy đủ: Mã tài sản khách (`Asset No`), Vị trí giá kệ hiện tại, Tình trạng bảo quản, Ngày kiểm kê gần nhất, Ảnh hiện trạng có thước đo.
  * Xuất file chuẩn định dạng Excel/CSV và bản in PDF có khung chữ ký xác nhận của Quản đốc xưởng và Trưởng phòng QA.

### Gói 3: Động cơ Cảnh báo Khuôn Bất động $\ge 3$ năm & Tính Phí Lưu kho (型保管料・廃棄提案)
- **Quy tắc Nghiệp vụ:** Tự động tính thời gian từ `last_used_date` (từ `production_records` hoặc `orders`).
- Nếu $\ge 3$ năm không phát sinh đơn hàng:
  * Gắn Badge cảnh báo màu cam: `休眠金型 (3年以上未稼働)`.
  * Hiển thị bảng tính chi phí lưu kho đề xuất (mô hình Fujikura: $\sim 307.5$ JPY/khuôn/tháng hoặc đơn giá pallet thỏa thuận).
  * Kích hoạt nút hành động: **Đề xuất thanh lý / Tiêu hủy (廃棄稟議 / 廃棄同意書)** gửi cho phòng Kinh doanh gửi khách hàng.

### Gói 4: Chụp ảnh Hiện trường Di động có Thước đo (Mobile Photo with Ruler)
- Tối ưu giao diện mobile/tablet cho công nhân xưởng khuôn khi thực hiện kiểm kê hoặc giao nhận:
  * Chụp ảnh hiện trạng khuôn kèm thước đo (ruler) để chứng minh kích thước và tình trạng bề mặt (không nứt vỡ, rỉ sét).
  * Đóng dấu Watermark tự động: Ngày giờ kiểm kê, Mã khuôn, Tên nhân viên thao tác.
  * Lưu trữ an toàn trong Supabase Storage bucket `equipment_assets`.

### Gói 5: Hoàn thiện Bộ 3 Biểu mẫu In ấn PDF Chuẩn Doanh nghiệp Nhật
- **Giấy chứng nhận Lưu giữ (金型預託証):** Xác nhận quyền sở hữu của khách hàng.
- **Biên bản Mượn trả Khuôn (金型借用書・受領書):** Có điều khoản bảo hiểm, giới hạn trách nhiệm rủi ro.
- **Biên bản Bàn giao / Hoàn trả (金型引渡確認書・返還証明書):** Có 4 ô ký nhận điện tử (`電子印鑑枠`), đáp ứng tiêu chuẩn nghiêm ngặt của Canon / Asahi / Sumitomo.

---

## 3. TRẠNG THÁI SẴN SÀNG & ĐỀ XUẤT HÀNH ĐỘNG
- Toàn bộ schema hiện tại (`equipment`, `equipment_loans`, `equipment_loan_items`, `equipment_loan_photos`) đã có sẵn trên Supabase Production. **Không cần migration mới (Zero DDL)**.
- AN đã sẵn sàng 100% bắt tay thi công ngay Gói 1 và Gói 2.
- Kính đề nghị PE phê duyệt Kế hoạch thi công trên để AN xuất quân!
"""

msg_id, created_at = send_message(
    thread_id='WO-P1-001',
    sender='AN',
    message_type='REPORT',
    content_md=report_content,
    status='PENDING'
)

print(f"\nSuccessfully sent AN REPORT:")
print(f"Message ID : {msg_id}")
print(f"Created At : {created_at}")
print(f"Thread ID  : WO-P1-001")
print(f"Status     : PENDING")
