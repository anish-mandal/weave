import { models, model, Schema } from "mongoose";
import type { Types } from "mongoose";
import { randomBytes } from "crypto";
import { hash, compare } from "bcryptjs";
import ISession from "@/types/session";
import { connectDB } from "../connect";

const sessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  prefix: { type: String, required: true, index: true },
  secretHash: { type: String, required: true },
  expiresAt: Date,
  revokedAt: { type: Date, default: null }
}, { timestamps: true });

const Session = models.Session || model<ISession>("Session", sessionSchema);

export async function createSession(userId: Types.ObjectId) {
  const prefix = randomBytes(6).toString("hex");
  const secret = randomBytes(32).toString("hex");
  const token = `${prefix}.${secret}`;
  const secretHash = await hash(secret, 12);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await Session.create({
    userId,
    prefix,
    secretHash,
    expiresAt,
  });

  return { token, expiresAt };
}

export async function validateSession(token: string) {
  await connectDB();

  if (!token) return null;

  const [prefix, secret] = token.split(".");
  if (!prefix || !secret) return null;

  const session = await Session.findOne({ prefix });
  if (!session) return null;

  if (session.revokedAt) return null;

  if (session.expiresAt < new Date()) return null;

  const match = await compare(secret, session.secretHash);
  if (!match) return null;

  return session;
}


export async function revokeSession(token: string) {
  const [prefix, secret] = token.split(".");
  if (!prefix || !secret) return false;

  const session = await Session.findOne({ prefix });
  if (!session) return false;

  const valid = await compare(secret, session.secretHash);
  if (!valid) return false;

  session.revokedAt = new Date();
  await session.save();

  return true;
}



