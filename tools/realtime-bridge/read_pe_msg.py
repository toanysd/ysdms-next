import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from omni_bridge_messenger import read_from_supabase

res = read_from_supabase(limit=5)
if res.get("ok"):
    for r in res.get("data", []):
        print(f"==================================================")
        print(f"ID: {r.get('id')} | Sender: {r.get('sender')} | Created: {r.get('created_at')}")
        print(f"==================================================")
        print(r.get("content_md", ""))
        print("\n")
else:
    print("Error:", res.get("error"))
