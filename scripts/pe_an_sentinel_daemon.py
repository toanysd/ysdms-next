#!/usr/bin/env python3
"""
PE-AN Sentinel Wakeup Daemon (pe_an_sentinel_daemon.py)
Dự án: YSDMS NextGen — Giao thức Phối hợp Tự trị PE-THOAN-AN v3.3
Mục đích:
  - Canh gác 24/7 bảng public.pe_an_messages trên Supabase.
  - Tự động kích hoạt cơ chế Reactive Wakeup trong Antigravity khi có DIRECTIVE / MESSAGE mới từ PE.
  - Bắn Webhook đánh thức Local Realtime Hub (Port 3456+) để phát tín hiệu SSE cho trình duyệt.
  - Ghi nhận chỉ thị vào .agents/PE_INBOX_LATEST.md.
"""

import os
import sys
import time
import json
import subprocess
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENTS_DIR = os.path.join(ROOT_DIR, '.agents')
os.makedirs(AGENTS_DIR, exist_ok=True)

def load_env():
    env = {}
    env_path = os.path.join(ROOT_DIR, '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ENV = load_env()
SUPABASE_URL = ENV.get('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = ENV.get('SUPABASE_SERVICE_ROLE_KEY', '')

def get_hub_port():
    port_file = os.path.join(AGENTS_DIR, 'hub_port.json')
    if os.path.exists(port_file):
        try:
            with open(port_file, 'r', encoding='utf-8') as f:
                return json.load(f).get('port', 3456)
        except Exception:
            pass
    return 3456

def notify_local_hub(msg):
    import urllib.request
    port = get_hub_port()
    url = f"http://127.0.0.1:{port}/api/directive"
    payload = json.dumps({
        "threadId": msg.get("thread_id", "WO-P1-004"),
        "messageId": msg.get("message_id", "unknown"),
        "messageType": msg.get("message_type", "DIRECTIVE"),
        "directiveText": msg.get("content_md", "")
    }).encode("utf-8")
    try:
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
        urllib.request.urlopen(req, timeout=2)
    except Exception as e:
        pass

def play_alert():
    try:
        import winsound
        winsound.MessageBeep(winsound.MB_ICONEXCLAMATION)
    except Exception:
        pass

def save_inbox_directive(msg):
    inbox_md = os.path.join(AGENTS_DIR, 'PE_INBOX_LATEST.md')
    inbox_json = os.path.join(AGENTS_DIR, 'PE_INBOX_LATEST.json')

    md_content = f"""# PE DIRECTIVE (SENTINEL CAPTURED)

- **Message ID:** `{msg.get('message_id')}`
- **Thread ID:** `{msg.get('thread_id')}`
- **Sender:** `{msg.get('sender')}`
- **Type:** `{msg.get('message_type')}`
- **Received At:** `{datetime.now().strftime('%Y-%m-%d %H:%M:%S JST')}`
- **Status:** `{msg.get('status')}`

---

### Nội Dung Chỉ Thị Từ PE:

{msg.get('content_md')}
"""
    with open(inbox_md, 'w', encoding='utf-8') as f:
        f.write(md_content)

    with open(inbox_json, 'w', encoding='utf-8') as f:
        json.dump({
            "message_id": msg.get("message_id"),
            "thread_id": msg.get("thread_id"),
            "sender": msg.get("sender"),
            "message_type": msg.get("message_type"),
            "received_at": datetime.now().isoformat(),
            "content_md": msg.get("content_md")
        }, f, ensure_ascii=False, indent=2)

def query_pending_messages():
    import urllib.request
    url = f"{SUPABASE_URL}/rest/v1/pe_an_messages?sender=eq.PE&status=eq.PENDING&order=created_at.desc&limit=5"
    req = urllib.request.Request(
        url,
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read().decode("utf-8"))

def run_sentinel():
    print("=" * 65)
    print("🛡️  PE-AN SENTINEL WAKEUP DAEMON (LIVE SENTINEL)")
    print(f"👉 Target Supabase: {SUPABASE_URL}")
    print(f"👉 Local Realtime Hub: http://127.0.0.1:{get_hub_port()}")
    print("👉 Trạng thái: Đang canh gác bảng public.pe_an_messages (Reactive Wakeup ON)")
    print("=" * 65)
    sys.stdout.flush()

    seen_ids = set()

    # Pre-populate seen IDs so we don't alert on existing processed messages
    try:
        initial = query_pending_messages()
        for m in initial:
            seen_ids.add(m['message_id'])
        print(f"[SENTINEL] Đã đồng bộ ban đầu: {len(seen_ids)} tin PENDING hiện có.")
        sys.stdout.flush()
    except Exception as e:
        print(f"[SENTINEL] Cảnh báo khởi tạo: {e}")
        sys.stdout.flush()

    POLL_INTERVAL = 4  # 4 seconds polling for reactive speed

    while True:
        try:
            pending = query_pending_messages()
            for msg in pending:
                mid = msg['message_id']
                if mid not in seen_ids:
                    seen_ids.add(mid)

                    thread_id = msg.get('thread_id', 'UNKNOWN')
                    mtype = msg.get('message_type', 'MESSAGE')
                    content = msg.get('content_md', '')

                    print("\n" + "=" * 65)
                    print(f"⚡ [REACTIVE_WAKEUP] PHÁT HIỆN CHỈ THỊ MỚI TỪ PE!")
                    print(f"ID      : {mid}")
                    print(f"Thread  : {thread_id}")
                    print(f"Loại    : {mtype}")
                    print(f"Thời gian: {datetime.now().strftime('%Y-%m-%d %H:%M:%S JST')}")
                    print("-" * 65)
                    print(content[:500] + ("..." if len(content) > 500 else ""))
                    print("=" * 65 + "\n")
                    sys.stdout.flush()

                    save_inbox_directive(msg)
                    notify_local_hub(msg)
                    play_alert()

        except Exception as e:
            # Silent on network glitch, log to stdout
            pass

        time.sleep(POLL_INTERVAL)

if __name__ == '__main__':
    run_sentinel()
