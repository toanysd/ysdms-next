import pandas as pd
df = pd.read_csv(r'D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\mail_data\toanysdmail2.csv', encoding='utf-8', on_bad_lines='skip', low_memory=False)
matches = df[df.astype(str).apply(lambda x: x.str.contains('材料発注|材料在庫|在庫切れ', na=False, regex=True)).any(axis=1)]
print(matches.head(10)[['Date', 'From', 'Subject']].to_string())

