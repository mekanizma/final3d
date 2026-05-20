"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { AuthCard, AuthLink } from "@/components/auth/AuthCard";
import { FormInput, FormTextarea } from "@/components/ui/FormField";
import { NeonButton } from "@/components/ui/NeonButton";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
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
      setError("Şifreler eşleşmiyor.");
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
      router.push("/hesabim");
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <AuthCard
      title={
        <>
          <span className="text-neon">Kayıt</span> Ol
        </>
      }
      subtitle="KKTC'ye 3D baskı siparişi vermek için ücretsiz hesap oluşturun"
      footer={
        <>
          Zaten hesabınız var mı? <AuthLink href="/giris">Giriş yapın</AuthLink>
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
          placeholder="Ad Soyad"
          required
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <FormInput
          icon={Mail}
          type="email"
          placeholder="E-posta"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <FormInput
          icon={Phone}
          type="tel"
          placeholder="Telefon"
          required
          autoComplete="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <FormTextarea
          icon={MapPin}
          placeholder="Varsayılan teslimat adresi (KKTC)"
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <FormInput
          icon={Lock}
          type="password"
          placeholder="Şifre (min. 6 karakter)"
          required
          minLength={6}
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <FormInput
          icon={Lock}
          type="password"
          placeholder="Şifre tekrar"
          required
          autoComplete="new-password"
          value={form.passwordConfirm}
          onChange={(e) =>
            setForm({ ...form, passwordConfirm: e.target.value })
          }
        />
        <NeonButton type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Kayıt oluşturuluyor..." : "Hesap Oluştur"}
        </NeonButton>
      </form>
    </AuthCard>
  );
}
