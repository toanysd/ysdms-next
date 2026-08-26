import uuid
import math
from config import CSV_DIR
from utils import read_csv_safe, clean_dataframe, IdRegistry

def import_lifecycle(supabase, registry: IdRegistry):
    print("--- Importing Lifecycle Data ---")
    chunk_size = 500
    
    # 1. mold_maintenance (from teflonlog.csv)
    df_teflon = clean_dataframe(read_csv_safe(CSV_DIR / 'teflonlog.csv'))
    maintenance_records = []
    for _, row in df_teflon.iterrows():
        mold_uuid = registry.resolve('equipment', row['MoldID']) if 'MoldID' in row else None
        if not mold_uuid:
            continue
            
        new_uuid = str(uuid.uuid4())
        
        cost_val = 0
        if 'TeflonCost' in row and str(row['TeflonCost']).replace('.', '', 1).isdigit():
            cost_val = float(row['TeflonCost'])
            
        maintenance_records.append({
            'maintenance_id': new_uuid,
            'physical_mold_id': mold_uuid,
            'maintenance_type': 'TEFLON',  # or row['CoatingType'] if preferred, but schema might require enum
            'request_date': str(row['RequestedDate']) if 'RequestedDate' in row and row['RequestedDate'] else None,
            'completed_date': str(row['ReceivedDate']) if 'ReceivedDate' in row and row['ReceivedDate'] else None,
            'vendor_id': registry.resolve('companies', row['SupplierID']) if 'SupplierID' in row and row['SupplierID'] else None,
            'employee_id': registry.resolve('employees', row['RequestedBy']) if 'RequestedBy' in row and row['RequestedBy'] else None,
            'reason': str(row['Reason']) if 'Reason' in row and row['Reason'] else None,
            'result': str(row['Quality']) if 'Quality' in row and row['Quality'] else None,
            'cost': cost_val,
            'status': str(row['TeflonStatus']) if 'TeflonStatus' in row and row['TeflonStatus'] else 'PENDING',
            'notes': str(row['TeflonNotes']) if 'TeflonNotes' in row and row['TeflonNotes'] else None
        })
    
    for i in range(0, len(maintenance_records), chunk_size):
        supabase.table('mold_maintenance').insert(maintenance_records[i:i+chunk_size]).execute()
    print(f"Imported {len(maintenance_records)} mold_maintenance (teflonlog)")

    # 2. mold_location_history (from locationlog.csv)
    df_loc = clean_dataframe(read_csv_safe(CSV_DIR / 'locationlog.csv'))
    loc_records = []
    for _, row in df_loc.iterrows():
        mold_uuid = registry.resolve('equipment', row['MoldID']) if 'MoldID' in row else None
        if not mold_uuid:
            # We ignore cutter locations or missing molds to satisfy schema
            continue
            
        new_uuid = str(uuid.uuid4())
        
        loc_records.append({
            'location_log_id': new_uuid,
            'physical_mold_id': mold_uuid,
            'old_rack_layer_id': registry.resolve('rack_layers', row['OldRackLayer']) if 'OldRackLayer' in row and row['OldRackLayer'] else None,
            'new_rack_layer_id': registry.resolve('rack_layers', row['NewRackLayer']) if 'NewRackLayer' in row and row['NewRackLayer'] else None,
            'moved_by': registry.resolve('employees', row['EmployeeID']) if 'EmployeeID' in row and row['EmployeeID'] else None,
            'moved_at': str(row['DateEntry']) if 'DateEntry' in row and row['DateEntry'] else None,
            'notes': str(row['notes']) if 'notes' in row and row['notes'] else None
        })
        
    for i in range(0, len(loc_records), chunk_size):
        supabase.table('mold_location_history').insert(loc_records[i:i+chunk_size]).execute()
    print(f"Imported {len(loc_records)} mold_location_history")

    # 3. mold_loan_certificates (from moldborrow.csv)
    df_borrow = clean_dataframe(read_csv_safe(CSV_DIR / 'moldborrow.csv'))
    borrow_records = []
    for _, row in df_borrow.iterrows():
        new_uuid = str(uuid.uuid4())
        
        comp_uuid = registry.resolve('companies', row['CustomerID']) if 'CustomerID' in row else None
        
        # Determine status. Not strictly defined, fallback to ISSUED
        status_val = 'ISSUED'
        
        borrow_records.append({
            'certificate_id': new_uuid,
            'certificate_no': str(row['AssetCode']) if 'AssetCode' in row and row['AssetCode'] else str(row['MoldBorrowID']),
            'mold_owner_id': comp_uuid,
            'requested_date': str(row['EntryDate']) if 'EntryDate' in row and row['EntryDate'] else None,
            'issued_date': str(row['CertificateDate']) if 'CertificateDate' in row and row['CertificateDate'] else None,
            'issued_by': registry.resolve('employees', row['MoldCompany']) if 'MoldCompany' in row and row['MoldCompany'] else None, # Might be an employee ID
            'prepared_by': registry.resolve('employees', row['CreatedBy']) if 'CreatedBy' in row and row['CreatedBy'] else None,
            'certificate_file': str(row['MoldPictureLink']) if 'MoldPictureLink' in row and row['MoldPictureLink'] else None,
            'status': status_val,
            'notes': str(row['Notes']) if 'Notes' in row and row['Notes'] else None
        })
        
    for i in range(0, len(borrow_records), chunk_size):
        supabase.table('mold_loan_certificates').insert(borrow_records[i:i+chunk_size]).execute()
    print(f"Imported {len(borrow_records)} mold_loan_certificates")

    print("Lifecycle data import complete.")
