import codecs

path = '.agents/AGENTS.md'
with codecs.open(path, 'r', 'utf-8') as f:
    content = f.read()

import re
pattern = re.compile(r'- \*\*KHÔNG TỰ ĐỘNG GIT LÊN GITHUB\*\*.*?(?=- \*\*|---)', re.DOTALL)

new_text = """- **QUY TẮC GIT VÀ CẬP NHẬT GITHUB**: 
  - **MÃ NGUỒN (Code/UI/Logic):** KHÔNG tự động git push mã nguồn trừ khi có YÊU CẦU TRỰC TIẾP từ người dùng.
  - **TÀI LIỆU (Docs/Reports/Plans):** **BẮT BUỘC TỰ ĐỘNG `git add`, `git commit`, `git push`** mọi kết quả phân tích, bản kế hoạch (implementation_plan.md), báo cáo dry-run, ADR, và các file cần thảo luận lên GitHub ngay lập tức để hệ thống PE cùng đọc và phân tích chéo.
  - **Giới hạn file:** Không đẩy các file dung lượng lớn, các file dạng nén (.rar, .zip, .tar), các thư mục cài đặt (`node_modules`, `.next`).
"""

if pattern.search(content):
    content = pattern.sub(new_text, content)
    with codecs.open(path, 'w', 'utf-8') as f:
        f.write(content)
    print("Successfully replaced.")
else:
    print("Not found")
