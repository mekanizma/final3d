"use client";

import { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeDiscoverSections } from "@/components/home/HomeDiscoverSections";
import { useProductStore } from "@/store/productStore";
import type { Product } from "@/types";

export function HomePageContent({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  useEffect(() => {
    if (initialProducts.length > 0) {
      useProductStore.setState({
        products: initialProducts,
        loading: false,
        error: null,
      });
    }
  }, [initialProducts]);

  return (
    <>
      <HeroSection />
      <HomeDiscoverSections />
    </>
  );
}
