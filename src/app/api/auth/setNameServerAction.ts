"use server";

import { updateUsername } from "~/server/queries";
import { auth } from "./authConfig";

export const setName = async (name: string) => {
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
  name = name.trim();

  // Update the user's name in the database
  await updateUsername(uuid, name);

  return true;
};
