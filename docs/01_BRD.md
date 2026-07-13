# 01_BRD — Business Requirements Document
# YSDMS | YSD Manufacturing System
**Phiên bản:** 1.0
**Ngày ban hành:** 2026-07-13
**Người phê duyệt:** Thoan (Product Owner)
**Trạng thái:** ACTIVE

---

## 1. Bối cảnh & Mục tiêu Doanh nghiệp

### 1.1 Công ty
- **Tên:** 株式会社ヨシダパッケージ (Yoshida Package Co., Ltd.)
- **Lĩnh vực:** Sản xuất khuôn và khay nhựa định hình (Thermoforming)
- **Phạm vi Phase 1:** Trụ sở chính (~20 người dùng)

### 1.2 Vấn đề hiện tại (Pain Points)
1. Quản lý khuôn bằng Access/Excel rời rạc → khó tra cứu lịch sử cải tiến
2. Không có luồng số hóa từ Email đặt hàng → Chỉ thị Sản xuất → Giao hàng
3. Quy tắc đặt tên khuôn chưa chuẩn hóa → dữ liệu legacy không nhất quán
4. Không theo dõi được trạng thái khuôn theo thời gian thực (vị trí, bảo trì)
5. Quy trình mẫu thử & đóng gói đặc thù chưa được số hóa

### 1.3 Mục tiêu hệ thống
- Số hóa toàn bộ vòng đời khuôn: Thiết kế → Chế tạo → Sản xuất → Bảo trì
- Kết nối luồng: Đơn hàng → Chỉ thị SX → Giao hàng trong một hệ thống duy nhất
- Truy xuất nguồn gốc (traceability) đầy đủ theo từng lô sản phẩm

---

## 2. Các Bên Liên quan (Stakeholders)

| Vai trò (JA) | Vai trò (VI) | Người đại diện | Quyền hạn |
|---|---|---|---|
| 営業 | Kinh doanh | Kobayashi | Tạo đơn hàng, gửi bản vẽ KH |
| 設計 | Thiết kế CAD | Quan | Tạo Design Revision, quản lý bản vẽ |
| 金型加工 | Xưởng Khuôn | Endo | Nhận Chỉ thị SX, ghi Worklog |
| 定型 | Xưởng Định hình | Kohirumaki (Kohi) | Chạy máy ILLIG, ghi điều kiện SX |
| 総務・倉庫 | Tổng vụ & Kho | Arai | Quản lý xuất nhập kho, đóng gói |
| システム管理者 | Quản trị hệ thống | Thoan | Product Owner, phê duyệt tất cả |

---

## 3. Yêu cầu Nghiệp vụ (Business Requirements)

### BR-01: Vòng đời Khuôn (Mold Lifecycle)
**Mức độ:** Bắt buộc (MUST)

Hệ thống phải theo dõi đầy đủ vòng đời khuôn:
```
Design Revision → Physical Mold → Job (Gia công) → Worklogs
                                 ↓
                    Teflon Log / Status Log / Maintenance
```
**Trạng thái hiện tại:** 🟢 Đã triển khai, hoạt động ổn định

---

### BR-02: Đặt tên Khuôn Chuẩn hóa
**Mức độ:** Bắt buộc (MUST)

#### Cấu trúc mã khuôn:
```
{客先コード}-{連番}{型式}-{版}-{種別}-{複製}

Ví dụ: JAE-001AB-R2-D-N01
```

#### Bảng quy tắc:
| Trường | Bắt buộc | Định dạng | Quy tắc | Ví dụ |
|---|---|---|---|---|
| 客先コード (Mã KH) | ✅ | 2-5 chữ cái | Bộ Kinh doanh quyết định | `JAE`, `IRI`, `MICS` |
| 連番 (Số thứ tự) | ✅ | 3 chữ số | Đếm liên tục theo KH | `001`→`999` |
| 型式 (Variant) | △ | 1-4 chữ cái | Bỏ trống nếu không có | `A`, `AB`, `BT` |
| 版 (Revision) | △ | R + số | Bỏ R1 (mặc định). Chỉ ghi từ R2 | `R2`, `R3` |
| 種別 (Loại) | △ | M hoặc D | M = Chính thức (bỏ trống). D = Thử (bắt buộc) | `D` |
| 複製 (Bản sao) | △ | N + 2 số | Bỏ trống nếu đơn chiếc | `N01`, `N02` |

#### 3 lớp biểu diễn:
- **`system_code`** (DB/QR): `JAE-001AB-R2-N01` (dấu gạch ngang, không khoảng trắng)
- **`display_name`** (Màn hình): `JAE-001 AB R2 N01` (dấu cách, dễ đọc)
- **`physical_stamp`** (Khắc khuôn): `JAE-001AB R2` (không khắc số bản sao)

**Trạng thái hiện tại:** 🟡 Đã phân tích, chờ AN chuẩn hóa trong DB

---

### BR-03: Đơn hàng & Luồng Kinh doanh
**Mức độ:** Bắt buộc (MUST)

Luồng từ yêu cầu KH → giao hàng:
```
Email KH → Đơn hàng (Order) → Bản vẽ Design Revision
         → Duyệt mẫu thử    → Chỉ thị Sản xuất
         → Sản xuất loạt    → Kiểm tra QC → Đóng gói → Giao hàng
```

Các trường đặc thù bắt buộc:
- Dung sai hình học: `tolerance_x`, `tolerance_y`, `tolerance_pitch`
- Phương thức cắt: `別抜き` (cắt rời) vs `インライン` (inline)
- Trạng thái bộ khuôn phụ: Plug / Cutter / Water-cooling plate (Mới/Tái sử dụng)

**Trạng thái hiện tại:** 🔴 Cần tái cấu trúc

---

### BR-04: Chỉ thị Sản xuất (新規金型製造工程票)
**Mức độ:** Bắt buộc (MUST)

Hệ thống phải số hóa tờ "Chỉ thị Sản xuất" vật lý, bao gồm:
- Tự động điền từ Order + Design Revision đã duyệt
- Phân công phụ trách: Yoshida (vật tư), Endo (khuôn), Kohi (định hình)
- Xuất PDF để in dán xưởng
- Ghi nhận thay đổi đặc thù (thay đổi dung sai trong quá trình làm)

**Trạng thái hiện tại:** 🟡 Đang lên kế hoạch

---

### BR-05: Quản lý Mẫu thử & Đóng gói
**Mức độ:** Quan trọng (SHOULD)

Phân loại mẫu:
| Loại mẫu | JA | Số lượng điển hình | Tính phí |
|---|---|---|---|
| Mẫu miễn phí | 無償サンプル | 10 tấm | Không |
| Mẫu kiểm định QC | 入検用 | 5 tấm | Không |
| Mẫu điều chỉnh máy | 設備調整用 | 50 tấm | Có |
| Mẫu lưu văn phòng | 事務所用 | 2 tấm | Không |

Yêu cầu đóng gói đặc thù:
- Phân túi riêng (袋分け) theo loại mẫu
- Hỗ trợ: Thùng trơn (無地箱), Bọc túi nilon (袋詰め)
- Ghi chú đóng gói tự do

**Trạng thái hiện tại:** 🟡 Đang lên kế hoạch

---

### BR-06: Điều kiện Máy & Lịch Sản xuất
**Mức độ:** Quan trọng (SHOULD)

Máy định hình hiện có:
| Số máy | Model | Kích thước tối đa | Vật liệu |
|---|---|---|---|
| 4号機 | ILLIG | 405×300mm | PS, PVC |
| 5号機 | ILLIG | 499×347mm | PS, PET, PP, PVC |
| 6号機 | ILLIG RV-74c | 470×347mm | PS, PET, PP |
| 7号機 | ILLIG RV-74c | 470×347mm | PS, PET, PP |
| 8号機 | ILLIG RV-74d | 590×350mm | PS, PET, PP |
| 9号機 (Aomori) | ILLIG | 585×285mm | PET |

CAV Water-Cooling Base: 29 loại (A→ZE), cần bảng tương thích máy-khuôn-CAV.

**Trạng thái hiện tại:** 🔴 Schema cần bổ sung

---

## 4. Các Yêu cầu Phi Chức năng (Non-Functional Requirements)

| Yêu cầu | Chi tiết |
|---|---|
| **Ngôn ngữ** | JA (mặc định), hỗ trợ VI / EN qua i18n toggle |
| **Người dùng đồng thời** | ~20 người (Phase 1) |
| **Truy cập** | Web app (Next.js), mobile-friendly |
| **Bảo mật** | RLS Supabase theo role |
| **Xuất dữ liệu** | PDF (Chỉ thị SX, báo cáo QC), Excel (báo cáo kế hoạch) |
| **QR Code** | Gắn khuôn vật lý → quét → truy xuất thông tin ngay trên app |

---

## 5. Ngoài phạm vi (Out of Scope — Phase 1)
- Kế toán / Tài chính (chỉ ghi nhận có phí/miễn phí, không tính toán)
- Quản lý nhân sự / chấm công
- Tích hợp ERP bên ngoài
- Chi nhánh Aomori (Phase 2)
