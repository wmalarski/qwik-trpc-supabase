import { z } from "zod";
import { t } from "../trpc";

export const postRouter = t.router({
  posts: t.procedure
    .input(
      z.object({ limit: z.number().min(0).max(100), skip: z.number().min(0) })
    )
    .query(async ({ input }) => {
      return `${input.limit}-${input.skip}`;
    }),
  add: t.procedure.input(z.object({ text: z.string() })).mutation(async () => {
    return "AAAA";
  }),
});
