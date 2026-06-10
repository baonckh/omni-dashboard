"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type COBEOptions } from "cobe";

import { cn } from "@/lib/utils";

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
    { location: [14.5995, 120.9842], size: 0.04 },
    { location: [35.6762, 139.6503], size: 0.05 },
    { location: [1.3521, 103.8198], size: 0.04 },
  ],
};

type GlobeProps = {
  className?: string;
  config?: COBEOptions;
};

export function Globe({ className, config = GLOBE_CONFIG }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onResize = () => {
      widthRef.current = canvas.offsetWidth;
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      ...config,
      width: widthRef.current * 2 || config.width,
      height: widthRef.current * 2 || config.height,
      onRender: (state) => {
        phiRef.current += 0.005;
        state.phi = phiRef.current;
        state.width = widthRef.current * 2 || config.width;
        state.height = widthRef.current * 2 || config.height;
      },
    });

    setTimeout(() => {
      canvas.style.opacity = "1";
    }, 0);

    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 mx-auto aspect-square h-full w-full cursor-grab opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        className,
      )}
    />
  );
}
