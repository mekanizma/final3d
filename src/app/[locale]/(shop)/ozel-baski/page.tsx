"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MessageCircle,
  Send,
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
import { quoteEmailFailAlert } from "@/lib/quoteFormNotify";
import { PRINT_MATERIALS, type PrintMaterialId } from "@/lib/printMaterials";
import { buildCustomPrintWhatsAppMessage } from "@/lib/whatsapp/messages/customPrint";
import {
  buildWhatsAppUrl,
  openWhatsAppWithMessage,
} from "@/lib/whatsapp/openWhatsApp";
import { useIntl } from "@/components/i18n/IntlProvider";
import { LocaleLink } from "@/components/i18n/LocaleLink";

const ACCEPTED = ".stl,.obj,.3mf,.zip";

export default function CustomPrintPage() {
  const { t } = useIntl();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState<"whatsapp" | "email" | "form" | null>(
    null
  );
  const [done, setDone] = useState(false);
  const [doneVia, setDoneVia] = useState<"whatsapp" | "email" | "form">("form");
  const [waUrl, setWaUrl] = useState<string | null>(null);
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

  async function submitQuote(via: "whatsapp" | "email" | "form") {
    const fileInput = document.querySelector<HTMLInputElement>(
      'input[name="modelFile"]'
    );
    const file = fileInput?.files?.[0];
    if (!file?.size) {
      alert(t("ozelBaski.fileRequired"));
      return;
    }

    setLoading(via);
    try {
      const payload = new FormData();
      payload.append("delivery", via);
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("material", form.material);
      payload.append("color", form.color);
      payload.append("quantity", form.quantity);
      payload.append("note", form.note);
      payload.append("modelFile", file);
      if (user?.id) payload.append("userId", user.id);

      const result = await submitCustomPrintRequest(payload);

      if (result.storageWarning) {
        alert(`${t("ozelBaski.storageWarning")}\n\n${result.storageWarning}`);
      }

      if (via === "form") {
        setDoneVia("form");
        setWaUrl(null);
        setDone(true);
        return;
      }

      if (via === "email") {
        quoteEmailFailAlert(result.notification, t);
        setDoneVia("email");
        setWaUrl(null);
        setDone(true);
        return;
      }

      const message = buildCustomPrintWhatsAppMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        material: form.material,
        materialLabel: t(`printMaterial.${form.material}.label`),
        color: form.color,
        quantity: form.quantity,
        note: form.note,
        fileName: file.name,
        fileSize: file.size,
      });
      setWaUrl(buildWhatsAppUrl(message));
      openWhatsAppWithMessage(message);
      setDoneVia("whatsapp");
      setDone(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : t("ozelBaski.fail"));
    } finally {
      setLoading(null);
    }
  }

  if (done) {
    return (
      <motion.div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
        <GlassCard hover={false} className="max-w-md w-full p-10 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t("ozelBaski.successTitle")}</h1>
          <p className="text-violet-200/70 text-sm mb-4 leading-relaxed">
            {doneVia === "form"
              ? t("ozelBaski.successBodyForm")
              : doneVia === "email"
                ? t("ozelBaski.successBodyEmail")
                : t("ozelBaski.successBody")}
          </p>
          {waUrl && doneVia === "whatsapp" && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-8"
            >
              <NeonButton type="button" variant="ghost">
                {t("ozelBaski.openWhatsApp")}
              </NeonButton>
            </a>
          )}
          {!waUrl && <div className="mb-8" />}
          <div className="flex flex-col gap-3">
            <NeonButton onClick={() => router.push("/")}>
              {t("customPrint.backHome")}
            </NeonButton>
            <LocaleLink href="/hesabim">
              <NeonButton variant="ghost" className="w-full">
                {t("customPrint.account")}
              </NeonButton>
            </LocaleLink>
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
              <span className="text-neon">{t("ozelBaski.formTitle")}</span>{" "}
              {t("ozelBaski.formTitleNeon")}
            </h2>
            <p className="text-violet-200/55 text-sm">{t("ozelBaski.formSub")}</p>
          </motion.div>

          <GlassCard hover={false} className="p-6 sm:p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitQuote("form");
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-medium text-violet-200/70 mb-2">
                  {t("ozelBaski.fileLabel")}
                </label>
                <label className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-fuchsia-400/30 bg-fuchsia-500/5 hover:bg-fuchsia-500/10 cursor-pointer transition-colors">
                  <FileUp className="w-10 h-10 text-cyan-400/80" />
                  <span className="text-sm text-violet-200/70 text-center">
                    {fileName ?? t("ozelBaski.fileDrop")}
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
                placeholder={t("scanForm.namePh").replace(" *", "")}
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <FormInput
                icon={Mail}
                type="email"
                placeholder={t("scanForm.emailPh").replace(" *", "")}
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <FormInput
                icon={Phone}
                type="tel"
                placeholder={t("scanForm.phonePh").replace(" *", "")}
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <div>
                <label className="block text-xs font-medium text-violet-200/70 mb-2">
                  {t("ozelBaski.materialLabel")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRINT_MATERIALS.map((mat) => (
                    <button
                      key={mat.id}
                      type="button"
                      title={t(`printMaterial.${mat.id}.hint`)}
                      onClick={() => setForm({ ...form, material: mat.id })}
                      className={`py-3 px-2 rounded-xl text-left border transition-all ${
                        form.material === mat.id
                          ? "bg-gradient-to-r from-fuchsia-500/30 to-violet-600/30 border-fuchsia-400/50 text-white"
                          : "glass border-white/10 hover:border-white/20"
                      }`}
                    >
                      <span className="block text-sm font-semibold text-white/95">
                        {t(`printMaterial.${mat.id}.label`)}
                      </span>
                      <span className="block text-[10px] text-violet-300/55 mt-0.5">
                        {t(`printMaterial.${mat.id}.hint`)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <FormInput
                icon={Palette}
                placeholder={t("ozelBaski.colorPh")}
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
              <FormInput
                icon={Hash}
                type="number"
                min={1}
                placeholder={t("ozelBaski.qtyPh")}
                required
                value={form.quantity}
                onChange={(e) =>
                  setForm({ ...form, quantity: e.target.value })
                }
              />
              <FormTextarea
                icon={MessageSquare}
                placeholder={t("ozelBaski.notePh")}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />

              <p className="text-xs text-violet-300/55 -mt-2">
                {t("ozelBaski.attachFileHint")}
              </p>

              <div className="flex flex-col gap-3 pt-1">
                <NeonButton
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={loading !== null}
                >
                  <Send className="w-4 h-4" />
                  {loading === "form"
                    ? t("ozelBaski.submittingForm")
                    : t("ozelBaski.submitForm")}
                </NeonButton>
                <NeonButton
                  type="button"
                  size="lg"
                  variant="ghost"
                  className="w-full"
                  disabled={loading !== null}
                  onClick={() => void submitQuote("whatsapp")}
                >
                  <MessageCircle className="w-4 h-4" />
                  {loading === "whatsapp"
                    ? t("ozelBaski.submitting")
                    : t("ozelBaski.submitWhatsApp")}
                </NeonButton>
                <NeonButton
                  type="button"
                  size="lg"
                  variant="ghost"
                  className="w-full"
                  disabled={loading !== null}
                  onClick={() => void submitQuote("email")}
                >
                  <Mail className="w-4 h-4" />
                  {loading === "email"
                    ? t("ozelBaski.submittingEmail")
                    : t("ozelBaski.submitEmail")}
                </NeonButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </section>
    </>
  );
}
