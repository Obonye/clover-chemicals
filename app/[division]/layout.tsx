import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { divisions, getDivision } from "@/config/divisions";

type DivisionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ division: string }>;
};

export function generateStaticParams() {
  return divisions.map((d) => ({ division: d.slug }));
}

// The title template every route under a division inherits — so
// /chemical/products becomes "Products - Clover Chemicals" automatically,
// the same way the root layout's template appends "- Clover Industries"
// everywhere else. The division home route (app/[division]/page.tsx) sets
// no title of its own, so `default` (not the templated form) is what
// renders there.
export async function generateMetadata({ params }: DivisionLayoutProps): Promise<Metadata> {
  const { division: slug } = await params;
  const division = getDivision(slug);

  if (!division) return {};

  return {
    title: {
      template: `%s - ${division.name}`,
      default: division.name,
    },
    description: division.tagline,
    alternates: {
      canonical: `/${division.slug}`,
    },
  };
}

// Theming lives at the root layout's DivisionThemeScope, not here — it
// wraps the whole page (utility bar, navbar, footer, quick-links bar too),
// while this layout only wraps the page content. This layout's own job is
// just validating the slug so an unknown division 404s.
export default async function DivisionLayout({ children, params }: DivisionLayoutProps) {
  const { division: slug } = await params;

  if (!getDivision(slug)) notFound();

  return children;
}
