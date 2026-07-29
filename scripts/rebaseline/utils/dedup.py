from typing import List, Dict, Tuple, Any

def dedup_by_latest(records: List[Dict[str, Any]], key_field: str, date_field: str = 'UpdatedAt') -> Tuple[List[Dict[str, Any]], int]:
    """
    Keep only the record with the latest date_field value for each unique key_field value.
    """
    latest_records: Dict[Any, Dict[str, Any]] = {}
    duplicate_count = 0
    
    for record in records:
        key = record.get(key_field)
        if key is None:
            continue
            
        current_date = record.get(date_field) or ""
        
        if key in latest_records:
            duplicate_count += 1
            existing_date = latest_records[key].get(date_field) or ""
            if current_date > existing_date:
                latest_records[key] = record
        else:
            latest_records[key] = record
            
    return list(latest_records.values()), duplicate_count
