import sys
from pathlib import Path
import uuid

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from config import CSV_DIR, BATCH_SIZE
from utils.csv_reader import read_csv, parse_date, clean_value, clean_id
from utils.id_registry import IdRegistry
from utils.validator import ImportStats

def import_tier6(supabase, registry: IdRegistry, stats: ImportStats, dry_run: bool = False):
    print("--- Importing Tier 6: Lifecycle ---")

    # 6A. Mold Maintenance (Teflon logs)
    teflon_path = CSV_DIR / 'teflonlog.csv'
    if teflon_path.exists():
        df_teflon = read_csv(teflon_path)
        records = []
        for _, row in df_teflon.iterrows():
            legacy_id = clean_value(row.get('TeflonLogID'))
            physical_mold_id = registry.lookup('physical_molds', clean_id(row.get('MoldID')))
            
            if not physical_mold_id:
                stats.log_error('mold_maintenance', legacy_id, f"Missing MoldID: {row.get('MoldID')}")
                continue
                
            teflon_status = clean_value(row.get('TeflonStatus'))
            status_map = {
                '申請中': 'REQUEST',
                '承認済': 'APPROVED',
                '発送済': 'SENT',
                '受取済': 'RECEIVED'
            }
            status = status_map.get(teflon_status, 'REQUEST')

            company_info = clean_value(row.get('TeflonCompany')) or ''
            teflon_notes = clean_value(row.get('TeflonNotes')) or ''
            combined_notes = f"Vendor: {company_info} | {teflon_notes}".strip(' |')

            record = {
                'maintenance_id': str(uuid.uuid4()),
                'physical_mold_id': physical_mold_id,
                'maintenance_type': 'TEFLON',
                'status': status,
                'request_date': parse_date(row.get('RequestedDate')),
                'completed_date': parse_date(row.get('ReceivedDate')) or parse_date(row.get('SentDate')),
                'notes': combined_notes
            }
            records.append(record)

        stats.log_table('mold_maintenance', len(records))
        if not dry_run and records:
            for i in range(0, len(records), BATCH_SIZE):
                chunk = records[i:i+BATCH_SIZE]
                supabase.table('mold_maintenance').upsert(chunk).execute()
    else:
        print(f"Warning: {teflon_path.name} not found.")

    # 6B. Location History (asset_location_logs)
    location_path = CSV_DIR / 'locationlog.csv'
    if location_path.exists():
        df_loc = read_csv(location_path)
        records = []
        for _, row in df_loc.iterrows():
            legacy_id = clean_value(row.get('LocationLogID'))
            
            mold_id_raw = clean_id(row.get('MoldID'))
            cutter_id_raw = clean_id(row.get('CutterID'))
            
            asset_type = None
            asset_id = None
            
            if mold_id_raw:
                asset_id = registry.lookup('physical_molds', mold_id_raw)
                if asset_id:
                    asset_type = 'MOLD'
            
            if not asset_id and cutter_id_raw:
                asset_id = registry.lookup('cutters', cutter_id_raw)
                if asset_id:
                    asset_type = 'CUTTER'
                    
            if not asset_id:
                stats.log_error('asset_location_logs', legacy_id, "Could not resolve MoldID or CutterID")
                continue

            old_layer_id = registry.lookup('rack_layers', clean_id(row.get('OldRackLayer')))
            new_layer_id = registry.lookup('rack_layers', clean_id(row.get('NewRackLayer')))

            record = {
                'id': str(uuid.uuid4()),
                'asset_id': asset_id,
                'asset_type': asset_type,
                'old_rack_layer_id': old_layer_id,
                'new_rack_layer_id': new_layer_id,
                'moved_by': registry.lookup('employees', clean_id(row.get('EmployeeID'))),
                'moved_at': parse_date(row.get('LogDate')),
                'notes': clean_value(row.get('notes'))
            }
            records.append(record)

        stats.log_table('asset_location_logs', len(records))
        if not dry_run and records:
            for i in range(0, len(records), BATCH_SIZE):
                chunk = records[i:i+BATCH_SIZE]
                supabase.table('asset_location_logs').upsert(chunk).execute()
    else:
        print(f"Warning: {location_path.name} not found.")

    # 6C. Mold Loan Certificates
    borrow_path = CSV_DIR / 'moldborrow.csv'
    if borrow_path.exists():
        df_borrow = read_csv(borrow_path)
        records = []
        for _, row in df_borrow.iterrows():
            legacy_id = clean_value(row.get('MoldBorrowID'))
            
            company_id = registry.lookup('customers', clean_id(row.get('CustomerID')))
            if not company_id:
                company_id = registry.lookup('companies', clean_id(row.get('CustomerID')))

            record = {
                'certificate_id': str(uuid.uuid4()),
                'certificate_no': clean_value(row.get('AssetCode')) or f"CERT-{legacy_id}",
                'mold_owner_id': company_id,
                'requested_date': parse_date(row.get('BorrowDate')),
                'issued_date': parse_date(row.get('BorrowDate')),
                'status': 'ISSUED',
                'notes': f"Name: {clean_value(row.get('AssetName')) or ''} | {clean_value(row.get('BorrowNotes')) or ''}".strip(' |')
            }
            records.append(record)

        stats.log_table('mold_loan_certificates', len(records))
        if not dry_run and records:
            for i in range(0, len(records), BATCH_SIZE):
                chunk = records[i:i+BATCH_SIZE]
                supabase.table('mold_loan_certificates').upsert(chunk).execute()
    else:
        print(f"Warning: {borrow_path.name} not found.")

    print("Tier 6 Import Complete.")
