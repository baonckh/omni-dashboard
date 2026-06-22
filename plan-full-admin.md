# Plan: Full Admin Panel — CRUD all collections

## Collections cần quản lý

| Collection | Module | Ghi chú |
|------------|--------|---------|
| `users` | Auth | Đã có List, UpdatePlan. Cần: Detail, Delete |
| `shops` | Auth (embedded) | Đã có List. Cần: View bots/channels/products của shop |
| `bot_personas` | Persona | CRUD: xem bot theo shop, sửa persona, xoá bot |
| `channels` | Channel | CRUD: xem channel theo shop, ngắt kết nối |
| `threads` | Thread/Inbox | Xem conversation history theo shop |
| `messages` | Thread (embedded) | Xem messages trong thread |
| `products` | Knowledge | CRUD: xem products theo shop |
| `leads` | Lead | CRUD: xem leads theo shop |
| `knowledge_items` | Knowledge | CRUD: xem documents theo shop |
| `customer_profiles` | Profiler | CRUD: xem profiles theo shop |
| `usage_logs` | Billing | Xem usage history |
| `bot_settings` | BotSetting | CRUD: xem settings theo shop |

## Admin UI Tabs

```
┌─────────────────────────────────────────────────────┐
│  Admin Panel                                  [Logout]│
│                                                       │
│  [Users] [Shops] [Bots] [Channels] [Threads] [Leads] │
│  [Products] [Knowledge] [Profiles] [Usage]           │
│                                                       │
│  ┌─── Content Area ───────────────────────────────┐  │
│  │  Table + Search + Pagination                    │  │
│  │  CRUD buttons (Edit / Delete)                  │  │
│  │  Click row → Detail view                       │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Backend API endpoints cần thêm

All under `/api/v1/panel-api/` (JWT + super_admin required):

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/:id` | User detail |
| DELETE | `/users/:id` | Delete user |
| GET | `/users/:id/shops` | User's shops |
| GET | `/bots` | All bots (with shop filter) |
| GET | `/bots/:id` | Bot detail |
| DELETE | `/bots/:id` | Delete bot |
| GET | `/channels` | All channels |
| DELETE | `/channels/:id` | Disconnect channel |
| GET | `/threads` | All threads (with shop filter) |
| GET | `/threads/:id` | Thread messages |
| GET | `/products` | All products |
| DELETE | `/products/:id` | Delete product |
| GET | `/leads` | All leads |
| GET | `/knowledge` | All knowledge items |
| GET | `/profiles` | All customer profiles |
| GET | `/usage` | Usage logs |

## Files

### Backend
| File | Thay đổi |
|------|----------|
| `internal/modules/admin/delivery/http/handler.go` | Thêm CRUD handlers |
| `internal/modules/router.go` | Đăng ký routes |

### Frontend
| File | Thay đổi |
|------|----------|
| `app/admin/page.tsx` | Rewrite: tab switcher + data tables |

## Effort
- Backend: ~4h (15 endpoints)
- Frontend: ~4h (UI with tabs + tables)
- Total: ~8h
