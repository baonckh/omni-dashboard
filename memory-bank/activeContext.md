# Active Context: OmniAI Dashboard

## Current Work Focus
- **AI Management Pro**: Hoàn thiện UI quản lý đa API Keys với giao diện List-Detail.
- **Knowledge 2026 UI**: Cập nhật bộ chọn Model với các ID mới nhất (text-embedding-3-large, voyage-4).
- **Dynamic Filtering**: Chỉ cho phép chọn Provider/Model nếu đã có Active Key tương ứng.
- **Chat Playground Sync**: Đồng bộ simulator với cơ chế chọn provider mới của backend.

## Recent Changes
- **Settings Redesign**: Chuyển từ form tĩnh sang bảng quản lý API Keys chuyên nghiệp.
- **Knowledge Section Upgrade**: Thêm visual indicators (Indicator đèn xanh/đỏ) cho trạng thái Provider.
- **API Client Sync**: Cập nhật bộ interface `BotSetting` và `APIKey` đồng nhất với backend.
- **Lint Fixing**: Sửa triệt để các lỗi thiếu import/mismatch tham số sau refactor.

## Next Steps
1. **Chat Playround logic**: Gửi `provider` và `model` trong request `playgroundChat`.
2. **Usage Dashboard Charts**: Hoàn thiện hiển thị biểu đồ chi phí theo từng `KeyID`.
3. **Empty States**: Làm đẹp các màn hình khi chưa có dữ liệu.

## Important Decisions
- Sử dụng Lucide Icons thay cho các SVG cứng để dễ bảo trì.
- Gom chung logic fetch vào `lib/api.ts` để tránh lặp code.
- Dùng `ShimmerButton` cho các action quan trọng (Save/Update) để nhấn mạnh UI.
