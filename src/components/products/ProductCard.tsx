"use client";

import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { getProductName, getProductDescription } from "@/lib/product-i18n";
import { categoryLabel } from "@/lib/order-labels";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatPrice, cn } from "@/lib/utils";
import { ShippingPromo } from "@/components/shipping/ShippingPromo";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { FlyingCartAnimation } from "@/components/cart/FlyingCartAnimation";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { locale, t } = useIntl();
  const displayName = getProductName(product, locale);
  const displayDesc = getProductDescription(product, locale);
  const cardRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const [flying, setFlying] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]));

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setFlying(true);
    addItem(product);
    setTimeout(() => setFlying(false), 800);
  }

  return (
    <>
      <FlyingCartAnimation trigger={flying} imageUrl={product.image} />
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08, duration: 0.5 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <LocaleLink href={`/products/${product.id}`}>
          <GlassCard
            hover
            className={cn(
              "overflow-hidden group h-full",
              product.featured &&
                "ring-1 ring-fuchsia-400/30 shadow-[0_0_32px_rgba(232,121,249,0.12)]"
            )}
          >
            <div className="relative h-56 sm:h-60 overflow-hidden">
              <motion.div
                className="absolute inset-0 animate-float"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <ProductPhoto
                  src={product.image}
                  alt={displayName}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
              <div className="absolute inset-0 card-vignette pointer-events-none" />
              {product.featured && (
                <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-500/25 text-amber-200 border border-amber-400/40">
                  <Sparkles className="w-3 h-3" />
                  Öne çıkan
                </span>
              )}
              <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full badge-glow z-10">
                {categoryLabel(product.category, t)}
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <span
                  className={cn(
                    "absolute z-10 text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30",
                    product.featured ? "top-12 right-3" : "top-3 right-3"
                  )}
                >
                  Son {product.stock} adet
                </span>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-white mb-1 line-clamp-1 group-hover:text-neon transition-colors">
                {displayName}
              </h3>
              <p className="text-xs text-violet-200/50 line-clamp-2 mb-4">
                {displayDesc}
              </p>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-lg font-bold text-neon block">
                    {formatPrice(product.price)}
                  </span>
                  <ShippingPromo variant="compact" />
                </div>
                <motion.button
                  onClick={handleAddToCart}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500/25 to-cyan-500/20 border border-fuchsia-400/40 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(232,121,249,0.3)] transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 text-cyan-300" />
                </motion.button>
              </div>
            </div>
          </GlassCard>
        </LocaleLink>
      </motion.div>
    </>
  );
}
