"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1.5,
      width: 400,
      height: 400,
      phi: 0,
      theta: 0.25,
      dark: 0.9,
      diffuse: 0.6,
      mapSamples: 20000,
      mapBrightness: 4,
      baseColor: [0.2, 0.3, 0.6],
      markerColor: [0.1, 0.8, 1],
      glowColor: [0.1, 0.2, 0.5],
      markers: [
        { location: [10.8, 106.7], size: 0.08 } as any,
        { location: [21.0, 105.8], size: 0.06 } as any,
      ],
      onRender: (state: any) => {
        phi += 0.003;
        state.phi = phi;
      },
    } as any);

    return () => globe.destroy();
  }, []);

  return (
    <div className={`relative w-full max-w-[280px] mx-auto ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full opacity-80" style={{ aspectRatio: "1/1" }} />
    </div>
  );
}
