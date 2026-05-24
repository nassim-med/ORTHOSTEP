"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import ProductImageGallery from "./ProductImageGallery";
import type { Product, DeliveryZone, ProductColor } from "../types/product";
import deliveryZones from "../data/algeria-delivery.json";
import { getWhatsAppLink } from "../lib/store-settings";

interface OrderFormProps {
  language: "fr" | "ar";
  product: Product;
  whatsapp: string;
}

function normalizeColors(colors: ProductColor[] | Array<string | ProductColor>) {
  return colors.map((color) =>
    typeof color === "string" ? { name: color } : color
  );
}

export default function OrderForm({ language, product, whatsapp }: OrderFormProps) {
  const [mounted, setMounted] = useState(false);
  const normalizedColors = useMemo(
    () => normalizeColors(product.colors as Array<string | ProductColor>),
    [product.colors]
  );

  const [selectedColor, setSelectedColor] = useState(
    normalizedColors[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(
    product.sizes[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState<string>(
    deliveryZones[0]?.wilaya || ""
  );
  const [selectedCommune, setSelectedCommune] = useState<string>(
    deliveryZones[0]?.commune || ""
  );
  const [mainImage, setMainImage] = useState(product.images[0]);

  const uniqueWilayas = useMemo(
    () => Array.from(new Set(deliveryZones.map((z) => z.wilaya))),
    []
  );

  const communes = useMemo(
    () => deliveryZones.filter((z) => z.wilaya === selectedWilaya),
    [selectedWilaya]
  );

  const selectedZone = useMemo(
    () =>
      deliveryZones.find(
        (z) => z.wilaya === selectedWilaya && z.commune === selectedCommune
      ),
    [selectedWilaya, selectedCommune]
  );

  const deliveryPrice = selectedZone?.price ?? 0;
  const totalPrice = product.price * quantity + deliveryPrice;
  const isArabic = language === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSelectedColor(normalizedColors[0]?.name || "");
    setSelectedSize(product.sizes[0] ?? null);
    setMainImage(product.images[0]);
  }, [product, normalizedColors]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const colorObj = normalizedColors.find((c) => c.name === color);
    if (colorObj?.imageUrl) {
      setMainImage(colorObj.imageUrl);
      return;
    }

    const colorIndex = normalizedColors.findIndex((c) => c.name === color);
    if (colorIndex >= 0 && product.images[colorIndex]) {
      setMainImage(product.images[colorIndex]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedSize || !customerName || !phone || !address || !selectedWilaya || !selectedCommune) {
      alert(isArabic ? "يرجى ملء جميع الحقول" : "Veuillez remplir tous les champs");
      return;
    }

    const message = `🛍️ *ORTHOSTEP ORDER*

👤 *Client:* ${customerName}
📱 *Phone:* ${phone}
📍 *Address:* ${address}

*Wilaya:* ${selectedWilaya}
*Commune:* ${selectedCommune}

---

📦 *Product:* ${product.title}
🎨 *Color:* ${selectedColor}
📏 *Size:* ${selectedSize}
📊 *Quantity:* ${quantity}

---

💰 *Product Price:* ${product.price.toLocaleString()} DZD
🚚 *Delivery:* ${deliveryPrice.toLocaleString()} DZD
✅ *TOTAL:* ${totalPrice.toLocaleString()} DZD

⏱️ *Delivery:* ${selectedZone?.days || "N/A"}`;

    const whatsappUrl = getWhatsAppLink(whatsapp, message);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Image */}
      <ProductImageGallery images={mainImage ? [mainImage, ...product.images.filter((image) => image !== mainImage)] : product.images} title={product.title} />

      {/* Product Info */}
      <div className="rounded-xl bg-slate-50 p-4">
        <h1 className="text-2xl font-bold text-slate-900">{product.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{product.comfortLevel}</p>
        <p className="mt-4 text-3xl font-bold text-orthostep">
          {product.price.toLocaleString("fr-FR")} DZD
        </p>
        {product.discount > 0 && (
          <p className="mt-1 text-xs text-slate-500 line-through">
            {product.oldPrice.toLocaleString("fr-FR")} DZD
          </p>
        )}
      </div>

      {/* Color Selector */}
      <ColorSelector
        language={language}
        colors={normalizedColors}
        selectedColor={selectedColor}
        onColorChange={handleColorChange}
      />

      {/* Size Selector */}
      <SizeSelector
        language={language}
        sizes={product.sizes}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
      />

      {/* Quantity Selector */}
      <QuantitySelector language={language} quantity={quantity} onQuantityChange={setQuantity} />

      {/* Customer Form */}
      <div className="space-y-3 border-t border-slate-200 pt-6">
        <h2 className="text-sm font-semibold text-slate-900">
          {isArabic ? "معلومات التوصيل" : "Informations de livraison"}
        </h2>

        <input
          type="text"
          placeholder={isArabic ? "الاسم الكامل" : "Nom complet"}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orthostep focus:ring-2 focus:ring-orthostep/20"
          required
        />

        <input
          type="tel"
          placeholder={isArabic ? "رقم واتساب" : "Numero WhatsApp"}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orthostep focus:ring-2 focus:ring-orthostep/20"
          required
        />

        <input
          type="text"
          placeholder={isArabic ? "العنوان الكامل" : "Adresse complete"}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orthostep focus:ring-2 focus:ring-orthostep/20"
          required
        />

        {mounted ? (
        <select
          value={selectedWilaya}
          onChange={(e) => {
            setSelectedWilaya(e.target.value);
            const firstCommune = deliveryZones.find(
              (z) => z.wilaya === e.target.value
            );
            if (firstCommune) setSelectedCommune(firstCommune.commune);
          }}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orthostep focus:ring-2 focus:ring-orthostep/20"
        >
          {uniqueWilayas.map((wilaya) => (
            <option key={wilaya} value={wilaya}>
              {wilaya}
            </option>
          ))}
        </select>
        ) : null}

        {mounted ? (
        <select
          value={selectedCommune}
          onChange={(e) => setSelectedCommune(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-orthostep focus:ring-2 focus:ring-orthostep/20"
        >
          {communes.map((zone) => (
            <option key={zone.id} value={zone.commune}>
              {zone.commune}
            </option>
          ))}
        </select>
        ) : null}
      </div>

      {/* Price Summary */}
      <div className="space-y-2 rounded-xl bg-orthostep/5 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{isArabic ? `المنتج × ${quantity}` : `Produit x ${quantity}`}</span>
          <span className="font-semibold text-slate-900">
            {(product.price * quantity).toLocaleString("fr-FR")} DZD
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">{isArabic ? "التوصيل" : "Livraison"}</span>
          <span className="font-semibold text-slate-900">
            {deliveryPrice.toLocaleString("fr-FR")} DZD
          </span>
        </div>
        <div className="border-t border-orthostep/20 pt-2">
          <div className="flex justify-between">
            <span className="font-bold text-slate-900">TOTAL</span>
            <span className="text-2xl font-bold text-orthostep">
              {totalPrice.toLocaleString("fr-FR")} DZD
            </span>
          </div>
        </div>
        {selectedZone?.days && (
          <p className="mt-2 text-xs text-slate-600">
            {isArabic ? `التوصيل خلال ${selectedZone.days}` : `Livraison en ${selectedZone.days}`}
          </p>
        )}
      </div>

      {/* WhatsApp Button */}
      <button
        type="submit"
        className="w-full rounded-xl bg-orthostep py-4 text-center text-lg font-bold text-white shadow-lg transition active:scale-95 sm:rounded-lg sm:py-3"
      >
        {isArabic ? "اطلب عبر واتساب" : "Commander sur WhatsApp"}
      </button>

      <p className="text-center text-xs text-slate-500">
        {isArabic ? "سيتم معالجة طلبك فورا" : "Votre commande sera traitee immediatement"}
      </p>
    </form>
  );
}
