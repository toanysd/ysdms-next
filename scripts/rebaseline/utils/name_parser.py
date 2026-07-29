import re
from typing import Dict, Optional, Any

def parse_mold_name(raw_name: str) -> Dict[str, Any]:
    """
    Parse 3-layer mold names according to SD-01 V4 naming standard.
    Format: {client}-{seq}{variant}[-R{n}][-D|-M][-N{n}][--{pieces}P]
    """
    if not raw_name:
        return _fallback_parse(raw_name)

    raw_name = str(raw_name).strip()
    
    # Simple regex to extract basic parts
    pattern = re.compile(r'^([A-Z0-9]+)-(\d+)([A-Za-z0-9]*?)(?:-R(\d+))?(?:-(D|M))?(?:-N(\d+))?(?:--(\d+)P)?$')
    match = pattern.match(raw_name)
    
    if not match:
        return _fallback_parse(raw_name)
    
    client_code = match.group(1)
    seq_number = match.group(2)
    variant = match.group(3) or ""
    revision = match.group(4)
    mold_type = match.group(5)
    copy_number = match.group(6)
    piece_count = match.group(7)
    
    system_code = raw_name
    
    display_name_parts = [f"{client_code}-{seq_number}"]
    if variant:
        display_name_parts.append(variant)
    if revision:
        display_name_parts.append(f"R{revision}")
    if mold_type:
        display_name_parts.append(mold_type)
    if copy_number:
        display_name_parts.append(f"N{copy_number}")
    if piece_count:
        display_name_parts.append(f"{piece_count}P")
        
    display_name = " ".join(display_name_parts)
    
    physical_stamp_parts = [f"{client_code}-{seq_number}{variant}"]
    if revision:
        physical_stamp_parts.append(f"R{revision}")
        
    physical_stamp = " ".join(physical_stamp_parts)
    
    return {
        "system_code": system_code,
        "display_name": display_name,
        "physical_stamp": physical_stamp,
        "client_code": client_code,
        "seq_number": seq_number,
        "variant": variant if variant else None,
        "revision": int(revision) if revision else None,
        "mold_type": mold_type,
        "copy_number": int(copy_number) if copy_number else None,
        "piece_count": int(piece_count) if piece_count else None
    }

def _fallback_parse(raw_name: Any) -> Dict[str, Any]:
    return {
        "system_code": str(raw_name) if raw_name else None,
        "display_name": str(raw_name) if raw_name else None,
        "physical_stamp": str(raw_name) if raw_name else None,
        "client_code": None,
        "seq_number": None,
        "variant": None,
        "revision": None,
        "mold_type": None,
        "copy_number": None,
        "piece_count": None
    }
