import { cookies } from "next/headers";
import { validateAccessToken } from "./token";
import type { JwtPayload } from "jsonwebtoken";

export async function checkSession(): Promise<JwtPayload | Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) {
    return new Response(null, {
      status: 307,
      headers: { Location: "/api/me/refresh" },
    });
  }

  const payload = validateAccessToken(token);
  if (!payload) {
    return new Response(null, {
      status: 307,
      headers: { Location: "/api/me/refresh" },
    });
  }


  return payload
}
