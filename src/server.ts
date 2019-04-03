import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import { authRouter } from "./api/auth";
import { userRouter } from "./api/users";
import { postRouter } from "./api/posts";
import { commentRouter } from "./api/comments";
import { counterRouter } from "./api/counters";

export class App {
  private _app!: express.Application;

  get app(): express.Application {
    return this._app;
  }

  constructor(private port: number | string = 3000) {
    this.init();
  }

  private init(): void {
    this.createApp();
    this.connectMongoDb();
    this.config();
    this.registerRouter();
    this.listen();
  }

  private createApp(): void {
    this._app = express();
  }

  private async connectMongoDb(): Promise<any> {
    try {
      await mongoose.connect(process.env.MONGO_DB as string, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
      return console.log("DB connected");
    } catch (err) {
      return console.log("DB ERROR : ", err);
    }
  }

  private config(): void {
    this.port = process.env.PORT || this.port;
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        res.header(
          "Access-Control-Allow-Headers",
          "Content-Type, x-access-token"
        );
        next();
      }
    );
  }

  private registerRouter(): void {
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/users", userRouter);
    this.app.use("/api/posts", postRouter);
    this.app.use("/api/comments", commentRouter);    
    this.app.use("/api/counters", counterRouter);
  }

  listen(): void {
    this.app.listen(this.port, () =>
      console.log(`Server on port ${this.port}`)
    );
  }
}
