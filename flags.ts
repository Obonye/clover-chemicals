import { vercelAdapter } from "@flags-sdk/vercel";
import { flag } from "flags/next";

/**
 * Whether the product catalogue is visible (CI-68). Off means products are
 * hidden everywhere and every product URL sends the visitor to the RFQ.
 *
 * The value lives in Vercel Flags, per environment (Development on, Preview
 * on, Production off), so it changes without a redeploy. `defaultValue` is
 * what a visitor gets when the flag service has no answer.
 *
 * Don't import this from pages or components: ask `isCatalogEnabled()` or
 * `isCategoryBrowsable()` in lib/catalog/visibility.ts instead (CI-70).
 */
export const productCatalog = flag<boolean>({
  key: "product-catalog",
  description: "Show the product catalogue. When off, products are hidden and visitors go to the RFQ.",
  defaultValue: false,
  options: [
    { value: false, label: "Hidden" },
    { value: true, label: "Visible" },
  ],
  adapter: vercelAdapter(),
});
