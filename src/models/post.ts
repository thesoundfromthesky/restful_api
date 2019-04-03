import { User } from "./user";

export interface Post {
  title: string;
  author: User;
  postId: number;
  deleted: boolean;
  views: number;
  body: string;
  createdAt?: Date;
  createdDate?: string;
  createdTime?: string;
  updatedAt?: Date;
  updatedDate?: string;
  updatedTime?: string;
}
