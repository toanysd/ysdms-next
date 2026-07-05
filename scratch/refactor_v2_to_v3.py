import os
import re
import glob

replacements = {
    r"\.from\(['\"]mold_designs['\"]\)", ".from('design_revisions')",
    r"\.from\(['\"]mold_master['\"]\)", ".from('mold_masters')",
    r"\.from\(['\"]mold_physical['\"]\)", ".from('physical_molds')",
    r"\.from\(['\"]design_masters['\"]\)", ".from('mold_masters')", # Because design_masters was dropped, usually mold_masters is the equivalent
    r"mold_design_id", "design_revision_id",
    r"design_id", "design_revision_id", # this might be risky, but usually correct in this context
    r"\bblade_count\b", "cavity_count",
}

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    
    new_content = content
    # Safe regex replacements
    new_content = re.sub(r"\.from\(['\"]mold_designs['\"]\)", ".from('design_revisions')", new_content)
    new_content = re.sub(r"\.from\(['\"]mold_master['\"]\)", ".from('mold_masters')", new_content)
    new_content = re.sub(r"\.from\(['\"]mold_physical['\"]\)", ".from('physical_molds')", new_content)
    new_content = re.sub(r"mold_design_id", "design_revision_id", new_content)
    # design_id to design_revision_id only in specific contexts like select() or eq()
    # Or just replace blade_count
    new_content = re.sub(r"\bblade_count\b", "cavity_count", new_content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            process_file(os.path.join(root, file))

print("Done")
