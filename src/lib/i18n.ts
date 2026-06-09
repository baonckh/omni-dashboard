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

  // ── Pipeline Section ──
  "pipeline.title_before": "AI hiểu",
  "pipeline.title_after": "— không chỉ là trả lời máy móc",
  "pipeline.vs_before": "Bot thông thường",
  "pipeline.vs_after": "OmniAI",

  "testimonial.text": "\"Từ ngày dùng OmniAI, tôi không còn thức đêm trả lời tin nhắn nữa. Bot trả lời như nhân viên thật, khách còn khen tư vấn nhiệt tình.\"",
  "testimonial.name": "Minh Trang",
  "testimonial.role": "Chủ shop Thời trang ABC",

  // ── CTA ──
  "cta.title": "Hơn 50 shop đã dùng OmniAI để tự động hóa CSKH",
  "cta.sub": "Miễn phí, không cần thẻ tín dụng. 5 phút để bắt đầu.",
  "cta.btn": "Dùng thử miễn phí",

  // ── Footer ──
  "footer.desc": "OmniAI nền tảng AI Omnichannel giúp chủ shop SME và doanh nghiệp vừa tự động hóa chăm sóc khách hàng — tập trung 5 kênh về một nơi, giảm 50-70% chi phí nhân sự CSKH, không bỏ lỡ đơn hàng, vẫn giữ phong cách riêng của shop.",
  "footer.product": "Sản phẩm",
  "footer.features": "Tính năng",
  "footer.pricing": "Bảng giá",
  "footer.docs": "Hướng dẫn",
  "footer.company": "Công ty",
  "footer.about": "Về OmniAI",
  "footer.blog": "Blog",
  "footer.contact": "Liên hệ",
  "footer.legal": "Pháp lý",
  "footer.privacy": "Chính sách bảo mật",
  "footer.terms": "Điều khoản sử dụng",
  "footer.copyright": "Bản quyền thuộc về OmniAI.",
  "footer.rights": "Tất cả quyền được bảo lưu.",

  // ── Auth Pages ──
  "auth.login.title": "Đăng nhập",
  "auth.login.google": "Đăng nhập với Google",
  "auth.login.loading": "Đang đăng nhập...",
  "auth.login.email": "Email",
  "auth.login.password": "Mật khẩu",
  "auth.login.submit": "Đăng nhập",
  "auth.login.no_account": "Chưa có tài khoản?",
  "auth.login.register": "Đăng ký",
  "auth.login.divider": "HOẶC",
  "auth.error.invalid": "Sai email hoặc mật khẩu",
  "auth.error.server": "Không thể kết nối đến server",
  "auth.error.google": "Đăng nhập Google thất bại",
  "auth.error.google_conn": "Không thể kết nối đến Google",
  "auth.register.title": "Tạo tài khoản",
  "auth.register.name": "Tên",
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
};

const en: Dict = {
  // ── Nav ──
  "nav.login": "Login",
  "nav.getstarted": "Try Free",

  // ── Hero ──
  "badge.mvp": "Try Free — No credit card needed",
  "hero.title": "Never miss a customer message again",
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

  "testimonial.text": "\"Since using OmniAI, I no longer stay up late replying to messages. The bot replies like a real staff — customers even compliment the helpful advice.\"",
  "testimonial.name": "Minh Trang",
  "testimonial.role": "Owner of ABC Fashion Shop",

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
