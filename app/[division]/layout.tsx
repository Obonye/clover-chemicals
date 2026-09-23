import { notFound } from "next/navigation";

import { divisions, getDivision } from "@/config/divisions";

type DivisionLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ division: string }>;
};

export function generateStaticParams() {
  return divisions.map((d) => ({ division: d.slug }));
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
