import { t } from "../trpc";
import { exampleRouter } from "./example";

export const appRouter = t.router({
  default: exampleRouter,
});

export type AppRouter = typeof appRouter;
