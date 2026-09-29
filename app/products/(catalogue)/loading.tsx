import { Skeleton } from "@heroui/react";

import { ProductCardSkeleton } from "@/components/product-card-skeleton";

export default function ProductsLoading() {
  return (
    <>
      <div className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex items-center gap-3 py-4 lg:hidden">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded" />
          </div>
          <div className="flex gap-3 overflow-x-auto py-6">
            {Array.from({ length: 5 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
          <div className="mb-6 hidden items-center gap-4 lg:flex">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-9 w-48 rounded" />
            <Skeleton className="h-9 w-48 rounded" />
          </div>

          <Skeleton className="mb-6 h-4 w-20 rounded" />

          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
