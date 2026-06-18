"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Trash2, Plus, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useShopId } from "@/lib/use-shop";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const inputCls = "w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors";
const labelCls = "block text-xs text-neutral-500 font-medium mb-1.5";
const cardCls = "bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 space-y-4";

function attrsToKey(attrs: Record<string, string>): string {
  return Object.values(attrs).join("-").toLowerCase().replace(/\s+/g, "-");
}

function cartesianProduct(defs: { name: string; values: string[] }[]): Record<string, string>[] {
  if (!defs.length || defs.some((d) => !d.values.length)) return [];
  const valueArrays = defs.map((d) => d.values);
  function combine(arrays: string[][], idx = 0): string[][] {
    if (idx === arrays.length) return [[]];
    const rest = combine(arrays, idx + 1);
    return arrays[idx].flatMap((v) => rest.map((r) => [v, ...r]));
  }
  return combine(valueArrays).map((combo) => {
    const obj: Record<string, string> = {};
    defs.forEach((d, i) => {
      obj[d.name] = combo[i];
    });
    return obj;
  });
}

function generateAutoSku(productCode: string, attrs: Record<string, string>): string {
  const suffix = Object.values(attrs)
    .map((v) => (v ? v.charAt(0).toUpperCase() : ""))
    .join("-");
  return suffix ? `${productCode}-${suffix}` : productCode;
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = React.use(params);
  const router = useRouter();
  const shopId = useShopId();

  const [product, setProduct] = useState<Product>({
    id: "",
    product_code: "",
    name: "",
    price: 0,
    stock: 0,
    category: "",
    description: "",
    images: [],
    variant_defs: [],
    variants: [],
    aiEnabled: true,
    updated_at: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/products/${shopId}/${productId}`, { shop_id: shopId });
      setProduct({
        id: res.id || res._id || "",
        product_code: res.product_code || "",
        name: res.name || "",
        price: res.price || 0,
        original_price: res.original_price,
        stock: res.stock ?? 0,
        category: res.category || "",
        description: res.description || "",
        images: res.images || [],
        aiEnabled: res.aiEnabled !== false,
        variant_defs: res.variant_defs || [],
        variants: res.variants || [],
        updated_at: res.updated_at || "",
      });
    } catch (err) {
      console.error("Failed to fetch product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product.name.trim() || !product.product_code.trim()) {
      alert("Name and product code are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: product.name,
        product_code: product.product_code,
        price: product.price,
        original_price: product.original_price,
        stock: product.stock,
        category: product.category,
        description: product.description,
        images: product.images || [],
        aiEnabled: product.aiEnabled,
        variant_defs: product.variant_defs || [],
        variants: product.variants || [],
      };
      await api.put(`/admin/products/${shopId}/${product.product_code}`, payload, { shop_id: shopId });
      router.push("/app/products");
    } catch (err) {
      alert("Save failed: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/admin/products/${shopId}/${product.product_code}`, { shop_id: shopId });
      router.push("/app/products");
    } catch (err) {
      alert("Delete failed: " + (err as Error).message);
    }
  };

  // Variant logic
  const regenerateVariants = (defs: Product["variant_defs"]) => {
    const combos = cartesianProduct(defs || []);
    const newVariants = combos.map((attrs) => {
      const key = attrsToKey(attrs);
      const existing = (product.variants || []).find((v) => attrsToKey(v.attributes) === key);
      return existing || {
        sku: generateAutoSku(product.product_code, attrs),
        attributes: attrs,
        price: product.price,
        stock: 0,
      };
    });
    setProduct({ ...product, variant_defs: defs, variants: newVariants });
  };

  const addVariantDef = () => {
    regenerateVariants([...(product.variant_defs || []), { name: "", values: [] }]);
  };

  const removeVariantDef = (idx: number) => {
    const defs = (product.variant_defs || []).filter((_, i) => i !== idx);
    regenerateVariants(defs);
  };

  const updateVariantDef = (idx: number, field: "name" | "values", value: string | string[]) => {
    const defs = (product.variant_defs || []).map((d, i) =>
      i === idx ? { ...d, [field]: value } : d
    );
    const combos = cartesianProduct(defs);
    const newVariants = combos.map((attrs) => {
      const key = attrsToKey(attrs);
      const existing = (product.variants || []).find((v) => attrsToKey(v.attributes) === key);
      return existing || {
        sku: generateAutoSku(product.product_code, attrs),
        attributes: attrs,
        price: product.price,
        stock: 0,
      };
    });
    setProduct({ ...product, variant_defs: defs, variants: newVariants });
  };

  const addVariantValue = (defIdx: number, value: string) => {
    const def = (product.variant_defs || [])[defIdx];
    if (!value.trim() || def.values.includes(value.trim())) return;
    updateVariantDef(defIdx, "values", [...def.values, value.trim()]);
  };

  const removeVariantValue = (defIdx: number, valIdx: number) => {
    const def = (product.variant_defs || [])[defIdx];
    updateVariantDef(defIdx, "values", def.values.filter((_, i) => i !== valIdx));
  };

  const updateVariant = (idx: number, field: "sku" | "price" | "stock", val: any) => {
    const variants = (product.variants || []).map((v, i) =>
      i === idx ? { ...v, [field]: val } : v
    );
    setProduct({ ...product, variants });
  };

  const removeVariant = (idx: number) => {
    const variants = (product.variants || []).filter((_, i) => i !== idx);
    setProduct({ ...product, variants });
  };

  const hasVariants = (product.variant_defs || []).length > 0 && (product.variant_defs || []).some((d) => d.values.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-500">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Back link */}
      <Link
        href="/app/products"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white transition-colors"
      >
        ← Products
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            {product.name || "Untitled Product"}
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">SKU: {product.product_code}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Left: Product Info */}
        <div className="xl:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cardCls}
          >
            <h3 className="text-sm font-semibold text-white/80">Product Information</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                  placeholder="Product name"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Product Code / SKU</label>
                <input
                  type="text"
                  value={product.product_code}
                  onChange={(e) => setProduct({ ...product, product_code: e.target.value })}
                  placeholder="product-code-001"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <input
                  type="text"
                  value={product.category || ""}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  placeholder="e.g. T-shirts, Electronics"
                  className={inputCls}
                />
              </div>
              {/* AI Toggle */}
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <div>
                    <p className="text-xs font-medium text-white">AI Searchable</p>
                    <p className="text-[10px] text-zinc-600">Product appears in AI search results</p>
                  </div>
                </div>
                <button onClick={() => setProduct({ ...product, aiEnabled: product.aiEnabled !== false ? false : true })}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                    product.aiEnabled !== false
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-zinc-800/50 text-zinc-600 border border-zinc-800"
                  )}>
                  {product.aiEnabled !== false ? "🟢 ON" : "⚪ OFF"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Price (VND)</label>
                  <input
                    type="number"
                    value={product.price || ""}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Stock</label>
                  <input
                    type="number"
                    value={product.stock ?? ""}
                    onChange={(e) => setProduct({ ...product, stock: e.target.value ? Number(e.target.value) : 0 })}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  value={product.description || ""}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Product description..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors resize-y"
                />
              </div>
              <div>
                <label className={labelCls}>Images</label>
                <div className="bg-white/[0.03] border border-dashed border-white/[0.08] rounded-xl p-4 text-center text-xs text-neutral-500">
                  Image upload coming soon
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Variants */}
        <div className="xl:col-span-2 space-y-6">
          {/* Variant Defs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cardCls}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/80">Variant Definitions</h3>
              <button
                onClick={addVariantDef}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add type
              </button>
            </div>
            <div className="space-y-3">
              {(product.variant_defs || []).map((def, di) => (
                <div
                  key={di}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={def.name}
                      onChange={(e) => updateVariantDef(di, "name", e.target.value)}
                      placeholder="e.g. Color, Size"
                      className="flex-1 bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 transition-colors"
                    />
                    <button
                      onClick={() => removeVariantDef(di)}
                      className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {def.values.map((val, vi) => (
                      <span
                        key={vi}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg text-xs text-white/80"
                      >
                        {val}
                        <button
                          onClick={() => removeVariantValue(di, vi)}
                          className="text-neutral-500 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Add value"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addVariantValue(di, (e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = "";
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          addVariantValue(di, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="px-2.5 py-1 bg-white/5 border border-dashed border-white/20 rounded-lg text-xs text-white placeholder-zinc-600 outline-none focus:border-blue-500/50 min-w-[100px]"
                    />
                  </div>
                </div>
              ))}
              {(product.variant_defs || []).length === 0 && (
                <p className="text-xs text-neutral-500 text-center py-4">
                  No variant types defined yet. Add color, size, etc.
                </p>
              )}
            </div>
          </motion.div>

          {/* Variants Table */}
          {hasVariants && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cardCls}
            >
              <h3 className="text-sm font-semibold text-white/80">
                Variants ({(product.variants || []).length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {(product.variant_defs || []).map((def) => (
                        <th
                          key={def.name}
                          className="px-3 py-2 text-left text-xs font-medium text-neutral-500 whitespace-nowrap"
                        >
                          {def.name}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-left text-xs font-medium text-neutral-500">SKU</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500">Price</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-neutral-500">Stock</th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {(product.variants || []).map((v, vi) => (
                      <tr
                        key={vi}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                      >
                        {(product.variant_defs || []).map((def) => (
                          <td key={def.name} className="px-3 py-2 text-xs text-white/70">
                            {v.attributes[def.name] || "-"}
                          </td>
                        ))}
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => updateVariant(vi, "sku", e.target.value)}
                            className="w-28 bg-white/5 border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={v.price || ""}
                            onChange={(e) => updateVariant(vi, "price", Number(e.target.value))}
                            className="w-24 bg-white/5 border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={v.stock ?? ""}
                            onChange={(e) => updateVariant(vi, "stock", Number(e.target.value))}
                            className="w-16 bg-white/5 border border-white/[0.08] rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500/50 transition-colors text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => removeVariant(vi)}
                            className="p-1 text-red-400/50 hover:text-red-400 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
