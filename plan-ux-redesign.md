# Plan: UX Redesign — Main App Features

## Problem
Dashboard UI: language lộn xộn VI/EN, navigation khó hiểu, bot config 7 tab rối, Playground + AI Provider lạc lõng, thiếu loading/error state.

## First Principles
- 🟢 **User cần hoàn thành task trong ≤3 click**
- 🟢 **Mỗi page có 1 mục đích duy nhất** — không nhồi nhét
- 🟢 **Language nhất quán**: English mặc định, VI optional
- 🟢 **Loading/Error state là bắt buộc**, không optional
- 🟢 **Navigation phải phản ánh cấu trúc app**: Shop → Bot → Channels → Inbox

## Kế hoạch

### Phase 1: Navigation Architecture
```
SIDEBAR (sắp xếp lại theo flow tự nhiên)
┌─────────────────────┐
│ 🔲 Overview         │ ← KPI dashboard
│ 💬 Inbox            │ ← Unified messaging  
│ 🤖 AI Bots          │ ← Bot list + config
│ 🔗 Channels         │ ← Platform connections
│ 📦 Products         │ ← Product catalog
│ 👥 Leads            │ ← Lead tracking
│ 📊 Insights         │ ← AI customer profiles
│ ⚙️ Settings         │ ← AI Keys, Notifications, Embed
│ 💳 Billing          │ ← Usage & costs
└─────────────────────┘
```

### Phase 2: Bot Config Redesign (most complex page)

**Hiện tại:** 7 tabs trong 1 page, rối, khó tìm
**Sau:** 3 tabs chính:
```
┌──────────────────────────────────────────────┐
│ 🤖 Bot Name    [🤖 Persona] [🧠 Knowledge] [💬 Test] │
├──────────────────────────────────────────────┤
│  TAB 1: PERSONA                               │
│  ┌─── Cấu hình ───┐  ┌─── Rules ──────────┐ │
│  │ Bot name        │  │ ✓ Luôn trả lời TV  │ │
│  │ Tone selector   │  │ ✓ Thu thập SĐT     │ │
│  │ Greeting        │  │ [+ Add rule]       │ │
│  │ Persona prompt  │  └────────────────────┘ │
│  └─────────────────┘                         │
│                                               │
│  TAB 2: KNOWLEDGE (import products, policies) │
│  TAB 3: PLAYGROUND (test chat với bot)        │
└──────────────────────────────────────────────┘
```

### Phase 3: AI Provider → Move to Bot Config

**Hiện tại:** AI Provider ở Settings → 4 tab sâu, khó tìm
**Sau:** AI Provider là bước cấu hình bot:
- Tạo bot → tự động hỏi "Chọn AI Provider"
- Settings vẫn giữ nhưng có link nhanh

### Phase 4: Playground Integration

**Hiện tại:** Playground là tab trong bot config + bị bỏ qua
**Sau:** Playground là TAB 3 trong bot config (Test)
- Nếu chưa có AI key → hiển thị "Cấu hình AI Provider trước" + link
- Nếu có key → chat real với bot
- Lưu chat history để test lại

### Phase 5: Cross-cutting Fixes

| Issue | Fix |
|-------|-----|
| Language VI/EN lộn xộn | Tất cả text qua `t()` hoặc `lang` conditional |
| Native alert/confirm | Modal component |
| Loading | Skeleton shimmer |
| Error | ErrorBoundary component + toast |
| Broken `/bots/` links | `/app/bots/` |
| Hardcoded data | Từ API |

## Files thay đổi

### Frontend (10 files chính)
| File | Phase | Thay đổi |
|------|-------|----------|
| `navigation/Sidebar.tsx` | 1 | Sắp xếp lại thứ tự items |
| `bots/[botId]/page.tsx` | 2 | 7 tabs → 3 tabs (Persona, Knowledge, Test) |
| `bots/[botId]/components/` | 2 | Tách component, xoá section cũ |
| `bots/page.tsx` | 1 | Thêm search, loading skeleton |
| `settings/page.tsx` | 3 | AI Provider tab có link đến bot config |
| `components/PlaygroundModal.tsx` | 4 | NEW: Reusable Playground component |
| `components/ErrorBoundary.tsx` | 5 | NEW: error boundary |
| `components/LoadingSkeleton.tsx` | 5 | NEW: loading skeleton |
| `components/ConfirmDialog.tsx` | 5 | NEW: confirm modal |

### Backend (ít thay đổi)
| File | Thay đổi |
|------|----------|
| Không cần — chỉ frontend | |

## Effort
| Phase | Files | Effort |
|-------|-------|--------|
| 1: Navigation | 1 | ~0.5h |
| 2: Bot Config | 3-4 | ~4h |
| 3: AI Provider | 1 | ~1h |
| 4: Playground | 2 | ~2h |
| 5: Cross-cutting | 3 | ~2h |
| **Total** | **~10 files** | **~9.5h** |
