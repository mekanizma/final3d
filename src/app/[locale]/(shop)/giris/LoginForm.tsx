"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { AuthCard, AuthLink } from "@/components/auth/AuthCard";
import { FormInput } from "@/components/ui/FormField";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAuthStore } from "@/store/authStore";
import { useIntl } from "@/components/i18n/IntlProvider";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";

export function LoginForm() {
  const { push } = useLocaleRouter();
  const { t } = useIntl();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("return") || "/hesabim";
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(form);
      const path = returnTo.startsWith("/") ? returnTo : "/hesabim";
      push(path);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <AuthCard
      title={
        <>
          {t("auth.loginTitle")}{" "}
          <span className="text-neon">{t("auth.loginTitleNeon")}</span>
        </>
      }
      subtitle={t("auth.loginSubtitle")}
      footer={
        <>
          {t("auth.noAccount")}{" "}
          <AuthLink href="/kayit-ol">{t("auth.registerLink")}</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        <FormInput
          icon={Mail}
          type="email"
          placeholder={t("auth.emailPh")}
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <FormInput
          icon={Lock}
          type="password"
          placeholder={t("auth.passwordPh")}
          required
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <NeonButton type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? t("auth.loggingIn") : t("auth.submitLogin")}
        </NeonButton>
      </form>
    </AuthCard>
  );
}
