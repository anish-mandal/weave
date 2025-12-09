import { cookies } from "next/headers";
import { error, success } from "@/utils/message";
import { validateAccessToken } from "@/utils/token";
import db from "@/db";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access")?.value;

  if (!accessToken) {
    return new Response(null, {
      status: 307,
      headers: { Location: "/api/me/refresh" }
    });
  }

  const jwtResult = validateAccessToken(accessToken);
  if (!jwtResult) {
    return Response.json(error("invalid or expired access token"), { status: 401 });
  }

  const user = await db.user.getById(jwtResult.sub);

  return Response.json(
    success("ok", {
      user: {
        userName: user.userName,
        fullName: user.fullName,
        email: user.email,
      }
    })
  );
}

