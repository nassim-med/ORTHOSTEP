"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../../lib/supabase-browser";
import { setAdminSessionCookie } from "../../../lib/admin-session";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const syncSession = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (data?.session) {
        setAdminSessionCookie();
        router.replace("/admin/dashboard");
      }
    };

    syncSession();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setAdminSessionCookie();
    router.replace("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-xl rounded-[32px] bg-white p-10 shadow-soft">
        <p className="text-sm uppercase tracking-[0.3em] text-orthostep-dark/80">Espace Admin</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Connexion ORTHOSTEP</h1>
        <p className="mt-3 text-slate-600">Connectez-vous avec votre email professionnel pour accéder au tableau de bord.</p>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <label className="block text-sm font-semibold text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orthostep focus:ring-2 focus:ring-orthostep/20"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orthostep focus:ring-2 focus:ring-orthostep/20"
            />
          </label>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-full bg-orthostep px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-orthostep-dark"
            disabled={loading}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
