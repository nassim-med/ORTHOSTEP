"use client";

interface QuantitySelectorProps {
  language?: "fr" | "ar";
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export default function QuantitySelector({
  language = "fr",
  quantity,
  onQuantityChange
}: QuantitySelectorProps) {
  const isArabic = language === "ar";

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-900">
        {isArabic ? "الكمية" : "Quantite"}
      </label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-300 text-xl font-bold text-slate-700 transition active:bg-slate-100"
        >
          −
        </button>
        <span className="min-w-12 text-center text-lg font-bold text-slate-900">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onQuantityChange(quantity + 1)}
          className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-300 text-xl font-bold text-slate-700 transition active:bg-slate-100"
        >
          +
        </button>
      </div>
    </div>
  );
}
