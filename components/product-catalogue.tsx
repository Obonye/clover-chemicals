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
  Tag,
  TagGroup,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";

import { ProductCard } from "@/components/product-card";
import { ProductSearch } from "@/components/product-search";
import { persistDivision } from "@/lib/division";
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
  initialDivision: string;
  initialSort: string;
};

export const ProductCatalogue = ({
  products,
  categories,
  initialQuery,
  initialCategory,
  initialDivision,
  initialSort,
}: ProductCatalogueProps) => {
  const router = useRouter();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory || "all");
  const [division, setDivision] = useState<DivisionFilter>(
    initialDivision === "chemicals" || initialDivision === "medical"
      ? initialDivision
      : "all",
  );
  const [sort, setSort] = useState<SortKey>(initialSort === "featured" ? "featured" : "name");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // A ?division= link (e.g. the medical CTAs) can be someone's first-ever
  // page load, before middleware.ts has ever set the cookie — repaint to
  // match on mount so the theme doesn't default to chemical underneath it.
  useEffect(() => {
    if (division !== "all") persistDivision(division === "chemicals" ? "chemical" : "medical");
  }, []);

  // Keep the URL in sync so results stay shareable/bookmarkable — default
  // values are omitted entirely so a filter-free view stays at bare /products.
  useEffect(() => {
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    if (division !== "all") params.set("division", division);
    if (sort !== "name") params.set("sort", sort);

    const qs = params.toString();

    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
  }, [query, category, division, sort, router]);

  // Categories available for the chosen division — narrows the pill row so a
  // division + category combo can never land on a dead zero-result page.
  const visibleCategories = useMemo(
    () => (division === "all" ? categories : categories.filter((c) => c.division === division)),
    [categories, division],
  );

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
      list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    return list;
  }, [products, division, category, query, sort]);

  const activeFilterCount = (division !== "all" ? 1 : 0) + (sort !== "name" ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0 || category !== "all" || query.trim() !== "";

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setDivision("all");
    setSort("name");
  }

  function handleDivisionChange(keys: Selection) {
    const next = firstKey<DivisionFilter>(keys, "all");

    setDivision(next);

    // "All" has no single division to theme the page as, so leave the
    // current accent/cookie alone — only a specific pick repaints it.
    if (next !== "all") persistDivision(next === "chemicals" ? "chemical" : "medical");
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
                <Tag className="shrink-0 whitespace-nowrap" id="all">
                  All
                </Tag>
                {visibleCategories.map((cat) => (
                  <Tag
                    key={cat._id}
                    className="shrink-0 whitespace-nowrap"
                    id={cat.slug ?? cat._id}
                  >
                    {cat.label}
                  </Tag>
                ))}
              </TagGroup.List>
            </TagGroup>
          </div>
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
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
                    Division
                  </span>
                  {renderDivisionToggle(true)}
                </div>

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
                    setDivision("all");
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
          <div className="mb-6 hidden items-center gap-4 lg:flex">
            <ProductSearch className="min-w-0 flex-1" value={query} onChange={setQuery} />
            {renderDivisionToggle()}
            <div className="w-48 shrink-0">{sortSelect}</div>
          </div>

          {/* Results */}
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
                  our technical team about custom sourcing.
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
        </div>
      </div>
    </>
  );
};
