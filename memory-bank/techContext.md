# Technical Context: OmniAI Dashboard

## Technologies Used
- **Framework**: Next.js 15 (App Router).
- **Language**: TypeScript (Strict mode).
- **Styling**: TailwindCSS.
- **UI Components**:
  - **Magic UI**: Hiệu ứng cao cấp (Shimmer Button, Bento Grid, Neon Gradient).
  - **Lucide Icons**: Bộ icon hiện đại.
- **State & Logic**: 
  - `fetch` API với wrapper tập trung trong `src/lib/api.ts`.
  - React Hooks (useEffect, useState) cho quản lý local state.
- **Deployment**: Local Node.js / Vercel ready.

## Development Setup
- **OS**: Windows (User)
- **Node Runtime**: Node.js 20+
- **Commands**: 
  - `bun run dev`: Khởi chạy môi trường dev.
  - `bun run build`: Build production.

## Technical Constraints
- **Client-Side Rendering**: Phần lớn Dashboard là `use client` để xử lý tương tác thời gian thực.
- **API Synchronization**: Phải luôn đồng bộ với cấu hình mới nhất từ backend (Settings).
- **Responsive**: Ưu tiên trải nghiệm Tablet/Desktop cho việc quản lý, nhưng vẫn dùng được trên Mobile.
- **Design Consistency**: Tuân thủ hệ thống token màu Neutral/Blue/Purple của theme.
