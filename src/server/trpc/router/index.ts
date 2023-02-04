import { t } from "../trpc";
import { commentRouter } from "./comments";
import { postRouter } from "./post";

export const appRouter = t.router({
  comment: commentRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
