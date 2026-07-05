import requests
import json

SUPABASE_URL = "https://iirezrszalmecsslbruo.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ"
HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json"
}

query = """
order_lines(
    line_id,
    order_id,
    line_no,
    product_id,
    quantity,
    due_date,
    orders!inner(
        order_no,
        order_date,
        order_status,
        order_type,
        companies!orders_company_id_fkey(company_name, company_code)
    ),
    products!inner(
        product_id,
        product_code,
        product_name,
        mold_masters(
            mold_master_id,
            design_revisions(
                status
            )
        )
    )
)
"""

url = f"{SUPABASE_URL}/rest/v1/order_lines?select=id:line_id,order_id,line_no,product_id,quantity,delivery_date:due_date,orders!inner(slip_no:order_no,order_date,status:order_status,order_type,customers:companies!orders_company_id_fkey(customer_name_jp:company_name,customer_code:company_code)),product_master:products!inner(id:product_id,code:product_code,name:product_name,mold_masters:mold_masters!mold_masters_product_id_fkey(mold_master_id,design_revisions(status)))"
resp = requests.get(url, headers=HEADERS)
print("Query status:", resp.status_code)
if resp.status_code == 200:
    print(json.dumps(resp.json()[:2], indent=2))
else:
    print(resp.text)
