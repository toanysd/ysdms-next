# 📂 INBOX — Thư mục nhập liệu tự động

## Cách dùng

1. **Copy** file Excel (`*.xlsx`, `*.xls`) vào thư mục này
2. **Chạy** `extract.bat` ở thư mục gốc dự án
3. **Chọn** tùy chọn phù hợp trong menu

## Quy tắc đặt tên / Ghi chú cho file

- **Tên thư mục con** (nếu có) = Tên khách hàng đặt hàng
  - VD: đặt file trong `inbox/SMK/file.xlsx` → hệ thống biết đây là đơn của SMK
- **Tên file** trực tiếp trong inbox → hệ thống đọc sheet `納入先一覧表` để lấy KH

## Ví dụ cấu trúc

```
temp_ai/inbox/
  ├── SMK/
  │     └── SMK-001(20260617).xlsx    ← Đơn SMK
  ├── AMP(20260610).xlsx               ← File AMP (tên chứa tên KH)
  └── 指示書_一般.xlsx                  ← File chứa sheet 納入先一覧表
```

## Sau khi xử lý

File đã xử lý sẽ được chuyển sang `temp_ai/inbox/_done/` 
để tránh import trùng lặp.

---
*Thư mục này được quản lý bởi `extract.bat` — không xóa file này.*
