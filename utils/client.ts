import type { AppInput } from "@slflows/sdk/v1";

export interface SentryCreds {
  baseUrl: string;
  authToken: string;
  webhookClientSecret: string;
}

export function getCreds(input: AppInput): SentryCreds {
  return {
    baseUrl: (input.app.config.baseUrl as string).replace(/\/+$/, ""),
    authToken: input.app.config.authToken as string,
    webhookClientSecret: input.app.config.webhookClientSecret as string,
  };
}

export function getClientOptions(input: AppInput) {
  const { baseUrl, authToken } = getCreds(input);
  return {
    baseUrl,
    headers: { Authorization: `Bearer ${authToken}` },
  };
}
