'use server';

import { cookies } from "next/headers";
import { error, success } from "@/utils/message";
import db from "@/db";

export async function GET() {
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get("session")?.value;

  if (sessionToken) {
    try {
      await db.session.revoke(sessionToken);
    } catch (err) {
      console.error("Failed to revoke session:", err);
      return Response.json(error("failed to logout"), { status: 500 });
    }
  }

  cookieStore.delete("session");
  cookieStore.delete("access");

  return Response.json(success("logged out", {}));
}

