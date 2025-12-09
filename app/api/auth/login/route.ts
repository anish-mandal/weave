'use server';

import { cookies } from "next/headers";
import { compare } from "bcryptjs"
import { error, success } from "@/utils/message";
import db from "@/db";
import { object, string, ValidationError } from "yup";
import { generateAccessToken } from "@/utils/token";

interface LoginSchema {
  email: string,
  password: string
}

const userLoginSchema = object<LoginSchema>({
  email: string().email("Invalid email").required("Email is required"),
  password: string().min(8, "Password must contain minimum 8 characters").required("Password is required").test({
    name: "is-strong",
    test(value, ctx) {
      if (!/[A-Z]/.test(value)) return ctx.createError({ message: "Password must include a uppercase letter" });
      if (!/[a-z]/.test(value)) return ctx.createError({ message: "Password must include a lowercase letter" });
      if (!/\d/.test(value)) return ctx.createError({ message: "Password must include a number" });
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return ctx.createError({ message: "Password must include a special character" });
      return true;
    }
  })

})

export async function POST(req: Request) {
  let user, body;
  const cookieStore = await cookies();

  const existingAccess = cookieStore.get("access");
  const existingSession = cookieStore.get("session");

  if (existingAccess || existingSession) {
    return Response.json(success("Already logged in", {}));
  }

  try {
    body = await req.json();
  } catch (e) {
    return Response.json(error("Invalid JSON"), { status: 422 })
  }

  try {
    body = await userLoginSchema.validate(body) as LoginSchema;
  } catch (e) {
    if (e instanceof ValidationError) {
      return Response.json(error(e.message), { status: 400 })
    }

    return Response.json(error("Validation failed"), { status: 400 })
  }

  user = await db.user.getByEmail(body.email);
  if (!user) {
    return Response.json(error("User not found"), { status: 400 })
  }

  const match = await compare(body.password, user.password);
  if (match) {
    const { token, expiresAt } = await db.session.create(user._id);
    const accessToken = generateAccessToken(user._id.toString());

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      expires: expiresAt
    });

    cookieStore.set("access", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15
    })

    return Response.json(success("Authorized", {}))
  } else {
    return Response.json(error("Email or Password incorrect"), { status: 401 })
  }
}

