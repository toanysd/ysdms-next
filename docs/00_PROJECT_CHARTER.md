# YSDMS — PROJECT CHARTER (Tuyên ngôn Dự án)
**Cập nhật lần cuối:** 2026-07-13
**Trạng thái:** ACTIVE (Đã phê duyệt bởi Product Owner)

## 1. Thông tin chung
- **Tên dự án:** YSDMS (YSD Manufacturing System)
- **Công ty triển khai:** 株式会社ヨシダパッケージ (Yoshida Package Co., Ltd.)
- **Phạm vi triển khai (Phase 1):** Trụ sở chính (khoảng 20 người dùng ban đầu). Các chi nhánh khác sẽ được mở rộng sau.
- **Product Owner:** Anh Thoan (Người quyết định cuối cùng về nghiệp vụ và phê duyệt tài liệu).

## 2. Ngôn ngữ Hệ thống
- **Giao diện chính thức:** Tiếng Nhật (Japanese).
- **Kiến trúc đa ngôn ngữ (i18n):** Hệ thống bắt buộc phải hỗ trợ chuyển đổi đa ngôn ngữ (có thể chuyển đổi sang Tiếng Việt/Tiếng Anh qua toggle), thay thế cho cơ chế song ngữ tĩnh trên cùng màn hình của hệ thống cũ.

## 3. Danh sách Module & Trạng thái hiện tại
| Module | Trạng thái | Đánh giá |
|--------|------------|----------|
| **Thiết kế (Design Revision)** | 🟢 Hoạt động tốt | Kế thừa từ Access, luồng chạy ổn định. |
| **Khuôn vật lý (Physical Mold)** | 🟢 Hoạt động tốt | Liên kết chặt chẽ với bản vẽ thiết kế. Các nghiệp vụ Teflon, status tracking chạy tốt. |
| **Gia công (Job & Worklogs)** | 🟢 Hoạt động tốt | Ghi nhận nhật ký gia công khuôn hiệu quả. |
| **Đơn hàng (Orders)** | 🔴 Cần tái cấu trúc | Chưa hoạt động tốt, luồng nghiệp vụ còn lộn xộn. |
| **Khuôn gốc (Master Mold)** | 🔴 Cần tái cấu trúc | Đang gặp vấn đề về dữ liệu/schema, cần review lại sự cần thiết và cấu trúc. |
| **Sản phẩm (Products)** | 🔴 Cần tái cấu trúc | Tính liên kết với Master Mold và Orders chưa chuẩn xác. |
| **Chỉ thị Sản xuất** | 🟡 Đang lên kế hoạch | Cần hoàn thiện dựa trên tài liệu nghiệp vụ thực tế. |
| **Sample Management** | 🟡 Đang lên kế hoạch | Quản lý hàng mẫu (theo đánh giá từ file nghiệp vụ). |

## 4. Quy tắc Đặt tên Khuôn (Ví dụ chuẩn hóa)
*(Được tổng hợp từ phân tích của Perplexity dựa trên dữ liệu thực tế)*
- **Ví dụ tiêu chuẩn:** `JAE-001AB-R2-N01`
- **Thành phần phân tích:** 
  - `JAE-001AB`: Mã thiết kế/sản phẩm cốt lõi.
  - `R2`: Revision (Phiên bản thiết kế số 2).
  - `N01`: Đánh số Khuôn vật lý (Khuôn số 01 của thiết kế đó).
> ⚠️ **Lưu ý:** PE sẽ tiếp tục ban hành quy tắc chi tiết về cấu trúc này trong tài liệu nghiệp vụ.

## 5. Ma trận Phân công Kép (Antigravity & Perplexity)
Quy tắc vàng: **Không bao giờ để AN và PE cùng chỉnh sửa một quyết định mà không có file trong `/docs/` làm trọng tài.**

| Nhiệm vụ | Antigravity (AN) | Perplexity (PE) |
|----------|------------------|-----------------|
| Đọc codebase | ✅ **Chính** | ❌ Không |
| Viết code / migration | ✅ **Chính** | ❌ Không |
| Phân tích nghiệp vụ | ❌ Không | ✅ **Chính** |
| Tra cứu DB/Schema | ✅ Hỗ trợ (Trực tiếp query) | ✅ Hỗ trợ |
| Tạo tài liệu `/docs/` | 🔄 Thực thi ghi file vào đĩa | ✅ **Chính** (Đưa ra nội dung) |
| Kiểm tra tính nhất quán | ❌ Không | ✅ **Chính** |
| Quyết định thiết kế | Đề xuất | **Phê duyệt + Ghi docs** |

### Quy trình làm việc chuẩn
1. **PE** phân tích yêu cầu → Trình bày spec/yêu cầu.
2. **AN** ghi nội dung vào `/docs/` (nếu cần lưu trữ) và đọc spec.
3. **AN** tiến hành lập trình (viết code/migration) trên codebase thực tế.
4. **AN** báo cáo kết quả thực thi cho PO (Anh Thoan).
5. **PE** kiểm tra tính nhất quán thông qua log của AN và cập nhật lại docs nếu cần thiết.
