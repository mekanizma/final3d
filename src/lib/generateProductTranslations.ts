import { defaultLocale, locales, type Locale } from "@/i18n/config";
import type { ProductTranslations } from "@/types";

const TARGET_LOCALES = locales.filter((l) => l !== defaultLocale) as Locale[];

async function translateChunk(text: string, target: Locale): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const q = encodeURIComponent(trimmed.slice(0, 450));
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=tr|${target}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return trimmed;
    const data = (await res.json()) as {
      responseData?: { translatedText?: string };
    };
    const out = data.responseData?.translatedText?.trim();
    return out && out !== trimmed ? out : trimmed;
  } catch {
    return trimmed;
  }
}

async function translateField(text: string, target: Locale): Promise<string> {
  if (text.length <= 450) {
    return translateChunk(text, target);
  }
  const parts: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    const slice = rest.slice(0, 400);
    const breakAt = slice.lastIndexOf(" ");
    const chunk = breakAt > 80 ? slice.slice(0, breakAt) : slice.slice(0, 400);
    parts.push(await translateChunk(chunk, target));
    rest = rest.slice(chunk.length).trimStart();
  }
  return parts.join(" ");
}

/** Sunucu tarafında doğrudan çağrılır — HTTP roundtrip gerektirmez */
export async function generateProductTranslations(
  name: string,
  description: string
): Promise<ProductTranslations> {
  const trimmedName = name.trim();
  const trimmedDesc = description.trim();

  const translations = {
    tr: { name: trimmedName, description: trimmedDesc },
  } as ProductTranslations;

  for (const locale of TARGET_LOCALES) {
    const [translatedName, translatedDesc] = await Promise.all([
      translateField(trimmedName, locale),
      translateField(trimmedDesc, locale),
    ]);
    translations[locale] = {
      name: translatedName || trimmedName,
      description: translatedDesc || trimmedDesc,
    };
  }

  return translations;
}
