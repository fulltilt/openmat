import { lt, sql } from "drizzle-orm";
import { db } from "./db";
import { verificationTokens } from "./db/schema";

export async function clearStaleTokens() {
  try {
    await db
      .delete(verificationTokens)
      .where(lt(verificationTokens.expires, sql`CURRENT_TIMESTAMP`));
  } catch (error) {
    throw error;
  }
}

export async function checkForExistingGoogleAccount(uuid: string) {
  try {
    const res = await db.execute(
      sql`SELECT EXISTS (SELECT 1 FROM accounts WHERE provider = 'google' AND \"userId\" = ${uuid})`,
    );
    return res.rows;
  } catch (err) {
    throw err;
  }
}
