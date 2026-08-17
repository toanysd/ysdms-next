# Gemini API Configuration Reference — YSDMS NextGen

> **Cập nhật lần cuối**: 2026-08-17
> **Mục đích**: Tài liệu tham khảo chính thức về cấu hình Google Gemini API cho tính năng AI OCR.
> **QUAN TRỌNG**: Không tự đoán tên model — phải tra cứu file này hoặc gọi `ListModels` API.

---

## 1. Phương Thức Gọi API (Authentication)

### ✅ ĐÚNG — Chỉ dùng URL Query Parameter
```typescript
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
const response = await fetch(geminiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(promptPayload)
})
```

### ❌ SAI — Không dùng header `x-goog-api-key` cùng lúc với `?key=`
```typescript
// ❌ KHÔNG LÀM ĐIỀU NÀY — gây xung đột xác thực, trả về 404
headers: {
  'Content-Type': 'application/json',
  'x-goog-api-key': apiKey  // ← KHÔNG THÊM CÁI NÀY
}
```

### ❌ SAI — Không dùng `encodeURIComponent` cho API key
```typescript
// ❌ KHÔNG LÀM ĐIỀU NÀY — làm biến dạng key
`?key=${encodeURIComponent(apiKey)}`  // SAI
`?key=${apiKey}`                       // ĐÚNG
```

### ❌ SAI — Không thêm `AbortSignal.timeout` (gây timeout sớm trên ảnh lớn)
```typescript
// ❌ Không cần thiết, để fetch tự hoàn thành
signal: AbortSignal.timeout(15000)
```

---

## 2. Danh Sách Model Khả Dụng (Verified: 2026-08-17)

### Model Chính Đang Hoạt Động
| Model ID | Mục đích | Ghi chú |
|----------|----------|---------|
| `gemini-2.5-flash` | **Mặc định — Khuyên dùng** | Nhanh, multimodal, OCR chữ viết tay tốt |
| `gemini-2.5-pro` | Độ chính xác cao | Chậm hơn nhưng chính xác hơn |
| `gemini-flash-latest` | Alias luôn trỏ tới Flash mới nhất | Tự cập nhật khi Google ra bản mới |
| `gemini-3.5-flash` | Thế hệ mới | Có thể nhanh hơn 2.5 |

### Model ĐÃ BỊ GOOGLE NGỪNG (DEPRECATED — KHÔNG SỬ DỤNG)
| Model ID | Trạng thái | Ngày xác nhận |
|----------|------------|---------------|
| `gemini-1.5-flash` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-1.5-flash-latest` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-1.5-flash-001` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-1.5-flash-002` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-1.5-flash-8b` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-1.5-pro` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-1.5-pro-001` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-1.5-pro-002` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-2.0-flash` | ❌ 404 Deprecated | 2026-08-17 |
| `gemini-2.0-flash-exp` | ❌ 404 NOT_FOUND | 2026-08-17 |
| `gemini-2.0-flash-lite` | ❌ 404 NOT_FOUND | 2026-08-17 |

---

## 3. Cách Kiểm Tra Model Khả Dụng

### Endpoint Test Tích Hợp (Trong Hệ Thống)
```
GET http://localhost:3000/api/ocr/test-models?key=YOUR_API_KEY
```
Trả về JSON liệt kê model nào ✅ hoạt động, model nào ❌ lỗi.

### Gọi Trực Tiếp Google ListModels API
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY"
```
Lọc các model có `supportedGenerationMethods` chứa `"generateContent"`.

---

## 4. Cấu Hình API Key

### Nguồn API Key (theo thứ tự ưu tiên)
1. **Form input trên giao diện** (`customApiKey` từ FormData)
2. **Biến môi trường** `GOOGLE_GEMINI_API_KEY` trong `.env.local`
3. **Biến môi trường** `GEMINI_API_KEY` trong `.env.local`

### Lưu ý
- API Key tạo từ [Google AI Studio](https://aistudio.google.com/apikey)
- Phải bật **Generative Language API** trên Google Cloud project
- Key bắt đầu bằng `AIzaSy...`

---

## 5. Bài Học Rút Ra (Incident Log)

### 2026-08-17: Model 404 Error After i18n Update
- **Triệu chứng**: Tất cả model trả 404, OCR không hoạt động
- **Nguyên nhân gốc**: AI assistant tự ý đổi model từ `gemini-2.5-flash` (đúng) sang `gemini-1.5-flash` (đã bị Google deprecated) vì nghĩ `2.5` là model "không tồn tại"
- **Giải pháp**: Gọi `ListModels` API xác nhận danh sách model thực tế, khôi phục lại `gemini-2.5-flash`
- **Quy tắc**: **KHÔNG BAO GIỜ** tự đoán tên model Gemini. Phải tra cứu file này hoặc gọi `ListModels` API trước khi thay đổi.
