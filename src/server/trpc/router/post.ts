import { z } from "zod";
import { t } from "../trpc";

export const postRouter = t.router({
  posts: t.procedure
    .input(
      z.object({ limit: z.number().min(0).max(100), skip: z.number().min(0) })
    )
    .query(async ({ input }) => {
      console.log({ input });

      return "dd";
    }),
});
