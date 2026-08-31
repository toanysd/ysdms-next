import csv, codecs, os, requests, json
from collections import Counter
from dotenv import load_dotenv

load_dotenv('.env.local')
DATA_DIR = "source_data/csv-access-data"

def read_csv(filename):
    path = os.path.join(DATA_DIR, filename)
    try:
        with codecs.open(path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
    except UnicodeDecodeError:
        with codecs.open(path, 'r', encoding='shift_jis', errors='replace') as f:
            content = f.read()
    return list(csv.DictReader(content.splitlines()))

key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
headers = {'apikey': key, 'Authorization': 'Bearer ' + key}
url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'

# ============ CHAIN ANALYSIS ============
# Stage A creates equipment from molds.csv
# But ONLY if the mold's MoldDesignID -> molddesign.csv -> TrayID -> products.legacy_id="TRAY-{TrayID}" EXISTS

# Step 1: Get all products with TRAY legacy_id
all_products = {}
offset = 0
while True:
    r = requests.get(url + "products?select=legacy_id,product_id&legacy_id=not.is.null&offset=" + str(offset) + "&limit=1000", headers=headers)
    data = r.json()
    if not data: break
    for row in data:
        if row['legacy_id']:
            all_products[row['legacy_id']] = row['product_id']
    offset += len(data)
    if len(data) < 1000: break

print(f"Total products with legacy_id: {len(all_products)}")
tray_products = {k: v for k, v in all_products.items() if k.startswith('TRAY-')}
print(f"Products with TRAY- prefix: {len(tray_products)}")

# Step 2: Check molddesign.csv -> how many have TrayID that maps to a product?
designs = read_csv('molddesign.csv')
designs_with_product = 0
designs_without_product = 0
valid_design_ids = set()
for d in designs:
    tray_id = d.get('TrayID')
    if tray_id and ("TRAY-" + tray_id) in all_products:
        designs_with_product += 1
        valid_design_ids.add(d.get('MoldDesignID'))
    else:
        designs_without_product += 1

print(f"\nmolddesign.csv: {len(designs)} total")
print(f"  With valid TRAY product: {designs_with_product}")
print(f"  Without valid TRAY product: {designs_without_product} (these are DROPPED from Stage A)")

# Step 3: Check molds.csv -> how many have MoldDesignID that mapped to valid design?
molds = read_csv('molds.csv')
molds_with_valid_design = 0
molds_without_valid_design = 0
for m in molds:
    mdid = m.get('MoldDesignID')
    if mdid and mdid in valid_design_ids:
        molds_with_valid_design += 1
    else:
        molds_without_valid_design += 1

print(f"\nmolds.csv: {len(molds)} total")
print(f"  With valid design chain (-> product): {molds_with_valid_design}")
print(f"  Without valid design chain: {molds_without_valid_design} (DROPPED from Stage A equipment)")

# Step 4: These dropped molds are the 688 gap -> causing 386 job orphans
print(f"\n=== ROOT CAUSE ===")
print(f"molds.csv has {len(molds)} rows")
print(f"But only {molds_with_valid_design} had complete chain: mold -> molddesign -> tray -> product")
print(f"So {molds_without_valid_design} molds were NOT imported into equipment table")
print(f"This caused 386 jobs (mostly recent 2025-2026) to be orphaned")
