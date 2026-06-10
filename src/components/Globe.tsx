"use client";

import { useEffect, useRef } from "react";

// Dark theme globe config — matching landing page black background
const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0.7,
  diffuse: 0.5,
  mapSamples: 20000,
  mapBrightness: 1.8,
  baseColor: [0.12, 0.18, 0.35] as [number, number, number],
  markerColor: [1, 0.35, 0.1] as [number, number, number],
  glowColor: [0.08, 0.12, 0.25] as [number, number, number],
  markers: [
    { location: [10.8, 106.7], size: 0.08 },
    { location: [21.0, 105.8], size: 0.06 },
    { location: [13.7, 100.5], size: 0.05 },
    { location: [1.35, 103.8], size: 0.05 },
    { location: [48.85, 2.35], size: 0.04 },
    { location: [40.7, -74.0], size: 0.04 },
    { location: [35.6, 139.7], size: 0.04 },
    { location: [51.5, -0.12], size: 0.04 },
  ],
} as any;

export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    let globe: { destroy: () => void } | null = null;

    const init = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const cobe = await import("cobe");
        const createGlobe = cobe.default || cobe;

        const onResize = () => { widthRef.current = canvas.offsetWidth; };
        onResize();

        globe = createGlobe(canvas, {
          ...GLOBE_CONFIG,
          width: (widthRef.current || 200) * 2,
          height: (widthRef.current || 200) * 2,
          onRender: (state: any) => {
            phiRef.current += 0.003;
            state.phi = phiRef.current;
            state.width = (widthRef.current || 200) * 2;
            state.height = (widthRef.current || 200) * 2;
          },
        });

        canvas.style.opacity = "1";
      } catch (e) {
        console.warn("[Globe] Failed to load:", e);
        canvas.style.opacity = "1";
      }
    };

    init();
    return () => { if (globe?.destroy) globe.destroy(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full opacity-0 transition-opacity duration-500 ${className}`}
      style={{ aspectRatio: "1/1" }}
    />
  );
}
