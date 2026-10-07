import os
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from supabase import create_client

with open('.env.local') as f:
    for line in f:
        if '=' in line:
            k, v = line.strip().split('=', 1)
            os.environ[k] = v

sp = create_client(os.environ['NEXT_PUBLIC_SUPABASE_URL'], os.environ['SUPABASE_SERVICE_ROLE_KEY'])

customers = [
  {'id': 'shin-ei', 'name': '1. Shin-Ei Hitec', 'ids': ['011b1a81-bcfd-49a0-ab35-5dbe08ab789e', 'efa96dda-5002-49e5-8670-4c1018598a71', 'fb5fdf21-14e0-4916-9d31-fe7d18687fd4', '22811ed4-3031-44dd-b637-eea8d6dfdfe8']},
  {'id': 'jae', 'name': '2. JAE / NLC', 'ids': ['5551651a-6ff6-4ba8-bef4-af2b61e8632a', 'a38885ae-7d7e-469f-9c69-d01a7a9c1574', '8c59a995-3562-4d92-90b0-4f4653f53639', '30f9390b-1c25-4e9d-a794-22520bbd6745', 'c8df3525-2c86-4389-84d5-cbe91beec046']},
  {'id': 'transtron', 'name': '3. Transtron / MRDI / Ohte', 'ids': ['2d2db667-3edf-4662-9659-f41fe6d3d2b1', '94023311-73e9-4e8c-bd8a-cefbb2fb8a64', 'c8b6d3c0-e1af-46e4-8aca-ad41d95f5fd6']},
  {'id': 'fujikura', 'name': '4. Fujikura Composite', 'ids': ['b82f6f09-fc19-419c-ad7a-10432aa9ccb4', '9a01af8b-cbac-41e0-92ac-08e353c2a76e', 'af7ab2f7-4080-4f2c-981f-a32853cf8a21', '3cabfbda-55a5-4868-bf8a-9175dbf6294e', '047c0639-23c2-4da2-bd88-a65d586b8d9d']},
  {'id': 'panasonic', 'name': '5. Panasonic Shirakawa', 'ids': ['f8e174bf-fc8f-45b2-ae53-bc8915692bbc', 'bad9e1de-542f-4bc3-9aa1-c682bde93b5d', 'c6df7010-a681-4b4b-81e8-8f3bd3458bc3', '6ec82694-ab03-4b40-b0b6-d28ed5adc4ce', '4f7d7197-a991-43c2-a61b-22f98fd21ec4']},
  {'id': 'canon-asahi', 'name': '6. Oita Canon / Asahi', 'ids': ['0ea1a54f-c0d9-49a3-8159-a3397c2e2338', '633a3c69-ea1a-46d7-88e0-b03578909d6b', 'ea09189f-1e25-4c4d-8c6a-0684a2b63804', 'ccf301b0-277d-41ec-9b11-b87c1a7b2729']},
  {'id': 'rhythm', 'name': '7. Rhythm / YAC Garter', 'ids': ['46779df5-53c5-4184-95af-8b137d275b1b', 'f4b30d8d-3db2-42fe-b032-e9e0311cba5d', '9a3a4985-aa15-4067-a4f8-f6ad15138ba6', 'e901ab2b-292f-433a-b5b4-149127bf6694']},
  {'id': 'a-and-t', 'name': '8. A&T Corporation', 'ids': ['0d660e4d-180d-40b6-a970-b0a66e0286a2', 'd2d72a20-231f-45b7-a018-90f173fd445c']},
  {'id': 'omura-smk', 'name': '9. Omura Giken / SMK', 'ids': ['2af154c3-4f7a-405b-9502-8f121eada865', '088f9623-9b39-4a76-88f2-9eeba45339d2', 'de3609d8-fe15-4ede-a16f-250d75aa3327', '444c523f-6f9d-4dfa-9500-fc6273da921c']},
  {'id': 'minebea', 'name': '10. MinebeaMitsumi', 'ids': ['53f9b4e8-260b-47d4-80b0-e5f2d02685ca', 'a1523d58-0f28-4d96-b2c6-6d86673b8cec']},
  {'id': 'terada-deimu', 'name': '11. Terada Deimu / Daimyo', 'ids': ['74e54cb1-b756-4dfa-b273-27e7ec1319d2', 'fa18b0fe-62de-4c02-adbc-c527033d1364']}
]

print("=== VERIFYING 11 SSOT CUSTOMERS AUDIT COUNTS (INNER JOIN) ===")
select_clause = "equipment_id, design_revisions!equipment_design_revision_id_fkey!inner(products!design_revisions_product_id_fkey!inner(company_id))"

all_ids = []
total_sum = 0
for c in customers:
    all_ids.extend(c['ids'])
    res = sp.table('equipment').select(select_clause, count='exact').in_('design_revisions.products.company_id', c['ids']).execute()
    count = res.count or len(res.data)
    total_sum += count
    print(f"{c['name']:<28}: {count:>4} molds")

res_all = sp.table('equipment').select(select_clause, count='exact').in_('design_revisions.products.company_id', all_ids).execute()
print("-" * 55)
print(f"SUM OF INDIVIDUALS          : {total_sum:>4} molds")
print(f"DISTINCT MATCHED IN DB      : {res_all.count or len(res_all.data):>4} molds")
