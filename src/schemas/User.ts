import mongoose from "mongoose";
import bcrypt from "bcrypt-nodejs";
import express from "express";

import { User } from "../models/user";
import * as util from "../util";

const userSchema: mongoose.Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      match: [/^.{4,12}$/, "Should be 4-12 characters!"],
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      select: false
    },
    userId: { type: Number, default: 0 },
    name: {
      type: String,
      required: [true, "Name is required!"],
      match: [/^.{4,12}$/, "Should be 4-12 characters!"],
      trim: true
    },
    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
        "Should be a vaild email address!"
      ],
      trim: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    deleted: { type: Boolean, default: false }
  },
  {
    toJSON: { virtuals: true },
    id: false
  }
);

// virtuals
userSchema
  .virtual("passwordConfirmation")
  .get(function(this: any) {
    return this._passwordConfirmation;
  })
  .set(function(this: any, value: string) {
    this._passwordConfirmation = value;
  });

userSchema
  .virtual("originalPassword")
  .get(function(this: any) {
    return this._originalPassword;
  })
  .set(function(this: any, value: string) {
    this._originalPassword = value;
  });

userSchema
  .virtual("currentPassword")
  .get(function(this: any) {
    return this._currentPassword;
  })
  .set(function(this: any, value: string) {
    this._currentPassword = value;
  });

userSchema
  .virtual("newPassword")
  .get(function(this: any) {
    return this._newPassword;
  })
  .set(function(this: any, value: string) {
    this._newPassword = value;
  });

// password validation
const passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
const passwordRegexErrorMessage: string =
  "Should be minimum 8 characters of alphabet and number combination!";
userSchema.path("password").validate(function(this: any, v: string) {
  const user = this;

  // create user
  if (user.isNew) {
    if (!user.passwordConfirmation) {
      user.invalidate(
        "passwordConfirmation",
        "Password Confirmation is required!"
      );
    }
    if (!passwordRegex.test(user.password)) {
      user.invalidate("password", passwordRegexErrorMessage);
    } else if (user.password !== user.passwordConfirmation) {
      user.invalidate(
        "passwordConfirmation",
        "Password Confirmation does not matched!"
      );
    }
  }

  // update user
  if (!user.isNew) {
    if (!user.currentPassword) {
      user.invalidate("currentPassword", "Current Password is required!");
    }
    if (
      user.currentPassword &&
      !bcrypt.compareSync(user.currentPassword, user.originalPassword)
    ) {
      user.invalidate("currentPassword", "Current Password is invalid!");
    }
    if (user.newPassword && !passwordRegex.test(user.newPassword)) {
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if (user.newPassword !== user.passwordConfirmation) {
      user.invalidate(
        "passwordConfirmation",
        "Password Confirmation does not matched!"
      );
    }
  }
});

// hash password
userSchema.pre("save", function(this: any, next: express.NextFunction) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

// model methods
userSchema.methods.authenticate = function(this: any, password: string) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

userSchema.virtual("createdDate").get(function(this: any) {
  return util.getDate(this.createdAt);
});

userSchema.virtual("createdTime").get(function(this: any) {
  return util.getTime(this.createdAt);
});

userSchema.virtual("updatedDate").get(function(this: any) {
  return util.getDate(this.updatedAt);
});

userSchema.virtual("updatedTime").get(function(this: any) {
  return util.getTime(this.updatedAt);
});

// model & export
export const userDocument: mongoose.Model<User & mongoose.Document> =
  mongoose.models.user ||
  mongoose.model<User & mongoose.Document>("user", userSchema);
