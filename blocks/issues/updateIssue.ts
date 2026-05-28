import memoizee from "memoizee";
import { type AppBlock, events } from "@slflows/sdk/v1";
import {
  updateAnIssue,
  listAnOrganization_sMembers,
  listAnOrganization_sTeams,
} from "@sentry/api";
import {
  getCreds,
  getClientOptions,
  extractErrorMessage,
} from "../../utils/client.ts";
import { issueDetailSchema } from "./schemas.ts";

const ISSUE_STATUSES = [
  { value: "resolved", label: "Resolved" },
  { value: "resolvedInNextRelease", label: "Resolved in next release" },
  { value: "unresolved", label: "Unresolved" },
  { value: "ignored", label: "Ignored (archived)" },
];

async function fetchAssignees(
  baseUrl: string,
  authToken: string,
  organizationSlug: string,
) {
  const opts = {
    baseUrl,
    headers: { Authorization: `Bearer ${authToken}` },
    throwOnError: true as const,
    path: { organization_id_or_slug: organizationSlug },
  };

  const [members, teams] = await Promise.all([
    listAnOrganization_sMembers(opts),
    listAnOrganization_sTeams(opts),
  ]);

  const result: Array<{ label: string; value: string }> = [];

  for (const m of members.data ?? []) {
    const userId = (m.user as any)?.id;
    if (userId) {
      result.push({
        label: `${m.name} (${m.email})`,
        value: `user:${userId}`,
      });
    }
  }

  for (const t of teams.data ?? []) {
    result.push({
      label: `Team: ${t.name} (${t.slug})`,
      value: `team:${t.id}`,
    });
  }

  return result;
}

const getAssignees = memoizee(fetchAssignees, {
  maxAge: 60_000,
  promise: true,
});

export const updateIssueBlock: AppBlock = {
  name: "Update Issue",
  description:
    "Updates a Sentry issue (resolve, ignore, assign, bookmark, etc.).",
  category: "Issues",

  inputs: {
    default: {
      name: "Request",
      description: "Update the issue in Sentry and emit the updated details.",
      config: {
        issueId: {
          name: "Issue ID",
          description:
            "The Sentry issue ID (numeric) or short ID (e.g. PROJECT-123).",
          type: "string",
          required: true,
        },
        status: {
          name: "Status",
          description:
            "The new status for the issue. Leave empty to keep the current status.",
          type: "string" as const,
          required: false,
          suggestValues: async (input: { searchPhrase?: string }) => {
            let values = ISSUE_STATUSES;
            if (input.searchPhrase) {
              const search = input.searchPhrase.toLowerCase();
              values = values.filter((v) =>
                v.label.toLowerCase().includes(search),
              );
            }
            return { suggestedValues: values };
          },
        },
        statusDetails: {
          name: "Status Details",
          description:
            'Extra context for the status change, e.g. {"inNextRelease": true}, {"inRelease": "1.2.3"}, {"ignoreDuration": 30}.',
          type: { type: "object" as const, additionalProperties: true },
          required: false,
        },
        assignedTo: {
          name: "Assigned To",
          description:
            "Assign the issue to a user or team. Leave empty to keep the current assignee.",
          type: "string" as const,
          required: false,
          suggestValues: async (input: any) => {
            const { baseUrl, authToken, organizationSlug } = getCreds(input);
            if (!authToken || !organizationSlug) return { suggestedValues: [] };
            const values = await getAssignees(
              baseUrl,
              authToken,
              organizationSlug,
            );
            if (input.searchPhrase) {
              const search = input.searchPhrase.toLowerCase();
              return {
                suggestedValues: values
                  .filter((v) => v.label.toLowerCase().includes(search))
                  .slice(0, 50),
              };
            }
            return { suggestedValues: values.slice(0, 50) };
          },
        },
        isPublic: {
          name: "Public",
          description: "Set the issue to public or private.",
          type: "boolean",
          required: false,
        },
      },
      onEvent: async (input) => {
        const cfg = input.event.inputConfig;
        const issueId = cfg.issueId as string;
        const { organizationSlug } = getCreds(input);

        const body: Record<string, unknown> = {};
        if (cfg.status !== undefined) body.status = cfg.status;
        if (cfg.statusDetails !== undefined)
          body.statusDetails = cfg.statusDetails;
        if (cfg.assignedTo !== undefined) body.assignedTo = cfg.assignedTo;
        if (cfg.isPublic !== undefined) body.isPublic = cfg.isPublic;

        const result = await updateAnIssue({
          ...getClientOptions(input),
          path: {
            organization_id_or_slug: organizationSlug,
            issue_id: issueId,
          },
          body: body as any,
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
      description: "The updated Sentry issue details.",
      default: true,
      type: issueDetailSchema,
    },
  },
};
