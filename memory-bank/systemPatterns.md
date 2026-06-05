# System Patterns: OmniAI Dashboard

## UI Architecture
- **Page-based Routing**: App Router phân chia rõ ràng theo chức năng:
  - `overview/`: Dashboard tổng quan
  - `bots/`: Quản lý bots và persona
  - `inbox/`: Unified inbox cho mọi kênh
  - `leads/`: Quản lý leads
  - `insights/`: Báo cáo và phân tích
  - `channels/`: Kênh tích hợp
  - `settings/`: Cài đặt hệ thống
  - `billing/`: Quản lý thanh toán

- **Component Decomposition**:
  - `components/ui/`: Các atom/molecule components từ Magic UI/Tailwind.
  - `components/layout/`: Layout components (Sidebar, Header, etc.).
  - `BotPersonaTab.tsx`: Component chuyên dụng cho cấu hình bot.

- **Shared Utils**: 
  - `lib/api.ts`: API client wrapper tập trung
  - `lib/utils.ts`: Utility functions (cn, etc.)

## Key Patterns
- **Optimistic UI Updates**: Cập nhật giao diện ngay lập tức khi xóa/sửa (VD: Xóa tài liệu) và đồng bộ backend sau.
- **Status-Driven UI**: Hiển thị trạng thái Active/Error/Pending dựa trên dữ liệu backend (VD: API Key status).
- **Adapter-based Selection**: Cho phép chọn Provider/Model qua bộ lọc dynamic (Chỉ hiện provider có key).
- **Safe State Handling**: Sử dụng optional chaining và fallbacks (`?.` và `||`) cho dữ liệu từ API.
- **Client Components**: Phần lớn sử dụng `"use client"` cho tương tác thời gian thực.

## Design System
- **Background**: `bg-black/40` kết hợp `backdrop-blur`.
- **Borders**: `border-white/5` hoặc `border-purple-500/20`.
- **Typography**: Chú trọng font weight và tracking cho cảm giác hiện đại.
- **Animations**: `animate-in slide-in-from-bottom-4` cho các tab switch.
- **Icons**: Lucide Icons cho consistency.

## State Management
- **Local State**: React useState/useEffect cho component-level state.
- **API State**: Centralized API client trong `lib/api.ts`.
- **Form State**: Native React state với controlled components.
