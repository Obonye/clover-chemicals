import Image from "next/image";
import NextLink from "next/link";

import { CtaBanner } from "@/components/cta-banner";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/config/site";
import { divisionCssVars, divisions } from "@/config/divisions";
import { articles } from "@/lib/news";
import { organizationJsonLd } from "@/lib/structured-data";

const latestArticles = articles.slice(0, 3);

export default function Home() {
  const years = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      {/* Hero */}
      <section className="relative -mt-[var(--navbar-h)] flex min-h-[55vh] items-end overflow-hidden">
        <Image
          alt={siteConfig.name}
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src="/clover_about_us_2.jpg"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-16 pt-[var(--header-h)] lg:px-12">
          {/* Always over a dark photo: the group accent is graphite in light
              mode, so this uses a light tint instead. */}
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            Est. {siteConfig.foundedYear} · {years}+ Years · 100% Citizen-Owned · EDD Certified
          </p>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white lg:text-7xl" style={{ maxWidth: "18ch" }}>
            Botswana&apos;s total solutions partner, division by division.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            {siteConfig.description}
          </p>
        </div>
      </section>

      {/* Divisions */}
      <section className="border-b border-separator bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Our Divisions
          </p>
          <h2 className="mb-12 font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
            One group, built to circle the customer.
          </h2>
          <div className="grid grid-cols-1 gap-px bg-separator sm:grid-cols-2">
            {divisions.map((division) => (
              <NextLink
                key={division.slug}
                className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden bg-background p-8 lg:p-10"
                href={`/${division.slug}`}
                // Each card previews its own division's colours.
                style={divisionCssVars(division.theme)}
              >
                <Image
                  alt={division.name}
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  src={division.image}
                />
                <div className="absolute inset-0 bg-black/55 transition-colors duration-300 group-hover:bg-black/65" />
                <div className="relative z-10">
                  <h3 className="mb-2 font-display text-2xl font-extrabold tracking-tight text-white">
                    {division.name}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/75" style={{ maxWidth: "40ch" }}>
                    {division.tagline}
                  </p>
                  <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent">
                    Explore {division.name} →
                  </span>
                </div>
              </NextLink>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="border-b border-separator bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Who We Are
              </p>
              <p className="text-xl font-medium leading-relaxed text-foreground lg:text-2xl" style={{ maxWidth: "42ch" }}>
                {siteConfig.name} was established in Botswana in{" "}
                {siteConfig.foundedYear} to manufacture and supply chemicals
                for domestic and industrial use. Today we&apos;re 100%
                citizen-owned, EDD certified, and operating across chemicals,
                equipment, PPE, and medical divisions.
              </p>
            </div>
            <NextLink
              className="shrink-0 whitespace-nowrap rounded border border-separator px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors hover:border-foreground/30"
              href="/about"
            >
              Learn More →
            </NextLink>
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="border-b border-separator bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Latest Updates
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                News across the group.
              </h2>
            </div>
            <NextLink
              className="hidden shrink-0 font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75 sm:block"
              href="/news"
            >
              View all →
            </NextLink>
          </div>
          <div className="grid grid-cols-1 gap-px bg-separator sm:grid-cols-3">
            {latestArticles.map((article) => (
              <article key={article.slug} className="flex flex-col bg-background">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    alt={article.title}
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    src={article.image}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-accent">
                    {article.category}
                  </p>
                  <h3 className="mb-3 text-base font-bold leading-snug tracking-tight text-foreground">
                    {article.title}
                  </h3>
                  <NextLink
                    className="mt-auto font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                    href={`/news/${article.slug}`}
                  >
                    Read →
                  </NextLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stone duotone to match the group theme (CI-15). */}
      <CtaBanner tint={[0.79, 0.73, 0.61]} />
    </>
  );
}
