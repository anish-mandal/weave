import db from "@/db";
import { checkSession } from "@/utils/session";
import { success, error } from "@/utils/message";
import { object, string, ValidationError } from "yup";

interface IdeaSchema {
  title: string,
  description: string,
}

const ideaCreationSchema = object<IdeaSchema>({
  title: string().required("title is required"),
  description: string().required("description is required"),
})

export async function GET() {
  const session = await checkSession();
  if (session instanceof Response) {
    return session;
  }

  const ideas = await db.idea.viewAll();

  return Response.json(success("got ideas", ideas));
}

export async function POST(req: Request) {
  const payload = await checkSession();
  if (payload instanceof Response) {
    return payload;
  }

  const userId = payload.sub!;
  let body;

  try {
    body = await req.json()
  } catch (e) {
    return Response.json(error("invalid json"), { status: 422 })
  }

  try {
    body = await ideaCreationSchema.validate(body) as IdeaSchema;
  } catch (e) {
    if (e instanceof ValidationError) {
      return Response.json(error(e.message), { status: 400 })
    }

    return Response.json(error("validation failed"), { status: 400 })
  }

  try {
    await db.idea.create({ title: body.title, description: body.description, authorId: userId });
  } catch (e) {
    return Response.json(error("something went wrong" + e), { status: 500 })
  }

  return Response.json(success("idea created", {}))
}
