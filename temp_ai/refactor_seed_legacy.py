import os

filepath = r'scripts/seed_v5_legacy.py'
if os.path.exists(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace("INSERT INTO public.cutters (cutter_id, cutter_no, cutter_name, pitch_mm, date_entry)", "INSERT INTO public.equipment (equipment_id, equipment_code, display_name, dimensions, entry_date, equipment_type)")
    content = content.replace("f\"({uid}, {code}, {cname}, {pitch}, {date});\\n\"", "f\"({uid}, {code}, {cname}, {pitch}, {date}, 'CUTTER_SEPARATE');\\n\"")
    content = content.replace("ON CONFLICT (cutter_no) DO UPDATE SET pitch_mm = EXCLUDED.pitch_mm, date_entry = EXCLUDED.date_entry;\\n", "ON CONFLICT (equipment_code) DO NOTHING;\\n")
    content = content.replace("(SELECT cutter_id FROM public.cutters WHERE cutter_no = {code})", "(SELECT equipment_id FROM public.equipment WHERE equipment_code = {code})")
    content = content.replace("(SELECT physical_mold_id FROM public.physical_molds WHERE physical_mold_id = {phys_id})", "(SELECT equipment_id FROM public.equipment WHERE equipment_id = {phys_id})")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
