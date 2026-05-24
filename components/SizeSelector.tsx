"use client";

interface SizeSelectorProps {
  language?: "fr" | "ar";
  sizes: number[];
  selectedSize: number | null;
  onSizeChange: (size: number) => void;
}

export default function SizeSelector({
  language = "fr",
  sizes,
  selectedSize,
  onSizeChange
}: SizeSelectorProps) {
  const isArabic = language === "ar";

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-900">
        {isArabic ? "المقاس" : "Taille"}
      </label>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)}
            className={`rounded-lg py-3 text-sm font-semibold transition active:scale-95 ${
              selectedSize === size
                ? "border-2 border-orthostep bg-orthostep text-white"
                : "border border-slate-300 bg-white text-slate-700 active:border-orthostep"
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
