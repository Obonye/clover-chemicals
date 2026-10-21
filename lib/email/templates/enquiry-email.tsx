import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  render,
  Row,
  Section,
  Text,
} from "@react-email/components";

import { branches } from "@/config/branches";
import { SITE_URL, siteConfig } from "@/config/site";
import { emailAssets } from "@/lib/email/assets";

/**
 * Deliberately plain: white card, one logo, system sans-serif, neutral greys.
 * Email clients ignore stylesheets, CSS variables, web fonts and SVG, so
 * everything is inline styles on tables.
 */
const ink = "#1a1a1a";
const muted = "#666666";
const rule = "#e5e5e5";
const page = "#f5f5f5";
const panel = "#f7f7f7";

const font = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

/** Content id the HTML references as `cid:…`; see enquiryAttachments(). */
const logoCid = "clover-mark";

export type EnquiryLine = {
  name: string;
  /** Grade and pack size, shown under the name. */
  meta?: string;
  quantity: number;
  note?: string | null;
};

export type EnquiryGroup = {
  /** Shown as a sub-heading above the lines, e.g. "Clover Medical". Omit for a single list. */
  name?: string;
  lines: EnquiryLine[];
};

export type EnquiryEmailProps = {
  /** The inbox-list preview text. */
  preview: string;
  /** What this is, e.g. "Quote request" — names the reference in the plain-text part. */
  kind: string;
  heading: string;
  reference: string;
  /** Already formatted, e.g. "21 Oct 2026, 18:59". */
  receivedAt: string;
  name: string;
  intro: string;
  details: Array<[label: string, value: string | undefined]>;
  groups?: EnquiryGroup[];
};

function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: ink }}>{children}</Text>
  );
}

export function EnquiryEmail({
  preview,
  heading,
  reference,
  receivedAt,
  name,
  intro,
  details,
  groups,
}: EnquiryEmailProps) {
  const rows = details.filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <Html lang="en">
      <Head>
        <meta content="light" name="color-scheme" />
        <meta content="light" name="supported-color-schemes" />
        {/* Phones: a little less side padding. */}
        <style>{`@media (max-width:480px){.px{padding-left:20px!important;padding-right:20px!important}}`}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: page, margin: 0, padding: "24px 12px", fontFamily: font }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: "#ffffff", border: `1px solid ${rule}`, borderRadius: 4 }}>
          {/* Header */}
          <Section className="px" style={{ padding: "24px 32px 20px" }}>
            <Row>
              <Column style={{ width: 48, verticalAlign: "middle" }}>
                <Img alt="Clover Industries" height={40} src={`cid:${logoCid}`} width={36} />
              </Column>
              <Column style={{ verticalAlign: "middle" }}>
                <Text style={{ margin: 0, fontSize: 16, fontWeight: 600, color: ink }}>Clover Industries</Text>
              </Column>
            </Row>
          </Section>
          <Hr style={{ margin: 0, borderColor: rule }} />

          {/* Heading and intro */}
          <Section className="px" style={{ padding: "28px 32px 8px" }}>
            <Heading as="h1" style={{ margin: "0 0 16px", fontSize: 22, lineHeight: "30px", fontWeight: 600, color: ink }}>
              {heading}
            </Heading>
            <Text style={{ margin: "0 0 12px", fontSize: 15, lineHeight: "24px", color: ink }}>Hi {name},</Text>
            <Text style={{ margin: 0, fontSize: 15, lineHeight: "24px", color: ink }}>{intro}</Text>
          </Section>

          {/* Reference */}
          <Section className="px" style={{ padding: "16px 32px 8px" }}>
            <Section style={{ backgroundColor: panel, border: `1px solid ${rule}`, borderRadius: 4, padding: "14px 16px" }}>
              <Row>
                <Column style={{ verticalAlign: "top" }}>
                  <Text style={{ margin: 0, fontSize: 12, color: muted }}>Reference</Text>
                  <Text style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 600, color: ink }}>{reference}</Text>
                </Column>
                <Column align="right" style={{ verticalAlign: "top" }}>
                  <Text style={{ margin: 0, fontSize: 12, color: muted }}>Received</Text>
                  <Text style={{ margin: "2px 0 0", fontSize: 14, color: ink }}>{receivedAt}</Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* Details */}
          <Section className="px" style={{ padding: "16px 32px 8px" }}>
            <SectionTitle>Your details</SectionTitle>
            {rows.map(([label, value]) => (
              <Row key={label} style={{ borderBottom: `1px solid ${rule}` }}>
                <Column style={{ width: 120, padding: "9px 12px 9px 0", verticalAlign: "top", fontSize: 13, lineHeight: "20px", color: muted }}>
                  {label}
                </Column>
                <Column style={{ padding: "9px 0", verticalAlign: "top", fontSize: 14, lineHeight: "20px", color: ink, whiteSpace: "pre-wrap" }}>
                  {value}
                </Column>
              </Row>
            ))}
          </Section>

          {/* Products */}
          {groups && groups.length > 0 && (
            <Section className="px" style={{ padding: "16px 32px 8px" }}>
              <SectionTitle>Products requested</SectionTitle>
              {groups.map((group, groupIndex) => (
                <Section key={group.name ?? groupIndex} style={{ marginBottom: 8 }}>
                  {group.name && <Text style={{ margin: "10px 0 2px", fontSize: 13, color: muted }}>{group.name}</Text>}
                  {group.lines.map((line, lineIndex) => (
                    <Row key={lineIndex} style={{ borderBottom: `1px solid ${rule}` }}>
                      <Column style={{ padding: "10px 12px 10px 0", verticalAlign: "top" }}>
                        <Text style={{ margin: 0, fontSize: 14, lineHeight: "20px", color: ink }}>{line.name}</Text>
                        {line.meta && <Text style={{ margin: "1px 0 0", fontSize: 13, lineHeight: "18px", color: muted }}>{line.meta}</Text>}
                        {line.note && <Text style={{ margin: "1px 0 0", fontSize: 13, lineHeight: "18px", color: muted }}>Note: {line.note}</Text>}
                      </Column>
                      <Column align="right" style={{ width: 60, padding: "10px 0", verticalAlign: "top", fontSize: 14, lineHeight: "20px", color: ink }}>
                        × {line.quantity}
                      </Column>
                    </Row>
                  ))}
                </Section>
              ))}
            </Section>
          )}

          <Section className="px" style={{ padding: "16px 32px 28px" }}>
            <Text style={{ margin: 0, fontSize: 14, lineHeight: "22px", color: ink }}>
              Need to add or change something? Reply to this email, or call {siteConfig.contact.phone} ({siteConfig.contact.hours}).
            </Text>
          </Section>

          {/* Footer */}
          <Hr style={{ margin: 0, borderColor: rule }} />
          <Section className="px" style={{ padding: "20px 32px 24px" }}>
            <Text style={{ margin: 0, fontSize: 12, lineHeight: "18px", color: muted }}>
              Clover Industries · {branches.map((branch) => branch.name.replace(" Branch", "")).join(" · ")}, Botswana
              <br />
              <Link href={SITE_URL} style={{ color: muted }}>
                {SITE_URL.replace(/^https?:\/\//, "")}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * The plain-text twin of the HTML email — what spam filters and text-only
 * clients read. Written by hand because the generated version runs table
 * labels into their values.
 */
function enquiryText({ kind, reference, receivedAt, name, intro, details, groups }: EnquiryEmailProps): string {
  const detailLines = details
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  const lineBlocks = (groups ?? [])
    .map((group) =>
      [
        group.name,
        ...group.lines.map(
          (line) =>
            `  - ${line.quantity} × ${line.name}${line.meta ? ` (${line.meta})` : ""}${line.note ? `\n      Note: ${line.note}` : ""}`,
        ),
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  return [
    `Hi ${name},`,
    intro,
    `${kind} reference: ${reference}\nReceived: ${receivedAt}`,
    detailLines,
    lineBlocks,
    `Need to add or change something? Reply to this email, or call ${siteConfig.contact.phone} (${siteConfig.contact.hours}).`,
    `Clover Industries · ${branches.map((branch) => branch.name.replace(" Branch", "")).join(" · ")}, Botswana\n${SITE_URL}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/**
 * The logo as an inline attachment, ready for sendEmail's `attachments`. Sent
 * inline so it shows without the site being deployed and without Outlook's
 * "download pictures" prompt (see scripts/build-email-assets.mjs).
 */
export function enquiryAttachments() {
  return [
    {
      filename: "clover-mark.png",
      content: Buffer.from(emailAssets.logo.base64, "base64"),
      contentType: emailAssets.logo.contentType,
      contentId: logoCid,
    },
  ];
}

/** Renders the enquiry email to the bodies and inline image sendEmail takes. */
export async function renderEnquiryEmail(props: EnquiryEmailProps) {
  return {
    html: await render(<EnquiryEmail {...props} />),
    text: enquiryText(props),
    attachments: enquiryAttachments(),
  };
}
