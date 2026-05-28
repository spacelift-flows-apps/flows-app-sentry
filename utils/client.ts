import type { AppInput } from "@slflows/sdk/v1";

export interface SentryCreds {
  baseUrl: string;
  organizationSlug: string;
  authToken: string;
  webhookClientSecret: string;
}

export function getCreds(input: AppInput): SentryCreds {
  return {
    baseUrl: (input.app.config.baseUrl as string).replace(/\/+$/, ""),
    organizationSlug: input.app.config.organizationSlug as string,
    authToken: input.app.config.authToken as string,
    webhookClientSecret: input.app.config.webhookClientSecret as string,
  };
}

// throwOnError: false so callers can inspect the response and throw with a
// descriptive message — the SDK's own throw produces a generic error that
// doesn't surface status codes or Sentry's detail field.
export function getClientOptions(input: AppInput) {
  const { baseUrl, authToken } = getCreds(input);
  return {
    baseUrl,
    headers: { Authorization: `Bearer ${authToken}` },
    throwOnError: false as const,
  };
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object") {
    const obj = err as Record<string, unknown>;
    if ("detail" in obj) return String(obj.detail);
    // Sentry validation errors are { field: ["message", ...] }.
    const messages: string[] = [];
    for (const [key, val] of Object.entries(obj)) {
      if (Array.isArray(val)) messages.push(`${key}: ${val.join(", ")}`);
    }
    if (messages.length > 0) return messages.join("; ");
  }
  return fallback;
}
