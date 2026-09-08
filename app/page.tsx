import { ProductsSection } from "@/components/products-section";
import { PartnersStrip } from "@/components/partners-strip";
import { HeroChemicals } from "@/components/hero-chemicals";
import { HeritageSection } from "@/components/heritage-section";
import { CtaBanner } from "@/components/cta-banner";
import { BestSellers } from "@/components/best-sellers";
import { SpecialsBanner } from "@/components/specials-banner";

export default function Home() {
  return (
    <>
      <HeroChemicals />

      <PartnersStrip />

      <SpecialsBanner />

      <BestSellers />
      <ProductsSection />
      <HeritageSection />
      <CtaBanner />
    </>
  );
}
