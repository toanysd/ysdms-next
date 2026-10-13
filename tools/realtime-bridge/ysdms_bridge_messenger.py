#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
tools/realtime-bridge/ysdms_bridge_messenger.py
---------------------------------------------
CLI & Thư viện giao tiếp dành cho Kỹ sư AN trên dự án YSDMS NextGen:
- Gửi REPORT hoàn tất lên public.pe_an_messages và đánh thức Local Hub chuyển CHẤM XANH 🟢
- Đọc DIRECTIVE mới nhất từ PE trên Supabase
- Kiểm tra trạng thái kết nối của Cầu nối thời gian thực

Tuân thủ:
- Single-Writer Discipline
- Zero Secrets in Git (đọc từ .env.local / .env cục bộ)
- Tương thích 100% với bảng public.pe_an_messages (message_id, thread_id, sender, message_type, content_md, status, created_at)
"""

import os
import sys
import json
import re
import unicodedata
import argparse
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

# Đảm bảo in UTF-8 trên Windows console
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ENV_LOCAL_PATH = os.path.join(ROOT_DIR, ".env.local")
ENV_PATH = os.path.join(ROOT_DIR, ".env")
HUB_PORT_FILE = os.path.join(os.path.dirname(__file__), "data", "active_port.json")
DEFAULT_HUB_PORT = 3856


def load_env():
    env = {}
    for p in [ENV_LOCAL_PATH, ENV_PATH]:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        key = k.strip()
                        if key not in env:
                            env[key] = v.strip().strip("'").strip('"')
    return env


def remove_vietnamese_accents(text: str) -> str:
    """Loại bỏ toàn bộ dấu tiếng Việt sang dạng không dấu ASCII chuẩn"""
    if not text:
        return ""
    text = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', text)
    text = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', text)
    text = re.sub(r'[ìíịỉĩ]', 'i', text)
    text = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', text)
    text = re.sub(r'[ùúụủũưừứựửữ]', 'u', text)
    text = re.sub(r'[ỳýỵỷỹ]', 'y', text)
    text = re.sub(r'[đ]', 'd', text)
    text = re.sub(r'[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]', 'A', text)
    text = re.sub(r'[ÈÉẸẺẼÊỀẾỆỂỄ]', 'E', text)
    text = re.sub(r'[ÌÍỊỈĨ]', 'I', text)
    text = re.sub(r'[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]', 'O', text)
    text = re.sub(r'[ÙÚỤỦŨƯỪỨỰỬỮ]', 'U', text)
    text = re.sub(r'[ỲÝỴỶỸ]', 'Y', text)
    text = re.sub(r'[Đ]', 'D', text)
    nfd_form = unicodedata.normalize('NFD', text)
    return ''.join(c for c in nfd_form if unicodedata.category(c) != 'Mn')


def sanitize_katex_conflicts(text: str) -> str:
    """Thoát các ký tự $ đơn lẻ để tránh KaTeX parse nhầm tiếng Việt thành LaTeX"""
    if not text:
        return ""
    return re.sub(r'\$([0-9a-zA-Z])', lambda m: r'\$' + m.group(1), text)


def get_config():
    env = load_env()
    url = (env.get("NEXT_PUBLIC_SUPABASE_URL") or env.get("VITE_SUPABASE_URL") or env.get("SUPABASE_URL", "")).rstrip("/")
    service_key = env.get("SUPABASE_SERVICE_ROLE_KEY", "")
    anon_key = env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY") or env.get("VITE_SUPABASE_ANON_KEY", "")
    key = service_key or anon_key

    hub_port = DEFAULT_HUB_PORT
    if os.path.exists(HUB_PORT_FILE):
        try:
            with open(HUB_PORT_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                hub_port = data.get("port", DEFAULT_HUB_PORT)
        except Exception:
            pass

    return {
        "supabase_url": url,
        "supabase_key": key,
        "hub_port": hub_port,
        "hub_url": f"http://127.0.0.1:{hub_port}"
    }


def send_to_supabase(thread_id: str, sender: str, content_md: str):
    cfg = get_config()
    if not cfg["supabase_url"] or not cfg["supabase_key"]:
        return {"ok": False, "error": "Thiếu SUPABASE_URL hoặc API key trong .env.local"}

    # BẮT BUỘC: Đảm bảo có stamp thời gian gửi Supabase theo quy định
    jst = timezone(timedelta(hours=9))
    now_jst = datetime.now(jst).strftime("%Y-%m-%d %H:%M:%S")
    if "[GỬI SUPABASE:" not in content_md and "[GUI SUPABASE:" not in content_md:
        has_accents = any(c in content_md for c in "áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđĐ")
        stamp = f"\n\n⏱️ [GỬI SUPABASE: {now_jst} JST]" if has_accents else f"\n\n⏱️ [GUI SUPABASE: {now_jst} JST]"
        content_md = content_md.rstrip() + stamp

    endpoint = f"{cfg['supabase_url']}/rest/v1/pe_an_messages"
    payload = {
        "thread_id": thread_id,
        "sender": sender,
        "message_type": "REPORT",
        "content_md": content_md,
        "status": "PENDING"
    }

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "apikey": cfg["supabase_key"],
            "Authorization": f"Bearer {cfg['supabase_key']}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=12) as res:
            data = json.loads(res.read().decode("utf-8"))
            record = data[0] if isinstance(data, list) and len(data) > 0 else data
            return {"ok": True, "status": res.status, "data": record}
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8")
        return {"ok": False, "status": e.code, "error": err}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def notify_local_hub_report(thread_id: str, message_id: str = None, ping_message: str = "PE đọc Bridge."):
    cfg = get_config()
    endpoint = f"{cfg['hub_url']}/api/report"
    payload = {
        "threadId": thread_id,
        "messageId": message_id,
        "pingMessage": ping_message
    }

    req = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=4) as res:
            return {"ok": True, "status": res.status, "data": json.loads(res.read().decode("utf-8"))}
    except Exception as e:
        return {"ok": False, "error": f"Không thể kết nối Hub tại cổng {cfg['hub_port']}: {e}"}


def read_from_supabase(thread_id: str = None, limit: int = 5):
    cfg = get_config()
    if not cfg["supabase_url"] or not cfg["supabase_key"]:
        return {"ok": False, "error": "Thiếu SUPABASE_URL hoặc API key trong .env.local"}

    query = f"select=message_id,thread_id,sender,message_type,content_md,status,created_at&order=created_at.desc&limit={limit}"
    if thread_id:
        query = f"thread_id=eq.{thread_id}&" + query

    endpoint = f"{cfg['supabase_url']}/rest/v1/pe_an_messages?{query}"
    req = urllib.request.Request(
        endpoint,
        headers={
            "apikey": cfg["supabase_key"],
            "Authorization": f"Bearer {cfg['supabase_key']}"
        },
        method="GET"
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode("utf-8"))
            # Normalize message_id -> id for consistency
            for item in data:
                if "id" not in item and "message_id" in item:
                    item["id"] = item["message_id"]
            return {"ok": True, "data": data}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def cmd_report(args):
    """Lệnh: nộp báo cáo hoàn tất của AN lên Supabase & đánh thức Hub"""
    thread_id = args.thread or "YSDMS-AUTH-PHASE1"
    
    if args.file:
        if not os.path.exists(args.file):
            print(f"[LỖI] Không tìm thấy file báo cáo: {args.file}")
            sys.exit(1)
        with open(args.file, "r", encoding="utf-8") as f:
            content = f.read()
    elif args.message:
        content = args.message
    else:
        print("[LỖI] Phải cung cấp nội dung báo cáo qua --message hoặc --file")
        sys.exit(1)

    if args.no_accent:
        content = remove_vietnamese_accents(content)

    content = sanitize_katex_conflicts(content)

    print(f"🚀 Đang gửi báo cáo lên Supabase (Thread: {thread_id})...")
    res = send_to_supabase(thread_id, sender="AN", content_md=content)

    if not res.get("ok"):
        print(f"❌ Thất bại khi gửi lên Supabase: {res.get('error')}")
        sys.exit(1)

    record = res.get("data", {})
    record_id = record.get("message_id") or record.get("id")
    print(f"✅ Đã lưu vào public.pe_an_messages thành công! (ID: {record_id})")

    # Lưu bản copy cục bộ
    latest_report_file = os.path.join(os.path.dirname(__file__), "data", "AN_REPORT_LATEST.md")
    try:
        with open(latest_report_file, "w", encoding="utf-8") as f:
            f.write(content)
    except Exception:
        pass

    # Thông báo đánh thức Hub
    print("📡 Đang gửi tín hiệu đánh thức Local Hub...")
    ping_msg = args.ping or "PE đọc Bridge."
    hub_res = notify_local_hub_report(thread_id, message_id=record_id, ping_message=ping_msg)
    if hub_res.get("ok"):
        print(f"🟢 Hub đã tiếp nhận! Userscript chuyển CHẤM XANH 🟢 và sẵn sàng gọi PE.")
    else:
        print(f"⚠️ Hub cảnh báo: {hub_res.get('error')}")
        print("  (Minh Chủ vẫn có thể bấm [🚀 Đổ báo cáo vào PE] bằng tay qua Userscript).")


def cmd_read(args):
    """Lệnh: đọc các bản tin hoặc chỉ thị mới nhất trên Supabase"""
    thread_id = args.thread
    limit = args.limit or 3
    print(f"📥 Đang đọc {limit} bản tin mới nhất từ public.pe_an_messages...")
    res = read_from_supabase(thread_id=thread_id, limit=limit)
    if not res.get("ok"):
        print(f"❌ Lỗi: {res.get('error')}")
        sys.exit(1)

    messages = res.get("data", [])
    if not messages:
        print("Trống: Chưa có bản tin nào trên thread này.")
        return

    print("=" * 60)
    for m in messages:
        sender = m.get("sender")
        m_id = m.get("message_id") or m.get("id")
        created = m.get("created_at")
        text = m.get("content_md", "").strip()
        first_line = text.split("\n")[0][:100]
        print(f"[{created}] {sender} (ID: {m_id}):")
        print(f"  {first_line}...")
        print("-" * 60)


def cmd_status(args):
    """Kiểm tra trạng thái kết nối Hub và Supabase"""
    cfg = get_config()
    print("==================================================")
    print("  TRẠNG THÁI CẦU NỐI REALTIME BRIDGE (YSDMS NEXTGEN)")
    print("==================================================")
    print(f"Supabase URL: {cfg['supabase_url'] or 'CHƯA CẤU HÌNH'}")
    print(f"API Key:      {'ĐÃ CÓ' if cfg['supabase_key'] else 'CHƯA CÓ'}")
    print(f"Hub URL:      {cfg['hub_url']}")

    # Thử ping Hub
    try:
        req = urllib.request.Request(f"{cfg['hub_url']}/api/status", method="GET")
        with urllib.request.urlopen(req, timeout=2) as r:
            data = json.loads(r.read().decode("utf-8"))
            uptime_str = f", Uptime: {data['uptime']:.1f}s" if data.get("uptime") is not None else ""
            print(f"Hub Health:   🟢 ONLINE (Cổng {data.get('port')}{uptime_str})")
    except Exception as e:
        print(f"Hub Health:   🔴 OFFLINE ({e})")

    # Thử ping Supabase
    try:
        res = read_from_supabase(limit=1)
        if res.get("ok"):
            print("Supabase DB:  🟢 KẾT NỐI TỐT (public.pe_an_messages)")
        else:
            print(f"Supabase DB:  🔴 LỖI ({res.get('error')})")
    except Exception as e:
        print(f"Supabase DB:  🔴 LỖI ({e})")
    print("==================================================")


def main():
    parser = argparse.ArgumentParser(description="CLI Cầu nối Realtime Bridge PE-AN cho YSDMS NextGen")
    subparsers = parser.add_subparsers(dest="command", help="Lệnh thực hiện")

    # Subcommand: report
    p_report = subparsers.add_parser("report", help="Nộp báo cáo hoàn tất của AN lên Supabase")
    p_report.add_argument("--thread", "-t", default="YSDMS-AUTH-PHASE1", help="Thread ID")
    p_report.add_argument("--file", "-f", help="Đường dẫn tệp Markdown chứa báo cáo")
    p_report.add_argument("--message", "-m", help="Nội dung báo cáo dạng chuỗi trực tiếp")
    p_report.add_argument("--ping", "-p", default="PE đọc Bridge.", help="Thông điệp mồi khi đổ vào ô chat PE")
    p_report.add_argument("--no-accent", action="store_true", help="Tự động loại bỏ toàn bộ dấu tiếng Việt")

    # Subcommand: read
    p_read = subparsers.add_parser("read", help="Đọc các bản tin từ Supabase")
    p_read.add_argument("--thread", "-t", help="Thread ID (bỏ trống để đọc mọi thread)")
    p_read.add_argument("--limit", "-n", type=int, default=3, help="Số lượng bản tin đọc")

    # Subcommand: status
    subparsers.add_parser("status", help="Kiểm tra trạng thái Cầu nối")

    args = parser.parse_args()
    if args.command == "report":
        cmd_report(args)
    elif args.command == "read":
        cmd_read(args)
    elif args.command == "status":
        cmd_status(args)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
