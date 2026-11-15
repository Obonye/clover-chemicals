import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { catalogSitemapPaths } from "./sitemap-paths.ts";

const categories = [
  { slug: "agro", catalogReady: true },
  { slug: "pool", catalogReady: false },
  { slug: "ppe", catalogReady: null },
];

const products = [
  { category: "agro", product: "mancozeb", categoryReady: true },
  { category: "agro", product: "glyphosate", categoryReady: true },
  { category: "pool", product: "chlorine", categoryReady: false },
  { category: "ppe", product: "gloves", categoryReady: null },
];

describe("catalogSitemapPaths", () => {
  it("lists no category or product URLs while the catalogue is off, even for ready categories", () => {
    assert.deepEqual(catalogSitemapPaths({ enabled: false, categories, products }), []);
  });

  it("adds only the ready category's URLs when the catalogue is on", () => {
    assert.deepEqual(catalogSitemapPaths({ enabled: true, categories, products }), [
      "/products/agro",
      "/products/agro/mancozeb",
      "/products/agro/glyphosate",
    ]);
  });

  it("opening a second category adds only that category's URLs", () => {
    const opened = categories.map((c) => (c.slug === "pool" ? { ...c, catalogReady: true } : c));
    const openedProducts = products.map((p) => (p.category === "pool" ? { ...p, categoryReady: true } : p));
    const paths = catalogSitemapPaths({ enabled: true, categories: opened, products: openedProducts });

    assert.ok(paths.includes("/products/pool"));
    assert.ok(paths.includes("/products/pool/chlorine"));
    assert.ok(!paths.some((path) => path.includes("ppe")));
  });

  it("treats a missing catalogReady as not ready, and skips entries without slugs", () => {
    const paths = catalogSitemapPaths({
      enabled: true,
      categories: [{ slug: null, catalogReady: true }, { slug: "ppe", catalogReady: null }],
      products: [{ category: "agro", product: null, categoryReady: true }, { category: null, product: "x", categoryReady: true }],
    });

    assert.deepEqual(paths, []);
  });
});
