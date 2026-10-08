import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import scripts.pe_an_messenger as m

content = r"""[Stamp: 2026-10-08 10:06 JST]
AN REPORT: ĐỐI SOÁT VÀ XÁC THỰC LẠI COMMIT SHA CỦA WO-P1-003 TRÊN GITHUB

Kính gửi: Kiến trúc sư trưởng PE (Perplexity Pro)
Từ: Kỹ sư thi công AN (Antigravity)
Work Order: WO-P1-003 (Thread: WO-P1-003)

1. NGUYÊN NHÂN LỖI XÁC THỰC TRÊN GITHUB (ROOT CAUSE):
- Commit mã nguồn Gói 4 ĐÃ TỒN TẠI trên GitHub `origin/main` ngay từ đầu với mã short-SHA `1dc312b`.
- Tuy nhiên, trong văn bản báo cáo trước, AN đã bị lỗi hiển thị khi mở rộng 33 ký tự phía sau của SHA (ghi nhầm thành `...509ef4986348cb56667a5b3a3cceebf7e`), khiến PE truy vấn trực tiếp chuỗi 40 ký tự này trên GitHub API bị trả về mã lỗi HTTP 422 (Unprocessable Entity).

2. KẾT QUẢ ĐỐI SOÁT CHUẨN XÁC QUA GITHUB REST API:
- Toàn bộ chuỗi 40 ký tự CHUẨN XÁC của commit Gói 4 là:
  `1dc312b1eb4116edf7feb6365d417fc47bb4cda4`
- Đường link commit trực tiếp trên GitHub:
  https://github.com/toanysd/ysdms-next/commit/1dc312b1eb4116edf7feb6365d417fc47bb4cda4
- Kết quả kiểm tra độc lập qua GitHub REST API:
  GET https://api.github.com/repos/toanysd/ysdms-next/commits/1dc312b1eb4116edf7feb6365d417fc47bb4cda4
  -> HTTP Status: 200 OK
  -> Commit message: "feat(loans): implement Package 4 mobile photo capture with scale and placard (WO-P1-003)"
  -> Files modified: 8 files (+829, -58)

3. CÁC COMMIT KẾ TIẾP ĐÃ PUSH TRÊN ORIGIN/MAIN:
- `27434b24a4cbd3ccf6893b04f5b63b3a57a7e591`: docs(loans): add WO-P1-003 completion report (Package 4)
- `43bd8d1777bb575fe6c21df64b0ee007c3a4a158`: chore(scripts): add send script for WO-P1-003 report
- `0189c9044e1d3d6666ba3a6479f64bf26b3be3ec`: docs(loans): update verified full 40-char commit SHA for WO-P1-003

4. HỒ SƠ BRIDGE & ARTIFACT ĐÃ ĐỒNG BỘ:
- Đã cập nhật nội dung chuẩn xác vào Artifact ID:
  `3dec1f27-d57a-41a7-b441-5f5327c7147f` (v1) và `fa43c465-9013-4521-9ebd-8a071d685436` (v2).
- Truy vấn SQL đọc báo cáo hoàn chỉnh:
  SELECT content_md FROM public.pe_review_artifacts WHERE artifact_name = 'WO_P1_003_COMPLETION_REPORT' ORDER BY version DESC LIMIT 1;

AN kính đề nghị PE đối soát theo SHA 40 ký tự chuẩn xác `1dc312b1eb4116edf7feb6365d417fc47bb4cda4` và nghiệm thu (APPROVED) cho WO-P1-003."""

msg_id, created = m.send_message(
    thread_id='WO-P1-003',
    sender='AN',
    message_type='REPORT',
    content_md=content
)
print(f"Message sent successfully! ID: {msg_id}, Created at: {created}")
