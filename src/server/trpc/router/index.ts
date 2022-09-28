import { t } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";

export const appRouter = t.router({
  auth: authRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
