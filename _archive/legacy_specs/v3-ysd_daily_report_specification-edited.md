# 📋 ĐẶC TẢ NHẬT KÝ HÀNG NGÀY — TẤT CẢ BỘ PHẬN YSD
# Daily Report (日報) Specification for YSDMS-Next V3

> **Ngày lập:** 2026-08-21  
> **Nguồn:** Parse trực tiếp từ 7 file Excel form thực tế trong `source_data/Form lien quan/`  
> **Mục đích:** Cơ sở xây dựng DB tables và UI/UX form nhập liệu cho hệ thống

---

## TỔNG QUAN HỆ THỐNG NHẬT KÝ YSD

```mermaid
graph TD
    A["📋 HỆ THỐNG NHẬT KÝ YSD"] --> B["成形日報<br/>Forming Daily Log"]
    A --> C["プレス日報<br/>Press Daily Log"]
    A --> D["検査日報<br/>Inspection Daily Log"]
    A --> E["設計&金型日報<br/>Design & Mold Log"]
    A --> F["運転日報<br/>Vehicle/Transport Log"]
    A --> G["不適合報告書<br/>Non-Conformity Report"]
    
    B -->|"Case 1: INLINE"| H["→ Inspection → Packing → Ship"]
    B -->|"Case 2: SEPARATE"| C
    C --> D
    D --> I["→ Packing → Ship"]
```

YSD có **6 loại nhật ký chính** + 1 báo cáo không phù hợp, mỗi loại có form riêng đã chuẩn hóa ISO.

---

## 1. NHẬT KÝ THÀNH HÌNH (成形日報)

**File template:** `F 日報兼不適合製品記録書（成形最新版）2-20-4.xls`  
**Phiên bản TE riêng:** `F TE用日報兼不適合製品記録書（成形）.xls`  
**Tên đầy đủ:** 日報兼不適合製品記録書（金型異常連絡書含む）  
**Người tạo/duyệt:** 小比類巻 (tạo) / 吉田 (duyệt — Giám đốc)

### 1A. Header — Thông tin chung

| # | Trường | Tên JP | Mô tả | Kiểu dữ liệu |
|---|--------|--------|-------|---------------|
| 1 | Máy | 機械ナンバー | Số hiệu máy thành hình (3号~9号) | Dropdown |
| 2 | Người thao tác | 作業者 | Tên công nhân đứng máy | Text/Dropdown |
| 3 | Ngày | 作業日 | 年/月/日 | Date |

### 1B. Thông tin sản phẩm & khuôn

| # | Trường | Tên JP | Mô tả | Kiểu |
|---|--------|--------|-------|------|
| 4 | Mã khuôn | 型番 | VD: 2-912020-4 | Text (link equipment) |
| 5 | Sản lượng / Số shot | 生産数量 / ショット数 | Số tấm sản xuất | Number |
| 6 | Kích thước khuôn | 金型サイズ | CAV code (VD: ZD, 74C) | Dropdown |
| 7 | Số khoang | 面数 | Số pocket trên 1 tấm (2P, 3P) | Number |
| 8 | Bước tiến | 送り寸法 | Khoảng cách tiến nhựa (mm) | Number |
| 9 | Số dao cắt | 抜刃番号 | Mã dao cắt đang sử dụng | Text (link equipment) |

### 1C. 7 Hạng mục kiểm tra trước sản xuất (Pre-production Checklist)

> [!IMPORTANT]
> Mỗi hạng mục phải có **dấu xác nhận (担当者印)** của người kiểm tra trước khi chạy máy.

| # | Hạng mục | Tên JP | Nội dung kiểm tra |
|---|----------|--------|-------------------|
| 10 | Vệ sinh máy | 機械汚れ | Kiểm tra cửa vào vật liệu, cửa ra sản phẩm |
| 11 | Hoạt động máy | 成形機動作確認 | Tiếng ồn bất thường, rò rỉ dầu |
| 12 | Khuôn | 金型セット確認 | Xước, hư hỏng Plug |
| 13 | Dao cắt | 抜型セット確認 | Hư hỏng, biến dạng |
| 14 | Stacking | スタッキング確認 | Hư hỏng, bẩn |
| — | *(Riêng TE)* | 材料状況確認 | Kiểm tra nguyên liệu (bẩn, hư hỏng) |
| — | *(Riêng TE)* | 条件入力 | Nhập điều kiện (nhiệt độ phòng, điều kiện mùa) |

### 1D. Thông tin vật liệu

| # | Trường | Tên JP | Mô tả | Kiểu |
|---|--------|--------|-------|------|
| 15 | Vật liệu sử dụng | 使用材料 | Loại nhựa, độ dày, thông số đặc biệt | Text |
| 16 | Nhà sản xuất | 材料メーカー | Tên NCC nhựa | Text |
| 17 | Mã lô | 材料ロット番号 | Lot tracking | Text |
| 18 | Số mét sử dụng | 使用m数 | Chiều dài cuộn nhựa đã dùng | Number (m) |

### 1E. Kiểm tra chất lượng tại máy

| # | Trường | Tên JP | Mô tả | Kiểu |
|---|--------|--------|-------|------|
| 19 | Kích thước bản vẽ | 長手×短手 図面寸法 | L × W theo spec | Number × Number |
| 20 | Kích thước thực đo | 長手×短手 実測値 | L × W đo thực tế | Number × Number |
| 21 | Kiểm tra 20 tấm đầu | 良品検出後20枚全数検査 | OK / NG (sau khi ra sản phẩm tốt đầu tiên) | Boolean |
| 22 | Chu kỳ thành hình | 成形サイクル | Giây/cycle | Number (s) |
| 23 | Tình trạng khung | フレーム状況確認 | OK / NG | Boolean |

### 1F. Phân loại lỗi (7 mã — 異常分類)

| Mã | Tên JP | Mô tả VN |
|----|--------|----------|
| **A** | 成形不良 | Lỗi thành hình (không đủ hình dạng, co ngót) |
| **B** | 抜きズレ不良 | Lỗi lệch cắt (dao cắt không đúng vị trí) |
| **C** | スタッキング不良 | Lỗi xếp chồng (khay không xếp đúng) |
| **D** | シート不良 | Lỗi tấm nhựa (vật liệu đầu vào kém) |
| **E** | 機械異常による不良 | Lỗi do máy bất thường |
| **F** | 金型、抜型異常 | Lỗi do khuôn/dao cắt bất thường |
| **G** | その他 | Lỗi khác |

### 1G. Xử lý sản phẩm lỗi (3 phương án — 処置)

| Mã | Tên JP | Mô tả VN | Ghi chú |
|----|--------|----------|---------|
| **1** | 廃棄 | Tiêu hủy | **Mặc định** — sản phẩm lỗi nguyên tắc phải tiêu hủy |
| **2** | 特別採用 | Chấp nhận đặc biệt | Cần phê duyệt từ KH hoặc quản lý |
| **3** | 製造中止 | Dừng sản xuất | Khi lỗi nghiêm trọng, dừng toàn bộ dây chuyền |

> [!WARNING]
> **Quy tắc:** Khi phát hiện lỗi → kiểm tra **30 tấm trước và sau** lỗi (前後30枚を全数検品)  
> **Quy tắc:** Khi vật liệu hao hụt ≥ 100 tấm → **bắt buộc ghi nhận** (材料100枚分のロス)

### 1H. Mục bổ sung

| # | Trường | Tên JP | Mô tả |
|---|--------|--------|-------|
| 24 | PP board check | 小箱作製用PP板保管確認 | Kiểm tra tấm PP cho hộp nhỏ: OK/NG |
| 25 | Ghi chú đặc biệt | 特記事項 | Free text |
| 26 | Số lượng lỗi | 不適合 数量 | Số tấm lỗi |
| 27 | Dấu hoàn thành | 終了印 | Ký xác nhận cuối ca |
| 28 | *(Riêng TE)* 出荷予定日 | Ngày giao hàng dự kiến | Date |

---

## 2. NHẬT KÝ DẬP CẮT (プレス日報)

**File template:** `F プレス＆検査部門日報記録書 - ベトナム語含む.xls`  
**Đặc điểm:** Song ngữ JP/VN

### 2A. Header

| # | Trường JP | Trường VN | Kiểu |
|---|----------|----------|------|
| 1 | 作業日 (年/月/日) | Ngày làm việc | Date |
| 2 | 作業者 | Người làm | Text/Dropdown |
| 3 | 労働時間 | Thời gian làm việc | Number (h) |

### 2B. Dữ liệu per sản phẩm (mỗi dòng = 1 khuôn)

| # | Trường JP | Trường VN | Mô tả | Kiểu |
|---|----------|----------|-------|------|
| 4 | 型番 | Mã hàng | Mã khuôn/sản phẩm | Text |
| 5 | 作業内容＆ショット数 | Nội dung & số shot | Chi tiết thao tác + số lần dập | Text + Number |
| 6 | 備考欄 | Ghi chú | Báo cáo chi tiết nếu có sự cố | Text |
| 7 | 作業時間 | Thời gian làm việc | Giờ cho hạng mục này | Number (h) |
| 8 | 付加価値（金額）| Giá trị gia tăng | Giá trị sản phẩm tạo ra (¥) | Number (¥) |

### 2C. Kiểm tra chất lượng tại Press

| # | Hạng mục | Tên JP | Mô tả |
|---|----------|--------|-------|
| 9 | Số lượng lỗi | 不適合 製品 | Đếm sản phẩm NG |
| 10 | Phân loại lỗi | 異常 分類 | Mã A~G (giống form thành hình) |
| 11 | Xử lý | 処置 | Mã 1/2/3 |
| 12 | Kích thước thực đo | 長手×短手（実測値） | L × W sau cắt |
| 13 | Kiểm tra hình dạng dao | カッター形状確認 | OK/NG |
| 14 | Kiểm tra 5 tấm đầu | 5枚チェック | Lấy 5 tấm đầu kiểm tra |
| 15 | Kiểm tra mỗi 100 tấm | 100枚毎にチェック | Sampling per 100 sheets |
| 16 | Kiểm tra bẩn | 汚れ | Vết bẩn trên sản phẩm |

---

## 3. NHẬT KÝ KIỂM TRA (検査日報)

**File template:** `F 検査作業日報兼日常点検.xls`  
**Phiên bản KSE:** `検査作業日報兼日常点検(KSE専用）「チェックリスト」－ベトナム語含む.xls`

### 3A. Header

| # | Trường | Tên JP | Kiểu |
|---|--------|--------|------|
| 1 | Ngày | 作業日 | Date |
| 2 | Người kiểm tra | 作業者 | Text |
| 3 | Ngày cập nhật form | 作成/改定年月日 | Date |

### 3B. Dữ liệu per sản phẩm

| # | Trường | Tên JP | Kiểu |
|---|--------|--------|------|
| 4 | Mã khuôn | 型番 | Text |
| 5 | Ngày thành hình | 成形日 | Date |
| 6 | Số lượng kiểm tra | 検査数量 | Number |

### 3C. 8 LOẠI LỖI CHI TIẾT (不具合 phân loại)

> [!IMPORTANT]
> Đây là hệ thống phân loại lỗi chuẩn ISO của YSD — cần implement **chính xác** trong DB.

| # | Mã | Tên JP | Tên VN | Mô tả |
|---|-----|--------|--------|-------|
| 1 | WC | 白化・割れ・潰れ | Bạc hóa / Nứt / Dập | Nhựa bị trắng hoặc gãy |
| 2 | BH | バリ・ヒゲ | Ba-via / Râu | Nhựa thừa ở mép cắt |
| 3 | SC | 傷 | Xước | Vết xước trên bề mặt |
| 4 | DT | 汚れ | Bẩn | Vết bẩn, dấu vân tay |
| 5 | BR | ブリッジ発生 | Bridge | Nhựa dính giữa 2 pocket |
| 6 | FM | 異物付着 | Dị vật | Vật lạ dính trên sản phẩm |
| 7 | SD | シート不良 | Lỗi tấm nhựa | Nguyên liệu đầu vào kém chất lượng |
| 8 | OT | 変形・その他 | Biến dạng / Khác | Sản phẩm méo hoặc lỗi khác |

---

## 4. NHẬT KÝ THIẾT KẾ & KHUÔN (設計＆金型日報)

**File template:** `F 設計&金型部門日報記録書.xls`  
**File ISO:** `F 金型部門日報兼不適合製品記録書.xls`  
**File tổng hợp lương:** `クアン設計集計.xlsx`

### 4A. Header

| # | Trường | Tên JP | Kiểu |
|---|--------|--------|------|
| 1 | Ngày | 作業日 | Date |
| 2 | Người thực hiện | 作業者 | Text |
| 3 | Tổng giờ làm | 労働時間 | Number (h) |

### 4B. Dữ liệu per hạng mục công việc

| # | Trường | Tên JP | Kiểu |
|---|--------|--------|------|
| 4 | Mã khuôn/sản phẩm | 型番 | Text (link equipment) |
| 5 | Nội dung công việc | 作業内容 | Text + Dropdown (13 loại — xem §4C) |
| 6 | Ghi chú (số shot...) | 備考欄 | Text |
| 7 | Thời gian | 作業時間 | Number (h) |
| 8 | **Giá trị gia tăng** | **付加価値（金額）** | **Number (¥)** — dùng tính lương |

### 4C. 13 Loại công việc thiết kế (từ クアン設計集計)

| # | Mã | Tên JP | Nhóm |
|---|-----|--------|------|
| 1 | DSG | 設計 | Sản xuất |
| 2 | M3D | 型3D | Sản xuất |
| 3 | MCM | 型演算 | Sản xuất |
| 4 | P3D | プラグ3D | Sản xuất |
| 5 | PCM | プラグ演算 | Sản xuất |
| 6 | BHD | 型裏穴図 | Sản xuất |
| 7 | TD3 | 試作3D | Thử nghiệm |
| 8 | TCM | 試作演算 | Thử nghiệm |
| 9 | TP3 | 試作プラグ3D | Thử nghiệm |
| 10 | TPC | 試作プラグ演算 | Thử nghiệm |
| 11 | TBH | 試作型裏穴図 | Thử nghiệm |
| 12 | T3D | トレイ3D | Bổ trợ |
| 13 | PMC | プラグ加工 | Thủ công |

---

## 5. NHẬT KÝ VẬN CHUYỂN (運転日報)

**File template:** `F 運転日報.xls`

### 5A. Header

| # | Trường | Tên JP | Kiểu |
|---|--------|--------|------|
| 1 | Ngày | 年/月/日 | Date |
| 2 | Thứ | 曜日 | DayOfWeek |
| 3 | Thời tiết | 天候 | Dropdown |
| 4 | Biển số xe | 車番 | Text (VD: 76-70) |
| 5 | Tên tài xế | 運転者名 | Text |

### 5B. Dữ liệu per chuyến (nhiều chuyến/ngày)

| # | Chiều đi (発) | Chiều đến (着) |
|---|-------------|---------------|
| 6 | 発地 (Điểm xuất phát) | 着地 (Điểm đến) |
| 7 | 時間 (Giờ xuất phát) | 時間 (Giờ đến) |
| 8 | 発メーター Km (Odometer xuất phát) | 着メーター Km (Odometer đến) |
| 9 | 実車：空車 (Có hàng / Không hàng) | — |
| 10 | 有料 IC (Trạm thu phí vào) | 有料 IC (Trạm thu phí ra) |

---

## 6. ĐIỀU KIỆN MÁY THÀNH HÌNH (成形条件一覧表)

**File template:** `3号機〜7号機成形条件一覧表.xls`  
**Sheets riêng per máy:** 3号機, 4号機, 5号機, 6号機, 7号機

### 6A. Thông tin sản phẩm & thiết bị

| # | Trường | Tên JP | Mô tả |
|---|--------|--------|-------|
| 1 | Mã P/N | P/N | Mã sản phẩm |
| 2 | Vật liệu | 材料 | Loại nhựa + thông số |
| 3 | Kích thước khuôn | 型寸 | Kích thước ngoài (CAV) |
| 4 | Vị trí khuôn | 型位置 | Vị trí lắp đặt trên máy |

### 6B. Thiết bị SET

| # | Trường | Tên JP | Mô tả |
|---|--------|--------|-------|
| 5 | Plug | プラグ | Mã plug sử dụng |
| 6 | Đế làm mát | 水冷盤 | Mã WB (VD: WB-74CZD) |
| 7 | Khung | 枠 | Mã Frame |
| 8 | Dao cắt | カッター | Mã Cutter |
| 9 | Stacking trên | スタッキング上 | Mã ST phía trên |
| 10 | Stacking dưới | スタッキング下 | Mã ST phía dưới |

### 6C. Thông số Heater (14 zones)

**7 zones Heater TRÊN (上ヒーター):**

| Zone | 01 | 02 | 03 | 04 | 05 | 06 | 07 |
|------|----|----|----|----|----|----|-----|
| Giá trị | °C | °C | °C | °C | °C | °C | °C |

**7 zones Heater DƯỚI (下ヒーター):**

| Zone | A | B | C | D | E | F | G |
|------|---|---|---|---|---|---|---|
| Giá trị | °C | °C | °C | °C | °C | °C | °C |

**Heater dao cắt:** `カッター部ヒーター` (°C)

### 6D. Thông số thời gian (Timing Parameters)

| # | Trường | Tên EN | Đơn vị |
|---|--------|--------|--------|
| 11 | Pre blowing | Thổi sơ bộ | — |
| 12 | Take off time | Thời gian lấy sản phẩm | s |
| 13 | Take off cycle | Chu kỳ lấy | — |
| 14 | Forming time | Thời gian thành hình | s |
| 15 | Demoulding time | Thời gian tháo khuôn | s |
| 16 | Mould table open delayed | Trễ mở bàn khuôn | s |
| 17 | Bottom table up delayed | Trễ nâng bàn dưới | s |
| 18 | Vacuum on | Bật chân không | 0~150mm |
| 19 | Vacuum cross section | Tiết diện chân không | 1~15 |
| 20 | Demoulding air section | Tiết diện khí tháo khuôn | 1~7 |
| 21 | Pre blowing off | Tắt thổi sơ bộ | 0~140mm |
| 22 | Material feeding | Bước tiến vật liệu | mm |
| 23 | Material speed | Tốc độ vật liệu | % |
| 24 | Speed top table up | Tốc độ nâng bàn trên | % |

---

## 7. CHỈ THỊ SẢN XUẤT (注文書兼指示書)

**File template:** `F 一般注文書兼指示書.xls`  
**Sheets:** `直送` (Giao thẳng), có thể có sheet khác per KH

### 7A. Header

| # | Trường | Tên JP | Kiểu |
|---|--------|--------|------|
| 1 | Số đơn | NO. | Text |
| 2 | Khách hàng | 様 (KH name) | Text |
| 3 | Ngày | DATE | Date |

### 7B. Dữ liệu per dòng sản phẩm (nhiều dòng/đơn)

| # | Trường | Tên JP | Mô tả | Kiểu |
|---|--------|--------|-------|------|
| 4 | Số yêu cầu | 要求No. | Mã tracking nội bộ | Text |
| 5 | P/N + Tên sản phẩm | P/N 品名 | Mã và tên sản phẩm | Text |
| 6 | Số lượng | 数量 | Số tấm/thùng cần sản xuất | Number |
| 7 | Ngày giao | 納期 | Hạn giao hàng | Date |
| 8 | Ghi chú | 備考 | Yêu cầu đặc biệt | Text |

### 7C. Thông tin vật liệu (per dòng sản phẩm)

| # | Trường | Tên JP | Ví dụ |
|---|--------|--------|-------|
| 9 | Chất liệu | 材質 | PS, PET, PP |
| 10 | Độ dày | 厚み | 0.50mm, 1.00mm |
| 11 | Chiều rộng | 巾 | 405mm, 640mm |
| 12 | Chống tĩnh điện | 帯電 | Có/Không |
| 13 | Silicon | シリコン | Có/Không |
| 14 | Phủ bề mặt | 塗布 | Có/Không |

---

## 8. BÁO CÁO KHÔNG PHÙ HỢP (不適合是正報告書)

**File template:** `F 不適合(製品)是正報告書(客先提出用）.xls`  
**Mục đích:** Gửi cho khách hàng khi có sự cố chất lượng

### 8A. Thông tin header

| # | Trường | Tên JP | Kiểu |
|---|--------|--------|------|
| 1 | Khách hàng | 殿 (KH name) | Text |
| 2 | Nhà sản xuất | 製造メーカー | Text (= YSD) |
| 3 | Mã khuôn | 型番 | Text |
| 4 | Tên sản phẩm | 品名 | Text |
| 5 | Bộ phận phát hành | 発行部門 | Dropdown |
| 6 | Số phát hành | 発行No. | Auto-increment |
| 7 | Ngày phát hành | 年/月/日 発行 | Date |
| 8 | Lot No. / Số lượng | Lot No. / 数量 | Text + Number |

### 8B. Nội dung báo cáo

| # | Trường | Tên JP | Mô tả |
|---|--------|--------|-------|
| 9 | Nội dung lỗi | 不良内容 | Mô tả chi tiết lỗi (text + ảnh) |
| 10 | Người phát hành | 発行者 | Ký tên |
| 11 | Dấu xác nhận | 確認印 | Quản lý ký duyệt |

### 8C. Phần xử lý (bộ phận chịu trách nhiệm điền)

| # | Trường | Tên JP | Mô tả |
|---|--------|--------|-------|
| 12 | Nguyên nhân | 発生流出原因 | Root Cause Analysis |
| 13 | Hạn trả lời | 年/月/日 迄に | Deadline phản hồi |
| 14 | *(Ghi chú)* | — | Nếu không kịp deadline → phải thông báo bằng văn bản |

---

## 9. XAY RÁC NHỰA & QUẢN LÝ PHẾ THẢI (粉砕・廃棄物管理)

> **Nguồn:** Phản hồi giám đốc + tra cứu mail (1,436 email 廃棄, 48 email 再生, 84 email 斎藤)  
> **Nhân viên phụ trách:** 斎藤 (Saito)  
> **ISO:** Có quy trình phân loại rác `廃棄物・リサイクル品・ゴミ分別手順書` và bảng đánh giá `環境側面特定表`

### 9A. Tổng quan quy trình xay rác nhựa (粉砕)

```mermaid
graph TD
    A["Sản xuất thành hình<br/>(成形)"] -->|"Nhựa thừa (端材)<br/>Sản phẩm lỗi (不良品)"| B{"Phân loại<br/>nhựa"}
    B -->|"PS trắng<br/>(PSホワイト)"| C["Xay bằng 粉砕機<br/>→ Hạt mịn"]
    B -->|"Nhựa khác<br/>(PET, PP, PS đen...)"| D["Thu gom bởi<br/>đơn vị bên ngoài<br/>(毎週 水曜日)"]
    C --> E["Đóng bao<br/>(袋詰め)"]
    E --> F{"Sử dụng"}
    F -->|"Tái sử dụng nội bộ"| G["Trộn vào sản xuất<br/>(粉砕材含有率 tracking)"]
    F -->|"Bán ra ngoài"| H["⚠️ Cần xác nhận"]
    D --> I["Xử lý bởi<br/>業者 (nhà thầu)"]
```

### 9B. Quy tắc phân loại nhựa phế thải

| Loại nhựa | Xay được? | Xử lý |
|-----------|----------|-------|
| **PS trắng (PSホワイト)** | ✅ Có | Xay bằng 粉砕機 → đóng bao |
| PS đen / PS màu | ❌ Không | Thu gom bên ngoài (thứ 4 hàng tuần) |
| PET | ❌ Không | Thu gom bên ngoài |
| PP | ❌ Không | Thu gom bên ngoài |
| Nhựa hỗn hợp | ❌ Không | Thu gom bên ngoài |

### 9C. Quy tắc sử dụng nhựa tái chế (粉砕材)

> [!CAUTION]
> **MỘT SỐ KHÁCH HÀNG CẤM SỬ DỤNG NHỰA TÁI CHẾ.** Hệ thống PHẢI tracking tỷ lệ nhựa tái chế per đơn hàng.

| Yêu cầu KH | Ý nghĩa | Xử lý |
|------------|---------|-------|
| 再生材は不使用 | Không dùng nhựa tái chế | 100% virgin plastic |
| 粉砕材含有率 X% | Cho phép tối đa X% | Track % trên phiếu QC |
| バージン/リサイクル/バージン | 3 lớp: Virgin / Recycled / Virgin | Cấu trúc sandwich sheet |
| Không ghi chú | Cho phép tái chế | Sử dụng theo quy trình nội bộ |

### 9D. Nhật ký xay nhựa (đề xuất — chưa có form chuẩn)

| # | Trường | Tên JP đề xuất | Kiểu |
|---|--------|---------------|------|
| 1 | Ngày | 作業日 | Date |
| 2 | Người thực hiện | 作業者 | Text (VD: 斎藤) |
| 3 | Loại nhựa | 材料種類 | Dropdown (PS白) |
| 4 | Nguồn phế thải | 発生源 | Dropdown: 端材(rìa cắt) / 不良品(lỗi) / 試作(prototype) |
| 5 | Mã sản phẩm gốc | 元型番 | Text (link products — biết nhựa từ sản phẩm nào) |
| 6 | Khối lượng đầu vào | 投入量 | Number (kg) |
| 7 | Khối lượng đầu ra | 産出量 | Number (kg) — hạt mịn sau xay |
| 8 | Số bao | 袋数 | Number |
| 9 | Xử lý | 処理先 | Dropdown: 社内再利用(tái sử dụng) / 売却(bán) / 保管(lưu kho) |
| 10 | Ghi chú | 備考 | Text |

### 9E. Thu gom rác nhựa không xay được

| # | Trường | Tên JP đề xuất | Kiểu |
|---|--------|---------------|------|
| 1 | Ngày thu gom | 収集日 | Date (固定: 毎週水曜日 — thứ 4) |
| 2 | Đơn vị thu gom | 収集業者 | Text (tên nhà thầu) |
| 3 | Loại nhựa | 材料種類 | Multi-select (PET, PP, PS黒...) |
| 4 | Khối lượng | 重量 | Number (kg) |
| 5 | Chi phí / Thu nhập | 費用/収入 | Number (¥) — ⚠️ Cần xác nhận |
| 6 | Phiếu thu gom | マニフェスト番号 | Text (số phiếu quản lý chất thải theo luật) |

### 9F. Phế khuôn kim loại (金型廃棄)

> Quy trình riêng — 1,436 email liên quan

| Bước | Mô tả | Người thực hiện |
|------|-------|----------------|
| 1 | KH yêu cầu xử lý khuôn hết đời | 業務 (Operations) |
| 2 | YSD kiểm tra trạng thái khuôn, xác nhận 廃棄可否 | 金型 (Mold dept) |
| 3 | Chuyển khuôn cho NLC / SJI xử lý | 運転 (Transport) |
| 4 | Phát hành 金型廃棄料 cho KH | 業務 (Operations) |
| 5 | Thu hồi giá trị kim loại phế liệu (相殺) | 経理 (Accounting) |

---

## 10. QUẢN LÝ VẬT LIỆU & VAI TRÒ 斎藤 (Material Handling)

> **Nhân viên phụ trách:** 斎藤 (Saito) — thực hiện **đồng thời 5 nghiệp vụ**  
> **Bằng chứng:** 84 email mentions, hàng trăm file `材料在庫(YY-MM-DD)指示書連動.xlsx`

### 10A. 5 Nghiệp vụ do 斎藤 phụ trách

```mermaid
graph LR
    S["斎藤 (Saito)"] --> A["1. Nhập nhựa<br/>(材料入庫)"]
    S --> B["2. Xuất nhựa cho SX<br/>(材料出庫)"]
    S --> C["3. Xuất hàng sản phẩm<br/>(出荷)"]
    S --> D["4. Chuẩn bị cuộn nhựa<br/>(成形用 材料準備)"]
    S --> E["5. Xay rác nhựa<br/>(粉砕)"]
```

### 10B. Nhật ký vật liệu (hiện tại = Excel hàng ngày)

**File mẫu:** `材料在庫(24-10-1)指示書連動.xlsx`  
**Tần suất:** **Mỗi ngày 1 file** — hàng trăm file tồn tại trên server  
**Vấn đề:** Cực kỳ tốn công, dễ sai sót, không có single source of truth

| # | Trường | Mô tả | Kiểu |
|---|--------|-------|------|
| 1 | Ngày | Ngày kiểm kê | Date |
| 2 | Loại nhựa | VD: PET 0.5t 640mm 帯電防止 | Text |
| 3 | NCC | Nhà cung cấp nhựa | Text |
| 4 | Tồn kho đầu ngày | Số cuộn/kg | Number |
| 5 | Nhập trong ngày | Số cuộn/kg nhận từ NCC | Number |
| 6 | Xuất cho SX | Số cuộn/kg cấp cho thành hình | Number |
| 7 | Tồn kho cuối ngày | = Đầu ngày + Nhập − Xuất | Number (tự tính) |
| 8 | Liên kết chỉ thị | Mã đơn hàng/chỉ thị sử dụng | Text (link orders) |

### 10C. Yêu cầu cho hệ thống YSDMS-Next

1. **Module quản lý kho nhựa** — thay thế hàng trăm file Excel hàng ngày
2. **Tracking nhựa tái chế** — tỷ lệ 粉砕材含有率 per sản phẩm/đơn hàng
3. **Liên kết chỉ thị → vật liệu** — biết đơn nào dùng nhựa gì, bao nhiêu
4. **Dashboard vật liệu** — tồn kho realtime, cảnh báo hết hàng
5. **Nhật ký xay nhựa** — tracking khối lượng xay, đóng bao, xử lý
6. **Lịch thu gom** — nhắc nhở thứ 4 hàng tuần, tracking phiếu manifesto

---

## BẢNG TỔNG HỢP — MAPPING FORM → DB TABLE

| Form | DB Table đề xuất | Số trường | Liên kết |
|------|------------------|-----------|---------|
| 成形日報 | `forming_daily_logs` | 28 | → `equipment`, `products`, `employees` |
| プレス日報 | `press_daily_logs` | 16 | → `equipment`, `products`, `employees` |
| 検査日報 | `inspection_daily_logs` | 14 | → `products`, `employees` |
| 設計&金型日報 | `design_mold_daily_logs` | 8 | → `products`, `employees`, `design_task_types` |
| 運転日報 | `transport_daily_logs` | 10 | → `employees`, `vehicles` |
| 成形条件 | `forming_conditions` | 24 | → `equipment`, `products`, `machines` |
| 注文書兼指示書 | `production_instructions` | 14 | → `orders`, `products`, `plastic_master` |
| 不適合報告書 | `nonconformity_reports` | 14 | → `companies`, `products`, `employees` |
| **粉砕日報** | **`grinding_daily_logs`** | **10** | → `products`, `employees`, `plastic_master` |
| **材料在庫** | **`material_inventory`** | **8** | → `orders`, `plastic_master`, `employees` |

### Enum: Defect Types (共通)

```typescript
enum DefectType {
  FORMING_DEFECT = 'A',        // 成形不良
  CUTTING_MISALIGN = 'B',      // 抜きズレ不良
  STACKING_DEFECT = 'C',       // スタッキング不良
  SHEET_DEFECT = 'D',          // シート不良
  MACHINE_ABNORMAL = 'E',      // 機械異常による不良
  MOLD_CUTTER_ABNORMAL = 'F',  // 金型、抜型異常
  OTHER = 'G',                 // その他
}
```

### Enum: Inspection Defect Types (検査専用)

```typescript
enum InspectionDefectType {
  WHITENING_CRACK_CRUSH = 'WC',  // 白化・割れ・潰れ
  BURR_WHISKER = 'BH',           // バリ・ヒゲ
  SCRATCH = 'SC',                // 傷
  DIRT = 'DT',                   // 汚れ
  BRIDGE = 'BR',                 // ブリッジ発生
  FOREIGN_MATTER = 'FM',         // 異物付着
  SHEET_DEFECT = 'SD',           // シート不良
  DEFORM_OTHER = 'OT',           // 変形・その他
}
```

### Enum: Disposition Types (処置)

```typescript
enum DispositionType {
  DISCARD = '1',          // 廃棄 (mặc định)
  SPECIAL_ACCEPT = '2',  // 特別採用 (cần phê duyệt)
  STOP_PRODUCTION = '3', // 製造中止
}
```

### Enum: Waste Source (粉砕 発生源)

```typescript
enum WasteSource {
  EDGE_SCRAP = 'EDGE',       // 端材 — rìa cắt từ thành hình
  DEFECTIVE = 'DEFECTIVE',   // 不良品 — sản phẩm lỗi
  PROTOTYPE = 'PROTOTYPE',   // 試作 — prototype test
  OBSOLETE = 'OBSOLETE',     // 旧品 — sản phẩm cũ không dùng
}
```

### Enum: Plastic Recyclability (再利用可否)

```typescript
enum PlasticRecyclability {
  GRINDABLE_PS_WHITE = 'PS_WHITE',  // PS trắng — xay được
  NOT_GRINDABLE = 'OTHER',          // Nhựa khác — thu gom bên ngoài
}
```
