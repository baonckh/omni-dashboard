# Plan: Fix API Error Leakage (48 occurrences in 17 files)

## Vấn đề
`err.Error()` được truyền trực tiếp vào response API → lộ thông tin nội bộ (DB error, stack trace, internal paths).

## Nguyên tắc
- 🟢 **Error response CHỈ dùng static message**: `"internal server error"`, `"invalid request body"`
- 🟢 **Error thật log server-side**: `log.Printf("[HANDLER] Error: %v", err)`
- 🟢 **Input validation errors**: static message, không kèm raw parse error

## Fix pattern
```go
// TRƯỚC (sai):
return c.Status(500).JSON(fiber.Map{"error": err.Error()})

// SAU (đúng):
log.Printf("[HANDLER] Failed: %v", err)
return c.Status(500).JSON(fiber.Map{"error": "internal server error"})
```

## Files cần sửa (17 files)

| # | File | Số lần | Mức |
|---|------|--------|-----|
| 1 | `knowledge/delivery/http/product_handler.go` | 7 | CRITICAL |
| 2 | `knowledge/delivery/http/policy_handler.go` | 7 | CRITICAL |
| 3 | `knowledge/delivery/http/handler.go` | 6 | CRITICAL |
| 4 | `persona/delivery/http/handler.go` | 5 | CRITICAL |
| 5 | `inbox/delivery/http/handler.go` | 4 | CRITICAL |
| 6 | `alert/delivery/http/handler.go` | 4 | CRITICAL |
| 7 | `channel/delivery/http/handler.go` | 3 | HIGH |
| 8 | `lead/delivery/http/handler.go` | 2 | HIGH |
| 9 | `botsetting/delivery/http/handler.go` | 2 | HIGH |
| 10 | `knowledge/delivery/http/confirm_handler.go` | 2 | HIGH |
| 11 | `billing/delivery/http/handler.go` | 1 | HIGH |
| 12 | `chat/delivery/http/playground_handler.go` | 1 | HIGH |
| 13 | `webhook/delivery/http/zalo_handler.go` | 1 | HIGH |
| 14 | `simulator/delivery/http/handler.go` | 1 | HIGH |
| 15 | `analytics/delivery/http/handler.go` | 1 | HIGH |
| 16 | `profiler/delivery/http/handler.go` | 1 | HIGH |
| 17 | `knowledge/delivery/http/parse_handler.go` | 1 | HIGH |
| **Total** | **17 files** | **48** | |

## Effort
- ~30 phút với task agent để replaceAll pattern
