import express from "express";

import * as util from "../util";
import * as postController from "../controllers/post-controller";

export const postRouter: express.Router = express.Router();

postRouter
  .route("/")
  //index
  .get(postController.index)
  //create
  .post(util.isLoggedin, postController.findLastIndex, postController.create);

postRouter
  .route("/:id")
  //show
  .get(postController.show)
  //update
  .put(util.isLoggedin, postController.authGuard, postController.update)
  //delete
  .delete(util.isLoggedin, postController.authGuard, postController.remove);
