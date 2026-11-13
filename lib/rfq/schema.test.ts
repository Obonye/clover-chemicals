import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { RFQ_MAX_RANGES, RfqLineItemSchema, RfqSubmissionSchema, rfqLineKey } from "./schema.ts";

const product = {
  productId: "p1",
  slug: "mancozeb",
  name: "Mancozeb",
  grade: "Technical Grade",
  division: "chemicals",
  packSizeKey: "a2",
  packLabel: "5 kg",
  quantity: 3,
};

const contact = {
  fullName: "Test Buyer",
  company: "Test Co",
  email: "buyer@example.com",
  mobile: "+267 71 234 567",
  fulfilment: "delivery",
  deliveryAddress: "Plot 1, Gaborone",
};

const submit = (over: Record<string, unknown> = {}) =>
  RfqSubmissionSchema.safeParse({ items: [], ranges: [], contact, website: "", ...over });

describe("line items", () => {
  it("accepts a product line, with or without a leftover `type` from older carts", () => {
    assert.equal(RfqLineItemSchema.safeParse(product).success, true);
    assert.equal(RfqLineItemSchema.safeParse({ ...product, type: "product" }).success, true);
  });

  it("rejects a saved range line from the earlier cart design, so it is dropped on load", () => {
    const oldRangeLine = {
      type: "category",
      categorySlug: "pool",
      categoryName: "Pool Chemicals",
      division: "chemicals",
      details: "Chlorine tablets",
    };

    assert.equal(RfqLineItemSchema.safeParse(oldRangeLine).success, false);
  });

  it("keys a line by product and pack size", () => {
    assert.equal(rfqLineKey({ productId: "p1", packSizeKey: "a2" }), "p1::a2");
    assert.equal(rfqLineKey({ productId: "p1", packSizeKey: null }), "p1::");
  });
});

describe("submission", () => {
  it("accepts products only, ranges only (with a message), and both", () => {
    assert.equal(submit({ items: [product] }).success, true);
    assert.equal(submit({ ranges: ["pool"], contact: { ...contact, message: "Chlorine, 200 kg a month" } }).success, true);
    assert.equal(submit({ items: [product], ranges: ["agro", "pool"] }).success, true);
  });

  it("rejects an empty request", () => {
    const result = submit();

    assert.equal(result.success, false);
    assert.match(result.error?.issues[0]?.message ?? "", /Add a product or choose a product range/);
  });

  it("needs a message when there are ranges but no products", () => {
    const result = submit({ ranges: ["pool"] });

    assert.equal(result.success, false);
    assert.deepEqual(result.error?.issues[0]?.path, ["contact", "message"]);
    assert.equal(submit({ ranges: ["pool"], contact: { ...contact, message: "  " } }).success, false);
  });

  it("only takes slug-shaped ranges, and not too many", () => {
    const message = { ...contact, message: "Chlorine tablets please" };

    assert.equal(submit({ ranges: ["Pool Chemicals"], contact: message }).success, false);
    assert.equal(submit({ ranges: ["<script>alert(1)</script>"], contact: message }).success, false);
    assert.equal(submit({ ranges: [""], contact: message }).success, false);
    assert.equal(submit({ ranges: Array.from({ length: RFQ_MAX_RANGES + 1 }, (_, i) => `r${i}`), contact: message }).success, false);
  });
});
