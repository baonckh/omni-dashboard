"use client";

import { motion } from "framer-motion";
import React from "react";

// ── 1. Animated Gradient Text ──
export function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_auto] animate-gradient ${className}`}
      style={{ animation: "gradient 4s ease infinite" }}>
      {children}
    </span>
  );
}

// ── 2. Text Reveal (word by word) ──
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ── 3. Word Rotate ──
const WORDS = ["sản phẩm", "tồn kho", "chính sách", "khách hàng"];
export function WordRotate({ className = "" }: { className?: string }) {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`relative inline-block min-w-[120px] ${className}`}>
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
      >
        {WORDS[index]}
      </motion.span>
      <span className="invisible">{WORDS[0]}</span>
    </span>
  );
}

// ── 4. Sparkles Text (subtle shimmer) ──
export function SparklesText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]"
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

// ── 5. Aurora Text (glowing gradient background) ──
export function AuroraText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline ${className}`}>
      <motion.span
        className="absolute inset-0 blur-2xl opacity-25 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 50%, rgba(168,85,247,0.4) 0%, transparent 60%)",
            "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.4) 0%, transparent 60%)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

// ── 6. Shiny Text (horizontal shimmer) ──
export function ShinyText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
        animate={{ left: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

// ── 7. Typewriter Effect ──
export function TypewriterText({ text, className = "" }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = React.useState("");
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (i < text.length) {
      const t = setTimeout(() => { setDisplayed(text.slice(0, i + 1)); setI(i + 1); }, 30);
      return () => clearTimeout(t);
    }
  }, [i, text]);
  return (
    <span className={className}>
      {displayed}
      <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="text-blue-500">|</motion.span>
    </span>
  );
}

// ── 8. Morphing Text ──
const PHRASES = ["AI hiểu sản phẩm của bạn", "AI hiểu tồn kho của bạn", "AI hiểu chính sách của bạn", "AI hiểu khách hàng của bạn"];
export function MorphingText({ className = "" }: { className?: string }) {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`relative inline-block min-w-[280px] ${className}`}>
      <motion.span
        key={index}
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      >
        {PHRASES[index]}
      </motion.span>
      <span className="invisible">{PHRASES[0]}</span>
    </span>
  );
}
