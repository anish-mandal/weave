import db from "@/db";
import { error, success } from "@/utils/message";
import { checkSession } from "@/utils/session";

export async function GET(_: Request, { params }: { params: Promise<{ username: string }> }) {
  await checkSession();
  const { username } = await params;

  if (!username) {
    return Response.json(error("username is required"), { status: 400 });
  }

  const user = await db.user.getByUserName(username);

  if (!user) {
    return Response.json(error("user not found"), { status: 404 });
  }

  return Response.json(
    success("user found", {
      user: {
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    })
  );
}

