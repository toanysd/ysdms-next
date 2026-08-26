import os

files = [
    r'src/app/equipment/molds/[id]/page.tsx',
    r'src/app/equipment/molds/[id]/MoldDetailHeader.tsx',
    r'src/app/equipment/molds/[id]/ReviseMoldModal.tsx',
    r'src/app/equipment/molds/[id]/tabs/OverviewTab.tsx',
    r'src/app/equipment/molds/[id]/tabs/JobsTab.tsx',
    r'src/app/equipment/molds/[id]/tabs/LocationTab.tsx',
    r'src/app/equipment/molds/[id]/tabs/TransferTab.tsx'
]

for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            c = file.read()
        
        c = c.replace('physical_mold_id', 'equipment_id')
        c = c.replace('system_code', 'equipment_code')
        c = c.replace('mold_revision_id', 'design_revision_id')
        c = c.replace('mold_entry_date', 'entry_date')

        with open(f, 'w', encoding='utf-8') as file:
            file.write(c)

