import {
  defineApp,
  blocks as blocksDef,
  http,
  messaging,
} from "@slflows/sdk/v1";
import { listYourOrganizations } from "@sentry/api";
import { blocks } from "./blocks/index.ts";
import {
  getCreds,
  getClientOptions,
  extractErrorMessage,
} from "./utils/client.ts";
import { verifySignature } from "./utils/signature.ts";

const installationInstructions = `## Setup

1. Fill in your Sentry URL (e.g. \`https://my-org.sentry.io\`).

2. Fill in your **Organization Slug** — visible in Sentry under **Settings > General Settings**.

3. In Sentry, go to **Settings > Developer Settings > Custom Integrations** and click **New Internal Integration**.
   - **Name**: e.g. "Spacelift Flows".
   - **Webhook URL**: \`{appEndpointUrl}/webhook\`
   - **Permissions** — minimum recommended:
     - Issue & Event: Read & Write
     - Project: Read
     - Organization: Read
   - **Alert Rule Action** — enable to react to alert-rule triggers.
   - **Webhooks** — enable **issue** to react to issue lifecycle events (created, resolved, etc.).
   - Save and copy the **Client Secret** into the **Webhook Client Secret** field.
   - Under **Tokens**, click **New Token** and copy the token into the **Auth Token** field (shown once).

4. Confirm the app.

If you rotate the token in Sentry, update it here and re-sync.`;

export const app = defineApp({
  name: "Sentry Integration",
  installationInstructions,

  blocks,

  config: {
    baseUrl: {
      name: "Sentry URL",
      description: "Your Sentry URL (e.g. https://my-org.sentry.io).",
      type: "string",
      required: true,
    },
    // Internal Integration tokens are org-scoped, but the org slug can't be
    // derived from the base URL (e.g. https://sentry.io works for any org).
    organizationSlug: {
      name: "Organization Slug",
      description:
        "The slug of the Sentry organization this integration belongs to.",
      type: "string",
      required: true,
    },
    authToken: {
      name: "Auth Token",
      description:
        "Token from a Sentry Internal Integration. Follow the installation instructions to set this up.",
      type: "string",
      required: true,
      sensitive: true,
    },
    webhookClientSecret: {
      name: "Webhook Client Secret",
      description:
        "Client Secret from the same Sentry Internal Integration. Required to verify inbound webhook signatures.",
      type: "string",
      required: true,
      sensitive: true,
    },
  },

  http: {
    onRequest: async (input) => {
      if (
        input.request.method !== "POST" ||
        input.request.path !== "/webhook"
      ) {
        await http.respond(input.request.requestId, { statusCode: 404 });
        return;
      }

      const { webhookClientSecret } = getCreds(input);

      const sigKey = Object.keys(input.request.headers).find(
        (h) => h.toLowerCase() === "sentry-hook-signature",
      );
      const signature = sigKey ? input.request.headers[sigKey] : undefined;

      if (
        !signature ||
        !verifySignature(input.request.rawBody, signature, webhookClientSecret)
      ) {
        await http.respond(input.request.requestId, { statusCode: 401 });
        return;
      }

      const resourceKey = Object.keys(input.request.headers).find(
        (h) => h.toLowerCase() === "sentry-hook-resource",
      );
      const resource = resourceKey
        ? input.request.headers[resourceKey]
        : undefined;

      const body = JSON.parse(input.request.rawBody);
      const action = body.action as string | undefined;

      const rawBlocks = await blocksDef.list({ typeIds: ["rawWebhook"] });

      if (rawBlocks.blocks.length > 0) {
        await messaging.sendToBlocks({
          blockIds: rawBlocks.blocks.map((b) => b.id),
          body: { resource, action, headers: input.request.headers, body },
        });
      }

      // Typed blocks receive just the body (pre-filtered by resource+action).
      let typedTypeId: string | undefined;
      if (resource === "issue") {
        switch (action) {
          case "created":
            typedTypeId = "issueCreated";
            break;
          case "resolved":
            typedTypeId = "issueResolved";
            break;
          case "unresolved":
            typedTypeId = "issueUnresolved";
            break;
        }
      } else if (resource === "event_alert") {
        typedTypeId = "eventAlertTriggered";
      }

      if (typedTypeId) {
        const typed = await blocksDef.list({ typeIds: [typedTypeId] });
        if (typed.blocks.length > 0) {
          await messaging.sendToBlocks({
            blockIds: typed.blocks.map((b) => b.id),
            body,
          });
        }
      }

      await http.respond(input.request.requestId, { statusCode: 200 });
    },
  },

  onSync: async (input) => {
    const { baseUrl } = getCreds(input);

    if (!/^https?:\/\//.test(baseUrl)) {
      return {
        newStatus: "failed",
        customStatusDescription:
          "Sentry URL must be an absolute http(s) URL (e.g. https://my-org.sentry.io).",
      };
    }

    // This only serves to verify the connection. For custom integrations, this
    // endpoint returns [].
    const response = await listYourOrganizations({
      ...getClientOptions(input),
    });

    if (response.error) {
      return {
        newStatus: "failed",
        customStatusDescription: `Could not validate Sentry auth token: ${extractErrorMessage(response.error, String(response.error))}`,
      };
    }

    return {
      newStatus: "ready",
      customStatusDescription: null,
    };
  },

  onDrain: async () => {
    return { newStatus: "drained" };
  },
});
