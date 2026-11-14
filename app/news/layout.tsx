import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description:
    "The latest news and announcements from Clover Industries and its divisions.",
  alternates: {
    canonical: "/news",
  },
  // Placeholder stories and no article pages yet (CI-13). Keep it out of the
  // index and the nav until real articles exist (CI-83).
  robots: { index: false, follow: false },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
