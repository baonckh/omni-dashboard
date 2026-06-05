"use client";

import React, { createContext, useContext, useState } from "react";

export type Lang = "vi" | "en";

type Dict = Record<string, string>;

const vi: Dict = {
  "nav.login": "Đăng nhập",
  "nav.getstarted": "Bắt đầu miễn phí",
  "badge.mvp": "MVP Beta — Hoàn toàn miễn phí",
  "hero.title1": "AI Omnichannel",
  "hero.title2": "không cần code",
  "hero.sub": "Kết nối Facebook, TikTok, Shopee, Zalo — AI tự động trả lời khách hàng 24/7 dựa trên catalog và chính sách shop của bạn.",
  "hero.cta": "Bắt đầu miễn phí",
  "hero.login": "Đăng nhập",
  "stat.247": "Tự động trả lời",
  "stat.response": "Thời gian phản hồi",
  "stat.platforms": "Nền tảng kết nối",
  "stat.setup": "Phí setup ban đầu",
  "features.title": "Mọi thứ bạn cần để",
  "features.title2": "vận hành omnichannel",
  "features.sub": "Từ import sản phẩm đến AI trả lời khách hàng — tất cả trong một nền tảng.",
  "feat.import.title": "Import Sản phẩm",
  "feat.import.desc": "Tải lên CSV hoặc nhập text — AI tự động học catalog của bạn trong 5 giây.",
  "feat.bot.title": "AI Bot tự động",
  "feat.bot.desc": "Hiểu sản phẩm, chính sách, tồn kho — trả lời khách hàng như một nhân viên thực thụ.",
  "feat.connect.title": "Kết nối đa sàn",
  "feat.connect.desc": "Facebook Messenger, TikTok Shop, Shopee, Zalo OA — một dashboard quản trị tất cả.",
  "feat.analytics.title": "Phân tích real-time",
  "feat.analytics.desc": "Theo dõi lead, doanh thu, hiệu suất bot và insight khách hàng tức thì.",
  "fb.badge": "Facebook Messenger",
  "fb.title": "Kết nối Facebook Messenger",
  "fb.title2": "trong 1 click",
  "fb.desc": "AI tự động trả lời tin nhắn Facebook, tư vấn sản phẩm, chốt đơn — hoạt động 24/7 không cần nhân viên túc trực.",
  "fb.cta": "Dùng thử ngay",
  "cta.title": "Sẵn sàng để AI",
  "cta.title2": "làm việc cho bạn?",
  "cta.sub": "Tạo tài khoản miễn phí — không cần thẻ tín dụng. 5 phút để bắt đầu.",
  "cta.btn": "Tạo tài khoản miễn phí",
  "footer.tag": "Bản quyền thuộc về OmniAI.",
  "footer.product": "Sản phẩm",
  "footer.features": "Tính năng",
  "footer.pricing": "Bảng giá",
  "footer.docs": "Tài liệu",
  "footer.company": "Công ty",
  "footer.about": "Về chúng tôi",
  "footer.blog": "Blog",
  "footer.contact": "Liên hệ",
  "footer.legal": "Pháp lý",
  "footer.privacy": "Chính sách bảo mật",
  "footer.terms": "Điều khoản dịch vụ",
  "onboard.title": "Thiết lập Shop",
  "login.title": "Đăng nhập",
  "register.title": "Tạo tài khoản",
};

const en: Dict = {
  "nav.login": "Login",
  "nav.getstarted": "Get Started Free",
  "badge.mvp": "MVP Beta — Completely Free",
  "hero.title1": "AI Omnichannel",
  "hero.title2": "zero coding",
  "hero.sub": "Connect Facebook, TikTok, Shopee, Zalo — AI auto-replies 24/7 based on your catalog and shop policies.",
  "hero.cta": "Get Started Free",
  "hero.login": "Login",
  "stat.247": "Auto Reply",
  "stat.response": "Response Time",
  "stat.platforms": "Connected Platforms",
  "stat.setup": "Setup Cost",
  "features.title": "Everything you need to",
  "features.title2": "run omnichannel",
  "features.sub": "From product import to AI customer replies — all in one platform.",
  "feat.import.title": "Import Products",
  "feat.import.desc": "Upload CSV or paste text — AI learns your catalog in 5 seconds.",
  "feat.bot.title": "AI Bot",
  "feat.bot.desc": "Understands products, policies, inventory — talks to customers like a real salesperson.",
  "feat.connect.title": "Multi-platform",
  "feat.connect.desc": "Facebook Messenger, TikTok Shop, Shopee, Zalo OA — manage all in one dashboard.",
  "feat.analytics.title": "Real-time Analytics",
  "feat.analytics.desc": "Track leads, revenue, bot performance and customer insights instantly.",
  "fb.badge": "Facebook Messenger",
  "fb.title": "Connect Facebook Messenger",
  "fb.title2": "in 1 click",
  "fb.desc": "AI auto-replies Facebook messages, recommends products, closes sales — 24/7 without human staff.",
  "fb.cta": "Try Now",
  "cta.title": "Ready to let AI",
  "cta.title2": "work for you?",
  "cta.sub": "Create a free account — no credit card needed. 5 minutes to start.",
  "cta.btn": "Create Free Account",
  "footer.tag": "All rights reserved by OmniAI.",
  "footer.product": "Product",
  "footer.features": "Features",
  "footer.pricing": "Pricing",
  "footer.docs": "Documentation",
  "footer.company": "Company",
  "footer.about": "About",
  "footer.blog": "Blog",
  "footer.contact": "Contact",
  "footer.legal": "Legal",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "onboard.title": "Setup Shop",
  "login.title": "Login",
  "register.title": "Create Account",
};

const translations: Record<Lang, Dict> = { vi, en };

const LangContext = createContext<{
  lang: Lang;
  t: (key: string) => string;
  setLang: (l: Lang) => void;
}>({
  lang: "vi",
  t: (k: string) => vi[k] || k,
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("vi");

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["vi"]?.[key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
