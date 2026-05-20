"use client";

import { useEffect, useState } from "react";
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
import { buildScanQuoteWhatsAppMessage } from "@/lib/whatsapp/messages/scanQuote";
import {
  buildWhatsAppUrl,
  openWhatsAppWithMessage,
} from "@/lib/whatsapp/openWhatsApp";
import {
  SCAN_LOCATIONS,
  SCAN_PURPOSES,
  SCAN_SURFACE_TYPES,
  type ScanLocationId,
  type ScanPurposeId,
  type ScanSurfaceId,
} from "@/lib/scanQuoteOptions";
import { cn } from "@/lib/utils";
import { useIntl } from "@/components/i18n/IntlProvider";
import { LocaleLink } from "@/components/i18n/LocaleLink";

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
  const { t } = useIntl();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
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
      alert(t("scanForm.alertAddress"));
      return;
    }
    if (!form.scanArea.trim()) {
      alert(t("scanForm.alertScanArea"));
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
      const message = buildScanQuoteWhatsAppMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        objectDescription: form.objectDescription,
        scanArea: form.scanArea,
        quantity: form.quantity,
        locationType: form.locationType,
        locationLabel: t(`scanLocation.${form.locationType}`),
        locationAddress: form.locationAddress,
        city: form.city,
        purpose: form.purpose,
        purposeLabel: t(`scanPurpose.${form.purpose}`),
        surfaceType: form.surfaceType,
        surfaceLabel: t(`scanSurface.${form.surfaceType}`),
        wantsPrint: form.wantsPrint,
        note: form.note,
        photoFileName: photo?.size ? photo.name : undefined,
        photoFileSize: photo?.size ? photo.size : undefined,
      });
      setWaUrl(buildWhatsAppUrl(message));
      openWhatsAppWithMessage(message);
      setDone(true);
    } catch {
      alert(t("scanForm.fail"));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <motion.div className="min-h-[60vh] flex items-center justify-center px-4">
        <GlassCard hover={false} className="max-w-md w-full p-10 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t("scanForm.successTitle")}</h1>
          <p className="text-violet-200/70 text-sm mb-4 leading-relaxed">
            {t("scanForm.successBodyWhatsApp")}
          </p>
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-8"
            >
              <NeonButton type="button" variant="ghost">
                {t("scanForm.openWhatsApp")}
              </NeonButton>
            </a>
          )}
          {!waUrl && <div className="mb-8" />}
          <div className="flex flex-col gap-3">
            <NeonButton onClick={() => router.push("/3d-tarama")}>
              {t("scanForm.scanPageBtn")}
            </NeonButton>
            <LocaleLink href="/">
              <NeonButton variant="ghost" className="w-full">
                {t("scanForm.homeBtn")}
              </NeonButton>
            </LocaleLink>
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
            {t("scanForm.badge")}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            <span className="text-neon">{t("scanForm.title")}</span>{" "}
            {t("scanForm.titleNeon")}
          </h1>
          <p className="text-violet-200/55 text-sm max-w-md mx-auto leading-relaxed">
            {t("scanForm.subtitle")}
          </p>
        </motion.div>

        <GlassCard hover={false} className="p-6 sm:p-8 border-cyan-400/15">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-violet-200/70 mb-2">
                {t("scanForm.photoLabel")}
              </label>
              <label className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-cyan-400/30 bg-cyan-500/5 hover:bg-cyan-500/10 cursor-pointer transition-colors">
                <ImagePlus className="w-10 h-10 text-cyan-400/80" />
                <span className="text-sm text-violet-200/70 text-center">
                  {photoName ?? t("scanForm.photoDrop")}
                </span>
                <span className="text-[10px] text-violet-300/45">
                  {t("scanForm.photoHint")} ({t("scanForm.photoFormats")})
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
                {t("scanForm.objectPh")} *
              </label>
              <FormTextarea
                icon={Box}
                placeholder={t("scanForm.objectExample")}
                required
                value={form.objectDescription}
                onChange={(e) =>
                  setForm({ ...form, objectDescription: e.target.value })
                }
              />
            </div>

            <FormInput
              icon={Ruler}
              placeholder={t("scanForm.scanAreaPh")}
              required
              value={form.scanArea}
              onChange={(e) => setForm({ ...form, scanArea: e.target.value })}
            />

            <FormInput
              icon={Hash}
              type="number"
              min={1}
              placeholder={t("scanForm.qtyPh")}
              required
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />

            <FormSelect
              icon={Layers}
              label={`${t("scanForm.purposeLabel")} *`}
              value={form.purpose}
              onChange={(v) =>
                setForm({ ...form, purpose: v as ScanPurposeId })
              }
            >
              {SCAN_PURPOSES.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1a0a3a]">
                  {t(`scanPurpose.${p.id}`)}
                </option>
              ))}
            </FormSelect>

            <FormSelect
              icon={ScanLine}
              label={t("scanForm.surfaceLabel")}
              value={form.surfaceType}
              onChange={(v) =>
                setForm({ ...form, surfaceType: v as ScanSurfaceId })
              }
            >
              {SCAN_SURFACE_TYPES.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#1a0a3a]">
                  {t(`scanSurface.${s.id}`)}
                </option>
              ))}
            </FormSelect>

            <FormSelect
              icon={MapPin}
              label={`${t("scanForm.locationLabel")} *`}
              value={form.locationType}
              onChange={(v) =>
                setForm({ ...form, locationType: v as ScanLocationId })
              }
            >
              {SCAN_LOCATIONS.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#1a0a3a]">
                  {t(`scanLocation.${l.id}`)}
                </option>
              ))}
            </FormSelect>

            {form.locationType === "onsite" && (
              <FormInput
                icon={MapPin}
                placeholder={t("scanForm.addressOnsite")}
                required
                value={form.locationAddress}
                onChange={(e) =>
                  setForm({ ...form, locationAddress: e.target.value })
                }
              />
            )}

            <FormInput
              icon={MapPin}
              placeholder={t("scanForm.cityPh")}
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
                {t("scanForm.wantsPrintLong")}
              </span>
            </label>

            <p className="text-xs font-medium text-violet-200/60 pt-2 border-t border-white/10">
              {t("scanForm.contactSection")}
            </p>

            <FormInput
              icon={User}
              placeholder={t("scanForm.namePh")}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <FormInput
              icon={Mail}
              type="email"
              placeholder={t("scanForm.emailPh")}
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <FormInput
              icon={Phone}
              type="tel"
              placeholder={t("scanForm.phonePh")}
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <FormTextarea
              icon={MessageSquare}
              placeholder={t("scanForm.notePh")}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />

            <p className="text-xs text-violet-300/55 -mt-2">
              {t("scanForm.attachPhotoHint")}
            </p>

            <NeonButton
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              <Upload className="w-4 h-4" />
              {loading ? t("scanForm.submitting") : t("scanForm.submitWhatsApp")}
            </NeonButton>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-violet-300/45 mt-6">
          <LocaleLink href="/3d-tarama" className="text-cyan-300/80 hover:text-cyan-200">
            {t("scanForm.backLink")}
          </LocaleLink>
        </p>
      </div>
    </section>
  );
}
