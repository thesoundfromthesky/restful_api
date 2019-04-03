import { Post } from "./post";
import { Comment } from "./comment";

export interface Container {
  post: Post;
  comments: Comment[];
}
