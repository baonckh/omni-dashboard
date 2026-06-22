"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useShopId } from "@/lib/use-shop";
import { cn } from "@/lib/utils";

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
  const shopId = useShopId();
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setError(""); }
  };

  const handleParse = async () => {
    if (!file || !shopId) { setError("Vui lòng chọn file và đảm bảo đã đăng nhập shop"); return; }
    setStep("preview");
    setError("Đang phân tích file...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post_form(`/admin/knowledge/parse?shop_id=${shopId}`, formData);
      setParseResult(res);
      const validIndices = res.products.map((p: ParsedProduct, i: number) => (!p.has_error ? i : -1)).filter((i: number) => i !== -1);
      setSelectedProducts(new Set(validIndices));
      setError("");
    } catch (err) { setError("Phân tích thất bại: " + (err as Error).message); setStep("upload"); }
  };

  const handleConfirm = async () => {
    if (!parseResult || selectedProducts.size === 0) return;
    setStep("confirming");
    try {
      const selected = parseResult.products.filter((_, i) => selectedProducts.has(i));
      await api.post(`/admin/products/confirm`, { shop_id: shopId, products: selected, overwrite: true });
      alert("Import thành công!");
      router.push("/app/products");
    } catch (err) { setError("Xác nhận thất bại: " + (err as Error).message); setStep("preview"); }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Upload sản phẩm</h1>

      {step === "upload" && (
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 space-y-6">
          <div>
            <p className="text-sm text-zinc-400 mb-3">Hỗ trợ file CSV hoặc JSON. File cần có các cột: mã sản phẩm, tên, giá.</p>
            <input ref={fileInputRef} type="file" accept=".csv,.json,.xlsx,.xls" onChange={handleFileChange}
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500" />
          </div>
          {file && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-300">File: {file.name}</span>
              <button onClick={handleParse} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition-all">Phân tích file</button>
            </div>
          )}
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <div className="border-t border-zinc-700 pt-4">
            <p className="text-xs text-zinc-500">
              💡 <strong className="text-zinc-400">Mẹo:</strong> Dùng tab <strong className="text-blue-400">Knowledge</strong> trong Bot Config để upload nhanh hơn — agent tự parse + import.
            </p>
          </div>
        </div>
      )}

      {step === "preview" && parseResult && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Bước 2: Xem trước dữ liệu</h2>
            <div className="flex gap-4 mb-4 text-sm">
              <span className="text-green-400">✓ Hợp lệ: {parseResult.valid_count}</span>
              <span className="text-red-400">✗ Lỗi: {parseResult.invalid_count}</span>
              <span className="text-zinc-500">Tổng: {parseResult.total}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedProducts(new Set(parseResult.products.map((_, i) => i)))}
                className="px-3 py-1.5 text-xs border border-zinc-600 rounded-xl text-zinc-300 hover:bg-zinc-800">Chọn tất cả</button>
              <button onClick={() => setSelectedProducts(new Set())}
                className="px-3 py-1.5 text-xs border border-zinc-600 rounded-xl text-zinc-300 hover:bg-zinc-800">Bỏ chọn</button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden">
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800 sticky top-0">
                  <tr>
                    <th className="px-3 py-2.5 text-left w-8"><input type="checkbox" className="accent-blue-500" checked={selectedProducts.size === parseResult.valid_count} onChange={(e) => e.target.checked ? setSelectedProducts(new Set(parseResult.products.map((_, i) => i))) : setSelectedProducts(new Set())} /></th>
                    <th className="px-3 py-2.5 text-left text-zinc-400 font-medium">Mã</th>
                    <th className="px-3 py-2.5 text-left text-zinc-400 font-medium">Tên</th>
                    <th className="px-3 py-2.5 text-right text-zinc-400 font-medium">Giá</th>
                    <th className="px-3 py-2.5 text-left text-zinc-400 font-medium">Danh mục</th>
                    <th className="px-3 py-2.5 text-left text-zinc-400 font-medium">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {parseResult.products.map((p, i) => (
                    <tr key={i} className={cn("border-t border-zinc-800", p.has_error ? "bg-red-900/10" : selectedProducts.has(i) ? "bg-blue-900/10" : "")}>
                      <td className="px-3 py-2">
                        {!p.has_error && <input type="checkbox" className="accent-blue-500" checked={selectedProducts.has(i)} onChange={() => { const s = new Set(selectedProducts); s.has(i) ? s.delete(i) : s.add(i); setSelectedProducts(s); }} />}
                      </td>
                      <td className="px-3 py-2 text-zinc-300 font-mono text-xs">{p.product_code}</td>
                      <td className="px-3 py-2 text-white">{p.name}</td>
                      <td className="px-3 py-2 text-right text-zinc-200">{p.price?.toLocaleString()}đ</td>
                      <td className="px-3 py-2 text-zinc-400">{p.category}</td>
                      <td className="px-3 py-2">{p.has_error ? <span className="text-red-400 text-xs">{p.error_msg || "Lỗi"}</span> : <span className="text-green-400 text-xs">OK</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep("upload")} className="px-5 py-2.5 border border-zinc-600 rounded-xl text-sm text-zinc-300 hover:bg-zinc-800 transition-all">Quay lại</button>
            <button onClick={handleConfirm} disabled={selectedProducts.size === 0}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-sm font-bold text-white transition-all">Import {selectedProducts.size} sản phẩm</button>
          </div>
        </div>
      )}

      {step === "confirming" && (
        <div className="text-center py-16 text-zinc-400">Đang import...</div>
      )}
    </div>
  );
}
