"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { SiteLogo } from "@/components/brand/SiteLogo";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { FormInput } from "@/components/ui/FormField";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useIntl();
  const nextPath = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? t("adminLogin.fail"));
        return;
      }
      const safeNext =
        nextPath.startsWith("/admin") && !nextPath.startsWith("/admin/giris")
          ? nextPath
          : "/admin";
      router.replace(safeNext);
      router.refresh();
    } catch {
      setError(t("adminLogin.network"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <LocaleLink
        href="/"
        className="inline-flex items-center gap-2 text-sm text-violet-300/70 hover:text-cyan-200 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("adminLogin.backShop")}
      </LocaleLink>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <SiteLogo size="xl" />
        </div>

        <GlassCard hover={false} className="p-8 border-fuchsia-400/20">
          <h1 className="text-xl font-bold text-center mb-1">{t("adminLogin.title")}</h1>
          <p className="text-sm text-violet-200/55 text-center mb-6">
            {t("adminLogin.subtitle")}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-violet-200/70 mb-1.5">
                {t("adminLogin.emailLabel")}
              </label>
              <FormInput
                icon={Mail}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@sirket.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-violet-200/70 mb-1.5">
                {t("adminLogin.passwordLabel")}
              </label>
              <FormInput
                icon={Lock}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/25 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <NeonButton type="submit" disabled={loading} className="w-full">
              {loading ? t("adminLogin.submitting") : t("adminLogin.submit")}
            </NeonButton>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-fuchsia-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
