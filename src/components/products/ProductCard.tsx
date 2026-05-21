"use client";

import { ProductPhoto } from "@/components/ui/ProductPhoto";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { useIntl } from "@/components/i18n/IntlProvider";
import { getProductName, getProductDescription } from "@/lib/product-i18n";
import { getProductGallery } from "@/lib/product-images";
import { categoryLabel } from "@/lib/order-labels";
import { motion } from "framer-motion";
import { useState, type CSSProperties } from "react";
import { formatPrice } from "@/lib/utils";
import { tFormat } from "@/lib/t-format";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { FlyingCartAnimation } from "@/components/cart/FlyingCartAnimation";

const CARD_ACCENTS = ["#c34a36", "#4e8397", "#ff8066", "#008bc9"] as const;

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { locale, t } = useIntl();
  const displayName = getProductName(product, locale);
  const displayDesc = getProductDescription(product, locale);
  const addItem = useCartStore((s) => s.addItem);
  const [flying, setFlying] = useState(false);

  const gallery = getProductGallery(product);
  const cover = gallery[0];
  const hoverImage = gallery[1] ?? gallery[0];
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

  const tags: string[] = [];
  if (product.featured) tags.push(t("productCard.featured"));
  if (product.stock <= 5 && product.stock > 0) {
    tags.push(
      tFormat(t, "productCard.lowStock", { count: String(product.stock) })
    );
  }

  const cardStyle = {
    "--product-card--accent": accent,
  } as CSSProperties;

  const buttonStyle = {
    "--purchase-button--background": "var(--_accent)",
    "--purchase-button--foreground": "var(--_accent-contrast)",
  } as CSSProperties;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    setFlying(true);
    addItem(product);
    setTimeout(() => setFlying(false), 800);
  }

  return (
    <>
      <FlyingCartAnimation trigger={flying} imageUrl={product.image} />
      <motion.section
        className="_card"
        style={cardStyle}
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
      >
        <LocaleLink
          href={`/products/${product.id}`}
          className="_thumbnail-link"
          aria-label={displayName}
        >
          <div className="_thumbnail-stack">
            <ProductPhoto
              src={cover}
              alt={displayName}
              priority={index < 4}
            />
            <ProductPhoto src={hoverImage} alt="" />
          </div>
        </LocaleLink>

        <p className="_category -trim-both">{categoryLabel(product.category, t)}</p>

        <h2
          className="_heading -fluid-text -trim-both"
          style={
            {
              "--fluid-text--min-font-size": 14,
              "--fluid-text--max-font-size": 17,
            } as CSSProperties
          }
        >
          <LocaleLink href={`/products/${product.id}`}>{displayName}</LocaleLink>
        </h2>

        <p className="_price -trim-both">{formatPrice(product.price)}</p>
        <p className="_description -line-clamp">{displayDesc}</p>

        <ul
          className="_tag-list cluster"
          style={{ "--cluster--gap": "0.35rem" } as CSSProperties}
          aria-hidden={tags.length === 0}
        >
          {tags.map((tag) => (
            <li key={tag} className="_tag -trim-both">
              {tag}
            </li>
          ))}
        </ul>

        <div className="_button" style={buttonStyle}>
          <button
            type="button"
            className="scope purchase-button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0
              ? t("productCard.outOfStock")
              : t("productCard.addCart")}
          </button>
        </div>
      </motion.section>
    </>
  );
}
