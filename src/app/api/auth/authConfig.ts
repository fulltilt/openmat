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
      authorization: {
        params: {
          scope: "https://www.googleapis.com/auth/calendar openid",
        },
      },
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
    async jwt({ token, user, session, trigger, account }) {
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
        console.log("account", account);
        return {
          ...token,
          id: user.id,
          access_token: account?.access_token,
          expires_at: account?.expires_at,
          refresh_token: account?.refresh_token,
        };
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError("Missing refresh_token");
        console.log("token", token);
        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: "refresh_token",
              refresh_token: token.refresh_token!,
            }),
          });

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          token.access_token = newTokens.access_token;
          token.expires_at = Math.floor(
            Date.now() / 1000 + newTokens.expires_in,
          );
          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          if (newTokens.refresh_token)
            token.refresh_token = newTokens.refresh_token;
          return token;
        } catch (error) {
          console.error("Error refreshing access_token", error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError";
          return token;
        }
      }
    },
    async session({ session, token }) {
      console.log("session callback");
      // console.log(token);
      return {
        ...session,
        access_token: token.access_token,
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
