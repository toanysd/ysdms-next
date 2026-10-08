import urllib.request
import json
import sys
import os

def notify_hub(thread_id="WO-BRIDGE-HARDENING", message="PE đọc Bridge."):
    agents_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.agents')
    port_file = os.path.join(agents_dir, 'hub_port.json')
    token_file = os.path.join(agents_dir, 'hub_token.json')
    
    port = 3456
    host = '127.0.0.1'
    token = ''

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

    url = f"http://{host}:{port}/api/report"
    payload = json.dumps({
        "threadId": thread_id,
        "pingMessage": message
    }).encode('utf-8')

    headers = {
        'Content-Type': 'application/json',
        'x-bridge-token': token
    }

    req = urllib.request.Request(url, data=payload, headers=headers)
    
    try:
        with urllib.request.urlopen(req) as response:
            res = response.read()
            print(f"OK: Da gui tin hieu AN_REPORT_DONE den Local Hub (Port {port}): {res.decode('utf-8')}")
            return True
    except Exception as e:
        print(f"ERROR: Loi khi gui tin hieu den Local Hub: {e}")
        return False

if __name__ == "__main__":
    thread = sys.argv[1] if len(sys.argv) > 1 else "WO-BRIDGE-HARDENING"
    msg = sys.argv[2] if len(sys.argv) > 2 else "PE đọc Bridge."
    notify_hub(thread, msg)
