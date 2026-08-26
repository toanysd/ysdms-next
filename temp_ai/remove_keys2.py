import os
import re
from pathlib import Path

directory = r'd:\AntiGravity_Workspace\apps\ysdms-nextgen'
# Regex for JWT tokens (starts with eyJ)
pattern = re.compile(ros.environ.get("SUPABASE_SERVICE_ROLE_KEY"))

count = 0
for root, _, files in os.walk(directory):
    if '.git' in root or 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith(('.py', '.js', '.mjs', '.ts')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if pattern.search(content):
                    if file.endswith('.py'):
                        content = pattern.sub('os.environ.get("SUPABASE_SERVICE_ROLE_KEY")', content)
                        if 'import os' not in content:
                            content = "import os\n" + content
                    else:
                        content = pattern.sub('process.env.SUPABASE_SERVICE_ROLE_KEY', content)
                    
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed {path}")
                    count += 1
            except Exception as e:
                pass

print(f"Fixed {count} files.")
