"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "../components/Hero";
import ProductSelector from "../components/ProductSelector";
import OrderForm from "../components/OrderForm";
import StickyBar from "../components/StickyBar";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import MinimalFooter from "../components/MinimalFooter";
import useStoreSettings from "../lib/use-store-settings";
import type { Product } from "../types/product";
import productsData from "../data/products.json";

const products = productsData as Product[];
const LANGUAGE_KEY = "orthostep-language";

export default function HomePage() {
  const settings = useStoreSettings();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<"fr" | "ar">("fr");
  const [availableProducts, setAvailableProducts] = useState<Product[]>(products);
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0] || null);
  const orderFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage === "ar" || savedLanguage === "fr") {
      setLanguage(savedLanguage);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language, mounted]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/api/admin/products", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as Product[];
        if (!Array.isArray(data) || data.length === 0) return;
        setAvailableProducts(data);
        setSelectedProduct((prev) => data.find((item) => item.id === prev?.id) || data[0]);
      } catch {
        // Keep local JSON fallback if API is unavailable.
      }
    };

    loadProducts();
  }, []);

  const handleOrderClick = () => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isArabic = language === "ar";

  if (!mounted || !selectedProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg text-slate-600">Loading products...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white" dir={isArabic ? "rtl" : "ltr"}>
      <Hero language={language} onOrderClick={handleOrderClick} onLanguageChange={setLanguage} />

      <div
        ref={orderFormRef}
        className="bg-white px-4 py-6 sm:py-10"
      >
        <div className="section-container">
          <ProductSelector
            language={language}
            products={availableProducts}
            selectedProduct={selectedProduct}
            onProductChange={setSelectedProduct}
          />

          <div className="mx-auto mt-6 w-full max-w-3xl">
            <OrderForm language={language} product={selectedProduct} whatsapp={settings.whatsapp} />
          </div>
        </div>
      </div>

      <FloatingWhatsApp />
      <StickyBar language={language} whatsapp={settings.whatsapp} onOrderClick={handleOrderClick} />
      <MinimalFooter language={language} />
    </main>
  );
}