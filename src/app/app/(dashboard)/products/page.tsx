"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Package, Plus, Search, Folder, ChevronRight, Sparkles, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useShopId } from "@/lib/use-shop";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Product, ProductFilters } from "@/types/product";

export default function ProductsPage() {
  const router = useRouter();
  const shopId = useShopId();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setOffset(0);
  }, [debouncedSearch, selectedCategory]);

  const filters = useMemo<ProductFilters>(
    () => ({
      search: debouncedSearch || undefined,
      category: selectedCategory || undefined,
      limit,
      offset,
    }),
    [debouncedSearch, selectedCategory, limit, offset]
  );

  const handleDelete = async (productCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Xoá sản phẩm này?")) return;
    try {
      await api.delete(`/admin/products/${shopId}/${productCode}`);
      fetchProducts();
    } catch { alert("Xoá thất bại"); }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/products/${shopId}`, { shop_id: shopId, ...filters });
      setProducts(res.products || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, [shopId, filters]);

  useEffect(() => {
    if (shopId) fetchProducts();
  }, [shopId, fetchProducts]);

  const toggleAiEnabled = async (product: Product) => {
    const newVal = product.aiEnabled !== false ? false : true;
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, aiEnabled: newVal } : p));
    try {
      await api.put(`/admin/products/${shopId}/${product.product_code}`, { aiEnabled: newVal }, { shop_id: shopId });
    } catch { setProducts(prev => prev.map(p => p.id === product.id ? { ...p, aiEnabled: !newVal } : p)); }
  };

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      const cat = p.category || "Chưa phân loại";
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  const pageCount = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  return (
    <div className="flex gap-6 pb-20">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-48 shrink-0">
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left",
              selectedCategory === null
                ? "bg-blue-500/10 text-blue-400"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.03]"
            )}
          >
            <Folder className="h-4 w-4 shrink-0" />
            <span className="truncate flex-1">Tất cả</span>
            <span className="text-xs text-neutral-600">{total}</span>
          </button>
          {categories.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-left",
                selectedCategory === cat
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.03]"
              )}
            >
              <Folder className="h-4 w-4 shrink-0" />
              <span className="truncate flex-1">{cat}</span>
              <span className="text-xs text-neutral-600">{count}</span>
            </button>
          ))}
        </div>
        <button className="mt-3 flex items-center gap-2 px-3 py-2 text-xs text-neutral-500 hover:text-white transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Thêm danh mục
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
              PRODUCTS
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">
              Quản lý sản phẩm — danh mục, biến thể, tồn kho
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/app/products/upload")}
              className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              Upload
            </button>
            <button
              onClick={() => router.push("/app/products/new")}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white/5 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <select
            value={selectedCategory || ""}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="bg-zinc-800 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 transition-colors"
          >
            <option value="" className="bg-zinc-900 text-white">All categories</option>
            {categories.map(([cat]) => (
              <option key={cat} value={cat} className="bg-zinc-900 text-white">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                <div className="flex justify-between items-end pt-2">
                  <div className="h-5 w-20 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.map((product, i) => (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                onClick={() => router.push(`/app/products/${product.product_code}`)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 text-left hover:bg-white/[0.04] hover:border-white/[0.12] transition-all group relative"
              >
                <button onClick={(e) => handleDelete(product.product_code, e)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/0 hover:bg-red-500/10 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{product.product_code}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-400 transition-colors shrink-0 mt-0.5" />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/[0.04] text-neutral-400 border border-white/[0.06]">
                    {product.category || "Uncategorized"}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); toggleAiEnabled(product); }}
                    className={cn(
                      "ml-auto flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold transition-all",
                      product.aiEnabled !== false
                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                        : "bg-zinc-800/50 text-zinc-600 border border-zinc-800"
                    )}>
                    <Sparkles className="h-2.5 w-2.5" />
                    AI {product.aiEnabled !== false ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <span className="text-lg font-bold text-white">
                      {product.price.toLocaleString()}đ
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="ml-2 text-xs text-neutral-600 line-through">
                        {product.original_price.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className={cn(
                      product.stock !== undefined && product.stock > 0
                        ? "text-green-400/70"
                        : "text-red-400/50"
                    )}>
                      {product.stock ?? 0} in stock
                    </span>
                    {product.variants && product.variants.length > 0 && (
                      <span>{product.variants.length} variants</span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-white/[0.06] rounded-2xl">
            <Package className="h-12 w-12 text-neutral-600 mb-4" />
            <p className="text-neutral-500 text-sm">No products yet. Import or add your first product.</p>
            <button
              onClick={() => router.push("/app/products/new")}
              className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-colors"
            >
              <Plus className="h-4 w-4 inline mr-1.5" />
              Add Product
            </button>
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-neutral-500">
              Showing {offset + 1}–{Math.min(offset + limit, total)} of {total} products
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - limit))}
                className="px-3 py-1.5 text-sm border border-white/[0.08] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.03] transition-colors"
              >
                ← Prev
              </button>
              <span className="text-xs text-neutral-600 px-2">{currentPage} / {pageCount}</span>
              <button
                disabled={offset + limit >= total}
                onClick={() => setOffset((o) => o + limit)}
                className="px-3 py-1.5 text-sm border border-white/[0.08] rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.03] transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
