"use client";

import React from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import { Zap, ArrowLeft, ExternalLink, Mail } from "lucide-react";
import LangToggle from "@/components/LangToggle";

const DOCS_CONTENT: Record<string, {
  vi: { title: string; sections: { h: string; p: string }[]; cta?: { label: string; href: string } };
  en: { title: string; sections: { h: string; p: string }[]; cta?: { label: string; href: string } };
}> = {
  "register": {
    vi: { title: "Đăng ký tài khoản", sections: [
      { h: "Bước 1: Truy cập trang Đăng ký", p: "Vào trang /register, điền email, tên và mật khẩu. Hoặc chọn 'Tiếp tục với Google' để đăng ký nhanh." },
      { h: "Bước 2: Xác thực email", p: "Kiểm tra hộp thư đến và xác thực email (nếu được yêu cầu)." },
      { h: "Bước 3: Hoàn tất Onboarding", p: "Sau khi đăng nhập, bạn sẽ được hướng dẫn qua luồng Onboarding 6 bước: thiết lập shop, nhập sản phẩm, tạo bot, kết nối kênh, dùng thử và deploy." },
    ], cta: { label: "Đăng ký ngay", href: "/register" } },
    en: { title: "Create Account", sections: [
      { h: "Step 1: Go to Register", p: "Visit /register, enter email, name and password. Or click 'Continue with Google' for quick sign-up." },
      { h: "Step 2: Verify Email", p: "Check your inbox and verify your email (if required)." },
      { h: "Step 3: Complete Onboarding", p: "After login, you'll be guided through a 6-step onboarding flow: shop setup, products, bot creation, channel connection, testing and deploy." },
    ], cta: { label: "Register Now", href: "/register" } },
  },
  "connect-fb": {
    vi: { title: "Kết nối Facebook Messenger", sections: [
      { h: "Yêu cầu", p: "Bạn cần có Facebook Page và quyền Quản trị Page để kết nối." },
      { h: "Bước 1: Vào trang Channels", p: "Vào Channels → nhấn nút '+' trên card Facebook Messenger." },
      { h: "Bước 2: Xác thực Facebook", p: "Cửa sổ Facebook OAuth sẽ mở ra. Đăng nhập và chọn Page bạn muốn kết nối." },
      { h: "Bước 3: Bot tự động trả lời", p: "Sau khi kết nối, bot OmniAI sẽ tự động trả lời tin nhắn từ Page đó." },
    ], cta: { label: "Đến Channels", href: "/app/channels" } },
    en: { title: "Connect Facebook Messenger", sections: [
      { h: "Requirements", p: "You need a Facebook Page with Admin access to connect." },
      { h: "Step 1: Go to Channels", p: "Go to Channels → click '+' on the Facebook Messenger card." },
      { h: "Step 2: Facebook Auth", p: "A Facebook OAuth window opens. Login and select the Page you want to connect." },
      { h: "Step 3: Auto-reply", p: "Once connected, OmniAI bot will automatically reply to messages from that Page." },
    ], cta: { label: "Go to Channels", href: "/app/channels" } },
  },
  "basic-ai": {
    vi: { title: "Cấu hình AI cơ bản", sections: [
      { h: "Yêu cầu", p: "Bạn cần có API key từ OpenAI, Google Gemini hoặc OpenRouter." },
      { h: "Bước 1: Vào Settings", p: "Vào Settings → AI Providers tab." },
      { h: "Bước 2: Thêm Key", p: "Nhấn 'Thêm Key Mới', chọn provider (OpenAI/Gemini/OpenRouter), dán API key và bật Active." },
      { h: "Bước 3: Lưu", p: "Nhấn Save. Bot sẽ tự động sử dụng key này để trả lời khách hàng." },
      { h: "Lấy API Key ở đâu?", p: "OpenAI: platform.openai.com/api-keys | Gemini: aistudio.google.com/apikey | OpenRouter: openrouter.ai/keys" },
    ], cta: { label: "Đến Settings", href: "/app/settings" } },
    en: { title: "Basic AI Setup", sections: [
      { h: "Requirements", p: "You need an API key from OpenAI, Google Gemini or OpenRouter." },
      { h: "Step 1: Go to Settings", p: "Go to Settings → AI Providers tab." },
      { h: "Step 2: Add Key", p: "Click 'Add New Key', select provider (OpenAI/Gemini/OpenRouter), paste API key and toggle Active." },
      { h: "Step 3: Save", p: "Click Save. The bot will automatically use this key to reply to customers." },
      { h: "Where to get API Keys?", p: "OpenAI: platform.openai.com/api-keys | Gemini: aistudio.google.com/apikey | OpenRouter: openrouter.ai/keys" },
    ], cta: { label: "Go to Settings", href: "/app/settings" } },
  },
  "import-guide": {
    vi: { title: "Hướng dẫn chuẩn bị file nhập liệu", sections: [
      { h: "Tổng quan", p: "Hệ thống hỗ trợ nhập SẢN PHẨM và CHÍNH SÁCH qua file CSV hoặc JSON. Parser được thiết kế linh hoạt, tự động nhận diện tên cột tiếng Việt/Anh, delimiter (dấu phẩy, chấm phẩy, tab), và định dạng số (có dấu phẩy, ký tự tiền tệ)." },
      { h: "📦 File sản phẩm mẫu", p: "Tối thiểu 3 cột bắt buộc: Mã sản phẩm, Tên sản phẩm, Giá. Tên cột có thể đặt linh hoạt — parser tự hiểu." },
      { h: "CSV sản phẩm (dấu phẩy)", p: 'Mã sản phẩm,Tên sản phẩm,Giá,Danh mục,Tồn kho,Mô tả\nSP001,Áo thun nam cotton,250000,Thời trang,100,"Chất liệu cotton 100%"\nSP002,Quần jean nữ,350000,Thời trang,50,Quần jean skinny\nSP003,Túi xách da,890000,Phụ kiện,30,"Túi xách da cao cấp, màu đen"' },
      { h: "CSV sản phẩm (chấm phẩy — Excel Việt Nam)", p: 'Mã sp;Tên sản phẩm;Giá;Loại;Kho\nSP001;Áo thun;250.000;Thời trang;100\nSP002;Quần jean;350.000;Thời trang;50' },
      { h: "JSON sản phẩm", p: '[\n  {"product_code": "SP001", "name": "Áo thun nam", "price": 250000, "category": "Thời trang", "stock": 100},\n  {"product_code": "SP002", "name": "Quần jean", "price": 350000, "category": "Thời trang", "stock": 50}\n]' },
      { h: "📋 File chính sách mẫu", p: "Tối thiểu 2 cột: Tiêu đề (title), Nội dung (content). Cột Tags là tuỳ chọn." },
      { h: "CSV chính sách", p: 'Tiêu đề,Nội dung,Tags\nChính sách đổi trả,"Khách hàng được đổi hàng trong 30 ngày, kèm hóa đơn gốc.",đổi trả;hoàn tiền\nChính sách vận chuyển,"Free ship cho đơn hàng trên 500,000₫ trong nội thành.",vận chuyển;giao hàng\nChính sách bảo hành,"Sản phẩm được bảo hành 12 tháng lỗi nhà sản xuất.",bảo hành;sửa chữa' },
      { h: "Mẹo", p: "• Dùng UTF-8 (có BOM) để Excel mở được tiếng Việt\n• Nếu có dấu phẩy trong nội dung, bọc cột trong dấu \"...\"\n• File tối đa 10MB, tối đa 1000 sản phẩm/lần\n• Ảnh sản phẩm có thể đặt URL, nhiều ảnh cách nhau bằng dấu |" },
      { h: "Tên cột được hỗ trợ", p: 'Parser tự nhận diện các tên cột sau (không phân biệt hoa/thường, không dấu):\n\n📦 Sản phẩm:\n- Mã SP: mã, sku, product_code, code, masp, product_id\n- Tên: tên, name, title, ten_sp, product_name\n- Giá: giá, price, gia, dongia\n- Danh mục: danh mục, category, loại, type\n- Tồn kho: tồn kho, stock, quantity, ton_kho\n- Mô tả: mô tả, description, mota, detail\n- Ảnh: hình ảnh, images, image, hinhanh\n\n📋 Chính sách:\n- Tiêu đề: tiêu đề, title, tên, name\n- Nội dung: nội dung, content, mô tả, desc\n- Tags: tags, từ khóa, keyword, label' },
    ], cta: { label: "Bắt đầu nhập liệu", href: "/app/bots" } },
    en: { title: "File Import Guide", sections: [
      { h: "Overview", p: "The system supports importing PRODUCTS and POLICIES via CSV or JSON files. The parser is flexible — it auto-detects Vietnamese/English column names, delimiters (comma, semicolon, tab), and number formats (with commas, currency symbols)." },
      { h: "📦 Sample Products File", p: "Minimum 3 required columns: Product Code, Name, Price. Column names are flexible — the parser understands them all." },
      { h: "CSV products (comma)", p: 'Product Code,Name,Price,Category,Stock,Description\nSP001,Cotton T-shirt,250000,Fashion,100,"100% premium cotton"\nSP002,Skinny Jeans,350000,Fashion,50,Skinny fit jeans\nSP003,Leather Bag,890000,Accessories,30,"High-quality leather bag, black"' },
      { h: "CSV products (semicolon — for Excel)", p: 'Code;Name;Price;Category;Stock\nSP001;T-shirt;250000;Fashion;100\nSP002;Jeans;350000;Fashion;50' },
      { h: "JSON products", p: '[\n  {"product_code": "SP001", "name": "Cotton T-shirt", "price": 250000, "category": "Fashion", "stock": 100},\n  {"product_code": "SP002", "name": "Jeans", "price": 350000, "category": "Fashion", "stock": 50}\n]' },
      { h: "📋 Sample Policies File", p: "Minimum 2 columns: Title, Content. Tags column is optional." },
      { h: "CSV policies", p: 'Title,Content,Tags\nReturn Policy,"Customers can return items within 30 days with original receipt.",return;refund\nShipping Policy,"Free shipping for orders over $50 within the city.",shipping;delivery\nWarranty Policy,"Products are warranted for 12 months against manufacturing defects.",warranty;repair' },
      { h: "Tips", p: "• Use UTF-8 (with BOM) for Excel compatibility\n• If content contains commas, wrap the column in \"...\"\n• Max file size: 10MB, max 1000 products per batch\n• Product image URLs can be separated by |" },
      { h: "Supported Column Names", p: 'The parser auto-detects these column names (case-insensitive, diacritic-insensitive):\n\n📦 Products:\n- Code: mã, sku, product_code, code, masp\n- Name: tên, name, title, ten_sp\n- Price: giá, price, gia, dongia\n- Category: danh mục, category, loại\n- Stock: tồn kho, stock, quantity\n- Description: mô tả, description, detail\n- Images: hình ảnh, images, image\n\n📋 Policies:\n- Title: tiêu đề, title, name\n- Content: nội dung, content, description\n- Tags: tags, keyword, label' },
    ], cta: { label: "Start Importing", href: "/app/bots" } },
  },
  "create-persona": {
    vi: { title: "Tạo AI Persona", sections: [
      { h: "Vào Bot Config", p: "Vào AI Bots → chọn bot hoặc tạo bot mới." },
      { h: "Cấu hình Persona", p: "Trong tab Persona: đặt tên bot, chọn giọng điệu (Chuyên nghiệp/Thân thiện/Hài hước), nhập lời chào." },
      { h: "Thiết lập Rules", p: "Thêm rules cho bot: 'Luôn trả lời tiếng Việt', 'Thu thập SĐT khách hàng', 'Không tự ý giảm giá'." },
      { h: "Lưu", p: "Nhấn Save để áp dụng." },
    ], cta: { label: "Đến AI Bots", href: "/app/bots" } },
    en: { title: "Create AI Persona", sections: [
      { h: "Go to Bot Config", p: "Go to AI Bots → select a bot or create a new one." },
      { h: "Configure Persona", p: "In the Persona tab: set bot name, choose tone (Professional/Friendly/Humorous), enter greeting." },
      { h: "Set Rules", p: "Add bot rules: 'Always reply in Vietnamese', 'Collect customer phone numbers', 'No unauthorized discounts'." },
      { h: "Save", p: "Click Save to apply." },
    ], cta: { label: "Go to AI Bots", href: "/app/bots" } },
  },
};

export default function DocDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { lang } = useLang();
  const isVI = lang === "vi";
  const doc = DOCS_CONTENT[slug];

  if (!doc) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4">{isVI ? "Không tìm thấy tài liệu" : "Document not found"}</p>
          <Link href="/docs" className="text-blue-400 hover:text-blue-300">{isVI ? "← Về tài liệu" : "← Back to docs"}</Link>
        </div>
      </div>
    );
  }

  const content = isVI ? doc.vi : doc.en;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl border border-white/[0.06] bg-black/70 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
          </Link>
          <LangToggle />
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-5 pt-28 pb-20">
        <Link href="/docs" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> {isVI ? "Về tài liệu" : "Back to docs"}
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-8">{content.title}</h1>

        <div className="space-y-8">
          {content.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-white mb-2">{s.h}</h2>
              {s.p.includes("\n") || s.p.includes("SP00") || s.p.startsWith("[") ? (
                <pre className="text-sm text-zinc-300 leading-relaxed bg-white/[0.03] border border-white/10 rounded-xl p-4 overflow-x-auto font-mono whitespace-pre-wrap">{s.p}</pre>
              ) : (
                <p className="text-sm text-zinc-400 leading-relaxed">{s.p}</p>
              )}
            </div>
          ))}
        </div>

        {content.cta && (
          <div className="mt-10 pt-8 border-t border-white/10">
            <Link href={content.cta.href}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.97]">
              {content.cta.label} <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      <footer className="border-t border-white/[0.06] pt-10 pb-8 px-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-xs text-zinc-600">© 2026 OmniAI. {isVI ? "Mọi quyền được bảo lưu." : "All rights reserved."}</p>
          <a href="mailto:hello@omni-ai.com" className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-white"><Mail className="h-3 w-3" /> hello@omni-ai.com</a>
        </div>
      </footer>
    </div>
  );
}
