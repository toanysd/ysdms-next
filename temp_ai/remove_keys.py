import os
import glob
import re

directory = r'd:\AntiGravity_Workspace\apps\ysdms-nextgen'
pattern = re.compile(ros.environ.get("SUPABASE_SERVICE_ROLE_KEY"))
anon_pattern = re.compile(ros.environ.get("SUPABASE_SERVICE_ROLE_KEY")) # Just replace all jwt tokens

count = 0
for root, _, files in os.walk(directory):
    if '.git' in root or 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.py') or file.endswith('.mjs') or file.endswith('.js') or file.endswith('.ts'):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if pattern.search(content):
                    # Replace in Python
                    if file.endswith('.py'):
                        content = pattern.sub("os.environ.get('SUPABASE_SERVICE_ROLE_KEY')", content)
                        # Add import os if not there
                        if 'import os' not in content:
                            content = "import os\n" + content
                    else:
                        content = pattern.sub("process.env.SUPABASE_SERVICE_ROLE_KEY", content)
                    
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Fixed {path}")
                    count += 1
            except Exception as e:
                pass

print(f"Fixed {count} files.")
