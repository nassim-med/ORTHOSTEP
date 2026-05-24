"use client";

import useStoreSettings from "../lib/use-store-settings";

interface HeroProps {
  language: "fr" | "ar";
  onLanguageChange: (language: "fr" | "ar") => void;
  onOrderClick: () => void;
}

export default function Hero({
  language,
  onLanguageChange,
  onOrderClick
}: HeroProps) {

  const settings = useStoreSettings();

  const isArabic =
    language === "ar";

  return (

    <div className="
    bg-gradient-to-b
    from-orthostep/5
    to-transparent
    py-6
    px-4
    sm:py-8
    ">

      <div className="
      section-container
      text-center
      ">

        <div className="
        mb-4
        flex
        justify-center
        ">

          <div className="
          inline-flex
          rounded-full
          border
          border-slate-200
          bg-white
          p-1
          shadow-sm
          ">

            <button
              type="button"
              onClick={() =>
                onLanguageChange("fr")
              }
              className={`
              rounded-full
              px-4
              py-2
              text-sm
              font-semibold
              transition
              ${
                language==="fr"
                ?
                "bg-orthostep text-white"
                :
                "text-slate-700"
              }
              `}
            >
              Francais
            </button>

            <button
              type="button"
              onClick={() =>
                onLanguageChange("ar")
              }
              className={`
              rounded-full
              px-4
              py-2
              text-sm
              font-semibold
              transition
              ${
                language==="ar"
                ?
                "bg-orthostep text-white"
                :
                "text-slate-700"
              }
              `}
            >
              العربية
            </button>

          </div>

        </div>


        <div className="
        flex
        flex-col
        items-center
        justify-center
        ">

          {settings?.logo ? (

            <img
              src={settings.logo}
              alt="Store Logo"
              className="
              mb-4
              h-20
              sm:h-24
              w-auto
              max-w-[220px]
              object-contain
              "
            />

          ) : (

            <h1 className="
            text-3xl
            sm:text-5xl
            font-bold
            text-slate-900
            ">
              {settings?.store_name || "ORTHOSTEP"}
            </h1>

          )}

        </div>


        <p className="
        mt-3
        text-sm
        text-slate-600
        sm:text-base
        max-w-xl
        mx-auto
        ">

          {isArabic
          ?
          "أحذية طبية مريحة لدعم يومي أفضل"
          :
          "Chaussures orthopediques confortables pour un soutien quotidien"}

        </p>

        <button
          type="button"
          onClick={onOrderClick}
          className="
          mt-6
          inline-flex
          rounded-full
          bg-orthostep
          px-6
          py-3
          text-sm
          font-semibold
          text-white
          transition
          active:scale-95
          hover:opacity-90
          sm:px-8
          "
        >

          {isArabic
          ?
          "اطلب الآن"
          :
          "Commander maintenant"}

        </button>

      </div>

    </div>

  );

}