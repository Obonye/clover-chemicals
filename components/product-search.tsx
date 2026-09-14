"use client";

import { SearchField } from "@heroui/react";

type ProductSearchProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

/**
 * Controlled search field — filtering happens instantly in the parent
 * (ProductCatalogue) as the value changes, so there's no submit step.
 * `aria-label` stands in for a visible <Label>, since the toolbar has no
 * room for one; SearchField wires it to the input for us.
 */
export const ProductSearch = ({ value, onChange, className }: ProductSearchProps) => (
  <SearchField aria-label="Search products" className={className} value={value} onChange={onChange}>
    <SearchField.Group>
      <SearchField.SearchIcon />
      <SearchField.Input placeholder="Search products — pine gel, sanitiser, X-ray film, herbicide..." />
      <SearchField.ClearButton />
    </SearchField.Group>
  </SearchField>
);
