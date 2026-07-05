import pandas as pd
from pathlib import Path
import numpy as np

def read_csv_safe(file_path: Path) -> pd.DataFrame:
    """Reads a CSV file, handling Shift-JIS / cp932 encoding first, falling back to utf-8."""
    if not file_path.exists():
        raise FileNotFoundError(f"CSV file not found: {file_path}")
        
    try:
        # Try cp932 (Windows Shift-JIS) first for MS Access exports in Japan
        df = pd.read_csv(file_path, encoding='cp932')
        return df
    except UnicodeDecodeError:
        try:
            # Fallback to utf-8
            df = pd.read_csv(file_path, encoding='utf-8')
            return df
        except Exception as e:
            raise RuntimeError(f"Failed to read {file_path} with both cp932 and utf-8: {e}")

class IdRegistry:
    """
    In-memory registry to map legacy IDs from MS Access to new Supabase UUIDs.
    """
    def __init__(self):
        # Format: self._registry['table_name']['legacy_id'] = 'uuid'
        self._registry = {}
        
    def register(self, table_name: str, legacy_id: str, new_uuid: str):
        if pd.isna(legacy_id) or legacy_id is None or str(legacy_id).strip() == '':
            return
        
        legacy_id_str = str(legacy_id)
        if legacy_id_str.endswith(".0"):
            legacy_id_str = legacy_id_str[:-2]
            
        if table_name not in self._registry:
            self._registry[table_name] = {}
        self._registry[table_name][legacy_id_str] = str(new_uuid)
        
    def resolve(self, table_name: str, legacy_id: str) -> str:
        if pd.isna(legacy_id) or legacy_id is None or str(legacy_id).strip() == '':
            return None
        
        legacy_id_str = str(legacy_id)
        if legacy_id_str.endswith(".0"):
            legacy_id_str = legacy_id_str[:-2]
            
        if table_name in self._registry and legacy_id_str in self._registry[table_name]:
            return self._registry[table_name][legacy_id_str]
        
        return None

def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans NaN and NaT to None for Supabase JSON serialization."""
    df = df.replace({pd.NA: None, pd.NaT: None, np.nan: None})
    return df
