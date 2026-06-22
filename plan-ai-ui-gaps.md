# Plan: Fix AI-Backend Gaps + UI Realignment

## Found: 8 Critical Gaps

| # | Gap | Severity | UI Fix Needed? |
|---|-----|----------|----------------|
| 1 | **Qdrant product search DISABLED** — MongoDB only, no semantic matching | 🔴 HIGH | ✅ Yes |
| 2 | **Knowledge docs → Policies collection** — "Knowledge" label misleading | 🔴 HIGH | ✅ Yes |
| 3 | **Full catalog fetch** — 100 products/query wastes tokens | 🟡 MEDIUM | ❌ Backend |
| 4 | **No vector sync UI** — admin can't see Qdrant status | 🟡 MEDIUM | ✅ Yes |
| 5 | **Chunk size mismatch** — UI says 512 tokens, actual 1000 chars | 🟢 LOW | ✅ Yes |
| 6 | **Products + Knowledge never combine** — mutual exclusion | 🟡 MEDIUM | ❌ Backend |
| 7 | **All policies fetched every turn** — unnecessary latency | 🟡 MEDIUM | ❌ Backend |
| 8 | **Policy MongoDB collection ≠ Knowledge MongoDB collection** | 🔴 HIGH | ✅ Yes |

## Phase 1: Backend Fixes (ai-service + Go)

| Fix | File | Effort |
|-----|------|--------|
| Re-enable Qdrant product search | `hybrid_search.py` | ~1h |
| Fix chunk size display (1000 chars, not 512 tokens) | N/A (info only) | ~10min |
| Reduce full catalog fetch (50 → smart limit) | `chat_agent.py` | ~1h |

## Phase 2: UI Realignment

### 2a. Products Page — Add "AI Sync Status"
```
Products /app/products
┌──────────────────────────────────────────────┐
│  Products                     [+ Add] [Import]│
│                                               │
│  [🔍 Search...]    [📁 Category ▼]            │
│                                               │
│  🔵 AI Sync: Active — 24 products indexed    │
│                                               │
│  ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ Card │ │ Card │ │ Card │                  │
│  └──────┘ └──────┘ └──────┘                  │
└──────────────────────────────────────────────┘
```

### 2b. Rename Knowledge → "Documents & Policies"
```
Bot Config → [Persona] [Documents] [Test]
                        ↕
                Documents & Policies
             (KnowledgeSection, renamed)
```

### 2c. Fix Advanced Config
- Chunk size: 512 tokens → 1000 chars
- Retrieval: "Hybrid (MongoDB + Qdrant)" → "MongoDB (products) + Qdrant (fallback)"

### 2d. Add Vector Sync Status to Settings
```
Settings → Integrations tab
┌──────────────────────────────┐
│  📊 AI Sync Status           │
│  Products indexed: 24/24 ✅  │
│  Knowledge chunks: 156 ✅    │
│  Last sync: 5 min ago        │
│  [🔄 Resync All]             │
└──────────────────────────────┘
```

## Phase 3: Files

### Backend (ai-service)
| File | Change |
|------|--------|
| `app/infrastructure/rag/hybrid_search.py` | Re-enable Qdrant search, fix collection names |

### Frontend (omni-dashboard)
| File | Change |
|------|--------|
| `app/app/(dashboard)/products/page.tsx` | Add AI sync status bar |
| `app/app/(dashboard)/bots/[botId]/components/KnowledgeSection.tsx` | Rename to Documents, fix advanced config |
| `app/app/(dashboard)/products/[id]/page.tsx` | Add vector sync status per product |
| `app/app/(dashboard)/settings/page.tsx` | Add AI sync overview section |

## Effort: ~6-8h
