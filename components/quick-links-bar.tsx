import NextLink from "next/link";

import { DocumentIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

const links = [
  {
    label: "WhatsApp",
    href: "https://wa.me/26700000000",
    icon: WhatsAppIcon,
  },
  {
    label: "Call Us",
    href: "tel:+26700000000",
    icon: PhoneIcon,
  },
  {
    label: "Brochure",
    href: "/brochure.pdf",
    icon: DocumentIcon,
  },
];

export const QuickLinksBar = () => {
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
      <div className="fixed right-0 top-1/2 z-50 flex -translate-y-1/2 flex-col overflow-hidden rounded-l-lg bg-accent shadow-lg md:hidden">
        {links.map(({ label, href, icon: Icon }) => (
          <NextLink
            key={label}
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center text-accent-foreground transition-colors hover:bg-black/10"
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
          >
            <Icon className="text-lg" />
          </NextLink>
        ))}
      </div>
    </>
  );
};
