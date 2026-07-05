import csv
import re
from collections import defaultdict

def parse_mold_name(raw_name):
    name = str(raw_name).strip()
    
    # 1. Resolve Implicit Prefixes
    if re.match(r'^0-[0-9]', name):
        name = "TE-" + name
    elif re.match(r'^E-[0-9]', name):
        name = "YSD-" + name
    elif re.match(r'^\d-[0-9]+', name) and not name.startswith("TE"):
        # Just in case there are 1-127-2, 3-xxx etc which are TE
        name = "TE-" + name
        
    # 2. Extract Revision / Variant suffix
    # We look for patterns at the END of the string.
    # Patterns: R1, R2, No1, No.1, TYPE A, TYPE1, CAV3-4, CAV1,2
    # We can use a regex to capture the base and the suffix.
    
    suffix_pattern = r'\s*(?:(R\d+)|(No\.?\s*\d+)|(TYPE\s*[A-Z0-9]+)|(CAV\s*[0-9A-Z\-\,\.\/]+))(?:\s*VN)?(?:\s*(R\d+|No\.?\s*\d+|TYPE\s*[A-Z0-9]+|CAV.*))?$'
    
    # Simple split heuristic:
    # Find the FIRST occurrence of R\d, No\d, TYPE, or CAV. Everything before is base.
    
    match = re.search(r'\s+((?:R\d+)|(?:NO\.?\s*\d+)|(?:TYPE\s*[A-Z0-9]+)|(?:CAV.*)|(?:[A-Z]\s+TYPE)|(?:[a-zA-Z]+$)|(?:\d+CAV.*))$', name, re.IGNORECASE)
    
    if match:
        base = name[:match.start()].strip()
        rev_raw = match.group(1).strip().upper()
    else:
        # Check if they are attached without space e.g. MTM-185R3 or TE-5-110-8NO1
        match_attached = re.search(r'(R\d+|NO\d+)$', name, re.IGNORECASE)
        if match_attached:
            base = name[:match_attached.start()].strip()
            rev_raw = match_attached.group(1).strip().upper()
        else:
            base = name
            rev_raw = ""

    # Normalize Revision
    rev = rev_raw
    # Convert NO1 or NO.1 to R1
    if rev.startswith("NO"):
        num = re.search(r'\d+', rev)
        if num:
            rev = f"R{num.group()}"
    
    if not rev:
        rev = "R1"
        
    return base, rev

with open('f:/AntiGravity/ysdms-nextgen/source_data/molddesign.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    names = [row['MoldDesignName'] for row in reader if row.get('MoldDesignName')]

parsed_molds = defaultdict(list)
for n in names:
    if not n: continue
    base, rev = parse_mold_name(n)
    parsed_molds[base].append((n, rev))

print(f"Total Unique Base Molds: {len(parsed_molds)}")

sample_keys = list(parsed_molds.keys())

# Let's print some examples, especially the TE and YSD ones
with open('f:/AntiGravity/ysdms-nextgen/scripts/molds_parser_result_utf8.txt', 'w', encoding='utf-8') as out:
    out.write("--- TE Extracted ---\n")
    for k in sample_keys:
        if k.startswith("TE-0") or k.startswith("TE-1"):
            out.write(f"Base: {k} -> Revisions: {[orig + ' => ' + r for orig, r in parsed_molds[k]]}\n")
            
    out.write("\n--- YSD Extracted ---\n")
    for k in sample_keys:
        if k.startswith("YSD-E"):
            out.write(f"Base: {k} -> Revisions: {[orig + ' => ' + r for orig, r in parsed_molds[k]]}\n")

    out.write("\n--- Complex CAV Extracted ---\n")
    for k in sample_keys:
        if "MTM" in k and any("CAV" in orig.upper() for orig, _ in parsed_molds[k]):
            out.write(f"Base: {k} -> Revisions: {[orig + ' => ' + r for orig, r in parsed_molds[k]]}\n")
            
    out.write("\n--- TYPE Extracted ---\n")
    for k in sample_keys:
        if any("TYPE" in orig.upper() for orig, _ in parsed_molds[k]):
            out.write(f"Base: {k} -> Revisions: {[orig + ' => ' + r for orig, r in parsed_molds[k]]}\n")

