import { User } from "./user";

export interface Comment {
  name: User;
  memo: string;
  deleted: boolean;
  createdAt: Date;
}
