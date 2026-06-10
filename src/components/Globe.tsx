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
        // @ts-ignore - cobe ESM
        const cobe = await import("cobe");
        const createGlobe = cobe.default || cobe;
        if (destroyed || !canvasRef.current) return;

        let phi = 0;
        globe = createGlobe(canvasRef.current, {
          width: 400,
          height: 400,
          devicePixelRatio: 1.5,
          phi: 0,
          theta: 0.25,
          dark: 0.1,
          diffuse: 0.5,
          mapSamples: 16000,
          mapBrightness: 2,
          baseColor: [0.3, 0.5, 0.9],
          markerColor: [0.4, 0.8, 1],
          glowColor: [0.2, 0.4, 0.8],
          markers: [
            { location: [10.8, 106.7], size: 0.08 },
            { location: [21.0, 105.8], size: 0.06 },
          ],
          onRender: (state: any) => { phi += 0.005; state.phi = phi; },
        });
        setLoaded(true);
      } catch (e) {
        console.warn("[Globe] failed:", e);
        // Show fallback after timeout
        setTimeout(() => setLoaded(true), 500);
      }
    };

    init();
    return () => { destroyed = true; if (globe?.destroy) globe.destroy(); };
  }, []);

  return (
    <div className={`relative mx-auto ${className}`} style={{ width: 200, height: 200 }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      {!loaded && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-blue-500/20 animate-pulse" />
      )}
    </div>
  );
}
