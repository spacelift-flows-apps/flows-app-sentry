import { type AppBlock, events } from "@slflows/sdk/v1";

const RESOURCE_TYPES = [
  { value: "issue", label: "issue" },
  { value: "event_alert", label: "event_alert" },
  { value: "metric_alert", label: "metric_alert" },
  { value: "comment", label: "comment" },
  { value: "error", label: "error" },
  { value: "installation", label: "installation" },
];

export const rawWebhookBlock: AppBlock = {
  name: "Any Event",
  description: "Receives any webhook event from Sentry (escape hatch).",
  category: "Events",
  entrypoint: true,

  config: {
    resource: {
      name: "Resource",
      description:
        "Filter by Sentry-Hook-Resource header value. Leave empty to receive all resources.",
      type: "string" as const,
      required: false,
      suggestValues: async (input: { searchPhrase?: string }) => {
        const values = RESOURCE_TYPES;
        if (input.searchPhrase) {
          const search = input.searchPhrase.toLowerCase();
          return {
            suggestedValues: values.filter((v) =>
              v.label.toLowerCase().includes(search),
            ),
          };
        }
        return { suggestedValues: values };
      },
    },
    action: {
      name: "Action",
      description:
        "Filter by the event's action field (e.g. created, resolved, triggered). Leave empty to receive all actions.",
      type: "string" as const,
      required: false,
    },
  },

  onInternalMessage: async (input) => {
    const message = input.message.body as {
      resource?: string;
      action?: string;
      headers: Record<string, string>;
      body: Record<string, unknown>;
    };

    const resourceFilter = input.block.config.resource as string | undefined;
    const actionFilter = input.block.config.action as string | undefined;

    if (resourceFilter && message.resource !== resourceFilter) return;
    if (actionFilter && message.action !== actionFilter) return;

    await events.emit(message);
  },

  outputs: {
    default: {
      name: "Event",
      description:
        "The raw Sentry webhook event envelope (resource, action, headers, and body).",
      default: true,
      type: {
        type: "object",
        properties: {
          resource: {
            type: "string",
            description: "Sentry-Hook-Resource header value.",
          },
          action: {
            type: "string",
            description: "Body action field (e.g. created, resolved).",
          },
          headers: {
            type: "object",
            additionalProperties: { type: "string" },
          },
          body: { type: "object", additionalProperties: true },
        },
        required: ["headers", "body"],
      },
    },
  },
};
