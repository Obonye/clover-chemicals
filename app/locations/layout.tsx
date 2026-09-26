import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Clover Industries branch locations in Botswana — addresses, contact details, and directions.",
  alternates: {
    canonical: "/locations",
  },
};

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
