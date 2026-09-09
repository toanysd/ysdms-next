# 📐 QUY CHUẨN ĐỊNH MỨC GIÁ KHUÔN, DAO CẮT & DỤNG CỤ GÁ LẮP
> **Tài liệu Kỹ thuật Phân hệ Báo giá Khuôn YSD (金型・抜型見積もり基準)**  
> **Mã hồ sơ:** `YSD-SPEC-QUOTE-01`  
> Căn cứ thực tế: `source_data/Form lien quan/金型見積もり基準.xls` & `source_data/Form lien quan/計算/金型見積計算書.xlsx`

---

## 1. NGUYÊN TẮC CỐT LÕI VỀ GIÁ KHUÔN TẠI YOSHIDA PACKAGE

Khác với các công thức tính toán phôi nhôm lý thuyết theo thể tích ($L \times W \times H \times \text{đơn giá phôi}$), **thực tế hoạt động sản xuất và báo giá tại Yoshida Package (YSD) sử dụng hệ thống Bảng Giá Chuẩn (Lookup Master Matrix)** được định mức dựa trên:
1. **Dạng kết cấu khuôn**: Khuôn có gờ phẳng trên đỉnh (`天フランジ`) hay khuôn có váy ôm hạ bậc (`スカート付き`).
2. **Cấp độ chuyên dụng**: Khuôn đa năng gắn đế chung (`汎用`) hay khuôn chuyên dụng theo bộ gá riêng (`専用`).
3. **Mức độ tận dụng dao cắt**: Làm dao bế mới hoàn toàn (`カット寸新規`) hay tận dụng được kích thước dao cắt đã có sẵn trong kho (`カット寸既存`).

---

## 2. BẢNG GIÁ CHUẨN KHUÔN YSD (金型見積もり基準)

*Trích xuất nguyên bản từ `source_data/Form lien quan/金型見積もり基準.xls` (Sheet1, R1-R26)*  
*Đơn vị: JPY (Chưa bao gồm thuế GTGT 10%)*

### A. Khuôn Tiêu Chuẩn Phổ Thông (汎用金型)
Áp dụng cho các khay linh kiện điện tử, khay đóng gói thông thường dùng trên các dòng máy dập tiêu chuẩn 1F/2F.

| Hạng mục chi phí cấu thành | 天フランジ汎用 (Dao MỚI) | 天フランジ汎用 (Dao CÓ SẴN) | スカート付き汎用 (Dao MỚI) | スカート付き汎用 (Dao CÓ SẴN) |
|---|---|---|---|---|
| 設　計 (Thiết kế CAD khuôn) | ¥30,000 | ¥30,000 | ¥30,000 | ¥30,000 |
| 試　作 (Làm mẫu thử nghiệm) | ¥20,000 | ¥20,000 | ¥20,000 | ¥20,000 |
| キャビ (Gia công CNC khoang khuôn) | ¥70,000 | ¥70,000 | ¥100,000 | ¥100,000 |
| プラグ (Bộ trợ lực hút Plug) | ¥30,000 | ¥30,000 | ¥30,000 | ¥30,000 |
| ミガキ (Đánh bóng khoang nhôm) | ¥10,000 | ¥10,000 | ¥10,000 | ¥10,000 |
| 穴あけ (Khoan lỗ hút chân không) | ¥10,000 | ¥10,000 | ¥10,000 | ¥10,000 |
| 抜　刃 (Dao cắt bế vật lý) | **¥30,000** | **¥0** *(Tận dụng dao cũ)* | **¥30,000** | **¥0** *(Tận dụng dao cũ)* |
| スタッキング (Thanh dẫn xếp chồng) | **¥20,000** | **¥0** *(Dùng lại gá cũ)* | **¥20,000** | **¥0** *(Dùng lại gá cũ)* |
| **TỔNG TIỀN (合計)** | **¥220,000** | **¥170,000** | **¥250,000** | **¥200,000** |

> **Ghi chú quản trị xưởng:**  
> Dòng khuôn phổ thông `天フランジ汎用` chi phí gia công nội bộ tối ưu, **KHÔNG sử dụng gia công ngoài** (`外注加工使用不可`). Nếu bắt buộc phải thuê ngoài (gia công ngoại phụ), chi phí đội lên tối thiểu `¥110,000`.

---

### B. Khuôn Chuyên Dụng Đặc Thù (専用金型)
Áp dụng cho các sản phẩm có yêu cầu kỹ thuật cao (dung sai chặt, bo góc phức tạp, khay sâu cần độ chính xác dập cao hoặc khách hàng yêu cầu biên bản đo kiểm CMM).

| Hạng mục chi phí cấu thành | 天フランジ専用 (Dao MỚI) | 天フランジ専用 (Dao CÓ SẴN) | スカート付き専用 (Dao MỚI) | スカート付き専用 (Dao CÓ SẴN) |
|---|---|---|---|---|
| 設　計 (Thiết kế CAD khuôn) | ¥40,000 | ¥40,000 | ¥40,000 | ¥40,000 |
| 試　作 (Làm mẫu thử nghiệm) | ¥20,000 | ¥20,000 | ¥20,000 | ¥20,000 |
| キャビ (Gia công CNC khoang khuôn) | ¥120,000 | ¥120,000 | ¥150,000 | ¥150,000 |
| プラグ (Bộ trợ lực hút Plug) | ¥30,000 | ¥30,000 | ¥30,000 | ¥30,000 |
| ミガキ (Đánh bóng khoang nhôm) | ¥10,000 | ¥10,000 | ¥10,000 | ¥10,000 |
| 穴あけ (Khoan lỗ hút chân không) | ¥10,000 | ¥10,000 | ¥10,000 | ¥10,000 |
| 抜　刃 (Dao cắt bế vật lý) | **¥30,000** | **¥0** *(Tận dụng dao cũ)* | **¥30,000** | **¥0** *(Tận dụng dao cũ)* |
| スタッキング (Thanh dẫn xếp chồng) | **¥20,000** | **¥0** *(Dùng lại gá cũ)* | **¥20,000** | **¥0** *(Dùng lại gá cũ)* |
| 検査表 (Biên bản kiểm tra kích thước) | ¥10,000 | ¥10,000 | ¥10,000 | ¥10,000 |
| **TỔNG TIỀN (合計)** | **¥290,000** | **¥240,000** | **¥320,000** | **¥270,000** |

> **Ghi chú quản trị xưởng:**  
> Dòng khuôn chuyên dụng cho phép sử dụng năng lực gia công ngoài (`外注加工使用可能`) với ngân sách gia công ngoài định mức là `¥110,000`.

---

## 3. CHÍNH SÁCH CHIẾT KHẤU TIỀN KHUÔN THEO LOT ĐẶT HÀNG KHAY
*(発注ロット別特別値引き枠 - 継続品)*

Nhằm khuyến khích khách hàng ký hợp đồng sản xuất khay nhựa số lượng lớn và lặp lại (`継続品`), YSD áp dụng chính sách **giảm trừ trực tiếp tiền làm khuôn** dựa trên quy mô LOT khay đặt hàng đợt đầu:

```
┌────────────────────────────────────────────────────────┐
│ Quy mô LOT đặt hàng khay   │ Mức giảm giá tiền khuôn │
├─────────────────────────────┼──────────────────────────┤
│ Đặt hàng từ 3,000 khay      │ Giảm ngay ¥10,000       │
│ Đặt hàng từ 5,000 khay      │ Giảm ngay ¥20,000       │
│ Đặt hàng từ 10,000 khay trở lên│ Giảm ngay ¥30,000   │
└────────────────────────────────────────────────────────┘
```
*Ví dụ:* Khách hàng đặt khuôn `天フランジ汎用 (Dao MỚI)` trị giá **¥220,000**, đồng thời đặt đợt sản xuất khay 5,000 tấm $\rightarrow$ Giá khuôn thực tế báo cho khách hàng là:  
$$¥220,000 - ¥20,000 = \mathbf{¥200,000}$$

---

## 4. BẢNG PHÂN RÃ CHI PHÍ CHI TIẾT THEO CÔNG NGHỆ CAM/CNC
*Căn cứ trích xuất từ: `source_data/Form lien quan/計算/金型見積計算書.xlsx`*

Khi cần giải trình chi tiết chi phí chế tạo khuôn cho các khách hàng lớn (OEM/Tier-1), bảng định mức chi tiết được phân rã thành 3 khối nghiệp vụ:

### A. Khối Phần Mềm & Dữ Liệu Gia Công (ソフトウェア・設計データ)
| Nội dung chi phí | Định mức 본型 (Khuôn thật) | Định mức 試作 (Khuôn thử) | Ghi chú kỹ thuật |
|---|---|---|---|
| 設計費 / 3D CAD | ¥30,000 | ¥2,000 | Lên bản vẽ 3D từ file step/iges của khách |
| 金型3D モデリング | ¥5,000 | — | Xây dựng mô hình 3D lòng khuôn |
| 金型CAM演算 | ¥5,000 | ¥2,000 | Lập trình đường chạy dao CAM (Mastercam) |
| プラグ作製データ | ¥15,000 | ¥5,000 | Thiết kế và lập trình bộ Plug đẩy nhựa |
| 裏穴データ (Lỗ thoát khí) | ¥3,000 | ¥1,000 | Tọa độ khoan lỗ hút chân không mặt sau |
| **Tiểu kế khối Dữ liệu** | **¥58,000** | **¥10,000** | **Tổng dữ liệu CAD/CAM: ¥68,000** |

### B. Khối Vật Liệu & Phôi Gia Công (材料費・副資材)
| Nội dung chi phí | Định mức 本型 (Khuôn thật) | Định mức 試作 (Khuôn thử) | Ghi chú kỹ thuật |
|---|---|---|---|
| 金型材料費 (Phôi nhôm) | ¥30,000 | ¥7,000 | Đơn giá nhôm tấm khối: **1,250 ¥/kg** |
| プラグ材料費 (Phôi Bakelite/Gỗ) | ¥10,000 | ¥3,000 | Vật liệu làm chày ép trợ lực |
| ネル貼り (Dán nỉ chống xước) | ¥10,000 | — | Lớp vải nỉ dán chống xước bề mặt khay |
| 抜型費 (Dao bế cắt rời/liền) | ¥40,000 | — | Đặt gia công dao bế thép chuyên dụng |
| **Tiểu kế khối Vật liệu** | **¥80,000** | **¥10,000** | **Tổng vật tư: ¥90,000** |

### C. Khối Gia Công Cơ Khí & Hoàn Thiện (機械加工・仕上げ)
| Nội dung chi phí | Định mức 本型 (Khuôn thật) | Định mức 試作 (Khuôn thử) | Ghi chú kỹ thuật |
|---|---|---|---|
| 金型加工費 (Chạy máy phay CNC) | ¥50,000 | ¥0 *(gộp vào vật liệu/CAM)* | Máy phay CNC tốc độ cao |
| 金型仕上 (Đánh bóng & lắp ráp) | ¥10,000 | ¥0 | Thợ nguội làm tay mài bóng lòng khuôn |
| **Tiểu kế khối Cơ khí** | **¥70,000** | **¥0** | **Tổng cơ khí: ¥70,000** |

$$\text{TỔNG TOÀN BỘ KHUÔN THẬT + KHUÔN THỬ} = ¥68,000 + ¥90,000 + ¥70,000 = \mathbf{¥228,000}$$
*(Tương đương mức giá chuẩn khuôn phổ thông ¥220,000)*

---

## 5. XỬ LÝ 3 TRƯỜNG HỢP ĐẶC BIỆT THEO YÊU CẦU ANH THOAN

### Trường hợp 1: Khuôn thử nghiệm (Trial/Sample) CÓ THU PHÍ
- **Áp dụng:** Khi khách hàng yêu cầu làm mẫu thử nghiệm vật lý trước khi sản xuất hàng loạt, hoặc sản phẩm thiết kế mới chưa khẳng định tính khả thi dập.
- **Quy tắc Engine:** Sinh dòng chi phí `SAMPLE` (試作成形費).
- **Mức phí chuẩn:** Cố định **¥15,000 ~ ¥20,000** (đã bao gồm chạy thử 5~10 tấm mẫu gửi khách hàng kiểm tra lắp ráp linh kiện).

### Trường hợp 2: Khuôn thử nghiệm MIỄN PHÍ (Tặng kèm)
- **Áp dụng:** Khi khách hàng ký hợp đồng mua hàng đủ LOT hoặc khách hàng chiến lược lâu năm.
- **Quy tắc Engine & UI:**
  - Bổ sung trường chọn: `free_sample_trial: boolean` trong form lập báo giá.
  - Khi `free_sample_trial = true`: Dòng `SAMPLE` vẫn xuất hiện trên Báo giá PDF nhưng có `unit_price = 0` và cột ghi chú hiển thị: `無償提供 (2〜10枚)` (Cung cấp miễn phí đánh giá).
  - Khối ghi chú chân trang tự động chèn câu: `・サンプルトレイは無償にて2枚お届け可能です。`

### Trường hợp 3: Báo giá DUY NHẤT KHUÔN (Không sản xuất khay)
- **Áp dụng:** Khách hàng thuê YSD gia công khuôn để mang về tự sản xuất, hoặc đặt khuôn xuất khẩu sang nhà máy đối tác nước ngoài.
- **Quy tắc Engine & UI:**
  - Thiết lập `quotation_type = 'MOLD'`.
  - Engine chỉ sinh các dòng thiết bị:
    1. Khuôn nhôm định hình (`item_type = 'MOLD'`)
    2. Dao bế cắt viền (`item_type = 'CUTTER'`)
    3. Plug trợ lực nếu có (`item_type = 'PLUG'`)
    4. Chi phí thử khuôn (`item_type = 'SAMPLE'`)
  - Tuyệt đối **KHÔNG sinh dòng sản phẩm khay nhựa (`item_type = 'PRODUCT'`)**.
