// ── Product types with variant support ──

export interface VariantDef {
  name: string;     // "Màu sắc", "Kích thước"
  values: string[]; // ["Đen", "Trắng"], ["S", "M", "L"]
}

export interface Variant {
  sku: string;
  attributes: Record<string, string>; // { "Màu sắc": "Đen", "Kích thước": "S" }
  price: number;
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  product_code: string;
  name: string;
  price: number;
  original_price?: number;
  stock?: number;
  category: string;
  description?: string;
  images?: string[];
  variant_defs?: VariantDef[];
  variants?: Variant[];
  aiEnabled?: boolean; // Whether this product is searchable by AI
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
}
