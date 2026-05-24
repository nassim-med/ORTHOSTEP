"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Trash2, Copy, Upload, Star } from "lucide-react";
import { supabaseBrowser } from "../../lib/supabase-browser";
import type { Product } from "../../types/product";

interface ProductManagerProps {
  initial: Product[];
}

const defaultProduct: Omit<Product, "id"> = {
  title: "",
  titleFR: "",
  titleAR: "",
  description: "",
  descriptionFR: "",
  descriptionAR: "",
  price: 0,
  oldPrice: 0,
  discount: 0,
  category: "Chaussures",
  comfortLevel: "",
  recommendedUse: "",
  stock: 0,
  featured: false,
  badge: "",
  sizes: [],
  customSizes: [],
  colors: [],
  images: []
};

export default function ProductManager({ initial }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState<Omit<Product, "id">>(defaultProduct);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const term = query.toLowerCase();
      return product.title.toLowerCase().includes(term) || (product.titleFR ?? "").toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
    });
  }, [products, query]);

  useEffect(() => {
    setProducts(initial);
  }, [initial]);

  const openForm = (product?: Product) => {
    if (product) {
      setActiveProduct(product);
      setFormState({ ...product });
    } else {
      setActiveProduct(null);
      setFormState(defaultProduct);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setActiveProduct(null);
    setFormState(defaultProduct);
  };

  const uploadImages = async (files: FileList) => {
    const uploadedUrls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `products/${Date.now()}-${file.name}`;
      const { data, error } = await supabaseBrowser.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) continue;
      const { data: publicData } = supabaseBrowser.storage.from("product-images").getPublicUrl(path);
      if (publicData?.publicUrl) uploadedUrls.push(publicData.publicUrl);
    }
    setFormState((state) => ({ ...state, images: [...state.images, ...uploadedUrls] }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return;
    const next = [...formState.images];
    const [moved] = next.splice(draggedIndex, 1);
    next.splice(index, 0, moved);
    setFormState((state) => ({ ...state, images: next }));
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    setLoading(true);
    const payload = { ...formState, sizes: formState.sizes.filter(Boolean), colors: formState.colors };
    const endpoint = activeProduct ? `/api/admin/products?id=${activeProduct.id}` : "/api/admin/products";
    const method = activeProduct ? "PUT" : "POST";
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) return;
    const updatedList = activeProduct ? products.map((item) => (item.id === data.id ? data : item)) : [data, ...products];
    setProducts(updatedList);
    closeForm();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setProducts(products.filter((product) => product.id !== id));
  };

  const duplicateProduct = async (product: Product) => {
    const response = await fetch(`/api/admin/products?duplicate=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, title: product.title + " (Copie)" })
    });
    const data = await response.json();
    if (!response.ok) return;
    setProducts([data, ...products]);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Gestion des produits</h2>
          <p className="text-sm text-slate-600">Créez, éditez, supprimez ou dupliquez vos offres orthopédiques en quelques clics.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative block">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher produits"
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-700 shadow-sm outline-none focus:border-orthostep"
            />
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </label>
          <button
            type="button"
            onClick={() => openForm()}
            className="inline-flex items-center gap-2 rounded-full bg-orthostep px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orthostep-dark"
          >
            <Plus size={16} /> Ajouter un produit
          </button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((product) => (
          <article key={product.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{product.titleFR || product.title}</p>
                <p className="mt-2 text-sm text-slate-500">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold text-slate-900">{product.price.toLocaleString("fr-FR")} DZD</p>
                <p className="text-sm text-slate-500 line-through">{product.oldPrice.toLocaleString("fr-FR")} DZD</p>
              </div>
            </div>
            <div className="mt-4 text-sm leading-6 text-slate-600">{product.descriptionFR || product.description}</div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-700">
              {product.badge ? <span className="rounded-full bg-orthostep-light px-3 py-1 text-orthostep-dark">{product.badge}</span> : null}
              {product.featured ? <span className="rounded-full bg-slate-100 px-3 py-1">Mis en avant</span> : null}
              <span className="rounded-full bg-slate-100 px-3 py-1">Stock {product.stock}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => openForm(product)} className="rounded-3xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">Modifier</button>
              <button type="button" onClick={() => duplicateProduct(product)} className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"><Copy size={16} /> Dupliquer</button>
              <button type="button" onClick={() => deleteProduct(product.id)} className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">Supprimer</button>
            </div>
          </article>
        ))}
      </div>

      {showForm ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold">{activeProduct ? "Modifier le produit" : "Nouveau produit"}</h3>
              <p className="text-sm text-slate-500">Remplissez les détails pour mettre à jour votre catalogue orthopédique.</p>
            </div>
            <button type="button" onClick={closeForm} className="text-sm font-semibold text-slate-600 hover:text-slate-900">Annuler</button>
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              Titre FR
              <input value={formState.titleFR} onChange={(event) => setFormState({ ...formState, titleFR: event.target.value })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Titre AR
              <input value={formState.titleAR} onChange={(event) => setFormState({ ...formState, titleAR: event.target.value })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700 xl:col-span-2">
              Description FR
              <textarea value={formState.descriptionFR} onChange={(event) => setFormState({ ...formState, descriptionFR: event.target.value })} className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700 xl:col-span-2">
              Description AR
              <textarea value={formState.descriptionAR} onChange={(event) => setFormState({ ...formState, descriptionAR: event.target.value })} className="min-h-[120px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Prix DZD
              <input type="number" value={formState.price} onChange={(event) => setFormState({ ...formState, price: Number(event.target.value) })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Ancien prix DZD
              <input type="number" value={formState.oldPrice} onChange={(event) => setFormState({ ...formState, oldPrice: Number(event.target.value) })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Remise %
              <input type="number" value={formState.discount} onChange={(event) => setFormState({ ...formState, discount: Number(event.target.value) })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Catégorie
              <input value={formState.category} onChange={(event) => setFormState({ ...formState, category: event.target.value })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Confort
              <input value={formState.comfortLevel} onChange={(event) => setFormState({ ...formState, comfortLevel: event.target.value })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Utilisation recommandée
              <input value={formState.recommendedUse} onChange={(event) => setFormState({ ...formState, recommendedUse: event.target.value })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              Stock
              <input type="number" value={formState.stock} onChange={(event) => setFormState({ ...formState, stock: Number(event.target.value) })} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orthostep" />
            </label>
            <div className="space-y-2 text-sm text-slate-700">
              <span className="block">Options</span>
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  <input type="checkbox" checked={formState.featured} onChange={(event) => setFormState({ ...formState, featured: event.target.checked })} />
                  Mis en avant
                </label>
                <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                  <span>Badge</span>
                  <input value={formState.badge ?? ""} onChange={(event) => setFormState({ ...formState, badge: event.target.value })} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm outline-none" placeholder="Ex: Best seller" />
                </label>
              </div>
            </div>
            <div className="xl:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Tailles disponibles</p>
                    <button type="button" onClick={() => setFormState({ ...formState, sizes: [...formState.sizes, 35] })} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">Ajouter</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formState.sizes.map((size, index) => (
                      <div key={`${size}-${index}`} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                        <span>{size}</span>
                        <button type="button" onClick={() => setFormState({ ...formState, sizes: formState.sizes.filter((_, i) => i !== index) })} className="text-rose-600">×</button>
                      </div>
                    ))}
                  </div>
                  <input type="text" placeholder="Ajouter taille personnalisée" onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    event.preventDefault();
                    const value = Number((event.target as HTMLInputElement).value);
                    if (value) {
                      setFormState({ ...formState, sizes: [...formState.sizes, value] });
                      (event.target as HTMLInputElement).value = "";
                    }
                  }} className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 outline-none" />
                </div>
                <div className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">Couleurs</p>
                    <button type="button" onClick={() => setFormState({ ...formState, colors: [...formState.colors, { name: "", hex: "#000000" }] })} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">Ajouter</button>
                  </div>
                  <div className="space-y-3">
                    {formState.colors.map((color, index) => {
                      const colorValue = typeof color === "string" ? { name: color, hex: "#000000" } : color;

                      return (
                        <div key={index} className="grid items-center gap-3 rounded-3xl bg-white p-3 shadow-sm sm:grid-cols-[1fr_auto_1fr_auto]">
                          <input type="text" value={colorValue.name} onChange={(event) => {
                            const next = [...formState.colors];
                            const current = next[index];
                            const base = typeof current === "string" ? { name: current, hex: "#000000" } : current;
                            next[index] = { ...base, name: event.target.value };
                            setFormState({ ...formState, colors: next });
                          }} placeholder="Nom" className="min-w-[120px] rounded-full border border-slate-200 bg-slate-50 px-3 py-2 outline-none" />
                          <input type="color" value={colorValue.hex || "#000000"} onChange={(event) => {
                            const next = [...formState.colors];
                            const current = next[index];
                            const base = typeof current === "string" ? { name: current, hex: "#000000" } : current;
                            next[index] = { ...base, hex: event.target.value };
                            setFormState({ ...formState, colors: next });
                          }} className="h-11 w-11 rounded-full border border-slate-200 bg-white" />
                          <select
                            value={colorValue.imageUrl || ""}
                            onChange={(event) => {
                              const next = [...formState.colors];
                              const current = next[index];
                              const base = typeof current === "string" ? { name: current, hex: "#000000" } : current;
                              next[index] = { ...base, imageUrl: event.target.value || undefined };
                              setFormState({ ...formState, colors: next });
                            }}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
                          >
                            <option value="">Image couleur</option>
                            {formState.images.map((image, imageIndex) => (
                              <option key={`${index}-${imageIndex}`} value={image}>Image {imageIndex + 1}</option>
                            ))}
                          </select>
                          <button type="button" onClick={() => setFormState({ ...formState, colors: formState.colors.filter((_, i) => i !== index) })} className="text-rose-600">Supprimer</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-2">
              <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Images du produit</p>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                    <Upload size={16} /> Importer
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(event) => event.target.files && uploadImages(event.target.files)} />
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {formState.images.map((src, index) => (
                    <div key={`${src}-${index}`} draggable onDragStart={() => handleDragStart(index)} onDrop={() => handleDrop(index)} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
                      <img src={src} alt={`Produit ${index + 1}`} className="h-40 w-full object-cover" />
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button type="button" onClick={() => setFormState({ ...formState, images: formState.images.filter((_, i) => i !== index) })} className="rounded-full bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600">Supprimer</button>
                        <button type="button" onClick={() => setFormState({ ...formState, images: [src, ...formState.images.filter((_, i) => i !== index)] })} className="rounded-full bg-orthostep-light px-3 py-2 text-sm font-semibold text-orthostep-dark"><Star size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <button type="button" disabled={loading} onClick={handleSave} className="inline-flex items-center justify-center rounded-full bg-orthostep px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-orthostep-dark">
              {loading ? "Enregistrement…" : "Enregistrer le produit"}
            </button>
            <button type="button" onClick={closeForm} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Annuler
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
