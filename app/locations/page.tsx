import NextLink from "next/link";

import { JsonLd } from "@/components/json-ld";
import { branches, mapUrl } from "@/config/branches";
import { divisions } from "@/config/divisions";
import { siteConfig } from "@/config/site";
import { branchesJsonLd } from "@/lib/structured-data";

export default function LocationsPage() {
  return (
    <>
      <JsonLd data={branchesJsonLd()} />

      {/* Page header */}
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Find Us
          </p>
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Our Locations
          </h1>
          <p className="text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
            Visit us at either branch, or reach our technical team directly —
            phone, email and WhatsApp details below.
          </p>
        </div>
      </section>

      {/* Branch cards */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {branches.map((branch) => {
              const servedDivisions = divisions.filter((d) =>
                branch.divisions.includes(d.slug),
              );

              return (
                <div
                  key={branch.slug}
                  className="scroll-mt-[var(--header-h)] rounded-2xl border border-separator bg-surface p-8"
                  id={branch.slug}
                >
                  <div className="mb-6 flex items-center gap-3">
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                      {branch.name}
                    </h2>
                    {branch.isHeadOffice && (
                      <span className="rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-accent-soft-foreground">
                        Head Office
                      </span>
                    )}
                  </div>

                  <address className="mb-6 flex flex-col gap-4 not-italic">
                    <p className="text-sm leading-relaxed text-muted">{branch.address}</p>

                    {servedDivisions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {servedDivisions.map((d) => (
                          <span
                            key={d.slug}
                            className="rounded-sm border border-separator px-2.5 py-1 font-mono text-xs text-muted"
                          >
                            {d.shortName}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <a
                        className="text-sm text-muted transition-colors hover:text-accent"
                        href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                      >
                        {siteConfig.contact.phone}
                      </a>
                      <a
                        className="text-sm text-muted transition-colors hover:text-accent"
                        href={`mailto:${siteConfig.contact.email}`}
                      >
                        {siteConfig.contact.email}
                      </a>
                      <p className="text-sm text-muted">{siteConfig.contact.hours}</p>
                    </div>
                  </address>

                  <div className="flex flex-wrap gap-3">
                    <a
                      className="inline-flex items-center gap-1.5 rounded border border-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                      href={mapUrl(branch.address)}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Get Directions
                    </a>
                    <NextLink
                      className="inline-flex items-center gap-1.5 rounded border border-separator px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:text-foreground"
                      href="/contact"
                    >
                      Send an Enquiry
                    </NextLink>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Company-wide contact, shared across branches — see
              siteConfig.contact and config/branches.ts for why phone/email/
              hours aren't (yet) branch-specific. */}
          <p className="mt-10 text-sm text-muted">
            Prefer WhatsApp?{" "}
            <a
              className="text-accent transition-colors hover:text-accent/80"
              href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^\d]/g, "")}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {siteConfig.contact.whatsapp}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
