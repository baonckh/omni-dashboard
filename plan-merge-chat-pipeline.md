# Plan: Merge Chat Demo + Bot Pipeline into 1 section

## Mục tiêu
Gộp 2 section riêng (Chat Demo + Bot Intelligence Pipeline) thành 1 section duy nhất trên landing page. Bên phải Chat UI sẽ là animation Bot Pipeline (thay vì 4 feature checkmark cards).

## Layout hiện tại

```
┌─ Chat Demo Section ─────────────────────────────┐
│  "See how AI replies to customers"               │
│  ┌──────────┐  ┌──────────────────────────────┐  │
│  │ Chat UI  │  │ ✓ Understands products       │  │
│  │          │  │ ✓ Consult & close sales       │  │
│  │          │  │ ✓ Keeps your shop's voice     │  │
│  │          │  │ ✓ Replies in 1-3 seconds      │  │
│  └──────────┘  └──────────────────────────────┘  │
└──────────────────────────────────────────────────┘

┌─ Bot Pipeline Section ──────────────────────────┐
│  "AI hiểu sản phẩm, tồn kho, chính sách..."      │
│  ┌────── BotPipeline Component ────────────────┐ │
│  │  [Ingest] [Vector] [Retrieve] [Filter] ...  │ │
│  │  + animated detail panel                    │ │
│  └─────────────────────────────────────────────┘ │
│  ┌── Old Bot ──┐  ┌────── OmniAI ────────────┐   │
│  │ ✕ Fixed ...  │  │ ✓ Understands products   │   │
│  │ ✕ No product │  │ ✓ Accurate retrieval     │   │
│  └──────────────┘  └──────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

## Layout mới

```
┌─ CHAT + PIPELINE Section ─────────────────────────┐
│  "See how AI replies to customers"                 │
│  ┌──────────┐  ┌──────────────────────────────┐  │
│  │ Chat UI  │  │   BotPipeline Component       │  │
│  │          │  │  [Ingest] [Vector] ...        │  │
│  │          │  │  + animated detail panel      │  │
│  └──────────┘  └──────────────────────────────┘  │
│                                                    │
│  "AI hiểu sản phẩm, tồn kho, chính sách..."        │
│  ┌── Old Bot ──┐  ┌────── OmniAI ────────────┐   │
│  │ ✕ Fixed ...  │  │ ✓ Understands products   │   │
│  │ ✕ No product │  │ ✓ Accurate retrieval     │   │
│  └──────────────┘  └──────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

## Thay đổi cần làm

### 1. page.tsx — Gộp section (1 file, ~20 dòng thay đổi)

**a) CHAT DEMO — Xoá 4 feature cards, thay = BotPipeline**
- File: `src/app/page.tsx` (lines 240-259)
- Giữ nguyên heading `t("chat.title")` / `t("chat.sub")`
- Xoá right column: 4 feature cards + motion.div bao ngoài
- Thay bằng: `<BotPipeline />` trong 1 div `w-full md:w-1/2 h-[480px] overflow-y-auto`

**b) GỘP section: xoá section cũ, đưa heading + comparison vào cuối**
- Xoá hoàn toàn section cũ `{/* ══════ BOT INTELLIGENCE PIPELINE ══════ */}` lines 263-359
- Nhưng GIỮ LẠI:
  - Heading (AI hiểu sản phẩm, tồn kho, chính sách...) → đặt xuống dưới row Chat+Bot
  - Comparison cards (Old Bot vs OmniAI) → đặt dưới heading

**c) Bố cục mới trong 1 section:**
```
<section>  // class: max-w-5xl mx-auto px-5 mb-24
  // 1. Section heading (từ chat)
  <h2>t("chat.title")</h2>
  <p>t("chat.sub")</p>

  // 2. Row: Chat UI + Bot Pipeline
  <div flex-row>
    <div w-1/2> <ChatDemo /> </div>
    <div w-1/2> <BotPipeline /> </div>
  </div>

  // 3. Bot heading (từ bot pipeline)
  <div text-center>
    <h2>AI hiểu sản phẩm...</h2>
    <p>...</p>
  </div>

  // 4. Comparison cards (giữ nguyên)
  <div> Old bot vs OmniAI ... </div>
</section>
```

**d) Responsive: mobile → stack dọc**
- md:flex-row (Chat trái, Pipeline phải)
- mobile: Chat trên, Pipeline dưới

### 2. BotPipeline.tsx — Height adjust (optional)
- Có thể cần giảm height để fit vừa cột phải 480px
- Hiện tại component không có height cố định ngoại trừ `min-h-[260px]` ở detail panel
- Có thể thêm `max-h-[480px] overflow-y-auto` nếu cần

### 3. Xoá section code cũ
- Xoá `{/* ══════ BOT INTELLIGENCE PIPELINE ══════ */}` section
- Xoá `<BotPipeline />` cũ ở dưới (vì đã chuyển lên trên)
- Giữ heading + comparison, đặt xuống dưới

## Files cần sửa
| File | Thay đổi |
|------|----------|
| `src/app/page.tsx` | Gộp 2 sections, xoá feature cards, đặt BotPipeline vào right column |
| (optional) `src/components/BotPipeline.tsx` | Thêm height constraint nếu cần |

## Rủi ro
1. **Chiều cao BotPipeline > 480px** → cần `overflow-y-auto` hoặc giảm padding
2. **BotPipeline tự động chạy animation** → conflict với ChatDemo auto-chat? → Không vì mỗi component độc lập
3. **Responsive mobile** → BotPipeline rộng full width khi stack dọc → OK, component đã responsive

## Không thay đổi
- `i18n.ts`, `ChatDemo.tsx`, `LangToggle.tsx` — không cần sửa
- Các section khác (Features, Platform, Pain Points, Testimonial, CTA, Footer) — giữ nguyên
