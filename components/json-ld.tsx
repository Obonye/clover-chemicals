import { serializeJsonLd } from "@/lib/structured-data";

/** Renders schema.org structured data. Server component: the JSON is in the
 *  initial HTML, where crawlers read it. */
export const JsonLd = ({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) => (
  <script
    dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    type="application/ld+json"
  />
);
