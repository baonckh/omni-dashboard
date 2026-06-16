# Plan: Dashboard Metrics — Real Data, Not Mock

## Problem
Dashboard hiện dùng mock data: hardcode `85.5%`, `"3"`, `totalLeads * 5`.
Cần thay bằng real metrics từ các collection: leads, threads, messages, channels, bots.

## First Principles
- 🟢 **Metric chỉ có giá trị khi tính từ data thật**
- 🟢 Data sources: `leads`, `threads`, `messages`, `channels`, `bot_personas`, `usage_logs`
- 🟢 Tất cả đều filter theo `shop_id` (tenant isolation đã OK)
- 🟢 Không cần realtime — cache 5-15 phút là đủ cho dashboard

## Metrics thực tế

| Metric | Nguồn | Cách tính |
|--------|-------|-----------|
| **Total Leads** | `leads` collection | `count({shop_id})` |
| **Total Conversations** | `threads` collection | `count({shop_id})` |
| **Active Channels** | `channels` collection | `count({shop_id, isActive: true})` |
| **AI Success Rate** | `threads` + `messages` | `threads where last message is AI / total threads × 100` |
| **AI Conversations** | `threads` with AI replies | `count({shop_id, messages.senderType: "BOT"})` |
| **Messages Today** | `threads.messages` | `count messages created today` |
| **Leads Growth (7 days)** | `leads` | `group by date, count, last 7 days` |
| **Platform Distribution** | `leads.platform` | `group by platform, count` |
| **Bot Count** | `bot_personas` | `count({shop_id})` |

## Kế hoạch implement

### Phase 1: Backend — Analytics Use Case (3 files)
1. **Inject thêm repos**: ChannelRepo, PersonaRepo vào AnalyticsUseCase
2. **Viết aggregation queries**: Đếm leads, threads, channels, bots theo shop_id
3. **Tính AI Success Rate**: Tỉ lệ hội thoại AI trả lời được (không cần human)
4. **Lead Growth + Platform**: Giữ nguyên logic (đã OK, chỉ xoá mock data)

### Phase 2: Frontend — Dashboard UI (1 file)
1. **Thay hardcode `"3"`** → `analytics.activeChannels`
2. **Thay hardcode trends** → tính từ so sánh hôm nay vs hôm qua
3. **Thêm Bot Count** card
4. **Thêm Messages Today** card
5. **Bỏ Success Rate** tạm thời (chưa có đủ data để tính chính xác)

### Phase 3: Indexes (optional)
- Thêm index `{shop_id: 1, createdAt: -1}` cho `leads`, `threads`

## Files thay đổi

### Backend (omni-deploy)
| File | Thay đổi |
|------|----------|
| `internal/modules/analytics/domain/analytics.go` | Thêm `ActiveChannels`, `BotCount`, `MessagesToday` |
| `internal/modules/analytics/usecase/analytics_uc.go` | Inject repos, query real data |
| `internal/modules/analytics/module.go` | Pass channelRepo + botRepo vào use case |

### Frontend (omni-dashboard)
| File | Thay đổi |
|------|----------|
| `app/app/(dashboard)/overview/page.tsx` | Dùng real data từ API, bỏ hardcode |

## Effort
- Backend: ~2h
- Frontend: ~1h
- **Total: ~3h**
