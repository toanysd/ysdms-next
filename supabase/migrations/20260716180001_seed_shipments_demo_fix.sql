-- =============================================================
-- SEED: Demo data cho luồng Shipments (UI test + PDF export)
-- Ngày: 2026-07-16
-- Dùng DO block để tránh cứng nhắc UUID và conflict
-- Đã sửa toàn bộ cột để khớp 100% với schema thực tế của database.
-- =============================================================

DO $$
DECLARE
  v_kyocera_id uuid;
  v_murata_id  uuid;
  v_kyocera_site_id uuid;
  v_murata_site_id uuid;
  v_prod_kyo_a1 uuid;
  v_prod_mur_b2 uuid;
  v_prod_kyo_c3 uuid;
  v_order_kyo uuid := '00000000-0000-0000-0001-000000000001'::uuid;
  v_order_mur uuid := '00000000-0000-0000-0001-000000000002'::uuid;
  v_line_kyo_1 uuid := '00000000-0000-0000-0002-000000000001'::uuid;
  v_line_kyo_2 uuid := '00000000-0000-0000-0002-000000000002'::uuid;
  v_line_mur_1 uuid := '00000000-0000-0000-0002-000000000003'::uuid;
  v_po_kyo_1 uuid := '00000000-0000-0000-0003-000000000001'::uuid;
  v_po_kyo_2 uuid := '00000000-0000-0000-0003-000000000002'::uuid;
  v_po_mur_1 uuid := '00000000-0000-0000-0003-000000000003'::uuid;
  v_lot_kyo_1 uuid := '00000000-0000-0000-0004-000000000001'::uuid;
  v_lot_kyo_2 uuid := '00000000-0000-0000-0004-000000000002'::uuid;
  v_lot_kyo_3 uuid := '00000000-0000-0000-0004-000000000003'::uuid;
  v_lot_mur_1 uuid := '00000000-0000-0000-0004-000000000004'::uuid;
  v_lot_mur_2 uuid := '00000000-0000-0000-0004-000000000005'::uuid;
  v_shp_kyo_1 uuid := '00000000-0000-0000-0005-000000000001'::uuid;
  v_shp_kyo_2 uuid := '00000000-0000-0000-0005-000000000002'::uuid;
  v_shp_mur_1 uuid := '00000000-0000-0000-0005-000000000003'::uuid;
BEGIN

-- 1. Upsert companies
INSERT INTO companies (company_code, company_name, company_name_romaji, company_type, address, tel, fax)
VALUES ('KYOCERA','京セラ株式会社','Kyocera Corporation',ARRAY['customer'],
        '〒612-8501 京都市伏見区竹田鳥羽殿町6','075-604-3500','075-604-3501')
ON CONFLICT (company_code) DO NOTHING;

INSERT INTO companies (company_code, company_name, company_name_romaji, company_type, address, tel, fax)
VALUES ('MURATA','株式会社村田製作所','Murata Manufacturing Co., Ltd.',ARRAY['customer'],
        '〒617-8555 長岡京市東神足1-10-1','075-955-6789','075-955-6790')
ON CONFLICT (company_code) DO NOTHING;

-- Lấy IDs thực tế từ DB
SELECT company_id INTO v_kyocera_id FROM companies WHERE company_code='KYOCERA';
SELECT company_id INTO v_murata_id  FROM companies WHERE company_code='MURATA';

-- 2. Delivery Sites
INSERT INTO delivery_sites (company_id, site_code, site_name, site_address, contact_person, site_tel)
SELECT v_kyocera_id,'KYOCERA-KYO','京セラ 京都本社','〒612-8501 京都市伏見区竹田鳥羽殿町6','田中 健一','075-604-3500'
WHERE NOT EXISTS (SELECT 1 FROM delivery_sites WHERE site_code='KYOCERA-KYO');

INSERT INTO delivery_sites (company_id, site_code, site_name, site_address, contact_person, site_tel)
SELECT v_murata_id,'MURATA-NGK','村田製作所 長岡京倉庫','〒617-8555 長岡京市東神足1-10-1','山田 花子','075-955-6789'
WHERE NOT EXISTS (SELECT 1 FROM delivery_sites WHERE site_code='MURATA-NGK');

SELECT site_id INTO v_kyocera_site_id FROM delivery_sites WHERE site_code='KYOCERA-KYO';
SELECT site_id INTO v_murata_site_id FROM delivery_sites WHERE site_code='MURATA-NGK';

-- 3. Products
INSERT INTO products (product_code, product_name, company_id)
SELECT 'TRAY-KYO-A1','Khay IC Kyocera Type-A1',v_kyocera_id
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_code='TRAY-KYO-A1');

INSERT INTO products (product_code, product_name, company_id)
SELECT 'TRAY-MUR-B2','Khay linh kiện Murata B2',v_murata_id
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_code='TRAY-MUR-B2');

INSERT INTO products (product_code, product_name, company_id)
SELECT 'TRAY-KYO-C3','Khay Kyocera Series-C3',v_kyocera_id
WHERE NOT EXISTS (SELECT 1 FROM products WHERE product_code='TRAY-KYO-C3');

SELECT product_id INTO v_prod_kyo_a1 FROM products WHERE product_code='TRAY-KYO-A1';
SELECT product_id INTO v_prod_mur_b2 FROM products WHERE product_code='TRAY-MUR-B2';
SELECT product_id INTO v_prod_kyo_c3 FROM products WHERE product_code='TRAY-KYO-C3';

-- 4. Orders
INSERT INTO orders (order_id, order_no, company_id, order_date, order_status)
SELECT v_order_kyo, 'ORD-2026-KYO-001', v_kyocera_id, '2026-07-01', 'CONFIRMED'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_no='ORD-2026-KYO-001');

INSERT INTO orders (order_id, order_no, company_id, order_date, order_status)
SELECT v_order_mur, 'ORD-2026-MUR-002', v_murata_id, '2026-07-05', 'CONFIRMED'
WHERE NOT EXISTS (SELECT 1 FROM orders WHERE order_no='ORD-2026-MUR-002');

-- 5. Order Lines
INSERT INTO order_lines (line_id, order_id, line_no, product_id, quantity)
SELECT v_line_kyo_1, v_order_kyo, 1, v_prod_kyo_a1, 5000
WHERE NOT EXISTS (SELECT 1 FROM order_lines WHERE line_id=v_line_kyo_1);

INSERT INTO order_lines (line_id, order_id, line_no, product_id, quantity)
SELECT v_line_kyo_2, v_order_kyo, 2, v_prod_kyo_c3, 2000
WHERE NOT EXISTS (SELECT 1 FROM order_lines WHERE line_id=v_line_kyo_2);

INSERT INTO order_lines (line_id, order_id, line_no, product_id, quantity)
SELECT v_line_mur_1, v_order_mur, 1, v_prod_mur_b2, 8000
WHERE NOT EXISTS (SELECT 1 FROM order_lines WHERE line_id=v_line_mur_1);

-- 6. Production Orders
INSERT INTO production_orders (po_id, po_code, order_line_id, planned_quantity)
SELECT v_po_kyo_1, 'PO-2026-001', v_line_kyo_1, 5000
WHERE NOT EXISTS (SELECT 1 FROM production_orders WHERE po_code='PO-2026-001');

INSERT INTO production_orders (po_id, po_code, order_line_id, planned_quantity)
SELECT v_po_kyo_2, 'PO-2026-002', v_line_kyo_2, 2000
WHERE NOT EXISTS (SELECT 1 FROM production_orders WHERE po_code='PO-2026-002');

INSERT INTO production_orders (po_id, po_code, order_line_id, planned_quantity)
SELECT v_po_mur_1, 'PO-2026-003', v_line_mur_1, 8000
WHERE NOT EXISTS (SELECT 1 FROM production_orders WHERE po_code='PO-2026-003');

-- 7. Production Lots
INSERT INTO production_lots (lot_id, po_id, lot_no, lot_status, good_qty, notes)
SELECT v_lot_kyo_1, v_po_kyo_1, 'LOT-2026-0701-A', 'completed', 2480, 'Lô 1/2 đơn A1. NG rate: 0.8%.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_no='LOT-2026-0701-A');

INSERT INTO production_lots (lot_id, po_id, lot_no, lot_status, good_qty, notes)
SELECT v_lot_kyo_2, v_po_kyo_1, 'LOT-2026-0709-A', 'completed', 2510, 'Lô 2/2 đơn A1. Vượt kế hoạch +10 pcs.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_no='LOT-2026-0709-A');

INSERT INTO production_lots (lot_id, po_id, lot_no, lot_status, good_qty, notes)
SELECT v_lot_kyo_3, v_po_kyo_2, 'LOT-2026-0714-C', 'in_progress', 1800, 'Dự kiến hoàn thành 17/07.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_no='LOT-2026-0714-C');

INSERT INTO production_lots (lot_id, po_id, lot_no, lot_status, good_qty, notes)
SELECT v_lot_mur_1, v_po_mur_1, 'LOT-2026-0706-B', 'completed', 4020, 'Ca ngày 10/07. QC pass 100%.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_no='LOT-2026-0706-B');

INSERT INTO production_lots (lot_id, po_id, lot_no, lot_status, good_qty, notes)
SELECT v_lot_mur_2, v_po_mur_1, 'LOT-2026-0712-B', 'completed', 3980, 'Ca ngày 14/07. NG 20 pcs bavia - đã tái chế.'
WHERE NOT EXISTS (SELECT 1 FROM production_lots WHERE lot_no='LOT-2026-0712-B');

-- 8. Shipments
INSERT INTO shipments (shipment_id, order_id, ship_date, delivery_site_id, status, tracking_no, notes)
SELECT v_shp_kyo_1, v_order_kyo, '2026-07-15', v_kyocera_site_id, 'SHIPPED', 'SHP-2026-001', '京セラ向け第1便。出荷完了。'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE shipment_id=v_shp_kyo_1);

INSERT INTO shipments (shipment_id, order_id, ship_date, delivery_site_id, status, tracking_no, notes)
SELECT v_shp_kyo_2, v_order_kyo, '2026-07-18', v_kyocera_site_id, 'IN_TRANSIT', 'SHP-2026-002', '京セラ向け第2便(C3)。準備中。'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE shipment_id=v_shp_kyo_2);

INSERT INTO shipments (shipment_id, order_id, ship_date, delivery_site_id, status, tracking_no, notes)
SELECT v_shp_mur_1, v_order_mur, '2026-07-19', v_murata_site_id, 'DELIVERED', 'SHP-2026-003', '村田向け全数出荷。受領確認済み。'
WHERE NOT EXISTS (SELECT 1 FROM shipments WHERE shipment_id=v_shp_mur_1);

-- 9. Shipment Lots
INSERT INTO shipment_lots (shipment_id, lot_id, qty_shipped, carton_count, pallet_no, notes)
SELECT v_shp_kyo_1, v_lot_kyo_1, 2480, 25, 'PAL-001', 'Lô 1/2 đơn A1'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE shipment_id=v_shp_kyo_1 AND lot_id=v_lot_kyo_1);

INSERT INTO shipment_lots (shipment_id, lot_id, qty_shipped, carton_count, pallet_no, notes)
SELECT v_shp_kyo_1, v_lot_kyo_2, 2510, 25, 'PAL-001', 'Lô 2/2 đơn A1'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE shipment_id=v_shp_kyo_1 AND lot_id=v_lot_kyo_2);

INSERT INTO shipment_lots (shipment_id, lot_id, qty_shipped, carton_count, pallet_no, notes)
SELECT v_shp_kyo_2, v_lot_kyo_3, 0, 0, '', 'Chờ LOT hoàn thành'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE shipment_id=v_shp_kyo_2 AND lot_id=v_lot_kyo_3);

INSERT INTO shipment_lots (shipment_id, lot_id, qty_shipped, carton_count, pallet_no, notes)
SELECT v_shp_mur_1, v_lot_mur_1, 4020, 40, 'PAL-002', 'Lô 1/2 đơn B2'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE shipment_id=v_shp_mur_1 AND lot_id=v_lot_mur_1);

INSERT INTO shipment_lots (shipment_id, lot_id, qty_shipped, carton_count, pallet_no, notes)
SELECT v_shp_mur_1, v_lot_mur_2, 3980, 40, 'PAL-003', 'Lô 2/2 đơn B2'
WHERE NOT EXISTS (SELECT 1 FROM shipment_lots WHERE shipment_id=v_shp_mur_1 AND lot_id=v_lot_mur_2);

RAISE NOTICE '✅ Seed hoàn chỉnh (đã sửa Schema)! Kyocera_id=%, Murata_id=%', v_kyocera_id, v_murata_id;
END $$;
