import type { CSSProperties } from "react";

import Image from "next/image";
import NextLink from "next/link";

import { stegaClean } from "next-sanity";

import { CtaBanner } from "@/components/cta-banner";
import { JsonLd } from "@/components/json-ld";
import { branches } from "@/config/branches";
import { siteConfig } from "@/config/site";
import { divisionCssVars, divisions } from "@/config/divisions";
import { organizationJsonLd } from "@/lib/structured-data";
import { loadQuery } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { ProductCategory } from "@/sanity/lib/types";

// Hero wallpaper to try: swap the value to compare. Options in /public:
//   "/clover_group_hero1.jpg"  green-capped bottling line
//   "/clover_group_hero2.jpg"  amber bottles on white shelves
//   "/clover_about_us_2.jpg"   the original
const HERO_IMAGE = "/clover_group_hero2.jpg";

const headOffice = branches.find((branch) => branch.isHeadOffice) ?? branches[0];
const otherBranches = branches.filter((branch) => branch !== headOffice);

export default async function Home() {
  const years = new Date().getFullYear() - siteConfig.foundedYear;
  // The ranges each division sells, shown as chips on its card (names only).
  const categories = await loadQuery<ProductCategory[]>(CATEGORIES_QUERY);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      {/* Hero */}
      <section className="relative -mt-[var(--navbar-h)] flex min-h-[calc(100svh-var(--utility-bar-h))] items-end overflow-hidden">
        <Image
          alt="Rows of glass bottles holding liquids from pale gold to deep amber, on white shelves"
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
          src={HERO_IMAGE}
        />
        {/* Shade only where there's text: dark behind the headline (left), a
            strip under the nav (top) and a lift at the foot, so the photo's
            colour survives on the right instead of a flat wash over all of it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgb(0 0 0 / 0.84) 0%, rgb(0 0 0 / 0.62) 40%, rgb(0 0 0 / 0.1) 80%), linear-gradient(180deg, rgb(0 0 0 / 0.62) 0%, rgb(0 0 0 / 0) 24%, rgb(0 0 0 / 0) 60%, rgb(0 0 0 / 0.5) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-10 pt-[var(--header-h)] sm:pb-16 lg:px-12 lg:pb-20">
          {/* Always over a dark photo: the group accent is black in light
              mode, so this uses a light tint instead. */}
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-white/80">
            Est. {siteConfig.foundedYear} · {years}+ Years · 100% Citizen-Owned · EDD Certified
          </p>
          {/* The headline sets this block's width, so the buttons end exactly
              where the headline does (the description is narrower). */}
          <div className="w-fit max-w-full">
          {/* One line per row from lg up, so this block's width is the longest
              line's real width and the buttons end exactly under it. Below lg
              the headline wraps on its own. */}
          <h1 className="max-w-[18ch] font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:max-w-none lg:text-7xl">
            <span className="lg:block">Botswana&apos;s total</span>{" "}
            <span className="lg:block">solutions partner,</span>{" "}
            <span className="lg:block">division by division.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:mt-5 sm:text-lg">
            {siteConfig.description}
          </p>

          {/* Two ways in: a soft-black primary and a white secondary. A thin light
              ring and inner highlight keep the black one visible on the dark photo. */}
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:grid sm:grid-cols-2 lg:gap-4">
            <NextLink
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded bg-[#0b0b0c] px-6 py-3 text-[15px] sm:min-h-14 sm:text-base font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_1px_2px_rgb(0_0_0/0.4)] ring-1 ring-white/20 transition-[background-color,gap] duration-200 hover:gap-3 hover:bg-[#1a1a1c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="/rfq"
            >
              Get a quote
              <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.25} viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </NextLink>
            <NextLink
              className="inline-flex min-h-12 w-full items-center justify-center rounded bg-white px-6 py-3 text-[15px] sm:min-h-14 sm:text-base font-medium text-black shadow-[0_1px_2px_rgb(0_0_0/0.25)] transition-colors duration-200 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              href="/contact"
            >
              Contact us
            </NextLink>
          </div>
          </div>
        </div>
      </section>

      {/* Divisions */}
      <section className="border-b border-separator bg-background py-20 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Our Divisions
          </p>
          <h2 className="mb-12 font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
            One group, built to circle the customer.
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
            {divisions.map((division) => {
              const ranges = categories
                .filter((category) => category.division === division.sanityDivision && category.label)
                .slice(0, 4);

              return (
                <NextLink
                  key={division.slug}
                  className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-2xl bg-[#111111] p-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground lg:min-h-[32rem] lg:p-9"
                  href={`/${division.slug}`}
                  // Each card previews its own division's colours.
                  style={divisionCssVars(division.theme)}
                >
                  <Image
                    alt=""
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    src={division.image}
                  />
                  {/* Light at the top so the photo reads, deep at the bottom where the text sits. */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(180deg, rgb(0 0 0 / 0.12) 0%, rgb(0 0 0 / 0.35) 38%, rgb(0 0 0 / 0.9) 100%)",
                    }}
                  />
                  <div className="relative z-10 flex flex-col">
                    <div className="mb-5">
                      <h3 className="font-display text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
                        {division.name}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-white/85" style={{ maxWidth: "42ch" }}>
                        {division.tagline}
                      </p>
                    </div>

                    {/* The ranges unfold on hover or keyboard focus (fine pointers only; touch
                        has no hover, so there they are always shown). The row opens with a
                        grid-rows transition, so the title and tagline above lift smoothly to
                        make room instead of jumping, and the pills stagger in. */}
                    {ranges.length > 0 && (
                      <div
                        className="grid pointer-fine:grid-rows-[0fr] pointer-fine:transition-[grid-template-rows] pointer-fine:duration-[450ms] pointer-fine:ease-[cubic-bezier(0.16,1,0.3,1)] pointer-fine:group-hover:grid-rows-[1fr] pointer-fine:group-focus-visible:grid-rows-[1fr] motion-reduce:!transition-none"
                      >
                        <div className="min-h-0 overflow-hidden">
                          <ul aria-label={`${division.name} product ranges`} className="flex flex-wrap gap-2 pb-5">
                            {ranges.map((range, index) => (
                              <li
                                key={range._id}
                                className="rounded-full border border-white/35 bg-black/30 px-3 py-1 text-xs font-medium text-white pointer-fine:translate-y-2 pointer-fine:opacity-0 pointer-fine:transition-[opacity,transform] pointer-fine:duration-150 pointer-fine:ease-out pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-hover:duration-[400ms] pointer-fine:group-hover:ease-[cubic-bezier(0.16,1,0.3,1)] pointer-fine:group-hover:[transition-delay:calc(var(--i)*55ms+120ms)] pointer-fine:group-focus-visible:translate-y-0 pointer-fine:group-focus-visible:opacity-100 pointer-fine:group-focus-visible:duration-[400ms] pointer-fine:group-focus-visible:ease-[cubic-bezier(0.16,1,0.3,1)] pointer-fine:group-focus-visible:[transition-delay:calc(var(--i)*55ms+120ms)] motion-reduce:!transition-none"
                                style={{ "--i": index } as CSSProperties}
                              >
                                {stegaClean(range.label ?? "")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Ghost at rest; on hover a white fill wipes across from the left and the
                        label turns black part-way through, so the colour change rides the wipe. */}
                    <span className="relative isolate inline-flex w-fit items-center gap-2 overflow-hidden rounded border border-white/60 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-[gap,color,border-color] delay-0 duration-300 group-hover:gap-3 group-hover:border-white group-hover:text-black group-hover:delay-75 group-focus-visible:gap-3 group-focus-visible:border-white group-focus-visible:text-black group-focus-visible:delay-75 motion-reduce:transition-none">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100 group-hover:duration-[450ms] group-hover:ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-visible:scale-x-100 group-focus-visible:duration-[450ms] group-focus-visible:ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
                      />
                      Explore {division.name}
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </NextLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="bg-background py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="flex flex-col items-center gap-10 text-center">
            <div className="min-w-0">
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Who We Are
              </p>
              <p className="mx-auto text-xl font-medium leading-relaxed text-foreground lg:text-3xl lg:leading-snug" style={{ maxWidth: "58ch" }}>
                {/* One string: JSX drops whitespace that spans a line break
                    next to an {expression}, which ran words together here. */}
                {`${siteConfig.name} was established in Botswana in ${siteConfig.foundedYear} to manufacture and ` +
                  "supply chemicals for domestic and industrial use. Today we're 100% citizen-owned, EDD " +
                  "certified, and operating across chemicals, equipment, PPE, and medical divisions."}
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

      {/* At a glance: a bento over the brand line */}
      <section
        className="relative overflow-hidden border-t border-foreground/15 pt-20 pb-36 sm:pb-44 lg:pt-28 lg:pb-56"
        // A tone of its own (a touch lighter than the page in dark mode, a
        // touch darker in light), so the section reads as a separate band.
        style={{ backgroundColor: "color-mix(in oklab, var(--foreground) 5%, var(--background))" }}
      >
        {/* The brand line as a faint backdrop: oversized, sitting along the foot of
            the section below the tiles and cropped by its edge. Decorative only,
            so it is hidden from assistive tech. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex select-none items-end justify-center overflow-hidden"
        >
          <span
            className="translate-y-[16%] px-4 text-center font-display font-extrabold tracking-tight text-[length:22vw] leading-[0.9] sm:whitespace-nowrap sm:text-[length:min(11.5vw,12rem)] sm:leading-none"
            style={{ color: "color-mix(in oklab, var(--foreground) 8%, transparent)" }}
          >
            Lift as you rise.
          </span>
        </div>

        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            At a Glance
          </p>
          <h2 className="mb-12 font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
            Rooted in Botswana since {siteConfig.foundedYear}.
          </h2>

          {/*
            Desktop: a 4 x 2 bento with every cell filled.
              [Established] [   Registered   ] [Locations]
              [Established] [Vision] [Mission] [Locations]
            Established and Locations run the full height; Registered is two
            wide. Below lg the tiles stack in one or two columns.
          */}
          <dl className="grid grid-cols-1 gap-4 sm:grid-flow-dense sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[repeat(2,minmax(15rem,auto))] lg:gap-5">
            {/* Established: tall */}
            <div className="flex min-h-56 flex-col justify-between rounded-2xl border border-foreground/15 bg-surface p-6 shadow-sm lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:p-8">
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">Established</dt>
              <dd>
                <span className="block font-display text-6xl font-extrabold leading-none tracking-tight text-foreground lg:text-7xl">
                  {siteConfig.foundedYear}
                </span>
                <span className="mt-4 block text-base font-medium text-muted">
                  {years}+ years serving Botswana
                </span>
              </dd>
            </div>

            {/* Registered: wide, filled */}
            <div className="flex min-h-56 flex-col justify-between rounded-2xl bg-accent p-6 text-accent-foreground sm:col-span-2 lg:col-span-2 lg:col-start-2 lg:row-start-1 lg:p-8">
              <dt className="font-mono text-xs uppercase tracking-widest opacity-70">Registered</dt>
              <dd className="font-display text-2xl font-extrabold leading-tight tracking-tight lg:text-4xl" style={{ maxWidth: "26ch" }}>
                100% citizen-owned and registered under the Economic Diversification Drive (EDD)
              </dd>
            </div>

            {/* Locations: tall */}
            <div className="flex min-h-56 flex-col justify-between gap-8 rounded-2xl border border-foreground/15 bg-surface p-6 shadow-sm lg:col-start-4 lg:row-span-2 lg:row-start-1 lg:p-8">
              <div>
                <dt className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Head Office</dt>
                <dd className="text-lg font-semibold leading-snug text-foreground">{headOffice.address}</dd>
              </div>
              {otherBranches.length > 0 && (
                <div className="border-t border-separator pt-6">
                  <dt className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">Also At</dt>
                  <dd className="flex flex-col gap-3 text-lg font-semibold leading-snug text-foreground">
                    {otherBranches.map((branch) => (
                      <span key={branch.slug}>{branch.address}</span>
                    ))}
                  </dd>
                </div>
              )}
            </div>

            {/* Vision */}
            <div className="flex min-h-56 flex-col justify-between rounded-2xl border border-foreground/15 bg-surface p-6 shadow-sm lg:col-start-2 lg:row-start-2 lg:p-8">
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">Vision</dt>
              <dd className="text-xl font-semibold leading-snug text-foreground">
                To become a one-stop total solutions provider.
              </dd>
            </div>

            {/* Mission */}
            <div className="flex min-h-56 flex-col justify-between rounded-2xl border border-foreground/15 bg-surface p-6 shadow-sm lg:col-start-3 lg:row-start-2 lg:p-8">
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">Mission</dt>
              <dd className="text-xl font-semibold leading-snug text-foreground">
                To provide quality, state-of-the-art, affordable total solutions through excellent customer service.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Latest news: hidden until there are real articles. app/news still holds
          placeholder stories, and there is no /news/<slug> page for "Read" to
          open yet (CI-13). Bring the section back from git history with it. */}

      {/* Black-and-white duotone to match the group theme (CI-15). */}
      <CtaBanner showBrowse={false} tint={[0.8, 0.8, 0.8]} />
    </>
  );
}
