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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { cn } from "@/lib/utils";
import {
  deleteUploadedImage,
  fetchAllGalleryImages,
  fileToDataUrl,
  saveUploadedImage,
  type GalleryImage,
} from "@/lib/imageGalleryStorage";

type ImageMode = "url" | "gallery" | "file";

interface ProductImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export function ProductImagePicker({ value, onChange }: ProductImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ImageMode>("gallery");
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshGallery = useCallback(async () => {
    const images = await fetchAllGalleryImages();
    setGallery(images);
  }, []);

  useEffect(() => {
    void refreshGallery();
  }, [refreshGallery]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const saved = await saveUploadedImage(dataUrl, file.name);
      await refreshGallery();
      onChange(saved.url);
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
    if (!confirm("Bu görseli galeriden silmek istiyor musunuz?")) return;
    try {
      await deleteUploadedImage(id);
      if (gallery.find((g) => g.id === id)?.url === value) onChange("");
      await refreshGallery();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  const modes: { id: ImageMode; label: string; icon: LucideIcon }[] = [
    { id: "gallery", label: "Galeri", icon: LayoutGrid },
    { id: "file", label: "Bilgisayar", icon: Upload },
    { id: "url", label: "URL", icon: Link2 },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-violet-100/90">
        Ürün görseli
      </label>

      {value && (
        <div className="relative w-full max-w-xs aspect-square rounded-xl overflow-hidden border border-fuchsia-400/30 glass">
          <ProductPhoto src={value} alt="Önizleme" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white text-xs hover:bg-black/70"
          >
            Kaldır
          </button>
        </div>
      )}

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
          >
            <input
              className="input-field"
              placeholder="https://... görsel adresi"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <p className="text-xs text-violet-300/50 mt-2">
              Harici bir görsel linki yapıştırabilirsiniz.
            </p>
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
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-xl border-2 border-dashed border-fuchsia-400/30 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-white/[0.06] transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 flex items-center justify-center">
                <Upload className="w-6 h-6 text-cyan-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {uploading ? "Yükleniyor..." : "Görsel seç veya sürükle"}
                </p>
                <p className="text-xs text-violet-300/50 mt-1">
                  JPG, PNG, WebP — en fazla 2 MB
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
                Galeriden bir görsel seçin
              </p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs text-cyan-300 hover:underline"
              >
                + Bilgisayardan ekle
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
              {gallery.map((img) => {
                const selected = value === img.url;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => onChange(img.url)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all group",
                      selected
                        ? "border-cyan-400 ring-2 ring-cyan-400/30"
                        : "border-transparent hover:border-fuchsia-400/50"
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
