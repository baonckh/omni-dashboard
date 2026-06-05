# Project Brief: OmniAI Dashboard

Giao diện quản trị tập trung (Admin Hub) cho hệ thống OmniAI, giúp chủ shop quản lý bot, khách hàng và doanh thu dễ dàng.

## Core Requirements
- **Dynamic Configuration**: Setup tính cách Bot, kịch bản bán hàng và API Keys.
- **Unified Inbox**: Hộp thư chung gom tin nhắn từ mọi sàn về một nơi.
- **Knowledge Management**: Upload tài liệu, quản lý kiến thức AI chuyên sâu.
- **Real-time Insights**: Dashboard theo dõi Lead, doanh số và chi phí AI.
- **Advanced Playground**: Môi trường giả lập để test AI trước khi go-live.

## Project Goals
- **Wowed UI**: Thiết kế cao cấp, hiện đại (Magic UI, Bento Grid) mang lại cảm giác Premium.
- **Zero-Code**: Chủ shop không cần biết code vẫn cấu hình được AI phức tạp.
- **Actionable Data**: Chuyển đổi hội thoại thành số liệu kinh doanh thực tế.

## Application Structure
```
src/app/(dashboard)/
├── overview/        # Dashboard tổng quan
├── bots/           # Quản lý bots
├── inbox/          # Hộp thư tập trung
├── leads/          # Quản lý leads
├── insights/       # Báo cáo và phân tích
├── channels/       # Kênh tích hợp
├── settings/       # Cài đặt hệ thống
└── billing/        # Quản lý thanh toán
```
