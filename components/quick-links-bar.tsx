"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";

import { DocumentIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

const links = [
  {
    label: "WhatsApp",
    href: "https://wa.me/26777816000",
    icon: WhatsAppIcon,
  },
  {
    label: "Call Us",
    href: "tel:+2673953035",
    icon: PhoneIcon,
  },
  {
    label: "Brochure",
    href: "/brochure.pdf",
    icon: DocumentIcon,
  },
];

export const QuickLinksBar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrolledUp = currentScrollY < lastScrollY.current;

      setIsVisible(currentScrollY < 80 || scrolledUp);
      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Tablet/desktop — full-width bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 hidden bg-accent md:block">
        <div className="mx-auto flex h-8 max-w-[1280px]">
          {links.map(({ label, href, icon: Icon }) => (
            <NextLink
              key={label}
              className="flex flex-1 items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-foreground transition-colors hover:bg-black/10"
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
            >
              <Icon className="text-sm" />
              {label}
            </NextLink>
          ))}
        </div>
      </div>

      {/* Mobile — compact floating side strip */}
      <div
        aria-hidden={!isVisible}
        className={`fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col overflow-hidden rounded-l-lg bg-accent shadow-lg transition-transform duration-300 ease-out md:hidden ${
          isVisible ? "translate-x-0" : "translate-x-[120%]"
        }`}
      >
        {links.map(({ label, href, icon: Icon }) => (
          <NextLink
            key={label}
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center text-accent-foreground transition-colors hover:bg-black/10"
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
          >
            <Icon className="text-base" />
          </NextLink>
        ))}
      </div>
    </>
  );
};
