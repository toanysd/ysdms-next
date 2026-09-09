# 📐 QUY CHUẨN CÔNG THỨC TÍNH GIÁ KHAY NHỰA ĐỊNH HÌNH NHIỆT 3 TRỤ CỘT
> **Tài liệu Kỹ thuật Phân hệ Báo giá Sản phẩm Khay YSD (真空成形トレイ単価計算式)**  
> **Mã hồ sơ:** `YSD-SPEC-QUOTE-02`  
> Căn cứ thực tế: `source_data/Form lien quan/見積り計算書(新）.xlsx`, `見積り計算式.xls`, `計算/価格改定計算用2024.6.26.xlsx`

---

## 1. MÔ HÌNH 3 TRỤ CỘT CẤU THÀNH ĐƠN GIÁ KHAY (3 PILLARS OF TRAY PRICING)

Tại Yoshida Package, đơn giá của một sản phẩm khay nhựa định hình chân không (`1枚の値段`) được cấu thành chính xác từ 3 thành tố độc lập:

$$\mathbf{\text{Đơn giá khay}} = \left\lceil \mathbf{(d) \text{ Chi phí vật liệu}} + \mathbf{(e) \text{ Chi phí bao bì \& vận chuyển}} + \mathbf{(f) \text{ Chi phí gia công dập}} \right\rceil$$

> **Quy tắc làm tròn YSD (BẮT BUỘC):**  
> `小数点以下すべて切り上げ` — Mọi kết quả cộng 3 trụ cột có số lẻ thập phân đều phải **làm tròn LÊN** số nguyên gần nhất bằng hàm `Math.ceil()`. Tuyệt đối không làm tròn xuống hay làm tròn thông thường, nhằm bảo toàn biên lợi nhuận cho xưởng.

---

## 2. TRỤ CỘT (d) — CHI PHÍ VẬT LIỆU NHỰA (材質費・材料費)

### A. Công thức toán học chuẩn YSD
*Trích xuất từ ô `I4` file `見積り計算書(新）.xlsx`: `B4*C4*D4*E4*F4*G4*H4`*

$$d = \frac{\text{Loss} \times \rho \times W_{\text{film}} \times P_{\text{feed}} \times t \times \text{Price}_{\text{mat}} \times \text{Markup}}{\text{Cavity}}$$

Trong đó các tham số kỹ thuật được xác định như sau:

| Ký hiệu | Tên tham số (JA) | Tên tiếng Việt | Đơn vị | Giá trị chuẩn / Nguồn dữ liệu |
|---|---|---|---|---|
| $\text{Loss}$ | ロス率 | Tỉ lệ hao hụt biên nhựa (Scrap) | Hệ số | **1.05** (Định mức hao hụt 5% cho dập khay tiêu chuẩn) |
| $\rho$ | 比重 | Tỉ trọng / Trọng lượng riêng nhựa | $\text{g/cm}^3$ | Tra cứu theo loại nhựa (xem Bảng Tra cứu mục C) |
| $W_{\text{film}}$ | 材料巾 | Chiều rộng khổ cuộn nhựa | mét ($\text{m}$) | $\text{Width (mm)} / 1000$ (Tra từ Bảng quy cách hoặc công thức B) |
| $P_{\text{feed}}$ | 送り | Bước tiến màng dập mỗi shot (Pitch) | mét ($\text{m}$) | $\text{Length (mm)} / 1000$ (Xác định theo quy chuẩn mục B) |
| $t$ | 厚み | Độ dày màng nhựa thiết kế | milimet ($\text{mm}$) | Lấy từ `design_revisions.thickness_mm` |
| $\text{Price}_{\text{mat}}$ | 材料単価 | Đơn giá nhựa cuộn nguyên liệu | JPY / kg | Tra cứu theo chủng loại nhựa tại thời điểm báo giá |
| $\text{Markup}$ | 変動比 | Hệ số bù đắp rủi ro & biến động giá | Hệ số | **1.2** (Hệ số bù trừ 20% cho chi phí tồn kho và phế liệu) |
| $\text{Cavity}$ | 面数 | Số khoang khay trên một khuôn dập | Khoang/Shot | Lấy từ `design_revisions.cavity_count` (mặc định = 1) |

---

### B. Quy chuẩn Kỹ thuật Xác định Bước tiến (Pitch) và Khổ màng (Film Width)

Đây là **phát hiện kỹ thuật then chốt** đối chiếu từ phôi tính toán thực tế của YSD:

1. **Quy tắc tính Bước tiến dập ($P_{\text{feed}}$ - 送り):**
   *Trước đây code cũ tự suy đoán $L + 30\text{mm}$. Thực tế YSD quy định:*
   $$P_{\text{feed}} = \text{Chiều dài khoang khuôn (キャビ寸)} + \mathbf{15\text{ mm}} \quad (\text{hoặc } + \mathbf{20\text{ mm}} \text{ cho khuôn dập sâu})$$
   - Ví dụ: Khuôn dài 305mm $\rightarrow$ Bước tiến = $305 + 15 = 320\text{ mm} = \mathbf{0.320\text{ m}}$.

2. **Quy tắc tính Chiều rộng khổ cuộn nhựa ($W_{\text{film}}$ - 材料巾):**
   $$W_{\text{film}} = \text{Chiều rộng khoang khuôn (キャビ巾)} + \mathbf{40\text{ mm}} \quad (\text{mép kẹp xích 2 bên: mỗi bên 20mm})$$
   - Ví dụ: Khuôn rộng 480mm $\rightarrow$ Khổ màng = $480 + 40 = 520\text{ mm} = \mathbf{0.520\text{ m}}$.

---

### C. Bảng Master Tỉ trọng ($\rho$) và Đơn giá Nhựa Chuẩn YSD
*Trích xuất nguyên bản từ `見積り計算書(新）.xlsx` (R11-R23)*

| Ký hiệu vật liệu | Tên đầy đủ loại nhựa | Tỉ trọng $\rho$ ($\text{g/cm}^3$) | Đơn giá cơ sở (¥/kg) | Hệ số biến động |
|---|---|---|---|---|
| **PS(N)** | Polystyrene Tự nhiên (Natural) | **1.05** | ¥275 ~ ¥285 | 1.2 |
| **PS(W)** | Polystyrene Trắng (White) | **1.06** | ¥285 | 1.2 |
| **PS(CL)** | Polystyrene Trong suốt (Clear) | **1.05** | ¥380 | 1.2 |
| **PS(B) 導電** | PS Đen Dẫn điện (Carbon Conductive) | **1.06** | ¥320 | 1.2 |
| **PS(B) 導電練り込み** | PS Đen Dẫn điện Hạt phối trộn | **1.18** | ¥650 | 1.2 |
| **PS(B) 導電印刷** | PS Đen Phủ mực dẫn điện in ấn | **1.06** | ¥485 | 1.2 |
| **PP(N) 帯電防止** | Polypropylene Tự nhiên Chống tĩnh điện | **0.91** | ¥285 | 1.2 |
| **PP(W) 帯電防止** | Polypropylene Trắng Chống tĩnh điện | **0.91** | ¥285 | 1.2 |
| **PET(CL)** | A-PET Trong suốt (Clear) | **1.34** | ¥265 | 1.2 |
| **PET(G)** | PET-G Chống va đập cao | **1.34** | ¥490 | 1.2 |
| **PET(B)** | PET Đen | **1.34** | *Thỏa thuận riêng theo lô* | 1.2 |

---

## 3. TRỤ CỘT (e) — CHI PHÍ BAO BÌ VẬN CHUYỂN (運賃・梱包費)

*Trích xuất từ ô `I6` file `見積り計算書(新）.xlsx`: `G6/H6`*

$$e = \frac{1,000 \text{ ¥}}{\text{Số lượng khay / 1 thùng carton (1ケースの梱包数)}}$$

- **Định mức chi phí:** YSD tính trọn gói chi phí 1 thùng carton (bao gồm vỏ hộp carton đôi, băng dính, túi PE bọc trong và chi phí vận chuyển nội địa khu vực Kanto) là **1,000 JPY/thùng**.
- **Chia trên đầu sản phẩm:** Lấy 1,000 chia cho số khay xếp trong 1 thùng (quy cách đóng gói theo chỉ thị sản xuất).
  - *Ví dụ:* Đóng 150 khay/thùng $\rightarrow$ $e = 1,000 / 150 = \mathbf{6.67\text{ ¥/khay}}$.
  - *Ví dụ:* Đóng 100 khay/thùng $\rightarrow$ $e = 1,000 / 100 = \mathbf{10.00\text{ ¥/khay}}$.
  - *Ví dụ:* Đóng 500 khay/thùng $\rightarrow$ $e = 1,000 / 500 = \mathbf{2.00\text{ ¥/khay}}$.

---

## 4. TRỤ CỘT (f) — CHI PHÍ GIA CÔNG DẬP THEO LOT (加工費)

### A. Công thức toán học chuẩn YSD
*Trích xuất từ ô `H10` file `見積り計算書(新）.xlsx`: `(B10/C10+0.5)*E10/F10`*

$$f = \frac{\left( \frac{\text{Lot}}{\text{Tốc độ dập (shot/h)}} + 0.5\text{h setup} \right) \times \text{Đơn giá giờ máy } (¥/\text{h})}{\text{Lot}}$$

Trong đó:
- $\text{Lot}$: Số lượng khay đặt hàng sản xuất trong đợt.
- $\text{Tốc độ dập (生産数/h)}$: Năng suất dập định hình mỗi giờ của máy (tra mục B).
- $0.5\text{h setup}$: Thời gian chuẩn bị máy, gá đặt cuộn nhựa, căn chỉnh nhiệt độ (mặc định 30 phút = 0.5 giờ).
- $\text{Đơn giá giờ máy (加工費/h)}$: Chi phí máy và nhân công theo bậc LOT (tra mục C).

---

### B. Bảng Năng Suất Dập Định Hình (生産数/h - サイクル目安)
*Trích xuất nguyên bản từ `見積り計算書(新）.xlsx` (R24-R36)*

#### 1. Khu xưởng Tầng 1 (1F - Máy dập công suất lớn, khổ lớn):
| Loại nhựa | Độ dày ($t$) | Tốc độ dập ($\text{shot/h}$) | Loại nhựa | Độ dày ($t$) | Tốc độ dập ($\text{shot/h}$) |
|---|---|---|---|---|---|
| **PS** | 0.4 mm | 900 shot/h | **PET** | 0.5 mm | 700 shot/h |
| **PS** | 0.5 mm | 800 shot/h | **PET** | 0.7 mm | 600 shot/h |
| **PS** | 0.6 mm | 700 shot/h | **PET** | 0.8 mm | 500 shot/h |
| **PS** | 0.8 mm | 600 shot/h | **PP** | 0.4 mm | 600 shot/h |
| **PS** | 1.0 mm | 500 shot/h | **PP** | 0.5 mm | 500 shot/h |
| — | — | — | **PP** | 0.6 mm | 450 shot/h |

#### 2. Khu xưởng Tầng 2 (2F - Máy dập linh hoạt, không dập PET):
| Loại nhựa | Độ dày ($t$) | Tốc độ dập ($\text{shot/h}$) | Loại nhựa | Độ dày ($t$) | Tốc độ dập ($\text{shot/h}$) |
|---|---|---|---|---|---|
| **PS** | 0.4 mm | 800 shot/h | **PP** | 0.4 mm | 500 shot/h |
| **PS** | 0.5 mm | 700 shot/h | **PP** | 0.5 mm | 450 shot/h |
| **PS** | 0.6 mm | 650 shot/h | **PP** | 0.6 mm | 400 shot/h |
| **PS** | 0.8 mm | 600 shot/h | — | — | — |
| **PS** | 1.1 mm | 450 shot/h | — | — | — |

---

### C. Bảng Phân Tầng Đơn Giá Giờ Máy Theo Quy Mô LOT (加工費/h)
*Trích xuất từ `見積り計算書(新）.xlsx` (R16-R20) & `見積り計算式.xls` (R1-R5)*

Chi phí vận hành máy theo giờ được chiết khấu giảm dần theo quy mô đặt hàng:

| Mức LOT đặt hàng | Nhựa PS / PET | Nhựa PP | Khách hàng AMP (Khoán cố định) |
|---|---|---|---|
| **LOT 1,000 khay** (hoặc dưới 1,000) | **¥15,000 / h** | **¥15,000 / h** | **¥12,000 / h** |
| **LOT 2,000 khay** | **¥14,000 / h** | ¥15,000 / h | **¥12,000 / h** |
| **LOT 3,000 khay** | **¥13,000 / h** | **¥12,000 / h** | **¥12,000 / h** |
| **LOT 5,000 khay** | **¥12,000 / h** | ¥12,000 / h | **¥12,000 / h** |
| **LOT 10,000 khay trở lên** | **¥10,000 / h** | **¥10,000 / h** | **¥12,000 / h** |

---

## 5. VÍ DỤ TÍNH TOÁN THỰC TẾ (BENCHMARK TEST CASE)
*Đối soát chuẩn xác 100% với file `見積り計算書(新）.xlsx` dòng R4, R6, R9, R13:*

### Thông số đầu vào:
- Sản phẩm khay PS Trắng: $t = 0.6\text{ mm}$, Tỉ trọng $\rho = 1.05$, Đơn giá nhựa = $285\text{ ¥/kg}$.
- Khổ cuộn: $W_{\text{film}} = 0.520\text{ m}$ ($520\text{ mm}$), Bước tiến: $P_{\text{feed}} = 0.320\text{ m}$ ($320\text{ mm}$). Số khoang = 1.
- Đóng gói: Thùng chứa 150 khay.
- Đặt hàng LOT: 500 khay. Tốc độ dập xưởng: 650 khay/giờ.

### Các bước tính toán:
1. **(d) Chi phí vật liệu:**
   $$d = 1.05 \times 1.05 \times 0.520 \times 0.320 \times 0.600 \times 285 \times 1.2 = \mathbf{37.65\text{ JPY}}$$
2. **(e) Chi phí bao bì & vận chuyển:**
   $$e = 1,000 / 150 = \mathbf{6.67\text{ JPY}}$$
3. **(f) Chi phí gia công dập:**
   $$\text{Thời gian dập} = (500 / 650) + 0.5 = 0.769 + 0.5 = 1.269\text{ giờ}$$
   $$\text{Tiền máy} = 1.269\text{ h} \times 15,000\text{ ¥/h} = 19,038\text{ JPY}$$
   $$f = 19,038 / 500 = \mathbf{38.08\text{ JPY}}$$
4. **Tổng đơn giá khay:**
   $$\text{Tổng trước làm tròn} = 37.65 + 6.67 + 38.08 = 82.39\text{ JPY}$$
   $$\text{Đơn giá báo khách (Làm tròn lên)} = \lceil 82.39 \rceil = \mathbf{83\text{ JPY/khay}}$$
*(Khớp chính xác 100% giá trị tại ô K14 của bảng tính YSD gốc!)*
