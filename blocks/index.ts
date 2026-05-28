import type { AppBlock } from "@slflows/sdk/v1";
import { apiRequestBlock } from "./requests/apiRequest.ts";
import { rawWebhookBlock } from "./webhooks/rawWebhook.ts";
import { issueCreatedBlock } from "./webhooks/issueCreated.ts";
import { issueResolvedBlock } from "./webhooks/issueResolved.ts";
import { issueUnresolvedBlock } from "./webhooks/issueUnresolved.ts";
import { eventAlertTriggeredBlock } from "./webhooks/eventAlertTriggered.ts";
import { getIssueBlock } from "./issues/getIssue.ts";
import { updateIssueBlock } from "./issues/updateIssue.ts";

export const blocks: Record<string, AppBlock> = {
  apiRequest: apiRequestBlock,
  rawWebhook: rawWebhookBlock,
  issueCreated: issueCreatedBlock,
  issueResolved: issueResolvedBlock,
  issueUnresolved: issueUnresolvedBlock,
  eventAlertTriggered: eventAlertTriggeredBlock,
  getIssue: getIssueBlock,
  updateIssue: updateIssueBlock,
};
