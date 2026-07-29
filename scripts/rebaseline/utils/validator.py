import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from collections import defaultdict

class ImportStats:
    """Track imported, skipped, errors per table with reasons."""
    def __init__(self):
        self.stats: Dict[str, Dict[str, Any]] = defaultdict(lambda: {
            "imported": 0,
            "skipped": 0,
            "errors": 0,
            "skip_reasons": defaultdict(int),
            "error_details": []
        })
        
    def add_imported(self, table: str, count: int = 1) -> None:
        self.stats[table]["imported"] += count
        
    def add_skipped(self, table: str, reason: str, count: int = 1) -> None:
        self.stats[table]["skipped"] += count
        self.stats[table]["skip_reasons"][reason] += count
        
    def add_error(self, table: str, error: str) -> None:
        self.stats[table]["errors"] += 1
        self.stats[table]["error_details"].append(error)
        
    def to_dict(self) -> dict:
        result = {}
        for k, v in self.stats.items():
            result[k] = {
                "imported": v["imported"],
                "skipped": v["skipped"],
                "errors": v["errors"],
                "skip_reasons": dict(v["skip_reasons"]),
                "error_details": v["error_details"]
            }
        return result

    def generate_report(self, output_path: str) -> None:
        """Generate markdown import report from tracked stats."""
        generate_report(self.to_dict(), Path(output_path))

    # Aliases used by different importer modules
    def record_success(self, table: str, count: int = 1) -> None:
        """Alias for add_imported (used by tier1-3 importers)."""
        self.add_imported(table, count)

    def record_error(self, table: str, error: str) -> None:
        """Alias for add_error (used by tier1-3 importers)."""
        self.add_error(table, error)

    def log_table(self, table: str, count: int = 1) -> None:
        """Alias for add_imported (used by tier4-6 importers)."""
        self.add_imported(table, count)

    def log_error(self, table: str, *args) -> None:
        """Flexible error logger. Accepts (table, msg) or (table, id, msg)."""
        error_msg = ' | '.join(str(a) for a in args)
        self.add_error(table, error_msg)

def validate_counts(table_name: str, expected: int, actual: int) -> bool:
    """Validate expected vs actual record counts."""
    return expected == actual

def validate_fk(supabase: Any, table: str, fk_col: str, ref_table: str, ref_col: str) -> List[Dict[str, Any]]:
    """Find orphan records where fk_col does not exist in ref_table.ref_col."""
    # Placeholder for actual FK validation using RPC or batch reading
    return []

def generate_report(results: dict, output_path: Path) -> None:
    """Generate markdown import report."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    lines = ["# Re-baseline Import Report\n"]
    
    for table, stats in results.items():
        lines.append(f"## Table: {table}")
        lines.append(f"- **Imported**: {stats.get('imported', 0)}")
        lines.append(f"- **Skipped**: {stats.get('skipped', 0)}")
        lines.append(f"- **Errors**: {stats.get('errors', 0)}")
        
        reasons = stats.get('skip_reasons', {})
        if reasons:
            lines.append("\n### Skip Reasons")
            for reason, count in reasons.items():
                lines.append(f"- {reason}: {count}")
                
        errors = stats.get('error_details', [])
        if errors:
            lines.append("\n### Errors")
            for err in errors[:10]:
                lines.append(f"- {err}")
            if len(errors) > 10:
                lines.append(f"- ... and {len(errors)-10} more")
        lines.append("")
        
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))
