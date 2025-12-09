import { model, models, Schema, Types } from "mongoose";
import { connectDB } from "../connect";

interface IIdea {
  title: string
  description: string,
  author: Types.ObjectId,
  likes: number,
  status: "draft" | "published" | "archived"
}

const ideaSchema = new Schema<IIdea>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
}, { timestamps: true });

export const Idea = models.Idea || model<IIdea>("Idea", ideaSchema);


interface CreateIdeaInput {
  title: string;
  description: string;
  authorId: string;
}

export async function createIdea(data: CreateIdeaInput) {
  await connectDB();

  const { title, description, authorId } = data;

  const idea = await Idea.create({
    title,
    description,
    author: authorId,
  });

  return idea;
}

export async function viewAllIdeas() {
  await connectDB();

  const ideas = await Idea.find()
    .populate("author", "userName")
    .sort({ createdAt: -1 });

  return ideas;
}

export async function viewAllIdeasByUserId(userId: string) {
  await connectDB();

  const ideas = await Idea.find({
    "author": userId
  }, "-author -__v");

  return ideas
}
