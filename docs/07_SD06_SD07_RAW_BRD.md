# 07_SD06_SD07_RAW_BRD — Bản Yêu cầu Nghiệp vụ Thô (Từ Data Mining)
# YSDMS | YSD Manufacturing System
**Ngày phân tích:** 2026-07-13
**Phân tích bởi:** IT Lead (Antigravity) qua Multi-Agent Research
**Nguồn dữ liệu:** Thư mục `source_data` (`toanysdmail.CSV`, `納品書_注文`, `材料在庫`)

---

## 📦 SD-06: Luồng Giao hàng (Shipments & Lots)
*(Dựa trên phân tích form mẫu của SMK, KYD)*

1. **Giao hàng phi vật lý (Non-Physical Deliverables):** Phiếu giao hàng không chỉ xuất cho khay nhựa, mà còn cho các dịch vụ kỹ thuật như: "Phí thiết kế 3D", "Phí lưu kho/Hủy khuôn".
2. **Truy xuất nguồn gốc (Lot & Mold Tracking):** Bắt buộc phải có trường `LOT NO` tách biệt. Đặc biệt, form của SMK yêu cầu in rõ **Mã khuôn (Mold No)** trên phiếu giao hàng → Hệ thống phải giữ được liên kết: `Shipment -> Production Lot -> Physical Mold`.
3. **Tích hợp Quality Control (QC):** Bảng giao hàng phải phân tách rõ: `Số lượng giao (Delivered Qty)` = `Hàng đạt (Good Qty)` + `Hàng lỗi (Defective Qty)`.
4. **Template Đa dạng:** Các khách hàng lớn (SMK, Mitsubishi KYD) dùng chuẩn phiếu giao hàng riêng (`指定納品書`), kèm theo các giấy tờ bắt buộc đi theo lô (VD: KYD yêu cầu Chứng nhận kiểm tra `試験成績書`, SMK yêu cầu Bảng kiểm tra sản xuất hàng loạt `量産検査表`).

---

## 🛢️ SD-07: Quản lý Vật tư (Materials & BOM)
*(Dựa trên phân tích 482 file Excel báo cáo tồn kho hàng ngày - `指示書連動` và luồng Email)*

1. **BOM & Reservation:** Khi tạo Chỉ thị SX (`production_orders`), hệ thống phải tham chiếu được định mức vật tư (BOM) liên kết với khuôn.
2. **Trạng thái Kho & Cảnh báo (Kanban Status):** Kho vật tư liên kết chặt chẽ với tiến độ máy. Nếu thiếu nhựa, Job tự động bị khóa ở trạng thái: `ZN.材料待ち` (Chờ cấp vật tư) hoặc `ZR.材料Request` (Yêu cầu mua). Khi máy chạy, vật tư được trừ lùi (Consumption).
3. **Thuộc tính vật tư cốt lõi:** Nhựa phải được quản lý qua 3 chiều dữ liệu: `Loại nhựa (Type)`, `Độ dày (Thickness)`, và `Khổ cuộn (Width)`. 
4. **Các chỉ số tồn kho:** Cần có Tồn thực tế (Current), Cảnh báo tối thiểu (Min), và Tồn đã được giữ chỗ cho Lệnh SX (Reserved).
5. **Báo cáo Môi trường (PPWR):** Có một luồng nghiệp vụ yêu cầu xuất dữ liệu tiêu hao vật tư đóng gói để báo cáo tuân thủ quy định môi trường Châu Âu (PPWR).
