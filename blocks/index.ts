import type { AppBlock } from "@slflows/sdk/v1";
import { apiRequestBlock } from "./requests/apiRequest.ts";
import { rawWebhookBlock } from "./webhooks/rawWebhook.ts";
import { getIssueBlock } from "./issues/getIssue.ts";
import { updateIssueBlock } from "./issues/updateIssue.ts";

export const blocks: Record<string, AppBlock> = {
  apiRequest: apiRequestBlock,
  rawWebhook: rawWebhookBlock,
  getIssue: getIssueBlock,
  updateIssue: updateIssueBlock,
};
