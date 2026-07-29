import pandas as pd
import io
from datetime import datetime
from typing import Any, Optional
from pathlib import Path

def read_csv(filepath: str | Path) -> pd.DataFrame:
    """Read CSV, handle UTF-8 BOM or CP932 encoding cleanly, strip whitespace from column names."""
    with open(filepath, 'rb') as f:
        content = f.read()
        
    if content.startswith(b'\xef\xbb\xbf'):
        df = pd.read_csv(io.BytesIO(content), encoding='utf-8-sig')
    else:
        try:
            df = pd.read_csv(io.BytesIO(content), encoding='cp932')
        except Exception:
            df = pd.read_csv(io.BytesIO(content), encoding='utf-8-sig')
            
    df.columns = df.columns.str.strip()
    return df

def parse_date(value: Any) -> Optional[str]:
    """Parse dates from multiple formats to ISO format YYYY-MM-DD."""
    if pd.isna(value) or not str(value).strip():
        return None
    val_str = str(value).strip()
    formats = ["%m/%d/%Y", "%M/%D/%Y", "%m/%d/%y", "%Y-%m-%d", "%Y/%m/%d", "%Y-%m-%d %H:%M:%S", "%Y/%m/%d %H:%M:%S"]
    for fmt in formats:
        try:
            dt = datetime.strptime(val_str, fmt)
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            continue
    try:
        dt = pd.to_datetime(val_str)
        if not pd.isna(dt):
            return dt.strftime("%Y-%m-%d")
    except Exception:
        pass
    return None

def clean_value(value: Any) -> Any:
    """Convert pandas NaN/NaT to None, strip strings."""
    if pd.isna(value):
        return None
    if isinstance(value, str):
        return value.strip()
    return value

def safe_int(value: Any) -> Optional[int]:
    """Convert to int safely, None on failure."""
    if pd.isna(value):
        return None
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return None

def safe_float(value: Any) -> Optional[float]:
    """Convert to float safely."""
    if pd.isna(value):
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None

def clean_id(value: Any) -> Optional[str]:
    """Convert CSV numeric IDs (199.0, NaN) to clean string keys ('199').
    Returns None if value is NaN/None/empty."""
    if pd.isna(value):
        return None
    if isinstance(value, float):
        if value == int(value):
            return str(int(value))
        return str(value)
    return str(value).strip() if str(value).strip() else None
