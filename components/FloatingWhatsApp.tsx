"use client";

import { motion } from "framer-motion";
import useStoreSettings from "../lib/use-store-settings";
import { getWhatsAppLink } from "../lib/store-settings";

export default function FloatingWhatsApp() {
  const settings = useStoreSettings();

  return (
    <motion.a
      href={getWhatsAppLink(settings.whatsapp, "Bonjour ORTHOSTEP, je souhaite commander")}
      target="_blank"
      rel="noreferrer"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed right-4 bottom-24 z-50 hidden items-center gap-3 rounded-full bg-orthostep px-4 py-3 text-white shadow-2xl hover:bg-orthostep-dark md:flex"
    >
      <span className="text-lg">💬</span>
      <span className="font-semibold">WhatsApp</span>
    </motion.a>
  );
}
