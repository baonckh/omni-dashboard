# Plan: Products Page Redesign — Multi-category + Variants

## DB Schema (đã có sẵn trong backend)
```
Product
├── id, shop_id, product_code, name
├── price, original_price, stock
├── category, description, images
├── VariantDef[] ← định nghĩa kiểu phân loại (màu, size...)
│   └── name, values[]
└── Variant[] ← biến thể cụ thể
    ├── sku, attributes{ màu: đen, size: S }
    ├── price, stock, image
    └── riêng từng variant
```

## User Flow
```
Products Page
│
├── [Sidebar: Danh mục]          │  [Main: Product Grid]
│   📁 Tất cả (12)               │
│   📁 Thời trang (5)            │  ┌──────────────────────────┐
│   📁 Điện tử (4)               │  │ 🔍 Tìm kiếm  [+ Thêm SP] │
│   📁 Phụ kiện (3)              │  ├──────────────────────────┤
│                                │  │ [Card] [Card] [Card]     │
│  [➕ Thêm danh mục]             │  │ [Card] [Card] [Card]     │
│                                │  └──────────────────────────┘
│
├── Click card → Product Detail
│   ┌────────────────────────────────────────────┐
│   │  🖼  Áo Thun Nam Cotton                    │
│   │  SKU: AO001  |  Danh mục: Thời trang       │
│   │  Mô tả: Áo thun chất liệu cotton 100%...   │
│   │                                            │
│   │  ┌─── Variant Defs ─────────────────────┐  │
│   │  │  Màu sắc: [Đen] [Trắng] [Xám] [Xanh] │  │
│   │  │  Kích thước: [S] [M] [L] [XL]        │  │
│   │  └──────────────────────────────────────┘  │
│   │                                            │
│   │  ┌─── Variants Table ───────────────────┐  │
│   │  │  SKU     | Màu | Size | Giá  | Kho   │  │
│   │  │ AO001-D-S| Đen | S    | 150k | 28    │  │
│   │  │ AO001-D-M| Đen | M    | 150k | 35    │  │
│   │  │ AO001-T-M| Trắng| M   | 150k | 20    │  │
│   │  └──────────────────────────────────────┘  │
│   │                                            │
│   │  [💾 Lưu]  [🗑 Xoá]                       │
│   └────────────────────────────────────────────┘
│
├── Click [+ Thêm SP] → Product Editor (Modal/Page)
│   ├── Tên sản phẩm, SKU, Danh mục
│   ├── Giá gốc, Giá khuyến mãi, Tồn kho
│   ├── Mô tả, Hình ảnh
│   ├── Variant Defs: thêm/xoá (màu sắc, kích thước...)
│   └── Variants: auto-generate từ defs, sửa giá/kho từng cái
│
└── Import: Upload CSV → parse → preview → confirm
```

## UI Components cần tạo

| Component | Mô tả |
|-----------|-------|
| `CategorySidebar` | Danh sách danh mục bên trái, click để lọc |
| `ProductCard` | Card hiển thị product + variants count |
| `ProductDetail` | Xem/sửa 1 product + variants table |
| `ProductEditor` | Form thêm/sửa product + variant defs |
| `VariantDefEditor` | Thêm/xoá variant type (màu, size) + values |
| `VariantsTable` | Auto-gen variants từ defs, edit price/stock |
| `CSVImportPreview` | Preview trước khi import |

## Files thay đổi

### Frontend
| File | Thay đổi |
|------|----------|
| `products/page.tsx` | Rewrite: sidebar category + product grid |
| `products/[id]/page.tsx` | Rewrite: product detail + variants |
| `products/new/page.tsx` | Rewrite: product editor with variant defs |
| `products/upload/page.tsx` | CSV import + preview |
| `types/product.ts` | NEW: Product types (variant defs, variants) |

### Backend
Không cần — schema đã có sẵn VariantDef + Variant

## Effort
| Component | Effort |
|-----------|--------|
| Types + API client updates | ~0.5h |
| Product list with category sidebar | ~1.5h |
| Product detail with variants | ~2h |
| Product editor (add/edit) | ~2h |
| CSV import preview | ~1h |
| **Total** | **~7h** |
