import type { QueryParams } from "next-sanity";

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
