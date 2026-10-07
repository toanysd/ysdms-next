import os
import sys
import psycopg2

def publish_artifact(file_path: str, artifact_name: str, version: int = 1):
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        sys.exit(1)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    byte_size = len(content.encode('utf-8'))
    print(f"Reading '{file_path}': {len(content)} characters, {byte_size} bytes.")

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

    conn = psycopg2.connect(db_url, connect_timeout=10)
    cur = conn.cursor()

    # Upsert artifact
    upsert_sql = """
    INSERT INTO public.pe_review_artifacts (artifact_name, version, content_md, byte_size, updated_at)
    VALUES (%s, %s, %s, %s, now())
    ON CONFLICT (artifact_name, version)
    DO UPDATE SET
        content_md = EXCLUDED.content_md,
        byte_size = EXCLUDED.byte_size,
        updated_at = now()
    RETURNING artifact_id, created_at, updated_at;
    """
    cur.execute(upsert_sql, (artifact_name, version, content, byte_size))
    res = cur.fetchone()
    conn.commit()
    conn.close()

    print("\n=== ARTIFACT PUBLISHED SUCCESSFULLY ===")
    print(f"Artifact Name: {artifact_name}")
    print(f"Version      : {version}")
    print(f"Artifact ID  : {res[0]}")
    print(f"Byte Size    : {byte_size} bytes")
    print(f"Updated At   : {res[2]}")
    print("\n--- SQL Query for PE to read directly ---")
    print(f"SELECT content_md FROM public.pe_review_artifacts WHERE artifact_name = '{artifact_name}' ORDER BY version DESC LIMIT 1;")

if __name__ == '__main__':
    target_file = sys.argv[1] if len(sys.argv) > 1 else 'docs/business/MOLD_CUSTODY_BUSINESS_SPEC.md'
    name = sys.argv[2] if len(sys.argv) > 2 else 'MOLD_CUSTODY_BUSINESS_SPEC'
    ver = int(sys.argv[3]) if len(sys.argv) > 3 else 1
    publish_artifact(target_file, name, ver)
