"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";

const GLOBE_CONFIG: COBEOptions = {
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
  baseColor: [1, 1, 1],
  markerColor: [251 / 255, 100 / 255, 21 / 255],
  glowColor: [1, 1, 1],
  markers: [
    { location: [10.8, 106.7], size: 0.08 },
    { location: [21.0, 105.8], size: 0.06 },
  ],
};

export default function Globe({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => { widthRef.current = canvas.offsetWidth; };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      ...GLOBE_CONFIG,
      width: widthRef.current * 2 || 400,
      height: widthRef.current * 2 || 400,
      onRender: (state) => {
        phiRef.current += 0.003;
        state.phi = phiRef.current;
        state.width = widthRef.current * 2 || 400;
        state.height = widthRef.current * 2 || 400;
      },
    });

    setTimeout(() => { canvas.style.opacity = "1"; }, 0);
    return () => globe.destroy();
  }, []);

  return (
    <div className={`relative mx-auto w-full max-w-[200px] aspect-square ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-0 transition-opacity duration-500"
        style={{ contain: "layout paint size" }}
      />
    </div>
  );
}
