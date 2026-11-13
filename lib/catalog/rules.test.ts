import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { browsable, categoryHref, rangeHref } from "./rules.ts";

const ready = { slug: "pool", catalogReady: true };
const notReady = { slug: "pool", catalogReady: false };
const unset = { slug: "pool" };

describe("browsable", () => {
  it("is true only when the flag is on and the category is ready", () => {
    assert.equal(browsable(true, ready), true);
    assert.equal(browsable(true, notReady), false);
    assert.equal(browsable(false, ready), false);
    assert.equal(browsable(false, notReady), false);
  });

  it("treats a missing or unset readiness as not ready", () => {
    assert.equal(browsable(true, unset), false);
    assert.equal(browsable(true, { catalogReady: null }), false);
    assert.equal(browsable(true, null), false);
    assert.equal(browsable(true, undefined), false);
  });
});

describe("categoryHref", () => {
  it("links to the listing when browsable", () => {
    assert.equal(categoryHref(true, ready), "/products/pool");
    assert.equal(categoryHref(true, ready, "/chemical/products"), "/chemical/products/pool");
  });

  it("links to the range page for every other combination", () => {
    assert.equal(categoryHref(true, notReady), "/products?category=pool");
    assert.equal(categoryHref(false, ready), "/products?category=pool");
    assert.equal(categoryHref(false, notReady, "/chemical/products"), "/chemical/products?category=pool");
  });

  it("sends Medical categories to the Medical enquiry form", () => {
    const medical = { slug: "lab-equipment", division: "medical" };

    assert.equal(categoryHref(false, medical), "/contact?enquiry=medical&category=lab-equipment");
    assert.equal(categoryHref(true, { ...medical, catalogReady: true }), "/products/lab-equipment");
    assert.equal(rangeHref("lab-equipment", "medical"), "/contact?enquiry=medical&category=lab-equipment");
    assert.equal(rangeHref("pool", "chemicals"), "/products?category=pool");
  });

  it("encodes the slug and falls back to /rfq without one", () => {
    assert.equal(categoryHref(false, { slug: "a b" }), "/products?category=a%20b");
    assert.equal(categoryHref(false, {}), "/products");
  });
});
