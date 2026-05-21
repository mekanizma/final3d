"use client";

import { useEffect, useState } from "react";
import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { getProductName, getProductDescription } from "@/lib/product-i18n";
import { categoryLabel } from "@/lib/order-labels";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Package } from "lucide-react";
import { api } from "@/services";
import { formatPrice } from "@/lib/utils";
import { ShippingPromo } from "@/components/shipping/ShippingPromo";
import type { Product } from "@/types";
import { getProductGallery } from "@/lib/product-images";
import { useCartStore } from "@/store/cartStore";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { FlyingCartAnimation } from "@/components/cart/FlyingCartAnimation";

export function ProductDetailClient({ id }: { id: string }) {
  const { locale, t } = useIntl();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [flying, setFlying] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api.getProductById(id).then(setProduct);
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-2 border-fuchsia-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = getProductName(product, locale);
  const displayDesc = getProductDescription(product, locale);
  const gallery = getProductGallery(product);
  const mainImage = gallery[activeImage] ?? product.image;

  function handleAddToCart() {
    setFlying(true);
    addItem(product!, quantity);
    setTimeout(() => setFlying(false), 800);
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <FlyingCartAnimation trigger={flying} imageUrl={product.image} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <LocaleLink
          href="/urunler"
          className="inline-flex items-center gap-2 text-sm text-violet-200/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("productDetail.back")}
        </LocaleLink>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <GlassCard hover={false} className="overflow-hidden">
              <div className="relative h-[400px] lg:h-[500px]">
                <motion.div
                  key={mainImage}
                  className="absolute inset-4 animate-float"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <ProductPhoto
                    src={mainImage}
                    alt={displayName}
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 p-4 pt-0 overflow-x-auto">
                  {gallery.map((url, index) => (
                    <button
                      key={`${url}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeImage === index
                          ? "border-cyan-400 ring-2 ring-cyan-400/30"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <ProductPhoto
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-xs px-3 py-1 rounded-full badge-glow">
              {categoryLabel(product.category, t)}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">
              {displayName}
            </h1>
            <p className="text-3xl font-bold text-neon mb-3">
              {formatPrice(product.price)}
            </p>
            <ShippingPromo variant="inline" className="mb-6" />
            <p className="text-violet-200/70 leading-relaxed mb-8">
              {displayDesc}
            </p>

            <div className="flex items-center gap-2 text-sm text-violet-200/50 mb-8">
              <Package className="w-4 h-4" />
              {product.stock > 0 ? (
                <span className="text-emerald-400">
                  Stokta {product.stock} adet
                </span>
              ) : (
                <span className="text-red-400">Stokta yok</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-violet-200/60">Adet:</span>
              <div className="flex items-center gap-3 glass rounded-xl px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <NeonButton
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-4 h-4" />
                Sepete Ekle
              </NeonButton>
              <LocaleLink href="/order">
                <NeonButton variant="ghost" size="lg">
                  {t("productDetail.orderNow")}
                </NeonButton>
              </LocaleLink>
            </div>

            <GlassCard hover={false} className="mt-8 p-4">
              <p className="text-sm text-violet-200/70">
                Ödeme: <strong className="text-white">Kapıda Ödeme</strong> —
                Teslimat sırasında nakit veya kart ile ödeme yapabilirsiniz.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
