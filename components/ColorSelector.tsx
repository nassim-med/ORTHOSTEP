"use client";

import type { ProductColor } from "../types/product";

interface ColorSelectorProps {
  language?: "fr" | "ar";
  colors: ProductColor[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  onImageChange?: (imageUrl: string) => void;
}

export default function ColorSelector({
  language = "fr",
  colors,
  selectedColor,
  onColorChange,
  onImageChange
}: ColorSelectorProps) {
  const isArabic = language === "ar";

  const handleColorClick = (color: ProductColor) => {
    onColorChange(color.name);
    if (color.imageUrl && onImageChange) {
      onImageChange(color.imageUrl);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-900">
        {isArabic ? "اللون" : "Couleur"}
      </label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => handleColorClick(color)}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
              selectedColor === color.name
                ? "border-2 border-orthostep bg-orthostep/10 text-orthostep"
                : "border border-slate-300 bg-white text-slate-700 active:border-orthostep"
            }`}
          >
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
