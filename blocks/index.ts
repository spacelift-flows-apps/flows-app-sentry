import type { AppBlock } from "@slflows/sdk/v1";
import { apiRequestBlock } from "./requests/apiRequest.ts";
import { rawWebhookBlock } from "./webhooks/rawWebhook.ts";

export const blocks: Record<string, AppBlock> = {
  apiRequest: apiRequestBlock,
  rawWebhook: rawWebhookBlock,
};
