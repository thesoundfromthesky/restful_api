import * as express from "express";
import { App } from "./server";

const app: express.Application = new App().app;

export { app };
