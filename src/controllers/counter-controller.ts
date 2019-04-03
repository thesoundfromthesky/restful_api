import express from "express";

import * as util from "../util";
import { counterDocument } from "../schemas/Counter";

export async function countVisitors(
  req: express.Request,
  res: express.Response
): Promise<any> {
  const now = new Date();
  const date =
    now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
  if (date != req.cookies.countDate) {
    res.cookie("countDate", date, { maxAge: 86400000, httpOnly: true });
    try {
      const counter = await counterDocument.findOne({ name: "vistors" });
      if (!counter) {
        counterDocument.create({
          name: "vistors",
          totalCount: 1,
          todayCount: 1,
          date: date
        });
      } else {
        counter.totalCount++;
        if (counter.date == date) {
          counter.todayCount++;
        } else {
          counter.todayCount = 1;
          counter.date = date;
        }

        const savedCounter = await counter.save();
        return res.json(util.successTrue(savedCounter));
      }
    } catch (err) {
      return res.json(util.successFalse(err));
    }
  } else {
    try {
      const counter = await counterDocument.findOne({ name: "vistors" });
      return res.json(util.successTrue(counter));
    } catch (err) {
      return res.json(util.successFalse(err));
    }
  }
}
