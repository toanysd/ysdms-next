import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\access_delta_round_a_audit.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

jobs_delta = data['delta_candidates_details']['jobs_delta_list']
print(f"=== CHI TIẾT 27 DELTA JOBS ===")
for i, j in enumerate(jobs_delta, 1):
    print(f"{i:2d}. JobID: {j['source_primary_key']} | JobNo: {j['job_no']} | Name: {j['job_name']} | Company: {j['company_name_raw']} (ID: {j['company_id_raw']})")
    print(f"    Status: {j['validation_status']} | Reason: {j['validation_error']}")

with open(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\scripts\access_delta_round_a_audit.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("=== 1. TỔNG HỢP DELTA 27 JOBS ===")
jobs_delta = data['delta_candidates_details']['jobs_delta_list']
print(f"Tổng số Job delta: {len(jobs_delta)}")

print("\n=== 2. TỔNG HỢP DELTA 81 STEPS ===")
steps_orphan = data['delta_candidates_details']['steps_orphan_list']
print(f"- Số Steps mồ côi (JobID = NULL) [UNRESOLVED_PARENT]: {len(steps_orphan)}")

logs_internal = data['delta_candidates_details']['work_logs_internal_list']
logs_orphan = data['delta_candidates_details']['work_logs_orphan_list']
print(f"\n=== 3. TỔNG HỢP DELTA 311 WORK LOGS ===")
print(f"- Số logs an toàn thuộc step [NEW_SAFE_TO_STAGE]: {data['summary_statistics']['work_logs']['by_status']['NEW_SAFE_TO_STAGE']}")
print(f"- Số logs công việc nội bộ xưởng [INTERNAL_TASK]: {len(logs_internal)}")
print(f"- Số logs không có step cha [UNRESOLVED_PARENT]: {len(logs_orphan)}")
print(f"- Tổng giờ công phát sinh: {data['summary_statistics']['work_logs']['total_delta_hours']} giờ")

internal_hours = sum(l['processing_time'] for l in logs_internal)
orphan_hours = sum(l['processing_time'] for l in logs_orphan)
safe_hours = data['summary_statistics']['work_logs']['total_delta_hours'] - internal_hours - orphan_hours

print(f"  * Giờ công safe logs: {safe_hours:.2f} giờ")
print(f"  * Giờ công internal logs: {internal_hours:.2f} giờ")
print(f"  * Giờ công orphan logs: {orphan_hours:.2f} giờ")
