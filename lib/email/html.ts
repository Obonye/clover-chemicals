const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Everything a buyer types goes through this before it lands in an HTML email. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

/** Email clients ignore stylesheets, so every style here is inline. */
export const emailStyles = {
  label: "padding:6px 16px 6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;",
  value: "padding:6px 0;color:#111827;font-size:14px;vertical-align:top;",
  th: "padding:8px 12px;border-bottom:2px solid #111827;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;",
  td: "padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;vertical-align:top;",
};

/** Label/value rows for a small details table. Values are escaped here. */
export function detailRows(rows: Array<[label: string, value: string | undefined]>): string {
  return rows
    .filter((row): row is [string, string] => Boolean(row[1]))
    .map(
      ([label, value]) =>
        `<tr><td style="${emailStyles.label}">${escapeHtml(label)}</td><td style="${emailStyles.value}">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("");
}

/** Shared shell: Clover Industries wordmark header, content, quiet footer. */
export function emailLayout({ heading, body }: { heading: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px 12px;background:#f3f4f6;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:6px;">
      <tr>
        <td style="padding:20px 28px;border-bottom:1px solid #e5e7eb;font-size:13px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#111827;">Clover Industries</td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#111827;">${escapeHtml(heading)}</h1>
          ${body}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
          Clover Industries &middot; Gaborone &amp; Francistown, Botswana
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Date + time in Botswana, for the "received" line on staff emails. */
export function formatBotswanaTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Gaborone",
  }).format(date);
}
