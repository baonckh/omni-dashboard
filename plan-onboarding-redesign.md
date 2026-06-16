# Plan: Onboarding Redesign — 6 Steps + Web Embed + Tenant Isolation

## User Flow (Register → Onboarding → Dashboard)

```
Register / Login (Email or Google)
    │
    ├── [check] onboarding_complete = true? ──► Dashboard (/app/overview)
    │
    ▼
┌─────────────────────────────────────────────────────────────────┐
│  ONBOARDING (6 bước — mỗi bước có thể Skip hoặc Skip All)      │
│                                                                   │
│  Step 1/6 ● Shop Setup         [Tạo shop với tên + ngành hàng]  │
│             [Skip] [Skip All ▸ Dashboard]                         │
│                                                                   │
│  Step 2/6 ● Products           [Nhập sản phẩm CSV / text]       │
│             [Skip]                                                │
│                                                                   │
│  Step 3/6 ● Tạo Bot            [Tên + persona + tone + rules]   │
│             [Skip]                                                │
│                                                                   │
│  Step 4/6 ● Kết nối Kênh       [FB + TikTok + Shopee + Zalo +   │
│             [Skip]               Web Widget]                      │
│                                                                   │
│  Step 5/6 ● Playground         [Chat thử với bot]               │
│             [Skip]                                                │
│                                                                   │
│  Step 6/6 ● Deploy             [Tổng kết + Vào Dashboard]       │
│                                                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
                  Dashboard (/app/overview)
```

---

## Convention Architecture (Human Readable)

### File Naming Convention
```
src/
├── app/
│   ├── onboarding/
│   │   └── page.tsx                      # Onboarding page (6 steps)
│   │
│   └── app/(dashboard)/
│       ├── overview/page.tsx             # Dashboard overview
│       ├── bots/
│       │   ├── page.tsx                  # Bot list
│       │   └── [botId]/page.tsx          # Bot editor
│       ├── channels/page.tsx             # Channel management
│       └── settings/page.tsx             # Settings (includes Web Embed)
│
├── components/
│   ├── onboarding/
│   │   ├── StepShop.tsx                  # Step 1: Shop creation
│   │   ├── StepProducts.tsx              # Step 2: Product import
│   │   ├── StepBot.tsx                   # Step 3: Bot persona + rules
│   │   ├── StepChannels.tsx              # Step 4: Channel connection
│   │   ├── StepPlayground.tsx            # Step 5: Chat test
│   │   ├── StepDeploy.tsx                # Step 6: Summary + finish
│   │   └── OnboardingProgress.tsx        # Progress bar + skip buttons
│   │
│   ├── channels/
│   │   └── WebEmbedCode.tsx              # Web Widget script generator
│   │
│   └── UpgradePrompt.tsx                # Existing
│
├── lib/
│   ├── use-shop.ts                       # useShopId() hook
│   ├── use-onboarding.ts                 # useOnboarding() hook
│   ├── plans.ts                          # Plan limits config
│   ├── auth.ts                           # NextAuth config
│   └── i18n.ts                           # Translations
│
└── types/
    └── onboarding.ts                     # OnboardingData + Step types
```

### Step Component Convention
```typescript
// Mỗi step là 1 component riêng, props contract chuẩn:
interface StepProps {
  data: OnboardingData;           // Form data
  onUpdate: (partial: Partial<OnboardingData>) => void;  // Update data
  onSkip: () => void;             // Skip this step
}

// OnboardingData — shared state cho cả 6 bước:
interface OnboardingData {
  // Step 1: Shop
  shopName: string;
  shopDesc: string;
  shopCategory: string;

  // Step 2: Products
  products: Product[];

  // Step 3: Bot
  botName: string;
  botTone: ToneType;
  botRules: string[];

  // Step 4: Channels
  channels: {
    facebook: boolean;
    tiktok: boolean;
    shopee: boolean;
    zalo: boolean;
    web: boolean;              // Web Widget 🆕
  };

  // Step 5: Playground — local chat state (ko cần lưu)
  // Step 6: Deploy — chỉ đọc summary
}

type ToneType = "professional" | "friendly" | "humorous" | "warm" | "luxury";
interface Product { name: string; price: number; }
```

---

## 6 Steps — Chi Tiết

### Step 1: Shop Setup
```
┌──────────────────────────────────────┐
│  🏪 THIẾT LẬP SHOP                   │
│                                       │
│  Tên Shop *                           │
│  ┌──────────────────────────────────┐ │
│  │ VD: Shop Thời trang ABC         │ │
│  └──────────────────────────────────┘ │
│                                       │
│  Mô tả Shop                           │
│  ┌──────────────────────────────────┐ │
│  │ Shop chuyên bán hàng thời trang │ │
│  │ cao cấp...                      │ │
│  └──────────────────────────────────┘ │
│                                       │
│  Ngành hàng                           │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  │Thời  │ │Điện  │ │Nhà   │ │Mỹ    ││
│  │trang │ │tử    │ │cửa   │ │phẩm  ││
│  └──────┘ └──────┘ └──────┘ └──────┘│
│                                       │
│  [Skip]                  [Tiếp tục →]│
│  [Skip All ▸ Dashboard]               │
└──────────────────────────────────────┘
```
- API khi "Tiếp tục": `POST /api/v1/onboarding/save` (lưu shop info)
- Nếu chưa có shop, gọi `POST /api/v1/auth/shops/create` trước
- **Skip**: bỏ qua, dùng shop mặc định ("Shop của tôi")
- **Skip All**: gọi `POST /api/v1/onboarding/complete` → dashboard

### Step 2: Products
```
┌──────────────────────────────────────┐
│  📦 NHẬP SẢN PHẨM                    │
│                                       │
│  Upload CSV hoặc paste text:         │
│  ┌──────────────────────────────────┐ │
│  │ Áo thun nam, 150000             │ │
│  │ Quần jean nữ, 350000            │ │
│  │ Váy hoa, 280000                 │ │
│  └──────────────────────────────────┘ │
│                                       │
│  ✅ 3 sản phẩm đã nhập               │
│                                       │
│  [Skip]                  [Tiếp tục →]│
└──────────────────────────────────────┘
```
- API: `POST /api/v1/onboarding/save` (gửi kèm products)
- **Skip**: không nhập sản phẩm (vào dashboard sẽ nhập sau)

### Step 3: Tạo Bot
```
┌──────────────────────────────────────┐
│  🤖 TẠO BOT AI                       │
│                                       │
│  Tên Bot (tùy chọn)                  │
│  ┌──────────────────────────────────┐ │
│  │ VD: Bảo An                      │ │
│  └──────────────────────────────────┘ │
│                                       │
│  Giọng điệu                          │
│  ┌──────────────────────────────────┐ │
│  │ ○ Chuyên nghiệp [mô tả]         │ │
│  │ ● Thân thiện   [mô tả]         │ │
│  │ ○ Hài hước     [mô tả]         │ │
│  │ ○ Ấm áp        [mô tả]         │ │
│  └──────────────────────────────────┘ │
│                                       │
│  Rules (quy tắc bot):                │
│  ┌──────────────────────────────────┐ │
│  │ ✓ Luôn trả lời tiếng Việt      ✕│ │
│  │ ✓ Thu thập SĐT khách hàng      ✕│ │
│  │ ✓ Không tự ý giảm giá          ✕│ │
│  │ [+ Thêm rule]                   │ │
│  └──────────────────────────────────┘ │
│                                       │
│  [Skip]                  [Tiếp tục →]│
└──────────────────────────────────────┘
```
- API: `POST /api/v1/admin/settings/{shopId}/bot` (save bot config)
- **Skip**: bot mặc định (tên "AI Assistant", tone "friendly")

### Step 4: Kết nối Kênh
```
┌──────────────────────────────────────┐
│  🔗 KẾT NỐI KÊNH                     │
│                                       │
│  Chọn kênh bạn muốn bot trực chiến:  │
│                                       │
│  ┌──────────────────────────────────┐ │
│  │  f  Facebook Messenger    [Kết nối]│ │
│  ├──────────────────────────────────┤ │
│  │  🎵 TikTok Shop           [Kết nối]│ │
│  ├──────────────────────────────────┤ │
│  │  🛍 Shopee                [Kết nối]│ │
│  ├──────────────────────────────────┤ │
│  │  💬 Zalo OA               [Kết nối]│ │
│  ├──────────────────────────────────┤ │
│  │  🌐 Web Widget 🆕         [Bật/tắt]│ │
│  │     (Nhúng chat vào website)     │ │
│  └──────────────────────────────────┘ │
│                                       │
│  [Skip]                  [Tiếp tục →]│
└──────────────────────────────────────┘
```
- **Web Widget 🆕**: Khi bật, generate embed code:
  ```html
  <script src="https://omni-deploy.onrender.com/embed.js"
    data-shop-id="<shopId>"></script>
  ```
- API: `POST /api/v1/admin/channels/callback/{platform}` cho mỗi kênh
- **Skip**: không kết nối kênh nào (bot chỉ dùng trong playground)

### Step 5: Playground
```
┌──────────────────────────────────────┐
│  💬 DÙNG THỬ BOT                     │
│                                       │
│  ┌──────────────────────────────────┐ │
│  │  Hi bạn! 👋                       │ │
│  │  Em có thể giúp gì cho bạn ạ?   │ │
│  ├──────────────────────────────────┤ │
│  │  Cho tôi hỏi áo thun nam         │ │
│  │  có màu đen không?              │ │
│  ├──────────────────────────────────┤ │
│  │  Dạ có ạ! Áo thun nam đen còn   │ │
│  │  size S đến XL, giá 150.000đ... │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────┬───┐│
│  │ Nhập tin nhắn...            │➤ ││
│  └──────────────────────────────┴───┘│
│                                       │
│  Mẫu câu: [Xin chào] [Có áo đen ko?] │
│           [Giao hàng thế nào?]        │
│                                       │
│  [Skip]                  [Tiếp tục →]│
└──────────────────────────────────────┘
```
- Local only — gọi API playground backend (nếu có) hoặc simulated reply
- **Skip**: bỏ qua test

### Step 6: Deploy
```
┌──────────────────────────────────────┐
│  🚀 BOT ĐÃ SẴN SÀNG!                 │
│                                       │
│  ┌── Tổng kết ──────────────────────┐│
│  │  🏪 Shop: Shop Thời trang ABC   ││
│  │  📦 Sản phẩm: 3                 ││
│  │  🤖 Bot: Bảo An (Thân thiện)    ││
│  │  🔗 Kênh: Facebook + Web Widget ││
│  └──────────────────────────────────┘│
│                                       │
│         [🚀 Vào Dashboard]            │
└──────────────────────────────────────┘
```
- API: `POST /api/v1/onboarding/save` (save tất cả + `onboarding_complete: true`)
- Redirect: `/app/overview`

---

## Architecture Changes

### Frontend: New files structure
```
src/
├── components/onboarding/        ← NEW folder, 7 files
│   ├── OnboardingProgress.tsx    # Step indicator + Skip/SkipAll
│   ├── StepShop.tsx              # Step 1
│   ├── StepProducts.tsx          # Step 2
│   ├── StepBot.tsx               # Step 3
│   ├── StepChannels.tsx          # Step 4 (includes Web Embed)
│   ├── StepPlayground.tsx        # Step 5
│   └── StepDeploy.tsx            # Step 6
│
├── types/onboarding.ts           ← NEW type definitions
│
├── components/channels/
│   └── WebEmbedCode.tsx          ← NEW: embed code display
│
└── app/onboarding/page.tsx       ← REWRITE: orchestrate 6 steps
```

### Backend: Minimal changes
| File | Change |
|------|--------|
| `domain/auth.go` | Thêm `OnboardingComplete bool` |
| `handler.go` (auth) | Return `onboarding_complete` in login/register/me response |
| `handler.go` (onboarding) | New endpoint: `POST /api/v1/onboarding/complete` |
| `adapter/web.go` | NEW: Web Widget channel adapter |

### Auth Guard redirect
```
Session check after login:
  if !session.user.onboardingComplete → redirect /onboarding
  else → render dashboard
```

### API Contracts
```typescript
// POST /api/v1/onboarding/complete
// Body: {}
// Response: { success: true, onboarding_complete: true }

// POST /api/v1/onboarding/save
// Body: {
//   shop_name, shop_desc, shop_category,
//   products: [{name, price}],
//   bot_name, bot_tone, bot_rules: string[],
//   channels: { facebook, tiktok, shopee, zalo, web }
// }
// Response: { success: true, onboarding_complete: true }

// GET /api/v1/auth/me (thêm field)
// Response: { ..., onboarding_complete: boolean }
```

---

## Effort Estimate

| Phase | Files | Effort |
|-------|-------|--------|
| **Frontend**: 7 step components + types | ~9 files | ~5h |
| **Backend**: Auth + onboarding API | ~4 files | ~2h |
| **Auth Guard**: Redirect logic | ~2 files | ~0.5h |
| **Web Embed**: Code generator + display | ~2 files | ~1h |
| **Total** | **~17 files** | **~8.5h** |
