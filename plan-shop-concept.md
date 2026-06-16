# Plan: Shop Concept Redesign — 1 Shop = 1 Tenant

## First Principles
- 🟢 **Shop** = workspace/tenant: chứa bot, channels, products, inbox, knowledge
- 🟢 **Bot** thuộc về 1 shop (bot làm việc cho shop đó)
- 🟢 **Channel** kết nối vào 1 shop
- 🟢 **Product** thuộc về 1 shop
- 🟢 User có thể có nhiều shop (multi-brand)
- 🟢 **Không auto-create shop khi register** — user tự tạo

## Vấn đề hiện tại
| Issue | Root cause |
|-------|------------|
| 2/2 shops ngay khi mới tạo | Register auto-creates 2 shops ("Shop chính" + "Shop phụ") |
| "Shop phụ" vô dụng | User không cần shop thứ 2 |
| Shop hiển thị ID | Shop switcher fallback về ID khi ko tìm thấy name |
| Nút tạo shop không rõ | UX không clear, không dialog |

## Flow mới

### Register
```
Register → user created with 0 shops, onboarding_complete = false
         → redirect /onboarding
```

### Onboarding Step 1: Shop Setup
```
User nhập: Shop Name, Description, Category
         → POST /api/v1/auth/shops/create (tạo shop đầu tiên)
         → shop_id trả về → JWT updated
         → Step 2: Products
```

### Dashboard: Create Additional Shop
```
User click "Tạo shop mới" → dialog:
  ┌──────────────────────────┐
  │  Tạo Shop Mới            │
  │  Tên shop: [________]    │
  │  [Cancel] [Create]       │
  └──────────────────────────┘
  → POST /api/v1/auth/shops/create
  → limit check (free = 2 shops max)
  → nếu đạt limit → "Bạn đã đạt giới hạn. Nâng cấp Pro."
```

### Shop Switcher
```
[🏪 Shop Thời trang ABC ▾]
  ├── 🏪 Shop Thời trang ABC  ✓ (active)
  ├── 🏪 Shop Điện tử XYZ  
  └── ➕ Tạo shop mới (2/2)
```

### Plan Badge Shows Real Usage
```
Shops: 1/2 (real count, không đếm shop auto)
Bots: 1/3
Conversations: 0/500
```

## Files thay đổi

### Backend (omni-deploy)
| File | Change |
|------|--------|
| `auth/delivery/http/handler.go` | Register: xoá auto-create 2 shops. Tạo user với Shops = [] |
| `auth/delivery/http/handler.go` | Google login: xoá auto-create 2 shops |
| `onboarding/handler.go` | Save: tạo shop từ thông tin onboarding |
| `router.go` | Giữ nguyên |

### Frontend (omni-dashboard)
| File | Change |
|------|--------|
| `components/layout/DashboardLayout.tsx` | Create shop: dialog thay vì auto-name |
| `components/layout/DashboardLayout.tsx` | Shop switcher: show name, không fallback về ID |
| `app/onboarding/page.tsx` | Step 1: gọi POST /shops/create sau khi nhập tên |
| `lib/plans.ts` | Thêm `maxShops` vào plan config |

## Effort
- Backend: 2 files, ~1h
- Frontend: 3 files, ~2h
- **Total: ~3h**
