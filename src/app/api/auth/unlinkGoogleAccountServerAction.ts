"use server";

import { unlinkAccount } from "~/server/queries";
import { auth } from "./authConfig";

// Deletes the user's Google account record from the database
export const unlinkGoogleAccount = async () => {
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

  // Remove the Google account from the database
  try {
    await unlinkAccount("google", uuid);
    return true;
  } catch (error) {
    console.error("Failed to unlink Google account:", error);
  }
};
