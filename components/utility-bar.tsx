"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const siblings = [
  { label: "Clover Chemicals", href: "/" },
  { label: "Clover Medical", href: "/medical" },
];

export const UtilityBar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 z-50 w-full bg-[#111111] text-white">
      <div className="mx-auto flex h-8 max-w-[1280px] items-center gap-5 px-6 pb-1 sm:pb-0 lg:px-12">
        {siblings.map((sibling) => {
          const isActive =
            sibling.href === "/"
              ? !pathname.startsWith("/medical")
              : pathname.startsWith(sibling.href);

          return (
            <NextLink
              key={sibling.href}
              className={clsx(
                "text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-150",
                isActive ? "text-white" : "text-white/45 hover:text-white/75",
              )}
              href={sibling.href}
            >
              {sibling.label}
            </NextLink>
          );
        })}
      </div>
    </div>
  );
};
