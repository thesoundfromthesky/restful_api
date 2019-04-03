import express from "express";

import * as util from "../util";
import { postDocument } from "../schemas/Post";
import { containerDocument } from "../schemas/Container";

export async function create(
  req: express.Request,
  res: express.Response
): Promise<any> {
  req.body.author = (req as any).decoded._id;
  req.body.postId = res.locals.lastId + 1;
  req.body._id = undefined;
  req.body.views = undefined;
  req.body.deleted = undefined;
  req.body.createdAt = undefined;
  req.body.updatedAt = undefined;
  const newPost = new postDocument(req.body);

  try {
    const post = await newPost.save();
    if (!post) return res.json(util.successFalse());
    const container = await containerDocument.create({ post: post._id });
    return console.log("creating container success", container);
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function index(
  req: express.Request,
  res: express.Response
): Promise<any> {
  const page: number = Math.max(1, req.query.page);
  const limit: number = Math.max(10, req.query.limit);
  const maxLimit: number = 50;

  try {
    const count = await postDocument.countDocuments({ deleted: false });

    if (!count) {
      return res.json(util.successTrue([{ maxPage: 0 }], "empty data"));
    } else if (isNaN(limit))
      return res.json(util.successFalse(null, "limit query NaN"));
    else if (maxLimit < limit)
      return res.json(
        util.successFalse(null, `limit exceeds max : ${maxLimit}`)
      );
    const skip: number = (page - 1) * limit;
    const maxPage: number = Math.ceil(count / limit);

    const posts = await postDocument
      .find({
        deleted: false
      })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("author")
      .exec();

    if (!posts) return res.json(util.successFalse());
    else if (isNaN(page))
      return res.json(util.successFalse(null, "page is NaN"));
    else if (maxPage < page)
      return res.json(util.successFalse(null, `page exceeds max : ${maxPage}`));

    (posts as any).push({ maxPage: maxPage });
    return res.json(util.successTrue(posts));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function show(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const post = await postDocument
      .findOne({ _id: req.params.id })
      .populate("author");

    if (!post || post.deleted) {
      return res.json(util.successFalse());
    }
    ++post.views;

    const savedPost = await post.save();
    if (!savedPost) return res.json(util.successFalse());
    return res.json(util.successTrue(savedPost));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function update(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const post: any = await postDocument.findOne({ _id: req.params.id });
    if (!post || post.deleted) return res.json(util.successFalse());
    for (const p in req.body) {
      if (p === "postId") continue;
      if (p === "_id") continue;
      else if (p === "views") continue;
      else if (p === "createdAt") continue;
      else if (p === "updatedAt") continue;
      else if (p === "deleted") continue;
      else if (p === "author") continue;
      post[p] = req.body[p];
    }
    post.updatedAt = Date.now();

    const savedPost = await post.save();
    if (!savedPost) return res.json(util.successFalse());
    return res.json(util.successTrue(savedPost));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function remove(
  req: express.Request,
  res: express.Response
): Promise<any> {
  try {
    const post = await postDocument.findOne({ _id: req.params.id });
    if (!post || post.deleted) return res.json(util.successFalse());
    post.deleted = true;

    const savedPost = await post.save();
    if (!savedPost) return res.json(util.successFalse());
    return res.json(util.successTrue(null, "delete success"));
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}

export async function findLastIndex(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> {
  try {
    const post = await postDocument.findOne({}).sort({ postId: -1 });
    if (!post) res.locals.lastId = 0;
    else res.locals.lastId = post.postId;
    return next();
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
    const post: any = await postDocument.findOne({ _id: req.params.id });
    if (!post || post.deleted) return res.json(util.successFalse());
    else if (
      !(req as any).decoded ||
      post.author._id != (req as any).decoded._id
    ) {
      return res.json(util.successFalse(null, "You don't have permission"));
    } else {
      return next();
    }
  } catch (err) {
    return res.json(util.successFalse(err));
  }
}
