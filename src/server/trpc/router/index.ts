import { t } from "../trpc";
import { authRouter } from "./auth";

export const appRouter = t.router({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
