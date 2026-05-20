/**
 * Ana sayfa 3D tarama medyası
 * Video: Mixkit License — "Scanning a figurine ready for printing"
 * https://mixkit.co/free-stock-video/scanning-a-figurine-ready-for-printing-27702/
 *
 * Görseller: Unsplash License (ücretsiz, ticari kullanım)
 */

/** Mixkit #27702 — figür 3D tarama */
export const SCAN_VIDEO = {
  src: "https://assets.mixkit.co/videos/27702/27702-720.mp4",
  poster: "https://assets.mixkit.co/videos/27702/27702-thumb-720-0.jpg",
} as const;

/** Unsplash — gerçek 3D tarama ekipmanı ve dijital model */
export const SCAN_IMAGES = {
  /** Mühendislik / stüdyo ortamı */
  hero: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80",
  /** Tom Claes (@tomspentys) — tablet üzerinde 3D tarama modeli */
  model:
    "https://images.unsplash.com/photo-1706777387154-ab5bf204a5bf?w=800&q=80",
  /** Tom Claes (@tomspentys) — el tipi 3D tarayıcı ile ölçüm */
  workflow:
    "https://images.unsplash.com/photo-1612888073468-eba93f586761?w=800&q=80",
} as const;
