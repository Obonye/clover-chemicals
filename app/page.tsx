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
  const allCategories = await loadQuery<ProductCategory[]>(CATEGORIES_QUERY);
  // This is the Chemicals division's homepage — Medical & Pharma (division:
  // "medical") belongs on /medical, not here.
  const categories = allCategories.filter((c) => c.division === "chemicals");

  return (
    <>
      <HeroChemicals />

      <PartnersStrip />

      <ProductsSection categories={categories} />
      <BestSellers />

      <SpecialsBanner />

      <HeritageSection />
      <CtaBanner />
    </>
  );
}
