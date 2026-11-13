import type { QueryParams } from "next-sanity";

import { draftMode } from "next/headers";

import { client } from "./client";
import { sanityFetch } from "./live";

type LoadOptions = {
  params?: QueryParams;
  perspective?: "published" | "drafts";
  stega?: boolean;
};

/**
 * Thin typed wrapper around `sanityFetch`.
 *
 * We type the result explicitly via the generic because this project does not
 * run Sanity TypeGen. Once `npx sanity typegen generate` is wired up, the
 * generated `*_QUERYResult` types make the generic redundant — you can drop
 * this helper and call `sanityFetch` directly.
 */
export async function loadQuery<T>(
  query: string,
  { params, perspective, stega }: LoadOptions = {},
): Promise<T> {
  const { data } = await sanityFetch({
    query,
    params,
    perspective,
    stega,
    // The overloads want literal `stega`/`perspective`; this helper narrows the
    // result type via the generic instead.
  } as Parameters<typeof sanityFetch>[0]);

  return data as unknown as T;
}

/** How long catalogue data may be served before it is read again. */
export const CATALOG_REVALIDATE_SECONDS = 60;

/**
 * Like `loadQuery`, for data that decides what the public can see: a category's
 * `catalogReady` switch and the products and links that hang off it.
 *
 * `loadQuery` (Sanity Live) caches until something tells the site to refresh:
 * the publish webhook, or a visitor with the site open at that moment. Miss
 * both (a Preview deployment, a webhook that didn't fire) and a category you've
 * just switched on stays hidden. This always re-reads within a minute, so
 * readiness changes show up on their own (CI-71, CI-76). In Draft Mode it falls
 * back to `loadQuery`, so editors still see drafts live in the Studio.
 */
export async function loadCatalogQuery<T>(
  query: string,
  { params, perspective, stega }: LoadOptions = {},
): Promise<T> {
  if ((await draftMode()).isEnabled) return loadQuery<T>(query, { params, perspective, stega });

  return client.fetch<T>(query, params ?? {}, {
    perspective: "published",
    stega: false,
    next: { revalidate: CATALOG_REVALIDATE_SECONDS, tags: ["catalog"] },
  });
}
