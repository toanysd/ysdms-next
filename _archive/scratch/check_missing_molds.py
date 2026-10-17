import os, requests
from dotenv import load_dotenv
load_dotenv('.env.local')
key = os.environ['SUPABASE_SERVICE_ROLE_KEY']
headers = {'apikey': key, 'Authorization': 'Bearer ' + key}
url = os.environ['NEXT_PUBLIC_SUPABASE_URL'] + '/rest/v1/'

missing_mold_ids = ['5901','5902','5903','5897','5895','5893','5892','5898','5899','5900','5891','5896','5889','5894','5817','5821','5890','5884','5888','5887','5885','5886','5881','5804','5883']

found = 0
not_found = 0
for mid in missing_mold_ids:
    legacy_id = "LEGACY-MOLD-" + mid
    r = requests.get(url + "equipment?legacy_id=eq." + legacy_id + "&select=equipment_id,legacy_id,equipment_code", headers=headers)
    data = r.json()
    if data:
        print("MoldID=" + mid + ": FOUND -> " + data[0]["equipment_code"])
        found += 1
    else:
        print("MoldID=" + mid + ": NOT FOUND in equipment")
        not_found += 1

print("\nFound: " + str(found) + ", Not Found: " + str(not_found))
