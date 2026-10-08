import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import psycopg2
from psycopg2.extras import RealDictCursor

def get_connection():
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
    return psycopg2.connect(db_url, connect_timeout=10)

def read_messages(thread_id=None, sender=None, status=None, limit=10):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    query = "SELECT message_id, thread_id, sender, message_type, content_md, status, created_at FROM public.pe_an_messages WHERE 1=1"
    params = []
    if thread_id:
        query += " AND thread_id = %s"
        params.append(thread_id)
    if sender:
        query += " AND sender = %s"
        params.append(sender)
    if status:
        query += " AND status = %s"
        params.append(status)
    query += " ORDER BY created_at DESC LIMIT %s"
    params.append(limit)
    
    cur.execute(query, tuple(params))
    rows = cur.fetchall()
    conn.close()
    return rows

def send_message(thread_id: str, sender: str, message_type: str, content_md: str, status: str = 'PENDING'):
    conn = get_connection()
    cur = conn.cursor()
    insert_sql = """
    INSERT INTO public.pe_an_messages (thread_id, sender, message_type, content_md, status, created_at)
    VALUES (%s, %s, %s, %s, %s, now())
    RETURNING message_id, created_at;
    """
    cur.execute(insert_sql, (thread_id, sender, message_type, content_md, status))
    res = cur.fetchone()
    conn.commit()
    conn.close()

    # Tự động báo về Local Realtime Hub để phát tín hiệu SSE cho trình duyệt chuyển CHẤM XANH
    if sender == 'AN':
        try:
            import urllib.request, json
            port = 3456
            port_file = os.path.join(os.path.dirname(__file__), "..", ".agents", "hub_port.json")
            if os.path.exists(port_file):
                try:
                    with open(port_file, 'r', encoding='utf-8') as pf:
                        port = json.load(pf).get("port", 3456)
                except Exception:
                    pass
            url = f"http://127.0.0.1:{port}/api/report"
            payload = json.dumps({"threadId": thread_id, "pingMessage": "PE đọc Bridge."}).encode('utf-8')
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")
            urllib.request.urlopen(req, timeout=2)
        except Exception:
            pass

    return res[0], res[1]

def mark_read(message_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE public.pe_an_messages SET status = 'READ' WHERE message_id = %s RETURNING message_id;", (message_id,))
    res = cur.fetchone()
    conn.commit()
    conn.close()
    return res[0] if res else None

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'read':
        msgs = read_messages()
        print(f"Total messages found: {len(msgs)}")
        for m in msgs:
            print("="*60)
            print(f"ID      : {m['message_id']}")
            print(f"Thread  : {m['thread_id']}")
            print(f"Sender  : {m['sender']} ({m['message_type']}) - Status: {m['status']}")
            print(f"Time    : {m['created_at']}")
            print(f"Content :\n{m['content_md']}")
    else:
        print("Usage: python scripts/pe_an_messenger.py read")
