import { Skeleton } from "@heroui/react";

import { ProductCardSkeleton } from "@/components/product-card-skeleton";

export default function CategoryLoading() {
  return (
    <>
      <section className="relative -mt-16 flex min-h-[40vh] items-end overflow-hidden bg-surface-secondary">
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-12 pt-24 lg:px-12">
          <Skeleton className="mb-6 h-3 w-28 rounded" />
          <Skeleton className="mb-2 h-3 w-32 rounded" />
          <Skeleton className="h-10 w-64 rounded" />
        </div>
      </section>

      <div className="border-b border-separator bg-background/95">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex gap-6 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={i} className="h-4 w-24 shrink-0 rounded" />
            ))}
          </div>
        </div>
      </div>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <Skeleton className="mb-8 h-3 w-20 rounded" />
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
