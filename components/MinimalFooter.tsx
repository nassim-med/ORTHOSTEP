"use client";

import useStoreSettings from "../lib/use-store-settings";
import { getWhatsAppLink, safeUrl } from "../lib/store-settings";
import { Facebook, Instagram, Music2 } from "lucide-react";

interface MinimalFooterProps {
  language: "fr" | "ar";
}

export default function MinimalFooter({ language }: MinimalFooterProps) {
  const isArabic = language === "ar";
  const settings = useStoreSettings();
  const facebook = safeUrl(settings.facebook);
  const instagram = safeUrl(settings.instagram);
  const tiktok = safeUrl(settings.tiktok);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-6 px-4 sm:py-8">
      <div className="section-container text-center">
        <p className="text-sm font-semibold text-slate-900">ORTHOSTEP</p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <a
            href={getWhatsAppLink(settings.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:text-orthostep"
            aria-label="WhatsApp"
          >
            <span className="text-xs font-semibold">WA</span>
          </a>
          {instagram ? (
            <a href={instagram} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:text-orthostep" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          ) : null}
          {facebook ? (
            <a href={facebook} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:text-orthostep" aria-label="Facebook">
              <Facebook size={16} />
            </a>
          ) : null}
          {tiktok ? (
            <a href={tiktok} target="_blank" rel="noreferrer" className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:text-orthostep" aria-label="TikTok">
              <Music2 size={16} />
            </a>
          ) : null}
        </div>
        <p className="mt-4 text-xs text-slate-500">
          {isArabic ? "ORTHOSTEP جميع الحقوق محفوظة" : "ORTHOSTEP. Tous droits reserves"}
        </p>
      </div>
    </footer>
  );
}
