import { Skeleton } from "@heroui/react";

export default function ProductLoading() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 pt-[var(--header-h)] pb-4 lg:px-12">
          <Skeleton className="h-3 w-48 rounded" />
        </div>
      </div>

      {/* Matches the real page's two-column layout exactly, so nothing
          shifts once the data swaps in (see product-card-skeleton.tsx for
          the same convention on the grid cards). */}
      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-2xl" />

            <div className="flex flex-col gap-4">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-9 w-3/4 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
              <div className="mt-2 flex flex-col gap-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
              </div>
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-8 w-20 rounded-sm" />
                <Skeleton className="h-8 w-20 rounded-sm" />
              </div>
              <Skeleton className="mt-4 h-12 w-44 rounded" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
