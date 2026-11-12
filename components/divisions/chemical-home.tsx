import { ProductsSection } from "@/components/products-section";
import { PartnersStrip } from "@/components/partners-strip";
import { HeroChemicals } from "@/components/hero-chemicals";
import { HeritageSection } from "@/components/heritage-section";
import { CtaBanner } from "@/components/cta-banner";
import { BestSellers } from "@/components/best-sellers";
import { SpecialsBanner } from "@/components/specials-banner";
import { getCatalog } from "@/lib/catalog/visibility";
import { loadQuery } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { ProductCategory } from "@/sanity/lib/types";

export async function ChemicalHome() {
  const allCategories = await loadQuery<ProductCategory[]>(CATEGORIES_QUERY);
  // This is the Chemicals division's homepage, at /chemical — Medical &
  // Pharma (division: "medical") belongs on /medical, not here.
  const categories = allCategories.filter((c) => c.division === "chemicals");
  // Rendered per request: the flag decides which product surfaces exist (CI-72).
  const catalog = await getCatalog();

  return (
    <>
      <HeroChemicals showBrowse={catalog.enabled} />

      <PartnersStrip />

      <ProductsSection
        categories={categories}
        categoryLinks={Object.fromEntries(categories.map((c) => [c._id, catalog.isBrowsable(c)]))}
        showViewAll={catalog.enabled}
      />
      {catalog.enabled && <BestSellers />}

      {catalog.enabled && <SpecialsBanner />}

      <HeritageSection />
      <CtaBanner showBrowse={catalog.enabled} />
    </>
  );
}
