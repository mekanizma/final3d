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
  ImagePlus,
  CheckCircle2,
  ScanLine,
  Box,
  Hash,
  MapPin,
  Ruler,
  MessageSquare,
  Layers,
  Printer,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { FormInput, FormTextarea } from "@/components/ui/FormField";
import { useAuthStore } from "@/store/authStore";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import { submitScanQuoteRequest } from "@/services/scanRequestService";
import {
  SCAN_LOCATIONS,
  SCAN_PURPOSES,
  SCAN_SURFACE_TYPES,
  type ScanLocationId,
  type ScanPurposeId,
  type ScanSurfaceId,
} from "@/lib/scanQuoteOptions";
import { cn } from "@/lib/utils";

const PHOTO_ACCEPT = ".jpg,.jpeg,.png,.webp,.heic";

const selectWrap =
  "flex w-full gap-3 rounded-xl border border-fuchsia-400/25 bg-white/[0.06] px-3.5 py-2.5 transition-all focus-within:border-cyan-400/50 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.12)]";
const selectClass =
  "flex-1 min-w-0 w-full bg-transparent border-0 outline-none text-[#faf5ff] text-sm cursor-pointer";

function FormSelect({
  icon: Icon,
  label,
  value,
  onChange,
  children,
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-violet-200/70 mb-2">
        {label}
      </label>
      <div className={selectWrap}>
        <Icon
          className="h-4 w-4 shrink-0 text-violet-300/80 self-center"
          strokeWidth={2}
          aria-hidden
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClass}
        >
          {children}
        </select>
      </div>
    </div>
  );
}

export function ScanQuoteForm() {
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    objectDescription: "",
    scanArea: "",
    quantity: "1",
    locationType: "studio" as ScanLocationId,
    locationAddress: "",
    city: "",
    purpose: "print" as ScanPurposeId,
    surfaceType: "standard" as ScanSurfaceId,
    wantsPrint: false,
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
    const photo = fd.get("referencePhoto") as File | null;
    if (form.locationType === "onsite" && !form.locationAddress.trim()) {
      alert("Saha taraması için adres bilgisi girin.");
      return;
    }
    if (!form.scanArea.trim()) {
      alert("Taranacak alan / yaklaşık boyut bilgisi girin.");
      return;
    }

    setLoading(true);
    try {
      await submitScanQuoteRequest({
        name: form.name,
        email: form.email,
        phone: form.phone,
        objectDescription: form.objectDescription,
        scanArea: form.scanArea,
        quantity: form.quantity,
        locationType: form.locationType,
        locationAddress: form.locationAddress,
        city: form.city,
        purpose: form.purpose,
        surfaceType: form.surfaceType,
        wantsPrint: form.wantsPrint,
        note: form.note,
        photoFileName: photo?.size ? photo.name : undefined,
        photoFileSize: photo?.size ? photo.size : undefined,
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
      <motion.div className="min-h-[60vh] flex items-center justify-center px-4">
        <GlassCard hover={false} className="max-w-md w-full p-10 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Tarama Talebiniz Alındı</h1>
          <p className="text-violet-200/70 text-sm mb-8 leading-relaxed">
            Nesne ve konum bilgileriniz incelenecek; tarama ve varsa baskı için
            fiyat teklifi e-posta veya telefon ile iletilecektir.
          </p>
          <div className="flex flex-col gap-3">
            <NeonButton onClick={() => router.push("/3d-tarama")}>
              3D Tarama Sayfası
            </NeonButton>
            <Link href="/">
              <NeonButton variant="ghost" className="w-full">
                Ana Sayfa
              </NeonButton>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <section id="tarama-teklif" className="pb-24 sm:pb-28 relative z-10 scroll-mt-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full badge-glow text-xs mb-4">
            <ScanLine className="w-3 h-3 text-cyan-300" />
            3D Tarama Teklifi
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="text-neon">Tarama</span> teklif formu
          </h1>
          <p className="text-violet-200/55 text-sm max-w-md mx-auto leading-relaxed">
            Taranacak nesne, boyut, konum ve adet bilgilerini paylaşın; size
            özel fiyat ve süre teklifi hazırlayalım.
          </p>
        </motion.div>

        <GlassCard hover={false} className="p-6 sm:p-8 border-cyan-400/15">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-violet-200/70 mb-2">
                Referans fotoğraf (önerilir)
              </label>
              <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-cyan-400/30 bg-cyan-500/5 hover:bg-cyan-500/10 cursor-pointer transition-colors">
                <ImagePlus className="w-10 h-10 text-cyan-400/80" />
                <span className="text-sm text-violet-200/70 text-center">
                  {photoName ?? "Nesnenin fotoğrafını yükleyin (JPG, PNG)"}
                </span>
                <span className="text-[10px] text-violet-300/45">
                  Birden fazla açıdan çekilmiş görsel teklifi hızlandırır
                </span>
                <input
                  type="file"
                  name="referencePhoto"
                  accept={PHOTO_ACCEPT}
                  className="sr-only"
                  onChange={(e) =>
                    setPhotoName(e.target.files?.[0]?.name ?? null)
                  }
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-violet-200/70 mb-2">
                Taranacak nesne / parça *
              </label>
              <FormTextarea
                icon={Box}
                placeholder="Örn: motor parçası, heykel, ayakkabı kalıbı, mimari maket…"
                required
                value={form.objectDescription}
                onChange={(e) =>
                  setForm({ ...form, objectDescription: e.target.value })
                }
              />
            </div>

            <FormInput
              icon={Ruler}
              placeholder="Taranacak alan / yaklaşık boyut * (örn. 25×15×10 cm)"
              required
              value={form.scanArea}
              onChange={(e) => setForm({ ...form, scanArea: e.target.value })}
            />

            <FormInput
              icon={Hash}
              type="number"
              min={1}
              placeholder="Adet (kaç nesne taranacak) *"
              required
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />

            <FormSelect
              icon={Layers}
              label="Tarama amacı *"
              value={form.purpose}
              onChange={(v) =>
                setForm({ ...form, purpose: v as ScanPurposeId })
              }
            >
              {SCAN_PURPOSES.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1a0a3a]">
                  {p.label}
                </option>
              ))}
            </FormSelect>

            <FormSelect
              icon={ScanLine}
              label="Yüzey tipi"
              value={form.surfaceType}
              onChange={(v) =>
                setForm({ ...form, surfaceType: v as ScanSurfaceId })
              }
            >
              {SCAN_SURFACE_TYPES.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1a0a3a]">
                  {s.label}
                </option>
              ))}
            </FormSelect>

            <FormSelect
              icon={MapPin}
              label="Tarama konumu *"
              value={form.locationType}
              onChange={(v) =>
                setForm({ ...form, locationType: v as ScanLocationId })
              }
            >
              {SCAN_LOCATIONS.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#1a0a3a]">
                  {l.label}
                </option>
              ))}
            </FormSelect>

            {form.locationType === "onsite" && (
              <FormInput
                icon={MapPin}
                placeholder="Saha tarama adresi *"
                required
                value={form.locationAddress}
                onChange={(e) =>
                  setForm({ ...form, locationAddress: e.target.value })
                }
              />
            )}

            <FormInput
              icon={MapPin}
              placeholder="Şehir / bölge (örn. Lefkoşa, Girne)"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />

            <label
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors",
                form.wantsPrint
                  ? "border-fuchsia-400/40 bg-fuchsia-500/10"
                  : "border-white/10 glass"
              )}
            >
              <input
                type="checkbox"
                checked={form.wantsPrint}
                onChange={(e) =>
                  setForm({ ...form, wantsPrint: e.target.checked })
                }
                className="mt-1 rounded border-white/20"
              />
              <span className="text-sm text-violet-200/80 leading-relaxed">
                <Printer className="w-4 h-4 inline mr-1.5 text-cyan-300 -mt-0.5" />
                Tarama sonrası <strong className="text-white/90">3D baskı</strong>{" "}
                da istiyorum (tek teklifte tarama + üretim)
              </span>
            </label>

            <p className="text-xs font-medium text-violet-200/60 pt-2 border-t border-white/10">
              İletişim bilgileri
            </p>

            <FormInput
              icon={User}
              placeholder="Ad Soyad *"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <FormInput
              icon={Mail}
              type="email"
              placeholder="E-posta *"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <FormInput
              icon={Phone}
              type="tel"
              placeholder="Telefon *"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <FormTextarea
              icon={MessageSquare}
              placeholder="Ek notlar (teslim süresi, hassasiyet, özel istekler…)"
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
              {loading ? "Gönderiliyor..." : "Tarama Teklifi Gönder"}
            </NeonButton>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-violet-300/45 mt-6">
          <Link href="/3d-tarama" className="text-cyan-300/80 hover:text-cyan-200">
            ← 3D tarama hizmetine dön
          </Link>
        </p>
      </div>
    </section>
  );
}
