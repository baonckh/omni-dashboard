"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  ArrowRight, 
  Facebook, 
  MessageCircle, 
  ShoppingBag, 
  Sparkles, 
  Bot, 
  ChevronRight,
  ShieldCheck,
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { 
    id: "welcome", 
    title: "Welcome to OmniAI", 
    description: "Nền tảng quản trị khách hàng đa sàn tự động bằng AI thế hệ mới.",
    icon: Sparkles,
    color: "text-purple-500"
  },
  { 
    id: "channels", 
    title: "Connect Platforms", 
    description: "Kết nối tài khoản Facebook, TikTok hoặc Shopee chỉ với 1 click.",
    icon: ShoppingBag,
    color: "text-blue-500"
  },
  { 
    id: "persona", 
    title: "Setup AI Soul", 
    description: "Thiết lập tính cách và kiến thức cho trợ lý ảo của riêng sếp.",
    icon: Bot,
    color: "text-pink-500"
  },
  { 
    id: "ready", 
    title: "Ready for Launch", 
    description: "Hệ thống đã sẵn sàng. AI sẽ bắt đầu trực chiến 24/7 ngay bậy giờ.",
    icon: Rocket,
    color: "text-orange-500"
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/20 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none" />
      
      {/* Progress Header */}
      <div className="absolute top-12 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1 rounded-full transition-all duration-500",
              i <= currentStep ? "w-8 bg-blue-500" : "w-4 bg-white/10"
            )} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-xl text-center z-10"
        >
          {/* Icon Orb */}
          <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 mb-8 relative group">
            <step.icon className={cn("h-10 w-10", step.color)} />
            <div className={cn("absolute inset-0 opacity-40 blur-xl group-hover:opacity-60 transition-opacity", step.color.replace('text', 'bg'))} />
          </div>

          <h4 className="text-blue-500 font-bold uppercase tracking-widest text-xs mb-3">Phase {currentStep + 1}</h4>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-tight">
            {step.title}
          </h1>
          <p className="text-lg text-neutral-400 mb-12 max-w-md mx-auto leading-relaxed">
            {step.description}
          </p>

          {/* Interactive Step Content */}
          <div className="mb-12">
            {currentStep === 0 && (
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <ShieldCheck className="h-5 w-5 text-green-500 mb-2" />
                   <h4 className="text-sm font-bold">Bảo mật tuyệt đối</h4>
                   <p className="text-xs text-neutral-500">Dữ liệu mã hóa 2 lớp.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <Zap className="h-5 w-5 text-yellow-500 mb-2" />
                   <h4 className="text-sm font-bold">Tốc độ tức thì</h4>
                   <p className="text-xs text-neutral-500">Response AI dưới 1s.</p>
                </div>
              </div>
            )}

            {currentStep === 1 && (
               <div className="flex justify-center gap-6">
                 <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-bounce [animation-duration:3s]">
                    <Facebook className="h-8 w-8 text-blue-500" />
                 </div>
                 <div className="h-16 w-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center animate-bounce [animation-delay:0.2s] [animation-duration:3s]">
                    <MessageCircle className="h-8 w-8 text-pink-500" />
                 </div>
                 <div className="h-16 w-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center animate-bounce [animation-delay:0.4s] [animation-duration:3s]">
                    <ShoppingBag className="h-8 w-8 text-orange-500" />
                 </div>
               </div>
            )}

            {currentStep === 2 && (
               <div className="flex flex-col gap-3">
                 {["🚀 Chuyên nghiệp & Lịch sự", "🔥 Hài hước & Gần gũi", "🏠 Chân thành & Ấm áp"].map((t) => (
                    <div key={t} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-sm font-medium">
                       {t}
                    </div>
                 ))}
               </div>
            )}

            {currentStep === 3 && (
               <div className="relative group cursor-pointer inline-block">
                 <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                 <Link href="/overview" className="relative z-10 px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center gap-3 shadow-2xl shadow-blue-600/40 transition-all active:scale-95 text-lg">
                    Truy cập Dashboard Ngay
                    <Rocket className="h-6 w-6" />
                 </Link>
               </div>
            )}
          </div>

          {/* Controls */}
          {currentStep < 3 && (
            <div className="flex items-center justify-center gap-4">
               {currentStep > 0 && (
                 <button onClick={prevStep} className="px-8 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors">
                    Quay lại
                 </button>
               )}
               <button onClick={nextStep} className="px-10 py-4 bg-white text-black rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-200 transition-all active:scale-95 shadow-xl shadow-white/5">
                  Tiếp tục
                  <ChevronRight className="h-5 w-5" />
               </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Branding */}
      <footer className="absolute bottom-12 text-neutral-600 text-[10px] uppercase tracking-[0.3em] font-bold">
        Designed by Antigravity AI • 1-Click Omnichannel Connect
      </footer>
    </div>
  );
}
