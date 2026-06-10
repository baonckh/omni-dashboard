"use client";

import { useId } from "react";

interface DotPatternProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function DotPattern({ width = 24, height = 24, className = "" }: DotPatternProps) {
  const id = useId();

  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.08" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
