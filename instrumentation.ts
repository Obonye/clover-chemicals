import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (process.env.NODE_ENV !== "production") {
  for (const missingVariable of [
    !posthogKey && "NEXT_PUBLIC_POSTHOG_KEY",
    !posthogHost && "NEXT_PUBLIC_POSTHOG_HOST",
  ].filter(Boolean)) {
    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    );
  }
}

export const posthogLoggerProvider =
  posthogKey && posthogHost
    ? new LoggerProvider({
        resource: resourceFromAttributes({ "service.name": "clover-chemicals" }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost.replace(/\/$/, "")}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogKey}`,
                "Content-Type": "application/json",
              },
            }),
          }),
        ],
      })
    : null;

// This logger is intentionally isolated so only logs added by this integration are exported.
export const posthogLogger = posthogLoggerProvider?.getLogger("clover-chemicals-posthog");

export function register() {
  // Next.js loads this module at server startup; no global logger is configured.
}
