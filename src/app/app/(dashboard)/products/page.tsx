"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useShopId } from "@/lib/use-shop";

interface Product {
  id: string;
  product_code: string;
  name: string;
  price: number;
  original_price?: number;
  stock?: number;
  category: string;
  attributes?: Record<string, unknown>;
  description?: string;
  images?: string[];
  updated_at: string;
}

interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({ limit: 20 });
  const [total, setTotal] = useState(0);
  const shopId = useShopId();
  const [groupByCategory, setGroupByCategory] = useState(true);

  // Group products by category
  const groupedProducts = useMemo(() => {
    if (!groupByCategory) return null;
    const groups: Record<string, Product[]> = {};
    products.forEach((p) => {
      const cat = p.category || "Chưa phân loại";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [products, groupByCategory]);
  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/products/${shopId}`, { shop_id: shopId, ...filters });
      setProducts(res.products || []);
      setTotal(res.total || 0);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) fetchProducts();
  }, [shopId, filters]);

  // Delete product
  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await api.delete(`/admin/products/${shopId}/${productId}`, { shop_id: shopId });
      fetchProducts();
    } catch (error) {
      alert("Xóa thất bại: " + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            Quản lý sản phẩm
          </h1>
          <p className="text-neutral-500 mt-1">Quản lý và theo dõi danh sách sản phẩm của cửa hàng</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/app/products/upload")}
            className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            + Upload file
          </button>
          <button
            onClick={() => router.push("/app/products/new")}
            className="px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 transition-colors"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-neutral-500 mb-2">Danh mục</label>
            <input
              type="text"
              value={filters.category || ""}
              onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
              placeholder="áo thun, quần jeans..."
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm text-neutral-500 mb-2">Giá từ</label>
            <input
              type="number"
              value={filters.min_price || ""}
              onChange={(e) =>
                setFilters({ ...filters, min_price: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="0"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm text-neutral-500 mb-2">Giá đến</label>
            <input
              type="number"
              value={filters.max_price || ""}
              onChange={(e) =>
                setFilters({ ...filters, max_price: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="999999"
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchProducts}
              className="px-6 py-2.5 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 transition-colors"
            >
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Category Group Toggle */}
      <div className="flex items-center justify-end gap-3">
        <label className="flex items-center gap-2 text-sm text-neutral-500 cursor-pointer">
          <input
            type="checkbox"
            checked={groupByCategory}
            onChange={(e) => setGroupByCategory(e.target.checked)}
            className="accent-white"
          />
          Gom nhóm theo danh mục
        </label>
      </div>

      {/* Products Table - grouped by category or flat */}
      {groupByCategory && groupedProducts ? (
        <div className="space-y-6">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
              <div className="px-4 py-3 bg-white/5 border-b border-white/10">
                <h3 className="font-semibold">
                  📁 {category}
                  <span className="ml-2 text-sm text-neutral-500 font-normal">({items.length} sản phẩm)</span>
                </h3>
              </div>
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Mã</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Tên</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-neutral-500">Giá</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-neutral-500">Tồn kho</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-neutral-500">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product) => (
                    <tr key={product.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3"><span className="text-sm">{product.product_code}</span></td>
                      <td className="px-4 py-3"><span className="text-sm">{product.name}</span></td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium">{product.price.toLocaleString()}đ</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="ml-2 text-xs text-neutral-500 line-through">{product.original_price.toLocaleString()}đ</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center"><span className="text-sm">{product.stock ?? "-"}</span></td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => router.push(`/products/${product.product_code}`)} className="text-sm text-blue-400 hover:underline">Sửa</button>
                          <button onClick={() => handleDelete(product.product_code)} className="text-sm text-red-500 hover:underline">Xóa</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-neutral-500">Mã</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-neutral-500">Tên sản phẩm</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-neutral-500">Danh mục</th>
                <th className="px-4 py-4 text-right text-sm font-medium text-neutral-500">Giá</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-neutral-500">Tồn kho</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-neutral-500">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {!loading && products.map((product) => (
                <tr key={product.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4"><span className="text-sm font-medium">{product.product_code}</span></td>
                  <td className="px-4 py-4"><span className="text-sm">{product.name}</span></td>
                  <td className="px-4 py-4"><span className="text-sm text-neutral-500">{product.category || "-"}</span></td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-medium">{product.price.toLocaleString()}đ</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="ml-2 text-xs text-neutral-500 line-through">{product.original_price.toLocaleString()}đ</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center"><span className="text-sm">{product.stock ?? "-"}</span></td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => router.push(`/products/${product.product_code}`)} className="text-sm text-blue-400 hover:underline">Sửa</button>
                      <button onClick={() => handleDelete(product.product_code)} className="text-sm text-red-500 hover:underline">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="p-8 text-center text-neutral-500">Đang tải...</div>}
          {!loading && products.length === 0 && <div className="p-8 text-center text-neutral-500">Không có sản phẩm nào</div>}
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-sm text-neutral-500">Tổng: {total} sản phẩm</span>
        <div className="flex gap-2">
          <button
            disabled={!filters.offset || filters.offset === 0}
            onClick={() =>
              setFilters({
                ...filters,
                offset: Math.max(0, (filters.offset || 0) - (filters.limit || 20)),
              })
            }
            className="px-4 py-2 border border-white/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
          >
            ← Trước
          </button>
          <button
            onClick={() =>
              setFilters({
                ...filters,
                offset: (filters.offset || 0) + (filters.limit || 20),
              })
            }
            disabled={products.length < (filters.limit || 20)}
            className="px-4 py-2 border border-white/10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
}