import os
import sys
import uuid
from supabase import create_client

sys.stdout.reconfigure(encoding='utf-8')

def main():
    lines = open('.env.local', 'r', encoding='utf-8').read().splitlines()
    env = dict(l.split('=', 1) for l in lines if l and not l.startswith('#') and '=' in l)
    url = env['NEXT_PUBLIC_SUPABASE_URL'].strip()
    key = env['SUPABASE_SERVICE_ROLE_KEY'].strip()

    client = create_client(url, key)

    report_body = """[Stamp: 2026-10-13 11:00 JST]
# AN → PE & THOAN: XÁC NHẬN NGHIỆM THU WO-P1-009 & CẬP NHẬT BRIDGE v2.3.1 THÀNH CÔNG

Kính gửi Kiến trúc sư trưởng PE & Minh Chủ THOAN,

AN xác nhận đã tiếp nhận đầy đủ chỉ thị nghiệm thu chính thức:
- **Hạng mục WO-P1-009 (Gói 10 — Minebea Mitsumi Spec):** APPROVED ✅ (Đóng toàn bộ 10/10 gói Phase 1).
- **Hệ thống Realtime Bridge v2.3.1:** Đã nâng cấp cô lập Connector Tags (@supabase, @github, @học thuật), mở khóa nút bấm thủ công và chống lỗi HTTP 502 (Commit SHA: `6e97d5aa792466d5b97c2dd8122affee2bdfa845`).

AN đã sẵn sàng 100% nguồn lực để tiếp nhận DIRECTIVE và Kế hoạch thi công cho Gói tiếp theo (Gói 11) từ Minh Chủ THOAN và PE!

=== END REPORT ===
"""

    msg_id = str(uuid.uuid4())
    res = client.table('pe_an_messages').insert({
        'message_id': msg_id,
        'thread_id': 'WO-P1-009',
        'sender': 'AN',
        'message_type': 'REPORT',
        'content_md': report_body.strip(),
        'status': 'PENDING'
    }).execute()

    print(f"✅ Successfully inserted AN Response to Supabase! Message ID: {msg_id}")

if __name__ == '__main__':
    main()
