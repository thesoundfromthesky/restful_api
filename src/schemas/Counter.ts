import mongoose from "mongoose";

import { Counter } from "../models/counter";

export const counterSchema: mongoose.Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    totalCount: {
      type: Number,
      required: true
    },
    todayCount: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
);

export const counterDocument: mongoose.Model<Counter & mongoose.Document> =
  mongoose.models.counter ||
  mongoose.model<Counter & mongoose.Document>("counter", counterSchema);