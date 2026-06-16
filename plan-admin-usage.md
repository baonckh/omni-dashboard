# Plan: Plan Enforcement + Admin Panel

## Problems
1. **Usage dropdown** shows `- / 3` bots, `- / 500` convos — không phải real count
2. **No plan enforcement** — backend không check limits khi tạo shop/bot/product
3. **No admin panel** — không có cách nào quản lý user, shop, plan từ 1 chỗ

## Phase 1: Real Usage Data (Frontend + Backend)

### Backend: GET /api/v1/billing/{shopId}/usage
Return real usage counts:
```json
{
  "shopCount": 2,
  "botCount": 1,
  "conversationCount": 5,
  "productCount": 10,
  "maxShops": 2,
  "maxBots": 3,
  "maxConversations": 500
}
```

**Implementation:**
- `internal/modules/billing/usecase/usage_uc.go` — count from DB collections
- Query shops, bot_personas, threads, products by shop_id
- Return counts + plan limits

### Frontend: Fetch usage in DashboardLayout
- Call `GET /api/v1/billing/{shopId}/usage` when dropdown opens
- Show real counts instead of `- / X`

## Phase 2: Plan Enforcement (Backend)

### Middleware: PlanGuard
- Check plan limits before create operations
- `POST /api/v1/auth/shops/create` — check maxShops
- `POST /api/v1/admin/settings/{shopId}/bot` — check maxBots
- Product import — check maxProducts
- Chat/Conversation — check maxConversations/month

### Error response
```json
{ "error": "plan_limit_reached", "message": "You've reached the limit of 2 shops. Upgrade to Pro.", "plan": "free", "limit": 2, "current": 2 }
```

## Phase 3: Admin Panel (Frontend + Backend)

### Backend: Super Admin endpoints
All under `/api/v1/admin/` with super_admin JWT role check:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/users` | GET | List all users with plans |
| `/admin/users/{id}` | GET | User detail |
| `/admin/users/{id}/plan` | PUT | Change user plan |
| `/admin/users/{id}/shops` | GET | List user's shops |
| `/admin/shops` | GET | List all shops |
| `/admin/stats` | GET | Platform stats |

### Frontend: Admin dashboard
Route: `/app/admin/` (only visible to super_admin role)

**Tabs:**
1. **Users** — table: email, name, plan, shops count, created date. Actions: edit plan
2. **Shops** — table: name, owner, bots, channels, created. Actions: view
3. **Platform Stats** — total users, shops, bots, conversations, leads

### Super Admin user
- Seeded manually in DB with `role: "super_admin"`
- JWT contains `role: "super_admin"`
- Frontend checks role to show/hide admin link

## Files

### Backend (omni-deploy)
| File | Phase |
|------|-------|
| `internal/modules/billing/usecase/usage_uc.go` | 1 |
| `internal/modules/billing/delivery/http/handler.go` | 1 |
| `internal/modules/billing/domain/billing.go` | 1 |
| `internal/modules/auth/middleware/plan.go` | NEW |
| `internal/modules/admin/...` | NEW (3-4 files) |
| `internal/modules/router.go` | 1+2+3 |
| `internal/modules/auth/domain/auth.go` | Add Role field |

### Frontend (omni-dashboard)
| File | Phase |
|------|-------|
| `components/layout/DashboardLayout.tsx` | 1 |
| `app/admin/page.tsx` | NEW |
| `app/admin/users/page.tsx` | NEW |
| `app/admin/shops/page.tsx` | NEW |
| `components/layout/Sidebar.tsx` | 3 |
| `lib/auth-types.d.ts` | 3 |
| `lib/plans.ts` | 1 |

## Effort
| Phase | Effort |
|-------|--------|
| 1: Real usage data | ~2h |
| 2: Plan enforcement | ~3h |
| 3: Admin panel | ~5h |
| **Total** | **~10h** |
