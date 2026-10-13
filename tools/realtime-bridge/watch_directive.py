#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/realtime-bridge/watch_directive.py
----------------------------------------
Tiến trình chạy nền (Background Watcher) giúp AN tự động thức dậy
ngay khi PE gửi Chỉ Thị mới vào .agents/PE_INBOX_LATEST.json hoặc Supabase,
đồng thời phát tín hiệu Xác nhận rõ ràng (Explicit AN Acknowledgment).
"""

import os
import sys
import time
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
INBOX_FILE = os.path.join(ROOT_DIR, ".agents", "PE_INBOX_LATEST.json")
PORT_FILE = os.path.join(ROOT_DIR, "tools", "realtime-bridge", "data", "active_port.json")
DEFAULT_HUB_PORT = 3856

def get_active_hub_port():
    if os.path.exists(PORT_FILE):
        try:
            with open(PORT_FILE, "r", encoding="utf-8") as f:
                d = json.load(f)
                return d.get("port", DEFAULT_HUB_PORT)
        except Exception:
            pass
    return DEFAULT_HUB_PORT

def send_explicit_ack(request_id, pe_message_id, thread_id, hub_port=None):
    """Gửi xác nhận rõ ràng gắn liền với đúng pe_message_id và workflowId sang Local Hub"""
    if hub_port is None:
        hub_port = get_active_hub_port()
    try:
        url = f"http://127.0.0.1:{hub_port}/api/ack"
        workflow_id = f"wf-pe-{pe_message_id[:8]}" if pe_message_id else "wf-pe-unknown"
        payload = json.dumps({
            "requestId": request_id or f"req-{int(time.time()*1000)}",
            "peMessageId": pe_message_id,
            "workflowId": workflow_id,
            "threadId": thread_id,
            "worker": "AN_SENTINEL_WATCHER",
            "ackTimestamp": datetime.now(timezone.utc).isoformat()
        }).encode("utf-8")
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=3) as res:
            if res.status == 200:
                print(f"[+] ĐÃ GỬI AN ACKNOWLEDGMENT THÀNH CÔNG CHO MESSAGE: {pe_message_id} (Ghi nhận file đã tới Inbox, chờ Minh Chủ dán vào AN)")
                return True
    except Exception as e:
        print(f"[-] Không thể gửi ACK tới Hub ({e})")
    return False


def notify_agentapi(directive_text, message_id, thread_id):
    """Kích hoạt Antigravity Native AgentAPI để đánh thức AN ngay lập tức"""
    try:
        local_app_data = os.environ.get("LOCALAPPDATA") or os.path.expanduser("~/AppData/Local")
        exe = os.path.join(local_app_data, "Programs", "Antigravity", "resources", "bin", "language_server.exe")
        if not os.path.exists(exe):
            return False
        conv_file = os.path.join(ROOT_DIR, ".agents", "active_conversation_id.txt")
        if not os.path.exists(conv_file):
            return False
        with open(conv_file, "r", encoding="utf-8") as f:
            target_conv = f.read().strip()
        if not target_conv:
            return False
        
        prompt = f"[⚡ DIRECTIVE TỪ PE / MINH CHỦ QUA BRIDGE]\n\n{directive_text}\n\n---\n*Ghi chú: Directive được chuyển tự động vào ô chat qua Native AgentAPI từ Watcher.*"
        import subprocess
        res = subprocess.run([exe, "agentapi", "send-message", f"--title=PE DIRECTIVE", target_conv, prompt], capture_output=True, text=True, timeout=5)
        if res.returncode == 0:
            print(f"[AGENTAPI WAKEUP] 🚀 Đã gửi Directive trực tiếp vào phiên AN ({target_conv[:8]}...) thành công!")
            return True
        else:
            print(f"[AGENTAPI WAKEUP] Cảnh báo lỗi exit code: {res.returncode}")
    except Exception as e:
        print(f"[AGENTAPI WAKEUP] Ngoại lệ: {e}")
    return False


def get_current_message_id():
    if os.path.exists(INBOX_FILE):
        try:
            with open(INBOX_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("messageId")
        except Exception:
            return None
    return None

def watch(interval_sec=2, timeout_sec=1800, loop_mode=False):
    initial_mtime = os.path.getmtime(INBOX_FILE) if os.path.exists(INBOX_FILE) else 0
    initial_msg_id = get_current_message_id()
    start_time = time.time()

    print(f"[*] AN Background Watcher đang lắng nghe chỉ thị mới từ PE...")
    print(f"[*] Base Message ID: {initial_msg_id} | Timeout: {timeout_sec}s | Loop: {loop_mode}")
    sys.stdout.flush()

    last_acked_id = initial_msg_id

    while loop_mode or (time.time() - start_time < timeout_sec):
        time.sleep(interval_sec)
        if os.path.exists(INBOX_FILE):
            mtime = os.path.getmtime(INBOX_FILE)
            if mtime > initial_mtime:
                try:
                    with open(INBOX_FILE, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    current_msg_id = data.get("messageId")
                    if current_msg_id and current_msg_id != last_acked_id:
                        req_id = data.get("requestId")
                        thread_id = data.get("threadId")
                        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        directive_text = data.get("directiveText", "")
                        print(f"\n=======================================================")
                        print(f"⚡ [REACTIVE_WAKEUP] AN SENTINEL PHÁT HIỆN DIRECTIVE MỚI!")
                        print(f"Mã Lệnh/Test : {current_msg_id}")
                        print(f"Thread ID    : {thread_id}")
                        print(f"Request ID   : {req_id}")
                        print(f"Thời điểm    : {now_str}")
                        print(f"-------------------------------------------------------")
                        print(f"NỘI DUNG CHỈ THỊ:\n{directive_text}")
                        print(f"=======================================================\n")
                        sys.stdout.flush()

                        # PERSISTENCE-FIRST AUDIT: Không ACK nếu chỉ thị chưa có UUID Supabase thật
                        # Ngoại lệ kiểm thử: Cho phép các mã test (bắt đầu bằng test- hoặc isTest == True)
                        is_test_directive = str(current_msg_id).startswith("test-") or str(current_msg_id).startswith("manual-an-") or bool(data.get("isTest"))
                        if not is_test_directive and (not current_msg_id or current_msg_id.startswith("pe-") or len(current_msg_id) < 30):
                            print(f"[!] TỪ CHỐI ACK: Message ID [{current_msg_id}] không phải UUID Supabase thật (Vi phạm Persistence-First)!")
                            sys.stdout.flush()
                            continue

                        # Gửi xác nhận rõ ràng AN_RECEIVED gắn exact pe_message_id
                        send_explicit_ack(req_id, current_msg_id, thread_id)
                        last_acked_id = current_msg_id
                        initial_mtime = mtime

                        # Đánh thức AN trực tiếp qua Native AgentAPI
                        notify_agentapi(directive_text, current_msg_id, thread_id)

                        if not loop_mode:
                            print("[REACTIVE_WAKEUP] 🚀 Hoàn tất nhận chỉ thị & ACK. Thoát mã 0 để kích hoạt Antigravity Reactive Wakeup!")
                            sys.stdout.flush()
                            return True
                except Exception:
                    pass

    print("[*] Hết thời gian chờ (Timeout).")
    sys.stdout.flush()
    return False

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="AN Sentinel Background Watcher")
    parser.add_argument("--timeout", type=int, default=3600, help="Timeout in seconds (default: 3600s / 1h)")
    parser.add_argument("--interval", type=int, default=2, help="Check interval in seconds (default: 2s)")
    parser.add_argument("--loop", action="store_true", help="Keep running in continuous loop after ACK")
    args = parser.parse_args()

    success = watch(interval_sec=args.interval, timeout_sec=args.timeout, loop_mode=args.loop)
    sys.exit(0 if success else 1)
