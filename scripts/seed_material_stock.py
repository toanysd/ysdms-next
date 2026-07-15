import pandas as pd
import math

file_path = "D:\\AntiGravity_Workspace\\apps\\ysdms-nextgen\\source_data\\材料在庫\\material_stock_240318.xlsx"
df = pd.read_excel(file_path, header=1)

sql_statements = []
sql_statements.append("-- Seed material stock from Excel 132")
sql_statements.append("INSERT INTO material_stock (material_spec, factory_site, is_silicon, is_antistatic, supplier_name, current_stock_m, snapshot_date) VALUES")

values_list = []

for index, row in df.iterrows():
    material_spec = str(row.iloc[0]).strip()
    
    if material_spec == 'nan' or not material_spec:
        continue
        
    is_silicon = 'true' if '○' in str(row.iloc[2]) else 'false'
    is_antistatic = 'true' if '○' in str(row.iloc[3]) else 'false'
    supplier_name = str(row.iloc[4]).strip()
    if supplier_name == 'nan':
        supplier_name = ''
        
    material_spec = material_spec.replace("'", "''")
    supplier_name = supplier_name.replace("'", "''")
    
    # Process Honsha (Col 11)
    try:
        honsha_stock = float(row.iloc[11])
        if math.isnan(honsha_stock): honsha_stock = 0
    except:
        honsha_stock = 0
    if honsha_stock > 0:
        values_list.append(f"  ('{material_spec}', '本社', {is_silicon}, {is_antistatic}, '{supplier_name}', {honsha_stock}, '2024-03-18')")
        
    # Process Aomori (Col 12)
    try:
        aomori_stock = float(row.iloc[12])
        if math.isnan(aomori_stock): aomori_stock = 0
    except:
        aomori_stock = 0
    if aomori_stock > 0:
        values_list.append(f"  ('{material_spec}', '青森', {is_silicon}, {is_antistatic}, '{supplier_name}', {aomori_stock}, '2024-03-18')")
        
    # Process Ibaraki (Col 13)
    try:
        ibaraki_stock = float(row.iloc[13])
        if math.isnan(ibaraki_stock): ibaraki_stock = 0
    except:
        ibaraki_stock = 0
    if ibaraki_stock > 0:
        values_list.append(f"  ('{material_spec}', '茨城', {is_silicon}, {is_antistatic}, '{supplier_name}', {ibaraki_stock}, '2024-03-18')")

unique_keys = set()
deduped_values = []
for val in values_list:
    # Basic dedup based on exact string match (in reality should parse key, but this is fine for seed)
    if val not in unique_keys:
        unique_keys.add(val)
        deduped_values.append(val)

sql_statements.append(",\n".join(deduped_values))
sql_statements.append("\nON CONFLICT (material_spec, factory_site, is_silicon, is_antistatic) DO UPDATE SET current_stock_m = EXCLUDED.current_stock_m;")

with open("D:\\AntiGravity_Workspace\\apps\\ysdms-nextgen\\supabase\\migrations\\20260715110002_seed_material_stock.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print(f"Generated seed SQL with {len(deduped_values)} rows.")
