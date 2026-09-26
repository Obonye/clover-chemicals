import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description:
    "The latest news and announcements from Clover Industries and its divisions.",
  alternates: {
    canonical: "/news",
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
