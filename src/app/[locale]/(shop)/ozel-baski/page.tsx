"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload,
  User,
  Mail,
  Phone,
  FileUp,
  CheckCircle2,
  Palette,
  Hash,
  MessageSquare,
} from "lucide-react";
import { CustomPrintSection } from "@/components/home/CustomPrintSection";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { FormInput, FormTextarea } from "@/components/ui/FormField";
import { useAuthStore } from "@/store/authStore";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import { submitCustomPrintRequest } from "@/services/customPrintService";
import { PRINT_MATERIALS, type PrintMaterialId } from "@/lib/printMaterials";

const ACCEPTED = ".stl,.obj,.3mf,.zip";

export default function CustomPrintPage() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    material: "pla" as PrintMaterialId,
    color: "",
    quantity: "1",
    note: "",
  });

  useEffect(() => {
    if (!hydrated || !user) return;
    setForm((f) => ({
      ...f,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));
  }, [hydrated, user]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("modelFile") as File | null;
    if (!file?.size) {
      alert("Lütfen bir 3D dosyası seçin.");
      return;
    }
    setLoading(true);
    try {
      await submitCustomPrintRequest({
        name: form.name,
        email: form.email,
        phone: form.phone,
        material: form.material,
        color: form.color,
        quantity: form.quantity,
        note: form.note,
        fileName: file.name,
        fileSize: file.size,
        userId: user?.id,
      });
      setDone(true);
    } catch {
      alert("Talep gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <motion.div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
        <GlassCard hover={false} className="max-w-md w-full p-10 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Talebiniz Alındı</h1>
          <p className="text-violet-200/70 text-sm mb-8">
            Dosyanız incelenecek; fiyat ve süre teklifi e-posta ile
            iletilecektir.
          </p>
          <div className="flex flex-col gap-3">
            <NeonButton onClick={() => router.push("/")}>
              Ana Sayfaya Dön
            </NeonButton>
            <Link href="/hesabim">
              <NeonButton variant="ghost" className="w-full">
                Hesabım
              </NeonButton>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <>
      <CustomPrintSection onPage />
      <section id="talep-form" className="pb-24 sm:pb-28 relative z-10 scroll-mt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-xl font-bold mb-2">
              <span className="text-neon">Teklif</span> formu
            </h2>
            <p className="text-violet-200/55 text-sm">
              Model dosyanızı ve tercihlerinizi gönderin; ekibimiz size dönüş
              yapsın.
            </p>
          </motion.div>

          <GlassCard hover={false} className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-violet-200/70 mb-2">
                  3D Dosya (STL, OBJ, 3MF)
                </label>
                <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-fuchsia-400/30 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 cursor-pointer transition-colors">
                  <FileUp className="w-10 h-10 text-cyan-400/80" />
                  <span className="text-sm text-violet-200/70 text-center">
                    {fileName ?? "Dosyayı sürükleyin veya tıklayın"}
                  </span>
                  <input
                    type="file"
                    name="modelFile"
                    accept={ACCEPTED}
                    required
                    className="sr-only"
                    onChange={(e) =>
                      setFileName(e.target.files?.[0]?.name ?? null)
                    }
                  />
                </label>
              </div>

              <FormInput
                icon={User}
                placeholder="Ad Soyad"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <FormInput
                icon={Mail}
                type="email"
                placeholder="E-posta"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <FormInput
                icon={Phone}
                type="tel"
                placeholder="Telefon"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <div>
                <label className="block text-xs font-medium text-violet-200/70 mb-2">
                  Filament malzemesi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRINT_MATERIALS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      title={t.hint}
                      onClick={() => setForm({ ...form, material: t.id })}
                      className={`py-3 px-2 rounded-xl text-left border transition-all ${
                        form.material === t.id
                          ? "bg-gradient-to-r from-fuchsia-500/30 to-violet-600/30 border-fuchsia-400/50 text-white"
                          : "glass border-white/10 hover:border-white/20"
                      }`}
                    >
                      <span className="block text-sm font-semibold text-white/95">
                        {t.label}
                      </span>
                      <span className="block text-[10px] text-violet-300/55 mt-0.5">
                        {t.hint}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <FormInput
                icon={Palette}
                placeholder="Renk tercihi (ör. siyah, beyaz)"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
              <FormInput
                icon={Hash}
                type="number"
                min={1}
                placeholder="Adet"
                required
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
              <FormTextarea
                icon={MessageSquare}
                placeholder="Ek notlar (boyut, kalite, teslim süresi…)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />

              <NeonButton
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                <Upload className="w-4 h-4" />
                {loading ? "Gönderiliyor..." : "Teklif Talebi Gönder"}
              </NeonButton>
            </form>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
