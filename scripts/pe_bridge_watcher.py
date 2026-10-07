"""
PE-AN Bridge Watcher & Automated Wake-up Daemon
Dự án: YSDMS NextGen — Giao thức Phối hợp Tự trị PE-AN-THOAN v2.0
Mục đích: Tự động phát hiện tin nhắn / chỉ thị mới từ PE trên Supabase Bridge,
          đánh thức hệ thống, thông báo Desktop cho Minh Chủ THOAN,
          và chuẩn bị ngữ cảnh tác vụ cho AN.
"""

import os
import sys
import time
import json
import subprocess
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from supabase import create_client

def load_env():
    env = {}
    with open('.env.local', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env

def get_supabase_client():
    env = load_env()
    url = env.get('NEXT_PUBLIC_SUPABASE_URL')
    key = env.get('SUPABASE_SERVICE_ROLE_KEY')
    if not (url and key):
        print("[ERROR] Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local")
        sys.exit(1)
    return create_client(url, key)

def notify_desktop(title: str, message: str):
    """Bắn thông báo Desktop Balloon Notification trên Windows"""
    try:
        ps_cmd = f'''
        [reflection.assembly]::loadwithpartialname('System.Windows.Forms') | Out-Null
        $notify = new-object system.windows.forms.notifyicon
        $notify.icon = [system.drawing.systemicons]::information
        $notify.visible = $true
        $notify.showballoontip(10, '{title}', '{message}', [system.windows.forms.tooltipicon]::info)
        '''
        subprocess.run(['powershell', '-Command', ps_cmd], capture_output=True, timeout=5)
    except Exception as e:
        print(f"[WARN] Không thể gửi desktop notification: {e}")

    # Phát âm thanh cảnh báo hệ thống
    try:
        import winsound
        winsound.MessageBeep(winsound.MB_ICONASTERISK)
    except Exception:
        pass

def classify_tier(content: str, message_type: str) -> str:
    """Phân loại cấp độ rủi ro theo Giao thức v2.0 (GREEN / YELLOW / RED)"""
    content_upper = content.upper()
    if any(k in content_upper for k in ['ALTER TABLE', 'DROP TABLE', 'CREATE TABLE', 'TRUNCATE', 'UPDATE PRODUCTION', 'DELETE FROM', 'DDL']):
        return 'RED'
    if any(k in content_upper for k in ['SỬA', 'FIX', 'REFECTOR', 'CODE', 'CHỈNH', 'IMPLEMENT', 'THI CÔNG']):
        return 'YELLOW'
    return 'GREEN'

def save_inbox_directive(msg: dict, sp_client):
    """Lưu chỉ thị mới vào file trung tâm để AN và IDE đọc ngay lập tức"""
    inbox_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.agents')
    os.makedirs(inbox_dir, exist_ok=True)
    
    inbox_file_md = os.path.join(inbox_dir, 'PE_INBOX_LATEST.md')
    inbox_file_json = os.path.join(inbox_dir, 'PE_INBOX_LATEST.json')
    
    tier = classify_tier(msg.get('content_md', ''), msg.get('message_type', ''))
    
    # Kiểm tra xem có trích dẫn artifact_id nào không
    content = msg.get('content_md', '')
    referenced_artifact = None
    if 'artifact_id' in content:
        import re
        m = re.search(r"artifact_id\s*=\s*'([a-f0-9\-]+)'", content, re.IGNORECASE)
        if m:
            art_id = m.group(1)
            try:
                art_res = sp_client.table('pe_review_artifacts').select('artifact_id, artifact_name, version, byte_size, created_at').eq('artifact_id', art_id).execute()
                if art_res.data:
                    referenced_artifact = art_res.data[0]
            except Exception as e:
                print(f"[WARN] Không thể lấy metadata artifact {art_id}: {e}")

    md_content = f"""# PE DIRECTIVE INBOX (LATEST)

- **Message ID:** `{msg.get('message_id')}`
- **Thread ID:** `{msg.get('thread_id')}`
- **Sender:** `{msg.get('sender')}`
- **Type:** `{msg.get('message_type')}`
- **Tier:** `{tier}`
- **Received At:** `{datetime.now().strftime('%Y-%m-%d %H:%M:%S JST')}`
- **Status:** `{msg.get('status')}`
"""
    if referenced_artifact:
        md_content += f"""
### Artifact Tham Chiếu:
- **Artifact ID:** `{referenced_artifact.get('artifact_id')}`
- **Tên:** `{referenced_artifact.get('artifact_name')}` (v{referenced_artifact.get('version')})
- **Dung lượng:** {referenced_artifact.get('byte_size')} bytes
"""

    md_content += f"""
---

### Nội Dung Chỉ Thị Từ PE:

{msg.get('content_md')}
"""

    with open(inbox_file_md, 'w', encoding='utf-8') as f:
        f.write(md_content)

    with open(inbox_file_json, 'w', encoding='utf-8') as f:
        json.dump({
            'message_id': msg.get('message_id'),
            'thread_id': msg.get('thread_id'),
            'sender': msg.get('sender'),
            'message_type': msg.get('message_type'),
            'tier': tier,
            'received_at': datetime.now().isoformat(),
            'content_md': msg.get('content_md'),
            'referenced_artifact': referenced_artifact
        }, f, ensure_ascii=False, indent=2)

    print(f"[WAKE-UP] Đã ghi chỉ thị vào {inbox_file_md} (Tier: {tier})")

def check_pending_messages(sp_client, auto_ack=False):
    """Kiểm tra xem có tin nhắn mới từ PE đang ở trạng thái PENDING không"""
    res = sp_client.table('pe_an_messages') \
        .select('*') \
        .eq('sender', 'PE') \
        .eq('status', 'PENDING') \
        .order('created_at', desc=True) \
        .limit(5) \
        .execute()

    messages = res.data or []
    if not messages:
        return []

    print(f"\n[ALERT] Phát hiện {len(messages)} tin nhắn PENDING từ PE!")
    for m in messages:
        mid = m['message_id']
        mtype = m['message_type']
        thread = m['thread_id']
        preview = (m.get('content_md') or '').strip().split('\n')[0][:80]
        
        print(f"  -> [{mtype}] Thread: {thread} | ID: {mid} | {preview}")
        
        # Bắn thông báo desktop
        notify_desktop(
            title=f"YSDMS Bridge - [{mtype}] {thread}",
            message=f"PE vừa gửi chỉ thị mới: {preview}"
        )
        
        # Lưu vào Inbox
        save_inbox_directive(m, sp_client)
        
        if auto_ack:
            # Chuyển trạng thái sang READ
            sp_client.table('pe_an_messages').update({'status': 'READ'}).eq('message_id', mid).execute()
            print(f"  [ACK] Đã đánh dấu {mid} thành READ.")

    return messages

def run_watcher(interval_sec=15, auto_ack=False):
    """Chạy vòng lặp giám sát liên tục (Polling Watcher Daemon)"""
    sp_client = get_supabase_client()
    print("=" * 65)
    print("YSDMS NextGen — PE-AN Bridge Watcher Daemon Started")
    print(f"Polling Interval: {interval_sec} giây | Auto ACK: {auto_ack}")
    print(f"Database Target : {load_env().get('NEXT_PUBLIC_SUPABASE_URL')}")
    print("Đang lắng nghe tin nhắn mới từ PE... (Nhấn Ctrl+C để dừng)")
    print("=" * 65)

    last_checked = time.time()
    try:
        while True:
            try:
                check_pending_messages(sp_client, auto_ack=auto_ack)
            except Exception as e:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] Lỗi kết nối Supabase: {e}")
            
            time.sleep(interval_sec)
    except KeyboardInterrupt:
        print("\n[STOP] Watcher đã dừng an toàn theo yêu cầu người dùng.")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description="PE-AN Bridge Watcher & Wake-up Daemon")
    parser.add_argument('--watch', action='store_true', help="Chạy chế độ watcher daemon liên tục")
    parser.add_argument('--interval', type=int, default=15, help="Khoảng thời gian polling (giây, mặc định 15)")
    parser.add_argument('--auto-ack', action='store_true', help="Tự động đánh dấu READ sau khi nhận")
    parser.add_argument('--check-now', action='store_true', help="Chỉ kiểm tra một lần ngay lập tức")
    
    args = parser.parse_args()
    
    sp = get_supabase_client()
    if args.check_now or not args.watch:
        print("Đang kiểm tra tin nhắn mới từ PE trên Supabase...")
        msgs = check_pending_messages(sp, auto_ack=args.auto_ack)
        if not msgs:
            print("Không có tin nhắn PENDING nào từ PE.")
    else:
        run_watcher(interval_sec=args.interval, auto_ack=args.auto_ack)
