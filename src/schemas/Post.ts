import mongoose from "mongoose";

import { Post } from "../models/post";
import * as util from "../util";

const postSchema: mongoose.Schema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    postId: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    title: {
      type: String,
      required: [true, "Title is required!"],
      match: [/^.{1,100}$/, "Should be less than 100 characters!"],
      trim: true
    },
    body: {
      type: String,
      required: [true, "Body is required!"],
      trim: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  },
  { toJSON: { virtuals: true }, id: false }
);

// virtuals // 3
postSchema.virtual("createdDate").get(function(this: any) {
  return util.getDate(this.createdAt);
});

postSchema.virtual("createdTime").get(function(this: any) {
  return util.getTime(this.createdAt);
});

postSchema.virtual("updatedDate").get(function(this: any) {
  return util.getDate(this.updatedAt);
});

postSchema.virtual("updatedTime").get(function(this: any) {
  return util.getTime(this.updatedAt);
});

export const postDocument: mongoose.Model<Post & mongoose.Document> =
  mongoose.models.post ||
  mongoose.model<Post & mongoose.Document>("post", postSchema);
