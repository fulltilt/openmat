"use server";

import { lt, sql } from "drizzle-orm";
import { db } from "./db";
import { openMat, verificationTokens } from "./db/schema";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

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

export async function sendEmail(evt) {
  console.log(evt);
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM, // sender address
    to: process.env.EMAIL_FROM, // list of receivers
    subject: "New Open Mat Request", // Subject line
    text: JSON.stringify(evt), // plain text body
    html: JSON.stringify(evt), // html body
  });

  console.log("Message sent: %s", info.messageId);
}
