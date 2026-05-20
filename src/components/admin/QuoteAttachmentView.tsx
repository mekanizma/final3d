"use client";

import { useEffect, useState } from "react";
import { Download, FileWarning, Loader2 } from "lucide-react";
import {
  fetchQuoteAttachment,
  type QuoteKind,
} from "@/services/quoteService";
import { useIntl } from "@/components/i18n/IntlProvider";

type Props = {
  kind: QuoteKind;
  id: string;
  hasStorage: boolean;
  fileLabel?: string;
};

export function QuoteAttachmentView({
  kind,
  id,
  hasStorage,
  fileLabel,
}: Props) {
  const { t } = useIntl();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    url: string;
    fileName: string;
    isImage: boolean;
  } | null>(null);

  useEffect(() => {
    setMeta(null);
    setError(null);
    if (!hasStorage) return;

    let cancelled = false;
    setLoading(true);
    void fetchQuoteAttachment(kind, id)
      .then((data) => {
        if (!cancelled) setMeta(data);
      })
      .catch((e) => {
        if (!cancelled) setError((e as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [kind, id, hasStorage]);

  if (!hasStorage) {
    return (
      <p className="text-xs text-amber-200/80 flex items-center gap-2">
        <FileWarning className="w-4 h-4 shrink-0" />
        {t("adminQuotes.noFileStored")}
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-xs text-violet-300/60 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        {t("adminQuotes.loadingFile")}
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-xs text-rose-300/90 flex items-center gap-2">
        <FileWarning className="w-4 h-4 shrink-0" />
        {error}
      </p>
    );
  }

  if (!meta) return null;

  return (
    <div className="space-y-3">
      {fileLabel && (
        <p className="text-xs text-violet-300/60">
          {fileLabel}:{" "}
          <span className="text-violet-100/90">{meta.fileName}</span>
        </p>
      )}
      {meta.isImage ? (
        <a
          href={meta.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden border border-white/10 max-w-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.url}
            alt={meta.fileName}
            className="w-full max-h-72 object-contain bg-black/30"
          />
        </a>
      ) : (
        <p className="text-xs text-violet-200/70">{meta.fileName}</p>
      )}
      <a
        href={meta.url}
        target="_blank"
        rel="noopener noreferrer"
        download={meta.fileName}
        className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
      >
        <Download className="w-4 h-4" />
        {meta.isImage
          ? t("adminQuotes.downloadImage")
          : t("adminQuotes.downloadFile")}
      </a>
    </div>
  );
}
