import os

f = r'src/app/actions/mold-revise.ts'
with open(f, 'r', encoding='utf-8') as file:
    c = file.read()

c = c.replace('physical_mold_id', 'equipment_id')

with open(f, 'w', encoding='utf-8') as file:
    file.write(c)

