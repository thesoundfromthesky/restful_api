import express from "express";

import * as util from "../util";
import { userDocument } from "../schemas/User";

export async function create(
  req: express.Request,
  res: express.Response
): Promise<any> {
  req.body._id = undefined;
  req.body.userId = res.locals.lastId + 1;
  req.body.createdAt = undefined;
  req.body.updatedAt = undefined;
  req.body.deleted = undefined;
  const newUser = new userDocument(req.body);
  try {
    const user = await newUser.save();
    if (!user) return res.json(util.successFalse());
    return res.json(util.successTrue(user));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function index(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const users = await userDocument
      .find({
        deleted: false
      })
      .sort({ username: 1 })
      .exec();
    if (!users.length) return res.json(util.successFalse());
    return res.json(util.successTrue(users));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function show(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const user = await userDocument.findOne({
      username: req.params.username
    });
    if (!user || user.deleted) return res.json(util.successFalse());
    return res.json(util.successTrue(user));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

// update
export async function update(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const user: any = await userDocument
      .findOne({ username: req.params.username })
      .select({ password: 1 });
    if (!user || user.deleted) {
      return res.json(util.successFalse());
    }
    // update user object
    user.originalPassword = user.password;
    user.password = req.body.newPassword ? req.body.newPassword : user.password;

    for (const p in req.body) {
      if (p === "username") continue;
      else if (p === "_id") continue;
      else if (p === "createdAt") continue;
      else if (p === "updatedAt") continue;
      else if (p === "deleted") continue;
      user[p] = req.body[p];
    }

    user.updatedAt = Date.now();
    const savedUser = await user.save();
    if (!savedUser) return res.json(util.successFalse());
    savedUser.password = undefined;
    return res.json(util.successTrue(savedUser));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}
// destroy
export async function remove(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const user = await userDocument
      //   .findOneAndRemove({ username: req.params.username })
      .findOne({ username: req.params.username });
    if (!user || user.deleted) return res.json(util.successFalse());
    user.deleted = true;
    const savedUser = await user.save();
    if (!savedUser) return res.json(util.successFalse());
    return res.json(util.successTrue(null, "delete success"));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function findLastIndex(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const user = await userDocument.findOne({}).sort({ userId: -1 });
    if (!user) res.locals.lastId = 0;
    else res.locals.lastId = user.userId;
    return next();
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function authGuard(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const user = await userDocument.findOne({ username: req.params.username });
    if (!user || user.deleted) return res.json(util.successFalse());
    else if (!(req as any).decoded || user._id != (req as any).decoded._id) {
      return res.json(util.successFalse(null, "You don't have permission"));
    } else return next();
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}
