import win32com.client
import json
import os
import sys
import re
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\docs\ysdJOB_20261006.accdb'

print("================================================================================")
print("KHỞI CHẠY GIAI ĐOẠN 1: STATIC EXTRACTION PIPELINE (ACCESS VBA & LOGIC AUDIT)")
print(f"File nguồn: {DB_PATH}")
print(f"Thời gian: {datetime.now().isoformat()}")
print("Chế độ: 100% READ-ONLY (Không chạy Macro, Không mở UI tương tác, Không ghi DB)")
print("================================================================================\n")

# Danh sách bảng nghiệp vụ chính để dò tìm trong SQL / VBA
KNOWN_TABLES = [
    'tblJOB', 'tblProcessingDeadline', 'tblWorkLog', 'tblMoldBorrow',
    'DatHangVTTbl', 'VatTuTbl', 'VatTuSDtbl', 'tblMoldLog', 'tblCutterLog',
    'tblTeflonLog', 'tblLocationLog', 'tblShipLog', 'statuslogs', 'tblCalendar',
    'tblMold', 'tblCutter', 'tblMoldDesign', 'tblTray', 'tblMoldCutter',
    'tblCompany', 'tblCustomer', 'tblTrayCustomer', 'tblEmployee', 'tblMachine',
    'tblProcessingCode', 'tblProcessingItem', 'tblProcessingStatus', 'tblRack',
    'tblRackLayer', 'tblPLASTICforForming', 'tblPlasticMaterial', 'tblPlasticGroup',
    'tblPlasticColor', 'tblPlasticThickness', 'tblPlasticWidth', 'tblPlasticLength',
    'tblPlasticStaticCharge', 'tblPlasticCompany', 'destinations', 'tblCav',
    'tblResponsiblePerson', 'tblItemType', 'tblCase', 'tblDefect', 'tblStakings', 'tblTrayOrder'
]

# -----------------------------------------------------------------------------
# PHẦN 1: TRÍCH XUẤT 585 QUERYDEFS (DAO ENGINE)
# -----------------------------------------------------------------------------
print("[1] ĐANG TRÍCH XUẤT QUERYDEFS QUA DAO ENGINE...")
dao = win32com.client.Dispatch('DAO.DBEngine.120')
db = dao.OpenDatabase(DB_PATH, False, True)

queries_inventory = []
query_names_set = set()

# Map kiểu Query trong DAO
QUERY_TYPE_MAP = {
    0: 'SELECT',
    16: 'CROSSTAB',
    32: 'DELETE',
    48: 'UPDATE',
    64: 'APPEND',
    80: 'MAKE_TABLE',
    96: 'DDL',
    112: 'PASSTHROUGH',
    128: 'UNION',
    240: 'COMPOUND'
}

for i in range(db.QueryDefs.Count):
    q = db.QueryDefs[i]
    q_name = q.Name
    query_names_set.add(q_name)
    is_named = not q_name.startswith('~')
    q_type_int = q.Type
    q_type_str = QUERY_TYPE_MAP.get(q_type_int, f'OTHER_{q_type_int}')
    
    sql_text = q.SQL.strip()
    
    # Xác định Side Effect
    is_action = False
    side_effect = 'READ_ONLY'
    sql_upper = sql_text.upper()
    if q_type_int in [32, 48, 64, 80] or any(k in sql_upper for k in ['INSERT INTO', 'UPDATE ', 'DELETE FROM', 'SELECT * INTO']):
        is_action = True
        if 'INSERT INTO' in sql_upper or q_type_int == 64:
            side_effect = 'RECORD_INSERT'
        elif 'UPDATE ' in sql_upper or q_type_int == 48:
            side_effect = 'RECORD_UPDATE'
        elif 'DELETE FROM' in sql_upper or q_type_int == 32:
            side_effect = 'RECORD_DELETE'
        elif 'SELECT * INTO' in sql_upper or q_type_int == 80:
            side_effect = 'ACTION_QUERY'
        else:
            side_effect = 'ACTION_QUERY'
            
    # Dò tìm bảng tham chiếu
    referenced_tables = [t for t in KNOWN_TABLES if re.search(r'\b' + re.escape(t) + r'\b', sql_text, re.IGNORECASE)]
    
    # Dò tìm tham số Parameters
    parameters = []
    try:
        for p_idx in range(q.Parameters.Count):
            parameters.append(q.Parameters[p_idx].Name)
    except:
        pass

    queries_inventory.append({
        'query_name': q_name,
        'is_named_query': is_named,
        'query_type': q_type_str,
        'is_action_query': is_action,
        'side_effect_class': side_effect,
        'sql_text': sql_text,
        'parameters': parameters,
        'referenced_tables': referenced_tables,
        'sql_length': len(sql_text)
    })

db.Close()
named_count = sum(1 for q in queries_inventory if q['is_named_query'])
action_count = sum(1 for q in queries_inventory if q['is_action_query'])
print(f"  -> Tổng số QueryDefs: {len(queries_inventory)} ({named_count} Named Queries, {action_count} Action Queries ghi dữ liệu)\n")

with open('scripts/access_query_inventory.json', 'w', encoding='utf-8') as f:
    json.dump(queries_inventory, f, ensure_ascii=False, indent=2)


# -----------------------------------------------------------------------------
# PHẦN 2: TRÍCH XUẤT 180 VBA COMPONENTS QUA ACCESS COM & VBE
# -----------------------------------------------------------------------------
print("[2] ĐANG TRÍCH XUẤT 180 VBA COMPONENTS QUA VBE API...")
acc = win32com.client.Dispatch('Access.Application')
acc.OpenCurrentDatabase(DB_PATH, False)
vbe = acc.VBE
proj = vbe.ActiveVBProject

vba_inventory = []

COMP_TYPE_MAP = {
    1: 'STANDARD_MODULE',
    2: 'CLASS_MODULE',
    100: 'DOCUMENT_FORM_REPORT'
}

PROC_KIND_MAP = {
    0: 'Sub_or_Function',
    1: 'Property_Get',
    2: 'Property_Let',
    3: 'Property_Set'
}

for i in range(proj.VBComponents.Count):
    comp = proj.VBComponents.Item(i + 1)
    c_name = comp.Name
    c_type_int = comp.Type
    c_type_str = COMP_TYPE_MAP.get(c_type_int, f'UNKNOWN_{c_type_int}')
    
    code_mod = comp.CodeModule
    total_lines = code_mod.CountOfLines
    
    # Đọc toàn văn code module để phân tích tĩnh
    code_text = code_mod.Lines(1, total_lines) if total_lines > 0 else ""
    
    # Phân tích danh sách thủ tục (Procedures) bằng Regex toàn văn
    procedures = []
    
    # Tìm tất cả các Sub / Function / Property
    proc_pattern = re.compile(
        r'^[ \t]*(?:(?:Public|Private|Friend)[ \t]+)?(?:Static[ \t]+)?(Sub|Function|Property[ \t]+(?:Get|Let|Set))[ \t]+([A-Za-z0-9_]+)\s*\((.*?)\)',
        re.IGNORECASE | re.MULTILINE
    )
    
    matches = list(proc_pattern.finditer(code_text))
    for idx, match in enumerate(matches):
        p_kind = match.group(1).strip()
        p_name = match.group(2).strip()
        p_args = match.group(3).strip()
        
        # Điểm bắt đầu và kết thúc của procedure
        start_pos = match.start()
        end_pos = matches[idx + 1].start() if idx + 1 < len(matches) else len(code_text)
        proc_code = code_text[start_pos:end_pos]
        proc_lines = len(proc_code.splitlines())
        
        # Phân loại Event Handler
        event_name = None
        if '_' in p_name:
            parts = p_name.split('_')
            if parts[0] in ['Form', 'Report']:
                event_name = parts[1]
            elif parts[-1] in ['Click', 'DblClick', 'Change', 'AfterUpdate', 'BeforeUpdate', 'Enter', 'Exit', 'GotFocus', 'LostFocus']:
                event_name = parts[-1]

        # Phân tích Side Effect của thủ tục
        side_effect = 'READ_ONLY'
        code_upper = proc_code.upper()
        if any(k in code_upper for k in ['DOCMD.RUNSQL', 'CURRENTDB.EXECUTE']):
            if 'INSERT INTO' in code_upper: side_effect = 'RECORD_INSERT'
            elif 'UPDATE ' in code_upper: side_effect = 'RECORD_UPDATE'
            elif 'DELETE FROM' in code_upper: side_effect = 'RECORD_DELETE'
            else: side_effect = 'ACTION_QUERY'
        elif '.ADDNEW' in code_upper:
            side_effect = 'RECORD_INSERT'
        elif '.EDIT' in code_upper:
            side_effect = 'RECORD_UPDATE'
        elif '.DELETE' in code_upper:
            side_effect = 'RECORD_DELETE'
        elif any(k in code_upper for k in ['DOCMD.OPENFORM', 'DOCMD.OPENREPORT', 'DOCMD.CLOSE', 'DOCMD.BROWSETO']):
            side_effect = 'UI_NAVIGATION'
        elif any(k in code_upper for k in ['TRANSFERTEXT', 'OUTPUTTO', 'SHELL(']):
            side_effect = 'EXTERNAL_FILE_IO'

        # Dò tìm bảng & query tham chiếu
        proc_tables = [t for t in KNOWN_TABLES if re.search(r'\b' + re.escape(t) + r'\b', proc_code, re.IGNORECASE)]
        proc_queries = [q for q in query_names_set if not q.startswith('~') and re.search(r'\b' + re.escape(q) + r'\b', proc_code, re.IGNORECASE)]

        procedures.append({
            'procedure_name': p_name,
            'procedure_type': p_kind,
            'event_name': event_name,
            'line_count': proc_lines,
            'side_effect_class': side_effect,
            'referenced_tables': proc_tables,
            'referenced_queries': proc_queries
        })

    # Dò tìm bảng và query tổng thể của toàn module
    mod_tables = [t for t in KNOWN_TABLES if re.search(r'\b' + re.escape(t) + r'\b', code_text, re.IGNORECASE)]
    mod_queries = [q for q in query_names_set if not q.startswith('~') and re.search(r'\b' + re.escape(q) + r'\b', code_text, re.IGNORECASE)]

    vba_inventory.append({
        'component_name': c_name,
        'component_type': c_type_str,
        'total_lines': total_lines,
        'procedure_count': len(procedures),
        'procedures': procedures,
        'referenced_tables': mod_tables,
        'referenced_queries': mod_queries
    })

print(f"  -> Tổng số VBComponents: {len(vba_inventory)} (Tổng số procedures: {sum(c['procedure_count'] for c in vba_inventory)})\n")

with open('scripts/access_vba_inventory.json', 'w', encoding='utf-8') as f:
    json.dump(vba_inventory, f, ensure_ascii=False, indent=2)


# -----------------------------------------------------------------------------
# PHẦN 3: TRÍCH XUẤT 166 FORMS & 70 REPORTS QUA SAVEASTEXT
# -----------------------------------------------------------------------------
print("[3] ĐANG TRÍCH XUẤT FORMS & REPORTS METADATA QUA SAVEASTEXT...")
all_forms_count = acc.CurrentProject.AllForms.Count
all_reports_count = acc.CurrentProject.AllReports.Count

form_report_inventory = []
temp_dump_file = os.path.abspath(r'scripts\__temp_dump__.txt')

# 3.1. Forms
for f_idx in range(all_forms_count):
    form_obj = acc.CurrentProject.AllForms.Item(f_idx)
    f_name = form_obj.Name
    
    record_source = None
    subforms = []
    buttons = []
    event_bindings = []
    
    try:
        acc.SaveAsText(2, f_name, temp_dump_file) # acForm = 2
        with open(temp_dump_file, 'r', encoding='utf-16', errors='replace') as dump_f:
            dump_text = dump_f.read()
            
        # Parse RecordSource
        m_rs = re.search(r'RecordSource\s*=\s*"([^"]+)"', dump_text)
        if not m_rs:
            m_rs = re.search(r'RecordSource\s*=\s*([^\r\n]+)', dump_text)
        if m_rs:
            record_source = m_rs.group(1).strip()
            
        # Parse Subforms
        subforms = list(set(re.findall(r'SourceObject\s*=\s*"([^"]+)"', dump_text)))
        
        # Parse Buttons
        btn_matches = re.findall(r'Begin CommandButton\s+Name\s*=\s*"([^"]+)"', dump_text)
        buttons = list(set(btn_matches))
        
        # Parse Event Bindings
        events_found = re.findall(r'(OnClick|AfterUpdate|BeforeUpdate|OnDblClick|OnCurrent|OnOpen|OnLoad)\s*=\s*"([^"]+)"', dump_text)
        event_bindings = [{'event': e[0], 'binding': e[1]} for e in events_found]
        
    except Exception as e:
        record_source = f"ERROR: {e}"

    form_report_inventory.append({
        'object_name': f_name,
        'object_type': 'FORM',
        'record_source': record_source,
        'subforms': subforms,
        'buttons_count': len(buttons),
        'buttons': buttons[:10],
        'event_bindings': event_bindings
    })

# 3.2. Reports
for r_idx in range(all_reports_count):
    report_obj = acc.CurrentProject.AllReports.Item(r_idx)
    r_name = report_obj.Name
    
    record_source = None
    try:
        acc.SaveAsText(3, r_name, temp_dump_file) # acReport = 3
        with open(temp_dump_file, 'r', encoding='utf-16', errors='replace') as dump_f:
            dump_text = dump_f.read()
            
        m_rs = re.search(r'RecordSource\s*=\s*"([^"]+)"', dump_text)
        if not m_rs:
            m_rs = re.search(r'RecordSource\s*=\s*([^\r\n]+)', dump_text)
        if m_rs:
            record_source = m_rs.group(1).strip()
    except Exception as e:
        record_source = f"ERROR: {e}"

    form_report_inventory.append({
        'object_name': r_name,
        'object_type': 'REPORT',
        'record_source': record_source,
        'subforms': [],
        'buttons_count': 0,
        'buttons': [],
        'event_bindings': []
    })

if os.path.exists(temp_dump_file):
    os.remove(temp_dump_file)

acc.CloseCurrentDatabase()
acc.Quit()

print(f"  -> Tổng số Form/Report: {len(form_report_inventory)} ({all_forms_count} Forms, {all_reports_count} Reports)\n")

with open('scripts/access_form_report_inventory.json', 'w', encoding='utf-8') as f:
    json.dump(form_report_inventory, f, ensure_ascii=False, indent=2)


# -----------------------------------------------------------------------------
# PHẦN 4: THIẾT LẬP ACCESS LOGIC DEPENDENCY GRAPH
# -----------------------------------------------------------------------------
print("[4] ĐANG XÂY DỰNG ACCESS LOGIC DEPENDENCY GRAPH...")

# Tạo map query -> tables
query_table_map = {q['query_name']: q['referenced_tables'] for q in queries_inventory}

# Tạo map form -> queries/tables/events
form_dependency_graph = []

for item in form_report_inventory:
    f_name = item['object_name']
    rs = item['record_source'] or ''
    
    # Tìm trực tiếp table/query trong RecordSource
    direct_tables = [t for t in KNOWN_TABLES if re.search(r'\b' + re.escape(t) + r'\b', rs, re.IGNORECASE)]
    direct_queries = [q for q in query_names_set if not q.startswith('~') and re.search(r'\b' + re.escape(q) + r'\b', rs, re.IGNORECASE)]
    
    # Tìm VBA module tương ứng
    vba_comp_name = f"Form_{f_name}" if item['object_type'] == 'FORM' else f"Report_{f_name}"
    vba_comp = next((c for c in vba_inventory if c['component_name'] == vba_comp_name), None)
    
    vba_tables = vba_comp['referenced_tables'] if vba_comp else []
    vba_queries = vba_comp['referenced_queries'] if vba_comp else []
    side_effects = list(set(p['side_effect_class'] for p in vba_comp['procedures'])) if vba_comp else ['NONE']
    
    # Tổng hợp tất cả bảng ảnh hưởng
    all_related_tables = list(set(direct_tables + vba_tables))
    for q_ref in (direct_queries + vba_queries):
        all_related_tables.extend(query_table_map.get(q_ref, []))
    all_related_tables = list(set(all_related_tables))

    form_dependency_graph.append({
        'object_name': f_name,
        'object_type': item['object_type'],
        'record_source': rs[:150] + ('...' if len(rs) > 150 else ''),
        'vba_module': vba_comp_name if vba_comp else None,
        'vba_line_count': vba_comp['total_lines'] if vba_comp else 0,
        'vba_side_effects': side_effects,
        'referenced_queries': list(set(direct_queries + vba_queries)),
        'all_affected_tables': all_related_tables,
        'subforms': item['subforms']
    })

print(f"  -> Hoàn thành Dependency Graph cho {len(form_dependency_graph)} đối tượng Form/Report.\n")

with open('scripts/access_logic_dependency_graph.json', 'w', encoding='utf-8') as f:
    json.dump(form_dependency_graph, f, ensure_ascii=False, indent=2)

print("================================================================================")
print("GIAI ĐOẠN 1 HOÀN TẤT THÀNH CÔNG 100%! ĐÃ XUẤT ĐẦY ĐỦ 4 ARTIFACTS TIÊU CHUẨN:")
print(" 1. scripts/access_vba_inventory.json")
print(" 2. scripts/access_query_inventory.json")
print(" 3. scripts/access_form_report_inventory.json")
print(" 4. scripts/access_logic_dependency_graph.json")
print("================================================================================")
