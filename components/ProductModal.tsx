"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "../types/product";
import deliveryZones from "../data/algeria-delivery.json";
import useStoreSettings from "../lib/use-store-settings";
import { getWhatsAppLink } from "../lib/store-settings";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, open, onClose }: ProductModalProps) {
  const settings = useStoreSettings();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState<string>(deliveryZones[0]?.wilaya ?? "");
  const [selectedCommune, setSelectedCommune] = useState<string>(deliveryZones[0]?.commune ?? "");
  const [quantity, setQuantity] = useState(1);

  const colorOptions = product?.colors?.map((color) => (typeof color === "string" ? { name: color } : color)) ?? [];

  useEffect(() => {
    if (!product) {
      setSelectedImage(0);
      setSelectedSize(null);
      setSelectedColor(null);
      setCustomerName("");
      setPhone("");
      setAddress("");
      setQuantity(1);
      setSelectedWilaya(deliveryZones[0]?.wilaya ?? "");
      setSelectedCommune(deliveryZones[0]?.commune ?? "");
      return;
    }

    setSelectedImage(0);
    setSelectedSize(product.sizes[0] ?? null);
    setSelectedColor(colorOptions[0]?.name ?? null);
    setSelectedWilaya(deliveryZones[0]?.wilaya ?? "");
    setSelectedCommune(deliveryZones[0]?.commune ?? "");
  }, [product]);

  useEffect(() => {
    if (!deliveryZones.some((zone) => zone.wilaya === selectedWilaya && zone.commune === selectedCommune)) {
      const first = deliveryZones.find((zone) => zone.wilaya === selectedWilaya);
      setSelectedCommune(first?.commune ?? "");
    }
  }, [selectedWilaya, selectedCommune]);

  const activeSize = selectedSize ?? product?.sizes[0] ?? 0;
  const activeColor = selectedColor ?? colorOptions[0]?.name ?? "";

  const selectedZone = useMemo(
    () => deliveryZones.find((zone) => zone.wilaya === selectedWilaya && zone.commune === selectedCommune),
    [selectedWilaya, selectedCommune]
  );

  const deliveryPrice = selectedZone?.price ?? 0;
  const totalPrice = (product?.price ?? 0) * quantity + deliveryPrice;

  const whatsappUrl = useMemo(() => {
    if (!product) return "#";
    const message = `Bonjour ORTHOSTEP,\n\nNom: ${customerName}\nTéléphone: ${phone}\nWilaya: ${selectedWilaya}\nCommune: ${selectedCommune}\nAdresse: ${address}\n\nProduit: ${product.title}\nCouleur: ${activeColor}\nTaille: ${activeSize}\nQuantité: ${quantity}\n\nLivraison: ${deliveryPrice} DZD\nPrix total: ${totalPrice} DZD`;
    return getWhatsAppLink(settings.whatsapp, message);
  }, [activeColor, activeSize, product, customerName, phone, selectedWilaya, selectedCommune, address, quantity, deliveryPrice, totalPrice, settings.whatsapp]);

  return (
    <AnimatePresence>
      {open && product ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-[980px] overflow-hidden rounded-[32px] bg-white shadow-soft"
          >
            <div className="flex flex-col gap-6 p-6 sm:flex-row sm:gap-8">
              <div className="relative min-h-[420px] flex-1 overflow-hidden rounded-3xl bg-slate-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-orthostep-dark/70">ORTHOSTEP premium</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">{product.title}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 transition hover:bg-slate-100"
                  >
                    Fermer
                  </button>
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">{product.description}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm uppercase tracking-[0.16em] text-slate-500">Confort</h3>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{product.comfortLevel}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="text-sm uppercase tracking-[0.16em] text-slate-500">Utilisation</h3>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{product.recommendedUse}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Tailles</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-2xl border px-4 py-2 text-sm transition ${activeSize === size ? "border-orthostep-dark bg-orthostep-dark/10 text-orthostep-dark" : "border-slate-200 bg-white text-slate-700 hover:border-orthostep"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Couleurs</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {colorOptions.map((color) => {
                      const label = color?.name ?? "";
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setSelectedColor(label)}
                          className={`rounded-2xl border px-4 py-2 text-sm transition ${activeColor === label ? "border-orthostep-dark bg-orthostep-dark/10 text-orthostep-dark" : "border-slate-200 bg-white text-slate-700 hover:border-orthostep"}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-8 grid gap-6 rounded-[32px] border border-slate-200 bg-slate-50 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-700">
                      Nom du client
                      <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      Téléphone
                      <input value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      Wilaya
                      <select value={selectedWilaya} onChange={(event) => setSelectedWilaya(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep">
                        {Array.from(new Set(deliveryZones.map((zone) => zone.wilaya))).map((wilaya) => (
                          <option key={wilaya} value={wilaya}>{wilaya}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      Commune
                      <select value={selectedCommune} onChange={(event) => setSelectedCommune(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep">
                        {deliveryZones.filter((zone) => zone.wilaya === selectedWilaya).map((zone) => (
                          <option key={zone.id} value={zone.commune}>{zone.commune}</option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                      Adresse complète
                      <input value={address} onChange={(event) => setAddress(event.target.value)} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep" />
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      Quantité
                      <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orthostep" />
                    </label>
                  </div>
                  <div className="grid gap-4 rounded-[28px] bg-white p-5 shadow-sm sm:grid-cols-2">
                    <div>
                      <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Livraison</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{deliveryPrice.toLocaleString("fr-FR")} DZD</p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Prix total</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{totalPrice.toLocaleString("fr-FR")} DZD</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Un message WhatsApp structuré sera préparé avant l’envoi.</p>
                    </div>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={whatsappUrl}
                      className="inline-flex items-center justify-center rounded-3xl bg-orthostep text-white px-6 py-3 text-sm font-semibold shadow-sm transition hover:bg-orthostep-dark"
                    >
                      Commander sur WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900">Galerie de produits</h3>
              <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`min-w-[120px] overflow-hidden rounded-3xl border ${selectedImage === index ? "border-orthostep" : "border-transparent"}`}
                  >
                    <div className="relative h-24 w-32">
                      <Image src={src} alt={`${product.title} ${index + 1}`} fill sizes="120px" className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-y-4 gap-x-6 sm:grid-cols-2">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-900">Livraison</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">Livraison rapide dans les 58 wilayas d’Algérie. Paiement à la livraison disponible.</p>
                </div>
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-900">Notes médicales</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-600">Conçu pour soulager la douleur, corriger la posture et soutenir chaque pas avec un confort durable.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
