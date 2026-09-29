"use client";

import type { PackSize } from "@/sanity/lib/types";

import { ListBox, Select } from "@heroui/react";
import clsx from "clsx";

import { packLabel } from "@/sanity/lib/format";

type PackSizeSelectProps = {
  packSizes: PackSize[];
  /** Selected pack `_key`; null shows the placeholder. */
  value: string | null;
  onChange: (pack: PackSize) => void;
  /** Accessible name, e.g. "Pack size for Glyphosate 360 SL". */
  label: string;
  isInvalid?: boolean;
  /** Shorter on desktop (36px) for dense tables; stays 44px on touch sizes. */
  compact?: boolean;
  className?: string;
};

/** Pack-size dropdown (HeroUI Select) shared by the product card and /rfq. */
export const PackSizeSelect = ({
  packSizes,
  value,
  onChange,
  label,
  isInvalid,
  compact,
  className,
}: PackSizeSelectProps) => (
  <Select
    aria-label={label}
    className={clsx("min-w-0", className)}
    isInvalid={isInvalid}
    placeholder="Choose a pack size"
    value={value}
    variant="secondary"
    onChange={(key) => {
      const pack = packSizes.find((p) => p._key === key);

      if (pack) onChange(pack);
    }}
  >
    <Select.Trigger className={clsx("h-11 min-h-11 w-full items-center py-0 font-mono", compact && "md:h-9 md:min-h-9")}>
      <Select.Value className="truncate whitespace-nowrap font-mono text-xs sm:text-xs" />
      <Select.Indicator />
    </Select.Trigger>
    <Select.Popover>
      <ListBox>
        {packSizes.map((pack) => (
          <ListBox.Item key={pack._key} className="font-mono text-xs" id={pack._key} textValue={packLabel(pack)}>
            {packLabel(pack)}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
  </Select>
);
