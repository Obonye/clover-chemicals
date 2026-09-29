import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request for Quote",
  description: "Review the products you've collected and send them to Clover Industries for a quotation.",
  alternates: {
    canonical: "/rfq",
  },
  // A per-visitor working list: nothing here for search engines.
  robots: { index: false, follow: true },
};

export default function RfqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
