import { defineQuery } from "next-sanity";

// Shared projections ---------------------------------------------------------

const PRODUCT_FIELDS = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  description,
  grade,
  packSizes[]{ _key, value, unit, label },
  image,
  tag,
  available,
  "isFeatured": count(*[_type == "homepage" && references(^._id)]) > 0,
  "isOnPromotion": count(*[
    _type == "promotion" &&
    references(^._id) &&
    dateTime(now()) >= dateTime(startDate) &&
    dateTime(now()) <= dateTime(endDate)
  ]) > 0
`;

const CATEGORY_FIELDS = /* groq */ `
  _id,
  label,
  "slug": slug.current,
  division,
  description,
  image
`;

// Queries ------------------------------------------------------------------

/** All categories, ordered by the orderable-document-list rank. */
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "productCategory"] | order(orderRank) {
    ${CATEGORY_FIELDS},
    "productCount": count(*[_type == "product" && references(^._id)])
  }
`);

/** Category slugs — for generateStaticParams. */
export const CATEGORY_SLUGS_QUERY = defineQuery(`
  *[_type == "productCategory" && defined(slug.current)]{ "slug": slug.current }
`);

/** One category by slug, with its products inlined. */
export const CATEGORY_QUERY = defineQuery(`
  *[_type == "productCategory" && slug.current == $slug][0] {
    ${CATEGORY_FIELDS},
    "products": *[_type == "product" && references(^._id)] | order(name asc) {
      ${PRODUCT_FIELDS}
    }
  }
`);

/** Full catalogue: every category (ordered) with its products inlined. */
export const CATALOGUE_QUERY = defineQuery(`
  *[_type == "productCategory"] | order(orderRank) {
    ${CATEGORY_FIELDS},
    "products": *[_type == "product" && references(^._id)] | order(name asc) {
      ${PRODUCT_FIELDS}
    }
  }
`);

/** Every product with its category — for the search page and card grids. */
export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[_type == "product"] | order(name asc) {
    ${PRODUCT_FIELDS},
    category->{ ${CATEGORY_FIELDS} }
  }
`);

/** A division's homepage — curated, ordered featured products. */
export const HOMEPAGE_FEATURED_QUERY = defineQuery(`
  *[_id == $id][0].featuredProducts[]->{
    ${PRODUCT_FIELDS},
    category->{ ${CATEGORY_FIELDS} }
  }
`);

/**
 * The active promotion for a division, if any — the one closest to ending
 * wins when more than one is running at once.
 */
export const ACTIVE_PROMOTION_QUERY = defineQuery(`
  *[
    _type == "promotion" &&
    division == $division &&
    dateTime(now()) >= dateTime(startDate) &&
    dateTime(now()) <= dateTime(endDate)
  ] | order(endDate asc) [0] {
    _id,
    headline,
    description,
    image,
    endDate
  }
`);
