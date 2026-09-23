import type { ComponentType } from "react";
import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { ChemicalHome } from "@/components/divisions/chemical-home";
import { MedicalHome } from "@/components/divisions/medical-home";
import { GenericDivisionHome } from "@/components/divisions/generic-division-home";
import { divisions, getDivision } from "@/config/divisions";

type Props = {
  params: Promise<{ division: string }>;
};

// Kept here rather than on the shared config/divisions.ts entries — that
// file is also imported by client components (navbar, utility bar) for
// their data, and these are Server Components (they fetch from Sanity), so
// bundling them in would leak server-only code into the client bundle.
const HOME_COMPONENTS: Record<string, ComponentType> = {
  chemical: ChemicalHome,
  medical: MedicalHome,
};

export function generateStaticParams() {
  return divisions.map((d) => ({ division: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { division: slug } = await params;
  const division = getDivision(slug);

  if (!division) return {};

  return {
    title: division.name,
    description: division.tagline,
  };
}

export default async function DivisionPage({ params }: Props) {
  const { division: slug } = await params;
  const division = getDivision(slug);

  if (!division) notFound();

  const HomeComponent = HOME_COMPONENTS[division.slug];

  return HomeComponent ? <HomeComponent /> : <GenericDivisionHome division={division} />;
}
