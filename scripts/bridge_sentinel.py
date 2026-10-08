#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bridge Sentinel Worker (scripts/bridge_sentinel.py)
Dự án: YSDMS NextGen — Phối hợp Tự trị PE-THOAN-AN
Ràng buộc: WO-BRIDGE-HARDENING

Mục đích:
  - Chạy ngầm trong Antigravity (Long-polling authenticated tới Local Hub).
  - Khi Local Hub dispatch một directive:
    1. Kiểm tra Idempotency theo message_id.
    2. Cập nhật status trên Supabase sang READ (Handshake ACK).
    3. Ghi inbox và audit log.
    4. Thoát mã 0 (exit 0) để Antigravity IDE kích hoạt Reactive Wakeup tự nhiên.
"""

import os
import sys
import time
import json
import urllib.request
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENTS_DIR = os.path.join(ROOT_DIR, '.agents')
os.makedirs(AGENTS_DIR, exist_ok=True)

# 1. Đọc cấu hình từ .env.local
env_path = os.path.join(ROOT_DIR, '.env.local')
env = {}
if os.path.exists(env_path):
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")

SUPABASE_URL = env.get('NEXT_PUBLIC_SUPABASE_URL', '')
SUPABASE_KEY = env.get('SUPABASE_SERVICE_ROLE_KEY', '')

def update_supabase_status(message_id, new_status="READ"):
    if not SUPABASE_URL or not SUPABASE_KEY or not message_id:
        return False
    try:
        url = f"{SUPABASE_URL}/rest/v1/pe_an_messages?message_id=eq.{message_id}"
        data = json.dumps({"status": new_status}).encode('utf-8')
        req = urllib.request.Request(
            url,
            data=data,
            method='PATCH',
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            }
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            return True
    except Exception as e:
        print(f"[SENTINEL] Lỗi cập nhật status Supabase: {e}")
        return False

def append_audit_log(event, data=None):
    entry = {
        "timestamp": datetime.now().isoformat(),
        "event": event,
        "actor": "SENTINEL",
        **(data or {})
    }
    log_file = os.path.join(AGENTS_DIR, 'bridge_audit.log')
    try:
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(json.dumps(entry, ensure_ascii=False) + '\n')
    except Exception:
        pass

def main():
    print("[SENTINEL] 🛡️ Khởi động Bridge Sentinel Worker (Hardened v4.0)...")
    sys.stdout.flush()

    port_file = os.path.join(AGENTS_DIR, 'hub_port.json')
    token_file = os.path.join(AGENTS_DIR, 'hub_token.json')

    port = 3456
    host = '127.0.0.1'
    token = ''

    # Đọc port và token
    if os.path.exists(port_file):
        try:
            with open(port_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                port = data.get('port', 3456)
                host = data.get('host', '127.0.0.1')
                token = data.get('token', '')
        except Exception:
            pass

    if not token and os.path.exists(token_file):
        try:
            with open(token_file, 'r', encoding='utf-8') as f:
                token = json.load(f).get('token', '')
        except Exception:
            pass

    print(f"[SENTINEL] Kết nối tới Local Hub tại http://{host}:{port}...")
    sys.stdout.flush()

    url = f"http://{host}:{port}/api/wait_directive"

    # Sentinel Processed Cache
    processed_cache_file = os.path.join(AGENTS_DIR, 'sentinel_processed.json')
    processed_ids = set()
    if os.path.exists(processed_cache_file):
        try:
            with open(processed_cache_file, 'r', encoding='utf-8') as f:
                processed_ids = set(json.load(f))
        except Exception:
            pass

    append_audit_log("SENTINEL_STARTED", {"port": port, "host": host})

    while True:
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "x-bridge-token": token,
                    "User-Agent": "Antigravity-Sentinel/4.0"
                },
                method="GET"
            )

            with urllib.request.urlopen(req, timeout=3600) as resp:
                raw_body = resp.read().decode('utf-8')
                if not raw_body.strip():
                    continue

                res_json = json.loads(raw_body)
                directive = res_json.get('directive', {})
                mid = directive.get('message_id')
                thread_id = directive.get('thread_id', 'UNKNOWN')
                content_md = directive.get('content_md', '')

                if not mid:
                    continue

                # Idempotency check
                if mid in processed_ids:
                    print(f"[SENTINEL] ⏳ Message {mid} đã xử lý, bỏ qua.")
                    append_audit_log("SENTINEL_DUPLICATE_IGNORED", {"messageId": mid, "threadId": thread_id})
                    continue

                processed_ids.add(mid)
                try:
                    with open(processed_cache_file, 'w', encoding='utf-8') as f:
                        json.dump(list(processed_ids)[-200:], f, indent=2)
                except Exception:
                    pass

                print("\n" + "=" * 65)
                print(f"⚡ [REACTIVE_WAKEUP] SENTINEL NHẬN DIRECTIVE MỚI!")
                print(f"Message ID : {mid}")
                print(f"Thread ID  : {thread_id}")
                print(f"Thời gian  : {datetime.now().strftime('%Y-%m-%d %H:%M:%S JST')}")
                print("=" * 65)
                print(content_md[:400] + ("..." if len(content_md) > 400 else ""))
                print("=" * 65 + "\n")
                sys.stdout.flush()

                # Cập nhật ACK vào Supabase: PENDING -> READ
                ack_ok = update_supabase_status(mid, "READ")
                print(f"[SENTINEL] Cập nhật status Supabase sang READ (ACK): {'Thành công' if ack_ok else 'Thất bại'}")

                append_audit_log("SENTINEL_DIRECTIVE_ACKNOWLEDGED", {
                    "messageId": mid,
                    "threadId": thread_id,
                    "dbAckSuccess": ack_ok
                })

                # Bíp âm thanh
                try:
                    import winsound
                    winsound.MessageBeep(winsound.MB_ICONASTERISK)
                except Exception:
                    pass

                # EXIT 0 để Antigravity Native Background Task nhận event hoàn thành và đánh thức Agent!
                sys.exit(0)

        except urllib.error.HTTPError as e:
            if e.code == 401:
                print(f"[SENTINEL ERROR] 401 Unauthorized: Sai token kết nối Local Hub. Thử lại sau 5s...")
                append_audit_log("SENTINEL_AUTH_ERROR", {"code": 401})
                time.sleep(5)
            else:
                time.sleep(3)
        except urllib.error.URLError:
            # Hub đang khởi động hoặc restart, đợi và thử lại
            time.sleep(3)
        except Exception as e:
            time.sleep(3)

if __name__ == '__main__':
    main()
