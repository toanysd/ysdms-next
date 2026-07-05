import requests
import json
import uuid

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

def run_sql(sql):
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    resp = requests.post(url, headers=HEADERS, json={"query": sql}, timeout=60)
    return resp

print("Seeding Walkthrough Scenario Data...")

company_id = str(uuid.uuid4())
product_id = str(uuid.uuid4())
order_id = str(uuid.uuid4())
mold_master_id = str(uuid.uuid4())
design_rev_id = str(uuid.uuid4())

sql = f"""
-- Clean up first if exists
DELETE FROM design_revisions WHERE design_code = 'JAE-351AB';
DELETE FROM mold_masters WHERE mold_master_code = 'JAE-351AB';
DELETE FROM order_lines WHERE order_id IN (SELECT order_id FROM orders WHERE order_no = 'JAE-351AB_025-60249_20260615');
DELETE FROM orders WHERE order_no = 'JAE-351AB_025-60249_20260615';
DELETE FROM products WHERE product_code = 'JAE-351AB';
DELETE FROM companies WHERE company_code = 'JAE';

-- 1. Create Customer JAE
INSERT INTO companies (company_id, company_code, company_name, company_type, is_active)
VALUES ('{company_id}', 'JAE', 'Japan Aviation Electronics Ltd.', '{{CUSTOMER}}', true);

-- 2. Create Product JAE-351AB
INSERT INTO products (product_id, product_code, product_name, company_id, pocket_count, product_status)
VALUES ('{product_id}', 'JAE-351AB', 'JAE Connector Tray 351AB', '{company_id}', 24, 'ACTIVE');

-- 3. Create Mold Master
INSERT INTO mold_masters (mold_master_id, mold_master_code, mold_master_name, company_id, product_id)
VALUES ('{mold_master_id}', 'JAE-351AB', 'JAE 351AB Mold Master', '{company_id}', '{product_id}');

-- 4. Create Design Revision (Status PENDING so it shows up on Engineering Kanban)
INSERT INTO design_revisions (
    revision_id, design_code, mold_master_id, revision_number, status, 
    design_length, design_width, design_height, design_depth, cavity_count, has_plug
) VALUES (
    '{design_rev_id}', 'JAE-351AB', '{mold_master_id}', 0, 'PENDING',
    390.0, 290.0, 25.0, 15.0, 1, true
);

-- 5. Create Order following naming convention: {{Mã_khuôn}}_{{PO_khách}}_{{Ngày_đặt}}
INSERT INTO orders (order_id, order_no, company_id, order_date, requested_delivery, order_status, order_type, company_po)
VALUES (
    '{order_id}', 'JAE-351AB_025-60249_20260615', '{company_id}', 
    '2026-06-15', '2026-07-05', 'NEW', 'design_mold', '025-60249'
);

-- 6. Create Order Line
INSERT INTO order_lines (line_id, order_id, line_no, product_id, quantity, unit, due_date, line_status)
VALUES ('{uuid.uuid4()}', '{order_id}', 1, '{product_id}', 10000, 'PCS', '2026-07-05', 'NEW');
"""

resp = run_sql(sql)
print(f"Status: {resp.status_code} -> {resp.text}")
print("Seeding complete. Ready for walkthrough.")
