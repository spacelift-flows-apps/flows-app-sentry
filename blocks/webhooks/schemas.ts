import { issueDetailSchema } from "../issues/schemas.ts";

export const actorSchema = {
  type: "object" as const,
  properties: {
    id: { type: "string" as const },
    name: { type: "string" as const },
    type: {
      type: "string" as const,
      description: "user | application | Sentry",
    },
  },
  additionalProperties: true,
};

export const webhookEventBase = {
  type: "object" as const,
  properties: {
    action: { type: "string" as const },
    installation: {
      type: "object" as const,
      properties: { uuid: { type: "string" as const } },
      required: ["uuid"],
    },
    data: { type: "object" as const, additionalProperties: true },
    actor: actorSchema,
  },
  required: ["action", "installation", "data"],
  additionalProperties: true,
};

export const issueWebhookSchema = {
  ...webhookEventBase,
  properties: {
    ...webhookEventBase.properties,
    data: {
      type: "object" as const,
      properties: { issue: issueDetailSchema },
      required: ["issue"],
      additionalProperties: true,
    },
  },
};

export const eventAlertWebhookSchema = {
  ...webhookEventBase,
  properties: {
    ...webhookEventBase.properties,
    data: {
      type: "object" as const,
      properties: {
        event: {
          type: "object" as const,
          properties: {
            event_id: { type: "string" as const },
            title: { type: "string" as const },
            culprit: { type: "string" as const },
            level: { type: "string" as const },
            platform: { type: "string" as const },
            datetime: { type: "string" as const },
            location: { type: "string" as const },
            release: { type: "string" as const },
            logger: { type: "string" as const },
            message: { type: "string" as const },
            issue_id: { type: "string" as const },
            issue_url: {
              type: "string" as const,
              description: "API URL for the related issue.",
            },
            url: {
              type: "string" as const,
              description: "API URL for this event.",
            },
            web_url: {
              type: "string" as const,
              description: "Browser URL for this event.",
            },
            tags: { type: "array" as const },
            contexts: {
              type: "object" as const,
              additionalProperties: true,
            },
            user: { type: "object" as const, additionalProperties: true },
            exception: {
              type: "object" as const,
              additionalProperties: true,
            },
            metadata: {
              type: "object" as const,
              additionalProperties: true,
            },
            sdk: { type: "object" as const, additionalProperties: true },
          },
          additionalProperties: true,
        },
        triggered_rule: { type: "string" as const },
      },
      required: ["event"],
      additionalProperties: true,
    },
  },
};
