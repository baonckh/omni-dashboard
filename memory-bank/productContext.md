# Product Context: OmniAI Dashboard

## Why this project exists?
Backend của OmniAI mạnh mẽ nhưng cần một "bộ mặt" để người dùng tương tác. Dashboard đóng vai trò là trung tâm chỉ huy, nơi chủ shop ra lệnh cho AI và nhìn thấy kết quả công việc của nó.

## Problems it solves
- **Technical Barrier**: Cấu hình AI qua JSON rất khó. Dashboard cung cấp các Form trực quan (Persona, Stages).
- **Hidden Intelligence**: Chủ shop không biết AI đang nghĩ gì. Playground show "AI Thought Process" để minh bạch hóa.
- **Provider Complexity**: Việc quản lý nhiều API Keys (OpenAI, Gemini...) rất rối. Dashboard tối giản hóa thành giao diện quản lý List/Toggle.
- **Silent Leads**: Lead bị trôi trong tin nhắn. Dashboard gom Lead vào một bảng theo dõi chuyên nghiệp.

## User Experience Goals
- **Elegance**: Sử dụng Dark Mode, Glassmorphism và Shimmer effects để tạo ấn tượng mạnh.
- **Speed**: Single Page Application (SPA) cho trải nghiệm mượt mà, không load lại trang.
- **Transparency**: Hiển thị rõ: "Bot đã tốn $0.05 để chốt đơn này".
- **Safety**: Cho phép "Sử dụng" hoặc "Tắt" key chỉ bằng một click.
