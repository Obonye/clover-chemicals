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

  // A compact floating side strip at every screen size: a full-width bottom
  // bar ate into the viewport on desktop. Slides away while scrolling down.
  // From md up it widens on hover/keyboard focus to show the labels, which
  // open to the left so the icons stay put against the edge.
  return (
    <div
      aria-hidden={!isVisible}
      className={`group fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col overflow-hidden rounded-l-lg bg-accent shadow-lg transition-transform duration-300 ease-out ${
        isVisible ? "translate-x-0" : "translate-x-[120%]"
      }`}
      // Off-screen links shouldn't stay reachable by Tab.
      inert={!isVisible}
    >
      {links.map(({ label, href, icon: Icon }) => (
        <NextLink
          key={label}
          className="flex items-center justify-end text-accent-foreground transition-colors hover:bg-black/10"
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          {/* Collapsed (but still read by screen readers) until expanded. */}
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-[11px] font-semibold uppercase tracking-widest opacity-0 transition-[max-width,opacity,padding] duration-200 ease-out motion-reduce:transition-none md:group-hover:max-w-32 md:group-hover:pl-4 md:group-hover:opacity-100 md:group-focus-within:max-w-32 md:group-focus-within:pl-4 md:group-focus-within:opacity-100">
            {label}
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center md:h-10 md:w-10">
            <Icon className="text-base md:text-lg" />
          </span>
        </NextLink>
      ))}
    </div>
  );
};
