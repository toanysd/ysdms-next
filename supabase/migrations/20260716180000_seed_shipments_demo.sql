-- =============================================================
-- SEED: Demo data cho luồng Shipments (UI test + PDF export)
-- Ngày: 2026-07-16
-- Dùng DO block để tránh cứng nhắc UUID và conflict
-- =============================================================

DO $$
DECLARE
  v_kyocera_id uuid;
  v_murata_id  uuid;
BEGIN

-- 1. Upsert companies (chỉ insert nếu chưa có)
INSERT INTO companies (company_code, company_name, company_name_romaji, company_type, address, tel, fax, is_active)
VALUES ('KYOCERA','京セラ株式会社','Kyocera Corporation',ARRAY['customer'],
        '〒612-8501 京都市伏見区竹田鳥羽殿町6','075-604-3500','075-604-3501',true)
ON CONFLICT (company_code) DO UPDATE SET is_active = true;

INSERT INTO companies (company_code, company_name, company_name_romaji, company_type, address, tel, fax, is_active)
VALUES ('MURATA','株式会社村田製作所','Murata Manufacturing Co., Ltd.',ARRAY['customer'],
        '〒617-8555 長岡京市東神足1-10-1','075-955-6789','075-955-6790',true)
ON CONFLICT (company_code) DO UPDATE SET is_active = true;

-- Lấy IDs thực tế từ DB
SELECT company_id INTO v_kyocera_id FROM companies WHERE company_code='KYOCERA';
SELECT company_id INTO v_murata_id  FROM companies WHERE company_code='MURATA';

-- 2. Delivery Sites
INSERT INTO delivery_sites (company_id, site_code, site_name, site_address, contact_person, site_tel, is_active)
SELECT v_kyocera_id,'KYOCERA-KYO','京セラ 京都本社','〒612-8501 京都市伏見区竹田鳥羽殿町6','田中 健一','075-604-3500',true
WHERE NOT EXISTS (SELECT 1 FROM delivery_sites WHERE site_code='KYOCERA-KYO');

INSERT INTO delivery_sites (company_id, site_code, site_name, site_address, contact_person, site_tel, is_active)
SELECT v_murata_id,'MURATA-NGK','村田製作所 長岡京倉庫','〒617-8555 長岡京市東神足1-10-1','山田 花子','075-955-6789',true
WHERE NOT EXISTS (SELECT 1 FROM delivery_sites WHERE site_code='MURATA-NGK');

-- 3. Products (ĐÃ BỎ is_active VÌ KHÔNG CÓ TRONG BẢNG)
INSERT INTO products (product_code, product_name, company_id)
SELECT 'TRAY-KYO-A1','Khay IC Kyocera Type-A1',v_kyocera_id
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_code='TRAY-KYO-A1');

INSERT INTO products (product_code, product_name, company_id)
SELECT 'TRAY-MUR-B2','Khay linh kiện Murata B2',v_murata_id
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_code='TRAY-MUR-B2');

INSERT INTO products (product_code, product_name, company_id)
SELECT 'TRAY-KYO-C3','Khay Kyocera Series-C3',v_kyocera_id
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_code='TRAY-KYO-C3');

-- 4. Production Orders
INSERT INTO production_orders (po_id, po_code, company_id, status, order_date, delivery_date, notes)
SELECT '55555555-0001-0001-0001-000000000001'::uuid,'PO-2026-001',v_kyocera_id,
  'in_production','2026-07-01','2026-07-31','注文書 No.KYO-26-0712。'
WHERE NOT EXISTS (SELECT 1 FROM production_orders WHERE po_code='PO-2026-001');

INSERT INTO production_orders (po_id, po_code, company_id, status, order_date, delivery_date, notes)
SELECT '55555555-0002-0002-0002-000000000002'::uuid,'PO-2026-002',v_murata_id,
  'completed','2026-07-05','2026-07-25','注文書 No.MUR-26-0715。'
WHERE NOT EXISTS (SELECT 1 FROM production_orders WHERE po_code='PO-2026-002');

-- 5. Order Lines
INSERT INTO order_lines (line_id, po_id, product_id, quantity_ordered, unit_price, currency, notes)
SELECT '66666666-0001-0001-0001-000000000001'::uuid,
  '55555555-0001-0001-0001-000000000001'::uuid,
  (SELECT product_id FROM products WHERE product_code='TRAY-KYO-A1' LIMIT 1),
  5000,85.00,'JPY','TRAY-KYO-A1 x5000'
WHERE NOT EXISTS (SELECT 1 FROM order_lines WHERE line_id='66666666-0001-0001-0001-000000000001'::uuid);

INSERT INTO order_lines (line_id, po_id, product_id, quantity_ordered, unit_price, currency, notes)
SELECT '66666666-0002-0002-0002-000000000002'::uuid,
  '55555555-0001-0001-0001-000000000001'::uuid,
  (SELECT product_id FROM products WHERE product_code='TRAY-KYO-C3' LIMIT 1),
  2000,120.00,'JPY','TRAY-KYO-C3 x2000'
WHERE NOT EXISTS (SELECT 1 FROM order_lines WHERE line_id='66666666-0002-0002-0002-000000000002'::uuid);

INSERT INTO order_lines (line_id, po_id, product_id, quantity_ordered, unit_price, currency, notes)
SELECT '66666666-0003-0003-0003-000000000003'::uuid,
  '55555555-0002-0002-0002-000000000002'::uuid,
  (SELECT product_id FROM products WHERE product_code='TRAY-MUR-B2' LIMIT 1),
  8000,65.00,'JPY','TRAY-MUR-B2 x8000'
WHERE NOT EXISTS (SELECT 1 FROM order_lines WHERE line_id='66666666-0003-0003-0003-000000000003'::uuid);

-- 6. Production Lots
INSERT INTO production_lots (lot_id, lot_code, po_id, product_id, planned_qty, actual_qty, status, production_date, notes)
SELECT '77777777-0001-0001-0001-000000000001'::uuid,'LOT-2026-0701-A',
  '55555555-0001-0001-0001-000000000001'::uuid,
  (SELECT product_id FROM products WHERE product_code='TRAY-KYO-A1' LIMIT 1),
  2500,2480,'completed','2026-07-08','Lô 1/2 đơn A1. NG rate: 0.8%.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_code='LOT-2026-0701-A');

INSERT INTO production_lots (lot_id, lot_code, po_id, product_id, planned_qty, actual_qty, status, production_date, notes)
SELECT '77777777-0002-0002-0002-000000000002'::uuid,'LOT-2026-0709-A',
  '55555555-0001-0001-0001-000000000001'::uuid,
  (SELECT product_id FROM products WHERE product_code='TRAY-KYO-A1' LIMIT 1),
  2500,2510,'completed','2026-07-12','Lô 2/2 đơn A1. Vượt kế hoạch +10 pcs.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_code='LOT-2026-0709-A');

INSERT INTO production_lots (lot_id, lot_code, po_id, product_id, planned_qty, actual_qty, status, production_date, notes)
SELECT '77777777-0003-0003-0003-000000000003'::uuid,'LOT-2026-0714-C',
  '55555555-0001-0001-0001-000000000001'::uuid,
  (SELECT product_id FROM products WHERE product_code='TRAY-KYO-C3' LIMIT 1),
  2000,1800,'in_progress','2026-07-15','Dự kiến hoàn thành 17/07.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_code='LOT-2026-0714-C');

INSERT INTO production_lots (lot_id, lot_code, po_id, product_id, planned_qty, actual_qty, status, production_date, notes)
SELECT '77777777-0004-0004-0004-000000000004'::uuid,'LOT-2026-0706-B',
  '55555555-0002-0002-0002-000000000002'::uuid,
  (SELECT product_id FROM products WHERE product_code='TRAY-MUR-B2' LIMIT 1),
  4000,4020,'completed','2026-07-10','Ca ngày 10/07. QC pass 100%.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_code='LOT-2026-0706-B');

INSERT INTO production_lots (lot_id, lot_code, po_id, product_id, planned_qty, actual_qty, status, production_date, notes)
SELECT '77777777-0005-0005-0005-000000000005'::uuid,'LOT-2026-0712-B',
  '55555555-0002-0002-0002-000000000002'::uuid,
  (SELECT product_id FROM products WHERE product_code='TRAY-MUR-B2' LIMIT 1),
  4000,3980,'completed','2026-07-14','Ca ngày 14/07. NG 20 pcs bavia - đã tái chế.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_code='LOT-2026-0712-B');

-- 7. Shipments
INSERT INTO shipments (shipment_id, shipment_code, po_id, company_id, delivery_site_id, status, scheduled_date, shipped_date, total_cartons, total_pallets, notes)
SELECT '88888888-0001-0001-0001-000000000001'::uuid,'SHP-2026-001',
  '55555555-0001-0001-0001-000000000001'::uuid, v_kyocera_id,
  (SELECT site_id FROM delivery_sites WHERE site_code='KYOCERA-KYO' LIMIT 1),
  'shipped','2026-07-15','2026-07-15',50,2,'京セラ向け第1便。出荷完了。'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE shipment_code='SHP-2026-001');

INSERT INTO shipments (shipment_id, shipment_code, po_id, company_id, delivery_site_id, status, scheduled_date, shipped_date, total_cartons, total_pallets, notes)
SELECT '88888888-0002-0002-0002-000000000002'::uuid,'SHP-2026-002',
  '55555555-0001-0001-0001-000000000001'::uuid, v_kyocera_id,
  (SELECT site_id FROM delivery_sites WHERE site_code='KYOCERA-KYO' LIMIT 1),
  'preparing','2026-07-18',NULL,0,0,'京セラ向け第2便(C3)。準備中。'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE shipment_code='SHP-2026-002');

INSERT INTO shipments (shipment_id, shipment_code, po_id, company_id, delivery_site_id, status, scheduled_date, shipped_date, total_cartons, total_pallets, notes)
SELECT '88888888-0003-0003-0003-000000000003'::uuid,'SHP-2026-003',
  '55555555-0002-0002-0002-000000000002'::uuid, v_murata_id,
  (SELECT site_id FROM delivery_sites WHERE site_code='MURATA-NGK' LIMIT 1),
  'delivered','2026-07-20','2026-07-19',80,3,'村田向け全数出荷。受領確認済み。'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE shipment_code='SHP-2026-003');

-- 8. Shipment Lots
INSERT INTO shipment_lots (id, shipment_id, lot_id, qty_shipped, carton_count, pallet_count, notes)
SELECT '99999999-0001-0001-0001-000000000001'::uuid,
  '88888888-0001-0001-0001-000000000001'::uuid,'77777777-0001-0001-0001-000000000001'::uuid,
  2480,25,1,'Lô 1/2 đơn A1'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE id='99999999-0001-0001-0001-000000000001'::uuid);

INSERT INTO shipment_lots (id, shipment_id, lot_id, qty_shipped, carton_count, pallet_count, notes)
SELECT '99999999-0002-0002-0002-000000000002'::uuid,
  '88888888-0001-0001-0001-000000000001'::uuid,'77777777-0002-0002-0002-000000000002'::uuid,
  2510,25,1,'Lô 2/2 đơn A1'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE id='99999999-0002-0002-0002-000000000002'::uuid);

INSERT INTO shipment_lots (id, shipment_id, lot_id, qty_shipped, carton_count, pallet_count, notes)
SELECT '99999999-0003-0003-0003-000000000003'::uuid,
  '88888888-0002-0002-0002-000000000002'::uuid,'77777777-0003-0003-0003-000000000003'::uuid,
  0,0,0,'Chờ LOT hoàn thành'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE id='99999999-0003-0003-0003-000000000003'::uuid);

INSERT INTO shipment_lots (id, shipment_id, lot_id, qty_shipped, carton_count, pallet_count, notes)
SELECT '99999999-0004-0004-0004-000000000004'::uuid,
  '88888888-0003-0003-0003-000000000003'::uuid,'77777777-0004-0004-0004-000000000004'::uuid,
  4020,40,2,'Lô 1/2 đơn B2'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE id='99999999-0004-0004-0004-000000000004'::uuid);

INSERT INTO shipment_lots (id, shipment_id, lot_id, qty_shipped, carton_count, pallet_count, notes)
SELECT '99999999-0005-0005-0005-000000000005'::uuid,
  '88888888-0003-0003-0003-000000000003'::uuid,'77777777-0005-0005-0005-000000000005'::uuid,
  3980,40,1,'Lô 2/2 đơn B2'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE id='99999999-0005-0005-0005-000000000005'::uuid);

-- 9. Delivery Notes
INSERT INTO delivery_notes (note_id, shipment_id, certificate_type, issued_date, company_confirmed, confirmed_date, notes)
SELECT 'aaaaaaaa-0001-0001-0001-000000000001'::uuid,
  '88888888-0001-0001-0001-000000000001'::uuid,
  'delivery_note','2026-07-15',true,'2026-07-16','納品書 No.YSD-DN-260715-001。京セラ受領印済み。'
WHERE NOT EXISTS (SELECT 1 FROM delivery_notes WHERE note_id='aaaaaaaa-0001-0001-0001-000000000001'::uuid);

INSERT INTO delivery_notes (note_id, shipment_id, certificate_type, issued_date, company_confirmed, confirmed_date, notes)
SELECT 'aaaaaaaa-0003-0003-0003-000000000003'::uuid,
  '88888888-0003-0003-0003-000000000003'::uuid,
  'delivery_note','2026-07-19',true,'2026-07-21','納品書 No.YSD-DN-260719-003。村田受領確認。'
WHERE NOT EXISTS (SELECT 1 FROM delivery_notes WHERE note_id='aaaaaaaa-0003-0003-0003-000000000003'::uuid);

RAISE NOTICE '✅ Seed hoàn thành! Kyocera_id=%, Murata_id=%', v_kyocera_id, v_murata_id;
END $$;
