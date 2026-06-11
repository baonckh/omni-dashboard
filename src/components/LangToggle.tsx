"use client";

import { useLang } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "vi" ? "en" : "vi")}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-500 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all font-medium"
    >
      <Globe className="h-3.5 w-3.5" />
      {lang === "vi" ? "VI" : "EN"}
    </button>
  );
}
