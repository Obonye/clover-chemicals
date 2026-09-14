import { Skeleton } from "@heroui/react";

import { ProductCardSkeleton } from "@/components/product-card-skeleton";

export default function ProductsLoading() {
  return (
    <>
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
          <Skeleton className="h-6 w-40 rounded" />
        </div>
      </section>

      <div className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex items-center gap-3 py-4 lg:hidden">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded" />
          </div>
          <div className="flex gap-2 overflow-x-auto py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-8 lg:flex lg:items-start lg:gap-10 lg:px-12">
          <div className="hidden shrink-0 flex-col gap-6 lg:flex lg:w-56">
            <Skeleton className="h-11 w-full rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-24 w-full rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-9 w-full rounded" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <Skeleton className="mb-6 h-4 w-20 rounded" />
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
