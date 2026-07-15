# YSDMS 用語集 / Bảng Thuật ngữ / Glossary

> **Document ID:** 00_GLOSSARY  
> **Version:** 1.0  
> **Last Updated:** 2026-06-03  
> **Author:** Business Analysis Team  
> **Status:** 📗 Active  

---

## この用語集の使い方 / Cách sử dụng / How to Use This Glossary

> [!IMPORTANT]
> この文書は **YSDMS-NextGen プロジェクト全体における用語の唯一の正式な情報源 (Single Source of Truth)** です。
> すべてのドメイン分析文書 (BRD)、技術仕様書、UI/UXデザイン、データベース設計はこの用語集の定義に準拠すること。

**Tài liệu này là nguồn chính thức duy nhất (Single Source of Truth) cho thuật ngữ trong toàn bộ dự án YSDMS-NextGen.**
Mọi tài liệu phân tích nghiệp vụ (BRD), đặc tả kỹ thuật, thiết kế UI/UX, và thiết kế cơ sở dữ liệu đều phải tuân thủ các định nghĩa trong bảng thuật ngữ này.

**This document is the Single Source of Truth for terminology across the YSDMS-NextGen project.**
All Business Requirements Documents (BRD), technical specifications, UI/UX designs, and database schemas must conform to the definitions herein.

### 凡例 / Chú giải / Legend

| 記号 | 意味 |
|:---:|:---|
| 🗃️ | DB テーブル名が確定済み / Tên bảng DB đã xác định / DB table name confirmed |
| 📐 | DB テーブル名は提案中 / Tên bảng DB đang đề xuất / DB table name proposed |
| ⚙️ | Enum / 区分値 / Giá trị phân loại / Enum/classification value |

### 参照元ドキュメント / Tài liệu tham khảo / Source Documents

- [ysdms_workflow_v2.md](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/docs/ysdms_workflow_v2.md) — ワークフロー評価・再構築レポート
- [YSDMS_BusinessFlow_Handover.md](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/20260529_20249_YSDMS_BusinessFlow_Handover.md) — 業務引継ぎ・ビジネスフロー
- [IRI_order.md](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/IRI_order.md) — イリソ電子工業 実注文メールチェーン
- [CHG_order.md](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/CHG_order.md) — チューゲン 実注文メールチェーン
- `source_data/ISO(2026見直し済み）/` — ISO 9001/14001 品質・環境管理文書群
- `source_data/生産指示書/` — 生産指示書テンプレート (A.納入先, B.トレイデータ, C.指示書作成シート)
- `source_data/材料在庫/` — 材料在庫日次記録 (480+ファイル)
- `source_data/見積書/` — 見積書テンプレート群
- `source_data/金型保管料(20250704)/` — 金型保管料管理資料

---

## 1. 受注・営業 / Đơn hàng & Kinh doanh / Order & Sales

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| 受注 | Đơn hàng | Order | 🗃️ `orders` | D1 | 顧客からの注文全般。`order_type` で分類される |
| 受注番号 | Mã đơn hàng | Order Number | `orders.order_number` | D1 | システムが自動採番する一意の注文識別子 |
| 受注種別 | Loại đơn hàng | Order Type | ⚙️ `order_type` enum | D1 | `design_tray`, `design_mold`, `prototype`, `mass_production` |
| 見積 | Báo giá | Quotation | 📐 `quotations` | D1 | 顧客への価格提案書。[見積書テンプレート](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/見積書)参照 |
| 注文書 | Đơn đặt hàng | Purchase Order (PO) | 📐 `purchase_orders` | D1 | 顧客が発行する正式な発注書。IPS発注番号等を含む |
| 納品書 | Phiếu giao hàng | Delivery Note | 📐 `delivery_notes` | D1 | 出荷時に同梱する納品明細書 |
| 請求書 | Hóa đơn | Invoice | 📐 `invoices` | D1 | 金型保管料請求等を含む |
| 取引先 | Khách hàng | Client/Customer | 🗃️ `customers` | D7 | 本社(HQ)・支店(Branch)・納入先(Delivery Site)の階層構造 |
| 納入先 | Địa chỉ giao hàng | Delivery Destination | 🗃️ `customers` (type=delivery_site) | D1 | 実際の製品送付先。[生産指示書A.納入先一覧表](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/生産指示書)参照 |
| 出荷 | Xuất hàng | Shipment | 📐 `shipments` | D1 | 製品の出荷行為。出荷日・運送情報を管理 |
| 出荷日 | Ngày xuất hàng | Shipping Date | `orders.shipping_date` | D1 | 実際の出荷予定日 (例: IRI案件「5/20(水)」) |
| 直接取引 | Giao dịch trực tiếp | Direct Transaction | — | D1 | エンドユーザーとの直接取引 (例: IRI=イリソ直接取引) |
| 商社経由 | Qua thương mại | Via Trading Company | — | D1 | 商社を介した間接取引 (例: CHG=チューゲン経由) |
| 無償サンプル | Mẫu miễn phí | Free Sample | — | D1 | 初回サンプル等の無償提供品 (例: 「25枚(無償)」) |
| 金型手配依頼 | Yêu cầu sắp xếp khuôn | Mold Arrangement Request | — | D1/D3 | 顧客からの金型製作依頼。IRI案件の起点となる文書 |
| 金型費 | Phí khuôn | Mold Cost/Fee | — | D1 | 金型製作にかかる費用 |
| 設計費 | Phí thiết kế | Design Fee | — | D1 | トレイ設計にかかる費用。PO の `design_tray` タイプで管理 |

---

## 2. 製品・設計 / Sản phẩm & Thiết kế / Product & Design

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| トレイ | Khay | Tray | 🗃️ `product_master` | D1/D3 | YSD の主力製品。電子部品搬送用プラスチックトレイ |
| 製品 | Sản phẩm | Product | 🗃️ `product_master` | D1 | トレイの上位概念。製品マスター |
| 製品コード | Mã sản phẩm | Product Code | `product_master.product_code` | D1 | 顧客固有の製品識別子 (例: IRI-003, KWE-005, CHG-002) |
| 規格トレイ | Khay tiêu chuẩn | Standard Tray | — | D1 | 既存金型で製造可能な標準品 (例: A-024-1, H-015-2) |
| 設計 | Thiết kế | Design | — | D3 | トレイ・金型の設計プロセス全般 |
| 図面 | Bản vẽ | Drawing | 📐 `drawings` | D3 | 技術図面。金型図、トレイ図、抜型図を含む |
| トレイ図面 | Bản vẽ khay | Tray Drawing | — | D3 | トレイ形状の図面 (例: 弊社図面 IRI-003) |
| 金型図 | Bản vẽ khuôn | Mold Drawing | — | D3 | 金型加工用図面 |
| 抜型図 | Bản vẽ dao cắt | Cutter Drawing | — | D3 | 抜型加工用図面 |
| 3Dデータ | Dữ liệu 3D | 3D Data | — | D3 | STEPファイル等の3D CADデータ。顧客から提供される場合と社内設計の場合あり |
| STEPファイル | Tệp STEP | STEP File | — | D3 | 3D CADデータ交換用の標準フォーマット |
| レイアウト | Bố cục | Layout | — | D3 | 金型上のトレイ配置。面数 (例: 1面, 2面) で表現 |
| 金型設計 | Thiết kế khuôn | Mold Design | 🗃️ `mold_design_revision` | D3 | 金型の設計データ。バージョン管理される |
| 設計改訂 | Phiên bản thiết kế | Design Revision | 🗃️ `mold_design_revision` | D3 | R1, R2 等のリビジョン番号で管理 |
| 刻印 | Khắc dấu | Engraving/Marking | — | D3 | トレイに刻印される識別マーク |
| 外寸 | Kích thước ngoài | External Dimensions | `product_master.dimensions` | D3 | トレイ外形寸法 (例: 325±1.0×210±1.0) |
| 型寸 | Kích thước khuôn | Mold Dimensions | — | D3 | 金型の寸法 (例: 355×240) |
| 面数 | Số mặt | Number of Faces/Cavities | — | D3 | 1ショットあたりのトレイ取り数 (例: 1面, 2面) |
| 承認 | Phê duyệt | Approval | `mold_design_revision.status` = APPROVED | D3 | 顧客による図面承認プロセス |
| 製品−金型マップ | Bản đồ sản phẩm-khuôn | Product-Mold Map | 🗃️ `product_mold_map` | D3 | トレイと金型の紐付け (Phase 2.4 完成済) |
| ポケット | Hốc | Pocket | — | D3 | トレイ上の部品収容凹部 |
| ポケット試作 | Thử nghiệm hốc | Pocket Prototype | — | D3 | ポケット形状の試作確認 |

---

## 3. 金型・抜型 / Khuôn & Dao cắt / Mold & Cutter

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| 金型 | Khuôn | Mold | 🗃️ `mold_physical` | D3 | 真空/圧空成形用の金属製型。Mold Base |
| 金型番号 | Mã khuôn | Mold Number | `mold_physical.mold_number` | D3 | 金型の一意識別番号 (例: K-18052S-01-02) |
| 抜型 | Dao cắt | Cutter/Die | 🗃️ `cutters` | D3 | 成形後のトレイを切断する刃型 |
| インライン抜き | Cắt inline | Inline Cutting | — | D3 | 成形機のライン内で自動的にカットするタイプ |
| テフロン加工 | Phủ Teflon | Teflon Coating | — | D3 | 金型表面のテフロンコーティング処理。外注あり |
| 金型保管料 | Phí bảo quản khuôn | Mold Storage Fee | 📐 `mold_storage_fees` | D3 | 顧客金型の保管に対する定期請求料金 |
| 金型台帳 | Sổ đăng ký khuôn | Mold Register | — | D3 | 金型の総合管理台帳。[金型台帳](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/ISO(2026見直し済み）/金型台帳060926.xls)参照 |
| 金型廃棄 | Hủy khuôn | Mold Disposal | — | D3 | 使用しなくなった金型の廃棄処理 |
| プラグ | Plug | Plug | — | D3 | 真空成形時に樹脂を押し込む補助具。プラグデータはCADで作成 |
| キャビティ | Khoang | Cavity | 📐 `cavities` | D3 | 金型内の成形空間 |
| 試作金型 | Khuôn thử nghiệm | Prototype Mold | — | D3 | ポケット試作用の仮金型 |
| 量産金型 | Khuôn sản xuất | Production Mold | — | D3 | 量産用の正式な金型 |
| 外注加工 | Gia công ngoài | Outsourced Processing | — | D3 | テフロン加工等の外部委託加工 |
| 金型状態 | Trạng thái khuôn | Mold Status | `mold_physical.status` | D3 | 稼働中、保管中、修理中、廃棄等の状態 |
| 検査表 | Phiếu kiểm tra | Inspection Sheet | — | D5 | トレイ完成後に作成する品質検査用チェックシート |

---

## 4. 生産 / Sản xuất / Production

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| 生産指示書 | Chỉ thị sản xuất | Production Order/Directive | 📐 `production_orders` | D2 | 成形工程への指示書。[指示書作成シート](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/生産指示書)参照 |
| 成形 | Thành hình | Forming/Thermoforming | — | D2 | プラスチックシートを加熱して成形する工程の総称 |
| 真空成形 | Thành hình chân không | Vacuum Forming | — | D2 | 真空吸引で樹脂シートを金型に密着させる方式 |
| 圧空成形 | Thành hình áp khí | Pressure Forming | — | D2 | 圧縮空気でシートを金型に押し付ける方式 |
| 成形機 | Máy thành hình | Forming Machine | 🗃️ `machines` | D7 | 真空/圧空成形機。例: ILLIG（ドイツ製） |
| 段取り | Chuẩn bị máy | Setup/Changeover | — | D2 | 成形機の金型交換・条件設定作業 |
| 条件表 | Bảng điều kiện | Condition Sheet | 📐 `forming_conditions` | D2 | 各製品の成形温度・速度・圧力等の設定値 |
| ショット | Shot | Shot | — | D2 | 成形機の1サイクル動作 |
| ショット数 | Số shot | Shot Count | — | D2 | 生産指示の数量単位。面数×ショット数＝トレイ枚数 |
| 送り | Bước tiến | Feed Length | — | D2 | シート送り長さ (mm) |
| プレス | Ép | Press | — | D2 | プレス加工工程 |
| スタッキング | Xếp chồng | Stacking | — | D2 | 成形品を積み重ねる作業。入数管理に関連 |
| 交互積層 | Xếp xen kẽ | Alternating Stacking | — | D2 | A/Bトレイを交互に積み重ねて納入する特殊梱包方式 |
| 初回サンプル | Mẫu lần đầu | Initial Sample | — | D2 | 新規金型での最初の試作品 (例: IRI-003「25枚(無償)」) |
| 量産 | Sản xuất hàng loạt | Mass Production | ⚙️ `order_type = mass_production` | D2 | 正式な大量生産 |
| 試作 | Thử nghiệm | Prototype/Sample | ⚙️ `order_type = prototype` | D2 | サンプル製造。ポケット試作を含む |
| 入検用サンプル | Mẫu kiểm tra đầu vào | Incoming Inspection Sample | — | D2 | 顧客側の受入検査用に別途準備するサンプル |
| 生産Kanban | Kanban sản xuất | Production Kanban | — | D2 | 成形現場での生産進捗ボード |
| 生産ログ | Nhật ký sản xuất | Production Log | 📐 `production_logs` | D2 | OK/NG数量、停止時間等の日次記録 |
| 立上げ品 | Sản phẩm mới khởi động | Startup Item | — | D2 | 新規生産開始アイテム。立上げが集中すると生産負荷増 |
| SACT | SACT | SACT System | — | D2 | 組立・補助工程システム |

---

## 5. 材料・在庫 / Nguyên vật liệu & Tồn kho / Material & Inventory

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| 材料 | Nguyên vật liệu | Material | 📐 `materials` | D4 | 成形に使用する原材料の総称 |
| プラスチック | Nhựa | Plastic | 🗃️ `plastics` | D4 | 成形用樹脂シート |
| PS | PS | Polystyrene | — | D4 | ポリスチレン樹脂 (例: PS透明1.0mm) |
| PP | PP | Polypropylene | — | D4 | ポリプロピレン樹脂 |
| PET | PET | Polyethylene Terephthalate | — | D4 | PET樹脂 (例: PET緑0.7mm, PET黒0.7mm, PET透明0.6mm) |
| シート厚み | Độ dày tấm | Sheet Thickness | — | D4 | 樹脂シートの厚さ (mm単位: 0.4, 0.5, 0.6, 0.7, 0.8, 1.0) |
| シート幅 | Chiều rộng tấm | Sheet Width | — | D4 | 樹脂シートの幅 (mm単位: 450, 520, 550等) |
| 帯電防止 | Chống tĩnh điện | Antistatic | — | D4 | 静電気防止処理を施したシート |
| 導電印刷 | In dẫn điện | Conductive Print | — | D4 | 導電性インクを印刷したシート (例: レグルス社製) |
| シリコン | Silicon | Silicone | — | D4 | シート表面のシリコン処理。「シリコン無」は未処理 |
| ロール | Cuộn | Roll | — | D4 | 樹脂シートの供給単位 |
| 在庫 | Tồn kho | Inventory | 📐 `inventory` | D4 | 材料・製品の在庫。[材料在庫](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/材料在庫)で日次管理 |
| 入庫 | Nhập kho | Stock In | — | D4 | 材料の受入・在庫追加 |
| 出庫 | Xuất kho | Stock Out | — | D4 | 材料の払出・在庫減少 |
| 棚卸し | Kiểm kê | Stocktaking/Inventory Count | — | D4 | 定期的な実地棚卸し作業 |
| 端数品 | Sản phẩm lẻ | Fractional Items | — | D4 | ロール途中の半端な残材料 |
| 材料在庫表 | Bảng tồn kho nguyên liệu | Material Inventory Sheet | — | D4 | 日次の在庫残高記録。指示書連動型 Excel で管理中 |
| 材料納期 | Hạn giao nguyên liệu | Material Lead Time | — | D4 | 材料調達にかかる日数 (例: PET黒0.7mm導電「1か月」) |
| 先行手配 | Đặt hàng trước | Advance Procurement | — | D4 | 正式注文前に材料を先行発注すること |
| プラスチックBOM | BOM nhựa | Plastic Bill of Materials | 🗃️ `mold_plastic_bom` | D4 | 金型ごとの使用材料定義 |
| RP在庫 | Tồn kho RP | RP Inventory | — | D4 | RP (Recycled Plastic?) の在庫管理 |
| stock_list | Danh sách tồn kho | Stock List | — | D4 | 製品在庫の期末一覧 |

---

## 6. 品質 / Chất lượng / Quality

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| 品質 | Chất lượng | Quality | — | D5 | ISO 9001 に基づく品質管理全般 |
| 検査 | Kiểm tra | Inspection | 📐 `inspections` | D5 | 品質検査の総称 |
| 受入検査 | Kiểm tra đầu vào | Incoming Inspection | — | D5 | 材料受入時の品質確認 |
| 工程内検査 | Kiểm tra trong quy trình | In-Process Inspection | — | D5 | 成形工程中の品質確認 |
| 出荷検査 | Kiểm tra xuất hàng | Shipping Inspection | — | D5 | 出荷前の最終品質確認 |
| 不具合 | Lỗi | Defect/Nonconformance | 📐 `defects` | D5 | 品質基準を満たさない状態 |
| 異常 | Bất thường | Abnormality | — | D5 | 工程上の異常事態 |
| 是正処置 | Hành động khắc phục | Corrective Action | 📐 `corrective_actions` | D5 | 不具合に対する改善措置 |
| 良品 | Sản phẩm đạt | Good Product (OK) | — | D5 | 検査合格品。生産ログのOK数量 |
| 不良品 | Phế phẩm | Defective Product (NG) | — | D5 | 検査不合格品。生産ログのNG数量 |
| NG品 | Hàng NG | Rejected Item | — | D5 | 不良品の略称。[NG品保管場所](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/ISO(2026見直し済み）/NG品　保管場所 掲示用.xlsx)で管理 |
| 品質方針 | Chính sách chất lượng | Quality Policy | — | D5 | ISO 9001 品質方針。最新版は品質環境方針(最新).doc |
| 供給者評価 | Đánh giá nhà cung cấp | Supplier Evaluation | — | D5 | 外部供給者の品質評価。供給者一覧で管理 |
| 内部監査 | Kiểm toán nội bộ | Internal Audit | — | D5 | ISO 内部監査。監査員認定者リストあり |
| OEE | OEE | Overall Equipment Effectiveness | — | D5/D8 | 設備総合効率。レポートドメインで算出 |
| 不良率 | Tỷ lệ phế phẩm | Defect Rate | — | D5/D8 | NG数/総生産数 の比率 |

---

## 7. 保管場所・倉庫 / Vị trí lưu trữ / Location & Storage

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| 棚 | Giá kệ | Rack | 🗃️ `racks` | D7 | 金型・材料・製品の保管棚 |
| 棚段 | Tầng kệ | Rack Layer | 🗃️ `rack_layers` | D7 | 棚の各段 |
| 保管場所 | Vị trí lưu trữ | Storage Location | — | D7 | 棚+段で特定される保管位置 |
| 倉庫 | Kho | Warehouse | — | D7 | 本社工場・青森工場等の倉庫 |
| 本社工場 | Nhà máy chính | Main Factory | — | D7 | 埼玉の本社工場 |
| 青森工場 | Nhà máy Aomori | Aomori Factory | — | D7 | 青森の分工場。材料在庫を別管理 |

---

## 8. 計画 / Kế hoạch / Planning

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| 生産計画 | Kế hoạch sản xuất | Production Plan | 📐 `production_plans` | D6 | 週次/月次の成形スケジュール |
| 納期 | Hạn giao hàng | Delivery Date/Deadline | `orders.due_date` | D1/D6 | 顧客要求の納品期限 (例: 希望納期「5/11(月)」) |
| リードタイム | Thời gian sản xuất | Lead Time | — | D6 | 受注から納品までの所要日数 |
| 納期調整 | Điều chỉnh hạn giao | Delivery Rescheduling | — | D6 | 生産状況に応じた納期の前倒し/後ろ倒し |
| 成形工程 | Quy trình thành hình | Forming Process | — | D6 | 生産計画上のボトルネックとなりやすい工程 |
| 前受け表 | Bảng đơn hàng tương lai | Advance Order List | — | D6 | 将来の受注予定一覧 |
| 収支 | Thu chi | Revenue/Expense | — | D6/D8 | 成形・金型・紙器部門の損益管理 |

---

## 9. 人・組織 / Nhân sự & Tổ chức / People & Organization

| 日本語 | Tiếng Việt | English | DB Table/Column | Domain | Description |
|:---|:---|:---|:---|:---:|:---|
| 従業員 | Nhân viên | Employee | 📐 `employees` | D7 | 社内の全従業員。[従業員名簿](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/ISO(2026見直し済み）/従業員名簿2026.1.xls)参照 |
| 作業者 | Công nhân | Operator | — | D7 | 成形機を操作する現場作業者 |
| 営業 | Kinh doanh | Sales | — | D7 | 受注・見積・顧客対応を行う部門/担当者 (例: 小林さん) |
| 設計者 | Kỹ sư thiết kế | Designer/Engineer | — | D7 | 金型・トレイの設計担当 (例: クアンさん) |
| 業務 | Nghiệp vụ | Administration/Operations | — | D7 | 生産指示・出荷手配等の業務管理者 (例: 新井さん, 桜井さん) |
| 部門 | Bộ phận | Department | 📐 `departments` | D7 | 営業部、設計部、成形部、業務部等 |
| 派遣社員 | Nhân viên phái cử | Temporary Staff | — | D7 | 派遣社員。品質方針の周知対象 |
| 組織図 | Sơ đồ tổ chức | Organization Chart | — | D7 | [組織図](file:///d:/AntiGravity_Workspace/apps/ysdms-nextgen/source_data/ISO(2026見直し済み）/組織図)参照 |
| 責任分担表 | Bảng phân công trách nhiệm | Responsibility Matrix | — | D7 | 職務別の責任範囲定義 |

---

## 10. ISO・管理体系 / ISO & Hệ thống quản lý / ISO & Management System

| 日本語 | Tiếng Việt | English | Domain | Description |
|:---|:---|:---|:---:|:---|
| マネジメントシステム | Hệ thống quản lý | Management System | D5/D7 | ISO 9001 + ISO 14001 統合管理体系 |
| 品質環境方針 | Chính sách chất lượng & môi trường | Quality & Environmental Policy | D5 | 品質・環境の統合方針 |
| 文書管理 | Quản lý tài liệu | Document Control | D7 | ISO文書の発行・改訂・廃止管理 |
| 記録管理 | Quản lý hồ sơ | Records Management | D7 | 品質記録の保管・保持管理 |
| 年度教育訓練 | Đào tạo hàng năm | Annual Training | D7 | 従業員の年間教育計画 |
| 設計・開発フロー | Quy trình thiết kế & phát triển | Design & Development Flow | D3 | ISO要求に基づく設計開発フローチャート |
| 設備一覧表 | Danh sách thiết bị | Equipment List | D7 | 保有設備の管理台帳 |
| 順守評価 | Đánh giá tuân thủ | Compliance Evaluation | D5 | 法規制・環境規定の順守状況評価 |

---

## 11. 梱包・物流 / Đóng gói & Vận chuyển / Packaging & Logistics

| 日本語 | Tiếng Việt | English | Domain | Description |
|:---|:---|:---|:---:|:---|
| 入数 | Số lượng/hộp | Quantity per Box | D1/D2 | 1箱あたりの収容枚数 (例: 200枚/箱, 240枚/箱) |
| 箱 | Hộp | Box/Carton | D1 | 段ボール箱。専用箱の場合はフルートの指定あり |
| フルート | Sóng carton | Flute (Corrugated) | D1 | 段ボールの波形タイプ (A, B, C, E等) |
| パレット | Pallet | Pallet | D1 | 樹脂パレ (木パレNG先あり)。最大5パレ/日集荷 |
| チャーター便 | Chuyến xe thuê | Charter Truck | D1 | 5パレ超の場合に必要な専用便 |
| 運賃 | Phí vận chuyển | Freight/Shipping Cost | D1 | 輸送費用 |
| 同梱 | Gửi chung | Consolidated Shipment | D1 | 複数品目をまとめて出荷 (例: CHG-002とCHG-003を同梱) |
| 持ち込み | Giao trực tiếp | Direct Delivery | D1 | 営業担当が直接顧客に持ち込む配送方式 |

---

## 12. システム用語 / Thuật ngữ hệ thống / System Terms

| 日本語 | Tiếng Việt | English | Description |
|:---|:---|:---|:---|
| Product-Centric | Lấy sản phẩm làm trung tâm | Product-Centric | 製品(トレイ)を起点とするシステム設計思想 |
| Mold-Centric | Lấy khuôn làm trung tâm | Mold-Centric | 旧システムの設計思想 (非推奨) |
| 1トラム (Cửa 1 trạm) | Cửa 1 trạm | One-Stop Form | 関連情報をまとめて入力できる統合フォーム |
| Supabase | Supabase | Supabase | バックエンドプラットフォーム (PostgreSQL + Auth + Storage) |
| QR Scan | Quét QR | QR Scan | 棚位置・金型識別用のQRコードスキャン |
| AR Locator | Định vị AR | AR Locator | 拡張現実による棚位置案内ツール |

---

> [!NOTE]
> **メンテナンス方針:** 新しいドメイン分析文書 (BRD) を作成する度に、この用語集に新規用語を追加してください。
> 各ドメインフォルダ (`D1_受注管理_Order/` 等) 内のBRDからは、この文書をリンク参照してください。
> 
> **Chính sách bảo trì:** Mỗi khi tạo tài liệu BRD mới, hãy bổ sung thuật ngữ mới vào bảng này.
