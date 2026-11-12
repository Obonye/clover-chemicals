/** Date + time in Botswana, for the "received" line. */
export function formatBotswanaTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Gaborone",
  }).format(date);
}
