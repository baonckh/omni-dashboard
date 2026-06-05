"use client";

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

interface Props {
  variantDefs: VariantDef[];
  variants: Variant[];
  basePrice: number;
  onChange: (defs: VariantDef[], variants: Variant[]) => void;
}

function generateCombinations(defs: VariantDef[]): Record<string, string>[] {
  if (!defs.length || defs.some((d) => !d.values.length)) return [];

  function cartesian(arrays: string[][], index = 0): string[][] {
    if (index === arrays.length) return [[]];
    const rest = cartesian(arrays, index + 1);
    return arrays[index].flatMap((v) => rest.map((r) => [v, ...r]));
  }

  const valueArrays = defs.map((d) => d.values);
  const combos = cartesian(valueArrays);

  return combos.map((combo) => {
    const obj: Record<string, string> = {};
    defs.forEach((d, i) => {
      obj[d.name] = combo[i];
    });
    return obj;
  });
}

function attrsToKey(attrs: Record<string, string>): string {
  return Object.values(attrs).join("-").toLowerCase().replace(/\s+/g, "-");
}

export default function VariantEditor({ variantDefs, variants, basePrice, onChange }: Props) {
  const updateDef = (index: number, field: keyof VariantDef, value: string | string[]) => {
    const newDefs = variantDefs.map((d, i) =>
      i === index ? { ...d, [field]: value } : d
    );
    const combinations = generateCombinations(newDefs);
    const newVariants = combinations.map((attrs) => {
      const key = attrsToKey(attrs);
      const existing = variants.find((v) => attrsToKey(v.attributes) === key);
      return existing || { sku: "", attributes: attrs, price: basePrice, stock: 0, image: "" };
    });
    onChange(newDefs, newVariants);
  };

  const addDef = () => {
    onChange([...variantDefs, { name: "", values: [] }], []);
  };

  const removeDef = (index: number) => {
    const newDefs = variantDefs.filter((_, i) => i !== index);
    onChange(newDefs, generateCombinations(newDefs).map(() => ({ sku: "", attributes: {}, price: basePrice, stock: 0, image: "" })));
  };

  const addValue = (defIndex: number, value: string) => {
    if (!value.trim()) return;
    const def = variantDefs[defIndex];
    if (def.values.includes(value.trim())) return;
    updateDef(defIndex, "values", [...def.values, value.trim()]);
  };

  const removeValue = (defIndex: number, valueIndex: number) => {
    const def = variantDefs[defIndex];
    updateDef(defIndex, "values", def.values.filter((_, i) => i !== valueIndex));
  };

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const newVariants = variants.map((v, i) => (i === index ? { ...v, [field]: value } : v));
    onChange(variantDefs, newVariants);
  };

  const hasVariants = variantDefs.length > 0 && variantDefs.some((d) => d.values.length > 0);

  return (
    <div className="space-y-4">
      {/* Variant Defs */}
      <div className="space-y-3">
        {variantDefs.map((def, di) => (
          <div key={di} className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="text"
                value={def.name}
                onChange={(e) => updateDef(di, "name", e.target.value)}
                placeholder="VD: Màu sắc, Kích thước, Chất liệu..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
              />
              <button onClick={() => removeDef(di)} className="text-red-500 hover:text-red-400 text-sm p-1">
                ✕
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {def.values.map((val, vi) => (
                <span key={vi} className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-sm">
                  {val}
                  <button onClick={() => removeValue(di, vi)} className="text-neutral-500 hover:text-red-400 ml-1">
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="+ Thêm giá trị"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addValue(di, (e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    addValue(di, e.target.value);
                    e.target.value = "";
                  }
                }}
                className="px-3 py-1.5 bg-white/5 border border-dashed border-white/20 rounded-lg focus:outline-none focus:border-white/30 text-sm min-w-[120px]"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addDef}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          + Thêm phân loại (màu sắc, kích thước...)
        </button>
      </div>

      {/* Variant Matrix */}
      {hasVariants && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5">
                {variantDefs.map((def) => (
                  <th key={def.name} className="px-3 py-2 text-left text-neutral-400 font-medium">
                    {def.name}
                  </th>
                ))}
                <th className="px-3 py-2 text-left text-neutral-400 font-medium">SKU</th>
                <th className="px-3 py-2 text-right text-neutral-400 font-medium">Giá</th>
                <th className="px-3 py-2 text-right text-neutral-400 font-medium">Tồn kho</th>
                <th className="px-3 py-2 text-neutral-400 font-medium">Ảnh</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, vi) => (
                <tr key={vi} className="border-t border-white/5 hover:bg-white/5">
                  {variantDefs.map((def) => (
                    <td key={def.name} className="px-3 py-2 text-white/80">
                      {v.attributes[def.name] || "-"}
                    </td>
                  ))}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateVariant(vi, "sku", e.target.value)}
                      placeholder="Tự động"
                      className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-white/30 text-xs"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.price || ""}
                      onChange={(e) => updateVariant(vi, "price", Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-white/30 text-xs text-right"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.stock ?? ""}
                      onChange={(e) => updateVariant(vi, "stock", Number(e.target.value))}
                      className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-white/30 text-xs text-right"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={v.image}
                      onChange={(e) => updateVariant(vi, "image", e.target.value)}
                      placeholder="URL ảnh"
                      className="w-24 px-2 py-1 bg-white/5 border border-white/10 rounded focus:outline-none focus:border-white/30 text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-neutral-500 mt-2">
            💡 Mỗi phân loại có thể có giá và tồn kho riêng. AI sẽ đọc thông tin này để tư vấn chính xác.
          </p>
        </div>
      )}
    </div>
  );
}
