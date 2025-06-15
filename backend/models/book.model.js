import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    title:  { type: String },
    author: { type: String },
    genre:  { type: String },
    status: { type: Boolean, default: false },
    rating: { type: Number },
    review: { type: String },
  },
  { timestamps: false }
);

export const bookModel = model("books", bookSchema);
