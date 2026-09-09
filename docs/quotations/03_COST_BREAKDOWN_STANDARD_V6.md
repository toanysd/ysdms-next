# 📐 CHUẨN PHÂN RÃ GIÁ THÀNH 14 THÀNH PHẦN CHI PHÍ CHUYÊN NGHIỆP
> **Tài liệu Kỹ thuật Phân hệ Giải trình Giá thành YSD (見積原価計算書フォーマット Ver6)**  
> **Mã hồ sơ:** `YSD-SPEC-QUOTE-03`  
> Căn cứ thực tế: `source_data/Form lien quan/見積原価計算書フォーマットver6.xlsx` (Sheets: `記入例`, `ロット1,000`, `ロット500`, `ロット100`, `ロット50`)

---

## 1. MỤC ĐÍCH & PHẠM VI ÁP DỤNG

Trong các giao dịch với những tập đoàn công nghệ lớn tại Nhật Bản (như Fujitsu, Rapidus, TE Connectivity, Mabuchi Motor, MinebeaMitsumi...), khách hàng yêu cầu phương thức định giá minh bạch (Open-Book Costing / Cost Breakdown Analysis).

Thay vì chỉ gửi một báo giá tổng hợp đơn giản (`御見積書`), Yoshida Package sử dụng biểu mẫu **`見積原価計算書フォーマット Ver6`** để giải trình chi tiết cơ cấu chi phí sản xuất đến từng yên, gồm **14 thành phần chi phí** được chuẩn hóa theo quy chuẩn thẩm định chi phí mua sắm công nghiệp.

---

## 2. BẢNG CẤU TRÚC 14 THÀNH PHẦN GIÁ THÀNH (FORMAT VER6)

*Trích xuất chuẩn xác công thức và tỷ lệ phân bổ từ file gốc:*

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CƠ CẤU GIÁ THÀNH SẢN PHẨM                       │
├────────────────────────────────────────────────────────────────────────┤
│  [KHỐI SẢN XUẤT]                                                       │
│    ① 加工費 (Chi phí gia công dập + cắt bế + kiểm tra)                 │
│    ② 材料費 (Chi phí nguyên vật liệu chính)                             │
│    ③ 一般管理費 = ① × 5% (Chi phí quản lý gia công sản xuất)           │
│    ④ 材料管理費 = ② × 5% (Chi phí lưu kho & quản lý vật liệu)          │
│    ⑤ 利益率 = (① + ③ + ④) × 5% (Lợi nhuận định mức gia công)           │
│    ⑥ その他 (Chi phí phụ trợ khác)                                     │
│    ⑦ 仕損費 (Chi phí dự phòng rủi ro phế phẩm gia công)                 │
│    ──────────────────────────────────────────────────                  │
│    ⑧ 小計 (Tổng chi phí chế tạo tại xưởng) = ①+②+③+④+⑤+⑥+⑦           │
├────────────────────────────────────────────────────────────────────────┤
│  [KHỐI ĐÓNG GÓI & VẬN CHUYỂN]                                          │
│    ⑨ 梱包費 (Chi phí thùng carton, khay lót, băng dính, pallet)         │
│    ⑩ 物流費 (Chi phí vận tải giao nhận tận kho khách hàng)              │
│    ──────────────────────────────────────────────────                  │
│    ⑪ 納入経費小計 = ⑨ + ⑩                                              │
├────────────────────────────────────────────────────────────────────────┤
│  [KHỐI KHẤU HAO THIẾT BỊ & ĐỒ GÁ]                                      │
│    ⑫ 金型費(起工型時) (Tiền khuôn phân bổ trên từng sản phẩm)          │
│    ⑬ 治具費 (Chi phí đồ gá phụ trợ nếu có)                            │
│    ──────────────────────────────────────────────────                  │
│    ⑭ 償却費小計 = ⑫ + ⑬                                                │
├────────────────────────────────────────────────────────────────────────┤
│  [TỔNG ĐƠN GIÁ BÁN CHO KHÁCH HÀNG]                                     │
│    ⑮ 製品単価 (Đơn giá giao hàng) = ⑧ + ⑪ + ⑭                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. CHI TIẾT CÁC THÀNH PHẦN CHI PHÍ & TỶ LỆ PHÂN BỔ

### ① Chi phí gia công (加工費)
Tổng hợp chi phí vận hành máy móc và nhân công trên từng công đoạn dập:
- Công đoạn 1: **真空成形** (Dập hút chân không) — Chi phí giờ máy: `¥12,000/h`, năng suất dập: `550 ~ 900 shot/h`.
- Công đoạn 2: **抜き加工** (Bế cắt viền tách khay) — Chi phí máy dập bế: `¥3,000/h`, năng suất: `240 ~ 300 shot/h`.
- Công đoạn 3: **検査・梱包** (Kiểm tra ngoại quan QC & đóng gói) — Chi phí nhân công KCS: `¥2,000 ~ ¥2,400/h`, năng suất: `250 ~ 300 khay/h`.

### ② Chi phí nguyên vật liệu (材料費)
- Tính toán lượng nhựa tiêu hao thực tế cho mỗi sản phẩm (sau khi tính hao hụt biên nhựa `歩留: 95%`).
- Công thức: `Khối lượng khay (g) × Đơn giá nhựa (¥/kg) / 1000`.

### ③ Chi phí quản lý chung (一般管理費)
- **Tỷ lệ định mức:** Đúng **5% trên chi phí gia công** ($\text{③} = \text{①} \times 5\%$).
- Dùng bù đắp chi phí điện năng nhà xưởng, bảo trì máy móc và lương bộ phận quản lý xưởng.

### ④ Chi phí quản lý vật liệu (材料管理費)
- **Tỷ lệ định mức:** Đúng **5% trên chi phí vật liệu** ($\text{④} = \text{②} \times 5\%$).
- Bù đắp chi phí lưu kho cuộn nhựa, xe nâng, rủi ro biến chất màng nhựa trong quá trình bảo quản.

### ⑤ Tỷ suất lợi nhuận sản xuất (利益率)
- **Công thức chuẩn YSD:** $\text{⑤} = (\text{①} + \text{③} + \text{④}) \times 5\%$.
- Lợi nhuận sản xuất thuần được tính trên tổng chi phí gia công và quản lý liên quan.

### ⑨ & ⑩ Chi phí bao bì đóng gói & Logistics (梱包費・物流費)
Tách rời theo điểm giao hàng thực tế của khách hàng:
- Điểm giao A (FMPL): Đóng thùng double-carton 10 cái/hộp $\rightarrow$ Đóng gói: `¥20.00`, Vận chuyển: `¥30.00`.
- Điểm giao B (FPE / Kanto): Đóng thùng 20 cái/hộp $\rightarrow$ Đóng gói: `¥1.00`, Vận chuyển: `¥3.00`.
- Điểm giao C (Khu công nghiệp ngoại tỉnh / Quốc tế): Thỏa thuận theo pallet hoặc container.

---

## 4. CƠ CHẾ KHẤU HAO KHUÔN VÀO SẢN PHẨM (⑫ 金型償却費)

Trong trường hợp khách hàng **không chi trả 100% tiền khuôn trong lần đầu tiên**, YSD và khách hàng thỏa thuận phân bổ chi phí khuôn vào từng khay nhựa dựa trên sản lượng kế hoạch cam kết (`企画台数`):

$$\text{Phí khuôn phân bổ (¥/khay)} = \frac{\text{Tổng chi phí chế tạo khuôn (¥)}}{\text{Sản lượng cam kết khấu hao (台数 / 枚)}}$$

*Ví dụ thực tế (Từ sheet `ロット1,000`):*
- Chi phí khuôn: `¥9,000,000`
- Sản lượng dự kiến dập trong vòng đời: `300,000 khay`
- $\rightarrow$ Mức khấu hao: $¥9,000,000 / 300,000 = \mathbf{¥30.00\text{ / khay}}$.
- Dòng `⑫ 金型費` sẽ cộng đúng `¥30.00` vào đơn giá mỗi chiếc khay bán ra. Sau khi đủ 300,000 khay, đơn giá sản phẩm sẽ tự động giảm trừ `¥30.00`.
