import {
  render,
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import { branches } from "@/config/branches";
import { SITE_URL, siteConfig } from "@/config/site";

/**
 * Colours are literal hex: email clients ignore stylesheets and CSS variables,
 * and most can't parse oklch(). They follow the umbrella theme in
 * config/divisions.ts (graphite and warm stone).
 */
const color = {
  page: "#f4f1ec",
  card: "#ffffff",
  ink: "#1f1c19",
  muted: "#6b645c",
  line: "#e7e2da",
  header: "#2a2622",
  stone: "#d9c9a8",
};

const font = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const mono = "'SFMono-Regular', Menlo, Consolas, monospace";

export type EnquiryLine = {
  label: string;
  quantity: number;
  note?: string | null;
};

export type EnquiryGroup = {
  /** Shown as a sub-heading above the lines, e.g. "Clover Medical". Omit for a single list. */
  name?: string;
  /** Hex colour of the division, for the sub-heading's marker. */
  accent?: string;
  lines: EnquiryLine[];
};

export type EnquiryEmailProps = {
  /** The inbox-list preview text. */
  preview: string;
  heading: string;
  /** What this is, e.g. "Quote request". */
  kind: string;
  reference: string;
  name: string;
  intro: string;
  details: Array<[label: string, value: string | undefined]>;
  groups?: EnquiryGroup[];
};

export function EnquiryEmail({ preview, heading, kind, reference, name, intro, details, groups }: EnquiryEmailProps) {
  const rows = details.filter((row): row is [string, string] => Boolean(row[1]));

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: color.page, margin: 0, padding: "24px 12px", fontFamily: font }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: color.card, borderRadius: 8, overflow: "hidden" }}>
          <Section style={{ backgroundColor: color.header, padding: "22px 32px" }}>
            <Text
              style={{
                margin: 0,
                color: color.stone,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              Clover Industries
            </Text>
          </Section>

          <Section style={{ padding: "32px 32px 8px" }}>
            <Heading as="h1" style={{ margin: "0 0 16px", color: color.ink, fontSize: 24, lineHeight: "32px", fontWeight: 700 }}>
              {heading}
            </Heading>
            <Text style={{ margin: "0 0 12px", color: color.ink, fontSize: 15, lineHeight: "24px" }}>Hi {name},</Text>
            <Text style={{ margin: 0, color: color.ink, fontSize: 15, lineHeight: "24px" }}>{intro}</Text>
          </Section>

          <Section style={{ padding: "16px 32px 8px" }}>
            <Section style={{ backgroundColor: color.page, borderRadius: 6, padding: "14px 18px" }}>
              <Text
                style={{
                  margin: 0,
                  color: color.muted,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {kind} reference
              </Text>
              <Text style={{ margin: "4px 0 0", color: color.ink, fontFamily: mono, fontSize: 20, fontWeight: 700, letterSpacing: "0.04em" }}>
                {reference}
              </Text>
            </Section>
          </Section>

          <Section style={{ padding: "16px 32px 8px" }}>
            {rows.map(([label, value]) => (
              <Row key={label} style={{ borderBottom: `1px solid ${color.line}` }}>
                <Column style={{ width: 130, padding: "10px 12px 10px 0", verticalAlign: "top", color: color.muted, fontSize: 13 }}>
                  {label}
                </Column>
                <Column
                  style={{
                    padding: "10px 0",
                    verticalAlign: "top",
                    color: color.ink,
                    fontSize: 14,
                    lineHeight: "21px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {value}
                </Column>
              </Row>
            ))}
          </Section>

          {groups && groups.length > 0 && (
            <Section style={{ padding: "16px 32px 8px" }}>
              {groups.map((group, index) => (
                <Section key={group.name ?? index} style={{ marginBottom: 16 }}>
                  {group.name && (
                    <Text
                      style={{
                        margin: "0 0 4px",
                        paddingLeft: 10,
                        borderLeft: `3px solid ${group.accent ?? color.stone}`,
                        color: color.ink,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {group.name}
                    </Text>
                  )}
                  <Row style={{ borderBottom: `2px solid ${color.ink}` }}>
                    <Column style={{ padding: "8px 0", color: color.muted, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      Product
                    </Column>
                    <Column
                      align="right"
                      style={{ width: 60, padding: "8px 0", color: color.muted, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}
                    >
                      Qty
                    </Column>
                  </Row>
                  {group.lines.map((line, lineIndex) => (
                    <Row key={lineIndex} style={{ borderBottom: `1px solid ${color.line}` }}>
                      <Column style={{ padding: "10px 12px 10px 0", verticalAlign: "top", color: color.ink, fontSize: 14, lineHeight: "20px" }}>
                        {line.label}
                        {line.note && (
                          <>
                            <br />
                            <span style={{ color: color.muted, fontSize: 13 }}>Note: {line.note}</span>
                          </>
                        )}
                      </Column>
                      <Column
                        align="right"
                        style={{ width: 60, padding: "10px 0", verticalAlign: "top", color: color.ink, fontSize: 14, fontWeight: 700 }}
                      >
                        {line.quantity}
                      </Column>
                    </Row>
                  ))}
                </Section>
              ))}
            </Section>
          )}

          <Section style={{ padding: "8px 32px 28px" }}>
            <Text style={{ margin: 0, color: color.muted, fontSize: 13, lineHeight: "20px" }}>
              Need to add or change something? Just reply to this email, or call {siteConfig.contact.phone} ({siteConfig.contact.hours}).
            </Text>
          </Section>

          <Hr style={{ margin: 0, borderColor: color.line }} />
          <Section style={{ padding: "18px 32px 24px", backgroundColor: color.page }}>
            <Text style={{ margin: "0 0 4px", color: color.muted, fontSize: 12, lineHeight: "18px" }}>
              {branches.map((branch) => branch.name.replace(" Branch", "")).join(" · ")}, Botswana
            </Text>
            <Text style={{ margin: 0, color: color.muted, fontSize: 12, lineHeight: "18px" }}>
              <Link href={SITE_URL} style={{ color: color.muted }}>
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
function enquiryText({ kind, reference, name, intro, details, groups }: EnquiryEmailProps): string {
  const detailLines = details
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  const lineBlocks = (groups ?? [])
    .map((group) =>
      [
        group.name,
        ...group.lines.map((line) => `  - ${line.quantity} × ${line.label}${line.note ? `\n      Note: ${line.note}` : ""}`),
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");

  return [
    `Hi ${name},`,
    intro,
    `${kind} reference: ${reference}`,
    detailLines,
    lineBlocks,
    `Need to add or change something? Just reply to this email, or call ${siteConfig.contact.phone} (${siteConfig.contact.hours}).`,
    `Clover Industries · ${branches.map((branch) => branch.name.replace(" Branch", "")).join(" · ")}, Botswana\n${SITE_URL}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Renders the enquiry email to the HTML and plain-text bodies sendEmail takes. */
export async function renderEnquiryEmail(props: EnquiryEmailProps): Promise<{ html: string; text: string }> {
  return { html: await render(<EnquiryEmail {...props} />), text: enquiryText(props) };
}
