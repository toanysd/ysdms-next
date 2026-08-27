import os
import pandas as pd
from datetime import datetime

SERVER_PATH = r"\\SERVER\ysd-folder"
OUT_CSV = r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\temp_ai\server_inventory.csv"
OUT_MD = r"d:\AntiGravity_Workspace\apps\ysdms-nextgen\temp_ai\Server_Inventory_Summary.md"

def get_metadata():
    if not os.path.exists(SERVER_PATH):
        print(f"Path not found: {SERVER_PATH}")
        return []

    data = []
    
    # We only care about directories that are likely customer orders
    # "注文書" means order form. We can also include other folders if they contain Excel files.
    
    for root, dirs, files in os.walk(SERVER_PATH):
        for f in files:
            if f.lower().endswith(('.xls', '.xlsx', '.xlsm')):
                full_path = os.path.join(root, f)
                try:
                    stat = os.stat(full_path)
                    
                    # Parent folder is usually the customer name or category
                    parent_dir = os.path.basename(root)
                    
                    data.append({
                        'parent_dir': parent_dir,
                        'file_name': f,
                        'size_bytes': stat.st_size,
                        'mtime': datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),
                        'ctime': datetime.fromtimestamp(stat.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),
                        'full_path': full_path
                    })
                except Exception as e:
                    print(f"Error reading {full_path}: {e}")
                    
    return data

def main():
    print("Scanning server...")
    data = get_metadata()
    if not data:
        print("No Excel files found or path error.")
        return
        
    df = pd.DataFrame(data)
    df.to_csv(OUT_CSV, index=False, encoding='utf-8-sig')
    
    # Generate summary
    print("Generating summary...")
    summary = f"# Báo Cáo Kiểm Kê Dữ Liệu Server (Phase 1)\n\n"
    summary += f"- **Đường dẫn quét:** `{SERVER_PATH}`\n"
    summary += f"- **Tổng số file Excel (.xls, .xlsx, .xlsm):** {len(df)}\n\n"
    
    summary += "## Phân bổ theo thư mục (Khách hàng / Nhóm)\n"
    
    # Group by parent_dir
    group = df.groupby('parent_dir').agg(
        file_count=('file_name', 'count'),
        total_size_mb=('size_bytes', lambda x: x.sum() / (1024*1024)),
        newest_file_date=('mtime', 'max'),
        oldest_file_date=('mtime', 'min')
    ).reset_index().sort_values('file_count', ascending=False)
    
    summary += "| Thư mục | Số lượng file | Tổng dung lượng (MB) | Cũ nhất | Mới nhất |\n"
    summary += "|---|---|---|---|---|\n"
    
    for _, row in group.iterrows():
        summary += f"| `{row['parent_dir']}` | {row['file_count']} | {row['total_size_mb']:.2f} | {row['oldest_file_date']} | {row['newest_file_date']} |\n"
        
    with open(OUT_MD, 'w', encoding='utf-8') as f:
        f.write(summary)
        
    print(f"Inventory complete. Found {len(df)} files.")

if __name__ == "__main__":
    main()
