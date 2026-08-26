import os

# 1. LocationMoveModule.tsx
f1 = r'src/app/equipment/_components/detail-modal/modules/LocationMoveModule.tsx'
with open(f1, 'r', encoding='utf-8') as f:
    c1 = f.read()
# Replace the else if physical_mold_id block entirely.
# The block is:
#       } else if ((data as any)?.physical_mold_id) {
#         await supabase
#           .from('physical_molds')
#           .update({
#             usage_status: autoCheckIn ? 'IN_STOCK' : 'OUT_OF_STOCK'
#           } as any)
#           .eq('physical_mold_id', targetEquipmentId)
#       }
c1 = c1.replace('''      } else if ((data as any)?.physical_mold_id) {
        await supabase
          .from('physical_molds')
          .update({
            usage_status: autoCheckIn ? 'IN_STOCK' : 'OUT_OF_STOCK'
          } as any)
          .eq('physical_mold_id', targetEquipmentId)
      }''', '      }')
with open(f1, 'w', encoding='utf-8') as f:
    f.write(c1)

# 2. LocationTab.tsx
f2 = r'src/app/equipment/molds/[id]/tabs/LocationTab.tsx'
with open(f2, 'r', encoding='utf-8') as f:
    c2 = f.read()
c2 = c2.replace("await supabase.from('physical_molds').update({ usage_status: usage }).eq('physical_mold_id', mold.physical_mold_id)", "await supabase.from('equipment').update({ usage_status: usage === 'IN_STOCK' ? 'IN' : 'OUT' } as any).eq('equipment_id', mold.equipment_id)")
c2 = c2.replace("await supabase.from('physical_molds').update({ current_rack_layer_id: selectedRackLayer }).eq('physical_mold_id', mold.physical_mold_id)", "await supabase.from('equipment').update({ current_rack_layer_id: selectedRackLayer } as any).eq('equipment_id', mold.equipment_id)")
c2 = c2.replace("mold.physical_mold_id", "mold.equipment_id")
with open(f2, 'w', encoding='utf-8') as f:
    f.write(c2)

# 3. TransferTab.tsx
f3 = r'src/app/equipment/molds/[id]/tabs/TransferTab.tsx'
with open(f3, 'r', encoding='utf-8') as f:
    c3 = f.read()
c3 = c3.replace(".from('physical_molds')", ".from('equipment')")
c3 = c3.replace(".eq('physical_mold_id', mold.physical_mold_id)", ".eq('equipment_id', mold.equipment_id)")
c3 = c3.replace("mold.physical_mold_id", "mold.equipment_id")
with open(f3, 'w', encoding='utf-8') as f:
    f.write(c3)

# 4. RealtimeReferencePanel.tsx
f4 = r'src/components/equipment/RealtimeReferencePanel.tsx'
with open(f4, 'r', encoding='utf-8') as f:
    c4 = f.read()
c4 = c4.replace(".from('physical_molds')", ".from('equipment')")
with open(f4, 'w', encoding='utf-8') as f:
    f.write(c4)
