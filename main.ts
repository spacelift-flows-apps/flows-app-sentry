import { defineApp } from "@slflows/sdk/v1";
import { listYourOrganizations } from "@sentry/api";
import { blocks } from "./blocks/index.ts";
import { getCreds, getClientOptions } from "./utils/client.ts";

const installationInstructions = `## Setup

1. Fill in your Sentry URL (e.g. \`https://my-org.sentry.io\`).

2. In Sentry, go to **Settings > Developer Settings > Custom Integrations** and click **New Internal Integration**.
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

3. Confirm the app.

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

  onSync: async (input) => {
    const { baseUrl } = getCreds(input);

    if (!/^https?:\/\//.test(baseUrl)) {
      return {
        newStatus: "failed",
        customStatusDescription:
          "Sentry URL must be an absolute http(s) URL (e.g. https://my-org.sentry.io).",
      };
    }

    const response = await listYourOrganizations({
      ...getClientOptions(input),
      throwOnError: false,
    });

    if (response.error) {
      return {
        newStatus: "failed",
        customStatusDescription: `Could not validate Sentry auth token: ${(response.error as any).detail ?? response.error}`,
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
