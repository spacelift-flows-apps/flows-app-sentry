// Derived from the RetrieveAnIssueResponses["200"] type in @sentry/api,
// plus fields present in API/webhook responses but not in the SDK types.
// If more schemas are needed, consider generating them with
// ts-json-schema-generator.

export const issueDetailSchema = {
  type: "object" as const,
  properties: {
    activity: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          data: {
            type: "object" as const,
            additionalProperties: true,
          },
          dateCreated: {
            type: "string" as const,
          },
          id: {
            type: "string" as const,
          },
          type: {
            type: "string" as const,
          },
          user: {
            type: "object" as const,
            additionalProperties: true,
          },
        },
      },
    },
    annotations: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          displayName: {
            type: "string" as const,
          },
          url: {
            type: "string" as const,
          },
        },
      },
    },
    assignedTo: {
      type: "object" as const,
      additionalProperties: true,
    },
    count: {
      type: "string" as const,
    },
    culprit: {
      type: "string" as const,
    },
    firstRelease: {
      type: "object" as const,
      properties: {
        authors: {
          type: "array" as const,
          items: {
            type: "string" as const,
          },
        },
        commitCount: {
          type: "number" as const,
        },
        data: {
          type: "object" as const,
          additionalProperties: true,
        },
        dateCreated: {
          type: "string" as const,
        },
        dateReleased: {
          type: "string" as const,
        },
        deployCount: {
          type: "number" as const,
        },
        firstEvent: {
          type: "string" as const,
        },
        lastCommit: {
          type: "string" as const,
        },
        lastDeploy: {
          type: "string" as const,
        },
        lastEvent: {
          type: "string" as const,
        },
        newGroups: {
          type: "number" as const,
        },
        owner: {
          type: "string" as const,
        },
        projects: {
          type: "array" as const,
          items: {
            type: "object" as const,
            properties: {
              name: {
                type: "string" as const,
              },
              slug: {
                type: "string" as const,
              },
            },
          },
        },
        ref: {
          type: "string" as const,
        },
        shortVersion: {
          type: "string" as const,
        },
        url: {
          type: "string" as const,
        },
        version: {
          type: "string" as const,
        },
      },
    },
    firstSeen: {
      type: "string" as const,
    },
    hasSeen: {
      type: "boolean" as const,
    },
    id: {
      type: "string" as const,
    },
    isBookmarked: {
      type: "boolean" as const,
    },
    isPublic: {
      type: "boolean" as const,
    },
    isSubscribed: {
      type: "boolean" as const,
    },
    lastRelease: {
      type: "object" as const,
      additionalProperties: true,
    },
    lastSeen: {
      type: "string" as const,
    },
    level: {
      type: "string" as const,
    },
    logger: {
      type: "string" as const,
    },
    metadata: {
      type: "object" as const,
      properties: {
        filename: {
          type: "string" as const,
        },
        type: {
          type: "string" as const,
        },
        value: {
          type: "string" as const,
        },
        title: {
          type: "string" as const,
        },
      },
      additionalProperties: true,
    },
    numComments: {
      type: "number" as const,
    },
    participants: {
      type: "array" as const,
      items: {
        type: "object" as const,
        additionalProperties: true,
      },
    },
    permalink: {
      type: "string" as const,
    },
    pluginActions: {
      type: "array" as const,
      items: {
        type: "array" as const,
        items: {
          type: "string" as const,
        },
      },
    },
    pluginContexts: {
      type: "array" as const,
      items: {
        type: "string" as const,
      },
    },
    pluginIssues: {
      type: "array" as const,
      items: {
        type: "object" as const,
        additionalProperties: true,
      },
    },
    project: {
      type: "object" as const,
      properties: {
        id: {
          type: "string" as const,
        },
        name: {
          type: "string" as const,
        },
        slug: {
          type: "string" as const,
        },
      },
    },
    seenBy: {
      type: "array" as const,
      items: {
        type: "object" as const,
        additionalProperties: true,
      },
    },
    shareId: {
      type: "string" as const,
    },
    shortId: {
      type: "string" as const,
    },
    stats: {
      type: "object" as const,
      properties: {
        "24h": {
          type: "array" as const,
          items: {
            type: "array" as const,
            items: {
              type: "number" as const,
            },
          },
        },
        "30d": {
          type: "array" as const,
          items: {
            type: "array" as const,
            items: {
              type: "number" as const,
            },
          },
        },
      },
    },
    status: {
      type: "string" as const,
      enum: ["resolved", "unresolved", "ignored"],
    },
    statusDetails: {
      type: "object" as const,
      additionalProperties: true,
    },
    subscriptionDetails: {
      type: "object" as const,
      additionalProperties: true,
    },
    tags: {
      type: "array" as const,
      items: {
        type: "object" as const,
        additionalProperties: true,
      },
    },
    title: {
      type: "string" as const,
    },
    type: {
      type: "string" as const,
    },
    userCount: {
      type: "number" as const,
    },
    userReportCount: {
      type: "number" as const,
    },
    isUnhandled: {
      type: "boolean" as const,
    },
    issueCategory: {
      type: "string" as const,
    },
    issueType: {
      type: "string" as const,
    },
    priority: {
      type: "string" as const,
    },
    substatus: {
      type: "string" as const,
    },
    url: {
      type: "string" as const,
      description: "API URL for this issue.",
    },
    webUrl: {
      type: "string" as const,
      description: "Browser URL for this issue (web_url in webhook payloads).",
    },
    projectUrl: {
      type: "string" as const,
      description:
        "Browser URL for the project's issue list (project_url in webhook payloads).",
    },
  },
  required: [
    "activity",
    "annotations",
    "assignedTo",
    "count",
    "culprit",
    "firstRelease",
    "firstSeen",
    "hasSeen",
    "id",
    "isBookmarked",
    "isPublic",
    "isSubscribed",
    "lastRelease",
    "lastSeen",
    "level",
    "logger",
    "metadata",
    "numComments",
    "participants",
    "permalink",
    "pluginActions",
    "pluginContexts",
    "pluginIssues",
    "project",
    "seenBy",
    "shareId",
    "shortId",
    "stats",
    "status",
    "statusDetails",
    "subscriptionDetails",
    "tags",
    "title",
    "type",
    "userCount",
    "userReportCount",
  ],
  additionalProperties: true,
};
