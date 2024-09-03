"use server";

import { clearStaleTokens } from "../../../server/queries";

export const clearTokens = async () => {
  try {
    await clearStaleTokens();
  } catch (error) {
    throw error;
  }
};
