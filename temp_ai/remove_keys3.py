import os
import re

directory = r'd:\AntiGravity_Workspace\apps\ysdms-nextgen'
token_start = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

for root, _, files in os.walk(directory):
    if '.git' in root or 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith(('.py', '.js', '.mjs', '.ts')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if token_start in content:
                    lines = content.split('\n')
                    modified = False
                    for i, line in enumerate(lines):
                        if token_start in line:
                            # Use a simple regex to replace the string literal
                            if file.endswith('.py'):
                                lines[i] = re.sub(r'[\'"]eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[^\'"]*[\'"]', 'os.environ.get("SUPABASE_SERVICE_ROLE_KEY")', line)
                            else:
                                lines[i] = re.sub(r'[\'"]eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[^\'"]*[\'"]', 'process.env.SUPABASE_SERVICE_ROLE_KEY', line)
                            modified = True
                    if modified:
                        content = '\n'.join(lines)
                        if file.endswith('.py') and 'import os' not in content:
                            content = 'import os\n' + content
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print('Fixed', path)
            except Exception as e:
                print("Error processing", path, e)
