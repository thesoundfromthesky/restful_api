import express from "express";

import * as util from "../util";
import * as authController from "../controllers/auth-controller";

export const authRouter: express.Router = express.Router();

authRouter
  .route("/login")
  .post(authController.loginValidation, authController.login);

// me
authRouter.route("/me").get(util.isLoggedin, authController.me);

// refresh
authRouter.route("/refresh").get(util.isLoggedin, authController.refresh);
