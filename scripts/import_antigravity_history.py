#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
YSDMS NextGen — Antigravity Conversation History Importer & Recovery Tool
=============================================================================
Mục đích:
  Khôi phục, sao chép hoặc nhập lịch sử thảo luận (conversation history / transcript)
  vào Antigravity sau khi đã ĐÓNG HOÀN TOÀN ứng dụng Antigravity.

Lý do cần chạy khi Antigravity đã đóng:
  - Antigravity mở SQLite ở chế độ WAL (Write-Ahead Logging) với các file .db-wal, .db-shm.
  - Khi ứng dụng đang chạy, nó giữ lock trên database và lưu cache phiên trong bộ nhớ RAM.
  - Mọi thao tác sửa đổi khi Antigravity đang mở sẽ bị lock hoặc bị ghi đè ngược lại từ RAM.
=============================================================================
"""

import os
import sys
import json
import shutil
import sqlite3
import datetime
import subprocess

# Set encoding for Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

APP_DATA = os.path.expanduser('~')
ANTIGRAVITY_DIR = os.path.join(APP_DATA, r'.gemini\antigravity')
CONVERSATIONS_DIR = os.path.join(ANTIGRAVITY_DIR, 'conversations')
BRAIN_DIR = os.path.join(ANTIGRAVITY_DIR, 'brain')

def is_antigravity_running():
    """Kiểm tra xem Antigravity hoặc process liên quan có đang chạy không."""
    try:
        output = subprocess.check_output('tasklist', shell=True, text=True, errors='ignore')
        running_procs = []
        for proc_name in ['antigravity.exe', 'gemini.exe', 'Electron.exe']:
            if proc_name.lower() in output.lower():
                running_procs.append(proc_name)
        return running_procs
    except Exception:
        return []

def get_db_path(conv_id):
    return os.path.join(CONVERSATIONS_DIR, f"{conv_id}.db")

def get_brain_log_dir(conv_id):
    return os.path.join(BRAIN_DIR, conv_id, '.system_generated', 'logs')

def backup_conversation(conv_id):
    """Tạo bản sao lưu an toàn trước khi chỉnh sửa."""
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_dir = os.path.join(ANTIGRAVITY_DIR, 'backups', f"{conv_id}_{timestamp}")
    os.makedirs(backup_dir, exist_ok=True)
    
    db_file = get_db_path(conv_id)
    backed_up = []
    
    for ext in ['', '-wal', '-shm']:
        target = db_file + ext
        if os.path.exists(target):
            dest = os.path.join(backup_dir, os.path.basename(target))
            shutil.copy2(target, dest)
            backed_up.append(dest)
            
    brain_log_dir = get_brain_log_dir(conv_id)
    if os.path.exists(brain_log_dir):
        dest_log = os.path.join(backup_dir, 'logs')
        shutil.copytree(brain_log_dir, dest_log, dirs_exist_ok=True)
        backed_up.append(dest_log)
        
    print(f"✅ Đã sao lưu an toàn vào: {backup_dir}")
    return backup_dir

def import_from_jsonl(target_conv_id, source_jsonl_path):
    """Nhập lịch sử từ file transcript.jsonl vào SQLite .db và brain logs."""
    if not os.path.exists(source_jsonl_path):
        print(f"❌ Không tìm thấy file nguồn: {source_jsonl_path}")
        return False
        
    db_path = get_db_path(target_conv_id)
    print(f"\n📂 File nguồn: {source_jsonl_path}")
    print(f"🎯 Conversation đích: {target_conv_id}")
    print(f"📁 DB đích: {db_path}")
    
    # 1. Đọc và phân tích JSONL
    steps_data = []
    with open(source_jsonl_path, 'r', encoding='utf-8', errors='ignore') as f:
        for line_idx, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            try:
                item = json.loads(line)
                steps_data.append(item)
            except Exception as e:
                print(f"⚠️ Cảnh báo lỗi JSON ở dòng {line_idx + 1}: {e}")
                
    print(f"📊 Đã nạp {len(steps_data)} bước (steps) từ file transcript.")
    if not steps_data:
        print("❌ File không có dữ liệu hợp lệ.")
        return False
        
    # 2. Tạo bản sao lưu trước khi ghi
    backup_conversation(target_conv_id)
    
    # 3. Cập nhật file logs trong brain/
    log_dir = get_brain_log_dir(target_conv_id)
    os.makedirs(log_dir, exist_ok=True)
    target_transcript = os.path.join(log_dir, 'transcript.jsonl')
    target_transcript_full = os.path.join(log_dir, 'transcript_full.jsonl')
    
    shutil.copy2(source_jsonl_path, target_transcript)
    if not os.path.exists(target_transcript_full):
        shutil.copy2(source_jsonl_path, target_transcript_full)
    print(f"✅ Đã ghi {len(steps_data)} dòng vào: {target_transcript}")
    
    # 4. Ghi vào SQLite database
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    # Đảm bảo bảng tồn tại
    cur.execute("""
    CREATE TABLE IF NOT EXISTS `trajectory_meta` (
        `trajectory_id` text,
        `cascade_id` text,
        `trajectory_type` integer,
        `source` integer,
        PRIMARY KEY (`trajectory_id`)
    )
    """)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS `steps` (
        `idx` integer,
        `step_type` integer NOT NULL DEFAULT 0,
        `status` integer NOT NULL DEFAULT 0,
        `has_subtrajectory` numeric NOT NULL DEFAULT false,
        `metadata` blob,
        `error_details` blob,
        `permissions` blob,
        `task_details` blob,
        `render_info` blob,
        `step_payload` blob,
        `step_format` integer NOT NULL DEFAULT 0,
        PRIMARY KEY (`idx`)
    )
    """)
    
    # Đảm bảo trajectory_meta có bản ghi
    cur.execute("SELECT COUNT(*) FROM trajectory_meta WHERE trajectory_id = ?", (target_conv_id,))
    if cur.fetchone()[0] == 0:
        cur.execute("INSERT OR REPLACE INTO trajectory_meta VALUES (?, ?, 1, 1)", (target_conv_id, target_conv_id))
        
    # Xử lý nhập từng step vào bảng steps
    inserted_count = 0
    for idx, step in enumerate(steps_data):
        step_idx = step.get('step_index', idx)
        step_type = 1 if step.get('type') == 'USER_INPUT' else 2 if step.get('type') == 'PLANNER_RESPONSE' else 0
        status = 1 if step.get('status') == 'DONE' else 0
        
        # Serialize payload sang JSON bytes
        payload_bytes = json.dumps(step, ensure_ascii=False).encode('utf-8')
        
        cur.execute("""
        INSERT OR REPLACE INTO steps (idx, step_type, status, has_subtrajectory, step_payload, step_format)
        VALUES (?, ?, ?, 0, ?, 1)
        """, (step_idx, step_type, status, payload_bytes))
        inserted_count += 1
        
    conn.commit()
    
    # Checkpoint WAL và dọn dẹp
    try:
        cur.execute("PRAGMA wal_checkpoint(TRUNCATE);")
        cur.execute("PRAGMA integrity_check;")
        check_res = cur.fetchone()[0]
        print(f"🛡️ Kiểm tra toàn vẹn SQLite: {check_res}")
    except Exception as e:
        print(f"⚠️ Checkpoint warning: {e}")
        
    conn.close()
    
    print(f"\n🎉 HOÀN THÀNH: Đã khôi phục thành công {inserted_count} bước vào conversation [{target_conv_id}]!")
    print("👉 Bây giờ anh có thể mở lại Antigravity để xem lịch sử đã khôi phục.")
    return True

def clone_conversation(source_conv_id, target_conv_id):
    """Sao chép toàn bộ lịch sử từ conversation này sang conversation khác."""
    source_db = get_db_path(source_conv_id)
    if not os.path.exists(source_db):
        print(f"❌ Không tìm thấy database nguồn: {source_db}")
        return False
        
    source_log = os.path.join(get_brain_log_dir(source_conv_id), 'transcript.jsonl')
    if os.path.exists(source_log):
        return import_from_jsonl(target_conv_id, source_log)
    else:
        # Clone trực tiếp SQLite
        backup_conversation(target_conv_id)
        target_db = get_db_path(target_conv_id)
        shutil.copy2(source_db, target_db)
        print(f"✅ Đã sao chép SQLite từ [{source_conv_id}] sang [{target_conv_id}]")
        return True

def main():
    print("=" * 70)
    print("  ANTIGRAVITY CONVERSATION HISTORY IMPORT & RECOVERY UTILITY")
    print("=" * 70)
    
    # 1. Kiểm tra process
    running_procs = is_antigravity_running()
    if running_procs:
        print("⚠️ CẢNH BÁO BẮT BUỘC:")
        print(f"  Phát hiện ứng dụng Antigravity đang chạy ({', '.join(running_procs)})!")
        print("  Để tránh bị khóa file SQLite hoặc bị ghi đè ngược lại từ RAM,")
        print("  XIN VUI LÒNG ĐÓNG HOÀN TOÀN ANTIGRAVITY trước khi chạy script này.")
        print("-" * 70)
        confirm = input("Bạn đã đóng Antigravity chưa? (y/N): ").strip().lower()
        if confirm != 'y':
            print("🛑 Đã hủy thao tác. Hãy đóng Antigravity rồi chạy lại script.")
            return
            
    # 2. Lựa chọn chế độ
    current_conv_id = "9c56ba47-776e-4b8f-8ba9-a8943fc5d0e8"
    print(f"\nConversation ID hiện tại: {current_conv_id}")
    print("\nChọn chức năng:")
    print("1. Khôi phục từ file transcript.jsonl nguồn")
    print("2. Sao chép lịch sử từ Conversation ID khác")
    print("3. Tự động đồng bộ JSONL logs vào SQLite database")
    
    choice = input("\nNhập lựa chọn (1/2/3) [Mặc định: 3]: ").strip() or "3"
    
    if choice == "1":
        source_path = input("Nhập đường dẫn file transcript.jsonl: ").strip().strip('"')
        target_id = input(f"Nhập Target Conversation ID [{current_conv_id}]: ").strip() or current_conv_id
        import_from_jsonl(target_id, source_path)
        
    elif choice == "2":
        source_id = input("Nhập Source Conversation ID: ").strip()
        target_id = input(f"Nhập Target Conversation ID [{current_conv_id}]: ").strip() or current_conv_id
        clone_conversation(source_id, target_id)
        
    elif choice == "3":
        target_id = input(f"Nhập Conversation ID cần đồng bộ [{current_conv_id}]: ").strip() or current_conv_id
        source_log = os.path.join(get_brain_log_dir(target_id), 'transcript.jsonl')
        if os.path.exists(source_log):
            import_from_jsonl(target_id, source_log)
        else:
            print(f"❌ Không tìm thấy log file tại: {source_log}")

if __name__ == '__main__':
    main()
