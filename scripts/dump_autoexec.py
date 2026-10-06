import win32com.client
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
db_path = os.path.abspath('docs/ysdJOB_20261006.accdb')
temp_dump_file = os.path.abspath('scripts/temp_autoexec_dump.txt')

access = win32com.client.Dispatch("Access.Application")
# Open in exclusive=False, read-only mode if possible
access.OpenCurrentDatabase(db_path, False)

try:
    # 4 is acMacro in Access Object Model
    # acTable=0, acQuery=1, acForm=2, acReport=3, acMacro=4, acModule=5
    access.SaveAsText(4, "AutoExec", temp_dump_file)
    print("Successfully exported AutoExec via SaveAsText!")
    with open(temp_dump_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    print("=== AutoExec Content ===")
    print(content)
except Exception as e:
    print(f"Error reading AutoExec: {e}")
finally:
    access.CloseCurrentDatabase()
    access.Quit()

if os.path.exists(temp_dump_file):
    os.remove(temp_dump_file)
