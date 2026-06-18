"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Shield, Mail } from "lucide-react";
import { useLang } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";

const sections = [
  {
    key: "introduction",
    vi: {
      title: "1. Giới thiệu",
      content:
        "OmniAI (\"chúng tôi\", \"của chúng tôi\") cam kết bảo vệ quyền riêng tư của người dùng. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của bạn khi sử dụng nền tảng OmniAI, bao gồm website, ứng dụng và các dịch vụ liên quan.",
      content2:
        "Chính sách này tuân thủ Quy định Bảo vệ Dữ liệu Chung (GDPR) của Châu Âu, Nghị định 13/2023/NĐ-CP của Việt Nam về bảo vệ dữ liệu cá nhân, và Đạo luật Bảo vệ Người tiêu dùng California (CCPA).",
    },
    en: {
      title: "1. Introduction",
      content:
        "OmniAI (\"we\", \"us\", \"our\") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use the OmniAI platform, including our website, applications, and related services.",
      content2:
        "This policy complies with the European General Data Protection Regulation (GDPR), Vietnam's Decree 13/2023/NĐ-CP on personal data protection, and the California Consumer Privacy Act (CCPA).",
    },
  },
  {
    key: "data-collect",
    vi: {
      title: "2. Dữ liệu chúng tôi thu thập",
      content:
        "Chúng tôi thu thập các loại dữ liệu sau: (a) Thông tin tài khoản: họ tên, email, số điện thoại, thông tin đăng nhập; (b) Dữ liệu sử dụng: lịch sử hội thoại, tin nhắn, tương tác với bot AI; (c) Dữ liệu cửa hàng: danh mục sản phẩm, giá cả, tồn kho, chính sách; (d) Dữ liệu kỹ thuật: địa chỉ IP, loại trình duyệt, thông tin thiết bị, cookie; (e) Dữ liệu thanh toán: thông tin hóa đơn (xử lý qua bên thứ ba, chúng tôi không lưu trữ thông tin thẻ tín dụng).",
    },
    en: {
      title: "2. Data We Collect",
      content:
        "We collect the following types of data: (a) Account information: name, email, phone number, login credentials; (b) Usage data: conversation history, messages, AI bot interactions; (c) Store data: product catalogs, prices, inventory, policies; (d) Technical data: IP address, browser type, device information, cookies; (e) Payment data: billing information (processed by third parties, we do not store credit card details).",
    },
  },
  {
    key: "data-use",
    vi: {
      title: "3. Cách chúng tôi sử dụng dữ liệu",
      content:
        "Dữ liệu của bạn được sử dụng để: (a) Vận hành và duy trì nền tảng; (b) Cung cấp dịch vụ AI trả lời tự động; (c) Cải thiện chất lượng dịch vụ và trải nghiệm người dùng; (d) Gửi thông báo về cập nhật, tính năng mới; (e) Xử lý thanh toán và hóa đơn; (f) Tuân thủ nghĩa vụ pháp lý; (g) Phát hiện và ngăn chặn hành vi gian lận hoặc lạm dụng.",
    },
    en: {
      title: "3. How We Use Data",
      content:
        "Your data is used to: (a) Operate and maintain the platform; (b) Provide AI auto-reply services; (c) Improve service quality and user experience; (d) Send notifications about updates and new features; (e) Process payments and billing; (f) Comply with legal obligations; (g) Detect and prevent fraudulent or abusive behavior.",
    },
  },
  {
    key: "data-sharing",
    vi: {
      title: "4. Chia sẻ dữ liệu",
      content:
        "Chúng tôi không bán dữ liệu cá nhân của bạn. Chúng tôi có thể chia sẻ dữ liệu với: (a) Nhà cung cấp dịch vụ (lưu trữ, thanh toán, phân tích); (b) Đối tác nền tảng (Facebook, Zalo, TikTok, Shopee, Instagram) để tích hợp tin nhắn; (c) Cơ quan pháp luật khi có yêu cầu hợp pháp. Tất cả bên thứ ba đều bị ràng buộc bởi hợp đồng bảo mật và không được sử dụng dữ liệu ngoài mục đích đã thỏa thuận.",
    },
    en: {
      title: "4. Data Sharing",
      content:
        "We do not sell your personal data. We may share data with: (a) Service providers (hosting, payment, analytics); (b) Platform partners (Facebook, Zalo, TikTok, Shopee, Instagram) for message integration; (c) Law enforcement when legally required. All third parties are bound by confidentiality agreements and may not use data beyond the agreed purpose.",
    },
  },
  {
    key: "data-security",
    vi: {
      title: "5. Bảo mật dữ liệu",
      content:
        "Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu của bạn, bao gồm mã hóa SSL/TLS cho truyền dữ liệu, mã hóa dữ liệu lưu trữ, kiểm soát truy cập nghiêm ngặt, xác thực đa yếu tố, và kiểm toán bảo mật định kỳ. Tuy nhiên, không có phương thức truyền tải qua internet nào là an toàn tuyệt đối.",
    },
    en: {
      title: "5. Data Security",
      content:
        "We implement appropriate technical and organizational security measures to protect your data, including SSL/TLS encryption for data transmission, encrypted storage, strict access controls, multi-factor authentication, and regular security audits. However, no method of transmission over the internet is 100% secure.",
    },
  },
  {
    key: "rights",
    vi: {
      title: "6. Quyền của bạn",
      content:
        "Bạn có quyền: (a) Truy cập dữ liệu cá nhân của mình; (b) Yêu cầu chỉnh sửa dữ liệu không chính xác; (c) Yêu cầu xóa dữ liệu (quyền được lãng quên); (d) Giới hạn hoặc phản đối việc xử lý dữ liệu; (e) Yêu cầu xuất dữ liệu (quyền di chuyển dữ liệu); (f) Rút lại sự đồng ý bất cứ lúc nào. Để thực hiện các quyền này, vui lòng liên hệ chúng tôi qua email.",
      content2:
        "Theo Nghị định 13/2023/NĐ-CP, bạn có quyền được thông báo về việc xử lý dữ liệu, quyền truy cập, quyền sửa đổi, quyền xóa, quyền giới hạn xử lý, quyền phản đối xử lý, quyền di chuyển dữ liệu, và quyền khiếu nại.",
    },
    en: {
      title: "6. Your Rights",
      content:
        "You have the right to: (a) Access your personal data; (b) Request correction of inaccurate data; (c) Request deletion (right to be forgotten); (d) Restrict or object to processing; (e) Request data portability; (f) Withdraw consent at any time. To exercise these rights, please contact us via email.",
      content2:
        "Under GDPR, you also have the right to lodge a complaint with a supervisory authority. Under CCPA, California residents have the right to know what personal information is collected, request deletion, and opt out of the sale of personal information.",
    },
  },
  {
    key: "contact",
    vi: {
      title: "7. Liên hệ",
      content:
        "Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:",
      email: "hello@omni-ai.com",
      address: "Việt Nam",
    },
    en: {
      title: "7. Contact",
      content:
        "If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:",
      email: "hello@omni-ai.com",
      address: "Vietnam",
    },
  },
];

export default function PrivacyPage() {
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
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">
                {lang === "vi" ? "Chính sách bảo mật" : "Privacy Policy"}
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
                <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                  {lang === "vi" ? section.vi.content : section.en.content}
                </p>
                {(section as any).vi.content2 && (
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {lang === "vi" ? (section as any).vi.content2 : (section as any).en.content2}
                  </p>
                )}
                {section.key === "contact" && (
                  <div className="mt-4">
                    <a
                      href={`mailto:${lang === "vi" ? section.vi.email : section.en.email}`}
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {lang === "vi" ? section.vi.email : section.en.email}
                    </a>
                    <p className="text-xs text-zinc-600 mt-2">
                      {lang === "vi" ? section.vi.address : section.en.address}
                    </p>
                  </div>
                )}
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
