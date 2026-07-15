# Báo Cáo Đánh Giá & Tái Cấu Trúc Luồng Nghiệp Vụ YSDMS-NextGen

## 1. Đánh giá hiện trạng (YSDMS vs Thực tế)

Hiện tại, hệ thống đã chuyển mình thành công từ một công cụ **"Chỉ Tra Cứu"** (MoldCutterSearch) sang một nền tảng **"Quản lý Dữ liệu Toàn diện"** (YSDMS) nhờ kiến trúc Supabase. Tuy nhiên, phần giao diện điều hướng (Sidebar) và luồng nhập liệu vẫn đang mang dáng dấp của hệ thống cũ (gom nhóm theo loại tài sản: Kho khuôn, Kho khay, Kho nhựa) chứ chưa phản ánh **Dòng Chảy Thời Gian (Timeline Flow)** của nghiệp vụ thực tế.

### Phân tích Độ phủ của Database so với Nghiệp vụ:
| Bước Nghiệp vụ Thực tế (Dựa trên IRI_order.md) | Trạng thái Data / DB | Trạng thái Giao diện (UI) | Đánh giá / Nút thắt hiện tại |
| :--- | :--- | :--- | :--- |
| **1. Đặt hàng & Thiết kế Khay (Tray Design)**<br>*Khách hàng gửi yêu cầu -> YSD lên bản vẽ Khay (VD: IRI-003) -> Khách hàng duyệt.* | 🟡 Đã có bảng `product_master`, `customers` | 🔴 Form "Cửa 1 trạm" hiện tại đang lấy **Khuôn (Mold Base)** làm điểm bắt đầu, điều này là **ngược** với thực tế. | *Hệ thống đang bị "Mold-Centric" (Lấy khuôn làm trung tâm). Cần đổi thành "Product-Centric" (Lấy Khay làm trung tâm).* |
| **2. Thông số Kỹ thuật & Thiết kế Khuôn**<br>*Sau khi Khay được duyệt, Kỹ sư chốt toàn bộ thông số: Tên khuôn, Bản vẽ (R1, R2), Dao cắt, Loại nhựa.* | 🟢 Đã có `mold_design_revision` | 🟡 Form UnifiedMold hiện tại đáp ứng tốt việc lưu trữ toàn bộ thông số kỹ thuật này cùng lúc. | *Thông tin Khay, Khuôn, Nhựa cần được gộp chung trong 1 bộ hồ sơ "Yêu cầu Sản xuất".* |
| **3. Chỉ thị Sản xuất (Production Order)**<br>*Ra lệnh làm mẫu thử (Sample) hoặc làm hàng loạt (Mass). Yêu cầu rõ: Số lượng, Loại Nhựa (VD: PS 1.0), Máy (ILLIG), Ngày giao hàng.* | 🟡 Đã có bảng `mold_plastic_bom`, `product_mold_map` | 🔴 Chưa có Form tạo "Chỉ thị Sản xuất" kết nối trực tiếp từ bản Thiết kế. | *Thiếu quy trình tạo Chỉ thị sản xuất tự động kế thừa dữ liệu từ bước Thiết kế.* |
| **4. Sản xuất Khuôn & Dao -> Sản xuất Khay**<br>*Làm khuôn vật lý -> Chạy máy định hình -> Ra thành phẩm.* | 🟢 Đã có `mold_physical` | 🟡 Có mục "Sản xuất Kanban" nhưng thiếu liên kết chặt chẽ. | *Khuôn phải có trạng thái "Sẵn sàng" thì Chỉ thị định hình mới được phép chạy.* |

---

## 2. Đề xuất Tái cấu trúc Menu (Sidebar)

Để hệ thống định hướng người dùng nhập liệu đúng quy trình, Sidebar cần được chia theo **Giai đoạn Vòng đời Sản phẩm (Product Lifecycle)** thay vì Nhóm Tài sản. 

Tôi đề xuất cấu trúc Sidebar mới (Song ngữ Nhật/Việt) như sau:

### 💼 GIAI ĐOẠN 1: QUẢN LÝ KHAY & THIẾT KẾ (Tray & Design Hub)
*Lấy Khay (Sản phẩm) làm trung tâm. Nơi khởi tạo dự án dựa trên yêu cầu Khách hàng.*
1. **📦 Sản phẩm & Yêu cầu (トレイ・受注):** Nhập yêu cầu thiết kế Khay mới (VD: IRI-003), xác nhận 3D data với khách, chốt Layout.
2. **📐 Hồ sơ Kỹ thuật (設計データ):** Nơi chốt thông số sau khi duyệt: Phiên bản Khuôn, Loại nhựa, Dao cắt, Máy định hình. (Form 1 trạm sẽ được dịch chuyển trọng tâm về đây).

### 🏭 GIAI ĐOẠN 2: CHỈ THỊ SẢN XUẤT & KẾ HOẠCH (Orders & Planning)
*Phát hành lệnh sản xuất dựa trên Hồ sơ Kỹ thuật đã chốt.*
3. **📋 Chỉ thị Sản xuất (生産指示書):** Tạo Lệnh làm mẫu thử hoặc Lệnh sản xuất loạt. Kế thừa toàn bộ thông số từ GĐ1 (Ngày giao, Số lượng, Loại nhựa...).
4. **📅 Lập Kế hoạch (生産計画):** Xếp lịch chạy máy. (Hệ thống tự động check: Khuôn đã gia công xong chưa? Nhựa đủ không?)
5. **🏢 Kho Khuôn & Dao (金型・抜型庫):** (Giao diện hiện tại) - Dùng để quản lý xuất/nhập, bảo dưỡng, Teflon. Đảm bảo Khuôn sẵn sàng.
6. **🧻 Kho Nhựa (プラ材料):** Quản lý cuộn nhựa, cảnh báo tồn kho tối thiểu.

### ⚙️ GIAI ĐOẠN 3: THỰC THI SẢN XUẤT (Execution)
*Nơi công nhân thao tác hàng ngày.*
7. **🏭 Xưởng Định Hình (生産現場):** Bảng Kanban hiển thị Lệnh đang chạy. Công nhân dùng Tablet/Màn hình tại máy để nhập nhật ký: Bắt đầu -> Nhập số lượng OK/NG -> Kết thúc ca.
8. **🔧 SACT / Lắp ráp (SACTシステム):** Các công đoạn phụ trợ hoặc đóng gói.

### 📊 GIAI ĐOẠN 4: THỐNG KÊ & CÔNG CỤ (Analytics & Tools)
9. **📈 Báo cáo Năng suất (レポート):** OEE, tỷ lệ phế phẩm, tiến độ giao hàng.
10. **📱 Công cụ Hiện trường (ツール):** QR Scan, AR Locator, Kiểm kê.

---

## 3. Lộ trình Triển khai (Next Steps)

👉 **Bước tiếp theo đề xuất thực hiện:**
1. **Xây dựng Module "Đơn hàng & Sản phẩm" (Phase 1):** Làm Form "Cửa 1 trạm" cho Khay và Đơn hàng. Khi tạo Khay, chuyển tiếp thẳng sang Yêu cầu thiết kế Khuôn.
2. **Tái cấu trúc Sidebar (Phase 2):** Cập nhật lại `layout.tsx` theo 4 nhóm Giai đoạn trên để phân luồng người dùng.
3. **Phát triển Module "Nhật ký Sản xuất" (Phase 3):** Xây dựng bảng `production_logs` (Lưu số lượng OK, NG, Thời gian chết máy) để ghi nhận dữ liệu từ Xưởng.
