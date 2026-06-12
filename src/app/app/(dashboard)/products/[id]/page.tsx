"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";
import VariantEditor from "@/components/products/VariantEditor";

interface VariantDef {
  name: string;
  values: string[];
}

interface Variant {
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  image: string;
}

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
  variant_defs?: VariantDef[];
  variants?: Variant[];
  updated_at: string;
}

interface AIReadableField {
  label: string;
  key: keyof Product | "attributes_expanded";
  icon: string;
  description: string;
}

const AI_READABLE_SECTIONS: AIReadableField[] = [
  { label: "Tên sản phẩm", key: "name", icon: "🏷️", description: "AI dùng để nhận diện và giới thiệu sản phẩm với khách hàng" },
  { label: "Mã sản phẩm", key: "product_code", icon: "🔖", description: "Định danh duy nhất, AI dùng để tra cứu" },
  { label: "Danh mục", key: "category", icon: "📂", description: "AI dùng để phân loại và gợi ý sản phẩm cùng danh mục" },
  { label: "Giá bán", key: "price", icon: "💰", description: "AI trả lời câu hỏi về giá cho khách hàng" },
  { label: "Giá gốc (KM)", key: "original_price", icon: "🏷️", description: "AI hiển thị % giảm giá khi so sánh với giá bán" },
  { label: "Tồn kho", key: "stock", icon: "📦", description: "AI trả lời 'còn hàng không' cho khách" },
  { label: "Mô tả", key: "description", icon: "📝", description: "Nội dung chính AI đọc để tư vấn chi tiết cho khách" },
  { label: "Hình ảnh", key: "images", icon: "🖼️", description: "AI hiển thị trong carousel sản phẩm" },
  { label: "Thuộc tính", key: "attributes_expanded", icon: "⚙️", description: "Màu sắc, size, chất liệu - AI dùng để trả lời chi tiết" },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const isNew = productId === "new";

  const [product, setProduct] = useState<Product>({
    id: "",
    product_code: "",
    name: "",
    price: 0,
    stock: 0,
    category: "",
    description: "",
    images: [""],
    attributes: {},
    variant_defs: [],
    variants: [],
    updated_at: "",
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [shopId] = useState("test_shop");

  useEffect(() => {
    if (!isNew) {
      fetchProduct();
    }
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
        stock: res.stock,
        category: res.category || "",
        description: res.description || "",
        images: res.images?.length ? res.images : [""],
        attributes: res.attributes || {},
        variant_defs: res.variant_defs || [],
        variants: res.variants || [],
        updated_at: res.updated_at || "",
      });
    } catch (error) {
      console.error("Failed to fetch product:", error);
      alert("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!product.name.trim()) {
      alert("Tên sản phẩm là bắt buộc");
      return;
    }
    if (!product.product_code.trim()) {
      alert("Mã sản phẩm là bắt buộc");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: product.name,
        product_code: product.product_code,
        price: product.price,
        original_price: product.original_price,
        stock: product.stock,
        category: product.category,
        description: product.description,
        images: product.images?.filter(Boolean) || [],
        attributes: product.attributes,
        variant_defs: product.variant_defs || [],
        variants: product.variants || [],
      };

      if (isNew) {
        await api.post(`/admin/products/${shopId}`, payload, { shop_id: shopId });
        alert("Tạo sản phẩm thành công!");
      } else {
        await api.put(`/admin/products/${shopId}/${product.product_code}`, payload, { shop_id: shopId });
        alert("Cập nhật thành công!");
      }
      router.push("/app/products");
    } catch (error) {
      alert("Lỗi: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const addImageField = () => {
    setProduct({ ...product, images: [...(product.images || []), ""] });
  };

  const updateImage = (index: number, value: string) => {
    const imgs = [...(product.images || [])];
    imgs[index] = value;
    setProduct({ ...product, images: imgs });
  };

  const removeImage = (index: number) => {
    const imgs = (product.images || []).filter((_, i) => i !== index);
    setProduct({ ...product, images: imgs.length ? imgs : [""] });
  };

  // Variants handling
  const handleVariantChange = (defs: VariantDef[], variants: Variant[]) => {
    setProduct({ ...product, variant_defs: defs, variants });
  };

  // Attributes handling
  const attrEntries = product.attributes
    ? Object.entries(product.attributes).map(([k, v]) => [k, String(v ?? "")])
    : [["", ""]];

  const updateAttr = (index: number, key: string, value: string) => {
    const entries = [...attrEntries];
    entries[index] = [key, value];
    const attrs: Record<string, string> = {};
    entries.forEach(([k, v]) => {
      if (k.trim()) attrs[k.trim()] = v;
    });
    setProduct({ ...product, attributes: attrs });
  };

  const addAttr = () => {
    const entries = [...attrEntries, ["", ""]];
    const attrs: Record<string, string> = {};
    entries.forEach(([k, v]) => {
      if (k.trim()) attrs[k.trim()] = v;
    });
    attrs[""] = ""; // placeholder
    setProduct({ ...product, attributes: attrs });
  };

  const removeAttr = (index: number) => {
    const entries = attrEntries.filter((_, i) => i !== index);
    const attrs: Record<string, string> = {};
    entries.forEach(([k, v]) => {
      if (k.trim()) attrs[k.trim()] = v;
    });
    setProduct({ ...product, attributes: attrs });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-neutral-500">Đang tải thông tin sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/app/products" className="text-sm text-neutral-500 hover:text-white mb-2 block">
            ← Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
            {isNew ? "Thêm sản phẩm mới" : `Sửa: ${product.name || "Không tên"}`}
          </h1>
          <p className="text-neutral-500 mt-1">
            {isNew
              ? "Điền thông tin sản phẩm. AI sẽ đọc các thông tin này để tư vấn cho khách hàng."
              : "Cập nhật thông tin sản phẩm. AI tự động cập nhật dữ liệu tư vấn."}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
        >
          {saving ? "Đang lưu..." : isNew ? "Tạo sản phẩm" : "Lưu thay đổi"}
        </button>
      </div>

      {/* AI Context Indicator */}
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
        <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-1">
          <span>🤖</span>
          <span>AI sẽ đọc các thông tin dưới đây để trả lời khách hàng</span>
        </div>
        <p className="text-xs text-blue-400/60">
          Mỗi section đều có mô tả cách AI sử dụng thông tin đó trong tư vấn bán hàng.
        </p>
      </div>

      {/* AI-Readable Sections */}
      {AI_READABLE_SECTIONS.map((section) => (
        <div
          key={section.key}
          className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl"
        >
          {/* Section Header */}
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xl">{section.icon}</span>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{section.label}</h3>
              <p className="text-xs text-neutral-500 mt-0.5">{section.description}</p>
            </div>
          </div>

          {/* Section Content */}
          <div className="space-y-3">
            {section.key === "name" && (
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                placeholder="VD: Áo Thun Premium Cotton Navy"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-base"
              />
            )}

            {section.key === "product_code" && (
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={product.product_code}
                  onChange={(e) => setProduct({ ...product, product_code: e.target.value })}
                  placeholder="VD: ao-thun-navy-001"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-base"
                  disabled={!isNew}
                />
                {!isNew && (
                  <span className="text-xs text-neutral-500">(Không thể thay đổi mã sau khi tạo)</span>
                )}
              </div>
            )}

            {section.key === "category" && (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={product.category || ""}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  placeholder="VD: Áo thun, Quần jogger, Phụ kiện..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-base"
                />
              </div>
            )}

            {section.key === "price" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-neutral-500 mb-1">Giá bán (VNĐ)</label>
                  <input
                    type="number"
                    value={product.price || ""}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    placeholder="249000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-base"
                  />
                </div>
              </div>
            )}

            {section.key === "original_price" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-neutral-500 mb-1">Giá gốc (VNĐ) - để trống nếu không có KM</label>
                  <input
                    type="number"
                    value={product.original_price || ""}
                    onChange={(e) => setProduct({ ...product, original_price: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="VD: 350000"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-base"
                  />
                </div>
                {product.original_price && product.original_price > product.price && (
                  <div className="flex items-center px-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
                  </div>
                )}
              </div>
            )}

            {section.key === "stock" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-neutral-500 mb-1">Số lượng tồn kho</label>
                  <input
                    type="number"
                    value={product.stock ?? ""}
                    onChange={(e) => setProduct({ ...product, stock: e.target.value ? Number(e.target.value) : 0 })}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-base"
                  />
                </div>
              </div>
            )}

            {section.key === "description" && (
              <div>
                <textarea
                  value={product.description || ""}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  placeholder="Mô tả chi tiết sản phẩm... AI sẽ đọc đoạn này để tư vấn cho khách."
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-base resize-y"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  💡 Mô tả càng chi tiết, AI càng tư vấn chính xác. Gồm: chất liệu, kiểu dáng, công dụng, đặc điểm nổi bật.
                </p>
              </div>
            )}

            {section.key === "images" && (
              <div className="space-y-2">
                {(product.images || []).map((img, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => updateImage(idx, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-sm"
                    />
                    {img && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                        <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                    )}
                    <button onClick={() => removeImage(idx)} className="p-2 text-red-500 hover:text-red-400 text-sm">
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={addImageField}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  + Thêm ảnh
                </button>
              </div>
            )}

            {/* Custom Variants Section */}
            {section.key === "attributes_expanded" && (
              <>
                {/* Old attributes editor */}
                <div className="mb-6 space-y-2">
                  {attrEntries.map(([key, val], idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => updateAttr(idx, e.target.value, val)}
                        placeholder="VD: thương hiệu"
                        className="w-1/3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-sm"
                      />
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateAttr(idx, key, e.target.value)}
                        placeholder="VD: Nike"
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-sm"
                      />
                      <button onClick={() => removeAttr(idx)} className="p-2 text-red-500 hover:text-red-400 text-sm">
                        ✕
                      </button>
                    </div>
                  ))}
                  <button onClick={addAttr} className="text-sm text-blue-400 hover:text-blue-300">
                    + Thêm thuộc tính
                  </button>
                </div>

                {/* Variant Editor - Phân loại hàng (Shopee-style) */}
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-base font-medium mb-1">📦 Phân loại hàng (Variants)</h4>
                  <p className="text-xs text-neutral-500 mb-4">
                    Định nghĩa các phân loại như màu sắc, kích thước. Mỗi tổ hợp có giá riêng.
                  </p>
                  <VariantEditor
                    variantDefs={product.variant_defs || []}
                    variants={product.variants || []}
                    basePrice={product.price}
                    onChange={handleVariantChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}

      {/* Preview: How AI sees this product */}
      <div className="p-6 bg-green-500/[0.03] border border-green-500/20 rounded-3xl">
        <h3 className="text-lg font-semibold mb-3">🔮 Preview: AI sẽ thấy sản phẩm này như thế nào?</h3>
        <div className="bg-black/30 rounded-xl p-4 text-sm font-mono text-green-400/80 whitespace-pre-wrap">
          {`[SẢN PHẨM]
Tên: ${product.name || "(chưa có tên)"}
Mã: ${product.product_code || "(chưa có mã)"}
Danh mục: ${product.category || "(chưa phân loại)"}
Giá: ${product.price.toLocaleString()}đ${product.original_price && product.original_price > product.price ? ` (Giá gốc: ${product.original_price.toLocaleString()}đ - Giảm ${Math.round((1 - product.price / product.original_price) * 100)}%)` : ""}
Tồn kho: ${product.stock ?? 0}
Mô tả: ${(product.description || "(chưa có mô tả)").substring(0, 200)}
Thuộc tính: ${Object.entries(product.attributes || {}).filter(([k]) => k).map(([k, v]) => `${k}: ${v}`).join(", ") || "(chưa có thuộc tính)"}
Phân loại: ${(product.variant_defs || []).map((d) => `${d.name} (${d.values.join(", ")})`).join(" | ") || "Không có"}
Biến thể: ${(product.variants || []).length} tổ hợp${(product.variants || []).slice(0, 3).map((v) => `\n  - ${Object.values(v.attributes).join(" - ")}: ${v.price.toLocaleString()}đ (${v.stock} cái)`).join("")}
Ảnh: ${(product.images || []).filter(Boolean).length} ảnh`}
        </div>
      </div>
    </div>
  );
}
