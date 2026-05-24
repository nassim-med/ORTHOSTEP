import type { StoreSettings } from "../types/product";

export const SETTINGS_STORAGE_KEY = "orthostep-settings-updated";
export const SETTINGS_EVENT = "orthostep-settings";

export const defaultStoreSettings: StoreSettings = {
  store_name: "ORTHOSTEP",
  logo: "",
  whatsapp: "+213556800701",
  facebook: "",
  instagram: "",
  tiktok: "",
  telegram: "",
  location: "Alger, Algerie",
  description: "Chaussures orthopediques et semelles pour le confort quotidien.",
  support_email: "support@orthostep.dz",
  opening_hours: "09:00 - 19:00",
  updated_at: ""
};

export function sanitizePhone(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function getWhatsAppLink(whatsapp: string, message?: string) {
  const value = (whatsapp || "").trim();

  if (/^https?:\/\//i.test(value)) {
    if (!message) return value;
    const separator = value.includes("?") ? "&" : "?";
    return `${value}${separator}text=${encodeURIComponent(message)}`;
  }

  const phone = sanitizePhone(value || defaultStoreSettings.whatsapp);
  const base = `https://wa.me/${phone || "213556800701"}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function safeUrl(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}
