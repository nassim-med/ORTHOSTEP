"use client";

interface HeroProps {
  language: "fr" | "ar";
  onLanguageChange: (language: "fr" | "ar") => void;
  onOrderClick: () => void;
}

export default function Hero({ language, onLanguageChange, onOrderClick }: HeroProps) {
  const isArabic = language === "ar";

  return (
    <div className="bg-gradient-to-b from-orthostep/5 to-transparent py-6 px-4 sm:py-8">
      <div className="section-container text-center">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => onLanguageChange("fr")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${language === "fr" ? "bg-orthostep text-white" : "text-slate-700"}`}
            >
              Francais
            </button>
            <button
              type="button"
              onClick={() => onLanguageChange("ar")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${language === "ar" ? "bg-orthostep text-white" : "text-slate-700"}`}
            >
              العربية
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          ORTHOSTEP
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          {isArabic ? "أحذية طبية مريحة لدعم يومي أفضل" : "Chaussures orthopediques confortables pour un soutien quotidien"}
        </p>
        <button
          type="button"
          onClick={onOrderClick}
          className="mt-4 inline-flex rounded-full bg-orthostep px-6 py-2 text-sm font-semibold text-white transition active:scale-95 sm:px-8 sm:py-3"
        >
          {isArabic ? "اطلب الآن" : "Commander maintenant"}
        </button>
      </div>
    </div>
  );
}
