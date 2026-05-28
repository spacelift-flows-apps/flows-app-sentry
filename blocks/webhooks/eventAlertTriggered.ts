import { type AppBlock, events } from "@slflows/sdk/v1";
import { eventAlertWebhookSchema } from "./schemas.ts";

export const eventAlertTriggeredBlock: AppBlock = {
  name: "Alert Triggered",
  description: "Triggers when a Sentry alert rule fires.",
  category: "Events",
  entrypoint: true,

  onInternalMessage: async (input) => {
    await events.emit(input.message.body);
  },

  outputs: {
    default: {
      name: "Event",
      description: "The Sentry event alert webhook payload.",
      default: true,
      type: eventAlertWebhookSchema,
    },
  },
};
