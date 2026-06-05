"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Tag, ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface VariantData {
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  image: string;
}

export interface ProductCardData {
  title: string;
  content: string;
  price: number;
  original_price?: number;
  variants?: VariantData[];
  image?: string;
  url?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  compact?: boolean;
}

export function ProductCard({ product, compact }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<VariantData | null>(null);
  
  const hasVariants = product.variants && product.variants.length > 0;
  const displayVariant = selectedVariant;
  
  // Effective price: variant price if selected, otherwise product price
  const displayPrice = displayVariant ? displayVariant.price : product.price;
  const displayOriginalPrice = product.original_price || 0;
  const hasDiscount = displayOriginalPrice > displayPrice;

  // If has variants but none selected, show "từ X₫"
  const showFromPrice = hasVariants && !selectedVariant;
  const minVariantPrice = hasVariants 
    ? Math.min(...(product.variants || []).map(v => v.price))
    : displayPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get unique attribute keys from variants for display
  const variantAttrKeys = hasVariants && product.variants 
    ? Object.keys(product.variants[0].attributes || {})
    : [];

  if (compact) {
    return (
      <div className="group relative flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/60 border border-white/5 hover:border-white/15 transition-all cursor-pointer hover:bg-neutral-800/40">
        {product.image && (
          <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0 bg-neutral-800">
            <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{product.title}</p>
          <p className="text-[10px] text-emerald-400 font-semibold">
            {showFromPrice ? `từ ${formatPrice(minVariantPrice)}` : formatPrice(displayPrice)}
          </p>
        </div>
        <ChevronRight className="h-3 w-3 text-neutral-600 group-hover:text-white transition-colors" />
      </div>
    );
  }

  const discountPercent = hasDiscount 
    ? Math.round((1 - displayPrice / displayOriginalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col rounded-2xl bg-neutral-900/80 border border-white/8 hover:border-white/20 transition-all overflow-hidden hover:shadow-lg hover:shadow-blue-500/5">
      {/* Image */}
      <div className="relative h-32 w-full bg-neutral-800 overflow-hidden">
        {displayVariant?.image || product.image ? (
          <img 
            src={displayVariant?.image || product.image || ""} 
            alt={product.title} 
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-neutral-700" />
          </div>
        )}
        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full shadow-lg">
            -{discountPercent}%
          </div>
        )}
        
        {/* Variant image thumbnails */}
        {hasVariants && product.variants && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {product.variants.filter(v => v.image).slice(0, 4).map((v, i) => (
              <button
                key={i}
                onClick={() => setSelectedVariant(v)}
                className={cn(
                  "w-6 h-6 rounded-full border-2 overflow-hidden transition-all",
                  selectedVariant?.sku === v.sku ? "border-white scale-110" : "border-white/30 opacity-70 hover:opacity-100"
                )}
              >
                <img src={v.image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold text-white line-clamp-2 leading-tight">{product.title}</p>
        </div>

        {product.content && (
          <p className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed">{product.content}</p>
        )}

        {/* Variant selector */}
        {hasVariants && product.variants && variantAttrKeys.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {variantAttrKeys.map((attrKey) => {
              const uniqueValues = [...new Set(product.variants!.map(v => v.attributes[attrKey] || ""))];
              return (
                <div key={attrKey} className="flex flex-wrap gap-1">
                  {uniqueValues.filter(Boolean).map((val) => {
                    const isSelected = selectedVariant?.attributes[attrKey] === val;
                    // Find the variant matching ALL selected attributes
                    const matchingVariant = selectedVariant 
                      ? product.variants!.find(v => 
                          Object.entries({...selectedVariant.attributes, [attrKey]: val})
                            .every(([k, v]) => v === v)
                        )
                      : product.variants!.find(v => v.attributes[attrKey] === val);
                    
                    return (
                      <button
                        key={val}
                        onClick={() => {
                          // Find variant matching selected attr combo
                          const newAttrs = {...(selectedVariant?.attributes || {})};
                          newAttrs[attrKey] = val;
                          const match = product.variants!.find(v => 
                            Object.entries(newAttrs).every(([k, v2]) => v.attributes[k] === v2) &&
                            Object.keys(v.attributes).length === Object.keys(newAttrs).length
                          );
                          if (match) setSelectedVariant(match);
                        }}
                        className={cn(
                          "px-2 py-0.5 text-[9px] font-medium rounded-md border transition-all",
                          isSelected 
                            ? "bg-blue-600 border-blue-500 text-white" 
                            : "bg-neutral-800 border-white/10 text-neutral-400 hover:border-white/30"
                        )}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            {showFromPrice ? (
              <>
                <span className="text-xs text-neutral-500">từ</span>
                <span className="text-sm font-bold text-emerald-400">{formatPrice(minVariantPrice)}</span>
              </>
            ) : (
              <>
                <span className="text-sm font-bold text-emerald-400">{formatPrice(displayPrice)}</span>
                {hasDiscount && (
                  <span className="text-[10px] text-neutral-500 line-through">{formatPrice(displayOriginalPrice)}</span>
                )}
              </>
            )}
          </div>
          <button className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-colors flex items-center gap-1">
            Mua <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Compact inline version for message display
export function ProductCardInline({ product }: { product: ProductCardData }) {
  const hasVariants = product.variants && product.variants.length > 0;
  const minPrice = hasVariants 
    ? Math.min(...(product.variants || []).map(v => v.price))
    : product.price;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-900/60 border border-white/5 hover:border-white/15 transition-all">
      {product.image ? (
        <img src={product.image} alt={product.title} className="h-12 w-12 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="h-12 w-12 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
          <Tag className="h-5 w-5 text-neutral-700" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white truncate">{product.title}</p>
        {product.content && (
          <p className="text-[10px] text-neutral-500 truncate mt-0.5">{product.content}</p>
        )}
        <p className="text-xs font-bold text-emerald-400 mt-1">
          {hasVariants 
            ? `từ ${formatPriceInline(minPrice)}` 
            : formatPriceInline(product.price)}
        </p>
      </div>
    </div>
  );
}

function formatPriceInline(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}