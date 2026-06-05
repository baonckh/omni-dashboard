# Technical Context: OmniAI Dashboard

## Technologies Used
- **Framework**: Next.js 16.1.6 (App Router).
- **Language**: TypeScript 5 (Strict mode).
- **Styling**: TailwindCSS 4 với PostCSS.
- **UI Components**:
  - **Magic UI**: Hiệu ứng cao cấp (Shimmer Button, Bento Grid, Neon Gradient).
  - **Lucide Icons**: Bộ icon hiện đại (v0.577.0).
  - **Framer Motion**: Animation library (v12.36.0).
- **State & Logic**: 
  - `fetch` API với wrapper tập trung trong `src/lib/api.ts`.
  - React Hooks (useEffect, useState) cho quản lý local state.
- **Utilities**:
  - `clsx`: Conditional class names.
  - `tailwind-merge`: Merge Tailwind classes.
- **Deployment**: Local Node.js / Vercel ready.

## Development Setup
- **OS**: Windows (User)
- **Node Runtime**: Node.js 20+
- **Package Manager**: Bun (bun.lock)
- **Commands**: 
  - `bun run dev`: Khởi chạy môi trường dev.
  - `bun run build`: Build production.
  - `bun run lint`: Chạy ESLint.

## Project Structure
```
src/
├── app/
│   ├── (dashboard)/       # Route group cho dashboard
│   │   ├── overview/      # Dashboard tổng quan
│   │   ├── bots/          # Quản lý bots
│   │   ├── inbox/         # Unified inbox
│   │   ├── leads/         # Lead management
│   │   ├── insights/      # Analytics
│   │   ├── channels/      # Channel integration
│   │   ├── settings/      # System settings
│   │   ├── billing/       # Billing management
│   │   └── layout.tsx     # Dashboard layout
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # UI components
│   ├── layout/            # Layout components
│   └── BotPersonaTab.tsx  # Bot configuration
└── lib/
    ├── api.ts             # API client
    └── utils.ts           # Utilities
```

## Technical Constraints
- **Client-Side Rendering**: Phần lớn Dashboard là `use client` để xử lý tương tác thời gian thực.
- **API Synchronization**: Phải luôn đồng bộ với cấu hình mới nhất từ backend (Settings).
- **Responsive**: Ưu tiên trải nghiệm Tablet/Desktop cho việc quản lý, nhưng vẫn dùng được trên Mobile.
- **Design Consistency**: Tuân thủ hệ thống token màu Neutral/Blue/Purple của theme.
- **Type Safety**: Strict TypeScript mode với full type coverage.

## Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.1.6 | React framework |
| react | 19.2.3 | UI library |
| react-dom | 19.2.3 | DOM renderer |
| tailwindcss | 4 | CSS framework |
| framer-motion | 12.36.0 | Animation |
| lucide-react | 0.577.0 | Icons |
| clsx | 2.1.1 | Class names |
| tailwind-merge | 3.5.0 | Class merging |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | 5 | Type system |
| eslint | 9 | Linting |
| eslint-config-next | 16.1.6 | Next.js ESLint config |
| @types/node | 20 | Node types |
| @types/react | 19 | React types |
| @tailwindcss/postcss | 4 | Tailwind PostCSS plugin |
