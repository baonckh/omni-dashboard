declare module "cobe" {
  interface COBEOptions {
    width: number;
    height: number;
    onRender: (state: { phi: number; width: number; height: number }) => void;
    devicePixelRatio?: number;
    phi?: number;
    theta?: number;
    dark?: number;
    diffuse?: number;
    mapSamples?: number;
    mapBrightness?: number;
    baseColor?: [number, number, number];
    markerColor?: [number, number, number];
    glowColor?: [number, number, number];
    markers?: { location: [number, number]; size: number }[];
  }
  export default function createGlobe(canvas: HTMLCanvasElement, opts: COBEOptions): { destroy: () => void };
}
