"use client";

import { useState } from "react";
import { Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { AuthCard, AuthLink } from "@/components/auth/AuthCard";
import { FormInput, FormTextarea } from "@/components/ui/FormField";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAuthStore } from "@/store/authStore";
import { useIntl } from "@/components/i18n/IntlProvider";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";

export default function RegisterPage() {
  const { t } = useIntl();
  const { push } = useLocaleRouter();
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.passwordConfirm) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
      });
      push("/hesabim");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <AuthCard
      title={
        <>
          <span className="text-neon">{t("auth.registerTitle")}</span>{" "}
          {t("auth.registerTitleNeon")}
        </>
      }
      subtitle={t("auth.registerSubtitle")}
      footer={
        <>
          {t("auth.hasAccount")}{" "}
          <AuthLink href="/giris">{t("auth.loginLink")}</AuthLink>
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
          icon={User}
          placeholder={t("auth.namePh")}
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
          icon={Phone}
          type="tel"
          placeholder={t("auth.phonePh")}
          required
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <FormTextarea
          icon={MapPin}
          placeholder={t("auth.addressPh")}
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <FormInput
          icon={Lock}
          type="password"
          placeholder={t("auth.passwordMin")}
          required
          minLength={6}
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <FormInput
          icon={Lock}
          type="password"
          placeholder={t("auth.passwordConfirmPh")}
          required
          autoComplete="new-password"
          value={form.passwordConfirm}
          onChange={(e) =>
            setForm({ ...form, passwordConfirm: e.target.value })
          }
        />
        <NeonButton type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? t("auth.registering") : t("auth.submitRegister")}
        </NeonButton>
      </form>
    </AuthCard>
  );
}
