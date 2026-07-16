-- =============================================================
-- SEED: Demo data cho luồng Shipments (UI test + PDF export)
-- Ngày: 2026-07-16
-- Phạm vi: companies, company_contacts, delivery_sites,
--          production_orders, order_lines, production_lots,
--          shipments, shipment_lots, delivery_notes
-- Lưu ý: Dùng ON CONFLICT DO NOTHING để chạy lại an toàn.
-- =============================================================

-- ─────────────────────────────────────────────
-- 1. COMPANIES (khách hàng + công ty YSD)
-- ─────────────────────────────────────────────
INSERT INTO companies (company_id, company_code, company_name, company_name_romaji, company_type, address, tel, fax, is_active)
VALUES
  -- Khách hàng Nhật
  ('11111111-0001-0001-0001-000000000001', 'KYOCERA', '京セラ株式会社', 'Kyocera Corporation',
   ARRAY['customer'], '〒612-8501 京都府京都市伏見区竹田鳥羽殿町6番地', '075-604-3500', '075-604-3501', true),

  ('11111111-0002-0002-0002-000000000002', 'MURATA', '株式会社村田製作所', 'Murata Manufacturing Co., Ltd.',
   ARRAY['customer'], '〒617-8555 京都府長岡京市東神足1丁目10番1号', '075-955-6789', '075-955-6790', true),

  -- Công ty YSD (nội bộ - shipper)
  ('11111111-0099-0099-0099-000000000099', 'YSD', 'YSD株式会社', 'YSD Co., Ltd.',
   ARRAY['internal', 'supplier'], 'Bình Dương, Vietnam', '+84-274-000-0001', NULL, true)
ON CONFLICT (company_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 2. COMPANY CONTACTS
-- ─────────────────────────────────────────────
INSERT INTO company_contacts (contact_id, company_id, contact_name, contact_role, contact_tel, contact_email, department, is_primary)
VALUES
  ('22222222-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001',
   '田中 健一', '購買担当', '075-604-3500', 'tanaka.k@kyocera.co.jp', '購買部', true),

  ('22222222-0002-0002-0002-000000000002', '11111111-0002-0002-0002-000000000002',
   '山田 花子', '品質保証', '075-955-6789', 'yamada.h@murata.co.jp', '品質保証部', true)
ON CONFLICT (contact_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 3. DELIVERY SITES (địa điểm nhận hàng)
-- ─────────────────────────────────────────────
INSERT INTO delivery_sites (site_id, company_id, site_code, site_name, site_address, contact_person, site_tel, is_active)
VALUES
  ('33333333-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001',
   'KYOCERA-KYO', '京セラ 京都本社', '〒612-8501 京都市伏見区竹田鳥羽殿町6', '田中 健一', '075-604-3500', true),

  ('33333333-0002-0002-0002-000000000002', '11111111-0002-0002-0002-000000000002',
   'MURATA-NGK', '村田製作所 長岡京倉庫', '〒617-8555 長岡京市東神足1-10-1', '山田 花子', '075-955-6789', true)
ON CONFLICT (site_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 4. PRODUCTS (khay nhựa mẫu)
-- ─────────────────────────────────────────────
INSERT INTO products (product_id, product_code, product_name, company_id, is_active)
VALUES
  ('44444444-0001-0001-0001-000000000001', 'TRAY-KYO-A1', 'Khay IC Kyocera Type-A1', '11111111-0001-0001-0001-000000000001', true),
  ('44444444-0002-0002-0002-000000000002', 'TRAY-MUR-B2', 'Khay linh kiện Murata B2', '11111111-0002-0002-0002-000000000002', true),
  ('44444444-0003-0003-0003-000000000003', 'TRAY-KYO-C3', 'Khay Kyocera Series-C3', '11111111-0001-0001-0001-000000000001', true)
ON CONFLICT (product_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 5. PRODUCTION ORDERS (đơn hàng sản xuất)
-- ─────────────────────────────────────────────
INSERT INTO production_orders (
  po_id, po_code, company_id, status, order_date, delivery_date, notes
)
VALUES
  -- PO-001: Kyocera, đang sản xuất
  ('55555555-0001-0001-0001-000000000001', 'PO-2026-001',
   '11111111-0001-0001-0001-000000000001',
   'in_production', '2026-07-01', '2026-07-31',
   '注文書 No.KYO-26-0712。品質基準: JIS-A級。'),

  -- PO-002: Murata, đã xong
  ('55555555-0002-0002-0002-000000000002', 'PO-2026-002',
   '11111111-0002-0002-0002-000000000002',
   'completed', '2026-07-05', '2026-07-25',
   '注文書 No.MUR-26-0715。通常納品。')
ON CONFLICT (po_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 6. ORDER LINES (chi tiết từng sản phẩm trong đơn)
-- ─────────────────────────────────────────────
INSERT INTO order_lines (
  line_id, po_id, product_id, quantity_ordered, unit_price, currency, notes
)
VALUES
  -- PO-001 lines
  ('66666666-0001-0001-0001-000000000001', '55555555-0001-0001-0001-000000000001',
   '44444444-0001-0001-0001-000000000001', 5000, 85.00, 'JPY', 'TRAY-KYO-A1 x5000'),

  ('66666666-0002-0002-0002-000000000002', '55555555-0001-0001-0001-000000000001',
   '44444444-0003-0003-0003-000000000003', 2000, 120.00, 'JPY', 'TRAY-KYO-C3 x2000'),

  -- PO-002 lines
  ('66666666-0003-0003-0003-000000000003', '55555555-0002-0002-0002-000000000002',
   '44444444-0002-0002-0002-000000000002', 8000, 65.00, 'JPY', 'TRAY-MUR-B2 x8000')
ON CONFLICT (line_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 7. PRODUCTION LOTS (lô sản xuất)
-- ─────────────────────────────────────────────
INSERT INTO production_lots (
  lot_id, lot_code, po_id, product_id, planned_qty, actual_qty,
  status, production_date, notes
)
VALUES
  -- Lô 1 – PO-001, sản phẩm A1, đã xong
  ('77777777-0001-0001-0001-000000000001', 'LOT-2026-0701-A',
   '55555555-0001-0001-0001-000000000001', '44444444-0001-0001-0001-000000000001',
   2500, 2480, 'completed', '2026-07-08',
   'Lô sản xuất sáng 08/07. NG rate: 0.8%.'),

  -- Lô 2 – PO-001, sản phẩm A1, đã xong
  ('77777777-0002-0002-0002-000000000002', 'LOT-2026-0709-A',
   '55555555-0001-0001-0001-000000000001', '44444444-0001-0001-0001-000000000001',
   2500, 2510, 'completed', '2026-07-12',
   'Lô sản xuất sáng 12/07. Vượt kế hoạch +10 pcs.'),

  -- Lô 3 – PO-001, sản phẩm C3, đang sản xuất
  ('77777777-0003-0003-0003-000000000003', 'LOT-2026-0714-C',
   '55555555-0001-0001-0001-000000000001', '44444444-0003-0003-0003-000000000003',
   2000, 1800, 'in_progress', '2026-07-15',
   'Dự kiến hoàn thành 17/07.'),

  -- Lô 4 – PO-002, sản phẩm B2, đã xong
  ('77777777-0004-0004-0004-000000000004', 'LOT-2026-0706-B',
   '55555555-0002-0002-0002-000000000002', '44444444-0002-0002-0002-000000000002',
   4000, 4020, 'completed', '2026-07-10',
   'Ca ngày 10/07. QC pass 100%.'),

  -- Lô 5 – PO-002, sản phẩm B2, đã xong
  ('77777777-0005-0005-0005-000000000005', 'LOT-2026-0712-B',
   '55555555-0002-0002-0002-000000000002', '44444444-0002-0002-0002-000000000002',
   4000, 3980, 'completed', '2026-07-14',
   'Ca ngày 14/07. NG 20 pcs (bavia nhẹ) - đã xử lý tái chế.')
ON CONFLICT (lot_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 8. SHIPMENTS (phiếu xuất hàng)
-- ─────────────────────────────────────────────
INSERT INTO shipments (
  shipment_id, shipment_code, po_id, company_id, delivery_site_id,
  status, scheduled_date, shipped_date,
  total_cartons, total_pallets, notes
)
VALUES
  -- Shipment 1: Kyocera, lô 1+2 (A1), đã xuất
  ('88888888-0001-0001-0001-000000000001', 'SHP-2026-001',
   '55555555-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001',
   '33333333-0001-0001-0001-000000000001',
   'shipped', '2026-07-15', '2026-07-15',
   50, 2,
   '京セラ向け第1便。出荷完了。送り状No.YSD-260715-001。'),

  -- Shipment 2: Kyocera, lô 3 (C3), đang chuẩn bị
  ('88888888-0002-0002-0002-000000000002', 'SHP-2026-002',
   '55555555-0001-0001-0001-000000000001', '11111111-0001-0001-0001-000000000001',
   '33333333-0001-0001-0001-000000000001',
   'preparing', '2026-07-18', NULL,
   0, 0,
   '京セラ向け第2便 (C3)。生産完了後に出荷予定。'),

  -- Shipment 3: Murata, lô 4+5 (B2), đã xuất
  ('88888888-0003-0003-0003-000000000003', 'SHP-2026-003',
   '55555555-0002-0002-0002-000000000002', '11111111-0002-0002-0002-000000000002',
   '33333333-0002-0002-0002-000000000002',
   'delivered', '2026-07-20', '2026-07-19',
   80, 3,
   '村田向け全数出荷。受領確認済み。')
ON CONFLICT (shipment_id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 9. SHIPMENT_LOTS (junction: gán lô vào phiếu xuất)
-- ─────────────────────────────────────────────
INSERT INTO shipment_lots (
  id, shipment_id, lot_id, qty_shipped, carton_count, pallet_count, notes
)
VALUES
  -- SHP-001 ← LOT-1 (A1: 2480 pcs)
  ('99999999-0001-0001-0001-000000000001',
   '88888888-0001-0001-0001-000000000001', '77777777-0001-0001-0001-000000000001',
   2480, 25, 1, 'Lô 1/2 của đơn A1'),

  -- SHP-001 ← LOT-2 (A1: 2510 pcs)
  ('99999999-0002-0002-0002-000000000002',
   '88888888-0001-0001-0001-000000000001', '77777777-0002-0002-0002-000000000002',
   2510, 25, 1, 'Lô 2/2 của đơn A1'),

  -- SHP-002 ← LOT-3 (C3: 1800 pcs – xuất bán thành phẩm, đang trong tiến độ)
  ('99999999-0003-0003-0003-000000000003',
   '88888888-0002-0002-0002-000000000002', '77777777-0003-0003-0003-000000000003',
   0, 0, 0, 'Chờ LOT hoàn thành – qty_shipped cập nhật sau'),

  -- SHP-003 ← LOT-4 (B2: 4020 pcs)
  ('99999999-0004-0004-0004-000000000004',
   '88888888-0003-0003-0003-000000000003', '77777777-0004-0004-0004-000000000004',
   4020, 40, 2, 'Lô 1/2 đơn B2'),

  -- SHP-003 ← LOT-5 (B2: 3980 pcs)
  ('99999999-0005-0005-0005-000000000005',
   '88888888-0003-0003-0003-000000000003', '77777777-0005-0005-0005-000000000005',
   3980, 40, 1, 'Lô 2/2 đơn B2')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────
-- 10. DELIVERY NOTES (chứng từ giao hàng)
-- ─────────────────────────────────────────────
INSERT INTO delivery_notes (
  note_id, shipment_id, certificate_type, issued_date,
  company_confirmed, confirmed_date, notes
)
VALUES
  -- DN cho SHP-001
  ('aaaaaaaa-0001-0001-0001-000000000001',
   '88888888-0001-0001-0001-000000000001',
   'delivery_note', '2026-07-15',
   true, '2026-07-16',
   '納品書 No.YSD-DN-260715-001。京セラ受領印済み。'),

  -- DN cho SHP-003
  ('aaaaaaaa-0003-0003-0003-000000000003',
   '88888888-0003-0003-0003-000000000003',
   'delivery_note', '2026-07-19',
   true, '2026-07-21',
   '納品書 No.YSD-DN-260719-003。村田受領確認。')
ON CONFLICT (note_id) DO NOTHING;
