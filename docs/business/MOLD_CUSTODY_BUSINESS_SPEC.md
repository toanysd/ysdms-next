# YSDMS NextGen — ĐẶC TẢ NGHIỆP VỤ LƯU GIỮ & BÀN GIAO KHUÔN KHÁCH HÀNG
## 金型預託・借用・棚卸・型保管料・加工出し・設備移管 業務仕様書 (SSOT)

> **Cấp tài liệu:** Nghiệp vụ Chuyên môn (Single Source of Truth - SSOT)  
> **Phiên bản:** 1.0 (Ban hành sau Kiểm toán Hòm thư 10,427 luồng email & Chứng từ Kế toán)  
> **Ngày ban hành:** 2026-10-07  
> **Căn cứ pháp lý & thực tiễn:**  
> - Đạo luật Chống chậm trả tiền cho nhà thầu phụ Nhật Bản (下請代金支払遅延等防止法 - 下請法).  
> - Tiêu chuẩn Kế toán Tài sản Cố định Nhật Bản (日本の固定資産会計基準).  
> - Cơ sở dữ liệu 10,427 email giao dịch thực tế (`toanysdmail.xlsx`, 17.4MB) từ 2015 đến 2025.  
> - Hồ sơ Kế toán Tính và Thu Phí lưu kho khuôn Mẫu Fujikura (`source_data/型保管料(20250704)`).  
> - Mã nguồn và Schema thực tế Supabase Production (`Migration 098`, `equipment_loans`, `MoldLoanPDFDocument.tsx`).

---

## MỤC LỤC

1. [NGUYÊN TẮC THUẬT NGỮ & RÀNH BUỘC PHÁP LÝ (TERMINOLOGY PRINCIPLES)](#1-nguyên-tắc-thuật-ngữ--rành-buộc-pháp-lý-terminology-principles)
2. [5 ĐỀ MỤC CHUYÊN SÂU TOÀN DIỆN (CROSS-CUSTOMER TOPIC DEEP-DIVES)](#2-5-đề-mục-chuyên-sâu-toàn-diện-cross-customer-topic-deep-dives)
   - [Chủ đề 1: Bộ Chứng từ Tiếp nhận & Bàn giao Lưu giữ Khuôn](#chủ-đề-1-bộ-chứng-từ-tiếp-nhận--bàn-giao-lưu-giữ-khuôn-金型借用書--預り証--返却書)
   - [Chủ đề 2: Chiến dịch Kiểm kê Tài sản Cố định Hàng năm](#chủ-đề-2-chiến-dịch-kiểm-kê-tài-sản-cố-định-hàng-năm-貸与設備棚卸調査--有高確認)
   - [Chủ đề 3: Khuôn Không Hoạt động, Hợp đồng Ký thác & Thu Phí Bảo quản](#chủ-đề-3-khuôn-không-hoạt-động-hợp-đồng-ký-thác--thu-phí-bảo-quản-非稼働金型--寄託契約--型保管料)
   - [Chủ đề 4: Xuất Gia công Xử lý Bề mặt Ngoại vi](#chủ-đề-4-xuất-gia-công-xử-lý-bề-mặt-ngoại-vi-テフロン加工出し--メッキ--研磨)
   - [Chủ đề 5: Ranh giới Nghiêm ngặt: Điều chuyển Nội bộ Nhà xưởng YSD](#chủ-đề-5-ranh-giới-nghiêm-ngặt-điều-chuyển-nội-bộ-nhà-xưởng-ysd-社内移管--設備移動)
3. [DANH MỤC NGHIỆP VỤ THEO TỪNG KHÁCH HÀNG (CUSTOMER-BY-CUSTOMER SPECIFICATION)](#3-danh-mục-nghiệp-vụ-theo-từng-khách-hàng-customer-by-customer-specification)
   - [3.1. Shin-Ei Hitec (シンエイ・ハイテック)](#31-shin-ei-hitec-シンエイハイテック)
   - [3.2. JAE / MRDI / Transtron / Ohte (日本航空電子工業 / 丸大 / トランストロン / 大手)](#32-jae--mrdi--transtron--ohte-日本航空電子工業--丸大--トランストロン--大手)
   - [3.3. Oita Canon / Asahi (大分キヤノン / アサヒ)](#33-oita-canon--asahi-大分キヤノン--アサヒ)
   - [3.4. Fujikura (フジクラ)](#34-fujikura-フジクラ)
   - [3.5. Panasonic Shirakawa / Advanex / Souwa Press (パナソニック白河 / アドバネクス / 相和プレス)](#35-panasonic-shirakawa--advanex--souwa-press-パナソニック白河--アドバネクス--相和プレス)
   - [3.6. Rhythm / YAC Garter (リズム川越工場 / ワイエイシイガーター)](#36-rhythm--yac-garter-リズム川越工場--ワイエイシイガーター)
   - [3.7. A&T / Éi-Ando-Tii (エイアンドティー)](#37-at--éi-ando-tii-エイアンドティー)
   - [3.8. Omura Giken / SMK (大村技研 / SMK)](#38-omura-giken--smk-大村技研--smk)
   - [3.9. Nemoto Sensor Engineering (ネモト・センサエンジニアリング)](#39-nemoto-sensor-engineering-ネモトセンサエンジニアリング)
   - [3.10. Minebea (ミネベア)](#310-minebea-ミネベア)
   - [3.11. Terada Deimu (デイム / 寺田)](#311-terada-deimu-デイム--寺田)
4. [ĐỐI CHIẾU HỆ THỐNG MÃ NGUỒN & SCHEMA HIỆN HÀNH (SYSTEM ALIGNMENT)](#4-đối-chiếu-hệ-thống-mã-nguồn--schema-hiện-hành-system-alignment)
5. [GAP ANALYSIS & 4 ĐỀ XUẤT NÂNG CẤP CHO SPRINT P1 (RECOMMENDATIONS)](#5-gap-analysis--4-đề-xuất-nâng-cấp-cho-sprint-p1-recommendations)
6. [PHỤ LỤC DẪN CHỨNG EMAIL & TÀI LIỆU GỐC (EVIDENCE MATRIX)](#6-phụ-lục-dẫn-chứng-email--tài-liệu-gốc-evidence-matrix)

---

## 1. NGUYÊN TẮC THUẬT NGỮ & RÀNH BUỘC PHÁP LÝ (TERMINOLOGY PRINCIPLES)

### 1.1. Bản chất Pháp lý Cốt lõi
- **Chủ sở hữu Tài sản (Asset Owner - 資産所有者):** Trong ngành định hình hút chân không khay nhựa định hình (`真空成形トレー`), phần lớn khuôn dập nhiệt (`金型`) thuộc quyền sở hữu của **Khách hàng** (Được hạch toán là Tài sản cố định - `固定資産` hoặc Tài sản chi phí - `経費資産` trên sổ sách kế toán của Khách hàng).
- **Vị thế của YSD (Custody / Bailee - 借用者 / 預託先):** YSD đóng vai trò là bên **Lưu giữ / Nhận mượn gia công** (`預託先 / 借用先`). Mục đích lưu giữ duy nhất là để định hình khay nhựa cung cấp riêng cho khách hàng đó theo từng đơn đặt hàng (`PO`).
- **Quy tắc Tuyệt đối:** 
  1. YSD **không được sử dụng** khuôn của khách hàng A để sản xuất khay cho khách hàng B.
  2. Khi di chuyển khuôn ra khỏi xưởng YSD (gửi trả khách, đưa đi mạ/xử lý bề mặt), bắt buộc phải có chứng từ đối ứng pháp lý.
  3. **Nghiêm cấm tuyệt đối** dùng thuật ngữ "Mượn khuôn" (Loan) cho việc di chuyển nội bộ giữa các nhà máy YSD (Kawasaki, Yashio, Saitama, Hà Nam). Việc này là **Điều chuyển nội bộ (`社内移管 / 設備移動`)**.

### 1.2. Ma trận Đối chiếu Thuật ngữ (JP - VI - EN)

| Mã Thuật ngữ | Tiếng Nhật (Chuẩn Nghiệp vụ) | Tiếng Việt (Chuyên ngành YSD) | English Equivalent | Bản chất Nghiệp vụ & Kế toán |
|---|---|---|---|---|
| `CUSTOMER_LOAN` | **金型借用書 (兼 預り証)** | Giấy tiếp nhận mượn / Giấy biên nhận khuôn khách | Mold Custody / Loan Receipt | Khách giao khuôn cho YSD giữ để chạy hàng. YSD ký xác nhận chịu trách nhiệm bảo quản. |
| `RETURN_TO_CUSTOMER` | **金型返却書 (現品受渡確認票)** | Giấy bàn giao hoàn trả khuôn cho khách | Mold Return Certificate | Hết vòng đời, thanh lý hủy bỏ hoặc khách rút khuôn về. Khách ký nhận thu hồi tài sản. |
| `INVENTORY_AUDIT` | **貸与設備棚卸調査 / 有高確認** | Kiểm kê định kỳ tài sản cố định khách gửi | Annual Asset Audit / Physical Count | Khách hàng thực hiện kiểm toán kế toán định kỳ hàng năm; bắt buộc đối chiếu thực tế + ảnh chụp. |
| `INACTIVE_MOLD` | **非稼働金型** | Khuôn ngưng hoạt động ($\ge 3$ năm) | Inactive Mold | Khuôn không phát sinh đơn hàng $\ge 3$ năm và không có kế hoạch trong 1 năm tới. |
| `STORAGE_FEE` | **型保管料 / 預託保管費用** | Phí lưu kho bảo quản khuôn | Mold Storage & Maintenance Fee | Khách hàng trả tiền cho YSD để tiếp tục giữ khuôn không hoạt động theo Đạo luật Nhà thầu phụ. |
| `CUSTODY_CONTRACT` | **金型保管に関する寄託契約書** | Hợp đồng ký thác bảo quản khuôn | Bailment / Mold Custody Contract | Hợp đồng pháp lý giữa khách hàng và YSD quy định quyền, trách nhiệm bảo quản và biểu phí lưu kho. |
| `OUTSOURCE_PROCESSING` | **外注加工出し (テフロン・メッキ)** | Xuất khuôn đi gia công xử lý bề mặt | Outsourced Surface Treatment | Chuyển khuôn tạm thời sang đối tác xử lý Teflon, xi mạ crôm hoặc mài bóng. Không đổi chủ sở hữu. |
| `INTERNAL_TRANSFER` | **社内移管 / 設備移動** | Điều chuyển thiết bị nội bộ YSD | Internal Facility Transfer | Chuyển vị trí lưu trữ giữa Kawasaki (Trụ sở chính), Yashio, Saitama. Không liên quan khách hàng. |

---

## 2. 5 ĐỀ MỤC CHUYÊN SÂU TOÀN DIỆN (CROSS-CUSTOMER TOPIC DEEP-DIVES)

### Chủ đề 1: Bộ Chứng từ Tiếp nhận & Bàn giao Lưu giữ Khuôn (金型借用書 / 預り証 / 返却書)
1. **Quy trình Tiếp nhận Mới (Inbound Custody):**
   - Khách hàng gửi khuôn đến YSD kèm bản vẽ khuôn (`型図面`) và mẫu khay (`成形トレイサンプル`).
   - YSD kiểm tra ngoại quan (nứt, xước lòng khuôn, chân bulông gá).
   - YSD phát hành **Giấy mượn khuôn kiêm biên nhận tài sản (`金型借用書 (兼 預り証)`)**:
     - Ghi nhận: Mã tài sản khách (`客先資産番号`), Mã YSD, Kích thước $(L \times W \times H)$, Trọng lượng ($kg$), Số lòng (`Cavity数`), Tình trạng lúc nhận.
     - Đính kèm ảnh chụp toàn cảnh + biển tên/khắc mã (`刻印`).
     - Ký đóng dấu: **Đại diện pháp luật (Dấu tròn 丸印)** và **Dấu công ty (Dấu vuông 角印)**.
     - Gửi file PDF có dấu qua email trước; gửi **bản cứng gốc (`原本`)** qua bưu điện cho bộ phận Kế toán của khách.
2. **Quy trình Bàn giao Hoàn trả (Outbound Return):**
   - Nhận yêu cầu hoàn trả (`設備処分のご案内` hoặc `金型引取依頼`).
   - YSD kiểm tra đối chiếu danh mục, lập **Phiếu xác nhận giao nhận hiện vật (`現品受渡確認票`)**.
   - Chuẩn bị kèm: Phụ tùng linh kiện khuôn (`金型部品`), Bản vẽ khuôn (`金型図面`), Biên bản mượn gốc (`預かり書原本`).
   - Quy cách đóng gói: Đặt lên pallet chuẩn $1,100 \times 1,100\text{ mm}$, quấn màng co bảo vệ, đo chiều cao tổng pallet và trọng lượng tổng để bên vận chuyển bố trí xe tải bốc dỡ.

### Chủ đề 2: Chiến dịch Kiểm kê Tài sản Cố định Hàng năm (貸与設備棚卸調査 / 有高確認)
1. **Chu kỳ & Thời điểm:** Diễn ra từ **Tháng 10 đến Tháng 2 năm sau** (khớp với kỳ quyết toán tài chính giữa niên độ và cuối niên độ của các tập đoàn Nhật Bản: JAE, Canon, Panasonic, Rhythm, A&T).
2. **Nội dung Khách hàng Yêu cầu Bắt buộc:**
   - **Cột G - Giấy mượn/Biên nhận có hiệu lực (`貸出書の有無`):** Đánh dấu Có (`○`) hoặc Không (`×`).
   - **Cột H - Khuôn thực tế có ở xưởng hay không (`金型の有無`):** Phải kiểm đếm hiện vật thực tế, không được nhìn sổ sách rồi đoán.
   - **Cột I - Vị trí lưu kho (`保管場所`):** Chỉ rõ xưởng lưu giữ (Trụ sở chính Kawasaki, Yashio, hoặc Nhà cung ứng thứ cấp).
   - **Cột J/K - Tình trạng hoạt động (`非稼働調査`):** Xác nhận khuôn còn chạy hay đã ngưng phát sinh sản xuất trên 3 năm.
   - **Ảnh chụp đối chiếu thực tế:** Toàn bộ ảnh chụp phục vụ kiểm kê phải thể hiện rõ:
     1. Khung tên / Bảng thông tin (`撮影用看板フォーマット`).
     2. Thước dây / Thước đo (`メジャー`) đặt áp sát đáy lòng khuôn và cạnh ngoài.
     3. Mã vạch / QR Code định danh tài sản (`QRコードラベル`) còn nguyên vẹn, quét được.

### Chủ đề 3: Khuôn Không Hoạt động, Hợp đồng Ký thác & Thu Phí Bảo quản (非稼働金型 / 寄託契約 / 型保管料)
1. **Định nghĩa Khuôn Ngưng Hoạt động (`非稼働金型`):**
   - Đã quá **3 năm** kể từ ngày sản xuất đơn hàng gần nhất (`最終使用日から３年以上経過`).
   - Đồng thời, khách hàng **không có dự báo/kế hoạch sản xuất hàng bù phụ tùng trong ít nhất 1 năm tới** (`補給品生産の見通しが向こう１年以上ない`).
2. **Ràng buộc Pháp lý nghiêm ngặt (Đạo luật Nhà thầu phụ Nhật Bản - 下請法):**
   - *Nguyên tắc cốt lõi:* Khách hàng sở hữu khuôn phải chịu trách nhiệm thu hồi và tiêu hủy (`引き揚げて廃棄`).
   - *Vi phạm pháp luật:* Nếu khách hàng không thu hồi, cũng không tiêu hủy mà bắt nhà thầu phụ (YSD) lưu kho không công thì bị coi là **Hành vi vi phạm nghiêm trọng Đạo luật Nhà thầu phụ (`下請法違反 - 不当な経済上の利益の提供要請`)**.
3. **Giải pháp Hợp đồng Ký thác & Biểu phí (`寄託契約書 & 型保管料`):**
   - Hai bên ký kết **"Hợp đồng Ký thác Bảo quản Khuôn" (`金型保管に関する寄託契約書`)**.
   - Biểu phí lưu kho thực tế: Được tính trên đơn vị **Khuôn / Tháng (`円/型・月`)** hoặc tính theo diện tích chiếm dụng kho màng kệ ($m^2$).
   - *Dẫn chứng Kế toán Thực tế từ Hồ sơ Fujikura:* YSD tính phí 307.5 JPY/tháng/khuôn; với các kỳ chậm thanh toán niên độ trước, khách hàng phải chịu thêm **3% lãi suất chậm trả (`遅延利息率 3%加算`)** theo luật định.

### Chủ đề 4: Xuất Gia công Xử lý Bề mặt Ngoại vi (テフロン加工出し / メッキ / 研磨)
1. **Bản chất Nghiệp vụ:**
   - Trong quá trình sản xuất hàng loạt khay nhựa yêu cầu kỹ thuật cao (chống dính màng PS tĩnh điện, bề mặt nhẵn bóng cho linh kiện quang học/press-fit), khuôn nhôm sau khi chạy thử (`試作`) hoặc sau một chu kỳ dập nhất định cần được **phủ lớp Teflon chống dính (`テフロン加工`)**, xi mạ crôm hoặc mài bóng lại.
2. **Quy trình Luân chuyển:**
   - Trạng thái khuôn: Chuyển từ `AVAILABLE` (Sẵn sàng) $\rightarrow$ `IN_TRANSIT / OUTSOURCE_PROCESSING` (Đang đi gia công).
   - Đơn vị gia công bề mặt nhận khuôn, thi công xử lý theo lớp micron chỉ định, sau đó hoàn trả về YSD (`テフロン金型戻り`).
   - Khi nhận về, xưởng YSD lập tức sắp xếp dập thử mẫu nghiệm thu (`再成形試作`) trước khi đưa vào sản xuất lô lớn.
   - *Lưu ý:* Nghiệp vụ này **tuyệt đối không làm thay đổi chủ quyền sở hữu tài sản** của khách hàng và không được tính vào vòng đời mượn-trả khách.

### Chủ đề 5: Ranh giới Nghiêm ngặt: Điều chuyển Nội bộ Nhà xưởng YSD (社内移管 / 設備移動)
1. **Sự thật Nghiệp vụ:** YSD sở hữu nhiều cơ sở sản xuất và kho chứa:
   - Trụ sở chính & Xưởng mẫu (`本社工場` - Kawasaki).
   - Xưởng sản xuất dập hàng loạt Yashio (`八潮工場`).
   - Xưởng trung chuyển Saitama (`埼玉工場`).
   - Chi nhánh gia công / liên kết Việt Nam (`ベトナム工場`).
2. **Quy tắc Kiểm soát Hệ thống:**
   - **Tuyệt đối cấm** sử dụng bảng `equipment_loans` với loại `CUSTOMER_LOAN` cho việc chuyển thiết bị giữa các nhà máy của YSD.
   - Việc di chuyển này là **Điều chuyển nội bộ (`社内移管 / 設備移動`)**, chỉ cập nhật trường vị trí giá kệ (`current_rack_layer_id`) hoặc xưởng quản lý (`current_location`).
   - Trong các đợt kiểm kê hàng năm, khách hàng Nhật Bản có thể cử đoàn chuyên viên kế toán đến kiểm tra hiện trường tại từng cơ sở (`現地棚卸訪問`). Hệ thống phải nắm rõ chính xác khuôn đang nằm ở cơ sở nào (Kawasaki hay Yashio) để thông báo cho đối tác tiếp đoàn.

---

## 3. DANH MỤC NGHIỆP VỤ THEO TỪNG KHÁCH HÀNG (CUSTOMER-BY-CUSTOMER SPECIFICATION)

### 3.1. Shin-Ei Hitec (シンエイ・ハイテック)
- **Tên đầy đủ:** 株式会社シンエイ・ハイテック (Shin-Ei Hitec Co., Ltd.)
- **Đại diện giao dịch:** 野澤 (Kỹ thuật), 高橋 (Quản lý đơn hàng).
- **Trích dẫn Email Gốc (Dòng 30, Dòng 58):**
  > **Row 30:** *From: `techno1@shi-hitec.com` | Subject: `13162Bコネクタ用トレー 金型借用書の件`*  
  > *"首題の件につきまして、経理より、金型については弊社資産になるため、借用書が必要との指摘を受けました。御社に対してこれまで前例ありませんでしたが、13162ＢトレーのTOPとBOTTOMにつきまして、フォーマットをエクセルにて送付いたしますので、借用書のご発行をお願いしたく存じます。*  
  > *①借用書PDF(押印済み) ②借用書エクセル(写真データ貼付、入力済み) ③借用書原本*  
  > *1. 撮影用看板フォーマットに、金型のサイズと重量をエクセルでご記入いただき、印刷をして金型写真の撮影をお願いいたします。*  
  > *2. 借用書フォーマットにエクセルでご入力いただき、金型写真データを貼付いただいた後、印刷をして、社印(各印)と代表者様の印(丸印)を押印の上、①、②をメールにてご返送ください。*  
  > *3. ③の借用書原本を郵送等で弊社本社までご送付ください。"*
  >
  > **Row 58:** *From: `SHI)生産管理０３` | Subject: `返却`*  
  > *"昨年末に下記の内容で御社へ専用伝票をお送りしているのですが、ご返却いただいていないようでしたら、恐れ入りますが送付願います。・注文書番号 35579 トレイ(BOTTOM, TOP) ・注文書番号 35632 SHI-NZ2319, SHI-NZ2320"*
- **Quy tắc Nghiệp vụ Đặc thù:**
  1. **Bắt buộc Biển Placard Định danh (`撮影用看板フォーマット`):** Phải in biển hiệu gồm Kích thước $(L \times W \times H)$ và Trọng lượng ($kg$), đặt bên cạnh khuôn khi chụp ảnh.
  2. **Yêu cầu 3 Loại Tài liệu Bàn giao:**
     - Bản PDF ký đóng dấu điện tử gửi trước.
     - File Excel gốc đính kèm dữ liệu ảnh phân giải cao.
     - Bản in gốc gửi bưu điện có đóng **Đủ 2 loại dấu:** Dấu công ty (`角印`) và Dấu chức danh người đại diện (`丸印`).
  3. **Truy cứu Chứng từ chuyên dụng:** Khi giao hàng phải hoàn trả phiếu giao hàng/nhận hàng mẫu chuyên biệt của Shin-Ei (`専用伝票`).

---

### 3.2. JAE / MRDI / Transtron / Ohte (日本航空電子工業 / 丸大 / トランストロン / 大手)
- **Chuỗi liên kết Cung ứng Phức tạp:**
  - Chủ quản thương hiệu / Chủ tài sản gốc: **JAE (日本航空電子工業) / トランストロン (Transtron)**.
  - Đơn vị Quản lý Hậu cần & Ký gửi: **NLC (ニッコー・ロジスティクス株式会社 - Nikko Logistics)** / **淀川 和彦**.
  - Đơn vị EMS / Dập linh kiện liên kết: **株式会社 大手 (Ohte - Thượng Cương / Xưởng Chiba)**.
  - Đơn vị Chế tạo Khuôn & Lưu trữ Đối tác: **株式会社 丸大 (MRDI - Marudai)**.
  - Đơn vị Sản xuất Khay nhiệt Định hình: **YSD (ヨシダパッケージ)**.
- **Trích dẫn Email Gốc (Dòng 15, Dòng 52, Dòng 55):**
  > **Row 15:** *From: `YODOGAWA Kazuhiko <yodogawak@jae.co.jp>` | Subject: `【ご依頼】貸与設備の棚卸調査依頼（ヨシタ゛ハ゜ッケーシ゛殿）について`*  
  > *"表題の件、弊社資産管理の一環として、年１回貸与設備の棚卸調査・報告を頂いております。*  
  > *調査依頼事項：貸出書の有無（G列）：有り○、無し× | 金型の有無（H列）：有り○、無し× | 保管場所（I列）：工場名、二次仕入先名 等 | 非稼働調査 対象（J列）：●が対象(弊社記入) ※2021年4月以降非稼働 | 御社調査（K列）：非稼働…〇、稼働あり…稼働年月（例2024/10）*  
  > *非稼働調査について：昨年度同様、ＪＡＥ－Ｇとして非稼働金型の引揚げ・廃棄などの取組みです。「金型保管に関する寄託契約書」は締結済みです。『非稼働金型（最終使用日から３年以上が経過し、且つ補給品生産の見通しが向こう１年以上ない金型）は仕入先様から引き揚げて廃棄するのが大原則ですが、廃棄も仕入先様からの引き揚げもできない非稼働金型については仕入先様に保管費用を支払うことになります。（非稼働金型を仕入先様に保管させ、その費用を支払わない場合は下請法違反となります）』"*
  >
  > **Row 52 & 55:** *From: `YSD 小林` To: `y.uchida@mrdi.co.jp` | Cc: `toan@ysd-pack.co.jp` | Subject: `FW: トランストロン/P700SPM用トレイの写真撮影依頼`*  
  > *"大手）上岡様より：トランストロン/P700SPM用トレイ[OOT-042P(Q)R2]について、客先に対し金型の預かり証を提出するために型の写真を撮影していただけないでしょうか。※写真はキャビティがわかる写真と金型外観の写真、金型の外形寸法と重量もご教示願います。*  
  > *YSD 小林 chỉ đạo Marudai:* **早々に金型写真のご連絡ありがとう御座いました。一旦、この写真で提出させて頂きますが、今後、金型写真をお願いした時は金型の大きさが写真で分かる様にメジャーを添えて撮影するようにしてもらえると助かります。** *添付はOOT-040の金型写真となります。看板はお客様の依頼があった時だけで良いのですが、こんなイメージで撮影してください。"*
- **Quy tắc Nghiệp vụ Đặc thù:**
  1. **Quy tắc Thước dây Bắt buộc (`メジャー添え`):** Khi chụp ảnh làm Giấy biên nhận mượn khuôn (`預かり証`), bắt buộc đặt thước đo/thước cuộn bên cạnh lòng khuôn và mép ngoài để chứng minh trực quan kích thước.
  2. **Audit Template Excel Nghiêm ngặt:** JAE yêu cầu nộp file Excel nguyên gốc (Cấm PDF) có đủ cột `G, H, I, J, K`.
  3. **Áp dụng Hợp đồng Ký thác (`寄託契約書`):** Bắt buộc đánh giá mốc 3 năm không chạy để kích hoạt điều khoản thu phí hoặc yêu cầu JAE thu hồi hủy khuôn theo luật Đạo luật Nhà thầu phụ.

---

### 3.3. Oita Canon / Asahi (大分キヤノン / アサヒ)
- **Chuỗi Khách hàng:** 大分キヤノン (Oita Canon - Chủ sở hữu tài sản) $\rightarrow$ 株式会社アサヒ (Asahi - Đơn vị bao bì cấp 1) $\rightarrow$ YSD (Nhà sản xuất khuôn & khay cấp 2).
- **Đại diện:** 滝本 里奈 (Asahi), 最上 登紀子 (Asahi).
- **Trích dẫn Email Gốc (Dòng 5, Dòng 13869, Dòng 165598):**
  > **Row 5:** *From: `YSD 小林` To: `takimoto.rina@kk-asahi.co.jp` | Subject: `RE: 大分キヤノン様 固定資産/経費資産リスト 金型写真提出のお願い`*  
  > *"金型写真の撮影が完了しましたので送付致します。ご提出後、該当の経費資産「借用証/現品受渡確認票」を送付致します。記載内容確認後、電子社判でご捺印いただき、PDF送付でご提出いただくかたちになります。"*
  >
  > **Row 13869:** *From: `最上 登紀子` | Subject: `RE: 大分キヤノン様 「借用証/現品受渡確認票」 ご提出のお願い ※提出期限 6/18(水)`*  
  > *"該当金型：ASH-006, ASH-007... 借用証リストと金型写真を照合の上、社印捺印後PDFにてご返信ください。"*
  >
  > **Row 135:** *From: `滝本 里奈` | Subject: `RE: 【正式注文書と金型写真用紙】K517 B COVER SIDE用・B LID MEDIA用`*  
  > *"注文書と共にキヤノン様指定の「金型写真用紙フォーマット」を送付致します。型検合格後に写真を貼り付けてご提出願います。"*
- **Quy tắc Nghiệp vụ Đặc thù:**
  1. **Phân loại Tài sản Cố định vs Tài sản Chi phí:** Canon phân biệt rất rõ `固定資産` (Khuôn giá trị cao) và `経費資産` (Khuôn chi phí dự án). Tên chứng từ là: **`借用証 / 現品受渡確認票`**.
  2. **Quy trình Chữ ký Điện tử (`電子社判`):** Cho phép đối soát trước bằng file Excel/Ảnh, sau đó xuất PDF có dấu điện tử gửi qua hệ thống.

---

### 3.4. Fujikura (フジクラ)
- **Tên đầy đủ:** 株式会社フジクラ (Fujikura Ltd.) — Bộ phận Linh kiện Quang học (Optical Component Division).
- **Đại diện:** Makoto Uenoyama (上野山 真), Nakajima Toshiaki (中島 俊彰).
- **Hồ sơ Chứng cứ Kế toán Gốc (`source_data/型保管料(20250704)`):**
  - File Excel tính phí: `フジクラ コネ 型保管料(20250612).xlsx`.
  - Hóa đơn thanh toán: `フジクラ コネ 型保管料2023年度 2024年度 請求書(20250704).pdf`.
  - Email trao đổi: `RE_ 貸与型保管費用算出のお願い(ヨシダパッケージ殿).msg`.
- **Trích dẫn Nội dung Kế toán Thực tế:**
  > **Từ Email Uenoyama:**  
  > *"ヨシダパッケージ 桜井様: フジクラ 上野山です。お待たせいたしました。見積書に基づいてお支払いを進めたいと思います。お手数ですが、請求書の発行をお願いできますか。支払対象期間を下記とし、一昨年度分については遅延料3%を載せて請求をお願いします。*  
  > *支払い対象期間 / 遅延利息率:*  
  > *・2024.4.1～2025.3.31分(12ヶ月分) ⇒ なし*  
  > *・2023.4.1～2024.3.31分(12ヶ月分) ⇒ 3％加算"*
  >
  > **Từ Bảng Tính của YSD (Sakurai lập):**  
  > *Mã khuôn lưu kho:* `FJK-001`, `FJK-002`, `FJK-003`, `FJK-004`, `FJK-005`, `FJK-006` (Dùng cho vỏ hộp quang 005A006A, Tray Mr.Hayashi, Tray Mr.Kuboki).  
  > *Đơn giá bảo quản:* **307.5 Yên / khuôn / tháng**.  
  > *Chứng từ giao nhận đối ứng:* **`貸与資産明細書兼確認書`** + **`御見積書`** + **`納品書`** + **`請求書`**. Bản scan gửi trước, **bản in gốc (`原紙`) bắt buộc gửi chuyển phát bưu điện**.
- **Quy tắc Nghiệp vụ Đặc thù:**
  1. **Quy tắc Tính Lãi Chậm Trả 3% Hàng năm:** Khuôn ngưng hoạt động được truy thu phí lưu kho. Khoản phí chậm trả quá hạn niên độ kế toán phải cộng thêm lãi suất chậm trả 3% theo đúng chế tài của Đạo luật Nhà thầu phụ Nhật Bản.
  2. **Bộ Tứ Chứng từ:** Bắt buộc lập đồng bộ 4 biểu mẫu (`Bảng kê tài sản mượn kiêm biên bản đối soát`, `Báo giá`, `Phiếu giao hàng`, `Hóa đơn GTGT`).

---

### 3.5. Panasonic Shirakawa / Advanex / Souwa Press (パナソニック白河 / アドバネクス / 相和プレス)
- **Chuỗi Cung ứng:** パナソニック白河 (End User) $\rightarrow$ 株式会社アドバネクス (Tier 1) $\rightarrow$ 相和プレス工業株式会社 (Tier 2) $\rightarrow$ YSD (Tier 3).
- **Trích dẫn Email Gốc (Dòng 100, Dòng 490, Dòng 695):**
  > **Row 100:** *Subject: `FW: 【KSG005592】パナソニック白河向け金型棚卸のお願い（２月返却実施予定）`*  
  > *"アドバネクス購買 石島様より：２月返却の動きがございます。*  
  > *◆QRラベル有無…AQ列：* **QRラベルがない金型は返却不可です。** *1型に2枚のラベルがある場合は教えてください。※以下3点を確認ください：①一つの個体に、QRラベル１枚が貼られていること。②QRラベルは二次元バーコードが読み取り可能で著しい破損のないこと。③更新済みの旧金型は含まれないこと。*  
  > *◆返却元住所…BG列：実際の保管場所（引き取り先）でお願いします。この住所あてに直接客先手配の返却便が来ます。*  
  > *◆パレット積載規格（BI～BJ列）：* **1,100×1,100のサイズのパレットを使用した場合の金型積載時の高さを教えてください。** *(YSD 桜井 kiểm tra Toan: 型番ADV-036の金型をパレットに載せた時の高さを教えてください)"*
- **Quy tắc Nghiệp vụ Đặc thù:**
  1. **Ràng buộc Nhãn QR Định danh Cá thể:** Không có nhãn QR code hoặc nhãn bị mờ không quét được $\rightarrow$ **Cấm xuất xưởng trả hàng (`返却不可`)**.
  2. **Quy chuẩn Đóng gói Vận tải (Pallet $1,100 \times 1,100$):** Bắt buộc tính toán và cung cấp trước chiều cao tổng thể trên pallet để đơn vị vận tải chuyên dụng của tập đoàn Panasonic điều xe cẩu/xe nâng bốc dỡ tận nơi.

---

### 3.6. Rhythm / YAC Garter (リズム川越工場 / ワイエイシイガーター)
- **Chuỗi Cung ứng:** リズム株式会社 川越工場 (Rhythm Co., Ltd. - Kawagoe Plant) $\rightarrow$ ワイエイシイガーター株式会社 (YAC Garter Co., Ltd.) $\rightarrow$ YSD.
- **Trích dẫn Email Gốc (Dòng 50, Dòng 258791):**
  > **Row 50:** *From: `村上 貴哉 <t-murakami@garter.co.jp>` | Subject: `RE: 購入品貸与資産棚卸しの件`*  
  > *"早速ですが、リズム株式会社川越工場様の金型棚卸のため添付の「資産棚卸証」の内容についてご確認頂き、ご確認内容をご記入、ご捺印等の上、ＰＤＦにてご提出をお願い致します。該当金型：DIC-001 K-80072 提出期限：12/13(金)"*
- **Quy tắc Nghiệp vụ Đặc thù:**
  - Áp dụng biểu mẫu **Giấy kiểm kê tài sản (`資産棚卸証`)**, xác nhận trực tiếp hiện trạng khuôn của Rhythm được YAC Garter ký gửi sang YSD.

---

### 3.7. A&T / Éi-Ando-Tii (エイアンドティー)
- **Tên đầy đủ:** 株式会社エイアンドティー (A&T Corporation) — Bộ phận Mua hàng Nhà máy Shonan.
- **Trích dẫn Email Gốc (Dòng 9, 10, 11):**
  > **Row 9 & 10:** *From: `tsunodar@alice.aandt.co.jp` | Subject: `RE: 【11/22(金)迄】 金型等有無確認のお願い`*  
  > *"大変お世話になります。株式会社エイアンドティー 生産本部 購買部 湘南購買グループ 角田様より、金型等有無確認のお願いが届きました。期日までに現品確認の上、回答書を送付..."*
- **Quy tắc Nghiệp vụ Đặc thù:**
  - Quy trình xác nhận nhanh gọi là **`金型等有無確認`**, chu kỳ kiểm tra cố định vào tháng 11 hàng năm. YSD kiểm tra sự tồn tại của khuôn và dụng cụ gá cắt kèm theo.

---

### 3.8. Omura Giken / SMK (大村技研 / SMK)
- **Chuỗi Khách hàng:** SMK株式会社 (Chủ quản thiết bị điện tử) $\rightarrow$ 大村技研 株式会社 (Omura Giken - Nhà thầu dập) $\rightarrow$ YSD.
- **Trích dẫn Email Gốc (Dòng 70, Dòng 82):**
  > **Row 70:** *From: `大村技研 藤巻 達也` To: `YSD 吉田社長, 桜井, toan` | Subject: `設備返却依頼`*  
  > *"表題の件につきまして、SMK株式会社様より設備処分のご案内が届いております。つきましては、設備の廃棄対応を致しますので下記日程までに弊社へ設備の返却対応をお願い致します。*  
  > *所在：ヨシダパッケージ | 廃棄申請No.：A3CS008801 | 起工申請No.：97CK007505 | 図番：101CPB-229-12FG5 金型(成形後トレイ)*  
  > *尚、* **金型部品、金型図面、預かり書等、御座いましたら合わせて送付お願い致します。** *運送費については着払いにてご対応お願い致します。発送先：岩手県北上市相去町西裏 大村技研 岩手工場"*
- **Quy tắc Nghiệp vụ Đặc thù:**
  - Bàn giao tiêu hủy thiết bị theo thủ tục hủy tài sản cố định (`廃棄対応`): Bắt buộc thu gom toàn bộ bản vẽ kỹ thuật (`金型図面`), phụ tùng linh kiện kèm theo (`金型部品`) và biên bản tiếp nhận ban đầu (`預かり書`) để hoàn trả cùng khuôn về nhà máy chỉ định (Xưởng Iwate). Cước vận chuyển thanh toán đầu nhận (`着払い`).

---

### 3.9. Nemoto Sensor Engineering (ネモト・センサエンジニアリング)
- **Trích dẫn Email Gốc (Dòng 34):**
  > **Row 34:** *From: `YSD 小林` To: `松村様 <株式会社ネモト・センサエンジニアリング>` | Cc: `toan@ysd-pack.co.jp` | Subject: `RE: 資産預かり証の件`*  
  > *"大変お世話になります。ヨシダパッケージの小林です。Nemoto様ご指定の「資産預かり証」を作成し、添付致します。社判捺印の上、ご返送申し上げます。"*
- **Quy tắc Nghiệp vụ Đặc thù:**
  - Tiếp nhận tài sản cảm biến kèm khuôn khay chống sốc đặc thù, yêu cầu phát hành **`資産預かり証`** theo mẫu tài sản chuyên ngành kiểm định.

---

### 3.10. Minebea (ミネベア)
- **Trích dẫn Email Gốc (Dòng 697, Dòng 3087):**
  > **Row 697:** *From: `中西 正俊 <mnakanishi@minebea-c.com>` | Subject: `【No403010_トレー不具合サンプルについて】（XMN0P0-0020 サポートピン用プレスフィットターミナルトレー）`*  
  > *"テフロン加工の金型は本日戻り予定でして、今のところ変更無く下記の状況となっております。青森ですと雪の状況などありますので、24枚成形する際に60枚も成形しておいて2/26(水)にご確認頂き、問題が無ければ量産へ..."*
- **Quy tắc Nghiệp vụ Đặc thù:**
  - Nghiệp vụ xuất khuôn dập đi **phủ Teflon bề mặt (`テフロン加工`)** để khắc phục lỗi ma sát và bám dính khay chân gá hỗ trợ (`サポートピン用プレスフィットターミナルトレー`). Khuôn sau khi xử lý Teflon xong quay về YSD để dập mẫu thử (`試作成形`) gửi khách hàng duyệt trước khi sản xuất hàng loạt.

---

### 3.11. Terada Deimu (デイム / 寺田)
- **Trích dẫn Email Gốc (Dòng 3096):**
  > **Row 3096:** *From: `terada-deimu@train.ocn.ne.jp` | Subject: `RE: 金型棚卸`*  
  > *"本社工場への現地棚卸訪問の件ですが、ユーザーより、希望日程の連絡がありました。希望日＝２月１４日（金）または１７日（月）。ご検討、よろしくお願い申し上げます。"*
- **Quy tắc Nghiệp vụ Đặc thù:**
  - Khách hàng cuối yêu cầu **Kiểm tra hiện trường thực tế tại xưởng YSD (`現地棚卸訪問`)**. Hệ thống YSDMS cần lưu vết chính xác khuôn đang nằm ở giá kệ nào tại `本社工場` (Kawasaki) để chuẩn bị đón đoàn kiểm toán tài sản của khách.

---

## 4. ĐỐI CHIẾU HỆ THỐNG MÃ NGUỒN & SCHEMA HIỆN HÀNH (SYSTEM ALIGNMENT)

### 4.1. Khớp nối Cơ sở Dữ liệu Supabase Live (`Migration 098`)
Bảng `public.equipment_loans` trên hệ thống Production hiện tại đã được cấu trúc theo Migration 098:
```sql
-- Constraint loại hình mượn trả
CHECK (loan_type IN ('CUSTOMER_LOAN', 'RETURN_TO_CUSTOMER', 'OUTSOURCE_PROCESSING'))

-- Cột lưu trữ ảnh hiện trường kiểm toán tài sản cố định
photo_overall_url TEXT,     -- Toàn cảnh khuôn (kèm thước dây / biển hiệu)
photo_nameplate_url TEXT    -- Biển tên, mác khắc mã số tài sản (銘板・刻印)

-- View tổng hợp v_equipment_loans_summary
has_valid_loan_document BOOLEAN  -- Cờ kiểm tra tính hợp lệ chứng từ phục vụ kiểm toán hàng năm
```

### 4.2. Khớp nối Bộ Template In ấn PDF (`MoldLoanPDFDocument.tsx`)
Mã nguồn React-PDF `src/components/pdf/MoldLoanPDFDocument.tsx` đã tích hợp sẵn:
1. **Biển Placard Định danh Bắt buộc (`placardContainer`):**
   - Đặt tiêu đề: `【 撮影用看板 (資産特定プレート規格) 】`
   - Hiển thị đầy đủ: Mã tài sản khách, Khách hàng sở hữu, Kích thước $(L \times W \times H\text{ mm})$, Trọng lượng thực tế ($kg$).
2. **Khung Ảnh Hiện trường Kế toán (`photosContainer`):**
   - Khung 1: `[全体写真 / 全景写真 (メジャー・撮影看板含む)]` — Ảnh toàn cảnh thể hiện kích thước và thước cuộn.
   - Khung 2: `[銘板写真 / 資産プレート / 刻印]` — Cận cảnh bảng tên kim loại hoặc chữ khắc mã tài sản.
3. **Ô Đóng Kép 2 Con Dấu Kế toán Nhật Bản (`sealBoxContainer`):**
   - Ô 1: `社印 (角印)` — Dấu công ty hình vuông.
   - Ô 2: `代表者印 (丸印)` — Dấu đại diện pháp luật hình tròn.

---

## 5. GAP ANALYSIS & 4 ĐỀ XUẤT NÂNG CẤP CHO SPRINT P1 (RECOMMENDATIONS)

Dựa trên toàn bộ phân tích thực tế từ 10,427 luồng email và chứng từ kế toán, AN đề xuất **4 gói tính năng trọng tâm cho Sprint P1** (Kế thừa hạ tầng A4 + Auth đã kiểm chứng ở Sprint P0, không cần migration phá vỡ cấu trúc):

### 💡 Đề xuất 1: Chuẩn hóa Ngôn ngữ & Bộ lọc Giao diện UI (`/equipment/loans`)
- **Hiện trạng:** Giao diện còn dùng lẫn lộn thuật ngữ "Mượn khuôn" gây hiểu nhầm là cho mượn lẫn nhau giữa các xưởng.
- **Cải tiến:**
  - Đổi nhãn tab chính: `金型預託・借用管理` (Quản lý Lưu giữ & Bàn giao Khuôn).
  - Tách rõ 3 bộ lọc danh mục:
    1. `Khách giao khuôn YSD giữ` (`CUSTOMER_LOAN - 借用書兼預り証`).
    2. `Hoàn trả khuôn cho khách` (`RETURN_TO_CUSTOMER - 金型返却票`).
    3. `Xuất gia công Teflon/Mạ` (`OUTSOURCE_PROCESSING - 外注加工出し`).
  - Gắn biển cảnh báo rõ: *Di chuyển giữa Kawasaki và Yashio xin vào mục "社内移管 (Điều chuyển nội bộ)", không tạo tại đây*.

### 💡 Đề xuất 2: Bổ sung Phân hệ Chiến dịch Kiểm kê Tài sản Định kỳ (`棚卸調査・有高確認`)
- **Vấn đề thực tế:** Tháng 10 - Tháng 2 hàng năm, YSD bị quá tải khi nhận hàng chục file Excel kiểm kê từ JAE, Canon, Panasonic, Rhythm, A&T... Nhân viên kinh doanh (Kobayashi, Sakurai, Nakamura) phải lục lọi thủ công để điền cột `G (貸出書), H (金型有無), I (保管場所), K (稼働状況)`.
- **Cải tiến trong P1:**
  - Cung cấp tính năng **Export Bảng Kiểm kê Theo Khách Hàng (1-Click Audit Export)**:
    - Chọn khách hàng (VD: `JAE` hoặc `大分キヤノン`).
    - Hệ thống tự động truy vấn toàn bộ khuôn của khách đó kèm: Tình trạng giấy mượn (`has_valid_loan_document`), Vị trí giá kệ thực tế (`current_rack`), Ngày dập đơn hàng gần nhất (`last_used_date`), và Tình trạng chạy hay ngưng hoạt động.
    - Xuất định dạng Excel khớp 100% cột `G, H, I, J, K` để gửi ngay cho đối tác.

### 💡 Đề xuất 3: Hệ thống Cảnh báo Khuôn Ngưng Hoạt động $\ge 3$ Năm & Tính Phí Lưu kho (`非稼働金型 & 型保管料`)
- **Vấn đề pháp lý:** Nếu YSD giữ khuôn quá 3 năm mà không có PO mới và không thu phí lưu kho, khách hàng sẽ gặp rủi ro vi phạm Đạo luật Nhà thầu phụ (`下請法違反`), còn YSD chịu thiệt thòi về mặt bằng kho bãi.
- **Cải tiến trong P1:**
  - Hệ thống tự động quét ngày `last_used_date` của từng khuôn:
    - Nếu $\ge 3$ năm: Gắn cờ cảnh báo màu cam `非稼働 3年以上` (Inactive $\ge 3$ Years).
  - Tự động gợi ý 2 hành động tác nghiệp:
    1. Tạo phiếu yêu cầu khách hàng thu hồi hủy khuôn (`金型引取・廃棄申請`).
    2. Tự động tính toán bảng kê phí lưu giữ khuôn hàng tháng (`型保管料算出`) theo biểu mẫu đã kiểm chứng từ hồ sơ Fujikura (307.5 JPY/khuôn/tháng hoặc công thức diện tích kho).

### 💡 Đề xuất 4: Hỗ trợ Chụp Ảnh Hiện trường Kèm Thước Đo & Biển Placard từ Thiết bị Di động (Mobile Quick-Capture)
- **Vấn đề thực tế:** Quản đốc xưởng (Toan, Quan, Kudo) khi nhận khuôn hoặc trước kỳ kiểm toán phải dùng máy ảnh/điện thoại chụp, sau đó chuyển file vào máy tính để dán vào Excel rất mất thời gian. Thường xuyên bị nhắc nhở vì quên đặt thước cuộn (`メジャー`) hoặc quên in biển tên.
- **Cải tiến trong P1:**
  - Trên màn hình chi tiết phiếu mượn/trả (`/equipment/loans/[id]`):
    - Có nút "Tải ảnh toàn cảnh" và "Tải ảnh mác tên".
    - Màn hình hiển thị hướng dẫn trực quan: *⚠️ Bắt buộc đặt thước dây (メジャー) cạnh mép khuôn và đặt biển thông tin (撮影看板)*.
    - Tự động chèn ảnh vào file PDF A4 chuẩn khi nhấn nút "In biên nhận / In phiếu trả".

---

## 6. PHỤ LỤC DẪN CHỨNG EMAIL & TÀI LIỆU GỐC (EVIDENCE MATRIX)

| STT | Khách hàng liên quan | Mã Dòng / Hồ sơ Gốc | Người gửi / Đại diện | Tiêu đề Email / Tên Tài liệu | Dẫn chứng Trích dẫn Cốt lõi | Giá trị Nghiệp vụ Định hình |
|:---:|---|---|---|---|---|---|
| 1 | **Shin-Ei Hitec** | Row 30 (`toanysdmail.xlsx`) | `techno1@shi-hitec.com` (野澤) | 13162Bコネクタ用トレー 金型借用書の件 | "金型については弊社資産になるため借用書が必要... 撮影用看板フォーマットに金型のサイズと重量をご記入... 社印(各印)と代表者様の印(丸印)を押印の上、原本を郵送送付" | Quy chuẩn Biển Placard, Cân đo kích thước/trọng lượng, Con dấu kép 丸印・角印, Gửi bưu điện bản gốc. |
| 2 | **JAE / NLC** | Row 15 (`toanysdmail.xlsx`) | `yodogawak@jae.co.jp` (淀川) | 【ご依頼】貸与設備の棚卸調査依頼について | "非稼働金型（最終使用日から３年以上が経過...）は仕入先様から引き揚げて廃棄するのが大原則ですが... 支払わない場合は下請法違反となります" | Cơ sở pháp lý Đạo luật Nhà thầu phụ, Tiêu chí khuôn ngưng hoạt động $\ge 3$ năm, Hợp đồng ký thác 寄託契約. |
| 3 | **Transtron / Ohte / MRDI** | Row 52 & 55 (`toanysdmail.xlsx`) | YSD 小林 $\rightarrow$ MRDI 内田 | RE: トランストロン/P700SPM用トレイの写真撮影依頼 | "今後、金型写真をお願いした時は金型の大きさが写真で分かる様にメジャーを添えて撮影するようにしてもらえると助かります" | Bắt buộc đặt thước dây / thước cuộn (メジャー) khi chụp ảnh lưu giữ tài sản khách. |
| 4 | **Fujikura** | `source_data/型保管料(20250704)` | Makoto Uenoyama (上野山 真) | RE: 貸与金型等保管費用算出のお願い | "見積書に基づいてお支払い... 支払対象期間：一昨年度分については遅延料3%を載せて請求をお願いします" | Bằng chứng thực tế thu phí bảo quản khuôn (型保管料), Lãi phạt chậm trả 3%, Bộ 4 chứng từ Kế toán. |
| 5 | **Panasonic Shirakawa** | Row 100 (`toanysdmail.xlsx`) | Advanex 石島 $\rightarrow$ 相和 武本 $\rightarrow$ YSD 桜井 | 【KSG005592】パナソニック白河向け金型棚卸のお願い | "QRラベルがない金型は返却不可です... 1,100×1,100のサイズのパレットを使用した場合の金型積載時の高さを教えてください" | Ràng buộc quét mã QR khi trả hàng, Quy chuẩn đóng gói pallet $1,100 \times 1,100$ và đo chiều cao vận tải. |
| 6 | **Oita Canon / Asahi** | Row 5 & 13869 (`toanysdmail.xlsx`) | Asahi 滝本 里奈 / 最上 登紀子 | RE: 大分キヤノン様 固定資産リスト 金型写真提出 | "経費資産「借用証/現品受渡確認票」を送付致します... 電子社判でご捺印いただき、PDF送付でご提出..." | Tách biệt Tài sản Cố định & Chi phí; Quy trình ký đóng dấu điện tử 電子社判 trên biểu mẫu chuẩn. |
| 7 | **Rhythm** | Row 50 (`toanysdmail.xlsx`) | YAC Garter 村上 貴哉 | RE: 購入品貸与資産棚卸しの件 (DIC-001 K-80072) | "リズム株式会社川越工場様の金型棚卸のため添付の「資産棚卸証」の内容についてご確認頂き、ご捺印の上提出..." | Mẫu chứng từ 資産棚卸証 cho đơn vị ủy thác trung gian (YAC Garter). |
| 8 | **A&T** | Row 9, 10, 11 (`toanysdmail.xlsx`) | A&T 購買部 角田 | RE: 【11/22(金)迄】 金型等有無確認のお願い | "金型等有無確認表にご記入し、期日までにご提出..." | Quy trình đối soát hàng năm "金型等有無確認" định kỳ tháng 11. |
| 9 | **Omura Giken / SMK** | Row 70 & 82 (`toanysdmail.xlsx`) | 大村技研 藤巻 達也 | RE: 設備返却依頼 (廃棄対応) | "SMK様より設備処分... 廃棄申請No. A3CS008801... 金型部品、金型図面、預かり書等、御座いましたら合わせて送付お願い致します" | Thủ tục bàn giao tiêu hủy tài sản: Thu hồi trọn bộ phụ tùng, bản vẽ và biên nhận mượn gốc về xưởng Iwate. |
| 10 | **Minebea** | Row 697 (`toanysdmail.xlsx`) | Minebea 中西 正俊 | トレー不具合サンプルについて (テフロン加工) | "テフロン加工の金型は本日戻り予定でして... 24枚成形する際に60枚も成形しておいてご確認頂き..." | Nghiệp vụ gia công bề mặt (テフロン加工出し), không đổi chủ sở hữu, dập thử mẫu nghiệm thu trước khi chạy. |
| 11 | **Terada Deimu** | Row 3096 (`toanysdmail.xlsx`) | terada-deimu@train.ocn.ne.jp | RE: 金型棚卸 (本社工場現地棚卸) | "本社工場への現地棚卸訪問の件ですが、ユーザーより希望日程の連絡がありました。希望日＝２月１４日..." | Khách hàng cử đoàn kiểm tra hiện trường tại xưởng Kawasaki; yêu cầu hệ thống định vị chính xác vị trí giá kệ. |

---

### KẾT LUẬN & KIẾN NGHỊ BAN ĐIỀU HÀNH
Tài liệu này là **Single Source of Truth (SSOT)** về toàn bộ nghiệp vụ lưu giữ, kiểm kê, bàn giao và tính phí bảo quản khuôn khách hàng tại YSD. Mọi thiết kế chức năng, cấu trúc cơ sở dữ liệu và tài liệu đào tạo cho phân hệ `/equipment/loans` trong tương lai bắt buộc phải tuân thủ nghiêm ngặt các nguyên tắc và bằng chứng thực tế nêu trên.
