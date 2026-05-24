"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../lib/supabase-browser";
import { LogOut } from "lucide-react";
import { adminTranslations } from "../../lib/i18n";
import { clearAdminSessionCookie } from "../../lib/admin-session";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
}

const ADMIN_LANGUAGE_KEY = "orthostep-admin-language";

export default function AdminShell({ children, title }: AdminShellProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"fr" | "ar">("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const saved = window.localStorage.getItem(ADMIN_LANGUAGE_KEY);
    if (saved === "fr" || saved === "ar") {
      setLang(saved);
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(ADMIN_LANGUAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, mounted]);

  useEffect(() => {
    const verify = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!data?.session) {
        clearAdminSessionCookie();
        router.replace("/admin/login");
        return;
      }
      setLoading(false);
    };
    verify();
  }, [router]);

  const labels = adminTranslations[lang];

  const navItems = useMemo(
    () => [
      { href: "/admin/dashboard", label: labels.dashboard },
      { href: "/admin/setup", label: labels.setup },
      { href: "/admin/products", label: labels.products },
      { href: "/admin/delivery", label: labels.delivery },
      { href: "/admin/orders", label: labels.orders },
      { href: "/admin/settings", label: labels.settings }
    ],
    [labels]
  );

  const handleLogout = async () => {
    await supabaseBrowser.auth.signOut();
    clearAdminSessionCookie();
    router.replace("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        <div className="rounded-3xl bg-white p-10 shadow-soft">Chargement du panneau admin…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900" dir={lang === "ar" ? "rtl" : "ltr"}>
      <header className="border-b border-slate-200 bg-white py-4 shadow-sm">
        <div className="section-container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-orthostep-dark/80">ORTHOSTEP Admin</p>
            <h1 className="text-3xl font-semibold">{title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900">
              <button type="button" onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="transition hover:text-orthostep-dark">
                {lang === "fr" ? "العربية" : "Français"}
              </button>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <LogOut size={16} /> {labels.logout}
            </button>
          </div>
        </div>
        <nav className="section-container mt-4 flex flex-wrap gap-3">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      <main className="section-container py-10">{children}</main>
    </div>
  );
}
