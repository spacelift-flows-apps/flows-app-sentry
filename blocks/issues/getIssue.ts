import { type AppBlock, events } from "@slflows/sdk/v1";
import { retrieveAnIssue } from "@sentry/api";
import {
  getCreds,
  getClientOptions,
  extractErrorMessage,
} from "../../utils/client.ts";
import { issueDetailSchema } from "./schemas.ts";

export const getIssueBlock: AppBlock = {
  name: "Get Issue",
  description: "Returns details on an individual issue",
  category: "Issues",

  inputs: {
    default: {
      name: "Request",
      description: "Fetch the issue from Sentry and emit its details.",
      config: {
        issueId: {
          name: "Issue ID",
          description:
            "The Sentry issue ID (numeric) or short ID (e.g. PROJECT-123).",
          type: "string",
          required: true,
        },
      },
      onEvent: async (input) => {
        const issueId = input.event.inputConfig.issueId as string;
        const { organizationSlug } = getCreds(input);

        const result = await retrieveAnIssue({
          ...getClientOptions(input),
          path: {
            organization_id_or_slug: organizationSlug,
            issue_id: issueId,
          },
        });

        if (result.error) {
          throw new Error(
            `Sentry API error (${result.response.status}): ${extractErrorMessage(result.error, "unknown error")}`,
          );
        }

        await events.emit(result.data);
      },
    },
  },

  outputs: {
    default: {
      name: "Issue",
      description: "The Sentry issue details.",
      default: true,
      type: issueDetailSchema,
    },
  },
};
