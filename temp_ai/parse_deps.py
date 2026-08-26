import re

with open("temp_ai/phase2_deps.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()

tables = {
    "mold_design_cutters": {"files": set(), "patterns": set()},
    "jobs": {"files": set(), "patterns": set()},
    "production_orders": {"files": set(), "patterns": set()},
    "technical_reviews": {"files": set(), "patterns": set()},
    "mold_work_orders": {"files": set(), "patterns": set()}
}
generic = {"files": set(), "patterns": set()}

for line in lines:
    parts = line.split(":", 2)
    if len(parts) < 3:
        continue
    filepath, linenum, content = parts[0], parts[1], parts[2]
    
    matched_table = None
    m_from = re.search(r"\.from\([\'\""](jobs|production_orders|mold_design_cutters|technical_reviews|mold_work_orders)[\'\""]\)", content)
    if m_from:
        tbl = m_from.group(1)
        tables[tbl]["files"].add(filepath)
        tables[tbl]["patterns"].add("direct query")
        matched_table = tbl

    if not matched_table:
        if "jobs" in filepath.lower(): matched_table = "jobs"
        elif "production" in filepath.lower(): matched_table = "production_orders"
        elif "technical_review" in filepath.lower(): matched_table = "technical_reviews"
        elif "work_order" in filepath.lower(): matched_table = "mold_work_orders"
        elif "mold_design_cutters" in content or "mold_design_cutters" in filepath: matched_table = "mold_design_cutters"
        
    target_dict = tables[matched_table] if matched_table else generic
    
    if target_dict is generic:
        target_dict["files"].add(filepath)
        
    if "physical_mold_id" in content:
        target_dict["patterns"].add("property access")
        if target_dict is not generic: target_dict["files"].add(filepath)
    if "cutter_id" in content:
        target_dict["patterns"].add("property access")
        if target_dict is not generic: target_dict["files"].add(filepath)
    if "physical_molds(" in content:
        target_dict["patterns"].add("FK alias (physical_molds)")
        if target_dict is not generic: target_dict["files"].add(filepath)
    if "cutters(" in content:
        target_dict["patterns"].add("FK alias (cutters)")
        if target_dict is not generic: target_dict["files"].add(filepath)

print("| Bảng | Số file UI phụ thuộc | File chính | Loại pattern |")
print("|---|---|---|---|")
for t, data in tables.items():
    count = len(data["files"])
    files = sorted(list(data["files"]))
    main_files = "<br>".join([f.split("/")[-1] for f in files[:3]])
    if count > 3:
        main_files += f"<br>...(+{count-3} files)"
    patterns = "<br>".join(data["patterns"])
    if count == 0:
        main_files = "-"
        patterns = "-"
    print(f"| {t} | {count} | {main_files} | {patterns} |")

print(f"\nGeneric/Unmapped: {len(generic['files'])} files")
for f in sorted(list(generic["files"]))[:15]:
    print(f"- {f}")
