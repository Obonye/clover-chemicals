import type { CSSProperties } from "react";

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
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
import { barcodeWidth, code39Runs } from "@/lib/email/code39";

/**
 * A container label, in black and white: the quote reference is printed like a
 * drum's batch code (a real Code 39 barcode), under hazard-tape stripes and an
 * ink-in-water photo. The clover is the only colour. Everything is inline
 * styles on tables and system fonts — email clients ignore stylesheets, CSS
 * variables, web fonts and SVG.
 */
const ink = "#0a0a0a";
const paper = "#ffffff";
const fog = "#f2f2f2";
const rule = "#d9d9d9";
const mid = "#6e6e6e";
const dim = "#9a9a9a";

const display = "'Arial Black', 'Helvetica Neue', Arial, sans-serif";
const body = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const mono = "'Courier New', Courier, monospace";

const caps: CSSProperties = {
  fontFamily: mono,
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

/** Content ids the HTML references as `cid:…`; see enquiryAttachments(). */
const cid = { logo: "clover-mark", hero: "ink-in-water", stripes: "hazard-stripes" } as const;

export type EnquiryLine = {
  name: string;
  /** Grade and pack size, shown under the name. */
  meta?: string;
  quantity: number;
  note?: string | null;
};

export type EnquiryGroup = {
  /** Shown as a bar above the lines, e.g. "Clover Medical". Omit for a single list. */
  name?: string;
  lines: EnquiryLine[];
};

export type EnquiryEmailProps = {
  /** The inbox-list preview text. */
  preview: string;
  /** What this is, e.g. "Quote request". Shown on the header tag and the label. */
  kind: string;
  /** The headline, e.g. "Request received". */
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
    <Text style={{ ...caps, margin: "0 0 4px", paddingTop: 10, borderTop: `2px solid ${ink}`, color: ink, fontWeight: 700 }}>
      {children}
    </Text>
  );
}

/**
 * Bars are sized as a share of the total so the code shrinks to fit a phone;
 * the table's width attribute is its natural size for clients (Outlook) that
 * ignore max-width.
 */
function Barcode({ reference }: { reference: string }) {
  const runs = code39Runs(reference);
  const total = barcodeWidth(runs);

  return (
    <table
      cellPadding={0}
      cellSpacing={0}
      role="presentation"
      style={{ width: "100%", maxWidth: total, margin: "0 auto", tableLayout: "fixed" }}
      width={total}
    >
      <tbody>
        <tr>
          {runs.map((run, index) => (
            <td
              key={index}
              height={40}
              style={{
                width: `${((run.width / total) * 100).toFixed(3)}%`,
                height: 40,
                padding: 0,
                fontSize: 0,
                lineHeight: 0,
                backgroundColor: run.dark ? ink : paper,
              }}
            />
          ))}
        </tr>
      </tbody>
    </table>
  );
}

function Stripes() {
  return <Img alt="" height={12} src={`cid:${cid.stripes}`} style={{ display: "block", width: "100%" }} width={600} />;
}

export function EnquiryEmail({
  preview,
  kind,
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
        {/* Ask clients not to auto-invert the black and white in dark mode. */}
        <meta content="light" name="color-scheme" />
        <meta content="light" name="supported-color-schemes" />
        {/* Phones: tighter side padding and a smaller reference so nothing is wider than the screen. */}
        <style>{`@media (max-width:480px){.px{padding-left:20px!important;padding-right:20px!important}.ref{font-size:14px!important;letter-spacing:0!important;white-space:nowrap!important}.lbl{width:92px!important}}`}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: fog, margin: 0, padding: "24px 12px", fontFamily: body }}>
        <Container style={{ maxWidth: 600, margin: "0 auto", backgroundColor: paper, border: `2px solid ${ink}` }}>
          {/* Header */}
          <Section style={{ padding: "18px 24px" }}>
            <Row>
              <Column style={{ width: 56, verticalAlign: "middle" }}>
                <Img alt="Clover Industries" height={50} src={`cid:${cid.logo}`} width={44} />
              </Column>
              <Column style={{ verticalAlign: "middle" }}>
                <Text style={{ margin: 0, fontFamily: display, fontSize: 15, letterSpacing: "0.1em", textTransform: "uppercase", color: ink }}>
                  Clover Industries
                </Text>
                <Text style={{ ...caps, margin: "2px 0 0", fontSize: 10, color: mid }}>
                  Chemical · Medical · Since {siteConfig.foundedYear}
                </Text>
              </Column>
            </Row>
          </Section>

          <Stripes />
          <Img alt="" height={260} src={`cid:${cid.hero}`} style={{ display: "block", width: "100%" }} width={600} />

          {/* Headline and intro */}
          <Section className="px" style={{ padding: "32px 32px 8px" }}>
            <Heading
              as="h1"
              style={{
                margin: "0 0 20px",
                fontFamily: display,
                fontSize: 36,
                lineHeight: "38px",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: ink,
              }}
            >
              {heading}
            </Heading>
            <Text style={{ margin: "0 0 10px", fontSize: 15, lineHeight: "24px", fontWeight: 700, color: ink }}>Hi {name},</Text>
            <Text style={{ margin: 0, fontSize: 15, lineHeight: "24px", color: ink }}>{intro}</Text>
          </Section>

          {/* The label */}
          <Section className="px" style={{ padding: "20px 32px 8px" }}>
            <Section style={{ backgroundColor: ink, padding: "18px 20px 20px" }}>
              <Row>
                <Column style={{ verticalAlign: "top" }}>
                  <Text style={{ ...caps, margin: 0, fontSize: 10, color: dim }}>{kind} reference</Text>
                  <Text className="ref" style={{ margin: "4px 0 0", fontFamily: mono, fontSize: 22, fontWeight: 700, letterSpacing: "0.04em", color: paper }}>
                    {reference}
                  </Text>
                </Column>
                <Column align="right" style={{ verticalAlign: "top" }}>
                  <Text style={{ ...caps, margin: 0, fontSize: 10, color: dim }}>Received</Text>
                  <Text style={{ margin: "4px 0 0", fontFamily: mono, fontSize: 12, lineHeight: "16px", color: paper }}>{receivedAt}</Text>
                </Column>
              </Row>
              <Section style={{ marginTop: 14, backgroundColor: paper, padding: "12px 10px 8px", textAlign: "center" }}>
                <Barcode reference={reference} />
                <Text style={{ margin: "6px 0 0", fontFamily: mono, fontSize: 10, letterSpacing: "0.3em", color: ink }}>{reference}</Text>
              </Section>
            </Section>
          </Section>

          {/* Details */}
          <Section className="px" style={{ padding: "20px 32px 8px" }}>
            <SectionTitle>Details</SectionTitle>
            {rows.map(([label, value]) => (
              <Row key={label} style={{ borderBottom: `1px solid ${rule}` }}>
                <Column className="lbl" style={{ ...caps, width: 130, padding: "10px 12px 10px 0", verticalAlign: "top", fontSize: 10, lineHeight: "20px", color: mid }}>
                  {label}
                </Column>
                <Column style={{ padding: "10px 0", verticalAlign: "top", fontSize: 14, lineHeight: "20px", color: ink, whiteSpace: "pre-wrap" }}>
                  {value}
                </Column>
              </Row>
            ))}
          </Section>

          {/* Products */}
          {groups && groups.length > 0 && (
            <Section className="px" style={{ padding: "20px 32px 8px" }}>
              <SectionTitle>Products</SectionTitle>
              {groups.map((group, groupIndex) => (
                <Section key={group.name ?? groupIndex} style={{ marginBottom: 14 }}>
                  {group.name && (
                    <Row style={{ backgroundColor: ink }}>
                      <Column style={{ ...caps, padding: "8px 12px", fontSize: 10, color: paper }}>{group.name}</Column>
                      <Column align="right" style={{ ...caps, padding: "8px 12px", fontSize: 10, color: dim }}>
                        {group.lines.length} {group.lines.length === 1 ? "item" : "items"}
                      </Column>
                    </Row>
                  )}
                  {group.lines.map((line, lineIndex) => (
                    <Row key={lineIndex} style={{ borderBottom: `1px solid ${rule}` }}>
                      <Column style={{ width: 64, padding: "12px 0", verticalAlign: "top", fontFamily: display, fontSize: 26, lineHeight: "28px", color: ink }}>
                        {line.quantity}
                      </Column>
                      <Column style={{ padding: "12px 0", verticalAlign: "top" }}>
                        <Text style={{ margin: 0, fontSize: 15, lineHeight: "22px", fontWeight: 700, color: ink }}>{line.name}</Text>
                        {line.meta && <Text style={{ margin: "2px 0 0", fontFamily: mono, fontSize: 11, color: mid }}>{line.meta}</Text>}
                        {line.note && <Text style={{ margin: "4px 0 0", fontSize: 13, lineHeight: "18px", color: mid }}>Note: {line.note}</Text>}
                      </Column>
                    </Row>
                  ))}
                </Section>
              ))}
            </Section>
          )}

          <Section className="px" style={{ padding: "12px 32px 32px" }}>
            <Text style={{ margin: 0, fontSize: 13, lineHeight: "20px", color: mid }}>
              Need to add or change something? Reply to this email, or call {siteConfig.contact.phone} ({siteConfig.contact.hours}).
            </Text>
          </Section>

          {/* Footer */}
          <Stripes />
          <Section className="px" style={{ backgroundColor: ink, padding: "28px 32px" }}>
            <Row>
              <Column style={{ width: 44, verticalAlign: "top" }}>
                <Img alt="" height={40} src={`cid:${cid.logo}`} width={35} />
              </Column>
              <Column style={{ verticalAlign: "top" }}>
                <Text style={{ margin: 0, fontFamily: display, fontSize: 14, letterSpacing: "0.1em", textTransform: "uppercase", color: paper }}>
                  Clover Industries
                </Text>
                <Text style={{ ...caps, margin: "2px 0 0", fontSize: 10, color: dim }}>Botswana · Since {siteConfig.foundedYear}</Text>
              </Column>
            </Row>
            {branches.map((branch) => (
              <Text key={branch.slug} style={{ margin: "16px 0 0", fontFamily: mono, fontSize: 11, lineHeight: "17px", color: dim }}>
                <span style={{ color: paper }}>{branch.name}</span>
                <br />
                {branch.address}
              </Text>
            ))}
            <Text style={{ margin: "16px 0 0", fontFamily: mono, fontSize: 11, lineHeight: "17px", color: dim }}>
              {siteConfig.contact.phone} · {siteConfig.contact.hours}
              <br />
              <Link href={SITE_URL} style={{ color: paper }}>
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
 * The images the HTML references as `cid:…`, ready for sendEmail's
 * `attachments`. Sent inline so they show without the site being deployed and
 * without Outlook's "download pictures" prompt (see scripts/build-email-assets.mjs).
 */
export function enquiryAttachments() {
  const inline = (key: keyof typeof cid, filename: string, asset: { contentType: string; base64: string }) => ({
    filename,
    content: Buffer.from(asset.base64, "base64"),
    contentType: asset.contentType,
    contentId: cid[key],
  });

  return [
    inline("logo", "clover-mark.png", emailAssets.logo),
    inline("hero", "ink-in-water.jpg", emailAssets.hero),
    inline("stripes", "hazard-stripes.png", emailAssets.stripes),
  ];
}

/** Renders the enquiry email to the bodies and inline images sendEmail takes. */
export async function renderEnquiryEmail(props: EnquiryEmailProps) {
  return {
    html: await render(<EnquiryEmail {...props} />),
    text: enquiryText(props),
    attachments: enquiryAttachments(),
  };
}
