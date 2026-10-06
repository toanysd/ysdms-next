import win32com.client
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

db_path = os.path.abspath('docs/ysdJOB_20261006.accdb')
access = win32com.client.Dispatch("Access.Application")
access.OpenCurrentDatabase(db_path, False)

modules_to_inspect = [
    'ModCopyDataToMoldBorrow', 'ModTeflonSync', 'ModCutterLogRackLayerChange',
    'Form_KyHanGcFrms', 'Form_KyHanGcFrms2', 'Form_ThoiLuongGcFrms3', 'Form_DatHangvtSubFrm',
    'UpdateMoldBorrowFromJAEmoldCheck'
]

vbe = access.VBE
for comp in vbe.VBProjects(1).VBComponents:
    name = comp.Name
    if name in modules_to_inspect:
        cm = comp.CodeModule
        lines = cm.CountOfLines
        code = cm.Lines(1, lines) if lines > 0 else ""
        print("="*60)
        print(f"MODULE: {name} ({lines} lines)")
        print("="*60)
        print(code)
        print("\n")

access.CloseCurrentDatabase()
access.Quit()
