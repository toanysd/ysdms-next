# 📊 Báo Cáo Rà Soát Dữ Liệu Khách Hàng / Công Ty (Companies)
## YSDMS NextGen — Customer Data Audit Report

> **Ngày tạo:** 2026-08-07  
> **Nguồn dữ liệu:**  
> 1. `source_data/生産指示書/納入先一覧表.xlsx` — Bảng danh sách địa chỉ giao hàng master  
> 2. `\\SERVER\ysd-folder\` — Thư mục đơn hàng trên server (chỉ đọc)  
> 3. `\\SERVER\ysd-cad\` — Thư mục CAD/khuôn trên server (chỉ đọc)  
> **Mục đích:** Tạo bảng dữ liệu khách hàng hoàn chỉnh để migration lên Supabase DB  

---

## 1. TỔNG QUAN NGUỒN DỮ LIỆU

### 1.1 File Excel `納入先一覧表.xlsx`
- **Nội dung:** Bảng master quản lý tất cả điểm giao hàng (納入先) của YSD
- **Sheets quan trọng:**
  - `納入先一覧表` — Danh sách khách hàng theo mã code (1,180 dòng, ~792 mã công ty unique)
  - `トレイデータ一覧表` — Catalog sản phẩm khay (tham khảo thêm)
  - `指示書作成シート(成形/外注)` — Template phiếu sản xuất
- **Cấu trúc cột:** `No.(Code) | 送り先(Destination) | 住所(Address) | 依頼元(Requester) | サブ(Contact) | 電話(Tel) | FAX`

### 1.2 Server `\\SERVER\ysd-folder\`
- **新AMP注文書** — TE/AMP: 26 thư mục con, 197 file đơn hàng
- **新HAE注文書** — 弘前航空電子: 41 thư mục con
- **新NLC注文書** — ニッコー・ロジスティクス: 59 thư mục con
- **新SMK注文書** — SMK: 11 thư mục con, 840+ file
- **新YAE注文書** — 山形航空電子: 51 thư mục con
- **新一般注文書** — Khách hàng tổng hợp: **1,787 thư mục** (sắp xếp あ~わ行)
- **YSD見積書** — Thư mục báo giá theo nhân viên
- **廃棄 新一般** — 468 thư mục khách hàng đã ngưng hoạt động

### 1.3 Server `\\SERVER\ysd-cad\`
- **金型データー** — Dữ liệu khuôn (3,560+ thư mục)
- **見積案件** — 1,742 thư mục dự án báo giá

---

## 2. PHÂN LOẠI KHÁCH HÀNG

### 2.1 Khách Hàng Chính (Major Accounts) — Có thư mục riêng trên server

| Mã | Tên tiếng Nhật | Tên tiếng Anh | Ghi chú |
|-----|---------------|---------------|---------|
| **AMP** | タイコ エレクトロニクス ジャパン合同会社 | TE Connectivity Japan G.K. | Khách lớn nhất. Nhiều site: 川崎, 静岡第1, 静岡第2, 掛川 |
| **HAE** | 弘前航空電子株式会社 | Hirosaki JAE | Công ty con của JAE tại Hirosaki |
| **NLC** | ニッコー・ロジスティクス株式会社 | Nikko Logistics | Công ty logistics của JAE |
| **SMK** | SMK株式会社 | SMK Corporation | Khách lớn. Site: 本社(品川), 富山, 茨城(ひたち) |
| **YAE** | 山形航空電子株式会社 | Yamagata JAE | Công ty con của JAE tại Yamagata |

### 2.2 Nhà Cung Cấp / Đối Tác Sản Xuất (Suppliers/Outsource)

| Mã | Tên | Vai trò |
|-----|-----|---------|
| **MRD** | (有)丸大商会 | Nhà gia công (成形), Kho (鴻野山) |
| **NSK** | (有)日三化成 | Nhà gia công khay |
| **SKT** | 坂田精文堂 | Nhà gia công (SMK related) |
| **YMI** | 山一精工 | Nhà gia công khuôn |
| **YDS** | ㈱ヨシダパッケージ (YSD) | Chính công ty YSD |

### 2.3 Thống Kê Tổng Hợp

| Chỉ số | Giá trị |
|--------|---------|
| Tổng mã công ty unique (từ Excel) | **792** |
| Tổng thư mục khách hàng trên server | **1,787** (一般) + **188** (major) |
| Thư mục khách hàng đã ngưng | **468** (廃棄) |
| Ước tính khách hàng active | **~800-1,000** |

---

## 3. BẢNG DỮ LIỆU KHÁCH HÀNG CHÍNH (TOP CUSTOMERS)

> File đầy đủ: `source_data/company_master_data.json` (795 records)  
> File TSV: `source_data/company_master_data.tsv`

### 3.1 Danh Sách Mẫu — 50 Khách Hàng Đầu (theo mã ABC)

| Code | Tên Công Ty (JA) | Địa Chỉ | Điện Thoại |
|------|-----------------|---------|------------|
| A3C | (有)A3Cﾃﾞｻﾞｲﾝ | 福井県鯖江市上河端町6-1-33 | 0778-54-8081 |
| AAK | (株)秋元化工 | 東京都豊島区高田3-28-5 | 03-3982-4656 |
| AAT | (株)ｱｰﾄﾃｸﾉﾛｼﾞｰ | 長野県塩尻市北小野4009-8 | 0263-52-4655 |
| ACD | （株）アサカ機工 | 茨城県稲敷郡阿見町大字若栗1843-3 | 029-882-0761 |
| ACS | ㈱アクセス | 新潟県西蒲原郡黒埼町大字鳥原903-1 | 025-239-3340 |
| ADK | (株)ｴｰﾃﾞｨｰｹｲ | 福島県須賀川市長沼 | 0248-68-3211 |
| ADV | （株）アドバネクス 本社 | 新潟県柏崎市大字藤井字西沖1355 | 0256-41-4141 |
| AEC | エーゼン(株) | 岩手県北上市大通り4-3-1 | 0197-65-3250 |
| AFM | (株)ｴｰｴﾌｴﾑｼｰ | 群馬県太田市西矢島町40 | 0276-37-2651 |
| AID | (株)アイデム | 東京都目黒区下目黒2-23-18 | 03-3716-4040 |
| AIN | (有)アイン精巧 | 千葉県松戸市大谷口153-1 | 047-392-4450 |
| AKK | 秋田化工(株) | 秋田県由利本荘市 | — |
| AKR | (有)ｱｸｾﾌﾟﾄ | 大阪市淀川区宮原5-1-18 新大阪ﾋﾞﾙ | 06-6150-1801 |
| AKT | （株）アキタ | 東京都品川区東品川4-7-27 | 03-3471-3221 |
| ALI | (株)アイ・ライティング・システム | 埼玉県川越市古谷上6056-1 | 049-236-5871 |
| ALP | （株）アルプレート | 東京都台東区今戸2-16-8 | 03-3872-3701 |
| AMP | タイコ エレクトロニクス ジャパン合同会社 | 川崎市多摩区登戸3816 | 044-900-5035 |
| AND | ｱﾝﾃﾞｽ電気（株） 青森工場 | 青森県青森市富田3-8-31 | 017-782-1999 |
| AON | （株）青野工業 | 茨城県稲敷郡河内町金江津5505 | 0297-86-3661 |
| ARM | (株)アロマ | 山形県東田川郡庄内町余目字六人塚132-1 | 0234-42-0655 |
| ARS | (株)アローセブン | 静岡県浜松市中区上島3-27-7 | 053-469-0031 |
| ASH | （株）朝日ﾌﾟﾗｽﾁｯｸ | 港北区新吉田町510-3 | 045-593-2121 |
| ASK | (株)朝日化成 | 福岡県嘉麻市上山田211番地51 | 0948-53-0097 |
| ATB | アートビーム(有) | 東京都八王子市中野山王1-6-6 | 042-622-7380 |
| BBJ | BBJﾊｲﾃｯｸ(株) | 埼玉県さいたま市大宮区大成町3-530-1 | 048-654-2551 |
| CEJ | ㈱シチズン電子 | 山梨県富士吉田市上暮地1-23-1 | 0555-23-4121 |
| CRS | ㈱クリスタル光学 | 滋賀県大津市真野大野 | 077-572-4848 |
| DDK | 第一電子工業（株） | 栃木県真岡市松山町14 | 0285-83-4799 |
| DGK | (株)電子技研工業 | 東京都調布市調布ヶ丘3-2-1 | 042-486-0775 |

*(Danh sách đầy đủ 795 records xem file `company_master_data.tsv`)*

---

## 4. CẤU TRÚC THƯ MỤC SERVER (Tham Khảo Nhanh)

### 4.1 `\\SERVER\ysd-folder\` — Thư mục đơn hàng & kinh doanh

```
\\SERVER\ysd-folder\
├── 新AMP注文書\             ← TE/AMP (major account)
├── 新HAE注文書\             ← 弘前JAE
├── 新NLC注文書\             ← ニッコー・ロジスティクス  
├── 新SMK注文書\             ← SMK (major account)
├── 新YAE注文書\             ← 山形JAE
├── 新一般注文書\             ← 1,787 khách hàng tổng hợp
│   ├── あ行\ (360 folders)
│   ├── か行\ (239 folders)
│   ├── さ行\ (289 folders)  
│   ├── た行\ (298 folders)
│   ├── な行\ (134 folders)
│   ├── は行\ (181 folders)
│   ├── ま行\ (144 folders)
│   ├── や行\ (84 folders)
│   ├── ら行\ (34 folders)
│   └── わ行\ (23 folders)
├── ＹＳＤ注文書\             ← Đơn hàng nội bộ YSD  
├── ﾌﾞﾘｽﾀｰ注文書\            ← Blister orders
├── YSD見積書\               ← Báo giá (theo nhân viên)
├── 廃棄 新一般\              ← 468 khách hàng đã ngưng
├── 廃棄 AMP\               ← AMP orders đã ngưng
├── 廃棄 SMK\               ← SMK orders đã ngưng
├── 月末-トレイ受注一覧＆売上実績\ ← Báo cáo doanh thu
├── 元田データ\               ← Dữ liệu nhân viên Motoda
├── 前田データ\               ← Dữ liệu nhân viên Maeda
├── 遠藤データ\               ← Dữ liệu nhân viên Endo
├── 社長データ\               ← Dữ liệu giám đốc
└── 価格改定のお願い\           ← Thông báo điều chỉnh giá
```

### 4.2 `\\SERVER\ysd-cad\` — Thư mục kỹ thuật / CAD

```
\\SERVER\ysd-cad\
├── 金型データー\              ← 3,560+ thư mục dữ liệu khuôn
│   ├── カッターベース\         ← 60+ cutter base specs
│   ├── 加工済み\             ← 3,560+ processed mold data
│   ├── ベトナム プログラム依頼分\ ← 250+ Vietnamese orders
│   ├── プラグ加工\            ← Plug processing
│   └── スタッキング\          ← Stacking data
├── 見積案件\                ← 1,742 quotation projects
├── AUTOCAD\               ← AutoCAD files
├── NC DATE\               ← NC machining data
├── 新規仕掛\               ← New WIP projects
├── 刻印修正\               ← Engraving corrections
└── 金型保管データ-Form2024.4.24.xlsm ← Mold inventory
```

---

## 5. VẤN ĐỀ DỮ LIỆU CẦN GIẢI QUYẾT

### 5.1 Tên Công Ty Không Nhất Quán

| Vấn đề | Ví dụ | Giải pháp |
|--------|------|-----------|
| Full-width vs half-width | `（株）` vs `(株)` vs `㈱` | Chuẩn hóa thành format thống nhất |
| Katakana full vs half | `ﾌﾟﾗｽﾁｯｸ` vs `プラスチック` | Chuyển toàn bộ sang full-width katakana |
| Trailing spaces | `朝日ﾌﾟﾗｽﾁｯｸ　` | Trim whitespace |
| Suffix variants | `(株)`, `株式会社`, `㈱` | Chuẩn hóa notation |
| Company type in name | `(有)`, `(株)`, `合同会社` | Tách riêng thành trường `company_suffix` |

### 5.2 Mã Code Trùng Lặp / Mơ Hồ

| Mã | Vấn đề |
|-----|--------|
| `ASH` | Nhiều công ty: 朝日ﾌﾟﾗｽﾁｯｸ, 朝日化工, (株)アサヒ, (株)朝日 |
| `AND` | Cùng là ｱﾝﾃﾞｽ電気 nhưng nhiều delivery code khác nhau (AND1~AND4) |
| `AMP` | 32 delivery codes (AMP1~AMP32) cho cùng TE Connectivity |

### 5.3 Thiếu Thông Tin

- Nhiều record chỉ có mã code và tên, thiếu địa chỉ, tel
- Major customers (HAE, NLC, YAE) có thư mục server nhưng không có trong 納入先一覧表
- Không có email, website, tax ID

---

## 6. ĐỀ XUẤT CẤU TRÚC DB (Migration Plan)

### 6.1 Bảng `companies` — Chuẩn hóa

```sql
-- Mỗi CÔNG TY = 1 record (không phải mỗi delivery site)
-- Delivery sites tách riêng vào bảng delivery_sites

INSERT INTO companies (
  company_code,        -- 'AMP', 'SMK', 'HAE'...
  company_name,        -- Tên chính thức: 'タイコ エレクトロニクス ジャパン合同会社'
  company_name_romaji, -- 'TE Connectivity Japan G.K.'
  company_type,        -- ['CUSTOMER'], ['SUPPLIER'], ['CUSTOMER', 'SUPPLIER']
  parent_company_id,   -- HAE, NLC, YAE → parent = JAE
  is_active,           -- true / false (false cho 廃棄 companies)
  tel,                 -- Số điện thoại chính
  fax,                 -- Fax chính
  address,             -- Địa chỉ chính
  order_folder_path,   -- '\\SERVER\ysd-folder\新AMP注文書'
  cad_folder_path,     -- NULL hoặc path nếu có
  notes               -- Ghi chú
) VALUES ...
```

### 6.2 Dữ Liệu Tham Khảo Đã Tạo

| File | Nội dung | Dùng cho |
|------|---------|----------|
| `source_data/company_master_data.json` | 795 records JSON đầy đủ | Migration script |
| `source_data/company_master_data.tsv` | Bảng TSV dễ xem | Review trước migration |
| `source_data/parsed_delivery_destinations.json` | Parsed từ Excel | Tham khảo |
| `source_data/server_directory_catalog.txt` | Catalog thư mục server 33,808 dòng | Tham khảo nhanh |
| `source_data/生産指示書/納入先一覧表_extracted.txt` | Raw data từ Excel | Tra cứu gốc |

---

## 7. THƯ MỤC KHÁCH HÀNG TRÊN SERVER — TỔNG HỢP THEO あ~わ

> Đây là bản snapshot để AI agent đọc nhanh mà không cần truy cập server lại.

### あ行 (360 thư mục khách hàng)
アイエイエム電子, アイエスディ, アイエヌテック国上, アイカムス・ラボ, アイクレックス, アイザック, アイセス, アイテック, アイデム, アイペック, アイリス, アイン精巧, アオノ, アキタ, アクティ, アグレス, アサカ機工, アサヒ, アサヒプレシジョン, アサヒメタルファイン, アシストＶ, アステイ, アストム, アズバイオ, アズビル(山武), アセック, アゼリア, アットマークテクノ, アヅマテクノス, アドバネクス, アドプラスジャパン, アプローチ, アマゾンサイエンス, アラマキ, アリアテクニカ, アルコム, アルス, アルファクト, アルプスアルパイン, アルプス物流, アルプス電気, アレントジャパン, アロマ, アローセブン, アンデス電気, アーク産業, アートビーム, アートファイネックス, アーバンカンパニー, アール光学工業...

### か行 (239 thư mục khách hàng)
KAGA USA, KRDコーポレーション, Kamogawa, カコ, カシワテクノス, カタイ螺子, カナエ, カワイ, 亀田製作所, 兼広機材, 加積商会, 加賀ＦＥＩ, 堅木, 川島工業, 川崎エコー, 川崎自動車工業, 柏原計器工業, 桂川精螺製作所, 河内電機, 片山鋲螺工業, 甲斐工業, 神奈川フッ素, 神沢鉄工, 神田工業, 金子コード, 金沢工機, 鹿島エレクトロニクス, KTC京都機械工具, 九州新生電子, 京都タカオシン, 共同包材, 共和工業, 共栄産業, 北原商事, 協和化成工業, クイント, クオリアル, コアスタッフ, コスモパワー, コダマコーポレーション, コニカミノルタ, コネック, コーンズテクノロジー...

### さ行 (289 thư mục khách hàng)
SOLIZE, サンモール工業, 三宗, 三昌技研, サヤシ工業, サンテックス, サンライト, 三世光機, 三信電子, 三光合成, 三共化成, 三共精密金型, 三協化学工業, 三和ロボティクス, 三晶MEC, 三晶技研, 三洋化成, 三興工業, 佐渡, 佐藤商工社, 佐藤製作所, 坂本鉄工, 埼玉富士, 山王(旧明王化成), 山陽マーク製作所, 最上インクス, 下田工業, 七星社, 信光実業, 新光電気工業, 新成化成, 新進テック, 昭和KDE, ジェイエイアイ電子, JX金属, スズキ技研, スター精密, セイコーインスツル, セキコーポレーション, ソディックエフ・ティ...

### た行 (298 thư mục khách hàng)
TANAX, タイヨー電子, タカスギ, 匠工業, 多田製作所, 大宝工業, 大成プラス, 太洋工業, 田中精機, 高梨製作所, タカノギケン, ダイワ化成, ダイテックス, ダイニチ工業, チューゲン, ツツミ, ティーエムディー, テクノ大西, TDK庄内, ディック, デンソー, トプコン山形, トークシステム, トーモク, 東京鋲兼, 東京コスモス電機, 東北テクトロン, 東北プレス工業, 東工, 東洋技研, 東海商事, 富山昭和, 電装工業...

### な行 (134 thư mục khách hàng)
ナカイ精工, ナカエ電子, ナガセプラスチックス, 中原大貫製作所, 中島製作所, 中村製作所, 内外産業, 永井紙器工業, 長野日本無線, ニシムラ, ニワノ, 丹羽新精機, 日三化成, 日本プラスチック工業, 日本ミクロン, 日本メクトロン, 日本電産サンキョー, 日通NECロジスティクス, 西居製作所, NISSHAプレシジョン, ニデックコンポーネンツ, ニフコ, ネクサス化成, ノボル電機...

### は行 (181 thư mục khách hàng)
HAYAMA, ハイパックスサトウ, 八丈興発, 原口エンジンニア, 林テレﾝﾌﾟ, 橋本精密工業, 浜松ホトニクス, 白山製作所, ヒロテック, 平井精密工業, 日立化成, フィガロ技研, フジソク, フジクラ, フジクラ電装, プラックス, 冨士発條, 富士フイルム, 富士梱包紙器, 堀内精工, ホクソウ, ホーユー, 北陸アイエヌティ, ポリプラスチックス, BMI...

### ま行 (144 thư mục khách hàng)
丸大, 丸山加工, 前出産業, 松井電器産業, 松永精密工業, マックエイト, ミツミ電機, ミクニ, ミコマ技研, ミネベアコネクト, ミヤカワ, 三鷹精工, 三菱電機, 水谷製作所, 村田工業, 村田製作所, メイワ電子, 明治合成, モールド技研...

### や行 (84 thư mục khách hàng)
やまと工業, ヤナ川精機製作所, ヤマイチ, ヤマセ電気, 八洲商事, 山一精工, 山下マテリアル, 山口製作所, 山崎製作所, 山田精工, 山田製作所, 矢崎部品, ユニオンツール, ユーエム, ユージーハイテックス, ヨコオ, 吉川化成, 吉田化成工業所, 横河電機, 横浜金属, 米田精機...

### ら行 (34 thư mục khách hàng)
Rapidus, ライズ, ラピス精器, ラプラス, Ring(旧康永精密), リカザイ, リコーインダストリアルソリューションズ, リズム, ルネサスイートン, レグルス, レシップ電子, ロイアルエンジニアリング, ロクゴー, ロッキー化成...

### わ行 (23 thư mục khách hàng)
ワイコム, ワコー産業, ワシモト, 和光精機, 和田ステンレス工業, 和興産業, 渡辺化成工業, 渡辺精工社, ワイエイシイガーター, ワカエ, YDK...

---

## 8. NEXT STEPS

1. **Review dữ liệu:** Kiểm tra file `company_master_data.tsv` để xác nhận tên công ty đúng
2. **Xác nhận khách hàng active:** Cross-check với danh sách `廃棄` (đã ngưng)
3. **Bổ sung thông tin:** Email, website, mã số thuế cho các khách hàng chính
4. **Migration script:** Tạo script SQL/Supabase insert từ `company_master_data.json`
5. **Mapping delivery_sites:** Tách delivery codes (AMP1~AMP32) thành bảng `delivery_sites`

---

*Báo cáo này được tạo tự động. Dữ liệu server đã được snapshot — không cần truy cập lại `\\SERVER\ysd-folder` hay `\\SERVER\ysd-cad` cho việc tra cứu thông thường.*
