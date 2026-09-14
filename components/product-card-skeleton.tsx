import { Skeleton } from "@heroui/react";

/**
 * Matches ProductCard's shell exactly (same rounded-2xl/border/padding), so
 * loading.tsx grids never shift layout when real cards swap in.
 */
export const ProductCardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-separator bg-surface">
    <Skeleton className="h-44 w-full shrink-0 rounded-none" />

    <div className="flex flex-1 flex-col gap-3 p-5">
      <Skeleton className="h-3 w-16 rounded" />
      <Skeleton className="h-4 w-3/4 rounded" />
      <Skeleton className="h-3 w-full rounded" />
      <Skeleton className="h-3 w-2/3 rounded" />

      <div className="mt-1 flex items-center justify-between border-t border-separator pt-4">
        <Skeleton className="h-7 w-20 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    </div>
  </div>
);
