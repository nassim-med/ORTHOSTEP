"use client";

import { useEffect, useState } from "react";
import type { Product } from "../types/product";

interface ProductSelectorProps {
  language: "fr" | "ar";
  products: Product[];
  selectedProduct: Product;
  onProductChange: (product: Product) => void;
}

export default function ProductSelector({
  language,
  products,
  selectedProduct,
  onProductChange
}: ProductSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isArabic = language === "ar";

  return (
    <div className="sticky top-0 z-40 space-y-3 border-b border-slate-200 bg-white px-4 py-4 sm:relative sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
      <label className="block text-sm font-semibold text-slate-900">
        {isArabic ? "اختر النموذج" : "Selectionner un modele"}
      </label>
      <select
        value={selectedProduct.id}
        onChange={(e) => {
          const product = products.find((p) => p.id === e.target.value);
          if (product) onProductChange(product);
        }}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-orthostep focus:ring-2 focus:ring-orthostep/20"
      >
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {(isArabic ? product.titleAR : product.titleFR) || product.title} - {product.price.toLocaleString("fr-FR")} DZD
          </option>
        ))}
      </select>
    </div>
  );
}
