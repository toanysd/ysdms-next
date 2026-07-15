# SPEC: Module Chỉ thị Sản xuất (生産指示書)
## BP-32 — Production Instruction Module

> **Viết bởi:** PE (Perplexity) — 2026-07-15  
> **Dựa trên:** `docs/02_BUSINESS_PROCESS_CATALOG.md`, `docs/AN_deep_scan_part2.md`  
> **Status:** ✅ APPROVED — Anh Thoan đã duyệt 2026-07-15  
> **AN implement sau khi:** V5 Seed đã chạy xong (phụ thuộc key mới)

---

## QUYẾT ĐỊNH ĐÃ CONFIRMED (2026-07-15)

| # | Câu hỏi | Quyết định | Lý do |
|---|---------|-----------|-------|
| Q1 | PDF library | **`@react-pdf/renderer`** | Đã dùng cho Quotation PDF, hỗ trợ font CJK (NotoSansJP), viết JSX quen thuộc. Puppeteer cần server riêng → phức tạp hóa deploy Vercel |
| Q2 | Delivery sites seed | **Import ngay khi migration** | File `納入先一覧表.xlsx` có sẵn 1,864 dòng — nhập thủ công không khả thi. AN viết script seed từ Excel → insert Supabase |
| Q3 | Liên động tồn kho | **Sprint 1: chỉ cảnh báo ⚠️** | Module tồn kho nhựa (BP-42~47) chưa xây dựng → không có gì để trừ. Sprint 2 mới trừ kho tự động |
| Q4 | Gia công ngoài (外注) | **Sprint 2** | Sprint 1 tập trung luồng chính: 成形 (thành hình). Gia công ngoài là nhánh phụ |

---

## 1. MỤC TIÊU MODULE

Thay thế hoàn toàn file Excel VBA `C. 指示書作成シート(成形）.xlsx` hiện tại, vốn:
- Là 1 file Excel 7,094 dòng × 110 cột tra bảng bằng VBA lookup
- Liên động với file tồn kho `材料在庫.xlsx` (482 file snapshot hàng ngày)
- Có 5 template riêng theo khách hàng: HAE, NLC, SMK, YAE, General

**Kết quả mong đợi:** Nhân viên nhập mã tray + số lượng + nơi giao → hệ thống tự động tổng hợp thông tin và tạo chỉ thị sản xuất in được.

**Sprint 1 scope:** Chỉ loại `FORMING` (成形). Loại `OUTSOURCE` (外注) để Sprint 2.

---

## 2. LUỒNG NGHIỆP VỤ

```
Nhận PO từ KH (order đã có trong DB)
    ↓
Nhân viên vào "Tạo Chỉ thị SX mới"
    ↓
[A] Chọn Order → hệ thống tự điền: KH, Mã tray, Sản phẩm
    ↓
[B] Chọn nơi giao (searchable dropdown từ delivery_sites — 1,864 địa chỉ)
    ↓
[C] Nhập số lượng + ngày giao yêu cầu
    ↓
[D] Hệ thống kiểm tra tồn kho vật liệu (material_inventory)
    → Đủ: ✅ tạo chỉ thị bình thường
    → Thiếu hoặc không có dữ liệu: ⚠️ badge cảnh báo, vẫn cho phép tạo
    ↓
[E] Tạo chỉ thị → sinh Số hiệu (伝票No.) tự động
    ↓
[F] In PDF bằng @react-pdf/renderer theo template KH tương ứng
    ↓
[G] Trạng thái: DRAFT → ISSUED → IN_PRODUCTION → COMPLETED
```

**Ghi chú bước [D]:** Sprint 1 chỉ hiển thị cảnh báo — KHÔNG tự động trừ kho. Trừ kho tự động sẽ triển khai ở Sprint 2 sau khi có Module BP-42~47.

---

## 3. DATABASE SCHEMA

### 3.1 Bảng chính: `production_instructions`

```sql
CREATE TABLE production_instructions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_no        TEXT UNIQUE NOT NULL,  -- 伝票No. tự sinh: "PI-2026-001234"
  order_id              UUID REFERENCES orders(id),
  product_id            UUID REFERENCES products(id),
  physical_mold_id      UUID REFERENCES physical_molds(id),

  -- Thông tin sản xuất
  -- Sprint 1: chỉ dùng 'FORMING'. 'OUTSOURCE' để Sprint 2
  instruction_type      TEXT NOT NULL DEFAULT 'FORMING'
                          CHECK (instruction_type IN ('FORMING', 'OUTSOURCE')),
  production_site       TEXT,  -- 本社 / 青森 / 茨城 / 坂田
  quantity_ordered      INTEGER NOT NULL,
  quantity_per_stack    INTEGER,  -- 入数

  -- Vật liệu (tự điền từ products table)
  material_spec         TEXT,     -- VD: PS(N)0.58t×640×350m
  material_thickness    NUMERIC(4,2),
  material_width        INTEGER,
  antistatic            BOOLEAN DEFAULT false,
  silicon               BOOLEAN DEFAULT false,
  surface_coating       BOOLEAN DEFAULT false,
  recycled_pct          NUMERIC(5,2) DEFAULT 0,

  -- Giao hàng
  delivery_site_id      UUID REFERENCES delivery_sites(id),
  requested_date        DATE NOT NULL,
  lot_no                TEXT,

  -- Template
  template_type         TEXT NOT NULL
                          CHECK (template_type IN ('HAE','NLC','SMK','YAE','GENERAL')),
  has_label             BOOLEAN DEFAULT false,  -- ラベル
  is_first_time         BOOLEAN DEFAULT false,  -- 初回

  -- Cảnh báo tồn kho (Sprint 1: chỉ lưu trạng thái cảnh báo, KHÔNG trừ kho)
  material_stock_warning BOOLEAN DEFAULT false,  -- true = đã cảnh báo thiếu khi tạo
  material_stock_qty     INTEGER,  -- Tồn kho tại thời điểm tạo (snapshot)

  -- Trạng thái
  status                TEXT NOT NULL DEFAULT 'DRAFT'
                          CHECK (status IN ('DRAFT','ISSUED','IN_PRODUCTION','COMPLETED','CANCELLED')),
  issued_at             TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  notes                 TEXT,

  created_by            UUID REFERENCES auth.users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Bảng địa chỉ giao hàng: `delivery_sites`

```sql
CREATE TABLE delivery_sites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_code       TEXT UNIQUE NOT NULL,  -- VD: '11', 'A3C', '888', '999'
  company_id      UUID REFERENCES companies(id),
  site_name       TEXT NOT NULL,          -- VD: 'ＳＭＫ（株）ひたち'
  address         TEXT,
  requester_name  TEXT,    -- 依頼元
  contact_person  TEXT,    -- サブ担当者
  phone           TEXT,
  fax             TEXT,
  is_placeholder  BOOLEAN DEFAULT false,  -- true khi code = '888' hoặc '999'
  notes           TEXT,
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

**Seed data ngay khi migration:** AN viết script đọc `source_data/生産指示書/A. 納入先一覧表.xlsx` (1,864 dòng) → insert vào `delivery_sites`.

### 3.3 Trigger `updated_at`

```sql
CREATE TRIGGER set_updated_at_production_instructions
  BEFORE UPDATE ON production_instructions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
```

---

## 4. API ROUTES (Next.js App Router)

```
app/
  production-instructions/
    page.tsx              → Danh sách (filter: status, KH, ngày, nơi SX)
    new/page.tsx          → Form tạo mới (3 bước)
    [id]/
      page.tsx            → Chi tiết + nút in PDF
      edit/page.tsx       → Chỉnh sửa (chỉ khi status = DRAFT)

app/api/production-instructions/
  route.ts                → GET (list), POST (create)
  [id]/route.ts           → GET, PATCH, DELETE
  [id]/issue/route.ts     → POST → DRAFT → ISSUED
  [id]/complete/route.ts  → POST → IN_PRODUCTION → COMPLETED
  [id]/pdf/route.ts       → GET → trả về PDF buffer (dùng @react-pdf/renderer)
```

---

## 5. GIAO DIỆN (UI)

### 5.1 Trang danh sách `/production-instructions`

| Cột | Ghi chú |
|---|---|
| Số hiệu (伝票No.) | Link đến chi tiết |
| Mã tray | |
| Khách hàng | |
| Số lượng | |
| Nơi SX | 本社/青森/茨城/坂田 |
| Ngày giao | |
| Trạng thái | Badge: DRAFT (xám) / ISSUED (xanh) / IN_PRODUCTION (cam) / COMPLETED (xanh lá) |
| Thao tác | Xem / In PDF / Huỷ |

**Filter:** Theo KH, theo trạng thái, theo khoảng ngày, theo nơi SX

### 5.2 Form tạo mới — 3 bước

**Bước 1 — Chọn Đơn hàng:**
- Tìm theo mã đơn hàng hoặc mã tray
- Khi chọn → tự điền: KH, Mã tray, Tên SP, Vật liệu từ `products`
- Tự động chọn template (xem mục 6.1)

**Bước 2 — Thông tin sản xuất:**
- Nơi sản xuất (dropdown): 本社 / 青森 / 茨城 / 坂田
- Số lượng (number input)
- Ngày giao yêu cầu (date picker)
- Nơi giao hàng (searchable dropdown từ `delivery_sites`)
- Checkbox: Lần đầu (初回), Cần dán nhãn (ラベル)

**Bước 3 — Xác nhận vật liệu:**
- Hiển thị: Tên vật liệu, Độ dày, Chiều rộng, Tính năng đặc biệt
- ⚠️ Badge cảnh báo nếu `material_inventory` tại nơi SX < số lượng cần — **KHÔNG chặn tạo**
- Ghi chú bổ sung
- Nút: `Lưu nháp (DRAFT)` | `Phát hành ngay (ISSUED)`

### 5.3 Chi tiết `/production-instructions/[id]`

- Hiển thị đầy đủ thông tin
- Nút **In PDF** → `/api/.../pdf`
- Timeline trạng thái (stepper)
- Nếu có `material_stock_warning = true` → hiển thị banner ⚠️ "Đã phát hành khi thiếu vật liệu"

---

## 6. LOGIC ĐẶC BIỆT

### 6.1 Tự động chọn Template theo Khách hàng

```typescript
const COMPANY_TEMPLATE_MAP: Record<string, TemplateType> = {
  'HAE': 'HAE',  // 日本航空電子系
  'JAE': 'HAE',  // Cùng nhóm HAE
  'NLC': 'NLC',  // ニッコー・ロジスティクス
  'SMK': 'SMK',  // SMK株式会社
  'YAE': 'YAE',  // 山形航空電子
  // default → 'GENERAL'
};
```

### 6.2 Sinh Số hiệu tự động

```typescript
// Format: PI-YYYY-NNNNNN
const generateInstructionNo = async (supabase: SupabaseClient): Promise<string> => {
  const year = new Date().getFullYear();
  const { count } = await supabase
    .from('production_instructions')
    .select('*', { count: 'exact', head: true })
    .like('instruction_no', `PI-${year}-%`);
  const seq = String((count ?? 0) + 1).padStart(6, '0');
  return `PI-${year}-${seq}`;
};
```

### 6.3 Kiểm tra tồn kho (Sprint 1: chỉ cảnh báo)

```typescript
// Lấy snapshot tồn kho mới nhất — KHÔNG trừ, KHÔNG block
const checkMaterialStock = async (
  materialSpec: string,
  productionSite: string,
  quantityNeeded: number
): Promise<{ sufficient: boolean; currentStock: number }> => {
  const { data } = await supabase
    .from('material_inventory')
    .select('quantity')
    .eq('material_spec', materialSpec)
    .eq('factory', productionSite)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  const currentStock = data?.quantity ?? 0;
  return {
    sufficient: currentStock >= quantityNeeded,
    currentStock
  };
};
// Sprint 2: thêm logic trừ kho khi status chuyển sang ISSUED
```

---

## 7. PDF TEMPLATE (`@react-pdf/renderer`)

**Font:** NotoSansJP (đã dùng cho Quotation PDF — tái sử dụng font registration hiện có)

Mỗi template in ra 1 tờ A4:

| Vùng | Nội dung |
|---|---|
| Header | Logo YSD + Tiêu đề + Số hiệu (伝票No.) + Ngày phát hành |
| Thông tin KH | Tên KH, địa chỉ giao, người liên hệ (từ `delivery_sites`) |
| Thông tin sản phẩm | Mã tray, Tên SP, Mã bản vẽ KH |
| Vật liệu | Tên, Độ dày, Chiều rộng, Tính năng, % tái chế |
| Số lượng | Số lượng + Số/chồng (入数) |
| Kích thước | Dài × Rộng, Dung sai (+/-) |
| Nơi SX | 本社 / 青森 / 茨城 / 坂田 |
| Ngày giao | |
| LOT No. | |
| Ghi chú | Cờ 初回, cờ ラベル, ghi chú tự do |
| Footer | Ô ký duyệt: 担当 / 確認 / 承認 |

**Thứ tự implement template:**
1. GENERAL (trước — đơn giản nhất, dùng để test)
2. SMK (phức tạp nhất — nhiều trường riêng)
3. HAE / YAE / NLC (tương tự nhau)

---

## 8. RLS POLICIES

```sql
ALTER TABLE production_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PI: authenticated read"
  ON production_instructions FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "PI: authenticated insert"
  ON production_instructions FOR INSERT
  TO authenticated WITH CHECK (status = 'DRAFT');

CREATE POLICY "PI: update draft or issued"
  ON production_instructions FOR UPDATE
  TO authenticated
  USING (status IN ('DRAFT', 'ISSUED'))
  WITH CHECK (true);

CREATE POLICY "DS: authenticated read"
  ON delivery_sites FOR SELECT TO authenticated USING (true);

CREATE POLICY "DS: authenticated insert"
  ON delivery_sites FOR INSERT TO authenticated WITH CHECK (true);
```

---

## 9. MIGRATION & SEED

**Tên migration:** `create_production_instructions`

**Thứ tự thực hiện:**
1. `CREATE TABLE delivery_sites`
2. `CREATE TABLE production_instructions`
3. `CREATE TRIGGER set_updated_at_production_instructions`
4. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` + `CREATE POLICY ...` (cả 2 bảng)
5. **Seed delivery_sites:** AN viết script Python/TS đọc `source_data/生産指示書/A. 納入先一覧表.xlsx` → parse 1,864 dòng → batch insert vào `delivery_sites`

**Lưu ý seed:**
- `site_code = '888'` hoặc `'999'` → set `is_placeholder = true`
- Deduplicate theo `site_code` trước khi insert
- Chạy seed script **sau** migration (không phải trong migration SQL)

---

## 10. TIÊU CHÍ HOÀN THÀNH Sprint 1 (Definition of Done)

- [ ] Migration chạy thành công
- [ ] `delivery_sites` có đủ 1,864 dòng từ seed script
- [ ] Tạo được chỉ thị SX từ 1 order có sẵn trong DB
- [ ] Số hiệu tự sinh đúng format `PI-2026-NNNNNN`
- [ ] Dropdown nơi giao hàng searchable, load từ `delivery_sites`
- [ ] Tự động chọn đúng template theo KH
- [ ] Badge ⚠️ cảnh báo thiếu vật liệu hiển thị đúng (không block tạo)
- [ ] In được PDF template GENERAL với font NotoSansJP
- [ ] RLS: unauthenticated user không xem được
- [ ] AN cập nhật `PROJECT_STATUS.md` sau khi done

**Để Sprint 2:**
- Template OUTSOURCE (外注)
- Trừ kho tự động khi ISSUED
- Template PDF: SMK, HAE, YAE, NLC (chỉ cần GENERAL cho Sprint 1)

---

*Spec viết bởi PE (Perplexity) — 2026-07-15 | Approved bởi Anh Thoan — 2026-07-15*  
*Nguồn: `docs/02_BUSINESS_PROCESS_CATALOG.md` (v1.1), `docs/AN_deep_scan_part2.md`*
