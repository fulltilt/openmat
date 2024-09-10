import { lt, sql } from "drizzle-orm";
import { db } from "./db";
import { openMat, verificationTokens } from "./db/schema";

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

export async function getOpenMats() {
  return await db.select().from(openMat).execute();
}

export async function addOpenMat(
  id: string,
  name: string,
  location: string,
  lat: number,
  lng: number,
) {
  await db.insert(openMat).values({ id, name, location, lat, lng });
}
