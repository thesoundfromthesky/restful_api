import mongoose from "mongoose";

import { Container } from "../models/container";
import { commentSchema } from "./Comment";

export const containerSchema: mongoose.Schema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true
  },
  comments: [commentSchema]
});

export const containerDocument: mongoose.Model<Container & mongoose.Document> =
  mongoose.models.comment ||
  mongoose.model<Container & mongoose.Document>("comment", containerSchema);
