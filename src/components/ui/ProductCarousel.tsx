"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type ProductCardData } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  products: ProductCardData[];
  title?: string;
  className?: string;
}

export function ProductCarousel({ products, title, className }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <span className="text-[10px] text-neutral-500">{products.length} sản phẩm</span>
        </div>
      )}

      <div className="relative">
        {/* Navigation buttons */}
        {products.length > 3 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-neutral-900/90 border border-white/10 flex items-center justify-center hover:bg-neutral-800 hover:border-white/30 transition-all shadow-lg"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-neutral-900/90 border border-white/10 flex items-center justify-center hover:bg-neutral-800 hover:border-white/30 transition-all shadow-lg"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </>
        )}

        {/* Carousel container */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, index) => (
            <div key={index} className="w-52 shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// List view for multiple products (responsive)
export function ProductList({
  products,
  columns = 2,
}: {
  products: ProductCardData[];
  columns?: 1 | 2 | 3 | 4;
}) {
  if (products.length === 0) return null;

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={cn("grid gap-3", gridCols)}>
      {products.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
}

// Horizontal scroll container with peek
export function ProductScroll({
  products,
  className,
}: {
  products: ProductCardData[];
  className?: string;
}) {
  if (products.length === 0) return null;

  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto scrollbar-hide py-1 px-0.5",
        className
      )}
    >
      {products.map((product, index) => (
        <div key={index} className="w-44 shrink-0">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}