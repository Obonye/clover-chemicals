import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Sanity's API CDN caches reads at the edge and is only "eventually
  // consistent" after a publish — next-sanity v13's <SanityLive> doesn't
  // force-invalidate it by default (that needs a Sync Tag Invalidate
  // Function + waitFor="function", a bigger production-grade setup). At
  // this project's traffic/content volume, always-fresh reads are worth
  // more than the CDN's request-load savings, so it's off entirely rather
  // than "sometimes stale for a few minutes after every edit."
  useCdn: false,
  stega: {
    studioUrl,
  },
});
