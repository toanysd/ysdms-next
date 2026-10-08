import os
import sys
import time
import json
import urllib.request
import subprocess

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENTS_DIR = os.path.join(ROOT_DIR, '.agents')

with open(os.path.join(AGENTS_DIR, 'hub_port.json'), 'r') as f:
    hub_info = json.load(f)

port = hub_info['port']
token = hub_info['token']

print(f"Testing Sentinel Wakeup against Hub on port {port}...")

# 1. Start Sentinel as background process
sentinel_proc = subprocess.Popen(
    [sys.executable, os.path.join(ROOT_DIR, 'scripts', 'bridge_sentinel.py')],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    encoding='utf-8'
)

time.sleep(1) # Wait for sentinel to connect

# 2. Dispatch the real message 13da5592-6f7a-4804-a8db-297afaac64c2 (which was inserted in DB)
payload = json.dumps({
    "messageId": "e2b6502b-8760-4b49-a9c0-3e2b9174ada2",
    "threadId": "WO-BRIDGE-HARDENING",
    "directiveText": "TEST_REALTIME_DISPATCH_VERIFICATION"
}).encode('utf-8')

req = urllib.request.Request(
    f"http://127.0.0.1:{port}/api/directive",
    data=payload,
    headers={
        "Content-Type": "application/json",
        "x-bridge-token": token
    }
)

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    print("Hub dispatch response:", res)

# 3. Wait for Sentinel to receive and exit (code 0)
try:
    stdout, stderr = sentinel_proc.communicate(timeout=5)
    print("Sentinel exited with returncode:", sentinel_proc.returncode)
    print("Sentinel stdout:\n", stdout)
    if sentinel_proc.returncode == 0:
        print("✅ SENTINEL TEST PASSED: Successfully woke up and exited with code 0!")
    else:
        print("❌ SENTINEL TEST FAILED: Return code non-zero", sentinel_proc.returncode)
        print("Stderr:", stderr)
except subprocess.TimeoutExpired:
    sentinel_proc.kill()
    print("❌ SENTINEL TEST TIMED OUT")
