"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Lang = "vi" | "en";

type Dict = Record<string, string>;

const vi: Dict = {
  // ── Nav ──
  "nav.login": "Đăng nhập",
  "nav.getstarted": "Dùng thử miễn phí",

  // ── Hero ──
  "badge.mvp": "Dùng thử miễn phí — không cần thẻ tín dụng",
  "hero.title": "Đừng để khách hỏi mà không ai trả lời",
  "hero.sub": "Tập trung tin nhắn từ Facebook, Zalo, TikTok Shop, Shopee, Instagram về một nơi. AI tự động tư vấn, chốt đơn 24/7 — giống hệt nhân viên của bạn, nhưng không bao giờ ngủ.",
  "hero.cta": "Dùng thử miễn phí",
  "hero.login": "Đăng nhập",

  // ── Pain Points ──
  "pain.title": "Bạn có đang gặp những vấn đề này?",
  "pain.1.title": "Khách nhắn đêm, ngày lễ — không ai trực",
  "pain.1.desc": "Chủ shop nhỏ: 1 mình ôm đồm không trả lời kịp. Chủ shop lớn: đội CSKH 10 người vẫn không theo nổi lượng tin nhắn.",
  "pain.2.title": "Tuyển nhân viên CSKH liên tục, đào tạo mất thời gian",
  "pain.2.desc": "Nhân viên cũ nghỉ — mất mạch. Nhân viên mới vào — mất 2 tuần training. Lương 3-5 nhân viên = 15-30 triệu/tháng.",
  "pain.3.title": "Facebook, Zalo, TikTok, Shopee — mỗi nơi một chat",
  "pain.3.desc": "5 app, 5 tài khoản, 5 cách trả lời. Quản lý rời rạc, khách hỏi bên này quên bên kia.",
  "pain.4.title": "Sợ AI trả lời như robot, mất chất riêng của shop",
  "pain.4.desc": "Bot tư vấn chung chung làm khách không tin tưởng. Shop bạn có cách nói riêng, phong cách riêng — AI phải giữ được điều đó.",

  // ── Stats ──
  "stat.reply": "Trả lời tự động",
  "stat.response": "Tốc độ phản hồi",
  "stat.channels": "Kênh kết nối",
  "stat.staff": "Nhân viên có thể cắt giảm",

  // ── Features ──
  "features.title": "OmniAI làm được gì cho shop của bạn?",
  "features.sub": "Dù bạn là shop nhỏ 1 người quản lý hay doanh nghiệp có đội ngũ CSKH lớn — OmniAI giúp tự động hóa mà vẫn giữ cá tính riêng.",
  "feat.inbox.title": "Hộp thư tập trung — 5 kênh về 1",
  "feat.inbox.desc": "Tất cả tin nhắn từ Facebook, Zalo OA, TikTok Shop, Shopee, Instagram về một inbox duy nhất. Không cần mở 5 app mỗi ngày.",
  "feat.ai.title": "AI hiểu sản phẩm, chính sách, tồn kho của bạn",
  "feat.ai.desc": "Tải catalog, chính sách, quy định lên — AI tự động học. Trả lời khách như nhân viên đã làm 3 tháng, không cần training.",
  "feat.channels.title": "Kết nối tất cả kênh bán hàng",
  "feat.channels.desc": "Facebook Messenger, Zalo OA, TikTok Shop, Shopee, Instagram — tích hợp sẵn. Click phát kết nối xong.",
  "feat.insight.title": "Biết khách hàng đang nghĩ gì, bot đang làm tốt không",
  "feat.insight.desc": "Lead, doanh thu, hiệu suất bot, insight khách hàng — dashboard hiển thị real-time. Chỗ nào yếu thì cải thiện.",

  // ── Platform Section ──
  "platform.title": "Tích hợp tất cả nền tảng khách hàng của bạn",
  "platform.sub": "Khách ở đâu — OmniAI bắt được ở đó.",
  "platform.facebook": "Facebook Messenger",
  "platform.zalo": "Zalo OA",
  "platform.tiktok": "TikTok Shop",
  "platform.shopee": "Shopee",
  "platform.instagram": "Instagram",

  // ── Use Case Section ──
  "usecase.title": "Nhân viên CSKH AI — làm việc 24/7, không ca kíp, không lương tháng 13",
  "usecase.sub": "Chạy 24/7, giữ đúng chất shop, giá chỉ bằng lương 1 nhân viên — không tăng ca, không nghỉ Tết, không đòi tăng lương.",
  "usecase.1.title": "Trả lời bất cứ lúc nào, kể cả 3 giờ sáng",
  "usecase.1.desc": "Khách nhắn lúc nửa đêm, ngày lễ, Tết — bot trả lời ngay trong 3 giây. Không bỏ lỡ bất kỳ đơn hàng nào.",
  "usecase.2.title": "Thuộc sản phẩm ngay lần đầu, không cần đào tạo lại",
  "usecase.2.desc": "Tải catalog lên một lần — AI tự động học giá, tồn kho, mô tả sản phẩm. Không cần training nhiều lần như nhân viên thật.",
  "usecase.3.title": "Tư vấn đúng chất riêng của shop bạn",
  "usecase.3.desc": "Không trả lời chung chung như tổng đài. AI giữ đúng giọng văn, cách xưng hô, phong cách tư vấn riêng của shop.",
  "usecase.4.title": "Tiết kiệm 15-30 triệu/tháng tiền nhân sự",
  "usecase.4.desc": "Một nhân viên AI làm việc 24/7 — không ca kíp, không lương tháng 13, không ốm đau, không nghỉ Tết, không đòi tăng lương.",

  // ── Social Proof ──
  "trusted.title": "Được tin dùng bởi các chủ shop SME",

  // ── Pain Point Stats (VI) ──
  "stat.pain1": "Khách rời đi sau 5 phút chờ",
  "stat.pain2": "Triệu đồng/tháng chi phí CSKH",
  "stat.pain3": "App khác nhau mỗi ngày",
  "stat.pain4": "Khách hỏi lại vì bot không hiểu",

  // ── Testimonial (VI) ──
  "testimonial.text": "Tôi từng xây chatbot cho các chủ shop. Tôi thấy họ vật lộn — tin nhắn đêm khuya không ai trả lời, trả 15-30 triệu/tháng cho nhân viên CSKH, bot trả lời như robot làm mất chất riêng của shop. Tôi tự hỏi: tại sao không xây một AI thực sự hiểu sản phẩm, chính sách và nói chuyện như chủ shop? Thế là tôi xây OmniAI. Sau khi thử với vài shop, kết quả tốt hơn tôi mong đợi — họ cắt giảm chi phí CSKH, không bỏ lỡ đơn hàng nào, khách hàng còn khen tư vấn nhiệt tình. Đó là lúc tôi quyết định biến nó thành nền tảng, không chỉ cho vài người bạn, mà cho tất cả chủ shop SME ở Việt Nam.",
  "testimonial.name": "Bao — Founder & Developer",
  "testimonial.role": "Từ xây bot cho shop đến xây OmniAI cho hàng ngàn shop",

  // ── CTA (VI) ──
  "cta.title": "50+ SME đã và đang sử dụng OmniAI",
  "cta.sub": "Miễn phí. Không cần thẻ tín dụng. 5 phút bắt đầu.",
  "cta.btn": "Dùng thử miễn phí",

  // ── Footer (VI) ──
  "footer.desc": "OmniAI là nền tảng Omnichannel AI giúp các chủ shop SME và doanh nghiệp đang phát triển tự động hóa chăm sóc khách hàng — hợp nhất 5 kênh về một nơi, giảm 50-70% chi phí nhân sự CSKH, không bỏ lỡ đơn hàng, giữ đúng chất riêng của thương hiệu.",
  "footer.product": "Sản phẩm",
  "footer.features": "Tính năng",
  "footer.pricing": "Bảng giá",
  "footer.docs": "Tài liệu",
  "footer.company": "Công ty",
  "footer.about": "Giới thiệu",
  "footer.blog": "Blog",
  "footer.contact": "Liên hệ",
  "footer.legal": "Pháp lý",
  "footer.privacy": "Chính sách bảo mật",
  "footer.terms": "Điều khoản dịch vụ",
  "footer.copyright": "Bản quyền thuộc về OmniAI.",
  "footer.rights": "Mọi quyền được bảo lưu.",

  // ── Pricing Page (VI) ──
  "pricing.badge": "Beta — Hoàn toàn miễn phí trong giai đoạn MVP",
  "pricing.title": "Bảng giá đơn giản, minh bạch",
  "pricing.sub": "Tất cả đều miễn phí trong thời gian Beta. Không cần thẻ tín dụng.",
  "pricing.free_name": "Free",
  "pricing.free_period": "mãi mãi",
  "pricing.free_badge": "Beta",
  "pricing.free_desc": "Dành cho chủ shop SME dùng thử AI CSKH",
  "pricing.free_feat1": "Quản lý shop",
  "pricing.free_feat2": "Facebook, TikTok Shop, Shopee, Web Widget",
  "pricing.free_feat3": "AI multi-agent với cá tính riêng",
  "pricing.free_feat4": "Inbox tập trung + chuyển manual",
  "pricing.free_feat5": "Nhập sản phẩm từ CSV/text",
  "pricing.free_feat6": "AI insights & customer profiling",
  "pricing.free_feat7": "Cộng đồng hỗ trợ",
  "pricing.free_cta": "Đang hoạt động",
  "pricing.starter_name": "Starter",
  "pricing.starter_price": "$8",
  "pricing.starter_badge": "Phổ biến",
  "pricing.starter_desc": "Cho shop đang phát triển cần AI ổn định",
  "pricing.starter_feat1": "3 shops",
  "pricing.starter_feat2": "Tất cả kênh + ưu tiên",
  "pricing.starter_feat3": "3.000 hội thoại/tháng",
  "pricing.starter_feat4": "Cá tính bot tùy chỉnh",
  "pricing.starter_feat5": "Tự động học catalog",
  "pricing.starter_feat6": "Dashboard 90 ngày",
  "pricing.starter_feat7": "Hỗ trợ email 24h",
  "pricing.starter_feat8": "Thêm shop: +$4/tháng",
  "pricing.starter_cta": "Liên hệ",
  "pricing.pro_name": "Pro",
  "pricing.pro_price": "$0",
  "pricing.pro_period": "khi Beta",
  "pricing.pro_badge": "Miễn phí Beta",
  "pricing.pro_desc": "Toàn bộ tính năng — miễn phí trong thời gian Beta",
  "pricing.pro_feat1": "Quản lý không giới hạn shop",
  "pricing.pro_feat2": "Tất cả kênh + Web Widget",
  "pricing.pro_feat3": "AI multi-agent + custom persona",
  "pricing.pro_feat4": "Telegram notification + webhook",
  "pricing.pro_feat5": "AI provider tự do (OpenAI, Gemini...)",
  "pricing.pro_feat6": "Import sản phẩm + đồng bộ",
  "pricing.pro_feat7": "AI insights đầy đủ",
  "pricing.pro_feat8": "Hỗ trợ ưu tiên khi Beta",
  "pricing.pro_cta": "Dùng thử miễn phí",
  "pricing.contact_title": "Cần thêm?",
  "pricing.contact_desc": "Nếu bạn cần thêm shop hoặc tính năng tùy chỉnh — hãy liên hệ.",
  "pricing.contact_btn": "Liên hệ qua email",

  // ── Auth Pages (VI) ──
  "auth.login.title": "Đăng nhập",
  "auth.login.google": "Tiếp tục với Google",
  "auth.login.loading": "Đang đăng nhập...",
  "auth.login.email": "Email",
  "auth.login.password": "Mật khẩu",
  "auth.login.submit": "Đăng nhập",
  "auth.login.no_account": "Chưa có tài khoản?",
  "auth.login.register": "Đăng ký",
  "auth.login.divider": "HOẶC",
  "auth.error.invalid": "Email hoặc mật khẩu không đúng",
  "auth.error.server": "Không thể kết nối đến máy chủ",
  "auth.error.google": "Đăng nhập Google thất bại",
  "auth.error.google_conn": "Không thể kết nối đến Google",
  "auth.register.title": "Tạo tài khoản",
  "auth.register.name": "Họ và tên",
  "auth.register.email": "Email",
  "auth.register.password": "Mật khẩu",
  "auth.register.submit": "Đăng ký",
  "auth.register.has_account": "Đã có tài khoản?",
  "auth.register.login": "Đăng nhập",
  "auth.register.success": "Đăng ký thành công!",
  "auth.register.error": "Đăng ký thất bại",
  "auth.register.name_placeholder": "Tên của bạn",
  "auth.register.email_placeholder": "email@example.com",
  "auth.register.password_placeholder": "Ít nhất 6 ký tự",

  // ── Chat Demo Section ──
  "chat.title": "Xem AI trả lời khách hàng như thế nào",
  "chat.sub": "Bot hiểu sản phẩm, chính sách, tồn kho — trả lời tự nhiên như nhân viên thật.",
  "chat.feat1": "Hiểu sản phẩm & tồn kho",
  "chat.feat1_desc": "AI biết chính xác giá, màu sắc, size có sẵn — không trả lời chung chung.",
  "chat.feat2": "Tư vấn & chốt đơn",
  "chat.feat2_desc": "Tự động gửi link sản phẩm, mã giảm giá, hỗ trợ đặt hàng — không cần nhân viên.",
  "chat.feat3": "Giữ đúng chất riêng",
  "chat.feat3_desc": "AI nói chuyện theo phong cách, giọng văn, cách xưng hô của shop bạn.",
  "chat.feat4": "Phản hồi trong 1-3 giây",
  "chat.feat4_desc": "Khách không phải chờ đợi. Không bỏ lỡ cơ hội bán hàng.",

  // ── Comparison Section ──
  "vs.omnismart": "AI thông minh — hiểu catalog thật của bạn",
  "vs.feat1": "Hiểu danh mục sản phẩm",
  "vs.feat1_desc": "Tự động học giá, size, màu, tồn kho từ catalog thật",
  "vs.feat2": "Truy xuất chính xác",
  "vs.feat2_desc": "Tìm đúng sản phẩm, đúng phiên bản, đúng variant khách hỏi",
  "vs.feat3": "Giữ ngữ cảnh hội thoại",
  "vs.feat3_desc": "Nhớ toàn bộ cuộc trò chuyện, không bị lạc đề",
  "vs.feat4": "Cá nhân hóa theo shop",
  "vs.feat4_desc": "Nói chuyện đúng chất riêng, giọng văn, phong cách của bạn",
  "vs.feat5": "Tự động học, không cần training",
  "vs.feat5_desc": "Nhập dữ liệu một lần — AI tự vận hành, không cần lập trình",
  "feat.badge": "Tính năng",
  "vs.oldbot": "Bot thông thường",
  "vs.old1": "Kịch bản cố định",
  "vs.old1_desc": "Trả lời theo mẫu soạn sẵn, không linh hoạt",
  "vs.old2": "Không hiểu sản phẩm",
  "vs.old2_desc": "Không biết giá, tồn kho, mô tả thực tế",
  "vs.old3": "Mất ngữ cảnh",
  "vs.old3_desc": "Sau 2-3 tin nhắn là trả lời lạc đề",
  "vs.old4": "Tốn công đào tạo",
  "vs.old4_desc": "Phải lập trình từng kịch bản thủ công",
};

const en: Dict = {
  // ── Nav ──
  "nav.login": "Login",
  "nav.getstarted": "Try Free",

  // ── Hero ──
  "badge.mvp": "Try Free — No credit card needed",
  "hero.title": "Never let a customer wait with no one to reply",
  "hero.sub": "Unify Facebook, Zalo, TikTok Shop, Shopee, Instagram into one inbox. AI replies 24/7 — like your best salesperson, but never sleeps.",
  "hero.cta": "Try Free",
  "hero.login": "Login",

  // ── Pain Points ──
  "pain.title": "Sound familiar?",
  "pain.1.title": "Messages pile up at night & holidays",
  "pain.1.desc": "Small shop: you can't reply fast enough. Big brand: your 10-person CS team still can't catch up with message volume.",
  "pain.2.title": "Endless hiring & training CS staff",
  "pain.2.desc": "Old staff quit — you lose momentum. New staff join — 2 weeks training. 3-5 staff cost $600-1500/month.",
  "pain.3.title": "Facebook, Zalo, TikTok, Shopee — separate chats everywhere",
  "pain.3.desc": "5 apps, 5 accounts, 5 different reply styles. Fragmented management, missed messages.",
  "pain.4.title": "Afraid AI will sound robotic & kill your brand voice",
  "pain.4.desc": "Generic chatbot replies lose customer trust. Your shop has its own personality and tone — AI must preserve it.",

  // ── Stats ──
  "stat.reply": "Auto Reply",
  "stat.response": "Response Speed",
  "stat.channels": "Channels",
  "stat.staff": "Staff You Can Save",

  // ── Features ──
  "features.title": "What OmniAI does for your business",
  "features.sub": "Whether you're a solo seller or a growing enterprise with a large CS team — OmniAI automates customer care while keeping your brand voice.",
  "feat.inbox.title": "Unified Inbox — 5 channels in 1",
  "feat.inbox.desc": "All messages from Facebook, Zalo, TikTok Shop, Shopee, Instagram in one place. No more switching 5 apps daily.",
  "feat.ai.title": "AI knows your products, policies & inventory",
  "feat.ai.desc": "Upload catalog & policies once — AI learns automatically. Talks like a 3-month veteran, no training needed.",
  "feat.channels.title": "Connect every sales channel",
  "feat.channels.desc": "Facebook Messenger, Zalo OA, TikTok Shop, Shopee, Instagram — built-in, one-click connect. No coding.",
  "feat.insight.title": "Know what customers think & how your bot performs",
  "feat.insight.desc": "Leads, revenue, bot performance, customer insights — real-time dashboard. Find weak points and improve.",

  // ── Platform Section ──
  "platform.title": "Connect wherever your customers are",
  "platform.sub": "Wherever your customers message — OmniAI catches every conversation.",
  "platform.facebook": "Facebook Messenger",
  "platform.zalo": "Zalo OA",
  "platform.tiktok": "TikTok Shop",
  "platform.shopee": "Shopee",
  "platform.instagram": "Instagram",

  // ── Use Case Section ──
  "usecase.title": "An AI CS staff — works 24/7, no shifts, no 13th-month salary",
  "usecase.sub": "Runs 24/7, matches your brand voice, costs less than 1 staff salary — no overtime, no holidays, no raise demands.",
  "usecase.1.title": "Replies anytime — even 3 AM",
  "usecase.1.desc": "Customer messages at midnight, holidays, Tet? AI replies within 3 seconds. Zero missed opportunities.",
  "usecase.2.title": "Knows products from day one, no retraining",
  "usecase.2.desc": "Upload your catalog once — AI learns prices, stock, descriptions instantly. No more repetitive training.",
  "usecase.3.title": "Advises in YOUR shop's unique voice",
  "usecase.3.desc": "Not generic call-center replies. AI perfectly matches your shop's tone, style, and personality.",
  "usecase.4.title": "Save $600-1500/month on CS staff",
  "usecase.4.desc": "One AI staff works 24/7 — no shifts, no overtime pay, no sick leave, no holiday bonuses, no salary negotiation.",

  // ── Social Proof ──
  "trusted.title": "Trusted by SME shop owners",

  // ── Chat Demo Section ──
  "chat.title": "See how AI replies to customers",
  "chat.sub": "Bot understands products, policies, inventory — replies naturally like a real salesperson.",
  "chat.feat1": "Understands products & inventory",
  "chat.feat1_desc": "AI knows exact prices, colors, sizes — no generic answers.",
  "chat.feat2": "Consult & close sales",
  "chat.feat2_desc": "Auto-send product links, discount codes, support ordering — no staff needed.",
  "chat.feat3": "Keeps your shop's voice",
  "chat.feat3_desc": "AI talks in your brand's style, tone, and personality.",
  "chat.feat4": "Replies in 1-3 seconds",
  "chat.feat4_desc": "Customers never wait. Never miss a sales opportunity.",

  // ── Comparison Section ──
  "vs.omnismart": "AI — understands your real catalog",
  "vs.feat1": "Understands product catalog",
  "vs.feat1_desc": "Auto-learns prices, sizes, colors, stock from real catalog",
  "vs.feat2": "Accurate retrieval",
  "vs.feat2_desc": "Finds the right product, right variant customers ask for",
  "vs.feat3": "Conversation context",
  "vs.feat3_desc": "Remembers entire conversation, never loses track",
  "vs.feat4": "Shop-personalized",
  "vs.feat4_desc": "Talks in your brand's unique voice, tone and style",
  "vs.feat5": "Self-learning, no training needed",
  "vs.feat5_desc": "Import data once — AI runs on its own, no programming required",
  "feat.badge": "Features",
  "vs.oldbot": "Regular bot",
  "vs.old1": "Fixed scripts",
  "vs.old1_desc": "Replies from pre-made templates, no flexibility",
  "vs.old2": "No product understanding",
  "vs.old2_desc": "Doesn't know prices, stock, real descriptions",
  "vs.old3": "Loses context",
  "vs.old3_desc": "Goes off-topic after 2-3 messages",
  "vs.old4": "Costly training",
  "vs.old4_desc": "Must manually program each scenario",

  // ── Pain Point Stats ──
  "stat.pain1": "Customers leave after 5 min wait",
  "stat.pain2": "Million VND/month CS costs",
  "stat.pain3": "Different apps every day",
  "stat.pain4": "Customers re-ask because bot doesn't understand",

  "testimonial.text": "I used to build chatbots for shop owners. I saw them struggling — late-night messages with no one to reply, paying 15-30 million VND/month for CS staff, bots that sounded robotic and killed their brand voice. I asked myself: why not build an AI that actually understands products, policies, and talks like the shop? So I built OmniAI. After testing with a few shops, the results were better than I expected — they cut CS costs, never missed an order, customers even complimented the helpful advice. That's when I decided to turn it into a full platform, not just for a few friends, but for every SME shop owner in Vietnam.",
  "testimonial.name": "Bao — Founder & Developer",
  "testimonial.role": "From building bots for shops to building OmniAI for thousands",

  // ── CTA ──
  "cta.title": "50+ SMEs are already using OmniAI",
  "cta.sub": "Free. No credit card. 5 minutes to start.",
  "cta.btn": "Try Free",

  // ── Footer ──
  "footer.desc": "OmniAI is an AI Omnichannel platform that helps SME shop owners and growing businesses automate customer care — unify 5 channels in one place, reduce CS staff costs by 50-70%, never miss an order, keep your brand's unique voice.",
  "footer.product": "Product",
  "footer.features": "Features",
  "footer.pricing": "Pricing",
  "footer.docs": "Docs",
  "footer.company": "Company",
  "footer.about": "About",
  "footer.blog": "Blog",
  "footer.contact": "Contact",
  "footer.legal": "Legal",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "footer.copyright": "All rights reserved by OmniAI.",
  "footer.rights": "All rights reserved.",

  // ── Pricing Page ──
  "pricing.badge": "Beta — Completely free during MVP phase",
  "pricing.title": "Simple, transparent pricing",
  "pricing.sub": "All plans free during Beta. No credit card needed.",
  "pricing.free_name": "Free",
  "pricing.free_period": "forever",
  "pricing.free_badge": "Beta",
  "pricing.free_desc": "For SME shop owners to try AI customer service",
  "pricing.free_feat1": "Shop management",
  "pricing.free_feat2": "Facebook, TikTok Shop, Shopee, Web Widget",
  "pricing.free_feat3": "AI multi-agent with custom persona",
  "pricing.free_feat4": "Unified inbox + manual takeover",
  "pricing.free_feat5": "Product import CSV/text",
  "pricing.free_feat6": "AI insights & customer profiling",
  "pricing.free_feat7": "Community support",
  "pricing.free_cta": "Currently Active",
  "pricing.starter_name": "Starter",
  "pricing.starter_price": "$8",
  "pricing.starter_badge": "Popular",
  "pricing.starter_desc": "For growing shops needing stable AI",
  "pricing.starter_feat1": "3 shops",
  "pricing.starter_feat2": "All channels + priority",
  "pricing.starter_feat3": "3,000 convos/month",
  "pricing.starter_feat4": "Custom persona + scripts",
  "pricing.starter_feat5": "Smart auto-learn catalog",
  "pricing.starter_feat6": "90-day analytics",
  "pricing.starter_feat7": "24h email support",
  "pricing.starter_feat8": "Extra shop: +$4/month",
  "pricing.starter_cta": "Contact Us",
  "pricing.pro_name": "Pro",
  "pricing.pro_price": "$0",
  "pricing.pro_period": "during Beta",
  "pricing.pro_badge": "Beta Free",
  "pricing.pro_desc": "Everything unlocked — completely free during Beta",
  "pricing.pro_feat1": "Unlimited shops",
  "pricing.pro_feat2": "All channels + Web Widget",
  "pricing.pro_feat3": "AI multi-agent + custom persona",
  "pricing.pro_feat4": "Telegram notification + webhooks",
  "pricing.pro_feat5": "Free AI provider choice (OpenAI, Gemini...)",
  "pricing.pro_feat6": "Product import + sync",
  "pricing.pro_feat7": "Full AI insights",
  "pricing.pro_feat8": "Priority Beta support",
  "pricing.pro_cta": "Get Started Free",
  "pricing.contact_title": "Need more?",
  "pricing.contact_desc": "If you need more shops or custom features for your business — get in touch.",
  "pricing.contact_btn": "Contact via email",

  // ── Auth Pages ──
  "auth.login.title": "Login",
  "auth.login.google": "Continue with Google",
  "auth.login.loading": "Signing in...",
  "auth.login.email": "Email",
  "auth.login.password": "Password",
  "auth.login.submit": "Login",
  "auth.login.no_account": "Don't have an account?",
  "auth.login.register": "Register",
  "auth.login.divider": "OR",
  "auth.error.invalid": "Invalid email or password",
  "auth.error.server": "Unable to connect to server",
  "auth.error.google": "Google login failed",
  "auth.error.google_conn": "Unable to connect to Google",
  "auth.register.title": "Create Account",
  "auth.register.name": "Full Name",
  "auth.register.email": "Email",
  "auth.register.password": "Password",
  "auth.register.submit": "Register",
  "auth.register.has_account": "Already have an account?",
  "auth.register.login": "Login",
  "auth.register.success": "Registration successful!",
  "auth.register.error": "Registration failed",
  "auth.register.name_placeholder": "Your name",
  "auth.register.email_placeholder": "email@example.com",
  "auth.register.password_placeholder": "At least 6 characters",
};

const translations: Record<Lang, Dict> = { vi, en };

interface LangCtx {
  lang: Lang;
  t: (key: string) => string;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx>({
  lang: "vi",
  t: (k: string) => vi[k] || k,
  setLang: () => {},
});

export function LangProvider({ children, initialLang }: { children: React.ReactNode; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang || "vi");
  const t = (key: string): string => translations[lang]?.[key] || translations["vi"]?.[key] || key;

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return React.createElement(LangContext.Provider, { value: { lang, t, setLang } }, children);
}

export function useLang() {
  return useContext(LangContext);
}
