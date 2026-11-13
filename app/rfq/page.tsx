import { stegaClean } from "next-sanity";

import { RfqList } from "@/components/rfq/rfq-list";
import type { RfqRange } from "@/lib/rfq/types";
import { loadCatalogQuery } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { ProductCategory } from "@/sanity/lib/types";

export default async function RfqPage() {
  // The ranges offered as chips. Cached like the layout's own fetch of the same query.
  const categories = await loadCatalogQuery<ProductCategory[]>(CATEGORIES_QUERY);
  const ranges: RfqRange[] = categories.flatMap((category) =>
    category.slug && category.label && category.division
      ? [{ slug: stegaClean(category.slug), name: stegaClean(category.label), division: category.division }]
      : [],
  );

  return (
    <>
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 pb-5 pt-8 lg:px-12">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            Your RFQ
          </h1>
          <p className="mt-1 text-sm text-muted">Tell us what you need and we&apos;ll send you a quotation.</p>
        </div>
      </section>

      <section className="bg-background py-6 lg:py-8">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <RfqList ranges={ranges} />
        </div>
      </section>
    </>
  );
}
