import { z } from "zod";
import { t } from "../trpc";

export const postRouter = t.router({
  add: t.procedure.input(z.object({ text: z.string() })).mutation(() => {
    return "AAAA";
  }),
  posts: t.procedure
    .input(
      z.object({ limit: z.number().min(0).max(100), skip: z.number().min(0) })
    )
    .query(({ input }) => {
      return `${input.limit}-${input.skip}`;
    }),
});
