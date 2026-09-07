# ADR-009: Mold Custody, Borrowing & Return Workflow (金型借用・預託・返却管理)

**Trạng thái:** PROPOSED (Chờ PE & Anh Thoan phê duyệt)  
**Ngày:** 2026-09-07  
**Người đề xuất:** AN (AI Assistant), PE (Perplexity Engineer)  
**Người quyết định:** Anh Thoan (Product Owner)  
**Bối cảnh:** Làm rõ bản chất pháp lý và vận hành xưởng YSD đối với khuôn mẫu khách hàng: Khách hàng (JAE, SMK, SHI, Asahi...) là bên sở hữu tài sản cố định (`固定資産`), YSD là bên mượn / nhận gửi giữ (`借用者` / `預託先`) để phục vụ dập định hình khay nhựa.

---

## 1. Bối Cảnh Thực Tế & Bằng Chứng Dữ Liệu Mail

Qua phân tích hàng ngàn luồng thư thực tế giữa YSD và các khách hàng lớn (`toanysdmail.CSV`, `toanysdmail2.csv`), chúng tôi xác nhận các chuẩn mực vận hành sau:

### 1.1 Khách hàng sở hữu khuôn — YSD là bên mượn/giữ hộ
> *"金型については弊社資産になるため、借用書が必要との指摘を受けました。13162Ｂトレーにつきまして、借用書のご発行をお願いしたく存じます。①借用書PDF(押印済み) ②借用書エクセル(写真データ貼付) ③借用書原本郵送"*  
> — *Email từ Công ty Shin-Ei Hitec (SHI) gửi Ban Giám đốc YSD*

- **Bản chất pháp lý:** Khách hàng sở hữu khuôn (Fixed Assets / 資産). Khi YSD gia công xong khuôn hoặc khách chuyển khuôn về YSD, khách hàng yêu cầu YSD lập và ký đóng dấu **`借用書`** (Borrowing Certificate) hoặc **`預り証 / 現品受渡確認票`** (Custody Certificate). Trên giấy tờ, **YSD là bên mượn / bên nhận giữ**, khách hàng là chủ sở hữu.
- **Yêu cầu hồ sơ đính kèm:** Phải có ảnh chụp toàn cảnh (`全体写真`), ảnh nameplate (`拡大写真/銘板`), kích thước dài×rộng×cao, trọng lượng (kg), và con dấu đại diện công ty YSD (`代表者印 / 丸印 / 社判`).
- **Thanh tra định kỳ:** Hàng năm, khách hàng gửi yêu cầu kiểm kê **`貸与設備棚卸調査依頼`** để rà soát toàn bộ khuôn đang cho YSD mượn (`弊社より貸与している全ての設備`) và kiểm tra xem YSD có lưu `借用書 / 貸出書` đầy đủ không.

### 1.2 Trả khuôn về khách hàng (`金型返却`)
> *"金型返却(引き取り)の依頼が来ています。型番ADV-036の金型をパレットに載せた時の高さを教えてください。返却金型送り状と荷姿写真をご連絡頂きありがとう御座いました。"*  
> — *Email nghiệp vụ trao đổi trả khuôn về khách hàng (Panasonic / Advanex / Proterial)*

- Khi kết thúc hợp đồng, hết vòng đời sản phẩm, hoặc khách chuyển khuôn sang xưởng khác: YSD lập **`金型返却書`** (Mold Return Slip).
- Khuôn được đóng pallet/thùng gỗ, chụp ảnh quy cách đóng hàng (`荷姿写真`), đính kèm vận đơn (`送り状`) và xuất khỏi hệ thống YSD (`keeper_company_id = Customer`, cất khỏi kệ `current_rack_layer_id = NULL`).

### 1.3 Điều chuyển nội bộ YSD
- Khuôn chuyển giữa xưởng chính và chi nhánh/công ty con của YSD **tuyệt đối không lập 借用書**, không coi là mượn.
- Đây thuần túy là điều chuyển kho nội bộ, theo dõi qua `equipment_ship_logs` và `asset_location_logs`. Pháp nhân quản lý vẫn là YSD.

---

## 2. Quyết Định Kiến Trúc Đề Xuất

### 2.1 Định nghĩa lại Semantic của 3 Loại Nghiệp Vụ (`loan_type`)

| Mã `loan_type` cũ | Mã `loan_type` đề xuất | Tên tiếng Nhật | Tên tiếng Việt | Chiều di chuyển vật lý | Vai trò của YSD |
|---|---|---|---|---|---|
| `BORROW` (sai nghĩa: YSD cho mượn) | **`CUSTOMER_LOAN`** *(alias: `CUSTODY`)* | **金型借用 (預託)** | Mượn / Giữ khuôn của Khách | Khách hàng $\rightarrow$ YSD | **YSD là Bên mượn / Giữ hộ** |
| `RETURN` | **`RETURN_TO_CUSTOMER`** *(alias: `RETURN`)* | **金型返却** | Trả khuôn cho Khách | YSD $\rightarrow$ Khách hàng | **YSD là Bên hoàn trả** |
| `REPAIR_OUT` | **`OUTSOURCE_PROCESSING`** *(alias: `REPAIR_OUT`)* | **外注加工・修理** | Gửi gia công ngoài / Mài / Teflon | YSD $\rightarrow$ Bên thứ 3 $\rightarrow$ YSD | **YSD là Bên thuê gia công** |

### 2.2 Quy ước `from_company_id` và `to_company_id` theo Chiều Vật Lý

1. **`CUSTOMER_LOAN` (Khách gửi khuôn vào YSD):**
   - `from_company_id`: Khách hàng sở hữu (SMK, JAE, SHI...) — Bên giao
   - `to_company_id`: YSD — Bên nhận giữ / Bên mượn
   - Hồ sơ pháp lý xuất ra: **`金型借用書`** hoặc **`金型預り証`** (YSD cam kết bảo quản và sử dụng đúng mục đích).
   - Thiết bị: `keeper_company_id = YSD`.

2. **`RETURN_TO_CUSTOMER` (YSD trả khuôn cho khách):**
   - `from_company_id`: YSD — Bên hoàn trả
   - `to_company_id`: Khách hàng — Bên nhận lại
   - Hồ sơ pháp lý xuất ra: **`金型返却書`** kèm vận đơn (`送り状`) và ảnh đóng kiện (`荷姿写真`).
   - Thiết bị: `keeper_company_id = to_company_id` (Khách), xóa vị trí kệ `current_rack_layer_id = NULL`.

3. **`OUTSOURCE_PROCESSING` (Gửi gia công / sửa ngoài):**
   - `from_company_id`: YSD — Bên gửi
   - `to_company_id`: Xưởng gia công thứ 3 (mạ teflon, mài dao, CNC) — Bên nhận gia công
   - Hồ sơ xuất ra: **`金型加工・修理送付状`**.
   - Thiết bị: Tạm chuyển `keeper_company_id = to_company_id` trong trạng thái `IN_TRANSIT`, khi hoàn tất thu hồi về `keeper_company_id = YSD`.

---

## 3. Kế Hoạch Tương Thích Ngược & Điều Chỉnh Code

### A. Tầng Database (Migration 097 & 098)
- **Migration 097 hiện tại:** Giữ nguyên trên Live DB. Bảng `equipment_loans`, trigger `loan_code`, View `v_equipment_loans_summary` và 2 hàm RPC hoàn toàn tương thích về mặt cấu trúc cột.
- **Điều chỉnh Migration 098 (trong Sprint tiếp theo):**
  - Cập nhật CHECK constraint `chk_loan_type` chấp nhận cả mã cũ và mã mới:
    `CHECK (loan_type IN ('CUSTOMER_LOAN', 'RETURN_TO_CUSTOMER', 'OUTSOURCE_PROCESSING', 'BORROW', 'RETURN', 'REPAIR_OUT'))`.
  - Cập nhật `fn_dispatch_equipment_loan` và `fn_complete_equipment_loan_return` để nhận diện chiều gán `keeper_company_id` linh hoạt theo `loan_type`.

### B. Tầng UI & Forms (Milestone 18 Sprint 2)
- Form tạo phiếu sẽ hiển thị rõ ràng:
  - Chọn Loại: `【金型借用】Khách hàng giao khuôn cho YSD giữ hộ` / `【金型返却】YSD hoàn trả khuôn cho khách` / `【外注加工】Gửi khuôn đi mài dao / phủ teflon`.
  - Tự động điền mặc định `from_company_id` và `to_company_id` phù hợp ngữ cảnh, tránh người dùng nhầm lẫn.
- Engine PDF xuất ra 2 mẫu phiếu tách biệt:
  - Mẫu 1: **`金型借用書 (兼 預り証)`** — YSD là bên mượn, có chữ ký đại diện YSD.
  - Mẫu 2: **`金型返却書`** — Biên bản bàn giao hoàn trả tài sản về cho khách.

---

## 4. Hệ Quả (Consequences)

- ✅ **Khớp 100% với thực tế pháp lý Nhật Bản:** Giải quyết triệt để rủi ro kiểm toán tài sản của các khách hàng lớn (SHI, JAE, Panasonic).
- ✅ **Không phát sinh di trú dữ liệu phức tạp:** Schema `equipment_loans` mới tạo ở M18-S1 chưa có dữ liệu sản xuất thực tế (chỉ có dữ liệu test đã dọn sạch).
- ✅ **Bảo tồn phân tách trách nhiệm:** Tách bạch hoàn toàn giữa việc quản lý tài sản khách hàng (`equipment_loans`) và luồng điều chuyển nội bộ xưởng (`equipment_ship_logs`).
