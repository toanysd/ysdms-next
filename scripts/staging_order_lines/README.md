# STAGING ORDER LINES BACKFILL PAYLOADS

> **Nguồn dữ liệu gốc:** `source_data/parse_output_dryrun_v2.json` (Phase R6-S2 / Chỉ đạo #40, #41)  
> **Tổng số đơn hàng:** 2.396 đơn (`orders`)  
> **Tổng số dòng chi tiết:** 6.279 dòng (`order_lines`)  
> **Tổng sản lượng:** 8.701.479 PCS  
> **Số lượng sản phẩm:** 713 sản phẩm duy nhất (100% khớp bảng `products`)

---

## Danh mục Files trong Thư mục:

| Tên File | Phạm vi dòng | Kích thước | Mục đích |
|---|---|---|---|
| `00_setup_and_verification.sql` | — | ~3 KB | Tạo bảng staging, đối soát FK dry-run, lệnh INSERT vào `order_lines` |
| `batch_01.sql` | 1 → 400 | ~37 KB | Lô 01 nạp vào staging |
| `batch_02.sql` | 401 → 800 | ~37 KB | Lô 02 nạp vào staging |
| `batch_03.sql` | 801 → 1.200 | ~37 KB | Lô 03 nạp vào staging |
| `batch_04.sql` | 1.201 → 1.600 | ~37 KB | Lô 04 nạp vào staging |
| `batch_05.sql` | 1.601 → 2.000 | ~37 KB | Lô 05 nạp vào staging |
| `batch_06.sql` | 2.001 → 2.400 | ~37 KB | Lô 06 nạp vào staging |
| `batch_07.sql` | 2.401 → 2.800 | ~37 KB | Lô 07 nạp vào staging |
| `batch_08.sql` | 2.801 → 3.200 | ~37 KB | Lô 08 nạp vào staging |
| `batch_09.sql` | 3.201 → 3.600 | ~37 KB | Lô 09 nạp vào staging |
| `batch_10.sql` | 3.601 → 4.000 | ~37 KB | Lô 10 nạp vào staging |
| `batch_11.sql` | 4.001 → 4.400 | ~37 KB | Lô 11 nạp vào staging |
| `batch_12.sql` | 4.401 → 4.800 | ~37 KB | Lô 12 nạp vào staging |
| `batch_13.sql` | 4.801 → 5.200 | ~37 KB | Lô 13 nạp vào staging |
| `batch_14.sql` | 5.201 → 5.600 | ~37 KB | Lô 14 nạp vào staging |
| `batch_15.sql` | 5.601 → 6.000 | ~37 KB | Lô 15 nạp vào staging |
| `batch_16.sql` | 6.001 → 6.279 | ~26 KB | Lô 16 nạp vào staging (Lô cuối) |
| `all_batches_combined.sql` | 1 → 6.279 | ~580 KB | Toàn bộ 6.279 dòng gộp chung 1 file (thực thi 1 lần qua CLI/psql) |

Mọi file lô riêng lẻ đều được khống chế **dưới 40 KB** (thấp hơn nhiều so với giới hạn 70 KB của PE), đảm bảo kéo toàn văn 100% không bị cắt cụt.
