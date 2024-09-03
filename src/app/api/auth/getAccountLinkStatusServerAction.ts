"use server";

import { checkForExistingGoogleAccount } from "~/server/queries";
import { auth } from "./authConfig";

export const getAccountLinkStatus = async () => {
  // Check if the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const uuid: string = session?.user?.id ?? "";

  // Sanitize input
  const uuidRegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (typeof uuid !== "string" || !uuidRegExp.test(uuid)) {
    throw new Error("Invalid UUID");
  }

  // Check if the user has a Google account linked
  try {
    const result = await checkForExistingGoogleAccount(uuid);
    // console.log(result);
    if (!result?.[0]) {
      return false;
    }
  } catch (error) {
    console.error("Failed to check if user has Google account linked:", error);
  }

  return true;
};
