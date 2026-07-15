# Hồ Sơ Kỹ Thuật: Tổng Hợp Nghiệp Vụ Thực Tế Từ Dữ Liệu Email (Outlook)

**Ngày cập nhật:** 2026-07-09
**Nguồn dữ liệu:** Trích xuất từ 1000 email trao đổi nội bộ và với khách hàng của YSD.
**Mục đích:** Xác minh, bổ sung và làm rõ các luồng nghiệp vụ thực tế phát sinh trong quá trình vận hành sản xuất, làm cơ sở điều chỉnh cơ sở dữ liệu và giao diện ứng dụng YSDMS NextGen.

---

## 1. Phân Tích Tổng Quan

Dựa trên phân tích tần suất từ khóa và chủ đề (Subject) của 1000 email, các nghiệp vụ chính của YSD được phân bổ như sau:
1. **Khay / Định hình (トレイ / 成形):** > 50% khối lượng trao đổi, xoay quanh việc thảo luận quy cách, thiết kế và vật liệu khay.
2. **Báo giá & Thiết kế (見積 / 設計):** Chiếm khoảng 38%, là khâu có nhiều tương tác lặp đi lặp lại nhất (VD: "見積りとレイアウト図のお願い" - Yêu cầu báo giá và bản vẽ layout).
3. **Kiểm tra mẫu & Sửa chữa (サンプル確認 / 修正):** ~10%, phản ánh quá trình tinh chỉnh sản phẩm trước khi sản xuất hàng loạt.
4. **Quản lý tài sản (棚卸 / 写真 / 借用証):** ~6%, đặc thù đối với các khách hàng lớn yêu cầu nghiêm ngặt về quản lý khuôn (như kiểm kê, chụp ảnh, giấy chứng nhận mượn khuôn).

---

## 2. Chi Tiết Các Luồng Nghiệp Vụ Thực Tế Phát Sinh

### 2.1. Nhóm Nghiệp vụ Tiền Sản Xuất (Pre-Production)

**a. Yêu cầu Báo giá & Thiết kế (見積・設計)**
- **Mô tả:** Khách hàng gửi yêu cầu báo giá cho các dự án khuôn/khay mới. Thường đi kèm yêu cầu thiết kế bản vẽ 2D/3D hoặc Layout.
- **Dữ liệu thực tế:** 
  - `見積りとレイアウト図のお願い` (Yêu cầu báo giá và bản vẽ layout)
  - `梱包トレイ見積・設計のお願い` (Yêu cầu thiết kế và báo giá khay đóng gói)
  - `【3D図面の作図と金型費用&単価見積書送付お願い】` (Yêu cầu dựng 3D, báo giá khuôn và đơn giá SP)
- **Insight cho DB:** Cần module quản lý Yêu cầu Báo Giá (Quote Requests) liên kết chặt chẽ với Revision Thiết kế (Design Revisions). Một yêu cầu báo giá có thể dẫn đến nhiều phiên bản bản vẽ Layout/3D.

**b. Lên đơn hàng (PO - 注文)**
- **Mô tả:** Chốt đơn hàng sản xuất khuôn (金型起工) hoặc sản xuất khay.
- **Dữ liệu thực tế:** 
  - `金型起工のPO` (PO khởi tạo khuôn)
  - `Lindoへの納期回答登録のお願い` (Đăng ký trả lời thời hạn giao hàng)
- **Insight cho DB:** Đơn hàng (Orders) cần tách biệt giữa Đơn hàng Khuôn (Mold PO) và Đơn hàng Sản phẩm/Khay (Product PO). Phải theo dõi Ngày cam kết giao hàng (納期).

### 2.2. Nhóm Nghiệp vụ Kỹ thuật & Sản xuất (Engineering & Manufacturing)

**a. Khởi tạo & Gia công Khuôn (金型製作・メッキ)**
- **Mô tả:** Quá trình chế tạo khuôn chính thức. Bao gồm cả các công đoạn gia công bề mặt đặc biệt.
- **Dữ liệu thực tế:**
  - `本型製作依頼` (Yêu cầu sản xuất khuôn chính)
  - `テフロン加工依頼` (Yêu cầu phủ Teflon)
- **Insight cho DB:** Bảng `physical_molds` cần có trường ghi nhận trạng thái xử lý bề mặt (VD: `surface_treatment: 'Teflon'`).

**b. Sản xuất Khay & Thử nghiệm (トレイ成形・試作)**
- **Mô tả:** Các loại khay rất đa dạng, từ khay thường đến khay chân không, khay chống tĩnh điện. Luôn có bước chạy thử (1 pocket hoặc toàn bộ).
- **Dữ liệu thực tế:**
  - `真空成形トレイ` (Khay ép chân không)
  - `導電性トレー` (Khay dẫn điện)
  - `1ポケット試作OK` (Thử nghiệm 1 hốc thành công)
- **Insight cho DB:** Bảng `products` cần phân loại (Category) chi tiết: Vacuum tray, Conductive tray, v.v.

### 2.3. Nhóm Nghiệp vụ Đảm Bảo Chất Lượng (Quality Assurance)

**a. Kiểm tra mẫu & Duyệt mẫu (サンプル評価・確認)**
- **Mô tả:** Gửi mẫu thử nghiệm cho khách hàng đánh giá trước khi chạy hàng loạt.
- **Dữ liệu thực tế:**
  - `ポケットサンプル評価` (Đánh giá mẫu hốc khay)
  - `金型検定セット提出依頼` (Yêu cầu nộp bộ hồ sơ/mẫu kiểm định khuôn)

**b. Chỉnh sửa & Cải tiến khuôn (修正・形状変更・刻印改造)**
- **Mô tả:** Sau khi thử nghiệm, khuôn thường phải sửa đổi kích thước, hình dáng hoặc thêm/bớt dấu khắc.
- **Dữ liệu thực tế:**
  - `形状変更について` (Về việc thay đổi hình dạng)
  - `ポケット試作/修正のお願い` (Yêu cầu thử nghiệm hốc / sửa chữa)
  - `刻印改造について` (Về việc sửa đổi dấu khắc)
  - `金型サイズ変更` (Thay đổi kích thước khuôn)
- **Insight cho DB:** Cần bảng theo dõi lịch sử sửa chữa/bảo dưỡng khuôn (`mold_maintenance_logs`), ghi nhận phân loại (Shape change, Size change, Engraving modification).

### 2.4. Nhóm Nghiệp vụ Quản Trị Tài Sản & Logistics (Asset Management & Logistics)

**a. Chụp ảnh & Kiểm kê Khuôn (写真撮影・棚卸)**
- **Mô tả:** Do khuôn thường thuộc sở hữu của khách hàng nhưng đặt tại xưởng YSD, khách hàng thường xuyên yêu cầu chụp ảnh và kiểm kê định kỳ.
- **Dữ liệu thực tế:**
  - `金型写真撮影・ご送付のお願い` (Yêu cầu chụp và gửi ảnh khuôn)
  - `金型棚卸（SACT実施）のお願い` (Yêu cầu kiểm kê khuôn - SACT)
  - `金型実査調査の依頼` (Yêu cầu khảo sát thực tế khuôn)
- **Insight cho DB:** Module Quản lý khuôn (`physical_molds`) BẮT BUỘC phải có tính năng upload Hình ảnh hiện trạng (Photo evidence) và ngày kiểm kê gần nhất (`last_inventory_date`).

**b. Giấy tờ pháp lý & Chứng nhận mượn khuôn (借用証・契約書)**
- **Mô tả:** Luồng giấy tờ cam kết về quyền sở hữu và trách nhiệm lưu trữ tài sản.
- **Dữ liệu thực tế:**
  - `借用証/現品受渡確認票` (Giấy chứng nhận mượn tài sản / Phiếu xác nhận giao nhận hiện vật)
  - `得意先指定借用書記入・捺印` (Điền và đóng dấu giấy mượn tài sản theo chỉ định của khách hàng)
  - `型の取り扱いに関する契約書` (Hợp đồng liên quan đến xử lý/sử dụng khuôn)
- **Insight cho DB:** Cần lưu trữ các file scan/PDF của `借用証` (Loan Certificates) liên kết với từng bản ghi `physical_molds` hoặc `companies`.

**c. Hủy khuôn & Rác thải (廃棄・環境規制)**
- **Mô tả:** Quá trình xin phép và xác nhận tiêu hủy khuôn nhôm cũ. Đáp ứng các tiêu chuẩn môi trường.
- **Dữ liệu thực tế:**
  - `アルミ金型廃棄について` (Về việc hủy khuôn nhôm)
  - `欧州（EU）のPPWR（包装及び包装廃棄物規制）対応に向けた梱包材データのご提示依頼` (Yêu cầu cung cấp dữ liệu vật liệu đóng gói để đáp ứng quy định PPWR của EU)
- **Insight cho DB:** Quản lý vòng đời khuôn phải có trạng thái "Scrapped" (Đã hủy) và lưu trữ Biên bản hủy. Phải quản lý dữ liệu thành phần nhựa (plastics) chi tiết để xuất báo cáo môi trường (PPWR).

**d. Giao hàng & Tem nhãn (納品・ラベル)**
- **Mô tả:** Xuất hàng đi kèm các giấy tờ chứng nhận và tem nhãn QR.
- **Dữ liệu thực tế:**
  - `新QRラベル送付のご連絡` (Thông báo gửi nhãn QR mới)
  - `納品書兼検査票と現品票の登録` (Đăng ký hóa đơn kiêm phiếu kiểm tra và phiếu hiện vật)

---

## 3. Khuyến Nghị Cập Nhật Giao Diện (UI) & Hệ Thống (Dựa trên Dữ liệu)

Từ việc phân tích tần suất email, UI của ứng dụng YSDMS NextGen cần tập trung vào các luồng thao tác nhanh sau:
1. **Quick Action cho Mold Management:** 
   - Thêm nút "Cập nhật ảnh khuôn" (Upload Photo) trực tiếp trên Data Table vì đây là tác vụ diễn ra liên tục.
   - Thêm nút "Xuất/Upload Giấy mượn khuôn (借用証)".
2. **Quản lý Trạng thái Thử nghiệm (Prototyping Status):**
   - Sản phẩm/Khuôn cần có các phase: `1 Pocket Trial` -> `Sample Evaluation` -> `Mass Production (量産)`.
3. **Phân loại Yêu cầu Sửa khuôn:**
   - Khi tạo Maintenance Ticket cho khuôn, cần có các lựa chọn dropdown dựa trên thực tế: `Shape Change (形状変更)`, `Size Change (サイズ変更)`, `Engraving Mod (刻印改造)`, `Teflon Coating (テフロン加工)`.
4. **Báo cáo Môi trường:**
   - Cần bổ sung tính năng xuất dữ liệu Vật liệu (Material Data) của khay/bao bì để khách hàng nộp báo cáo PPWR (Châu Âu).

---
*Tài liệu này đóng vai trò là "Ground Truth" (Sự thật nền tảng) trích xuất từ dữ liệu vận hành thực tế của doanh nghiệp, giúp hệ thống không bị "lệch" so với nhu cầu sử dụng hằng ngày.*
