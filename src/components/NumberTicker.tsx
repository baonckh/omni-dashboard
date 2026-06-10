"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface NumberTickerProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export default function NumberTicker({ value, suffix = "", prefix = "", className = "", duration = 1.5 }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(value / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { clearInterval(timer); if (ref.current) ref.current.textContent = `${prefix}${value.toLocaleString()}${suffix}`; return; }
      if (ref.current) ref.current.textContent = `${prefix}${start.toLocaleString()}${suffix}`;
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value, suffix, prefix, duration]);

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
