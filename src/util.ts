import jwt from "jsonwebtoken";
import express from "express";

export function successTrue(data: any, message?: string): object {
  return {
    success: true,
    message: message ? message : null,
    errors: null,
    data: data
  };
}

export function successFalse(err?: any, message?: string): object {
  if (!err && !message) message = "data not found";
  return {
    success: false,
    message: message ? message : null,
    errors: err ? parseError(err) : null,
    data: null
  };
}
export function parseError(errors: any): object {
  const parsed: any = {};
  if (errors.name == "ValidationError") {
    for (const name in errors.errors) {
      const validationError = errors.errors[name];
      parsed[name] = { message: validationError.message };
    }
  } else if (errors.code == "11000" && errors.errmsg.indexOf("username") > 0) {
    parsed.username = { message: "This username already exists!" };
  } else {
    parsed.unhandled = errors;
  }
  return parsed;
}

export function isLoggedin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const token: string | string[] | undefined = req.headers["x-access-token"];
  if (!token) res.json(successFalse(null, "token is required!"));
  else {
    jwt.verify(
      token as string,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) return res.json(successFalse(err));
        else {
          (req as any).decoded = decoded;
          return next();
        }
      }
    );
  }
}
// functions
export function getDate(dateObj: Date): any {
  if (dateObj instanceof Date)
    return (
      `${dateObj.getFullYear()}-` +
      `${get2digits(dateObj.getMonth() + 1)}-` +
      `${get2digits(dateObj.getDate())}`
    );
}

export function getTime(dateObj: Date): any {
  if (dateObj instanceof Date)
    return (
      `${get2digits(dateObj.getHours())}:` +
      `${get2digits(dateObj.getMinutes())}:` +
      `${get2digits(dateObj.getSeconds())}`
    );
}

export function get2digits(num: number): string {
  return `0${num}`.slice(-2);
}
