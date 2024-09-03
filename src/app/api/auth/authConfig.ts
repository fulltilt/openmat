/* eslint-disable */
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
// import Nodemailer from "next-auth/providers/nodemailer";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  user,
  verificationTokens,
} from "~/server/db/schema";
import { clearTokens } from "./clearStaleTokensServerAction";
// import { setName } from "@/src/lib/auth/setNameServerAction";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  secret: process.env.AUTH_SECRET, // Used to sign the session cookie so AuthJS can verify the session
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds (this value is also the default)
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/auth-success",
    error: "/auth/auth-error",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      allowDangerousEmailAccountLinking: true, // Allow automatic linking of users table to accounts table in database - not dangerous when used with OAuth providers that already perform email verification (like Google)
    }),
    // Nodemailer({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: parseInt(process.env.EMAIL_SERVER_PORT!, 10),
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (trigger === "update" && session?.name !== token.name) {
        token.name = session.name;

        try {
          //   await setName(token.name);
        } catch (error) {
          console.error("Failed to set user name:", error);
        }
      }

      if (user) {
        await clearTokens(); // Clear up any stale verification tokens from the database after a successful sign in
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("session callback", { session, token });
      console.log("session callback");
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
