import os
import requests
import json
import uuid

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "os.environ.get("SUPABASE_SERVICE_ROLE_KEY")"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

def run_sql(sql):
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    resp = requests.post(url, headers=HEADERS, json={"query": sql}, timeout=60)
    return resp

print("Retrieving reference objects...")
# Get a company
resp = requests.get(f"{SUPABASE_URL}/rest/v1/companies?select=company_id&limit=1", headers=HEADERS)
company = resp.json()[0] if resp.status_code == 200 and resp.json() else None

# Get a product
resp = requests.get(f"{SUPABASE_URL}/rest/v1/products?select=product_id&limit=1", headers=HEADERS)
product = resp.json()[0] if resp.status_code == 200 and resp.json() else None

# Get a physical mold & master
resp = requests.get(f"{SUPABASE_URL}/rest/v1/physical_molds?select=physical_mold_id,mold_revisions(mold_master_id)&limit=1", headers=HEADERS)
mold = resp.json()[0] if resp.status_code == 200 and resp.json() else None

if not company or not product or not mold:
    print("Could not retrieve reference data!")
    exit(1)

company_id = company["company_id"]
product_id = product["product_id"]
physical_mold_id = mold["physical_mold_id"]
mold_master_id = mold["mold_revisions"]["mold_master_id"]

print(f"Using company: {company_id}")
print(f"Using product: {product_id}")
print(f"Using physical mold: {physical_mold_id}")
print(f"Using mold master: {mold_master_id}")

order_id = str(uuid.uuid4())
job_id = str(uuid.uuid4())

sql = f"""
-- Clean old seed
DELETE FROM job_steps WHERE job_id IN (SELECT job_id FROM jobs WHERE job_code = 'JOB-2026-0001');
DELETE FROM jobs WHERE job_code = 'JOB-2026-0001';
DELETE FROM order_lines WHERE order_id IN (SELECT order_id FROM orders WHERE order_no = 'A-2026-0001');
DELETE FROM orders WHERE order_no = 'A-2026-0001';

-- Insert Order
INSERT INTO orders (order_id, order_no, company_id, order_date, requested_delivery, order_status)
VALUES ('{order_id}', 'A-2026-0001', '{company_id}', '2026-06-15', '2026-06-30', 'NEW');

-- Insert Order Line
INSERT INTO order_lines (line_id, order_id, line_no, product_id, quantity, unit, due_date, line_status)
VALUES ('{uuid.uuid4()}', '{order_id}', 1, '{product_id}', 5000, 'PCS', '2026-06-30', 'NEW');

-- Insert Job
INSERT INTO jobs (
    job_id, job_code, job_name, job_type_id, 
    mold_master_id, physical_mold_id, company_id, 
    job_status, mold_deadline, has_plug, overall_progress
) VALUES (
    '{job_id}', 'JOB-2026-0001', 'Mold fabrication A-2026-0001', 'NEW_MOLD',
    '{mold_master_id}', '{physical_mold_id}', '{company_id}',
    'IN_PROGRESS', '2026-06-25', true, 25
);

-- Insert Job Steps
INSERT INTO job_steps (
    step_id, job_id, step_no, step_name, step_status, 
    track, planned_start, planned_end, planned_hours, actual_hours
) VALUES 
('{uuid.uuid4()}', '{job_id}', 1, 'CAM Design', 'COMPLETED', 'MOLD', '2026-06-15', '2026-06-16', 4.0, 4.5),
('{uuid.uuid4()}', '{job_id}', 2, 'CNC Milling', 'IN_PROGRESS', 'MOLD', '2026-06-17', '2026-06-19', 12.0, 4.0),
('{uuid.uuid4()}', '{job_id}', 3, 'Plug Woodwork', 'PENDING', 'PLUG', '2026-06-17', '2026-06-18', 6.0, NULL),
('{uuid.uuid4()}', '{job_id}', 4, 'Polishing & assembly', 'PENDING', 'FINISH', '2026-06-20', '2026-06-21', 8.0, NULL);
"""

print("Running seed SQL query...")
resp_sql = run_sql(sql)
print(f"Status: {resp_sql.status_code} -> {resp_sql.text}")
