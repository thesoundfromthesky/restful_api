import express from "express";
import jwt from "jsonwebtoken";

import * as util from "../util";
import { userDocument } from "../schemas/User";

export function loginValidation(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  let isValid: boolean = true;
  const validationError = {
    name: "ValidationError",
    errors: {} as any
  };

  if (!req.body.username) {
    isValid = false;
    validationError.errors.username = { message: "Username is required!" };
  }
  if (!req.body.password) {
    isValid = false;
    validationError.errors.password = { message: "Password is required!" };
  }

  if (!isValid) res.json(util.successFalse(validationError));
  else {
    next();
  }
}

export async function login(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const user: any = await userDocument
      .findOne({ username: req.body.username })
      .select({ password: 1, username: 1, name: 1, email: 1 });
    if (!user || user.deleted || !user.authenticate(req.body.password))
      res.json(util.successFalse(null, "Username or Password is invalid"));
    else {
      const payload = {
        _id: user._id,
        username: user.username
      };
      const secretOrPrivateKey = process.env.JWT_SECRET;
      const options = { expiresIn: 60 * 60 * 24 };
      jwt.sign(payload, secretOrPrivateKey as string, options, (err, token) => {
        if (err) return res.json(util.successFalse(err));
        return res.json(util.successTrue(token));
      });
    }
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function me(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const user = await userDocument.findById((req as any).decoded._id);
    if (!user || user.deleted) return res.json(util.successFalse());
    return res.json(util.successTrue(user));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function refresh(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const user = await userDocument.findById((req as any).decoded._id);
    if (!user || user.deleted) res.json(util.successFalse());
    else {
      const payload = {
        _id: user._id,
        username: user.username
      };
      const secretOrPrivateKey = process.env.JWT_SECRET;
      const options = { expiresIn: 60 * 60 * 24 };
      jwt.sign(payload, secretOrPrivateKey as string, options, (err, token) => {
        if (err) return res.json(util.successFalse(err));
        return res.json(util.successTrue(token));
      });
    }
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}
