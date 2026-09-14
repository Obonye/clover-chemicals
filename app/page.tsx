import { ProductsSection } from "@/components/products-section";
import { PartnersStrip } from "@/components/partners-strip";
import { HeroChemicals } from "@/components/hero-chemicals";
import { HeritageSection } from "@/components/heritage-section";
import { CtaBanner } from "@/components/cta-banner";
import { BestSellers } from "@/components/best-sellers";
import { SpecialsBanner } from "@/components/specials-banner";
import { loadQuery } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { ProductCategory } from "@/sanity/lib/types";

export default async function Home() {
  const categories = await loadQuery<ProductCategory[]>(CATEGORIES_QUERY);

  return (
    <>
      <HeroChemicals />

      <PartnersStrip />

      <SpecialsBanner />

      <BestSellers />
      <ProductsSection categories={categories} />
      <HeritageSection />
      <CtaBanner />
    </>
  );
}
