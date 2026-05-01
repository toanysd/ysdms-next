import requests, json

url = 'https://iirezrszalmecsslbruo.supabase.co/rest/v1/'
headers = {'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ'}
res = requests.get(url, headers=headers)

schema = res.json()
try:
    desc = schema['definitions']['order_items']['properties']['mold_id'].get('description', '')
    with open('f:/AntiGravity/ysdms-nextgen/schema_out.txt', 'w', encoding='utf-8') as f:
        f.write('DESC: ' + desc + '\n')
except Exception as e:
    with open('f:/AntiGravity/ysdms-nextgen/schema_out.txt', 'w', encoding='utf-8') as f:
        f.write('Error: ' + str(e))
