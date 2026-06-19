"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function UpgradePrompt({
  message,
  feature,
}: {
  message?: string;
  feature?: string;
}) {
  const { t } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-600/[0.08] to-blue-600/[0.05] p-5 text-center"
    >
      <Sparkles className="h-6 w-6 text-purple-400 mx-auto mb-2" />
      <p className="text-sm font-bold text-white mb-1">
        {message || (feature ? `Nâng cấp để mở khóa ${feature}` : t("pricing.pro_cta"))}
      </p>
      <p className="text-xs text-zinc-500 mb-3">
        Tính năng này yêu cầu gói Pro. Miễn phí trong thời gian Beta — đăng ký ngay!
      </p>
      <Link
        href="/app/billing"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-600/20"
      >
        {t("pricing.pro_cta")} <ArrowRight className="h-3 w-3" />
      </Link>
    </motion.div>
  );
}
