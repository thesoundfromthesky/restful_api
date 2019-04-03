import express from "express";

import * as util from "../util";
import * as userController from "../controllers/user-controller";

export const userRouter: express.Router = express.Router();

userRouter
  .route("/")
  .get(util.isLoggedin, userController.index)
  .post(userController.findLastIndex, userController.create);

// show
userRouter
  .route("/:username")
  .get(util.isLoggedin, userController.show)
  .put(util.isLoggedin, userController.authGuard, userController.update)
  .delete(util.isLoggedin, userController.authGuard, userController.remove);

