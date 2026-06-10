"use client";

import { useEffect, useRef, useState } from "react";

export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let destroyed = false;
    let globe: any = null;

    const init = async () => {
      try {
        // @ts-ignore
        const mod = await import("cobe");
        const createGlobe = mod.default;
        if (destroyed || !canvasRef.current) return;

        setLoaded(true);
        let phi = 0;

        globe = createGlobe(canvasRef.current, {
          devicePixelRatio: 1.5,
          width: 400,
          height: 400,
          phi: 0,
          theta: 0.3,
          dark: 0.2,
          diffuse: 0.6,
          mapSamples: 20000,
          mapBrightness: 3,
          baseColor: [0.3, 0.5, 0.9],
          markerColor: [0.5, 0.8, 1],
          glowColor: [0.2, 0.4, 0.8],
          markers: [
            { location: [10.8, 106.7], size: 0.08 } as any,
            { location: [21.0, 105.8], size: 0.06 } as any,
          ],
          onRender: (state: any) => {
            phi += 0.005;
            state.phi = phi;
          },
        } as any);
      } catch (e) {
        console.warn("[Globe] load failed:", e);
      }
    };

    init();
    return () => { destroyed = true; if (globe) globe.destroy(); };
  }, []);

  return (
    <div className={`relative w-full max-w-[200px] mx-auto ${className}`}>
      {!loaded && (
        <div className="w-full aspect-square rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 animate-pulse" />
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${loaded ? "opacity-90" : "opacity-0"} transition-opacity duration-700`}
        style={{ aspectRatio: "1/1" }}
      />
    </div>
  );
}
