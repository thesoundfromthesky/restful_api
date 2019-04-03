import express from "express";

import * as counterController from "../controllers/counter-controller";

export const counterRouter: express.Router = express.Router();

counterRouter
  .route("/")
  //show
  .get(counterController.countVisitors);
