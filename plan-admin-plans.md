# Plan: Admin Plan Management Module

## Backend API (all under `/panel-api/plans`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/plans` | List all plans with limits + features |
| PUT | `/plans/:id` | Update plan limits/features |
| PUT | `/users/:id/plan` | Assign plan to user (exists) |

## Frontend: Plans tab in Admin

### Layout
```
Admin → Plans Tab
┌──────────────────────────────────────────────────┐
│  Plans Management                    [Save All]   │
│                                                    │
│  ┌─ Free ────────────┐ ┌─ Starter ───────────┐    │
│  │ Price: $0         │ │ Price: $8/mo        │    │
│  │ Shops: 2          │ │ Shops: 3            │    │
│  │ Bots: 3           │ │ Bots: 10            │    │
│  │ Products: 100     │ │ Products: 500       │    │
│  │ Convos: 500/mo    │ │ Convos: 3000/mo     │    │
│  │ Analytics: 7 days │ │ Analytics: 90 days  │    │
│  │ [Edit]            │ │ [Edit]              │    │
│  └───────────────────┘ └──────────────────────┘    │
│                                                    │
│  ┌─ Pro ─────────────┐ ┌─ Enterprise ─────────┐   │
│  │ Price: $20/mo     │ │ Custom pricing       │   │
│  │ Shops: Unlimited  │ │ Shops: Unlimited     │   │
│  │ ...               │ │ ...                  │   │
│  │ [Edit]            │ │ [Edit]              │   │
│  └───────────────────┘ └──────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### Feature Toggles per Plan
Each plan has checkboxes for features:
- [x] Multi-agent AI
- [x] Unified Inbox
- [x] Product Import
- [x] Leads Management
- [x] Telegram Notifications
- [ ] Webhook Integration
- [ ] AI Provider Choice
- [ ] API Access
- [ ] Priority Support

### Implementation
1. Backend: Store plans in MongoDB `plans` collection
2. Fallback: If no plans in DB, use hardcoded defaults from `src/lib/plans.ts`
3. Frontend: New admin tab "Plans" with editable cards
4. Save updates to backend API → reflects in plan enforcement

### Files
| File | Change |
|------|--------|
| `app/admin/page.tsx` | Add Plans tab |
| `backend/admin/handler.go` | Add List/Update plans endpoints |
| `backend/router.go` | Register routes |
