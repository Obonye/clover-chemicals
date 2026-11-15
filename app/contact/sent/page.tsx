import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { RequestSent } from "@/components/request-sent";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Message sent",
  alternates: { canonical: "/contact/sent" },
  robots: { index: false, follow: false },
};

// `MSG-YYMMDD-XXXX` (lib/rfq/reference.ts). Anything else in the URL is
// ignored, so the page can't be made to display arbitrary text.
const REFERENCE_PATTERN = /^MSG-\d{6}-[0-9A-Z]{4}$/;

type SentPageProps = {
  searchParams: Promise<{ ref?: string | string[] }>;
};

export default async function ContactSentPage({ searchParams }: SentPageProps) {
  const { ref } = await searchParams;
  const reference = Array.isArray(ref) ? ref[0] : ref;

  // Opened directly, with no (or a made-up) reference: there is nothing to confirm.
  if (!reference || !REFERENCE_PATTERN.test(reference)) redirect("/contact");

  return (
    <RequestSent
      heading="Thank you. We'll be in touch."
      label="Message sent"
      nextSteps={
        <>
          A confirmation is on its way to your email. Our team replies within one business day (
          {siteConfig.contact.hours}) with specifications, pricing and availability. If you need to add something,
          reply to the confirmation email or call{" "}
          <a
            className="font-semibold text-foreground underline underline-offset-2 hover:text-accent"
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
          >
            {siteConfig.contact.phone}
          </a>
          .
        </>
      }
      reference={reference}
    />
  );
}
