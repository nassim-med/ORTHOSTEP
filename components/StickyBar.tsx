"use client";

import { motion } from "framer-motion";
import { getWhatsAppLink } from "../lib/store-settings";

interface StickyBarProps {
  language: "fr" | "ar";
  whatsapp: string;
  onOrderClick: () => void;
}

export default function StickyBar({ language, whatsapp, onOrderClick }: StickyBarProps) {
  const isArabic = language === "ar";

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 bg-orthostep px-4 py-3 text-white shadow-2xl md:hidden"
    >
      <div>
        <p className="text-sm font-semibold">ORTHOSTEP</p>
        <p className="text-xs opacity-90">{isArabic ? "اطلب الآن عبر واتساب" : "Commandez maintenant sur WhatsApp"}</p>
      </div>
      <a
        href={getWhatsAppLink(whatsapp, isArabic ? "مرحبا ORTHOSTEP، اريد الطلب" : "Bonjour ORTHOSTEP, je souhaite commander")}
        target="_blank"
        rel="noreferrer"
        onClick={onOrderClick}
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-orthostep transition hover:bg-slate-100"
      >
        {isArabic ? "اطلب الآن" : "Commander"}
      </a>
    </motion.div>
  );
}
