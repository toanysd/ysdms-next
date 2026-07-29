from typing import Tuple

def parse_job_type(release_period: str) -> Tuple[str, str]:
    """Parse ReleasePeriod field from jobs.csv to extract job_type."""
    if not release_period:
        return ('OTHER', '10')
        
    val = str(release_period)
    
    if '新規型' in val or '新型' in val:
        return ('NEW_MOLD', '1')
    if '改造' in val:
        return ('MOLD_MODIFY', '2')
    if '保守' in val or '保全' in val:
        return ('MOLD_MAINTAIN', '3')
    if '新規' in val:
        return ('NEW_CUTTER', '4')
    if '追加工' in val:
        return ('ADDITIONAL', '2')
    if '修理' in val:
        return ('REPAIR', '2')
    if '再生' in val:
        return ('REPRODUCTION', '2')
    if '試作' in val:
        return ('TRIAL', '6')
        
    return ('OTHER', '10')
