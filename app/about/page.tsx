import Image from "next/image";
import NextLink from "next/link";

const stats = [
  { value: "1987", label: "Year Founded" },
  { value: "10+", label: "Global Partners" },
  { value: "4", label: "Divisions" },
  { value: "EDD", label: "Certified" },
];

const pillars = [
  {
    index: "01",
    heading: "Citizen-Owned & EDD Certified",
    body: "Majority citizen-owned and registered under Botswana's Economic Diversification Drive, giving our clients the procurement compliance they need for government and institutional contracts.",
  },
  {
    index: "02",
    heading: "Global Brands, Local Support",
    body: "Authorised agents for Johnson Diversey, Kimberly Clark, Philips Medical, Thermo Fisher, Shimadzu, Eppendorf, and more — with world-class products backed by a team on the ground in Botswana.",
  },
  {
    index: "03",
    heading: "Medical & Lab Leadership",
    body: "Our fastest-growing division and top revenue generator, serving hospitals, clinics, and research facilities across the region with leading scientific instrumentation and equipment.",
  },
  {
    index: "04",
    heading: "Regional Expansion",
    body: "With a recent investment in Zambia, we are bringing the same standard of precision chemical supply to new markets across southern Africa, building on 37 years of trust in Botswana.",
  },
];

const partners = [
  "Johnson Diversey",
  "Kimberly Clark",
  "Columbus",
  "Philips Medical",
  "Carestream",
  "Thermo Fisher",
  "Shimadzu",
  "Erweka",
  "Eppendorf",
];

const timeline = [
  {
    year: "1987",
    event: "Founded in Gaborone, Botswana to manufacture and supply chemicals for domestic and industrial use.",
  },
  {
    year: "1990s",
    event: "Expanded scope to become authorised agents for international chemical manufacturers, including Johnson Diversey and Kimberly Clark.",
  },
  {
    year: "2000s",
    event: "Established our Medical & Laboratory division, representing Philips Medical, Thermo Fisher, Shimadzu, and Eppendorf across the region.",
  },
  {
    year: "2010s",
    event: "Achieved EDD certification and deepened our focus on government and institutional procurement compliance.",
  },
  {
    year: "Today",
    event: "Operating across four divisions with investments in Zambia, bringing the same precision supply to new southern African markets.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 flex min-h-[55vh] items-end overflow-hidden">
        <Image
          alt="Clover Chemical Industries"
          className="object-cover object-center"
          fill
          priority
          src="/clover large.jpg"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-16 pt-24 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Est. 1987
          </p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white lg:text-7xl" style={{ maxWidth: "16ch" }}>
            37 years of chemical precision.
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-12 lg:py-24">
          <p className="mb-8 text-xl font-medium leading-relaxed text-foreground lg:text-2xl" style={{ maxWidth: "36ch" }}>
            Clover Chemical Industries was established in Botswana in 1987 to
            manufacture and supply chemicals for domestic and industrial use.
            As demand grew, so did our scope.
          </p>
          <p className="text-base leading-relaxed text-muted" style={{ maxWidth: "48ch" }}>
            Today we are authorised agents for some of the world&apos;s leading
            manufacturers, serving agriculture, medicine, laboratory science,
            and heavy industry. Our Medical &amp; Laboratory division is our
            fastest-growing business, and our recent investment in Zambia marks
            the next chapter in our regional expansion.
          </p>
        </div>
      </section>

      {/* Stats — dark */}
      <section style={{ backgroundColor: "oklch(21.03% 0.0015 144.21)" }}>
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="px-6 py-14 lg:px-10"
                style={i < stats.length - 1 ? { borderRight: "1px solid rgba(255,255,255,0.08)" } : undefined}
              >
                <p className="mb-2 font-mono text-5xl font-bold tabular-nums text-white lg:text-6xl">
                  {stat.value}
                </p>
                <p className="font-mono text-xs uppercase tracking-widest text-white/40">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="border-y border-separator bg-accent py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p
            className="font-display font-extrabold leading-tight tracking-tight text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", maxWidth: "22ch" }}
          >
            We don&apos;t just supply chemicals. We supply certainty.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
            — Clover Chemical Industries, Est. 1987
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-separator bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Our History
          </p>
          <h2 className="mb-16 font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
            From a single facility to a regional force.
          </h2>
          <div className="flex flex-col">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="grid grid-cols-[90px_1fr] items-start gap-8 border-t border-separator py-10 lg:grid-cols-[220px_1fr] lg:gap-20"
              >
                <p className="font-mono text-3xl font-bold tabular-nums text-accent lg:text-5xl">
                  {item.year}
                </p>
                <p className="pt-1 text-base leading-relaxed text-muted lg:pt-3" style={{ maxWidth: "52ch" }}>
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-separator bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            What Sets Us Apart
          </p>
          <h2 className="mb-12 font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
            Built on compliance, backed by global brands.
          </h2>
          <div className="grid grid-cols-1 gap-px bg-separator sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.heading} className="bg-background p-8 lg:p-10">
                <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  {pillar.index}
                </p>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-foreground">
                  {pillar.heading}
                </h3>
                <p className="text-sm leading-relaxed text-muted" style={{ maxWidth: "38ch" }}>
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-b border-separator bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Our Partners
          </p>
          <h2 className="mb-12 font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
            Trusted agents for the world&apos;s leading manufacturers.
          </h2>
          <div className="grid grid-cols-2 gap-px bg-separator sm:grid-cols-3 lg:grid-cols-5">
            {partners.map((partner) => (
              <div
                key={partner}
                className="flex items-center justify-center bg-background px-6 py-10"
              >
                <span className="text-center text-sm font-semibold uppercase tracking-widest text-foreground/50">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
                Ready to work with us?
              </h2>
              <p className="text-base text-muted" style={{ maxWidth: "48ch" }}>
                Speak to our technical team about your chemical supply needs. We
                respond within one business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <NextLink
                className="rounded bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90"
                href="/contact"
              >
                Get in Touch
              </NextLink>
              <NextLink
                className="rounded border border-separator px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-foreground/30"
                href="/products"
              >
                Browse Products
              </NextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
