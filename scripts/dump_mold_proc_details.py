import win32com.client, os, sys
sys.stdout.reconfigure(encoding='utf-8')
db_path = os.path.abspath('docs/ysdJOB_20261006.accdb')
access = win32com.client.Dispatch('Access.Application')
access.OpenCurrentDatabase(db_path, False)
vbe = access.VBE
for comp in vbe.VBProjects(1).VBComponents:
    if comp.Name == 'Form_frmMOLDProcessing':
        cm = comp.CodeModule
        total = cm.CountOfLines
        code = cm.Lines(1, total)
        for block in code.split('Private Sub '):
            if 'btnCheckCreateCutter_Click' in block:
                print("=== btnCheckCreateCutter_Click ===")
                print('Private Sub ' + block[:1500])
        for block in code.split('Public Function '):
            if 'FindCAVIDFlexible' in block:
                print("=== FindCAVIDFlexible ===")
                print('Public Function ' + block[:1500])
access.CloseCurrentDatabase()
access.Quit()
