import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { RfqLineItemSchema, RfqSubmissionSchema, rfqLineKey } from "./schema.ts";

const legacyProduct = {
  productId: "p1",
  slug: "mancozeb",
  name: "Mancozeb",
  grade: "Technical Grade",
  division: "chemicals",
  packSizeKey: "a2",
  packLabel: "5 kg",
  quantity: 3,
};

const category = {
  type: "category",
  categorySlug: "pool",
  categoryName: "Pool Chemicals",
  division: "chemicals",
  details: "Chlorine tablets, about 200 kg a month",
};

const contact = {
  fullName: "Test Buyer",
  company: "Test Co",
  email: "buyer@example.com",
  mobile: "+267 71 234 567",
  fulfilment: "delivery",
  deliveryAddress: "Plot 1, Gaborone",
};

describe("line items", () => {
  it("loads a saved product line that has no type, as a product", () => {
    const parsed = RfqLineItemSchema.parse(legacyProduct);

    assert.equal(parsed.type, "product");
  });

  it("accepts a category line with only the required fields", () => {
    const parsed = RfqLineItemSchema.parse(category);

    assert.equal(parsed.type, "category");
  });

  it("rejects a category line with an unknown division or no slug", () => {
    assert.equal(RfqLineItemSchema.safeParse({ ...category, division: "other" }).success, false);
    assert.equal(RfqLineItemSchema.safeParse({ ...category, categorySlug: "" }).success, false);
  });

  it("treats a blank pack size as absent and caps quantity", () => {
    const parsed = RfqLineItemSchema.parse({ ...category, packSize: "  ", quantity: 5 });

    assert.equal(parsed.type === "category" && parsed.packSize, undefined);
    assert.equal(RfqLineItemSchema.safeParse({ ...category, quantity: 0 }).success, false);
    assert.equal(RfqLineItemSchema.safeParse({ ...category, quantity: 999_999 }).success, false);
  });
});

describe("rfqLineKey", () => {
  it("keys products by product and pack size, categories by slug", () => {
    assert.equal(rfqLineKey({ type: "product", productId: "p1", packSizeKey: "a2" }), "p1::a2");
    assert.equal(rfqLineKey({ productId: "p1", packSizeKey: null }), "p1::");
    assert.equal(rfqLineKey({ type: "category", categorySlug: "pool" }), "category::pool");
  });
});

describe("submission", () => {
  it("accepts product-only, category-only and mixed requests", () => {
    for (const items of [[legacyProduct], [category], [legacyProduct, category]]) {
      const result = RfqSubmissionSchema.safeParse({ items, contact, website: "" });

      assert.equal(result.success, true);
    }
  });

  it("rejects a category line with no details, naming the category", () => {
    const result = RfqSubmissionSchema.safeParse({
      items: [{ ...category, details: "   " }],
      contact,
      website: "",
    });

    assert.equal(result.success, false);
    assert.match(result.error?.issues[0]?.message ?? "", /Pool Chemicals/);
  });
});
