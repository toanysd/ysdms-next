# ADR-006: Multi-Perspective Schedule View & Gantt Tree Structure

**Trạng thái:** Accepted  
**Ngày:** 2026-08-29  
**Người quyết định:** Anh Thoan (Product Owner), PE (Kỹ thuật)  
**Bối cảnh:** Phiên thảo luận 195, câu hỏi của anh Thoan về cấu trúc cây Gantt

---

## Bối Cảnh

Khi xem lịch sản xuất dạng Gantt, anh Thoan phát hiện 2 vấn đề:

1. **スタッキング (STACKING)** — một loại thiết bị độc lập — bị lồng bên trong nhóm khuôn (MOLD), tạo cảm giác trùng lặp
2. **Cấu trúc cây hiện tại** khó thể hiện đúng mối quan hệ giữa Chỉ thị, Thiết bị, và Job vì 3 khái niệm này phục vụ 3 mục đích khác nhau

Anh Thoan đề xuất cấu trúc `Chỉ thị → Thiết bị → Job` nhưng tự nhận ra mâu thuẫn: job sửa chữa phát sinh sau bị hiểu nhầm là thuộc chỉ thị ban đầu, và thiết bị dùng chung (水冷ベース, フレーム) thuộc YSD, không thuộc sản phẩm cụ thể.

## Phân Tích Gốc Rễ

Mỗi Job trong DB có **2 khóa ngoại độc lập**:

```
        equipment_id
Job ────────────────→ Equipment (quan hệ cố định, xuyên suốt đời thiết bị)
Job ────────────────→ Work Order (bối cảnh tạo job, chỉ đúng 1 lần)
        work_order_id
```

Hai quan hệ này **không thể biểu diễn bằng 1 cây duy nhất** mà không có trường hợp ngoại lệ — đúng như anh Thoan tự nhận ra trong phiên thảo luận.

## Quyết Định

### 1. Đa góc nhìn trên cùng dữ liệu (Multi-Perspective)

| Góc nhìn | Cây hiển thị | Trang / Component | Mục đích |
|---|---|---|---|
| **Theo sản phẩm/chỉ thị** (mặc định Gantt) | Product/WO → Job(Equipment) → Work Logs | `/equipment/schedule` (Gantt) | "Tháng này cần làm gì cho sản phẩm nào" |
| **Theo thiết bị** | Equipment → Toàn bộ Job lịch sử | `/equipment/[id]` (chi tiết thiết bị) | "Khuôn này đã từng làm/sửa gì" |
| **Theo sản phẩm** | Product → Design → Equipment/Job | `/product-center/[id]` | "Tổng quan 1 sản phẩm" |

### 2. Cấu trúc cây Gantt lịch sản xuất (đã chốt)

```
Level 0: Nhóm theo Sản phẩm hoặc Chỉ thị (groupKey)
  ├── Level 1: Job theo Thiết bị (1 Job = 1 Equipment, theo ADR-003)
  │   └── Level 2: Nhật ký gia công (work_logs gom theo processing_code)
  └── Level 1: Job theo Thiết bị khác...
```

- **Level 0 groupKey:** `work_order_id` (nếu có) || `baseProdCode` (mã sản phẩm gốc) || `product_id` || `job_id`
- **Level 1:** Mỗi Job hiển thị là 1 dòng riêng, tên = tên thiết bị + loại thiết bị
- **Level 2:** Work logs gom theo `processing_code` (loại gia công: NC, Phay, Đánh bóng...)
- **KHÔNG thêm tầng Equipment giữa Product và Job** trên Gantt — tầng đó thuộc góc nhìn "Theo Thiết bị"

### 3. Track Assignment phải nhận diện đầy đủ

Tất cả loại thiết bị trong `item_types` phải được phân loại đúng track:

| step_name pattern | Track gán |
|---|---|
| PLUG / プラグ | `PLUG` |
| CUTTER / 抜型 | `CUTTER` |
| STAKING / STACKING / スタッキング | `STAKING` |
| WATER / 水冷 | `WATER COOLING BASE` |
| PRESSURE / 圧空 | `PRESSIER BASE` |
| FRAME / フレーム | `FRAME` |
| MACHINE / 機械 | `MACHINE` |
| ALUMI / アルミ | `ALUMI` |
| OTHER / 成形 / 出荷 | `OTHER` |
| FINISH / 仕上げ | `FINISH` |
| DESIGN / 設計 | `DESIGN` |
| (mọi thứ còn lại) | `MOLD` (catch-all) |

### 4. Dữ liệu legacy 75 jobs gộp nhiều ItemTypeID

75 jobs từ Access gốc có steps với nhiều `ItemTypeID` khác nhau dưới cùng 1 job — đây là hành vi thật của hệ thống cũ, không phải lỗi import. Các jobs này sẽ:
- **Ngắn hạn:** Hiển thị đúng track nhờ fix track assignment (đã thực hiện)
- **Dài hạn (Phase riêng):** Cần migration script tách thành jobs riêng theo ADR-003 (1 Job = 1 Equipment)

## Tương Thích Ngược

- ADR-002 (Work Order Option C): **Không ảnh hưởng** — cấu trúc 4 tầng WO → Job → Step → Log vẫn giữ nguyên
- ADR-003 (Separate Equipment Jobs): **Bổ sung** — ADR-006 xác nhận 75 jobs legacy cần tách theo ADR-003, nhưng chưa bắt buộc migration ngay
- ADR-004 (Deprecate physical_molds/cutters): **Không ảnh hưởng**

## Hệ Quả

1. Gantt chart giữ cấu trúc hiện tại (Product → Job → Work Logs), không thêm tầng Equipment
2. STACKING, WATER BASE, FRAME, etc. hiển thị đúng track riêng (đã fix)
3. Trang chi tiết Equipment (`/equipment/[id]`) sẽ là nơi xem lịch sử xuyên suốt của thiết bị (góc nhìn thứ 2)
4. Migration 75 legacy jobs là task riêng, cần kế hoạch và duyệt trước khi thực hiện
