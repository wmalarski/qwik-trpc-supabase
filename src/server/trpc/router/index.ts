import { RequestEvent } from "@builder.io/qwik-city";
import { createContext } from "../context";
import { t } from "../trpc";
import { authRouter } from "./auth";
import { postRouter } from "./post";

export const appRouter = t.router({
  auth: authRouter,
  post: postRouter,
});

export const serverCaller = async (ev: RequestEvent) => {
  const context = await createContext(ev);
  return appRouter.createCaller(context);
};

export type AppRouter = typeof appRouter;
