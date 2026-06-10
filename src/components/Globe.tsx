"use client";

import { useEffect, useRef } from "react";

export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let globe: any = null;

    const init = async () => {
      try {
        const cobe = await import("cobe");
        const createGlobe = cobe.default;
        const canvas = canvasRef.current;
        if (!canvas) return;

        let phi = 0;
        const width = canvas.offsetWidth || 400;
        const height = width;

        globe = createGlobe(canvas, {
          width: width * 2,
          height: height * 2,
          devicePixelRatio: 2,
          phi: 0,
          theta: 0.3,
          dark: 0,
          diffuse: 0.6,
          mapSamples: 16000,
          mapBrightness: 1.2,
          baseColor: [1, 1, 1],
          markerColor: [251 / 255, 100 / 255, 21 / 255],
          glowColor: [1, 1, 1],
          markers: [
            { location: [10.8, 106.7], size: 0.08 },
            { location: [21.0, 105.8], size: 0.06 },
          ],
          onRender: (state: any) => {
            phi += 0.003;
            state.phi = phi;
          },
        });

        const resize = () => {
          if (!canvas) return;
          canvas.style.width = canvas.offsetWidth + "px";
          canvas.style.height = canvas.offsetHeight + "px";
        };
        resize();
        window.addEventListener("resize", resize);
        globe._resize = resize;
      } catch (e) {
        console.error("[Globe] error:", e);
      }
    };

    init();
    return () => {
      if (globe) {
        if (globe._resize) window.removeEventListener("resize", globe._resize);
        globe.destroy();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ aspectRatio: "1/1", maxWidth: 400, maxHeight: 400 }}
    />
  );
}
