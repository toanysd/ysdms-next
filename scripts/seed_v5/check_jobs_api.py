import urllib.request
import json
from config import SUPABASE_URL, SUPABASE_KEY

def get_table_schema(table_name):
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/", headers={'apikey': SUPABASE_KEY})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        try:
            print(f"{table_name} properties:")
            print(list(data['definitions'][table_name]['properties'].keys()))
        except KeyError:
            print(f"{table_name} not found in OpenAPI definitions.")

get_table_schema('mold_maintenance')
get_table_schema('mold_location_history')
get_table_schema('mold_loan_certificates')
