"use client";

import React from "react";

interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  radius?: number;
  path?: boolean;
  speed?: number;
}

export function OrbitingCirclesRing({
  className,
  children,
  reverse,
  duration = 20,
  radius = 160,
  path = true,
  speed = 1,
}: OrbitingCirclesProps) {
  const calced = duration / speed;
  return (
    <>
      {path && (
        <svg className="pointer-events-none absolute inset-0 size-full">
          <circle cx="50%" cy="50%" r={radius} fill="none" className="stroke-white/5 stroke-[0.5]" />
        </svg>
      )}
      {React.Children.map(children, (child, i) => {
        const angle = (360 / React.Children.count(children)) * i;
        return (
          <div
            style={
              {
                "--duration": calced,
                "--radius": radius,
                "--angle": angle + (reverse ? 180 : 0),
              } as React.CSSProperties
            }
            className="absolute left-1/2 top-1/2 transform-gpu"
          >
            <div
              className="group"
              style={{
                animation: `orbit-spin calc(var(--duration) * 1s) linear infinite`,
                animationDirection: reverse ? "reverse" : "normal",
                width: 0,
                height: 0,
              }}
            >
              <div
                className="absolute flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-blue-500/30 transition-all duration-200 cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%) rotate(var(--angle, 0)deg) translateY(calc(var(--radius) * -1px)) rotate(calc(var(--angle, 0) * -1deg))`,
                  animation: `orbit-spin calc(var(--duration) * 1s) linear infinite`,
                  animationDirection: reverse ? "reverse" : "normal",
                }}
              >
                {child}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

// Wrapper component with pre-configured rings
interface PlatformOrbitProps {
  items: { icon: React.ReactNode; label: string }[];
}

export default function PlatformOrbit({ items }: PlatformOrbitProps) {
  const rings = [
    { radius: 90, reverse: false, duration: 16, items: [items[0], items[3]] },
    { radius: 130, reverse: true, duration: 22, items: [items[1], items[4]] },
    { radius: 170, reverse: false, duration: 28, items: [items[2]] },
  ];

  return (
    <div className="relative flex items-center justify-center w-full max-w-sm mx-auto" style={{ height: 380 }}>
      {/* Center */}
      <div className="absolute w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 z-10">
        <span className="text-white font-bold text-[11px] tracking-tight text-center leading-tight">Omni<br />AI</span>
      </div>

      {rings.map((ring, ri) => (
        <OrbitingCirclesRing
          key={ri}
          radius={ring.radius}
          reverse={ring.reverse}
          duration={ring.duration}
          path={true}
        >
          {ring.items.map((item, ii) => (
            <span key={ii} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
            </span>
          ))}
        </OrbitingCirclesRing>
      ))}
    </div>
  );
}
