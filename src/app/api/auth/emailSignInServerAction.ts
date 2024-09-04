"use server";

import { signIn } from "./authConfig";

export const handleEmailSignIn = async (email: string) => {
  try {
    await signIn("nodemailer", { email, callbackUrl: "/home" });
  } catch (error) {
    throw error;
  }
};
