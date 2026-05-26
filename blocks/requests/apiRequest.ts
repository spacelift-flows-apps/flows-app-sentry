import { type AppBlock, events } from "@slflows/sdk/v1";
import { getCreds, extractErrorMessage } from "../../utils/client.ts";

export const apiRequestBlock: AppBlock = {
  name: "Run API Request",
  description:
    "Makes an authenticated request to any Sentry API endpoint. Useful as an escape hatch for endpoints not covered by a dedicated block.",
  category: "Request",

  inputs: {
    default: {
      name: "Request",
      description: "Perform the API request and emit Sentry's response.",
      config: {
        method: {
          name: "Method",
          description: "HTTP method to use.",
          type: { enum: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
          required: true,
          default: "GET",
        },
        path: {
          name: "Path",
          description:
            "API path as documented in the Sentry API (e.g. /api/0/organizations/).",
          type: "string",
          required: true,
        },
        body: {
          name: "Body",
          description:
            "Optional JSON body. Ignored for GET/DELETE unless the endpoint accepts one.",
          type: { type: "object", additionalProperties: true },
          required: false,
        },
        query: {
          name: "Query Parameters",
          description:
            "Optional object of query string parameters, merged with any included directly in the path.",
          type: { type: "object", additionalProperties: true },
          required: false,
        },
      },
      onEvent: async (input) => {
        const cfg = input.event.inputConfig;
        const method = cfg.method as string;
        const path = cfg.path as string;
        const body = cfg.body;
        const query = cfg.query as Record<string, unknown> | undefined;

        const { baseUrl, authToken } = getCreds(input);
        const url = new URL(
          path.startsWith("/") ? path : `/${path}`,
          `${baseUrl}/`,
        );
        if (query) {
          for (const [k, v] of Object.entries(query)) {
            if (v != null) url.searchParams.set(k, String(v));
          }
        }

        const headers: Record<string, string> = {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        };
        let serialized: string | undefined;
        if (body !== undefined) {
          headers["Content-Type"] = "application/json";
          serialized = JSON.stringify(body);
        }

        const res = await fetch(url.toString(), {
          method,
          headers,
          body: serialized,
        });

        const contentType = res.headers.get("content-type") ?? "";
        const isJson = contentType.includes("application/json");
        const parsed = isJson ? await res.json() : await res.text();

        if (!res.ok) {
          await events.emit({
            ok: false,
            status: res.status,
            body: parsed,
            message: extractErrorMessage(parsed, parsed || res.statusText),
          });
          return;
        }

        await events.emit({ ok: true, status: res.status, body: parsed });
      },
    },
  },

  outputs: {
    default: {
      name: "Response",
      description: "Parsed response body and HTTP status from the Sentry API.",
      default: true,
      type: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          status: { type: "number" },
          body: {},
          message: { type: "string" },
        },
        required: ["ok", "status"],
        additionalProperties: true,
      },
    },
  },
};
