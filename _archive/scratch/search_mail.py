# -*- coding: utf-8 -*-
import csv
import json
import os
import collections

csv.field_size_limit(100000000)

keywords = [
    "見積", "受注", "設計", "金型", "刃型", "出荷", "納品", "請求", "検査", 
    "試作", "修理", "改造", "借用", "返却", "材料", "指示", "承認", "図面", 
    "打合せ", "クレーム", "棚卸", "保管", "廃棄", "ISO", "品質", "安全", 
    "教育", "給与", "評価", "日報", "月報", "株式会社", "Co., Ltd.", "Corp.",
    "生産計画", "工程管理", "原価", "売上", "在庫", "仕入", "外注", "運送", "車両"
]

results = {kw: {"count": 0, "samples": [], "departments": collections.Counter()} for kw in keywords}

files = [
    r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\mail_data\toanysdmail.CSV",
    r"D:\AntiGravity_Workspace\apps\ysdms-nextgen\source_data\mail_data\toanysdmail2.csv"
]

for file in files:
    try:
        with open(file, 'r', encoding='utf-8-sig', errors='replace') as f:
            reader = csv.DictReader(f)
            for row in reader:
                subject = row.get("Subject", "")
                if not subject:
                    continue
                sender = row.get("From: (Name)", "") + " (" + row.get("From: (Address)", "") + ")"
                receiver = row.get("To: (Name)", "") + " (" + row.get("To: (Address)", "") + ")"
                
                for kw in keywords:
                    if kw in subject:
                        results[kw]["count"] += 1
                        if len(results[kw]["samples"]) < 5:
                            if kw != "給与":
                                results[kw]["samples"].append(subject)
                        results[kw]["departments"][f"From: {sender} -> To: {receiver}"] += 1
    except Exception as e:
        print(f"Error reading {file}: {e}")

# Formatting output
final_results = {}
for kw, data in results.items():
    if data["count"] > 0:
        top_depts = [f"{k} (x{v})" for k, v in data["departments"].most_common(3)]
        final_results[kw] = {
            "count": data["count"],
            "samples": data["samples"],
            "top_participants": top_depts
        }

with open("mail_analysis.json", "w", encoding="utf-8") as f:
    json.dump(final_results, f, ensure_ascii=False, indent=2)

print("Analysis complete. Results in mail_analysis.json")
