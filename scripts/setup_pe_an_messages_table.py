import os
import sys
import psycopg2

def setup_messages_table():
    env = {}
    with open('.env.local', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")

    db_url = env.get('DATABASE_URL')
    if not db_url:
        print("Error: DATABASE_URL not found in .env.local")
        sys.exit(1)

    print("Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(db_url, connect_timeout=10)
    cur = conn.cursor()

    migration_file = 'supabase/migrations/20261007_100_pe_an_messages.sql'
    with open(migration_file, 'r', encoding='utf-8') as f:
        ddl = f.read()

    print("Executing Migration 100 DDL...")
    cur.execute(ddl)
    conn.commit()

    # Verify table
    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'pe_an_messages'
        ORDER BY ordinal_position;
    """)
    cols = cur.fetchall()
    print("Table 'pe_an_messages' verified columns:")
    for col in cols:
        print(f"  - {col[0]} ({col[1]})")

    # Insert PE's pilot DIRECTIVE message if not present
    cur.execute("""
        SELECT message_id FROM public.pe_an_messages 
        WHERE thread_id = 'WO-P1-001' AND sender = 'PE' AND message_type = 'DIRECTIVE';
    """)
    existing = cur.fetchone()
    if not existing:
        directive_content = (
            "## DIRECTIVE WO-P1-001 — PILOT KÊNH pe_an_messages\n\n"
            "AN kiểm tra khả năng đọc tin nhắn qua bảng pe_an_messages, xác nhận nhận được DIRECTIVE này, "
            "và phản hồi bằng 1 tin REPORT (sender=AN, thread_id=WO-P1-001, message_type=REPORT) với nội dung "
            "xác nhận đã đọc + kế hoạch thực thi WO-P1-001 (phân hệ /equipment/loans — Lưu giữ & Bàn giao khuôn khách) "
            "theo SSOT MOLD_CUSTODY_BUSINESS_SPEC v1.0."
        )
        cur.execute("""
            INSERT INTO public.pe_an_messages (thread_id, sender, message_type, content_md, status)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING message_id, created_at;
        """, ('WO-P1-001', 'PE', 'DIRECTIVE', directive_content, 'PENDING'))
        res = cur.fetchone()
        conn.commit()
        print(f"\nSeeded PE DIRECTIVE message: ID={res[0]}, Time={res[1]}")
    else:
        print(f"\nPE DIRECTIVE message already exists: ID={existing[0]}")

    conn.close()
    print("\nSetup completed successfully.")

if __name__ == '__main__':
    setup_messages_table()
