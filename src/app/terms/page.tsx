"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, FileText, Mail } from "lucide-react";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const sections = [
  {
    key: "acceptance",
    vi: {
      title: "1. Chấp nhận điều khoản",
      content:
        "Bằng cách truy cập hoặc sử dụng nền tảng OmniAI, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi. Việc bạn tiếp tục sử dụng nền tảng sau khi có thay đổi về điều khoản đồng nghĩa với việc chấp nhận các thay đổi đó.",
    },
    en: {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using the OmniAI platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any term, please do not use our services. Your continued use of the platform following any changes to the terms constitutes acceptance of those changes.",
    },
  },
  {
    key: "service",
    vi: {
      title: "2. Mô tả dịch vụ",
      content:
        "OmniAI là nền tảng omnichannel AI giúp các chủ shop và doanh nghiệp tự động hóa việc chăm sóc khách hàng qua nhiều kênh (Facebook, Zalo, TikTok Shop, Shopee, Instagram). Dịch vụ bao gồm: (a) Hộp thư tập trung đa kênh; (b) AI trả lời tự động; (c) Phân tích dữ liệu và insight; (d) Quản lý sản phẩm; (e) Tích hợp API. Chúng tôi có quyền thay đổi, nâng cấp hoặc ngừng bất kỳ tính năng nào với thông báo trước.",
    },
    en: {
      title: "2. Service Description",
      content:
        "OmniAI is an AI omnichannel platform that helps shop owners and businesses automate customer care across multiple channels (Facebook, Zalo, TikTok Shop, Shopee, Instagram). Services include: (a) Multi-channel unified inbox; (b) AI auto-reply; (c) Analytics and insights; (d) Product management; (e) API integration. We reserve the right to modify, upgrade, or discontinue any feature with prior notice.",
    },
  },
  {
    key: "obligations",
    vi: {
      title: "3. Nghĩa vụ người dùng",
      content:
        "Bạn cam kết: (a) Cung cấp thông tin chính xác khi đăng ký tài khoản; (b) Bảo mật thông tin đăng nhập và chịu trách nhiệm về mọi hoạt động trên tài khoản; (c) Không sử dụng nền tảng cho mục đích bất hợp pháp; (d) Không can thiệp vào hệ thống, mã nguồn hoặc dữ liệu của OmniAI; (e) Không sử dụng AI để gửi tin nhắn spam, lừa đảo hoặc vi phạm pháp luật; (f) Tuân thủ tất cả quy định pháp luật hiện hành.",
    },
    en: {
      title: "3. User Obligations",
      content:
        "You agree to: (a) Provide accurate information when registering; (b) Maintain the confidentiality of your login credentials and be responsible for all account activity; (c) Not use the platform for illegal purposes; (d) Not interfere with OmniAI's system, code, or data; (e) Not use AI to send spam, fraudulent, or unlawful messages; (f) Comply with all applicable laws and regulations.",
    },
  },
  {
    key: "ai-usage",
    vi: {
      title: "4. Sử dụng AI",
      content:
        "Dịch vụ AI của OmniAI được cung cấp như một công cụ hỗ trợ. Bạn hiểu và đồng ý rằng: (a) AI có thể không hoàn hảo và có thể tạo ra phản hồi không chính xác; (b) Bạn chịu trách nhiệm kiểm duyệt nội dung AI trước khi gửi đến khách hàng; (c) Bạn không được sử dụng AI để tạo nội dung vi phạm bản quyền, phỉ báng, kỳ thị hoặc gây hại; (d) Chúng tôi có quyền gỡ bỏ nội dung vi phạm mà không cần báo trước; (e) Dữ liệu hội thoại có thể được sử dụng để cải thiện chất lượng AI.",
    },
    en: {
      title: "4. AI Usage",
      content:
        "OmniAI's AI services are provided as an assistive tool. You understand and agree that: (a) AI may not be perfect and may generate inaccurate responses; (b) You are responsible for moderating AI content before sending to customers; (c) You must not use AI to generate content that infringes copyright, is defamatory, discriminatory, or harmful; (d) We reserve the right to remove violating content without notice; (e) Conversation data may be used to improve AI quality.",
    },
  },
  {
    key: "payment",
    vi: {
      title: "5. Thanh toán & Hóa đơn",
      content:
        "Các gói dịch vụ trả phí sẽ được thanh toán theo chu kỳ (hàng tháng hoặc hàng năm). Tất cả khoản thanh toán đều không được hoàn lại trừ khi có quy định khác. Chúng tôi có quyền thay đổi giá dịch vụ với thông báo trước 30 ngày. Việc không thanh toán đúng hạn có thể dẫn đến tạm ngừng hoặc chấm dứt dịch vụ. Giá đã bao gồm thuế VAT theo quy định pháp luật Việt Nam.",
    },
    en: {
      title: "5. Payment & Billing",
      content:
        "Paid service plans are billed on a recurring basis (monthly or annually). All payments are non-refundable unless otherwise stated. We reserve the right to change service prices with 30 days' notice. Failure to pay on time may result in service suspension or termination. Prices include applicable taxes as required by law.",
    },
  },
  {
    key: "liability",
    vi: {
      title: "6. Giới hạn trách nhiệm",
      content:
        "OmniAI không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc do hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ. Tổng trách nhiệm của OmniAI trong mọi trường hợp không vượt quá số tiền bạn đã thanh toán cho dịch vụ trong 12 tháng trước sự kiện phát sinh khiếu nại. Chúng tôi không chịu trách nhiệm về nội dung do AI tạo ra hoặc do bên thứ ba.",
    },
    en: {
      title: "6. Limitation of Liability",
      content:
        "OmniAI shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use or inability to use the service. Our total liability in all cases shall not exceed the amount you have paid for the service in the 12 months preceding the claim. We are not responsible for content generated by AI or third parties.",
    },
  },
  {
    key: "termination",
    vi: {
      title: "7. Chấm dứt",
      content:
        "Bạn có thể chấm dứt tài khoản bất cứ lúc nào. Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản nếu bạn vi phạm điều khoản, có hành vi gian lận, hoặc không tuân thủ pháp luật. Khi tài khoản bị chấm dứt, quyền truy cập của bạn sẽ bị thu hồi và dữ liệu sẽ được xử lý theo chính sách bảo mật của chúng tôi.",
    },
    en: {
      title: "7. Termination",
      content:
        "You may terminate your account at any time. We reserve the right to suspend or terminate your account if you violate these terms, engage in fraudulent activity, or fail to comply with applicable laws. Upon termination, your access rights will be revoked and data will be handled according to our privacy policy.",
    },
  },
  {
    key: "governing-law",
    vi: {
      title: "8. Luật điều chỉnh",
      content:
        "Các Điều khoản này được điều chỉnh và giải thích theo pháp luật của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh từ các điều khoản này sẽ được giải quyết tại Tòa án có thẩm quyền tại Việt Nam. Trong trường hợp có xung đột giữa bản tiếng Việt và bản tiếng Anh, bản tiếng Việt sẽ được ưu tiên áp dụng.",
    },
    en: {
      title: "8. Governing Law",
      content:
        "These Terms shall be governed and construed in accordance with the laws of the Socialist Republic of Vietnam. Any disputes arising from these terms shall be resolved by the competent courts in Vietnam. In case of conflict between the Vietnamese and English versions, the Vietnamese version shall prevail.",
    },
  },
];

export default function TermsPage() {
  const { t, lang } = useLang();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-6xl mx-auto rounded-2xl border border-white/5 bg-black/70 backdrop-blur-2xl shadow-2xl">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
            <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-500">
            <Link href="/pricing" className="hover:text-white transition-colors">{t("footer.pricing")}</Link>
            <Link href="/docs" className="hover:text-white transition-colors">{t("footer.docs")}</Link>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            <Link href="/login" className="text-xs text-zinc-400 hover:text-white transition-colors">{t("hero.login")}</Link>
          </div>
        </div>
      </nav>

      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] rounded-full bg-gradient-to-b from-blue-600/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-5 py-24">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {lang === "vi" ? "Điều khoản dịch vụ" : "Terms of Service"}
              </h1>
              <p className="text-xs text-zinc-500">
                {lang === "vi" ? "Cập nhật lần cuối: Tháng 6, 2026" : "Last updated: June, 2026"}
              </p>
            </div>
          </div>

          <div className="prose prose-invert prose-headings:text-white prose-headings:font-extrabold prose-a:text-blue-400 prose-strong:text-white max-w-none space-y-8">
            {sections.map((section, i) => (
              <motion.section
                key={section.key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="p-6 rounded-xl border border-white/[0.06] bg-white/[0.015]"
              >
                <h2 className="text-lg font-extrabold text-white mb-4">
                  {lang === "vi" ? section.vi.title : section.en.title}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {lang === "vi" ? section.vi.content : section.en.content}
                </p>
              </motion.section>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] pt-14 pb-8 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600"><Zap className="h-3.5 w-3.5 text-white" /></div>
                <span className="font-bold text-base tracking-tight text-white">Omni<span className="text-zinc-500">AI</span></span>
              </Link>
              <p className="text-sm leading-relaxed mb-4 text-zinc-500">{t("footer.desc")}</p>
              <LangToggle />
            </div>
            {[
              { title: "footer.product", links: [["footer.features", "/#features"], ["footer.docs", "/docs"]] },
              { title: "footer.company", links: [["footer.about", "/about"], ["footer.contact", "mailto:hello@omni-ai.com"]] },
              { title: "footer.legal", links: [["footer.privacy", "/privacy"], ["footer.terms", "/terms"]] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">{t(col.title)}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(([key, href]) => (
                    <li key={key}><Link href={href} className="text-sm text-zinc-600 hover:text-white transition-colors">{t(key)}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-600">© 2026 OmniAI. {t("footer.rights")}</p>
            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <Link href="/privacy" className="hover:text-white transition-colors">{t("footer.privacy")}</Link>
              <Link href="/terms" className="hover:text-white transition-colors">{t("footer.terms")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
