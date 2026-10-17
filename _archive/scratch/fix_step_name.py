import sys
sys.stdout.reconfigure(encoding="utf-8")
import os
with open('import_missing_legacy.py', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('import_missing_legacy.py', 'w', encoding='utf-8') as f:
    for line in lines:
        if "'step_no': 1," in line:
            f.write("                    'step_name': f'Legacy Step {s_id}',\n")
            f.write(line)
        else:
            f.write(line)
