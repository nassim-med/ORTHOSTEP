"use client";

import useStoreSettings from "../lib/use-store-settings";
import { getWhatsAppLink, safeUrl } from "../lib/store-settings";
import { Facebook, Instagram, Music2 } from "lucide-react";

export default function Footer() {
  const settings = useStoreSettings();
  const instagram = safeUrl(settings.instagram);
  const facebook = safeUrl(settings.facebook);
  const tiktok = safeUrl(settings.tiktok);

  return (
    <footer className="bg-slate-950 text-slate-100">
      <div className="section-container grid gap-10 py-16 md:grid-cols-3">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-orthostep-light/80">ORTHOSTEP</p>
          <h3 className="text-2xl font-semibold text-white">Soutien médical durable</h3>
          <p className="max-w-md leading-7 text-slate-300">Chaussures et semelles orthopédiques conçues pour soulager la douleur, corriger la posture et donner confiance à chaque pas.</p>
        </div>
        <div className="grid gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Contact</p>
            <p className="mt-3 text-sm text-slate-300">
              <a href={getWhatsAppLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp: {settings.whatsapp}</a>
            </p>
            <p className="mt-1 text-sm text-slate-300">Email: {settings.support_email || "support@orthostep.dz"}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Réseaux sociaux</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-200">
              {instagram ? <a href={instagram} target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 transition hover:text-white" aria-label="Instagram"><Instagram size={16} /></a> : null}
              {facebook ? <a href={facebook} target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 transition hover:text-white" aria-label="Facebook"><Facebook size={16} /></a> : null}
              {tiktok ? <a href={tiktok} target="_blank" rel="noreferrer" className="rounded-full border border-slate-700 p-2 transition hover:text-white" aria-label="TikTok"><Music2 size={16} /></a> : null}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Localisation</p>
          <div className="rounded-3xl bg-slate-900 p-5 text-sm text-slate-300 shadow-soft">
            <p>Alger, Algérie</p>
            <p className="mt-2">{settings.location || "Alger, Algerie"}</p>
            <p>{settings.opening_hours || "09:00 - 19:00"}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © 2026 ORTHOSTEP. Tous droits réservés.
      </div>
    </footer>
  );
}
