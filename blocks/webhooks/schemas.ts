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
