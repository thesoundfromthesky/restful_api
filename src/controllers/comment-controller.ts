import express from "express";

import * as util from "../util";
import { containerDocument } from "../schemas/Container";

export async function create(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const container = await containerDocument
      .findOne({ post: req.params.id })
      .populate("post", "deleted");
    if (!container || container.post.deleted)
      return res.json(util.successFalse());
    req.body._id = undefined;
    req.body.name = (req as any).decoded._id;
    req.body.deleted = undefined;
    req.body.createdAt = undefined;
    container.comments.push(req.body);

    const savedContainer = await container.save();
    if (!savedContainer) return res.json(util.successFalse());
    savedContainer.comments = savedContainer.comments.filter((value: any) => {
      return !value.deleted;
    });
    return res.json(util.successTrue(savedContainer.comments));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function show(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const container = await containerDocument
      .findOne({ post: req.params.id })
      .populate("post", "deleted")
      .populate("comments.name", "username");
    if (!container || container.post.deleted)
      return res.json(util.successFalse());

    container.comments = container.comments.filter((value: any) => {
      return !value.deleted;
    });
    return res.json(util.successTrue(container.comments));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function update(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const container: any = await containerDocument
      .findOne({ post: req.params.id })
      .populate("post", "deleted");
    if (!container || container.post.deleted || !container.comments.length)
      return res.json(util.successFalse());
    for (let i = 0; i < container.comments.length; ++i) {
      if (req.params.commentId == container.comments[i]._id) {
        if (container.comments[i].deleted) {
          return res.json(util.successFalse());
        } else {
          container.comments[i].memo = req.body.memo;
          break;
        }
      }
    }

    const savedContainer = await container.save();
    if (!savedContainer) return res.json(util.successFalse());
    savedContainer.comments = savedContainer.comments.filter((value: any) => {
      return !value.deleted;
    });
    return res.json(util.successTrue(savedContainer.comments));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function remove(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const container: any = await containerDocument
      .findOne({ post: req.params.id })
      .populate("post", "deleted");
    if (!container || container.post.deleted || !container.comments.length)
      return res.json(util.successFalse());
    for (let i = 0; i < container.comments.length; ++i) {
      if (req.params.commentId == container.comments[i]._id) {
        if (container.comments[i].deleted) {
          return res.json(util.successFalse());
        } else {
          container.comments[i].deleted = true;
          break;
        }
      }
    }

    const savedContainer = await container.save();
    if (!savedContainer) return res.json(util.successFalse());
    return res.json(
      util.successTrue({ comments: null }, "comment delete success")
    );
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function authGuard(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> {
  try {
    const container: any = await containerDocument
      .findOne({ post: req.params.id })
      .populate("post");
    if (!container || container.post.deleted || !container.comments.length)
      return res.json(util.successFalse());
    let i;
    for (i = 0; i < container.comments.length; ++i) {
      if (container.comments[i]._id == req.params.commentId) {
        break;
      }
    }
    if (container.comments[i].deleted) return res.json(util.successFalse());
    else if (
      !(req as any).decoded ||
      container.comments[i].name._id != (req as any).decoded._id
    ) {
      return res.json(util.successFalse(null, "You don't have permission"));
    } else {
      return next();
    }
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}
