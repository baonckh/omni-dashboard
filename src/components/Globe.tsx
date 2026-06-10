"use client";

import { useEffect, useRef } from "react";

// Dynamic import to avoid Turbopack resolution issues on Vercel
const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1] as [number, number, number],
  markerColor: [251 / 255, 100 / 255, 21 / 255] as [number, number, number],
  glowColor: [1, 1, 1] as [number, number, number],
  markers: [
    { location: [10.8, 106.7] as [number, number], size: 0.08 },
    { location: [21.0, 105.8] as [number, number], size: 0.06 },
  ],
};

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
        // Show placeholder on failure
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
