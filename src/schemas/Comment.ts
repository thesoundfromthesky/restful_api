import mongoose from "mongoose";

import * as util from "../util";

export const commentSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    memo: {
      type: String,
      required: [true, "memo is required!"],
      trim: true
    },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { toJSON: { virtuals: true }, id: false }
);

commentSchema.virtual("createdDate").get(function(this: any) {
  return util.getDate(this.createdAt);
});

commentSchema.virtual("createdTime").get(function(this: any) {
  return util.getTime(this.createdAt);
});

commentSchema.virtual("updatedDate").get(function(this: any) {
  return util.getDate(this.updatedAt);
});

commentSchema.virtual("updatedTime").get(function(this: any) {
  return util.getTime(this.updatedAt);
});
