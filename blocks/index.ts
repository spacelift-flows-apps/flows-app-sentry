import type { AppBlock } from "@slflows/sdk/v1";
import { apiRequestBlock } from "./requests/apiRequest.ts";

export const blocks: Record<string, AppBlock> = {
  apiRequest: apiRequestBlock,
};
