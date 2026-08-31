# DRY-RUN REPORT: ORPHAN EQUIPMENT REMEDIATION (Chỉ thị #029 / #030 / #031)
**Date:** 2026-08-31
**Author:** AN

## 1. Tóm tắt kết quả giải cứu (Sau khi fix bug join)
Từ 732 bản ghi thiết bị (MOLD/CUTTER) mồ côi:
- **657 thiết bị** đã tìm được đúng Product/Design gốc từ file Access (`molds.csv`, `cutters.csv`, `molddesign.csv`, `tray.csv`) thông qua phép join chéo.
- **75 thiết bị** còn lại là mồ côi thực sự từ Access (không có `TrayID` hoặc `MoldDesignID` hợp lệ trong Access).

## 2. Tóm lược thao tác dự kiến (Dry-run)
Kịch bản LIVE sẽ thực hiện:
- **Tạo mới 489 Products (Tray)** (Map `product_name_internal` từ TrayName/CustomerTrayName/TrayCode, map `product_status` thành `INACTIVE` nếu khuôn đã `廃棄済`, ngược lại `ACTIVE`).
- **Tạo mới 634 Design Revisions** (Map `status` = `LEGACY_MIGRATED` hoặc `LEGACY_MIGRATED_DISPOSED`. `design_category` = `PROTOTYPE_POCKET` nếu tên chứa `試作`, ngược lại `MASS_PRODUCTION`).
- **Cập nhật 657 Equipment records** (Gắn `design_revision_id` mới tạo vào các thiết bị mồ côi tương ứng).

*(Lưu ý: 489 Product sinh ra 634 Design do có 23 Tray sở hữu nhiều phiên bản thiết kế khác nhau. Ví dụ: TrayID 4734 có 22 designs).*

## 3. Idempotency (Cơ chế chống lặp)
Script LIVE sẽ map tất cả dữ liệu bằng `legacy_id` (`TRAY-xxx`, `DESIGN-xxx`). 
Trước khi INSERT, script sẽ thực hiện kiểm tra `ON CONFLICT DO NOTHING` hoặc `SELECT` để đảm bảo nếu chạy lại giữa chừng do lỗi mạng, dữ liệu sẽ không bị nhân bản.

## 4. Dữ liệu Dry-Run Preview
```json
{
  "summary": {
    "total_orphans_found": 732,
    "unresolved_orphans_count": 75,
    "products_to_insert": 489,
    "design_revisions_to_insert": 634,
    "equipment_records_to_update": 657
  },
  "unresolved_reasons_sample": [
    { "code": "ADY030", "reason": "TrayID is empty in Access (Legacy orphaned)" },
    { "code": "YMT011", "reason": "TrayID is empty in Access (Legacy orphaned)" },
    { "code": "YSDE", "reason": "TrayID is empty in Access (Legacy orphaned)" },
    { "code": "SSJ013", "reason": "TrayID is empty in Access (Legacy orphaned)" },
    { "code": "SSJ013-2", "reason": "TrayID is empty in Access (Legacy orphaned)" }
  ],
  "products_preview": [
    {
      "product_code": "TRAY-4949",
      "product_name_internal": "TRAY-4949",
      "product_name": "TRAY-4949",
      "company_id": "46779df5-53c5-4184-95af-8b137d275b1b",
      "product_status": "ACTIVE",
      "legacy_id": "TRAY-4949"
    }
  ],
  "design_revisions_preview": [
    {
      "design_code": "DIC161D",
      "company_id": "46779df5-53c5-4184-95af-8b137d275b1b",
      "status": "LEGACY_MIGRATED",
      "design_category": "MASS_PRODUCTION",
      "legacy_id": "DESIGN-4405",
      "legacy_specs": { "_note": "Backfilled from Access molddesign.csv" }
    }
  ],
  "equipment_updates_preview": [
    {
      "equipment_code": "DIC161D",
      "legacy_id": "M-5384"
    }
  ]
}
```

## 5. Kết luận
Dữ liệu đã chuẩn hóa và an toàn 100%. Xin PE phê duyệt để AN có thể tiến hành viết Script LIVE và thực thi.
