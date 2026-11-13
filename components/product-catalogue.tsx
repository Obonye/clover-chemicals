"use client";

import type { Key } from "@heroui/react";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { stegaClean } from "next-sanity";
import {
  Badge,
  Button,
  Drawer,
  ListBox,
  Select,
  Switch,
  Tag,
  TagGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";

import { ProductCard } from "@/components/product-card";
import { ProductSearch } from "@/components/product-search";
import { RangeQuotePanel } from "@/components/rfq/range-quote-panel";
import { divisionCssVars, getDivisionBySanityValue } from "@/config/divisions";
import { paintThemeVars } from "@/lib/theme-vars";
import type { Division, ProductCategory, ProductWithCategory } from "@/sanity/lib/types";

type SortKey = "name" | "featured";
type DivisionFilter = Division | "all";
type Selection = Set<Key> | "all";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "name", label: "Name (A–Z)" },
  { id: "featured", label: "Featured first" },
];

const DIVISION_OPTIONS: { id: DivisionFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "chemicals", label: "Chemical" },
  { id: "medical", label: "Medical" },
];

const FilterIcon = () => (
  <svg fill="none" height={16} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width={16}>
    <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// The selected chip is inverted (foreground fill, background text) so it stands
// out in both light and dark mode; the default selected tint is too faint on dark.
const CATEGORY_TAG_CLASS =
  "shrink-0 whitespace-nowrap data-[selected=true]:bg-foreground data-[selected=true]:text-background";

function firstKey<T extends string>(keys: Selection, fallback: T): T {
  if (keys === "all") return fallback;

  const [key] = Array.from(keys);

  return (key as T) ?? fallback;
}

type ProductCatalogueProps = {
  products: ProductWithCategory[];
  categories: ProductCategory[];
  initialQuery: string;
  initialCategory: string;
  /** Ignored when lockedDivision is set. */
  initialDivision?: string;
  initialOnPromotion: boolean;
  initialSort: string;
  /** Set on /[division]/products — locks the grid to one division (theming
   *  already comes from that route's own layout) and hides the toggle,
   *  since there's nothing to switch to. */
  lockedDivision?: Division;
  /** Where the URL-sync effect below rewrites to. Defaults to /products. */
  basePath?: string;
  /** Ranges whose products aren't listed online yet. They show as chips too;
   *  picking one shows an "add to my quote" panel instead of the grid. */
  pendingCategories?: ProductCategory[];
};

export const ProductCatalogue = ({
  products,
  categories,
  initialQuery,
  initialCategory,
  initialDivision,
  initialOnPromotion,
  initialSort,
  lockedDivision,
  basePath = "/products",
  pendingCategories = [],
}: ProductCatalogueProps) => {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory || "all");
  const [division, setDivision] = useState<DivisionFilter>(() => {
    if (lockedDivision) return lockedDivision;

    return initialDivision === "chemicals" || initialDivision === "medical"
      ? initialDivision
      : "all";
  });
  const [onPromotion, setOnPromotion] = useState(initialOnPromotion);
  const [sort, setSort] = useState<SortKey>(initialSort === "featured" ? "featured" : "name");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Live preview: repaint the whole page to match the picked division while
  // browsing the shared /products (mirrors picking a division's own colors
  // there, same as today) — purely client-side for this page view, nothing
  // is written to a cookie or localStorage, so it never leaks into any
  // other page. Skipped when locked, since /[division]/products already
  // gets its theme server-side from that route's own layout.
  useEffect(() => {
    if (lockedDivision) return;

    // Painted onto DivisionThemeScope's element (which carries the group
    // theme inline, shadowing anything set higher up) and onto <body>, where
    // the filter popovers portal.
    const scope = document.querySelector<HTMLElement>("[data-theme-scope]");
    const config = division !== "all" ? getDivisionBySanityValue(division) : undefined;

    if (!scope || !config?.theme) return;

    return paintThemeVars([scope, document.body], divisionCssVars(config.theme));
  }, [division, lockedDivision]);

  // Keep the URL in sync so results stay shareable/bookmarkable — default
  // values are omitted entirely so a filter-free view stays at bare basePath.
  useEffect(() => {
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    if (!lockedDivision && division !== "all") params.set("division", division);
    if (onPromotion) params.set("promotion", "true");
    if (sort !== "name") params.set("sort", sort);

    const qs = params.toString();

    router.replace(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  }, [query, category, division, onPromotion, sort, router, basePath, lockedDivision]);

  // Categories available for the chosen division — narrows the pill row so a
  // division + category combo can never land on a dead zero-result page.
  const visibleCategories = useMemo(() => {
    const all = [...categories, ...pendingCategories];

    return division === "all" ? all : all.filter((c) => c.division === division);
  }, [categories, pendingCategories, division]);
  const pendingCategory = pendingCategories.find((c) => c.slug === category);

  // If switching division drops the active category out of view, fall back to "All".
  useEffect(() => {
    if (category === "all") return;
    if (!visibleCategories.some((c) => c.slug === category)) setCategory("all");
  }, [visibleCategories, category]);

  const results = useMemo(() => {
    let list = products;

    if (division !== "all") {
      list = list.filter((product) => product.category?.division === division);
    }

    if (category !== "all") {
      list = list.filter((product) => product.category?.slug === category);
    }

    if (onPromotion) {
      list = list.filter((product) => product.isOnPromotion);
    }

    const needle = stegaClean(query).trim().toLowerCase();

    if (needle) {
      list = list.filter((product) => {
        const haystack = stegaClean(
          `${product.name ?? ""} ${product.description ?? ""} ${product.category?.label ?? ""}`,
        ).toLowerCase();

        return haystack.includes(needle);
      });
    }

    if (sort === "featured") {
      list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
    }

    return list;
  }, [products, division, category, onPromotion, query, sort]);

  // Only worth showing the toggle at all when something is actually on
  // promotion — otherwise it's a control that can never do anything.
  const hasPromotion = products.some((product) => product.isOnPromotion);

  const activeFilterCount =
    (!lockedDivision && division !== "all" ? 1 : 0) + (onPromotion ? 1 : 0) + (sort !== "name" ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0 || category !== "all" || query.trim() !== "";

  function clearFilters() {
    setQuery("");
    setCategory("all");
    if (!lockedDivision) setDivision("all");
    setOnPromotion(false);
    setSort("name");
  }

  function handleDivisionChange(keys: Selection) {
    setDivision(firstKey<DivisionFilter>(keys, "all"));
  }

  function handleCategoryChange(keys: Selection) {
    setCategory(firstKey<string>(keys, "all"));
  }

  const renderDivisionToggle = (fullWidth = false) => (
    <ToggleButtonGroup
      aria-label="Filter by division"
      disallowEmptySelection
      fullWidth={fullWidth}
      orientation="horizontal"
      selectedKeys={new Set<Key>([division])}
      selectionMode="single"
      onSelectionChange={handleDivisionChange}
    >
      {DIVISION_OPTIONS.map((option, index) => (
        <ToggleButton key={option.id} id={option.id}>
          {index > 0 && <ToggleButtonGroup.Separator />}
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );

  const sortSelect = (
    <Select aria-label="Sort products" value={sort} onChange={(value) => setSort(value as SortKey)}>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {SORT_OPTIONS.map((option) => (
            <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );

  const promotionSwitch = (
    <Switch isSelected={onPromotion} onChange={setOnPromotion}>
      <Switch.Control>
        <Switch.Thumb />
      </Switch.Control>
      <Switch.Content>On Promotion</Switch.Content>
    </Switch>
  );

  return (
    <>
      {/* Category pills — plain row up top, not part of the sticky sidebar */}
      <div className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          {/* Mobile-only: search + Filters trigger (the desktop toolbar below is lg-only) */}
          <div className="flex items-center gap-3 py-4 lg:hidden">
            <ProductSearch className="min-w-0 flex-1" value={query} onChange={setQuery} />

            <Badge.Anchor>
              <Button aria-label="Filters" variant="outline" onPress={() => setIsFilterSheetOpen(true)}>
                <FilterIcon />
                Filters
              </Button>
              {activeFilterCount > 0 && (
                <Badge color="accent" size="sm">
                  {activeFilterCount}
                </Badge>
              )}
            </Badge.Anchor>
          </div>

          <div className="flex gap-3 overflow-x-auto py-6 lg:flex-wrap lg:overflow-visible">
            <TagGroup
              aria-label="Filter by category"
              selectedKeys={new Set<Key>([category])}
              selectionMode="single"
              size="lg"
              onSelectionChange={handleCategoryChange}
            >
              <TagGroup.List className="flex flex-nowrap gap-3 lg:flex-wrap">
                <Tag className={CATEGORY_TAG_CLASS} id="all">
                  All
                </Tag>
                {visibleCategories.map((cat) => (
                  <Tag
                    key={cat._id}
                    className={CATEGORY_TAG_CLASS}
                    id={cat.slug ?? cat._id}
                  >
                    {cat.label}
                  </Tag>
                ))}
              </TagGroup.List>
            </TagGroup>
          </div>

          {/* Mobile-only: kept out of the Filters drawer since it'd be too
              easy to miss tucked away in there — sits right under the chips
              instead. Desktop shows it in the toolbar below. */}
          {hasPromotion && <div className="pb-6 lg:hidden">{promotionSwitch}</div>}
        </div>
      </div>

      {/* Mobile filter sheet — Division + Sort, mirrors the sidebar's desktop controls */}
      <Drawer>
        <Drawer.Backdrop isOpen={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <Drawer.Content placement="bottom">
            <Drawer.Dialog>
              <Drawer.Handle />
              <Drawer.Header>
                <Drawer.Heading>Filters</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body className="flex flex-col gap-6">
                {!lockedDivision && (
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                      Division
                    </span>
                    {renderDivisionToggle(true)}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                    Sort by
                  </span>
                  <div className="w-full">{sortSelect}</div>
                </div>
              </Drawer.Body>
              <Drawer.Footer>
                <Button
                  slot="close"
                  variant="ghost"
                  onPress={() => {
                    if (!lockedDivision) setDivision("all");
                    setOnPromotion(false);
                    setSort("name");
                  }}
                >
                  Clear
                </Button>
                <Button slot="close" variant="primary">
                  Done
                </Button>
              </Drawer.Footer>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      {/* Toolbar (desktop) + results */}
      <div className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
          {/* Search + division + sort — full width, sits above the grid, desktop only */}
          <div className="mb-6 hidden flex-col gap-4 lg:flex">
            <div className="flex items-center gap-4">
              <ProductSearch className="min-w-0 flex-1" value={query} onChange={setQuery} />
              {!lockedDivision && renderDivisionToggle()}
              <div className="w-48 shrink-0">{sortSelect}</div>
            </div>
            {hasPromotion && promotionSwitch}
          </div>

          {/* Results */}
          {pendingCategory ? (
            <RangeQuotePanel
              description={pendingCategory.description ? stegaClean(pendingCategory.description) : null}
              name={stegaClean(pendingCategory.label ?? "this range")}
              slug={stegaClean(pendingCategory.slug ?? "")}
            />
          ) : (
          <div>
            <p aria-live="polite" className="mb-6 text-sm text-muted">
              {results.length} product{results.length === 1 ? "" : "s"}
            </p>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((product) => (
                  <ProductCard
                    key={product._id}
                    category={product.category ?? { label: null, slug: null, image: null }}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start gap-4 py-4">
                <p className="text-base text-muted">
                  No products matched your filters. Try a different term, or speak to
                  our team about custom sourcing.
                </p>
                <div className="flex items-center gap-6">
                  {hasActiveFilters && (
                    <button
                      className="font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                      type="button"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  )}
                  <NextLink
                    className="font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                    href="/contact"
                  >
                    Contact Us →
                  </NextLink>
                </div>
              </div>
            )}
          </div>
          )}
        </div>
      </div>
    </>
  );
};
