# Plan: Fix Onboarding Playground — Real AI Test + API Key Setup

## Problem
Step 5 (Playground) shows **simulated/fake** AI replies. Bot can't actually reply without an AI provider key (OpenAI/Gemini). This is misleading.

## First Principles
- 🟢 Bot needs AI provider key to generate replies
- 🟢 User must bring own key OR use OmniAI shared demo key
- 🟢 Playground with real AI = powerful "wow" moment
- 🟢 Fake replies = misleading, breaks trust

## Solution: 7-step Onboarding

```
 1. Shop Setup     [Tên + mô tả + ngành hàng]
 2. Products       [CSV / text import]
 3. Tạo Bot        [Persona + tone + rules]
 4. AI Provider 🆕 [Chọn OpenAI/Gemini + nhập key]
 5. Connect Kênh   [FB + TikTok + Shopee + Zalo + Web Widget]
 6. Playground 🎯  [Chat THẬT với AI, dùng key vừa nhập]
 7. Deploy         [Tổng kết + Dashboard]
```

## What to implement

### Step 4: AI Provider (New)
```
┌────────────────────────────────────────┐
│  🤖 CẤU HÌNH AI PROVIDER               │
│                                         │
│  Chọn nền tảng AI bạn muốn sử dụng:    │
│                                         │
│  ┌────────────────────────────────────┐ │
│  │ ○ OpenAI  (GPT-4o, GPT-4o-mini)   │ │
│  │ ○ Gemini (Gemini 2.0 Flash)       │ │
│  │ ○ OpenRouter (nhiều model)        │ │
│  └────────────────────────────────────┘ │
│                                         │
│  API Key *                              │
│  ┌────────────────────────────────────┐ │
│  │  sk-...                           │ │
│  └────────────────────────────────────┘ │
│                                         │
│  🔗 Hướng dẫn lấy key OpenAI...        │
│                                         │
│  [Skip - Dùng key demo OmniAI]         │
│  [Tiếp tục]                             │
└────────────────────────────────────────┘
```

- User chọn provider (OpenAI/Gemini/OpenRouter) + nhập key
- Key được validate (test call đến API)
- "Skip" → dùng key demo chung của OmniAI (hạn chế rate)
- Lưu key vào backend: `POST /api/v1/admin/settings/{shopId}/bot`

### Step 6: Playground (Real AI)
− Gọi API backend thật với key từ Step 4
- Nếu chưa có key → hiển thị "Vui lòng cấu hình AI Provider trước"
- Chat UI gọi `POST /api/v1/chat/playground` → real AI response

### Changes needed

**Frontend:**
| File | Change |
|------|--------|
| `src/types/onboarding.ts` | Thêm `aiProvider`, `aiKey` vào OnboardingData + STEPS update |
| `src/components/onboarding/StepAIProvider.tsx` | NEW: Provider selection + key input |
| `src/components/onboarding/StepPlayground.tsx` | Gọi API thật thay vì simulated |
| `src/app/onboarding/page.tsx` | 6 → 7 steps |

**Backend (omni-deploy):**
| File | Change |
|------|--------|
| Không cần thay đổi — API settings/chat đã có sẵn | |

## Implementation Order
1. Update types + data model
2. Create StepAIProvider component  
3. Update StepPlayground to call real API
4. Update onboarding page to 7 steps
5. Build + test
