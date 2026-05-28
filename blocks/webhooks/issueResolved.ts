import { type AppBlock, events } from "@slflows/sdk/v1";
import { issueWebhookSchema } from "./schemas.ts";

export const issueResolvedBlock: AppBlock = {
  name: "Issue Resolved",
  description: "Triggers when a Sentry issue is resolved.",
  category: "Events",
  entrypoint: true,

  onInternalMessage: async (input) => {
    await events.emit(input.message.body);
  },

  outputs: {
    default: {
      name: "Event",
      description: "The Sentry issue webhook payload.",
      default: true,
      type: issueWebhookSchema,
    },
  },
};
