import express from "express";

import * as util from "../util";
import * as commentController from "../controllers/comment-controller";

export const commentRouter: express.Router = express.Router();

commentRouter
  .route("/:id")
  //show
  .get(commentController.show)
  //create
  .post(util.isLoggedin, commentController.create);

commentRouter
  .route("/:id/:commentId")
  //update
  .put(util.isLoggedin, commentController.authGuard, commentController.update)
  //delete
  .delete(
    util.isLoggedin,
    commentController.authGuard,
    commentController.remove
  );
