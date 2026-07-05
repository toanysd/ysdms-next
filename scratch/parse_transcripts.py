import json
import os

files = {
    'conv1.txt': r'C:\Users\遠藤 健一\.gemini\antigravity\brain\25612c81-3c68-40ff-9325-c3caf4aca414\.system_generated\logs\transcript.jsonl',
    'conv2.txt': r'C:\Users\遠藤 健一\.gemini\antigravity\brain\fdb3492e-2406-4e8e-a417-71f30dc2862f\.system_generated\logs\transcript.jsonl'
}

for out_name, file_path in files.items():
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
        
    with open(file_path, encoding='utf-8') as f:
        lines = f.readlines()
        
    with open(f"scratch/{out_name}", "w", encoding="utf-8") as f_out:
        for line in lines:
            data = json.loads(line)
            if data.get('type') in ['USER_INPUT', 'PLANNER_RESPONSE']:
                content = data.get('content', '')
                if content:
                    f_out.write(content + "\n" + "-"*80 + "\n")
