# System Patterns: OmniAI Dashboard

## UI Architecture
- **Page-based Routing**: App Router phân chia rõ ràng (`dashboard`, `settings`, `playground`, `insights`).
- **Component Decomposition**:
  - `components/ui/`: Các atom/molecule components từ Magic UI/Tailwind.
  - `playground/components/`: Các module phức tạp chuyên dụng cho giả lập (MultiChat, Knowledge).
- **Shared Utils**: `shared.tsx` chứa các định nghĩa chung về UI (Card, Field, Platforms).

## Key Patterns
- **Optimistic UI Updates**: Cập nhật giao diện ngay lập tức khi xóa/sửa (VD: Xóa tài liệu) và đồng bộ backend sau.
- **Status-Driven UI**: Hiển thị trạng thái Active/Error/Pending dựa trên dữ liệu backend (VD: API Key status).
- **Adapter-based Selection**: Cho phép chọn Provider/Model qua bộ lọc dynamic (Chỉ hiện provider có key).
- **Safe State Handling**: Sử dụng optional chaining và fallbacks (`?.` và `||`) cho dữ liệu từ API.

## Design System
- **Background**: `bg-black/40` kết hợp `backdrop-blur`.
- **Borders**: `border-white/5` hoặc `border-purple-500/20`.
- **Typography**: Chú trọng font weight và tracking cho cảm giác hiện đại.
- **Animations**: `animate-in slide-in-from-bottom-4` cho các tab switch.
