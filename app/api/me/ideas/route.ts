import db from "@/db";
import { checkSession } from "@/utils/session";
import { success } from "@/utils/message";

export async function GET() {
  const session = await checkSession();
  if (session instanceof Response) {
    return session;
  }

  const ideas = await db.idea.viewByUserId(session.sub!);

  return Response.json(success("got ideas", ideas));
}
