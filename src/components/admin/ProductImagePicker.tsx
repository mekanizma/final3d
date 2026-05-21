"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image,
  Link2,
  LayoutGrid,
  Trash2,
  Check,
  Star,
  Plus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { useIntl } from "@/components/i18n/IntlProvider";
import { tFormat } from "@/lib/t-format";
import { cn } from "@/lib/utils";
import {
  deleteUploadedImage,
  fetchAllGalleryImages,
  fileToDataUrl,
  saveUploadedImage,
  type GalleryImage,
} from "@/lib/imageGalleryStorage";

const MAX_IMAGES = 12;

type ImageMode = "url" | "gallery" | "file";

interface ProductImagePickerProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function ProductImagePicker({ value, onChange }: ProductImagePickerProps) {
  const { t } = useIntl();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImageMode>("gallery");
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  const refreshGallery = useCallback(async () => {
    const images = await fetchAllGalleryImages();
    setGallery(images);
  }, []);

  useEffect(() => {
    void refreshGallery();
  }, [refreshGallery]);

  function addUrl(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setError(t("imagePicker.duplicate"));
      return;
    }
    if (value.length >= MAX_IMAGES) {
      setError(tFormat(t, "imagePicker.maxReached", { max: String(MAX_IMAGES) }));
      return;
    }
    setError(null);
    onChange([...value, trimmed]);
    setUrlDraft("");
  }

  function toggleGalleryUrl(url: string) {
    if (value.includes(url)) {
      onChange(value.filter((u) => u !== url));
      return;
    }
    if (value.length >= MAX_IMAGES) {
      setError(tFormat(t, "imagePicker.maxReached", { max: String(MAX_IMAGES) }));
      return;
    }
    setError(null);
    onChange([...value, url]);
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function setCover(index: number) {
    if (index <= 0 || index >= value.length) return;
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (value.length >= MAX_IMAGES) {
      setError(tFormat(t, "imagePicker.maxReached", { max: String(MAX_IMAGES) }));
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const saved = await saveUploadedImage(dataUrl, file.name);
      await refreshGallery();
      onChange([...value, saved.url]);
      setMode("gallery");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDeleteUpload(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(t("imagePicker.deleteConfirm"))) return;
    try {
      const removed = gallery.find((g) => g.id === id)?.url;
      await deleteUploadedImage(id);
      if (removed) onChange(value.filter((u) => u !== removed));
      await refreshGallery();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const modes: { id: ImageMode; label: string; icon: LucideIcon }[] = [
    { id: "gallery", label: t("imagePicker.gallery"), icon: LayoutGrid },
    { id: "file", label: t("imagePicker.computer"), icon: Upload },
    { id: "url", label: t("imagePicker.url"), icon: Link2 },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-violet-100/90">
          {t("imagePicker.labelMulti")}
        </label>
        <span className="text-xs text-violet-300/50">
          {tFormat(t, "imagePicker.count", {
            count: String(value.length),
            max: String(MAX_IMAGES),
          })}
        </span>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={cn(
                "relative w-20 h-20 rounded-xl overflow-hidden border shrink-0 group",
                index === 0
                  ? "border-cyan-400/60 ring-1 ring-cyan-400/30"
                  : "border-fuchsia-400/30"
              )}
            >
              <ProductPhoto
                src={url}
                alt={t("imagePicker.previewAlt")}
                fill
                className="object-cover"
              />
              {index === 0 ? (
                <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[8px] font-medium bg-cyan-500/80 text-white flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5" aria-hidden />
                  {t("imagePicker.cover")}
                </span>
              ) : (
                <button
                  type="button"
                  title={t("imagePicker.setCover")}
                  onClick={() => setCover(index)}
                  className="absolute top-1 left-1 p-0.5 rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Star className="w-3 h-3 text-amber-300" aria-hidden />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute top-1 right-1 p-1 rounded-md bg-black/60 text-white text-[10px] hover:bg-black/80"
              >
                {t("imagePicker.remove")}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-violet-300/50">{t("imagePicker.multiHint")}</p>

      <div className="flex flex-wrap gap-2">
        {modes.map((m) => {
          const ModeIcon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                setError(null);
                if (m.id === "file") fileRef.current?.click();
              }}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all",
                mode === m.id
                  ? "bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/20 border border-fuchsia-400/40 text-white"
                  : "glass text-violet-100/90 hover:text-white"
              )}
            >
              <ModeIcon className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden />
              {m.label}
            </button>
          );
        })}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-xs text-rose-400">{error}</p>}

      <AnimatePresence mode="wait">
        {mode === "url" && (
          <motion.div
            key="url"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-2"
          >
            <input
              className="input-field flex-1"
              placeholder={t("imagePicker.urlPh")}
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl(urlDraft);
                }
              }}
            />
            <button
              type="button"
              onClick={() => addUrl(urlDraft)}
              disabled={!urlDraft.trim() || value.length >= MAX_IMAGES}
              className="shrink-0 px-3 py-2 rounded-xl text-xs font-medium glass hover:bg-white/10 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" aria-hidden />
            </button>
          </motion.div>
        )}

        {mode === "file" && (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading || value.length >= MAX_IMAGES}
              className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-fuchsia-400/30 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-cyan-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {uploading ? t("imagePicker.uploading") : t("imagePicker.uploadDropMulti")}
                </p>
                <p className="text-xs text-violet-300/50 mt-1">
                  {t("imagePicker.uploadHint")}
                </p>
              </div>
            </button>
          </motion.div>
        )}

        {mode === "gallery" && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-violet-300/60 flex items-center gap-1">
                <Image className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
                {t("imagePicker.pickGalleryMulti")}
              </p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={value.length >= MAX_IMAGES}
                className="text-xs text-cyan-300 hover:underline disabled:opacity-40"
              >
                {t("imagePicker.addFromPc")}
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
              {gallery.map((img) => {
                const selected = value.includes(img.url);
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => toggleGalleryUrl(img.url)}
                    disabled={!selected && value.length >= MAX_IMAGES}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all group",
                      selected
                        ? "border-cyan-400 ring-2 ring-cyan-400/30"
                        : "border-transparent hover:border-fuchsia-400/50 disabled:opacity-40"
                    )}
                  >
                    <ProductPhoto
                      src={img.url}
                      alt={img.label}
                      fill
                      className="object-cover"
                    />
                    {selected && (
                      <span className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                        <Check className="w-6 h-6 text-white drop-shadow" />
                      </span>
                    )}
                    {img.source === "upload" && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => void handleDeleteUpload(img.id, e)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            void handleDeleteUpload(
                              img.id,
                              e as unknown as React.MouseEvent
                            );
                        }}
                        className="absolute top-1 right-1 p-1 rounded-md bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 text-rose-300" />
                      </span>
                    )}
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] px-1 py-0.5 truncate text-white/90">
                      {img.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
