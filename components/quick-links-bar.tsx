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
  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col overflow-hidden rounded-l-lg bg-accent shadow-lg transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-[120%]"
      }`}
      // Off-screen links shouldn't stay reachable by Tab.
      inert={!isVisible}
    >
      {links.map(({ label, href, icon: Icon }) => (
        <NextLink
          key={label}
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center text-accent-foreground transition-colors hover:bg-black/10 md:h-10 md:w-10"
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          title={label}
        >
          <Icon className="text-base md:text-lg" />
        </NextLink>
      ))}
    </div>
  );
};
