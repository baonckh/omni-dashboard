"use client";

import React, { createContext, useContext, useState } from "react";

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
  "pain.1.title": "Khách nhắn đêm không ai trả lời",
  "pain.1.desc": "9h tối khách hỏi hàng — 8h sáng hôm sau mới thấy tin nhắn. Khách đã mua ở chỗ khác từ lâu.",
  "pain.2.title": "Tuyển nhân viên CSKH liên tục",
  "pain.2.desc": "Lương 2-3 nhân viên tốn 10-15 triệu/tháng. Nghỉ là mất mạch, đào tạo lại từ đầu.",
  "pain.3.title": "Mỗi nơi một chat, theo không kịp",
  "pain.3.desc": "Facebook, Zalo, TikTok, Shopee — mỗi nơi 1 app, 1 tài khoản, loạn hết cả lên.",
  "pain.4.title": "Sợ AI trả lời như người máy, mất khách",
  "pain.4.desc": "Không muốn bot trả lời chung chung như tổng đài. Shop có cá tính riêng, cách tư vấn riêng.",

  // ── Stats ──
  "stat.reply": "Trả lời tự động",
  "stat.response": "Tốc độ phản hồi",
  "stat.channels": "Kênh kết nối",
  "stat.staff": "Nhân viên có thể cắt giảm",

  // ── Features ──
  "features.title": "OmniAI làm được gì cho shop của bạn?",
  "features.sub": "Không phải bot chat thông thường — AI hiểu sản phẩm, hiểu chính sách, và nói chuyện đúng chất shop bạn.",
  "feat.inbox.title": "Hộp thư tập trung",
  "feat.inbox.desc": "Tất cả tin nhắn từ Facebook, Zalo OA, TikTok Shop, Shopee về một inbox. Không cần mở 5 app mỗi ngày.",
  "feat.ai.title": "AI hiểu sản phẩm và chính sách của shop",
  "feat.ai.desc": "Tải catalog lên — AI tự động học giá, tồn kho, mô tả. Trả lời khách hàng như một nhân viên thuần thục 3 tháng.",
  "feat.channels.title": "Kết nối tất cả kênh bán hàng",
  "feat.channels.desc": "Facebook Messenger, Zalo OA, TikTok Shop, Shopee, Instagram — tích hợp sẵn, không cần code.",
  "feat.insight.title": "Biết khách hàng đang nghĩ gì",
  "feat.insight.desc": "Theo dõi lead, phân tích hành vi khách, xem bot đang làm tốt không — cải thiện dần dần.",

  // ── Platform Section ──
  "platform.title": "Tích hợp tất cả nền tảng khách hàng của bạn",
  "platform.sub": "Dù khách hàng của bạn ở đâu — OmniAI đều bắt được.",
  "platform.facebook": "Facebook Messenger",
  "platform.zalo": "Zalo OA",
  "platform.tiktok": "TikTok Shop",
  "platform.shopee": "Shopee",
  "platform.instagram": "Instagram",

  // ── Use Case Section ──
  "usecase.title": "Một nhân viên CSKH không biết mệt, không biết nghỉ",
  "usecase.1.title": "Trả lời bất cứ lúc nào, kể cả 3 giờ sáng",
  "usecase.1.desc": "Khách nhắn lúc nửa đêm, ngày lễ, Tết — bot trả lời ngay. Không bỏ lỡ bất kỳ tin nhắn nào.",
  "usecase.2.title": "Thuộc sản phẩm ngay lần đầu, không cần đào tạo lại",
  "usecase.2.desc": "Tải catalog lên một lần — AI tự động học giá, tồn kho, mô tả. Không cần training nhiều lần như nhân viên thật.",
  "usecase.3.title": "Tư vấn đúng chất riêng của shop bạn",
  "usecase.3.desc": "Không trả lời chung chung như tổng đài. AI giữ đúng giọng văn, phong cách, cách xưng hô của shop.",
  "usecase.4.title": "Không đòi tăng lương, không nghỉ việc, không ngủ",
  "usecase.4.desc": "Một nhân viên AI làm việc 24/7 không ca kíp, không lương tháng 13, không ốm đau, không nghỉ Tết.",

  // ── CTA ──
  "cta.title": "Hơn 50 shop đã dùng OmniAI để tự động hóa CSKH",
  "cta.sub": " không cần thẻ tín dụng. 5 phút để bắt đầu. ",
  "cta.btn": "Dùng thử miễn phí",

  // ── Footer ──
  "footer.desc": "OmniAI giúp các chủ shop SME tập trung quản lý tất cả kênh bán hàng vào một nơi, tự động hóa chăm sóc khách hàng bằng AI — giảm nhân lực, không bỏ lỡ đơn hàng, vẫn giữ được phong cách riêng của shop.",
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
};

const en: Dict = {
  "nav.login": "Login",
  "nav.getstarted": "Try Free",
  "badge.mvp": "Beta MVP — No credit card needed",
  "hero.title": "Never miss a customer message again",
  "hero.sub": "Unify Facebook, Zalo, TikTok Shop, Shopee, Instagram into one inbox. AI replies 24/7 — just like your best salesperson, but never sleeps.",
  "hero.cta": "Try Free",
  "hero.login": "Login",
  "pain.title": "Sound familiar?",
  "pain.1.title": "Customers message at night — nobody replies",
  "pain.1.desc": "9 PM inquiry seen at 8 AM next day. Customer already bought elsewhere.",
  "pain.2.title": "Endlessly hiring CS staff",
  "pain.2.desc": "Paying 2-3 staff $500-1200/month. They quit? Start training from zero.",
  "pain.3.title": "Managing chats across 5 platforms",
  "pain.3.desc": "Facebook, Zalo, TikTok, Shopee — each with its own app. Total chaos.",
  "pain.4.title": "Afraid AI will sound robotic",
  "pain.4.desc": "Don't want a generic chatbot. Your shop has its own personality and voice.",
  "stat.reply": "Auto Reply",
  "stat.response": "Response Speed",
  "stat.channels": "Channels",
  "stat.staff": "Staff You Can Save",
  "features.title": "What OmniAI does for your shop",
  "features.sub": "Not just a chatbot — AI that understands your products, policies, and talks like your brand.",
  "feat.inbox.title": "Unified Inbox",
  "feat.inbox.desc": "All messages from Facebook, Zalo, TikTok Shop, Shopee in one place. No more switching 5 apps.",
  "feat.ai.title": "AI knows your products & policies",
  "feat.ai.desc": "Upload your catalog — AI learns prices, stock, descriptions. Talks like a 3-month veteran.",
  "feat.channels.title": "Connect every sales channel",
  "feat.channels.desc": "Facebook Messenger, Zalo OA, TikTok Shop, Shopee, Instagram — built-in, no coding.",
  "feat.insight.title": "Know what customers think",
  "feat.insight.desc": "Track leads, analyze behavior, see bot performance — improve over time.",
  "platform.title": "Connect wherever your customers are",
  "platform.sub": "Facebook, Zalo, TikTok Shop, Shopee, Instagram — OmniAI catches them all.",
  "platform.facebook": "Facebook Messenger",
  "platform.zalo": "Zalo OA",
  "platform.tiktok": "TikTok Shop",
  "platform.shopee": "Shopee",
  "platform.instagram": "Instagram",
  "usecase.title": "A CS staff that never sleeps, never quits",
  "usecase.1.title": "Replies anytime — even 3 AM",
  "usecase.1.desc": "Customer messages at midnight, holiday, Tet? AI replies instantly. Zero missed messages.",
  "usecase.2.title": "Knows products from day one, no retraining",
  "usecase.2.desc": "Upload catalog once — AI learns prices, stock, descriptions. No more training new hires.",
  "usecase.3.title": "Advises in YOUR shop's unique voice",
  "usecase.3.desc": "Not generic call-center replies. AI matches your tone, style, and personality perfectly.",
  "usecase.4.title": "Never asks for a raise, never quits, never sleeps",
  "usecase.4.desc": "One AI staff works 24/7 — no shifts, no 13th-month salary, no sick leaves, no Tet holiday breaks.",
  "cta.title": "Join 50+ shops already using OmniAI",
  "cta.sub": "Free. No credit card. 5 minutes to start. ",
  "cta.btn": "Try Free",
  "footer.desc": "OmniAI helps SME shop owners unify all sales channels, automate customer care with AI — reduce staff costs, never miss an order, keep your shop's unique voice.",
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

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["vi"]?.[key] || key;
  };

  return React.createElement(
    LangContext.Provider,
    { value: { lang, t, setLang } },
    children
  );
}

export function useLang() {
  return useContext(LangContext);
}
