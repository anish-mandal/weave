'use server';

import * as Yup from "yup";
import type IUser from "@/types/user";
import { hash } from "bcryptjs";
import db from "@/db";
import { success, error } from "@/utils/message";
import { cookies } from "next/headers";

const userSchema = Yup.object<IUser>({
  userName: Yup.string().required("User Name is required"),
  fullName: Yup.string()
  .max(100, "Full name is too long")
  .min(2, "Full name is too Short")
  .required("Full Name is required")
  .matches(/^[\p{L}][\p{L}'\- ]*$/u, "Enter a valid full name"),
  email: Yup.string().email("Please enter a valid email").required("Email is required"),
  dateOfBirth: Yup.date().max(Date(), "Please enter a valid date of birth").required("Date of birth is required"),
  phoneCode: Yup.mixed().oneOf(["+91"] as const),
  phoneNumber: Yup.string()
  .min(10, "Please enter a valid phone number")
  .required("Phone Number is required")
  .matches(/^\d{10}$/, "Please enter a valid phone number"),
  password: Yup.string().min(8, "Password must contain minimum 8 characters").required("Password is required").test({
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
    return Response.json(
      error("already logged in"),
      { status: 409 }
    );
  }

  try {
    body = await req.json();
  } catch (e) {
    return Response.json(error("invalid json"), { status: 422 })
  }

  try {
    user = (await userSchema.validate(body) as IUser);
  } catch (e) {
    if (e instanceof Yup.ValidationError) {
      return Response.json(error(e.message), { status: 400 })
    }

    return Response.json(error("validation failed"), { status: 400 })
  }

  const existingUser = await db.user.confirm(user.email, user.userName);
  if (existingUser) {
    return Response.json(error("user already exist"), { status: 409 })
  }

  try {
    user.password = await hash(user.password, 10)
  } catch (e) {
    return Response.json(error("unable to hash password"), { status: 500 })
  }

  try {
    await db.user.create(user);

    return Response.json(success("user created", {}))
  } catch (e) {
    console.log(e)
    return Response.json(error("unable to create user"), { status: 500 })
  }
}

