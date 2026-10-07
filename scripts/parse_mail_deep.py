import json

data = json.load(open('mail_analysis_deep.json', encoding='utf-8'))
with open('mail_analysis_summary.txt', 'w', encoding='utf-8') as out:
    for cat, val in data.items():
        matches = val['matches']
        out.write(f"=== {cat} (Total Matches: {len(matches)}) ===\n")
        for idx, m in enumerate(matches[:8], 1):
            s = m['subject'].replace('\n', ' ').strip()
            snd = m['sender'].replace('\n', ' ').strip()
            eml = m['email'].strip()
            kw = ", ".join(m['matched_kw'])
            snippet = m['snippet'].replace('\n', ' ').strip()
            out.write(f"[{idx}] Row: {m['row']} | Sender: {snd} <{eml}>\n")
            out.write(f"    Subject: {s}\n")
            out.write(f"    Matched: [{kw}]\n")
            out.write(f"    Snippet: {snippet}\n\n")
        out.write("\n" + "="*80 + "\n\n")

print("Generated mail_analysis_summary.txt")
