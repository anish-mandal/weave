import { model, models, Schema } from "mongoose";
import { connectDB } from "../connect";
import type { Types } from "mongoose";
import type IUser from "@/types/user";

const userSchema = new Schema<IUser>({
  userName: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, minlength: 2, maxlength: 100, },
  email: { type: String, required: true, unique: true, index: true, lowercase: true },
  dateOfBirth: { type: Date, required: true, max: Date.now() },
  phoneCode: { type: String, enum: ["+91"], default: "+91" },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true, minlength: 8 }
}, { timestamps: true });

const User = models.User || model<IUser>("User", userSchema);

export async function createUser(user: IUser) {
  await connectDB();

  await User.create(user);
}

export async function userGetById(objectId: string | Types.ObjectId) {
  await connectDB();

  const res = await User.findOne({ _id: objectId })
  return res
}

export async function userGetByEmail(email: string) {
  await connectDB();

  const res = await User.findOne({ email: email })
  return res
}

export async function userConfirm(email: string, userName: string) {
  await connectDB();

  const res = await User.findOne({ email: email, userName: userName });

  if (res)
    return true
    else return false
}

export async function userGetByUserName(userName: string) {
  await connectDB();

  const res = await User.findOne({ userName: userName })
  return res
}
