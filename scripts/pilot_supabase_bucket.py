import os
import sys
import json
import urllib.request
import urllib.error

# 1. Parse .env.local
env = {}
if os.path.exists('.env.local'):
    with open('.env.local', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env[k.strip()] = v.strip().strip('"').strip("'")

supabase_url = env.get('NEXT_PUBLIC_SUPABASE_URL')
service_key = env.get('SUPABASE_SERVICE_ROLE_KEY')
anon_key = env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not supabase_url or not service_key:
    print('Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing!')
    sys.exit(1)

print('Supabase URL:', supabase_url)
bucket_name = 'ssot-artifacts'

# 2. Check existing buckets
list_url = f"{supabase_url}/storage/v1/bucket"
req = urllib.request.Request(list_url, headers={
    'Authorization': f'Bearer {service_key}',
    'apikey': service_key
})

try:
    with urllib.request.urlopen(req) as res:
        buckets = json.loads(res.read().decode('utf-8'))
        print('Existing buckets:', [b.get('name') for b in buckets])
        bucket_exists = any(b.get('name') == bucket_name for b in buckets)
except Exception as e:
    print('Failed to list buckets:', e)
    bucket_exists = False

# 3. Create public bucket if not exists
if not bucket_exists:
    print(f"Creating public bucket '{bucket_name}'...")
    create_url = f"{supabase_url}/storage/v1/bucket"
    payload = json.dumps({
        'name': bucket_name,
        'id': bucket_name,
        'public': True,
        'file_size_limit': 52428800,  # 50MB
        'allowed_mime_types': ['text/markdown', 'text/plain', 'application/json', 'application/pdf']
    }).encode('utf-8')
    req = urllib.request.Request(create_url, data=payload, headers={
        'Authorization': f'Bearer {service_key}',
        'apikey': service_key,
        'Content-Type': 'application/json'
    }, method='POST')
    try:
        with urllib.request.urlopen(req) as res:
            print('Bucket created successfully:', res.status)
    except Exception as e:
        print('Error creating bucket:', e)
else:
    print(f"Bucket '{bucket_name}' already exists.")

# 4. Upload MOLD_CUSTODY_BUSINESS_SPEC.md
file_path = 'docs/business/MOLD_CUSTODY_BUSINESS_SPEC.md'
target_object = 'MOLD_CUSTODY_BUSINESS_SPEC.md'

with open(file_path, 'rb') as f:
    file_bytes = f.read()

upload_url = f"{supabase_url}/storage/v1/object/{bucket_name}/{target_object}"
print(f"Uploading {file_path} ({len(file_bytes)} bytes) to {upload_url}...")

# Use POST or PUT with upsert header
req = urllib.request.Request(upload_url, data=file_bytes, headers={
    'Authorization': f'Bearer {service_key}',
    'apikey': service_key,
    'Content-Type': 'text/markdown; charset=utf-8',
    'x-upsert': 'true'
}, method='POST')

try:
    with urllib.request.urlopen(req) as res:
        resp_data = res.read().decode('utf-8')
        print('Upload response:', res.status, resp_data)
except urllib.error.HTTPError as e:
    err_body = e.read().decode('utf-8')
    print('Upload HTTPError:', e.code, err_body)
    # try PUT if POST failed
    req_put = urllib.request.Request(upload_url, data=file_bytes, headers={
        'Authorization': f'Bearer {service_key}',
        'apikey': service_key,
        'Content-Type': 'text/markdown; charset=utf-8'
    }, method='PUT')
    with urllib.request.urlopen(req_put) as res:
        print('PUT Upload response:', res.status, res.read().decode('utf-8'))
except Exception as e:
    print('Upload error:', e)

# 5. Public URL
public_url = f"{supabase_url}/storage/v1/object/public/{bucket_name}/{target_object}"
print('\n=== PUBLIC URL ===')
print(public_url)

# 6. Test downloading without Auth (simulate PE fetch_url)
print('\nTesting public fetch (no auth)...')
test_req = urllib.request.Request(public_url, headers={
    'User-Agent': 'PerplexityBot/1.0'
})
try:
    with urllib.request.urlopen(test_req, timeout=10) as res:
        print('Public Fetch Status:', res.status)
        print('Content-Type:', res.headers.get('Content-Type'))
        body = res.read()
        print('Fetched Bytes:', len(body))
        print('Verification: Succeeded!')
except Exception as e:
    print('Public Fetch Error:', e)
