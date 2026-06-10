"use client";

import { useRef, useState, useEffect } from "react";

// ── Animated Beam ──
interface BeamProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  duration?: number;
  color?: string;
}

function AnimatedBeam({ containerRef, fromRef, toRef, curvature = 20, duration = 3, color = "rgba(59,130,246,0.25)" }: BeamProps) {
  const [pathD, setPathD] = useState("");

  useEffect(() => {
    const update = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;
      const cr = containerRef.current.getBoundingClientRect();
      const fr = fromRef.current.getBoundingClientRect();
      const tr = toRef.current.getBoundingClientRect();
      const sx = fr.left - cr.left + fr.width / 2;
      const sy = fr.top - cr.top + fr.height / 2;
      const ex = tr.left - cr.left + tr.width / 2;
      const ey = tr.top - cr.top + tr.height / 2;
      const cy = (sy + ey) / 2 - curvature;
      setPathD(`M ${sx},${sy} Q ${(sx + ex) / 2},${cy} ${ex},${ey}`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef, fromRef, toRef, curvature]);

  if (!pathD) return null;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <path d={pathD} stroke={color} strokeWidth="1" fill="none" strokeLinecap="round" className="opacity-20" />
      <path d={pathD} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="8 4">
        <animate attributeName="stroke-dashoffset" from="24" to="0" dur={`${duration}s`} repeatCount="indefinite" />
      </path>
    </svg>
  );
}

// ── Individual orbit item with its own beam ──
function OrbitItem({ item, angle, radius, containerRef, centerRef, index }: {
  item: { icon: React.ReactNode; label: string };
  angle: number;
  radius: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  centerRef: React.RefObject<HTMLDivElement | null>;
  index: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200 + index * 50);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <>
      {ready && itemRef.current && centerRef.current && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={itemRef}
          curvature={15}
          duration={3}
          color="rgba(59,130,246,0.15)"
        />
      )}
      <div
        ref={itemRef}
        className="absolute flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-blue-600/10 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-600/10 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer z-20"
        style={{
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          transform: "translate(-50%, -50%)",
          animation: `orbit-fadein 0.5s ease-out ${index * 0.1}s both`,
        }}
      >
        <span className="text-sm">{item.icon}</span>
        <span className="text-xs font-medium text-zinc-300">{item.label}</span>
      </div>
    </>
  );
}

// ── Main Component ──
interface OrbitCirclesProps {
  items: { icon: React.ReactNode; label: string }[];
  className?: string;
}

export default function OrbitCircles({ items, className = "" }: OrbitCirclesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const radius = 140;
  const angles = [270, 342, 54, 126, 198]; // evenly spaced

  return (
    <div ref={containerRef} className={`relative flex items-center justify-center w-full max-w-sm mx-auto ${className}`} style={{ height: 350 }}>
      <div ref={centerRef} className="absolute w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 z-20">
        <span className="text-white font-bold text-xs text-center leading-tight">Omni<br />AI</span>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <circle cx="50%" cy="50%" r={radius} fill="none" className="stroke-white/5 stroke-[0.5]" strokeDasharray="4 4" />
      </svg>

      {items.map((item, i) => (
        <OrbitItem key={item.label} item={item} angle={angles[i]} radius={radius} containerRef={containerRef} centerRef={centerRef} index={i} />
      ))}

      <style>{`@keyframes orbit-fadein { from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }`}</style>
    </div>
  );
}
