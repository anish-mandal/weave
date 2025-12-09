'use server';

import { cookies } from "next/headers";
import { error, success } from "@/utils/message";
import { generateAccessToken } from "@/utils/token";
import db from "@/db";

export async function GET() {
  const cookieStore = await cookies();

  let presentAccessToken = cookieStore.get("access");
  if (presentAccessToken) {
    return Response.json(null, { status: 204 })
  }

  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) {
    return Response.json(error("missing session cookie"), { status: 401 });
  }

  const session = await db.session.validate(sessionToken);
  if (!session) {
    return Response.json(error("invalid, expired, or revoked session"), { status: 401 });
  }

  const user = await db.user.getById(session.userId);
  if (!user) {
    return Response.json(error("user not found"), { status: 404 });
  }

  const accessToken = generateAccessToken(user._id.toString());

  cookieStore.set("access", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });

  return Response.json(success("refreshed", {}));
}

