import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Action Queries (16 queries)
with open('scripts/access_query_inventory.json', 'r', encoding='utf-8') as f:
    queries = json.load(f)

action_queries = [q for q in queries if q.get('is_action_query')]
print("="*60)
print(f"1. 16 ACTION QUERIES (Total: {len(action_queries)})")
print("="*60)
for q in action_queries:
    sql = q['sql_text'].replace('\r', ' ').replace('\n', ' ')
    if len(sql) > 100:
        sql = sql[:97] + '...'
    print(f"- **{q['query_name']}** (`{q['side_effect_class']}`): Tables: `{q['referenced_tables']}`")
    print(f"  *SQL:* `{sql}`")

# 2. Write Procedures (INSERT / UPDATE / DELETE)
with open('scripts/access_vba_inventory.json', 'r', encoding='utf-8') as f:
    vba = json.load(f)

insert_procs = []
update_procs = []
delete_procs = []
all_write_procs = []

for comp in vba:
    cname = comp['component_name']
    ctype = comp['component_type']
    for p in comp.get('procedures', []):
        se = p.get('side_effect_class')
        tbls = p.get('referenced_tables', [])
        pinfo = {
            'module': cname,
            'proc': p['procedure_name'],
            'type': p['procedure_type'],
            'side_effect': se,
            'tables': tbls,
            'lines': p.get('line_count', 0),
            'table_count': len(tbls)
        }
        if se == 'RECORD_INSERT':
            insert_procs.append(pinfo)
            all_write_procs.append(pinfo)
        elif se == 'RECORD_UPDATE':
            update_procs.append(pinfo)
            all_write_procs.append(pinfo)
        elif se == 'RECORD_DELETE':
            delete_procs.append(pinfo)
            all_write_procs.append(pinfo)

print("\n" + "="*60)
print(f"2. WRITE PROCEDURES SUMMARY: {len(all_write_procs)} total (INSERT: {len(insert_procs)}, UPDATE: {len(update_procs)}, DELETE: {len(delete_procs)})")
print("="*60)

# Top 20 most impactful procedures by number of affected tables and lines
sorted_procs = sorted(all_write_procs, key=lambda x: (x['table_count'], x['lines']), reverse=True)
top_20 = sorted_procs[:20]

print("\n" + "="*60)
print("3. TOP 20 WRITE PROCEDURES BY TABLE IMPACT")
print("="*60)
print("| # | Module | Procedure | Action | Lines | Affected Tables |")
print("|---|---|---|---|---|---|")
for i, p in enumerate(top_20, 1):
    tbl_str = ", ".join(p['tables']) if p['tables'] else "— (Dynamic/Recordset)"
    print(f"| {i} | `{p['module']}` | `{p['proc']}` | `{p['side_effect']}` | {p['lines']} | `{tbl_str}` |")

# Also dump to json
with open('scripts/evidence_top20_write_procedures.json', 'w', encoding='utf-8') as f:
    json.dump(top_20, f, ensure_ascii=False, indent=2)
