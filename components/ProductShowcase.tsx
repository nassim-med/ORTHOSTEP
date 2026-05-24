"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "../types/product";
import ProductModal from "./ProductModal";
import useStoreSettings from "../lib/use-store-settings";
import { getWhatsAppLink } from "../lib/store-settings";

interface ProductShowcaseProps {
  products: Product[];
}

const getColorName = (color: Product["colors"][number] | undefined) =>
  typeof color === "string" ? color : color?.name || "N/A";

const buildWhatsAppLink = (product: Product, whatsapp: string) => {
  const message = `Hello ORTHOSTEP,\n\nI want to order:\nProduct: ${product.title}\nSize: ${product.sizes[0]}\nColor: ${getColorName(product.colors[0])}\nPrice: ${product.price} DZD`;
  return getWhatsAppLink(whatsapp, message);
};

export default function ProductShowcase({ products }: ProductShowcaseProps) {
  const settings = useStoreSettings();
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const featured = useMemo(() => products.slice(0, 8), [products]);

  return (
    <section className="section-container py-16">
      <div className="mb-10 flex flex-col gap-4 sm:items-center sm:justify-between sm:flex-row">
        <div>
          <span className="inline-flex items-center rounded-full bg-orthostep-light px-4 py-2 text-sm font-semibold text-orthostep-dark">
            Collection orthopédique</span>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Nos produits phares pour confort et posture</h2>
        </div>
        <a href="#delivery" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
          Voir la livraison</a>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="animate-pulse rounded-[32px] bg-slate-100 p-6"></div>
            ))
          : featured.map((product) => (
              <motion.article
                key={product.id}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-soft"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, 320px" className="object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{product.title}</h3>
                      <p className="mt-2 text-sm text-slate-500">{product.comfortLevel}</p>
                    </div>
                    <span className="rounded-2xl bg-orthostep-light px-3 py-1 text-sm font-semibold text-orthostep-dark">-{product.discount}%</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{product.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-700">
                    <span className="rounded-full bg-slate-100 px-3 py-1">Tailles {product.sizes[0]}–{product.sizes.at(-1)}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">Couleur {getColorName(product.colors[0])}</span>
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-2xl font-semibold text-slate-900">{product.price.toLocaleString("fr-FR")} DZD</p>
                      <p className="text-sm text-slate-500 line-through">{product.oldPrice.toLocaleString("fr-FR")} DZD</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      >
                        Voir détails
                      </button>
                      <a
                        href={buildWhatsAppLink(product, settings.whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-3xl bg-orthostep px-4 py-3 text-sm font-semibold text-white transition hover:bg-orthostep-dark"
                      >
                        Commander
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
      </div>
      <ProductModal product={selectedProduct} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
