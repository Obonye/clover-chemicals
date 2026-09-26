import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Clover Industries — Botswana's citizen-owned, EDD certified group of divisions, manufacturing and distributing chemicals, equipment, and healthcare solutions since 1980.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
