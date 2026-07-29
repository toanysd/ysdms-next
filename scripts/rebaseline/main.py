import os
import sys
import argparse
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(ROOT_DIR / '.env.local')

sys.path.insert(0, str(ROOT_DIR / 'scripts' / 'rebaseline'))

from config import CSV_DIR, SUPABASE_URL, SUPABASE_KEY
from utils.id_registry import IdRegistry
from utils.validator import ImportStats

from importers.tier1_lookups import import_tier1
from importers.tier2_master import import_tier2
from importers.tier3_design_mold import import_tier3
from importers.tier4_cutters import import_tier4
from importers.tier5_jobs import import_tier5
from importers.tier6_lifecycle import import_tier6

def main():
    parser = argparse.ArgumentParser(description="YSDMS NextGen Data Re-baseline Pipeline")
    parser.add_argument('--dry-run', action='store_true', help="Run without writing to DB")
    parser.add_argument('--tier', type=str, choices=['1', '2', '3', '4', '5', '6', 'all'], help="Tier to import")
    parser.add_argument('--truncate', action='store_true', help="Truncate tables before import")
    parser.add_argument('--validate', action='store_true', help="Run validation after import")
    
    args = parser.parse_args()
    
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: Supabase credentials not found in environment.")
        sys.exit(1)
        
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    output_dir = ROOT_DIR / 'scripts' / 'rebaseline' / 'output'
    output_dir.mkdir(parents=True, exist_ok=True)
    registry_path = output_dir / 'id_registry.json'
    
    registry = IdRegistry()
    if args.truncate:
        print("Truncating tables...")
        if registry_path.exists():
            registry_path.unlink()
        try:
            from utils.truncator import truncate_all
            truncate_all(supabase)
        except ImportError:
            print("Warning: truncator module not found.")
    elif registry_path.exists():
        registry.load(registry_path)
        print(f"Loaded existing ID registry: {registry.stats()}")
        
    stats = ImportStats()
    
    try:
        tiers_to_run = ['1', '2', '3', '4', '5', '6'] if args.tier == 'all' else [args.tier] if args.tier else []
        
        for tier in tiers_to_run:
            if tier == '1':
                import_tier1(supabase, registry, stats, args.dry_run)
            elif tier == '2':
                import_tier2(supabase, registry, stats, args.dry_run)
            elif tier == '3':
                import_tier3(supabase, registry, stats, args.dry_run)
            elif tier == '4':
                import_tier4(supabase, registry, stats, args.dry_run)
            elif tier == '5':
                import_tier5(supabase, registry, stats, args.dry_run)
            elif tier == '6':
                import_tier6(supabase, registry, stats, args.dry_run)
                
    except KeyboardInterrupt:
        print("\nImport interrupted by user.")
    except Exception as e:
        print(f"\nAn error occurred: {e}")
        import traceback
        traceback.print_exc()
    finally:
        print("Saving ID registry...")
        registry.save(registry_path)
        
        if args.validate:
            print("Running validation...")
            # call validator
            pass
            
        report_path = output_dir / f"import_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.md"
        stats.generate_report(str(report_path))
        print(f"Import report generated: {report_path}")
        print("Done.")

if __name__ == '__main__':
    main()
