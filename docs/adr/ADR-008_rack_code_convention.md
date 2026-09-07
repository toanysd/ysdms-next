# ADR-008: Rack & Layer Code Convention (Milestone 16)

**Trạng thái:** Accepted  
**Ngày:** 2026-09-07  
**Người quyết định:** Anh Thoan (Product Owner), PE (Kỹ thuật), AN (Thực thi)  
**Bối cảnh:** Phân tích dữ liệu thực tế 90 giá kệ (racks) và 380 tầng kệ (rack_layers) tại xưởng YSD phục vụ Milestone 16 (Equipment Location & Transfer Module).

---

## 1. Bối Cảnh & Vấn Đề

Dữ liệu lưu trữ khuôn và dao cắt kế thừa từ hệ thống `MoldCutterSearch` gặp các bất cập nghiêm trọng về quy ước định danh:

| Vấn đề | Ví dụ thực tế | Hậu quả kỹ thuật |
|---|---|---|
| Ký tự Unicode vòng tròn (①…㊿) | `①`, `⑩`, `㉕`, `㊲` | Không sắp xếp alphanumeric chuẩn được, không an toàn trên URL (`/locations/①`), khó gõ trên bàn phím máy tính và tablet |
| Thiếu tiền tố Zone (Khu vực) | Cả `6号機室` và các phòng khác đều dùng số 1→21 | Trùng lặp nhận diện, khó mở rộng khi bố trí xưởng mới |
| Trùng lặp thông tin | `rack_name: "01"` = `rack_code: "①"` | Dữ liệu dư thừa nhưng không mang ngữ nghĩa vị trí |
| Số nguyên thuần không có prefix | `100`, `101` | Không phân biệt được kệ thường và kệ tạm/chờ xác nhận |
| Chưa liên kết thực thể | `equipment.current_rack_layer_id` là NULL | Mặc dù 4,549 thiết bị đã có `legacy_specs->>'RackLayerID'` nhưng chưa được backfill sang FK chính thức |

---

## 2. Quyết Định Kiến Trúc

### A. Quy ước Mã Kệ (Rack Code Convention)
- **Công thức:** `{ZONE}-{NUMBER}`
  - `ZONE`: 2 ký tự viết hoa đại diện cho khu vực xưởng thực tế.
  - `NUMBER`: 2 chữ số thứ tự của kệ trong khu vực đó (`01`, `02`, ...).
  - Ví dụ: `MR-01` (Kệ 01 tại Phòng máy 6), `TC-02` (Kệ 02 phòng chấm công).

### B. Quy ước Mã Tầng Kệ (Rack Layer Code Convention)
- **Công thức:** `{RACK_CODE}-L{LAYER_NUMBER}`
  - `LAYER_NUMBER`: Số tầng từ 1 đến N (thứ tự từ dưới lên trên).
  - Ví dụ: `MR-01-L1`, `MR-01-L5`, `2F-08-L3`.

### C. Bản Đồ 12 Zone Thực Tế Tại Nhà Máy YSD

| Zone Code | Tên khu vực xưởng (`location_in_factory`) | Mã kệ cũ (rack_name / rack_code) | Số kệ |
|---|---|---|---|
| `MR` | 6号機室 (Phòng máy 6) | 01–12 (`①`–`⑫`) | 12 |
| `M8` | 8号機隣, 8．7号機間のテーブル | 13, 30 (`⑬`, `㉚`) | 2 |
| `TW` | 台湾機プレス, 台湾機２ | 14, 15 (`⑭`, `⑮`) | 2 |
| `OF` | 事務所前 (Trước văn phòng) | 16–21 (`⑯`–`㉑`) | 6 |
| `MD` | 金型部門・機械前, ミガキ部署, 1F新規金型, 1F試作金型, 1F金型部門一時保管 | 22, 23, 70, 71, 72 (`㉒`, `㉓`, `70`, `71`, `72`) | 5 |
| `TC` | タイムカード隣の部屋 (Cạnh máy chấm công) | 24–27 (`㉔`–`㉗`, 地面①-②, 地面②-⑧) | 4 |
| `GT` | 会社出入口室, 会社出入口, 会社入口 | 28, 29, 45–47 (`㉘`, `㉙`, `㊺`–`㊼`) | 5 |
| `PS` | プレス機の上, プレス, プレス奥 | 40–44 (`㊵`–`㊹`) | 5 |
| `MT` | 材料置場 (1F) | 31–34 (`㉛`–`㉞`) | 4 |
| `SC` | スクラップ置場 (Bãi phế liệu) | 35, 36 (`㉟`, `㊱`) | 2 |
| `2F` | 2F, 2Fロフト, 2F成形室, 2F材料置場, 2F金型置き | 48–68, 80–89 (`㊽`–`㊿`, `51`–`68`, `80`–`89`) | 27 |
| `CS` | ケース置き場 (Khu để thùng chứa) | 91–96 (`91`–`96`) | 6 |
| `SP` | 不明, 場所未確認, 未確認, NULL | 37, 100, 101, 未確認 | 11 |
| **Tổng** | **Toàn bộ 12 khu vực xưởng YSD** | — | **90 kệ** |

---

## 3. Chiến Lược Triển Khai Không Gây Gián Đoạn (Non-Breaking Migration)

1. **Giữ nguyên cột cũ:** Cột `rack_code` (chứa ký tự Unicode vòng `①`, `②`...) được giữ nguyên 100% để hiển thị đối chiếu song song trong giai đoạn chuyển tiếp.
2. **Bổ sung cột chuẩn hóa:** Thêm `rack_code_new` và `zone_code` vào `racks`, cập nhật `layer_code` vào `rack_layers`.
3. **Backfill tự động liên kết thiết bị:** Khôi phục `current_rack_layer_id` cho 4,549 thiết bị trực tiếp từ `legacy_specs->>'RackLayerID' = rack_layers.legacy_id`.
4. **Hiệu năng:** Tạo index cho `current_rack_layer_id`, `layer_code`, `zone_code`, `rack_code_new`.

---

## 4. Hệ Quả & Lợi Ích

- **URL-safe & Search-friendly:** Có thể định tuyến trực tiếp `/equipment/locations/MR-01` hoặc tìm kiếm `MR-01-L2` dễ dàng.
- **Tablet-optimized:** Công nhân xưởng có thể gõ nhanh `MR-01` trên màn hình cảm ứng mà không cần tìm ký tự Unicode đặc biệt.
- **Bảo toàn dữ liệu lịch sử:** Toàn bộ 1,450 dòng lịch sử trong `asset_location_logs` giữ nguyên tính toàn vẹn và ánh xạ chính xác qua ID tầng kệ.
