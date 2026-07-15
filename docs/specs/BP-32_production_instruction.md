# SPEC: Module Chỉ thị Sản xuất (生産指示書)
## BP-32 — Production Instruction Module

> **Viết bởi:** PE (Perplexity) — 2026-07-15  
> **Dựa trên:** `docs/02_BUSINESS_PROCESS_CATALOG.md`, `docs/AN_deep_scan_part2.md`  
> **Status:** 📝 Draft — chờ Anh Thoan duyệt  
> **AN implement sau khi:** Anh Thoan confirm spec này + V5 Seed đã chạy xong

---

## 1. MỤC TIÊU MODULE

Thay thế hoàn toàn file Excel VBA `C. 指示書作成シート(成形）.xlsx` hiện tại, vốn:
- Là 1 file Excel 7,094 dòng × 110 cột tra bảng bằng VBA lookup
- Liên động với file tồn kho `材料在庫.xlsx` (482 file snapshot hàng ngày)
- Có 5 template riêng theo khách hàng: HAE, NLC, SMK, YAE, General

**Kết quả mong đợi:** Nhân viên nhập mã tray + số lượng + nơi giao → hệ thống tự động tổng hợp thông tin và tạo chỉ thị sản xuất in được.

---

## 2. LUỒNG NGHIỆP VỤ

```
Nhận PO từ KH (order đã có trong DB)
    ↓
Nhân viên vào "Tạo Chỉ thị SX mới"
    ↓
[A] Chọn Order → hệ thống tự điền: KH, Mã tray, Sản phẩm
    ↓
[B] Chọn nơi giao (từ danh sách 1,864 địa chỉ)
    ↓
[C] Nhập số lượng + ngày giao yêu cầu
    ↓
[D] Hệ thống kiểm tra tồn kho vật liệu (material_inventory)
    → Đủ: ✅ tạo chỉ thị
    → Thiếu: ⚠️ cảnh báo thiếu vật liệu
    ↓
[E] Tạo chỉ thị → sinh Số hiệu (伝票No.) tự động
    ↓
[F] In PDF theo template KH tương ứng
    ↓
[G] Trạng thái: DRAFT → ISSUED → IN_PRODUCTION → COMPLETED
```

---

## 3. DATABASE SCHEMA

### 3.1 Bảng chính: `production_instructions`

```sql
CREATE TABLE production_instructions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instruction_no        TEXT UNIQUE NOT NULL,  -- 伝票No. tự sinh, VD: "PI-2026-001234"
  order_id              UUID REFERENCES orders(id),
  product_id            UUID REFERENCES products(id),      -- Mã tray
  physical_mold_id      UUID REFERENCES physical_molds(id), -- Khuôn đang dùng

  -- Thông tin sản xuất
  instruction_type      TEXT NOT NULL CHECK (instruction_type IN ('FORMING', 'OUTSOURCE')), -- 成形 or 外注
  production_site       TEXT,            -- 本社 / 青森 / 茨城 / 坂田 / 坂田精文堂 / 青森成形
  quantity_ordered      INTEGER NOT NULL, -- Số lượng yêu cầu
  quantity_per_stack    INTEGER,          -- 入数 (số/chồng)

  -- Vật liệu
  material_spec         TEXT,            -- PS(N)0.58t×640×350m
  material_thickness    NUMERIC(4,2),    -- 厚み (mm)
  material_width        INTEGER,         -- シート巾 (mm)
  antistatic            BOOLEAN DEFAULT false,  -- 帯電防止
  silicon               BOOLEAN DEFAULT false,  -- シリコン
  surface_coating       BOOLEAN DEFAULT false,  -- 塗布
  recycled_pct          NUMERIC(5,2) DEFAULT 0, -- 粉砕材含有率 (%)

  -- Giao hàng
  delivery_site_id      UUID REFERENCES delivery_sites(id),
  requested_date        DATE NOT NULL,   -- Ngày giao yêu cầu
  lot_no                TEXT,            -- LOT No.

  -- Template / Format
  template_type         TEXT NOT NULL CHECK (template_type IN
                          ('HAE', 'NLC', 'SMK', 'YAE', 'GENERAL')), -- Template theo KH
  has_label             BOOLEAN DEFAULT false,   -- Cần dán nhãn (ラベル)
  is_first_time         BOOLEAN DEFAULT false,   -- 初回 (lần đầu SX)

  -- Trạng thái
  status                TEXT NOT NULL DEFAULT 'DRAFT'
                          CHECK (status IN ('DRAFT','ISSUED','IN_PRODUCTION','COMPLETED','CANCELLED')),
  issued_at             TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  notes                 TEXT,

  -- Metadata
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
  requester_name  TEXT,                   -- 依頼元
  contact_person  TEXT,                   -- サブ担当者
  phone           TEXT,
  fax             TEXT,
  is_placeholder  BOOLEAN DEFAULT false,  -- true khi code là 888 hoặc 999
  notes           TEXT,
  active          BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Trigger tự động cập nhật `updated_at`

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
    page.tsx                   → Danh sách chỉ thị SX (filter theo status, KH, ngày)
    new/
      page.tsx                 → Form tạo mới
    [id]/
      page.tsx                 → Chi tiết + in PDF
      edit/page.tsx            → Chỉnh sửa (chỉ khi status = DRAFT)

app/api/
  production-instructions/
    route.ts                   → GET (list), POST (create)
    [id]/route.ts              → GET, PATCH, DELETE
    [id]/issue/route.ts        → POST → chuyển DRAFT → ISSUED
    [id]/complete/route.ts     → POST → chuyển IN_PRODUCTION → COMPLETED
    [id]/pdf/route.ts          → GET → trả về PDF buffer
```

---

## 5. GIAO DIỆN (UI)

### 5.1 Trang danh sách `/production-instructions`

| Cột hiển thị | Ghi chú |
|---|---|
| Số hiệu (伝票No.) | Link đến chi tiết |
| Mã tray | |
| Khách hàng | |
| Số lượng | |
| Nơi SX | 本社/青森/茨城/坂田 |
| Ngày giao | |
| Trạng thái | Badge màu: DRAFT/ISSUED/IN_PRODUCTION/COMPLETED |
| Thao tác | Xem / In PDF / Huỷ |

**Filter:** Theo KH, theo trạng thái, theo khoảng ngày, theo nơi SX

### 5.2 Form tạo mới `/production-instructions/new`

**Bước 1 — Chọn Đơn hàng:**
- Tìm kiếm theo mã đơn hàng hoặc mã tray
- Khi chọn → tự động điền: Khách hàng, Mã tray, Tên sản phẩm, Vật liệu từ `products` table
- Tự động chọn template (HAE/NLC/SMK/YAE/GENERAL) theo `company_id`

**Bước 2 — Thông tin sản xuất:**
- Nơi sản xuất (dropdown): 本社 / 青森 / 茨城 / 坂田 / Gia công ngoài
- Số lượng (number input)
- Ngày giao yêu cầu (date picker)
- Nơi giao hàng (searchable dropdown từ `delivery_sites`)
- Checkbox: Lần đầu (初回), Cần dán nhãn (ラベル)

**Bước 3 — Xác nhận vật liệu:**
- Hiển thị: Tên vật liệu, Độ dày, Chiều rộng, Tính năng đặc biệt
- ⚠️ Cảnh báo nếu tồn kho vật liệu tại nơi SX chọn < số lượng cần
- Ghi chú bổ sung

**Nút:** `Lưu nháp (DRAFT)` | `Phát hành ngay (ISSUED)`

### 5.3 Chi tiết & In PDF `/production-instructions/[id]`

- Hiển thị đầy đủ thông tin chỉ thị
- **Nút In PDF** → gọi `/api/production-instructions/[id]/pdf`
- PDF render theo template tương ứng (5 template)
- Timeline trạng thái: DRAFT → ISSUED → IN_PRODUCTION → COMPLETED

---

## 6. LOGIC ĐẶC BIỆT

### 6.1 Tự động chọn Template theo Khách hàng

```typescript
// Mapping company → template type
const COMPANY_TEMPLATE_MAP: Record<string, TemplateType> = {
  'HAE': 'HAE',   // 日本航空電子系
  'JAE': 'HAE',   // Cùng nhóm với HAE
  'NLC': 'NLC',   // ニッコー・ロジスティクス
  'SMK': 'SMK',   // SMK株式会社
  'YAE': 'YAE',   // 山形航空電子
  // Mặc định → GENERAL
};
```

### 6.2 Sinh Số hiệu tự động

```typescript
// Format: PI-YYYY-NNNNNN (6 chữ số, tự tăng)
// Ví dụ: PI-2026-000001, PI-2026-000002...
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

### 6.3 Kiểm tra tồn kho vật liệu

```typescript
// Truy vấn bản ghi tồn kho mới nhất cho vật liệu + nhà máy
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
  return { sufficient: currentStock >= quantityNeeded, currentStock };
};
```

---

## 7. PDF TEMPLATE

Mỗi template in ra 1 tờ A4 gồm:

| Vùng | Nội dung |
|---|---|
| Header | Logo YSD + Tiêu đề + Số hiệu (伝票No.) + Ngày phát hành |
| Thông tin KH | Tên KH, địa chỉ giao, người liên hệ |
| Thông tin sản phẩm | Mã tray, Tên SP, Mã bản vẽ KH |
| Vật liệu | Tên, Độ dày, Chiều rộng, Tính năng đặc biệt, % tái chế |
| Số lượng | Số lượng, Số/chồng (入数) |
| Kích thước | Dài × Rộng, Dung sai (+/-) |
| Nơi SX | 本社 / 青森 / 茨城 / 坂田 |
| Ngày giao | |
| LOT No. | |
| Ghi chú | Cờ 初回, cờ ラベル, ghi chú tự do |
| Footer | Ô ký duyệt (担当 / 確認 / 承認) |

**Thư viện PDF đề xuất:** `@react-pdf/renderer` (đang dùng trong dự án nếu có) hoặc `puppeteer` render HTML→PDF

---

## 8. RLS POLICIES

```sql
-- Tất cả authenticated users được đọc
CREATE POLICY "PI: authenticated read"
  ON production_instructions FOR SELECT
  TO authenticated USING (true);

-- Chỉ tạo được khi DRAFT
CREATE POLICY "PI: authenticated insert"
  ON production_instructions FOR INSERT
  TO authenticated WITH CHECK (status = 'DRAFT');

-- Chỉ update khi DRAFT hoặc ISSUED
CREATE POLICY "PI: update draft or issued"
  ON production_instructions FOR UPDATE
  TO authenticated
  USING (status IN ('DRAFT', 'ISSUED'))
  WITH CHECK (true);

-- Tương tự cho delivery_sites
CREATE POLICY "DS: authenticated read"
  ON delivery_sites FOR SELECT TO authenticated USING (true);
```

---

## 9. MIGRATION

**Tên migration:** `create_production_instructions`

**Thứ tự:**
1. `CREATE TABLE delivery_sites` (không phụ thuộc)
2. `CREATE TABLE production_instructions` (phụ thuộc `delivery_sites`, `orders`, `products`, `physical_molds`)
3. Thêm trigger `updated_at`
4. Thêm RLS policies
5. **Seed data:** Import `A. 納入先一覧表.xlsx` (1,864 dòng) vào `delivery_sites`

---

## 10. TIÊU CHÍ HOÀN THÀNH (Definition of Done)

- [ ] Migration chạy thành công trên Supabase
- [ ] Tạo được chỉ thị SX từ 1 order có sẵn trong DB
- [ ] Số hiệu tự sinh đúng format `PI-2026-NNNNNN`
- [ ] Dropdown nơi giao hàng load được danh sách từ `delivery_sites`
- [ ] Cảnh báo thiếu vật liệu hoạt động
- [ ] In được PDF (ít nhất template GENERAL trước)
- [ ] RLS: user không đăng nhập không xem được
- [ ] AN cập nhật `PROJECT_STATUS.md` sau khi hoàn thành

---

## 11. CÂU HỎI CHỜ XÁC NHẬN TỪ ANH THOAN

1. **Template PDF:** Dùng thư viện nào? `@react-pdf/renderer` hay `puppeteer`? Hay đã có pattern trong dự án?
2. **Delivery sites:** Import ngay lúc migration hay để nhập thủ công sau?
3. **Liên động tồn kho:** Sprint 1 chỉ cần cảnh báo, hay phải trừ tồn kho ngay khi phát hành chỉ thị?
4. **Outsource (外注):** Sprint 1 có cần template gia công ngoài không, hay chỉ làm 成形 (thành hình) trước?

---

*Spec viết bởi PE (Perplexity) — 2026-07-15*  
*Nguồn tham khảo: `docs/02_BUSINESS_PROCESS_CATALOG.md` (v1.1), `docs/AN_deep_scan_part2.md`*
