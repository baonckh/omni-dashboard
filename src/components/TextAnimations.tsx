"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useCallback } from "react";

// ── 1. Animated Gradient Text ──
export function GradientText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-[length:200%_auto] ${className}`}
      style={{ animation: "gradient 3s ease infinite" }}
    >
      {children}
    </span>
  );
}

// ── 2. Text Reveal (word by word, slower and more visible) ──
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
          className="inline-block mr-[0.25em] will-change-transform"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ── 3. Aurora Text (glowing animated aura) ──
export function AuroraText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="absolute -inset-4 blur-3xl pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.35) 0%, transparent 60%)",
            "radial-gradient(ellipse at 70% 50%, rgba(168,85,247,0.35) 0%, transparent 60%)",
            "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.35) 0%, transparent 60%)",
          ],
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

// ── 4. Typewriter with cursor (for bot streaming) ──
export function TypewriterText({ text, speed = 25, className = "" }: { text: string; speed?: number; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setInterval(() => {
      i++;
      if (i > text.length) { clearInterval(t); setDone(true); return; }
      setDisplayed(text.slice(0, i));
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
          className="inline-block w-[2px] h-[1em] bg-blue-500 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

// ── 5. Streaming Text (multiple segments with delays) ──
export function StreamingText({ segments }: { segments: { text: string; delay: number }[] }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= segments.length) return;
    const t = setTimeout(() => setVisible(v => v + 1), segments[visible].delay);
    return () => clearTimeout(t);
  }, [visible, segments]);

  return (
    <span>
      {segments.slice(0, visible).map((seg, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          {seg.text}
        </motion.span>
      ))}
    </span>
  );
}

// ── 6. Word Rotate ──
export function WordRotate({ words = ["sản phẩm", "tồn kho", "chính sách", "khách hàng"], className = "" }: { words?: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % words.length), 2200);
    return () => clearInterval(t);
  }, [words]);
  return (
    <span className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ── 7. Shimmer Text ──
export function ShimmerText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-[-20deg]"
        animate={{ left: ["-100%", "200%"] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

// ── 8. Text Highlighter (animated underline highlight like marker pen) ──
export function TextHighlighter({ children, color = "rgba(37,99,235,0.25)", className = "" }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <motion.span
        className="absolute inset-x-0 bottom-0 h-[30%] rounded-sm"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

// ── 9. Underline Animation (draw underline left to right) ──
export function UnderlineText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        className="absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      />
    </span>
  );
}

// ── 10. Animated Emphasis (scale + color pop on scroll) ──
export function EmText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.span
      initial={{ scale: 0.9, color: "#71717A" }}
      whileInView={{ scale: 1, color: "#FFFFFF" }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className={`inline-block font-bold ${className}`}
    >
      {children}
    </motion.span>
  );
}
