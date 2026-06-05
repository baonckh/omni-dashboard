"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface ParsedProduct {
  product_code: string;
  name: string;
  price: number;
  category: string;
  stock?: number;
  description: string;
  has_error: boolean;
  error_msg?: string;
}

interface ParseResult {
  products: ParsedProduct[];
  errors: { row: number; message: string }[];
  total: number;
  valid_count: number;
  invalid_count: number;
}

export default function ProductUploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<"upload" | "preview" | "confirming">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [shopId, setShopId] = useState("test_shop");
  const [error, setError] = useState("");
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError("");
    }
  };
  
  // Parse file
  const handleParse = async () => {
    if (!file || !shopId) {
      setError("Vui lòng chọn file và đảm bảo đã đăng nhập shop");
      return;
    }
    
    setStep("preview");
    setError("Đang phân tích file...");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await api.post_form(`/admin/knowledge/parse?shop_id=${shopId}`, formData);
      setParseResult(res);
      
      // Select all valid products by default
      const validIndices = res.products
        .map((p: ParsedProduct, i: number) => (!p.has_error ? i : -1))
        .filter((i: number) => i !== -1);
      setSelectedProducts(new Set(validIndices));
      
      setError("");
    } catch (err) {
      setError("Phân tích thất bại: " + (err as Error).message);
      setStep("upload");
    }
  };
  
  // Confirm and save
  const handleConfirm = async () => {
    if (!parseResult || selectedProducts.size === 0) return;
    
    setStep("confirming");
    setError("Đang lưu sản phẩm...");
    
    try {
      const productsToSave = selectedProducts.size === parseResult.products.length
        ? parseResult.products
        : parseResult.products.filter((_: any, i: number) => selectedProducts.has(i));
      
      const res = await api.post(`/admin/knowledge/confirm`, {
        shop_id: shopId,
        products: productsToSave,
        replace: true, // Full catalog replacement
      });
      
      if (res.success) {
        alert(`Đã lưu ${res.inserted_count} sản phẩm thành công!`);
        router.push("/products");
      } else {
        throw new Error(res.message || "Lưu thất bại");
      }
    } catch (err) {
      setError("Lưu thất bại: " + (err as Error).message);
      setStep("preview");
    }
  };
  
  // Toggle product selection
  const toggleProduct = (index: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedProducts(newSelected);
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload sản phẩm</h1>
      
      {/* Step 1: Upload */}
      {step === "upload" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Bước 1: Chọn file</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Hỗ trợ file CSV hoặc JSON. File cần có các cột: mã sản phẩm, tên, giá.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          {file && (
            <div className="flex items-center gap-4">
              <span className="text-sm">File: {file.name}</span>
              <button
                onClick={handleParse}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Phân tích file
              </button>
            </div>
          )}
          
          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      )}
      
      {/* Step 2: Preview */}
      {step === "preview" && parseResult && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Bước 2: Xem trước dữ liệu</h2>
            
            <div className="flex gap-4 mb-4 text-sm">
              <span className="text-green-600">✓ Hợp lệ: {parseResult.valid_count}</span>
              <span className="text-red-600">✗ Lỗi: {parseResult.invalid_count}</span>
              <span className="text-gray-600">Tổng: {parseResult.total}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedProducts(new Set(parseResult.products.map((_: any, i: number) => i)))}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Chọn tất cả
              </button>
              <button
                onClick={() => setSelectedProducts(new Set())}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>
          
          {/* Products Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left w-8">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === parseResult.valid_count}
                        onChange={(e) => e.target.checked 
                          ? setSelectedProducts(new Set(parseResult.products.map((_: any, i: number) => i)))
                          : setSelectedProducts(new Set())
                        }
                      />
                    </th>
                    <th className="px-3 py-2 text-left">Mã</th>
                    <th className="px-3 py-2 text-left">Tên</th>
                    <th className="px-3 py-2 text-right">Giá</th>
                    <th className="px-3 py-2 text-left">Danh mục</th>
                    <th className="px-3 py-2 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {parseResult.products.map((product, index) => (
                    <tr 
                      key={index} 
                      className={`border-t ${product.has_error ? "bg-red-50" : ""}`}
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(index)}
                          onChange={() => toggleProduct(index)}
                          disabled={product.has_error}
                        />
                      </td>
                      <td className="px-3 py-2">{product.product_code}</td>
                      <td className="px-3 py-2">{product.name}</td>
                      <td className="px-3 py-2 text-right">{product.price.toLocaleString()}đ</td>
                      <td className="px-3 py-2">{product.category || "-"}</td>
                      <td className="px-3 py-2">
                        {product.has_error 
                          ? <span className="text-red-600">{product.error_msg}</span>
                          : <span className="text-green-600">✓</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => { setStep("upload"); setParseResult(null); }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              ← Quay lại
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedProducts.size === 0}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Xác nhận ({selectedProducts.size} sản phẩm)
            </button>
          </div>
          
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}