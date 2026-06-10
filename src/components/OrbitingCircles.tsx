"use client";

interface OrbitingCirclesProps {
  items: { icon: React.ReactNode; label: string }[];
  className?: string;
}

const RINGS = [100, 130, 165];
const DURATIONS = [18, 26, 34];

export default function OrbitingCircles({ items, className = "" }: OrbitingCirclesProps) {
  return (
    <div className={`relative flex items-center justify-center w-full max-w-sm mx-auto select-none ${className}`} style={{ height: 380 }}>
      {/* Keyframes */}
      <style dangerouslySetInnerHTML={{
        __html: `
        ${RINGS.map((r, ri) => `
        @keyframes ocr${ri} { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        `).join("")}
      `}} />

      {/* Center */}
      <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 z-10">
        <span className="text-white font-bold text-[11px] tracking-tight leading-tight text-center">Omni<br />AI</span>
      </div>

      {/* Rings */}
      {RINGS.map((r, ri) => (
        <svg key={ri} className="absolute inset-0 w-full h-full pointer-events-none">
          <circle cx="50%" cy="50%" r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" strokeDasharray={ri === 1 ? "3 3" : "none"} />
        </svg>
      ))}

      {/* Items */}
      {items.map((item, i) => {
        const ri = i % RINGS.length;
        const radius = RINGS[ri];
        const countOnRing = Math.ceil(items.length / RINGS.length);
        const pos = Math.floor(i / RINGS.length);
        const angle = (360 / countOnRing) * pos + ri * 25;
        const dur = DURATIONS[ri];

        return (
          <div
            key={item.label}
            className="absolute group"
            style={{
              left: "50%", top: "50%", width: 0, height: 0,
              animation: `ocr${ri} ${dur}s linear infinite`,
              animationDelay: `-${pos * 3}s`,
            }}
          >
            <div
              className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-600/10 transition-all duration-200 cursor-pointer z-20"
              style={{
                left: radius,
                top: 0,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
